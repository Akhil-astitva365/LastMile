const http = require('http');

const BASE_URL = 'http://localhost:8080/api/v1';

function post(path, body, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };
    if (token) {
      options.headers['Authorization'] = 'Bearer ' + token;
    }
    const req = http.request(options, (res) => {
      let resData = '';
      res.on('data', (chunk) => (resData += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(resData));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${resData}`));
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function testAi() {
  console.log('Testing AI Agent Mode Order Creation...');
  const custAuth = await post('/auth/login', { email: 'customer@demo.com', password: 'password' });
  console.log('Logged in Customer:', custAuth.name);

  try {
    const aiRes = await post('/ai/create-order', {
      prompt: 'Book an urgent 8kg package 50x40x30cm from Bhopal 462001 to Indore 452001 COD'
    }, custAuth.token);
    console.log('AI Customer Result:', aiRes);
  } catch (err) {
    console.error('AI Customer Error:', err.message);
  }

  console.log('\nTesting AI Agent Mode for Admin...');
  const adminAuth = await post('/auth/login', { email: 'admin@demo.com', password: 'password' });
  console.log('Logged in Admin:', adminAuth.name);

  try {
    const aiAdminRes = await post('/ai/create-order', {
      prompt: 'Create a 12kg B2B enterprise shipment from Bengaluru 560001 to Chennai 600001'
    }, adminAuth.token);
    console.log('AI Admin Result:', aiAdminRes);
  } catch (err) {
    console.error('AI Admin Error:', err.message);
  }
}

testAi();
