#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EchoClassStack } from '../lib/echoclass-stack.js';

const app = new cdk.App();

const environmentName = app.node.tryGetContext('environment') ?? process.env.ECHOCLASS_ENV ?? 'dev';
const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION ?? process.env.AWS_REGION ?? 'ap-south-1';

new EchoClassStack(app, `EchoClass-${environmentName}`, {
  env: { account, region },
  environmentName,
  description: `EchoClass ${environmentName} infrastructure`,
});
