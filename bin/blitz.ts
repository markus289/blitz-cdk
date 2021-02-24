#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { BlitzConfig } from '../lib/blitz-config';
import { BlitzPerpetualStack } from '../lib/blitz-perpetual-stack';
import { BlitzStack } from '../lib/blitz-stack';

const app = new cdk.App();
const blitzPerpetualStack = new BlitzPerpetualStack(app, 'BlitzPerpetualStack', {
  env: BlitzConfig.env,
  dnsDomain: BlitzConfig.dnsDomain,
  dnsHost: BlitzConfig.dnsHost
});
new BlitzStack(app, 'BlitzStack', {
  env: BlitzConfig.env,
  certificate: blitzPerpetualStack.certificate,
  dnsDomain: BlitzConfig.dnsDomain,
  dnsHost: BlitzConfig.dnsHost,
  gitRepository: blitzPerpetualStack.gitRepository
});
