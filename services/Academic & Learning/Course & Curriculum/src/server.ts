import fs from 'fs';
import https from 'https';
import app from './app';
import config from './config/config';

if (config.ssl && config.ssl.key && config.ssl.cert) {
  const options = {
    key: fs.readFileSync(config.ssl.key),
    cert: fs.readFileSync(config.ssl.cert),
    ca: fs.readFileSync(config.ssl.ca),
    requestCert: true,
    rejectUnauthorized: true
  };

  https.createServer(options, app).listen(config.port, () => {
    console.log(`HTTPS Server (mTLS) running on port ${config.port}`);
  });
} else {
  app.listen(config.port, () => {
    console.log(`HTTP Server running on port ${config.port}`);
  });
}