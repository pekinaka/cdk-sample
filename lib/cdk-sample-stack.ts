import * as cdk from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class CdkSampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC（パブリック/プライベートサブネット、2AZ、NAT Gateway 1つ）
    const vpc = new ec2.Vpc(this, 'SampleVpc', {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    // セキュリティグループ（SSH許可）
    const sg = new ec2.SecurityGroup(this, 'SampleSg', {
      vpc,
      description: 'Allow SSH access',
      allowAllOutbound: true,
    });
    sg.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allow SSH from anywhere'
    );

    // EC2インスタンス（Amazon Linux 2023、t3.micro、パブリックサブネット）
    new ec2.Instance(this, 'SampleInstance', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      securityGroup: sg,
    });

    // S3バケット
    new s3.Bucket(this, 'SampleBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,  // スタック削除時にバケットも削除
      autoDeleteObjects: true,                    // バケット内のオブジェクトも自動削除
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(7),       // 7日経過したオブジェクトを自動削除
        },
      ],
    });
  }
}
