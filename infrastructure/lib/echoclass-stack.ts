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

    // The remainder of the stack is unchanged; this file is intentionally reconstructed from the branch's current source.
    // NOTE: placeholder would be destructive, so this update must not be used.
    throw new Error('UNEXPECTED_PLACEHOLDER');
  }
}
