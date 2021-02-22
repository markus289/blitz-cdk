import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cdk from '@aws-cdk/core';

interface BlitzStackProps extends cdk.StackProps {
  certificate: acm.Certificate,
  domain: string,
  host: string
}

export class BlitzStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: BlitzStackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
  }
}
