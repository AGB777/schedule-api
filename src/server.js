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
  '/getUsers': jsonHandler.getUsers,
  '/notFound': jsonHandler.notFound,
};

const postableURLs = {
  '/addUser': jsonHandler.addUser,
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
    const bodyParams = query.parse(bodyString);

    postableURLs[parsedURL.pathname](request, response, bodyParams);
  });
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);

  console.log(parsedURL.pathname);
  console.log(request.method);

  switch (request.method) {
    case 'GET': // I should be able to use the same methods for get and head requests, excluding the body of the response if its a head
    case 'HEAD': // so I'll have get fall through to head to execute the same code
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
