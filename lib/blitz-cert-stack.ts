import * as cdk from '@aws-cdk/core';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as route53 from '@aws-cdk/aws-route53';

interface BlitzCertStackProps extends cdk.StackProps {
  domain: string,
  host: string
}

export class BlitzCertStack extends cdk.Stack {
  public readonly certificate: acm.Certificate;

  constructor(scope: cdk.Construct, id: string, props: BlitzCertStackProps) {
    super(scope, id, props);

    const zone = route53.HostedZone.fromLookup(this, 'zone', {
      domainName: props.domain
    });

    this.certificate = new acm.Certificate(this, 'cert', {
      domainName: `${props.host}.${props.domain}`,
      validation: acm.CertificateValidation.fromDns(zone)
    });
  }
}
