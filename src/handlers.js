const {
  readFile
} = require('fs');
const {
  parse
} = require('cookie');
const {
  sign,
  verify
} = require('jsonwebtoken');

const env = require('env2')('.env');
const path = require('path');

const SECRET = process.env.SECRET;
const userDetails = process.env.USERDETAILS;
const notFoundPage = '<p style="font-size: 10vh; text-align: center;">404!</p>';

const handleHome = (request, response) => {
  readFile(__dirname + "/../Public/index.html", function(error, file) {
    if (error) {
      response.writeHead(500, 'Content-Type:text/html');
      return response.end('<h1>Sorry, our homepage is sleeping</h1>');

    } else {
      console.log('hone');
      response.writeHead(200, {
        "Content-Type": "text/html"
      });
      return response.end(file);
    }
  });

}

const handlePublic = (request, response) => {

const fileName = request.url ;
  const filePath = path.join(__dirname, '..', 'public', fileName);
  const extension = fileName.split('.')[1];
  const extensionType = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    ico: 'image/x-icon',
    jpg: 'image/jpeg',
  };
  readFile(filePath, (error, file) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/html'
      });
      return response.end('Sorry, we\'ve had a problem');
    } else {
      response.writeHead(200, {
        'Content-Type': extensionType[extension]
      });
      return response.end(file);
    }
  });
}

const handleLogin = (request, response) => {

  const cookie = sign(userDetails, SECRET);
  console.log('cookie',cookie);
  response.writeHead(302, {
    'Location': '/',
    'Set-Cookie': `jwt=${cookie};HttpOnly`
  });

response.end();
  // handleAuth(request, response);
  console.log('hi2');
}

const handleLogout = (request, response) => {
  response.writeHead(302, {
    'Location': '/',
    'Set-Cookie': `jwt=0;Max-Age=0`
  });
  return response.end()
}

const handleAuth = (request, response) => {
  const sendError = () => {
    const message = 'Authenication failed!';
    response.writeHead(401, {
      'Content-Type': 'text/plain',
      'Content-Length': message.length
    });
    return response.end(message);
  }
  if (!request.headers.cookie) return sendError();

console.log(parse(request.headers.cookie));
  const { jwt } = parse(request.headers.cookie);

  if (!jwt) return sendError();

  return verify(jwt, SECRET, (err, jwt) => {
    if (err) {
      return sendError();
    } else {
      console.log('jwt is', jwt);
      const message = `Welcome! Your user ID is: ${jwt.userId}!`
      response.writeHead(
        200, {
          'Content-Type': 'text/plain',
          'Content-Length': message.length
        }
      );
      return response.end(message)
    }
  })
}

const handleError = (request, response) => {
  response.writeHead(
    404, {
      'Content-Type': 'text/html',
      // What does this do?
      'Content-Length': notFoundPage.length
    }
  );
  return response.end(notFoundPage)
}
const handlePost = (request, response) => {

}


module.exports = {
  handleHome,
  handlePublic,
  handleLogin,
  handleLogout,
  handleAuth,
  handleError,
  handlePost
}
