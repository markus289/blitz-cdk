#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { BlitzStack } from '../lib/blitz-stack';

const app = new cdk.App();
new BlitzStack(app, 'BlitzStack');
