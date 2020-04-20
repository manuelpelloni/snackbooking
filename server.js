const http = require('http');
const app = require('./app');
const db = require('./database');

const port = process.env.PORT || 3000;


const server = http.createServer(app);
server.listen(port, () => {
  console.log('server started on port ', port);
});

