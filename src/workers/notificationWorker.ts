import { Worker } from 'bullmq';
import redisConfig from '../config/redis';

const worker = new Worker(
  'notifications',
  async (job) => {
    const { userId, message } = job.data;
    console.log(`Sending notification to user ${userId}: ${message}`);
    // Yahan aap actual notification send kar sakte hain (e.g., email, SMS, push notification)
  },
  { connection: redisConfig }
);

worker.on('completed', (job) => {
  console.log(`Notification sent for job ${job.id}`);
});

worker.on('failed', (job, err) => {
  console.error(`Notification failed for job ${job?.id}:`, err);
});