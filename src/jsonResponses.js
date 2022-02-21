const schedules = {};

const respondJSON = (request, response, status, obj) => {
  const jsonString = JSON.stringify(obj);

  response.writeHead(status, { 'Content-Type': 'application/json' });

  if (request.method !== 'HEAD') {
    response.write(jsonString);
  }

  response.end();
};

const notFound = (request, response) => {
  const errorObj = {
    message: 'the page you were looking for couldnt be found',
    id: 'notFound',
  };

  respondJSON(request, response, 404, errorObj);
};

const postSchedule = (request, response, body, name) => {
  if (name) {
    const errorObj = {
      message: 'this schedule needs a name',
      id: 'missingParams',
    };

    respondJSON(request, response, 400, errorObj);
    return;
  }

  const resObj = { message: 'schedule updated' };
  let status = 204;

  if (!schedules[name]) {
    resObj.message = 'new schedule created';
    status = 201;
  }

  schedules[name] = body;

  respondJSON(request, response, status, resObj);
};

module.exports = {
  postSchedule,
  notFound
};
