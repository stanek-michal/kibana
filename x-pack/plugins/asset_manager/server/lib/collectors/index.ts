/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { estypes } from '@elastic/elasticsearch';
import { ElasticsearchClient } from '@kbn/core/server';
import { AssetManagerConfig } from '../../types';
import { Asset } from '../../../common/types_api';

export const QUERY_MAX_SIZE = 10000;

export type Collector = (opts: CollectorOptions) => Promise<CollectorResult>;

export interface CollectorOptions {
  client: ElasticsearchClient;
  from: number;
  to: number;
  sourceIndices: AssetManagerConfig['sourceIndices'];
  afterKey?: estypes.SortResults;
}

export interface CollectorResult {
  assets: Asset[];
  afterKey?: estypes.SortResults;
}

export { collectContainers } from './containers';
export { collectHosts } from './hosts';
export { collectPods } from './pods';
export { collectServices } from './services';
