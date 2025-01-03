import { Queue } from 'bullmq';
import redisConfig from '../config/redis';

const notificationQueue = new Queue('notifications', {
  connection: redisConfig,
});

export default notificationQueue;