const http = require('http');
const options = { hostname: 'localhost', port: 3001, path: '/health', method: 'GET' };

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('status', res.statusCode, 'body', data));
});
req.on('error', (e) => console.error('error', e.message));
req.end();
