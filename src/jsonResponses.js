const url = require('url');
const query = require('querystring');

const schedules = {};

const respondJSON = (request, response, status, resString) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });

  if (request.method !== 'HEAD') {
    response.write(resString);
  }

  response.end();
};

const notFound = (request, response) => {
  const errorObj = {
    message: 'the page you were looking for couldnt be found',
    id: 'notFound',
  };
  const errorString = JSON.stringify(errorObj);
  respondJSON(request, response, 404, errorString);
};

const getSchedule = (request, response) => {
  const targetName = query.parse(url.parse(request.url).query).name;

  if (!targetName || targetName === '') {
    const errorObj = {
      message: 'there is no name to indicate what schedule to retrieve',
      id: 'missingParams',
    };
    const errorString = JSON.stringify(errorObj);
    respondJSON(request, response, 400, errorString);
    return;
  }

  if (!schedules[targetName]) {
    const errorObj = {
      message: 'the indicated schedule couldnt be found',
      id: 'noSchedule',
    };
    const errorString = JSON.stringify(errorObj);
    respondJSON(request, response, 400, errorString);
    return;
  }

  respondJSON(request, response, 200, schedules[targetName]);
};

const postSchedule = (request, response, body, targetName) => {
  if (!targetName || targetName === '') {
    const errorObj = {
      message: 'this schedule needs a name',
      id: 'missingParams',
    };
    const errorString = JSON.stringify(errorObj);
    respondJSON(request, response, 400, errorString);
    return;
  }

  const resObj = { message: 'schedule updated' };
  let status = 204;

  if (!schedules[targetName]) {
    resObj.message = 'new schedule created';
    status = 201;
  }

  schedules[targetName] = body;

  const resString = JSON.stringify(resObj);
  respondJSON(request, response, status, resString);
};

module.exports = {
  postSchedule,
  getSchedule,
  notFound,
};
