import app from './app';
import './workers/notificationWorker'; 
import { initSocket } from './utils/socket';
import { logger } from './utils/logger';
import http from 'http';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  logger(null, null, `Server is running on http://localhost:${PORT}`);
  
});
