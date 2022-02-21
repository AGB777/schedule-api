const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const norm = fs.readFileSync(`${__dirname}/../client/normalize.css`);
const skel = fs.readFileSync(`${__dirname}/../client/skeleton.css`);
const boot = fs.readFileSync(`${__dirname}/../client/bootstrap.css`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getStyle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
};

const getNorm = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(norm);
  response.end();
};

const getSkel = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(skel);
  response.end();
};

const getBoot = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(boot);
  response.end();
};

module.exports = {
  getIndex,
  getStyle,
  getNorm,
  getSkel,
  getBoot,
};
