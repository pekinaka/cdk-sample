import * as ec2 from 'aws-cdk-lib/aws-ec2';

// 環境ごとの設定値
export interface EnvironmentConfig {
  envName: string;
  vpcCidr: string;
  natGateways: number;
  instanceType: ec2.InstanceType;
}

// dev環境
export const devConfig: EnvironmentConfig = {
  envName: 'Dev',
  vpcCidr: '10.0.0.0/16',
  natGateways: 1,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
};

// prod環境
export const prodConfig: EnvironmentConfig = {
  envName: 'Prod',
  vpcCidr: '10.1.0.0/16',
  natGateways: 2,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),
};
