#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { NetworkStack } from '../lib/network-stack';
import { AppStack } from '../lib/app-stack';
import { devConfig, prodConfig } from '../lib/config';

const app = new cdk.App();

// Dev環境
const devNetwork = new NetworkStack(app, `${devConfig.envName}-NetworkStack`, {
  config: devConfig,
});
const devApp = new AppStack(app, `${devConfig.envName}-AppStack`, {
  vpc: devNetwork.vpc,
  config: devConfig,
});
cdk.Tags.of(devNetwork).add('Environment', devConfig.envName);
cdk.Tags.of(devApp).add('Environment', devConfig.envName);

// Prod環境
const prodNetwork = new NetworkStack(app, `${prodConfig.envName}-NetworkStack`, {
  config: prodConfig,
});
const prodApp = new AppStack(app, `${prodConfig.envName}-AppStack`, {
  vpc: prodNetwork.vpc,
  config: prodConfig,
});
cdk.Tags.of(prodNetwork).add('Environment', prodConfig.envName);
cdk.Tags.of(prodApp).add('Environment', prodConfig.envName);
