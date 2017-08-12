const dbConnection = require('../database/db_connection.js');

const postData = (user_id, post, date, cb) => {
  dbConnection.query('INSERT INTO posts (user_id, post, date) VALUES ($1, $2, $3)', [user_id, post, date], (err, res) => {
    if (err) {
      return cb(err);
    }
    cb(null, res);
  });
};

module.exports = postData;
