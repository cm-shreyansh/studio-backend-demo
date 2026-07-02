import config from '../config/mediasoup.ts';
import * as mediasoup from 'mediasoup';

export function createWorker() {
  return mediasoup.createWorker(config.workerConfig);
}
