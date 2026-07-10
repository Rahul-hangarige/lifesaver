const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/blood/available/O%2B', // O+ URL encoded
  method: 'GET',
  timeout: 5000
};

console.log('Sending GET request to', options.hostname + ':' + options.port + options.path);
const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers, null, 2)}`);
  res.setEncoding('utf8');
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('BODY:', data);
  });
});

req.on('timeout', () => {
  console.log('Request timed out after 5s');
  req.destroy();
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
