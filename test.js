const FormData = require('form-data');
const fs = require('fs');
const http = require('http');

const form = new FormData();
form.append('file', fs.createReadStream('C:/Users/chenx/Documents/wt/DHL/Solution/DHL_AutoSOP_Bot/input/shipping.txt'), {
  contentType: 'application/octet-stream' // simulate UiPath missing content type
});
form.append('UiPath Bot', 'sourceType'); // simulate UiPath backward params

const request = http.request({
  method: 'POST',
  host: 'localhost',
  port: 3000,
  path: '/ingest',
  headers: form.getHeaders()
});

form.pipe(request);

request.on('response', function(res) {
  let data = '';
  res.on('data', function(chunk) {
    data += chunk;
  });
  res.on('end', function() {
    console.log('Status Code:', res.statusCode);
    console.log('Body:', data);
  });
});
