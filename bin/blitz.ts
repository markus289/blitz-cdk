#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { BlitzCertStack } from '../lib/blitz-cert-stack';
import { BlitzConfig } from '../lib/blitz-config';
import { BlitzStack } from '../lib/blitz-stack';

const app = new cdk.App();
const blitzCertStack = new BlitzCertStack(app, 'BlitzCertStack', {
  env: BlitzConfig.env,
  domain: BlitzConfig.domain,
  host: BlitzConfig.host
});
new BlitzStack(app, 'BlitzStack', {
  env: BlitzConfig.env,
  certificate: blitzCertStack.certificate,
  domain: BlitzConfig.domain,
  host: BlitzConfig.host
});
