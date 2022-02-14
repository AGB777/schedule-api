const users = {};

const respondJSON = (request, response, status, obj) => {
  const jsonString = JSON.stringify(obj);

  response.writeHead(status, { 'Content-Type': 'application/json' });

  if (request.method !== 'HEAD') {
    response.write(jsonString);
  }

  response.end();
};

const getUsers = (request, response) => {
  // here i think i ought to pass in {users} and not users
  // i believe prof specifically addressed this in a demo, but i cant remember the reason
  // ill have to test and see whats different once the server is working
  respondJSON(request, response, 200, users);
};

const notFound = (request, response) => {
  const errorObj = {
    message: 'the page you were looking for couldnt be found',
    id: 'notFound',
  };

  respondJSON(request, response, 404, errorObj);
};

const addUser = (request, response, body) => {
  if (!body.name || !body.age) {
    const errorObj = {
      message: 'a user must have both a name and an age',
      id: 'missingParams',
    };

    respondJSON(request, response, 400, errorObj);
      return;
  }

  const resObj = { message: 'user info updated' };
  let status = 204;

  if (!users[body.name]) {
    users[body.name] = {};

    resObj.message = 'new user created';
    status = 201;
  }

  users[body.name].name = body.name;
  users[body.name].age = body.age;

  respondJSON(request, response, status, resObj);
};

module.exports = {
  getUsers,
  notFound,
  addUser,
};
