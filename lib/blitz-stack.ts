import * as acm from '@aws-cdk/aws-certificatemanager';
import * as alias from '@aws-cdk/aws-route53-targets';
import * as cdk from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as route53 from '@aws-cdk/aws-route53';

interface BlitzStackProps extends cdk.StackProps {
  certificate: acm.Certificate,
  dnsDomain: string,
  dnsHost: string,
  gitRepository: codecommit.Repository
}

export class BlitzStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: BlitzStackProps) {
    super(scope, id, props);

    //
    // Virtual Private Cloud (i.e. networking)
    //
    const vpc = new ec2.Vpc(this, 'vpc', {
      subnetConfiguration: [
        { name: 'Public', subnetType: ec2.SubnetType.PUBLIC }
      ]
    });

    //
    // Elastic Container Service (i.e. running the container)
    //
    const cluster = new ecs.Cluster(this, 'cluster', {
      vpc: vpc
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'task-definition', {
      memoryLimitMiB: 512,
      cpu: 256
    });

    const container = taskDefinition.addContainer("container", {
      // FIXME add real image
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample")
    });
    container.addPortMappings({ containerPort: 80 });

    // FIXME enable scaling at some later stage
    const service = new ecs.FargateService(this, 'service', {
      cluster: cluster,
      taskDefinition: taskDefinition
    });

    //
    // Elastic Load Balancer
    //
    const lb = new elbv2.ApplicationLoadBalancer(this, 'load-balancer', {
      vpc: vpc,
      internetFacing: true
    });

    const listenerHttps = lb.addListener('listener-https', {
      protocol: elbv2.ApplicationProtocol.HTTPS,
      certificates: [props.certificate]
    });

    listenerHttps.addTargets('target-group', {
      protocol: elbv2.ApplicationProtocol.HTTP,
      port: 80,
      targets: [service]
    });

    lb.addListener('listener-http', {
      protocol: elbv2.ApplicationProtocol.HTTP,
      port: 80,
      defaultAction: elbv2.ListenerAction.redirect({
        protocol: elbv2.ApplicationProtocol.HTTPS,
        port: '443',
        permanent: true
      })
    });

    const zone = route53.HostedZone.fromLookup(this, 'zone', {
      domainName: props.dnsDomain
    });

    new route53.ARecord(this, 'load-balancer-a-record', {
      zone: zone,
      recordName: props.dnsHost,
      target: route53.RecordTarget.fromAlias(new alias.LoadBalancerTarget(lb))
    });

    // FIXME AAAA record, currently the VPC has no IPv6 connectivity, needs
    // support from AWS CDK
  }
}
