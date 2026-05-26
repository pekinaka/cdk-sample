#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { NetworkStack } from '../lib/network-stack';
import { AppStack } from '../lib/app-stack';

const app = new cdk.App();

// ネットワーク層
const networkStack = new NetworkStack(app, 'NetworkStack');

// アプリ層（ネットワーク層のVPCを参照）
new AppStack(app, 'AppStack', {
  vpc: networkStack.vpc,
});
