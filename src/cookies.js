const {parse} = require('cookie');
const {sign, verify, decode} = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const createCookie = (userDetails) => {
  const cookiePayload = {};
  cookiePayload.id = userDetails[0].id;
  cookiePayload.faccer = userDetails[0].faccer;
  cookiePayload.avatar = userDetails[0].avatar;
  return cookie = sign(cookiePayload, SECRET);
}

const verifyCookie = (request, cb) => {
  if (!request.headers.cookie) return cb({ isValid:false });
  const { jwt } = parse(request.headers.cookie);
  if (!jwt) return cb({ isValid:false });
  return verify(jwt, SECRET, (err, jwt) => {
    if (err) {
      cb({ isValid: false });
    } else {
      cb(null, { isValid: true, faccer: jwt.faccer, avatar: jwt.avatar });
    }
  });
};

module.exports = { createCookie, verifyCookie };
