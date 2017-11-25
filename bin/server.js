const http = require('http');
const app = require('../src/app');

let server = http.createServer(app);

server.listen(3000);