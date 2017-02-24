
var users = [];
const crypto = require('crypto');
var currentHash = "HELLO";
  
const respond = (request, response, status, object, type) => {
  var hash = crypto.createHash('md5').update(JSON.stringify(object)).digest('hex').slice(0, 6)
  if(hash == currentHash){
	  response.setHeader('ETag', hash);
	  response.setHeader('if-none-match', hash);
	  response.setHeader('Vary', 'Accept-Encoding');
	  response.writeHead(304);
	  response.end();
  }
  else{
	  currentHash = hash;
	  response.setHeader('ETag', hash);
	  response.setHeader('if-none-match', hash);
	  response.setHeader('Vary', 'Accept-Encoding');
	  response.writeHead(status, {
		'Content-Type': type,
	  });
	  if (type === 'application/json') {
		response.write(JSON.stringify(object));
		response.end();
	  } else {
		response.write(object);
		response.end();
	  }
  }
};


const notFound = (request, response, params) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  return respond(request, response, 404, responseJSON, 'application/json');
};


const forbidden = (request, response, params) => {
  const responseJSON = {
    message: 'The page you are looking for was forbidden.',
    id: 'forbidden',
  };

  return respond(request, response, 403, responseJSON, 'application/json');
};

const internal = (request, response, params) => {
  const responseJSON = {
    message: 'An internal error has occured',
    id: 'internal',
  };

  return respond(request, response, 500, responseJSON, 'application/json');
};

const notImplemented = (request, response, params) => {
  const responseJSON = {
    message: 'This page has not been implemented',
    id: 'notImplemented',
  };

  return respond(request, response, 501, responseJSON, 'application/json');
};

const getUsers = (request, response, params, head) => {
  const responseJSON = {
    users: users,
  };
  if(head == "head"){
	return respond(request, response, 200, responseJSON, 'application/json');
  }
  else{
	  return respond(request, response, 200, responseJSON, 'application/json');
  }
};


const addUser = (request, response, params) => {
  var jsonString = '';
  const responseJSON = {
    message: 'Created Successfully',
    id: 'create',
  };
  request.on('data', function (data) {
	jsonString += data;
  });

  request.on('end', function () {
	const paramsNew = jsonString.split('&');
	const name = paramsNew[0].slice(((paramsNew[0].indexOf("="))+1)); 
	const age = paramsNew[1].slice(((paramsNew[1].indexOf("="))+1)); 
	if(name.length > 0 && age.length > 0){
		if(getIndex(users, name).length == 0){
		  response.writeHead(201);
		  users.push({name: name, age: age});
		  const responseJSON = {
		  message: 'Created Successfully',
          id: 'create',
          };
		  response.write(JSON.stringify(responseJSON));
		  response.end();
		}
		else{
		  response.writeHead(204);
		  console.log("GET INDEX " + getIndex(users, name, 0));
		  users[getIndex(users, name, 0)[0]] = ({name: name, age: age});
		  response.end();
		}
	}
	else{
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

const getIndex = (obj, val, ind) => {
    var inds = [];
    for (var i =0; i < obj.length; i++) {
		if (JSON.stringify(obj[i]).includes(val)) {
            inds.push(ind);
        }
		ind++;
    }
    return inds;
}

const notReal = (request, response, params, head) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
	  //if(newResults != oldResults){ load results }
  return respond(request, response, 404, responseJSON, 'application/json');
};


const success = (request, response, params) => {
  const responseJSON = {
    message: 'This is a successful response',
    id: 'success',
  };

  return respond(request, response, 200, responseJSON, 'application/json');
};


const unauthorized = (request, response, params) => {
  const responseJSON = {
    message: 'This request is authorized, you are logged in',
    id: 'unauthorized',
  };

  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseJSON.message = 'Missing loggedIn query parameter set to yes';
    responseJSON.id = 'unauthorized';
    return respond(request, response, 401, responseJSON, 'application/json');
  }


  return respond(request, response, 200, responseJSON, 'application/json');
};


const badRequest = (request, response, params) => {
  const responseJSON = {
    message: 'This request has the required parameters',
    id: 'badRequest',
  };

  if (!params.valid || params.valid !== 'true') {
    responseJSON.message = 'Missing valid query parameter set to true';
    responseJSON.id = 'badRequest';
    return respond(request, response, 400, responseJSON, 'application/json');
  }

  return respond(request, response, 200, responseJSON, 'application/json');
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
