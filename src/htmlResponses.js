const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);


const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-type': 'text/html' });

  response.write(index);

  response.end();
};

const getStyle = (request, response) => {
  response.writeHead(200, { 'Content-type': 'text/css' });

  response.write(style);

  response.end();
};


module.exports.getIndex = getIndex;
module.exports.getStyle = getStyle;

