const http = require('http');
const handlers = require('./handlers');

const fileList = ['/index.js', '/style.css', '/favicon.ico', '/avatar1.jpg', '/avatar2.jpg'];

const router = (request, response) => {
  if (request.url && request.method) {
    switch (`${request.method} ${request.url}`) {
      case 'GET /':
        return handlers.handleHome(request, response);
      case 'POST /login':
        return handlers.handleLogin(request, response);
      case 'POST /logout':
        return handlers.handleLogout(request, response);
      case 'POST /post-comment':
        return handlers.handlePost(request, response);
      default:
        if (fileList.includes(request.url)) {
          return handlers.handlePublic(request, response);
        } console.log(request.url);
        return handlers.handleError(request, response);
    }
  }
};

module.exports = router;
