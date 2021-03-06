const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const gettableURLs = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getStyle,
  '/normalize.css': htmlHandler.getNorm,
  '/skeleton.css': htmlHandler.getSkel,
  '/bootstrap.css': htmlHandler.getBoot,
  '/getSchedule': jsonHandler.getSchedule,
  '/notFound': jsonHandler.notFound,
};

const postableURLs = {
  '/postSchedule': jsonHandler.postSchedule,
};

const handlePost = (request, response, parsedURL) => {
  if (!postableURLs[parsedURL.pathname]) {
    jsonHandler.notFound(request, response);
    return;
  }

  const body = [];

  request.on('error', (err) => {
    console.log(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(parsedURL.query);
    postableURLs[parsedURL.pathname](request, response, bodyString, bodyParams.name);
  });
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);

  console.log(parsedURL.pathname);

  switch (request.method) {
    case 'GET':
    case 'HEAD':
      if (gettableURLs[parsedURL.pathname]) {
        gettableURLs[parsedURL.pathname](request, response);
        break;
      }
      jsonHandler.notFound(request, response);
      break;
    case 'POST':
      handlePost(request, response, parsedURL);
      break;
    default:
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`server is listening to 127.0.0.1:${port}`);
});
