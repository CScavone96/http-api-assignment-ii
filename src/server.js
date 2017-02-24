const http = require('http');
const url = require('url');
const query = require('querystring');
const { getIndex, getStyle } = require('./htmlResponses.js');
const { notFound, success, badRequest, forbidden, unauthorized, internal, notImplemented, getUsers, addUser } = require('./jsonResponses.js');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': getIndex,
  '/style.css': getStyle,
  '/success': success,
  '/badRequest': badRequest,
  '/forbidden': forbidden,
  '/unauthorized': unauthorized,
  '/internal': internal,
  '/notImplemented': notImplemented,
  '/getUsers': getUsers,
  '/addUser': addUser,
  notFound,
};

const onRequest = (request, response) => {
  console.log(request.url);
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  const acceptedTypes = request.headers.accept.split(',');
  console.log(acceptedTypes);
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, params, acceptedTypes);
  } else {
    urlStruct.notFound(request, response, params, acceptedTypes);
  }
};
http.createServer(onRequest).listen(PORT);

console.log(`listening on ${PORT}`);
