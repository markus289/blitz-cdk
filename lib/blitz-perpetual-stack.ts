import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as route53 from '@aws-cdk/aws-route53';

interface BlitzPerpetualStackProps extends cdk.StackProps {
  dnsDomain: string,
  dnsHost: string
}

export class BlitzPerpetualStack extends cdk.Stack {
  public readonly certificate: acm.Certificate;
  public readonly gitRepository: codecommit.Repository;

  constructor(scope: cdk.Construct, id: string, props: BlitzPerpetualStackProps) {
    super(scope, id, props);

    //
    // request an HTTPS certificate
    //
    const zone = route53.HostedZone.fromLookup(this, 'zone', {
      domainName: props.dnsDomain
    });

    this.certificate = new acm.Certificate(this, 'cert', {
      domainName: `${props.dnsHost}.${props.dnsDomain}`,
      validation: acm.CertificateValidation.fromDns(zone)
    });

    //
    // git repository that shall contain the code of the Blitz.js app
    //
    this.gitRepository = new codecommit.Repository(this, 'gitRepository', {
      repositoryName: 'blitz-app'
    });
  }
}
