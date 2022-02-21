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
  '/getUsers': jsonHandler.getUsers,
  '/notFound': jsonHandler.notFound,
};

const postableURLs = {
  '/postSchedule': jsonHandler.postSchedule,
};

const handlePost = (request, response, parsedURL) => {
  console.log('posting');
  if (!postableURLs[parsedURL.pathname]) {
    console.log('failing');
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
    console.log('chunking');
  });

  request.on('end', () => {
    console.log('posted');
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(parsedURL.search);
    console.log(bodyString);
    console.log(bodyParams);
    postableURLs[parsedURL.pathname](request, response, bodyString, bodyParams.name);
  });
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);

  console.log(parsedURL.pathname);
  // console.log(request.method);

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
