import * as cdk from 'aws-cdk-lib';
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
