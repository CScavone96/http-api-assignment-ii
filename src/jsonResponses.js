const crypto = require('crypto');

const users = [];
let currentHash = 'HELLO';

const respond = (request, response, status, object, etag) => {
  const hash = crypto.createHash('md5').update(JSON.stringify(object)).digest('hex').slice(0, 6);
  if (etag && hash === currentHash) {
    response.setHeader('ETag', hash);
    response.setHeader('if-none-match', hash);
    response.setHeader('Vary', 'Accept-Encoding');
    response.writeHead(304);
    response.end();
  } else {
    currentHash = hash;
    response.setHeader('ETag', hash);
    response.setHeader('if-none-match', hash);
    response.setHeader('Vary', 'Accept-Encoding');
    response.writeHead(status, {
      'Content-Type': 'application/json',
    });

    response.write(JSON.stringify(object));
    response.end();
  }
};


const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  return respond(request, response, 404, responseJSON, false);
};


const getIndex = (obj, val, ind) => {
  const inds = [];
  let inder = ind;
  for (let i = 0; i < obj.length; i++) {
    if (JSON.stringify(obj[i]).includes(val)) {
      inds.push(inder);
    }
    inder++;
  }
  return inds;
};


const forbidden = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was forbidden.',
    id: 'forbidden',
  };

  return respond(request, response, 403, responseJSON, false);
};

const internal = (request, response) => {
  const responseJSON = {
    message: 'An internal error has occured',
    id: 'internal',
  };

  return respond(request, response, 500, responseJSON, false);
};

const notImplemented = (request, response) => {
  const responseJSON = {
    message: 'This page has not been implemented',
    id: 'notImplemented',
  };

  return respond(request, response, 501, responseJSON, false);
};

const getUsers = (request, response, head) => {
  const responseJSON = {
    users,
  };
  if (head === 'head') {
    return respond(request, response, 200, responseJSON, true);
  }
  return respond(request, response, 200, responseJSON, true);
};


const addUser = (request, response) => {
  let jsonString = '';
  request.on('data', (data) => {
    jsonString += data;
  });

  request.on('end', () => {
    const paramsNew = jsonString.split('&');
    const name = paramsNew[0].slice(((paramsNew[0].indexOf('=')) + 1));
    const age = paramsNew[1].slice(((paramsNew[1].indexOf('=')) + 1));
    if (name.length > 0 && age.length > 0) {
      if (getIndex(users, name).length === 0) {
        response.writeHead(201);
        users.push({ name, age });
        const responseJSON = {
          message: 'Created Successfully',
          id: 'create',
        };
        response.write(JSON.stringify(responseJSON));
        response.end();
      } else {
        response.writeHead(204);
        users[getIndex(users, name, 0)[0]] = ({ name, age });
        response.end();
      }
    } else {
      response.writeHead(400);
      const responseJSON = {
        message: 'Name and Age required.',
        id: 'badRequest',
      };
      response.write(JSON.stringify(responseJSON));
      response.end();
    }
  });
};


const success = (request, response) => {
  const responseJSON = {
    message: 'This is a successful response',
    id: 'success',
  };

  return respond(request, response, 200, responseJSON, false);
};


const unauthorized = (request, response, params) => {
  const responseJSON = {
    message: 'This request is authorized, you are logged in',
    id: 'unauthorized',
  };

  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseJSON.message = 'Missing loggedIn query parameter set to yes';
    responseJSON.id = 'unauthorized';
    return respond(request, response, 401, responseJSON, false);
  }


  return respond(request, response, 200, responseJSON, false);
};


const badRequest = (request, response, params) => {
  const responseJSON = {
    message: 'This request has the required parameters',
    id: 'badRequest',
  };

  if (!params.valid || params.valid !== 'true') {
    responseJSON.message = 'Missing valid query parameter set to true';
    responseJSON.id = 'badRequest';
    return respond(request, response, 400, responseJSON, false);
  }

  return respond(request, response, 200, responseJSON, false);
};

module.exports = {
  success,
  badRequest,
  notFound,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  getUsers,
  addUser,
};
