import * as cdk from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { EnvironmentConfig } from './config';

interface AppStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  config: EnvironmentConfig;
}

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const { vpc, config } = props;

    // セキュリティグループ（SSH許可）
    const sg = new ec2.SecurityGroup(this, 'AppSg', {
      vpc,
      securityGroupName: `${config.envName}-AppSg`,
      description: 'Allow SSH access',
      allowAllOutbound: true,
    });
    sg.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allow SSH from anywhere'
    );

    // EC2インスタンス（環境ごとにインスタンスタイプが異なる）
    new ec2.Instance(this, 'AppInstance', {
      vpc,
      instanceName: `${config.envName}-AppInstance`,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      instanceType: config.instanceType,
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      securityGroup: sg,
    });

    // S3バケット
    new s3.Bucket(this, 'AppBucket', {
      bucketName: `${config.envName.toLowerCase()}-app-bucket-590183940496`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(7),
        },
      ],
    });
  }
}
