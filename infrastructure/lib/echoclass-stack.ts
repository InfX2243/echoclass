import * as cdk from 'aws-cdk-lib';
import { aws_cloudfront as cloudfront, aws_dynamodb as dynamodb, aws_s3 as s3 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface EchoClassStackProps extends cdk.StackProps {
  environmentName: string;
}

export class EchoClassStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EchoClassStackProps) {
    super(scope, id, props);

    const { environmentName } = props;

    this.templateOptions.metadata = {
      Environment: environmentName,
      Project: 'EchoClass',
    };

    const applicationTable = new dynamodb.Table(this, 'ApplicationTable', {
      tableName: `EchoClass-${environmentName}-application`,
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
      removalPolicy: environmentName === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
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
      removalPolicy: environmentName === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: environmentName !== 'prod',
      lifecycleRules: [
        {
          id: 'AbandonedUploads',
          enabled: true,
          prefix: 'uploads/pending/',
          expiration: cdk.Duration.days(7),
        },
      ],
    });

    const mediaOriginAccessControl = new cloudfront.CfnOriginAccessControl(this, 'MediaOriginAccessControl', {
      originAccessControlConfig: {
        name: `EchoClass-${environmentName}-MediaOAC`,
        description: 'CloudFront access to the private EchoClass media bucket',
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
      },
    });

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
            s3OriginConfig: {
              originAccessIdentity: '',
            },
          },
        ],
        defaultCacheBehavior: {
          targetOriginId: 'MediaBucketOrigin',
          viewerProtocolPolicy: 'redirect-to-https',
          allowedMethods: ['GET', 'HEAD'],
          cachedMethods: ['GET', 'HEAD'],
          compress: true,
          forwardedValues: {
            queryString: true,
            cookies: { forward: 'none' },
          },
        },
        restrictions: {
          geoRestriction: { restrictionType: 'none' },
        },
        viewerCertificate: {
          cloudFrontDefaultCertificate: true,
        },
      },
    });

    mediaDistribution.addPropertyOverride(
      'DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity',
      '',
    );

    mediaBucket.addToResourcePolicy(
      new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        principals: [new cdk.aws_iam.ServicePrincipal('cloudfront.amazonaws.com')],
        actions: ['s3:GetObject'],
        resources: [mediaBucket.arnForObjects('*')],
        conditions: {
          StringEquals: {
            'AWS:SourceArn': `arn:${cdk.Aws.PARTITION}:cloudfront::${cdk.Aws.ACCOUNT_ID}:distribution/${mediaDistribution.ref}`,
          },
        },
      }),
    );

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
      description: 'CloudFront distribution ID for private EchoClass media',
      exportName: `${environmentName}-EchoClass-MediaDistributionId`,
    });

    new cdk.CfnOutput(this, 'MediaDistributionDomainName', {
      value: mediaDistribution.attrDomainName,
      description: 'CloudFront distribution domain for private EchoClass media',
      exportName: `${environmentName}-EchoClass-MediaDistributionDomainName`,
    });

    new cdk.CfnOutput(this, 'EnvironmentName', {
      value: environmentName,
      description: 'EchoClass deployment environment',
      exportName: `${environmentName}-EchoClass-Environment`,
    });

    new cdk.CfnOutput(this, 'AwsRegion', {
      value: cdk.Stack.of(this).region,
      description: 'AWS region used by this environment',
      exportName: `${environmentName}-EchoClass-Region`,
    });
  }
}
