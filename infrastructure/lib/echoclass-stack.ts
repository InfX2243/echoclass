import * as fs from 'node:fs';
import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import {
  aws_apigatewayv2 as apigatewayv2,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_dynamodb as dynamodb,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_logs as logs,
  aws_s3 as s3,
  aws_s3_deployment as s3deploy,
  aws_secretsmanager as secretsmanager,
} from 'aws-cdk-lib';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Construct } from 'constructs';

export interface EchoClassStackProps extends cdk.StackProps {
  environmentName: string;
}

export class EchoClassStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EchoClassStackProps) {
    super(scope, id, props);

    const { environmentName } = props;
    const isProduction = environmentName === 'prod';
    const lambdaAssetPath = path.resolve(import.meta.dirname, '../lambda');
    const webDistPath = path.resolve(import.meta.dirname, '../../apps/web/dist');
    const webOrigin =
      this.node.tryGetContext('webOrigin') ?? process.env.ECHOCLASS_WEB_ORIGIN ?? 'http://localhost:5173';
    // API CORS is intentionally restricted to exactly the local Vite app and the deployed web app.
    const deployedWebOrigin = process.env.ECHOCLASS_DEPLOYED_WEB_ORIGIN ?? 'https://ddf9lplgkbhew.cloudfront.net';
    const mediaPublicKey =
      this.node.tryGetContext('mediaPublicKey') ?? process.env.ECHOCLASS_MEDIA_PUBLIC_KEY;
    const mediaSigningSecretArn =
      this.node.tryGetContext('mediaSigningSecretArn') ?? process.env.ECHOCLASS_MEDIA_SIGNING_SECRET_ARN;

    if (!mediaPublicKey || !mediaSigningSecretArn) {
      throw new Error(
        'CloudFront media signing is required. Set ECHOCLASS_MEDIA_PUBLIC_KEY to the PEM public key and ECHOCLASS_MEDIA_SIGNING_SECRET_ARN to the Secrets Manager ARN containing {"privateKey":"..."}.',
      );
    }

    this.templateOptions.metadata = { Environment: environmentName, Project: 'EchoClass' };

    const applicationTable = new dynamodb.Table(this, 'ApplicationTable', {
      tableName: `EchoClass-${environmentName}-application`,
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
      removalPolicy: isProduction ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });
    applicationTable.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: { name: 'GSI1PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'GSI1SK', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });
    applicationTable.addGlobalSecondaryIndex({
      indexName: 'GSI2',
      partitionKey: { name: 'GSI2PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'GSI2SK', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    const mediaBucket = new s3.Bucket(this, 'MediaBucket', {
      bucketName: `echoclass-${environmentName}-media-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      cors: [
        {
          allowedOrigins: ['http://localhost:5173', deployedWebOrigin],
          allowedMethods: [s3.HttpMethods.PUT, s3.HttpMethods.POST],
          allowedHeaders: ['*'],
          exposedHeaders: ['ETag'],
          maxAge: 3000,
        },
      ],
      removalPolicy: isProduction ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: !isProduction,
      lifecycleRules: [
        {
          id: 'AbandonedUploads',
          enabled: true,
          prefix: 'lessons/',
          abortIncompleteMultipartUploadAfter: cdk.Duration.days(1),
        },
      ],
    });

    const mediaOriginAccessControl = new cloudfront.CfnOriginAccessControl(this, 'MediaOriginAccessControl', {
      originAccessControlConfig: {
        name: `EchoClass-${environmentName}-MediaOAC`,
        description: 'CloudFront access to private EchoClass media',
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
      },
    });

    const mediaPublicKeyResource = new cloudfront.CfnPublicKey(this, 'MediaPublicKey', {
      publicKeyConfig: {
        callerReference: `EchoClass-${environmentName}-MediaSigner`,
        name: `EchoClass-${environmentName}-MediaSigner`,
        encodedKey: mediaPublicKey,
        comment: 'Public key used to verify EchoClass private media signed URLs',
      },
    });

    const mediaKeyGroup = new cloudfront.CfnKeyGroup(this, 'MediaKeyGroup', {
      keyGroupConfig: {
        name: `EchoClass-${environmentName}-MediaKeyGroup`,
        comment: 'Trusted signer group for EchoClass private lesson media',
        items: [mediaPublicKeyResource.ref],
      },
    });
    mediaKeyGroup.addDependency(mediaPublicKeyResource);

    const mediaDistribution = new cloudfront.CfnDistribution(this, 'MediaDistribution', {
      distributionConfig: {
        enabled: true,
        comment: `EchoClass ${environmentName} private media delivery`,
        defaultRootObject: '',
        priceClass: 'PriceClass_100',
        origins: [
          {
            id: 'MediaBucketOrigin',
            domainName: mediaBucket.bucketRegionalDomainName,
            originAccessControlId: mediaOriginAccessControl.ref,
            s3OriginConfig: { originAccessIdentity: '' },
          },
        ],
        defaultCacheBehavior: {
          targetOriginId: 'MediaBucketOrigin',
          viewerProtocolPolicy: 'redirect-to-https',
          allowedMethods: ['GET', 'HEAD'],
          cachedMethods: ['GET', 'HEAD'],
          compress: false,
          forwardedValues: {
            queryString: false,
            cookies: { forward: 'none' },
          },
          trustedKeyGroups: [mediaKeyGroup.ref],
        },
        restrictions: { geoRestriction: { restrictionType: 'none' } },
        viewerCertificate: { cloudFrontDefaultCertificate: true },
      },
    });
    mediaDistribution.addDependency(mediaKeyGroup);
    mediaDistribution.addDependency(mediaOriginAccessControl);

    mediaBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
        actions: ['s3:GetObject'],
        resources: [mediaBucket.arnForObjects('*')],
        conditions: {
          StringEquals: {
            'AWS:SourceArn': `arn:${cdk.Aws.PARTITION}:cloudfront::${cdk.Aws.ACCOUNT_ID}:distribution/${mediaDistribution.ref}`,
          },
        },
      }),
    );

    const mediaSigningSecret = secretsmanager.Secret.fromSecretCompleteArn(
      this,
      'MediaSigningSecret',
      mediaSigningSecretArn,
    );

    const webBucket = new s3.Bucket(this, 'WebBucket', {
      bucketName: `echoclass-${environmentName}-web-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      removalPolicy: isProduction ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: !isProduction,
    });

    if (!fs.existsSync(webDistPath)) {
      throw new Error(
        `Web build not found at ${webDistPath}. Run the production Vite build before CDK synth/deploy.`,
      );
    }

    const webDistribution = new cloudfront.Distribution(this, 'WebDistribution', {
      comment: `EchoClass ${environmentName} web application`,
      defaultRootObject: 'index.html',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(webBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0),
        },
      ],
    });

    const corsOrigins = Array.from(new Set(['http://localhost:5173', deployedWebOrigin]));

    new s3deploy.BucketDeployment(this, 'WebDeployment', {
      sources: [s3deploy.Source.asset(webDistPath)],
      destinationBucket: webBucket,
      distribution: webDistribution,
      distributionPaths: ['/*'],
      prune: true,
    });

    const apiLogGroup = new logs.LogGroup(this, 'ApiLogGroup', {
      logGroupName: `/aws/lambda/EchoClass-${environmentName}-api`,
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: isProduction ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });
    const apiHandler = new lambda.Function(this, 'ApiHandler', {
      functionName: `EchoClass-${environmentName}-api`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'api-handler.handler',
      code: lambda.Code.fromAsset(lambdaAssetPath),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      tracing: lambda.Tracing.PASS_THROUGH,
      environment: {
        TABLE_NAME: applicationTable.tableName,
        MEDIA_BUCKET_NAME: mediaBucket.bucketName,
        MEDIA_DISTRIBUTION_DOMAIN: mediaDistribution.attrDomainName,
        MEDIA_SIGNING_SECRET_ARN: mediaSigningSecret.secretArn,
        MEDIA_SIGNING_KEY_PAIR_ID: mediaPublicKeyResource.ref,
        COGNITO_REGION: 'ap-southeast-2',
        COGNITO_USER_POOL_ID: 'ap-southeast-2_pIm3nrBSz',
        COGNITO_APP_CLIENT_ID: '7e0e0adbob78cmgb05ots0pl8k',
      },
      logGroup: apiLogGroup,
    });
    applicationTable.grantReadWriteData(apiHandler);
    mediaBucket.grantReadWrite(apiHandler);
    mediaSigningSecret.grantRead(apiHandler);

    const echoLogGroup = new logs.LogGroup(this, 'EchoApiLogGroup', {
      logGroupName: `/aws/lambda/EchoClass-${environmentName}-echo-api`,
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: isProduction ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });
    const echoHandler = new lambda.Function(this, 'EchoHandler', {
      functionName: `EchoClass-${environmentName}-echo-api`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'echo-handler.handler',
      code: lambda.Code.fromAsset(lambdaAssetPath),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      tracing: lambda.Tracing.PASS_THROUGH,
      environment: {
        TABLE_NAME: applicationTable.tableName,
        COGNITO_REGION: 'ap-southeast-2',
        COGNITO_USER_POOL_ID: 'ap-southeast-2_pIm3nrBSz',
        COGNITO_APP_CLIENT_ID: '7e0e0adbob78cmgb05ots0pl8k',
      },
      logGroup: echoLogGroup,
    });
    applicationTable.grantReadWriteData(echoHandler);

    const httpApi = new apigatewayv2.HttpApi(this, 'HttpApi', {
      apiName: `EchoClass-${environmentName}-api`,
      createDefaultStage: true,
      corsPreflight: {
        allowOrigins: corsOrigins,
        allowMethods: [apigatewayv2.CorsHttpMethod.ANY],
        allowHeaders: ['content-type', 'authorization'],
        allowCredentials: false,
      },
    });

    httpApi.addRoutes({
      path: '/health',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new HttpLambdaIntegration('HealthIntegration', apiHandler),
    });

    const echoIntegration = new HttpLambdaIntegration('EchoIntegration', echoHandler);
    for (const prefix of ['', '/api', '/api/v1']) {
      httpApi.addRoutes({
        path: `${prefix}/echoes`,
        methods: [apigatewayv2.HttpMethod.GET, apigatewayv2.HttpMethod.POST],
        integration: echoIntegration,
      });
      httpApi.addRoutes({
        path: `${prefix}/lessons/{lessonId}/echoes`,
        methods: [apigatewayv2.HttpMethod.GET, apigatewayv2.HttpMethod.POST],
        integration: echoIntegration,
      });
      httpApi.addRoutes({
        path: `${prefix}/lessons/{lessonId}/echoes/{echoId}`,
        methods: [apigatewayv2.HttpMethod.PATCH, apigatewayv2.HttpMethod.DELETE],
        integration: echoIntegration,
      });
    }

    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [apigatewayv2.HttpMethod.ANY],
      integration: new HttpLambdaIntegration('ProtectedIntegration', apiHandler),
    });

    new cdk.CfnOutput(this, 'ApplicationTableName', {
      value: applicationTable.tableName,
      description: 'EchoClass application DynamoDB table name',
      exportName: `${environmentName}-EchoClass-ApplicationTableName`,
    });
    new cdk.CfnOutput(this, 'MediaBucketName', {
      value: mediaBucket.bucketName,
      description: 'EchoClass private media bucket name',
      exportName: `${environmentName}-EchoClass-MediaBucketName`,
    });
    new cdk.CfnOutput(this, 'MediaDistributionId', {
      value: mediaDistribution.ref,
      description: 'CloudFront media distribution ID',
      exportName: `${environmentName}-EchoClass-MediaDistributionId`,
    });
    new cdk.CfnOutput(this, 'MediaDistributionDomainName', {
      value: mediaDistribution.attrDomainName,
      description: 'EchoClass private media CloudFront domain',
      exportName: `${environmentName}-EchoClass-MediaDomain`,
    });
    new cdk.CfnOutput(this, 'MediaKeyGroupId', {
      value: mediaKeyGroup.ref,
      description: 'CloudFront trusted key group for private media',
      exportName: `${environmentName}-EchoClass-MediaKeyGroupId`,
    });
    new cdk.CfnOutput(this, 'MediaPublicKeyId', {
      value: mediaPublicKeyResource.ref,
      description: 'CloudFront public key ID for private media',
      exportName: `${environmentName}-EchoClass-MediaPublicKeyId`,
    });
    new cdk.CfnOutput(this, 'WebBucketName', {
      value: webBucket.bucketName,
      description: 'EchoClass private web asset bucket name',
      exportName: `${environmentName}-EchoClass-WebBucketName`,
    });
    new cdk.CfnOutput(this, 'WebDistributionId', {
      value: webDistribution.distributionId,
      description: 'CloudFront web application distribution ID',
      exportName: `${environmentName}-EchoClass-WebDistributionId`,
    });
    new cdk.CfnOutput(this, 'WebDistributionDomainName', {
      value: webDistribution.distributionDomainName,
      description: 'EchoClass public web application CloudFront domain',
      exportName: `${environmentName}-EchoClass-WebDomain`,
    });
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: httpApi.url!,
      description: 'EchoClass HTTP API URL',
      exportName: `${environmentName}-EchoClass-ApiUrl`,
    });
    new cdk.CfnOutput(this, 'WebOrigin', {
      value: webOrigin,
      description: 'Origin allowed by the API CORS policy',
      exportName: `${environmentName}-EchoClass-WebOrigin`,
    });
    new cdk.CfnOutput(this, 'EnvironmentName', {
      value: environmentName,
      description: 'EchoClass environment',
      exportName: `${environmentName}-EchoClass-Environment`,
    });
    new cdk.CfnOutput(this, 'AwsRegion', {
      value: cdk.Stack.of(this).region,
      description: 'EchoClass AWS region',
      exportName: `${environmentName}-EchoClass-Region`,
    });
  }
}
