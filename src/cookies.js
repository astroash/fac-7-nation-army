const {parse} = require('cookie');
const {sign, verify, decode} = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const verifyCookie = (request, cb) => {
  if (!request.headers.cookie) return cb({ isValid:false });

  const { jwt } = parse(request.headers.cookie);

  if (!jwt) return cb({ isValid:false });
  return verify(jwt, SECRET, (err, jwt) => {
    if (err) {
      cb({ isValid:false });
    } else {
      cb(null, {isValid: true, faccer: jwt.faccer, avatar: jwt.avatar });
    }
  });
};

module.exports =  verifyCookie;
