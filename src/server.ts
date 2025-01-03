import app from './app';
import './workers/notificationWorker'; 
import { initSocket } from './utils/socket';
import { logger } from './utils/logger';
import http from 'http';
import { testEmailService } from './utils/emailService';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

const startServer = async () => {
  try {
    // Test email service
    await testEmailService();
    
    server.listen(PORT, () => {
      logger(null, null, `Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger(null, null, `Server startup error: ${error}`);
  }
};

startServer();
