import * as cdk from 'aws-cdk-lib';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
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

    new cdk.CfnOutput(this, 'ApplicationTableName', {
      value: applicationTable.tableName,
      description: 'EchoClass application DynamoDB table name',
      exportName: `${environmentName}-EchoClass-ApplicationTableName`,
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
