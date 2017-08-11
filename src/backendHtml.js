const fs = require('fs');
const databaseConnection = require('../database/db_connection.js');

const getPosts = (cb) => {
  databaseConnection.query('SELECT users.faccer, users.avatar, posts.post, posts.date FROM users INNER JOIN posts ON users.id = posts.user_id;', (err, res) => {
    if (err) {
      cb(err);
    } else {
      cb(null, res.rows);
    }
  });
};

const parseCommentSQL = (data, cb) => {
  let replacement = '<!-- display comments here -->\n<section class = "display-comments">\n';

  data.forEach((e) => {
    replacement += '<button id="all-comments"> \n<span>\n<img src="';
    replacement += e.avatar;
    replacement += '" alt="User Avatar">\n<p class="all-comments__avatar">';
    replacement += e.faccer;
    replacement += '</p>\n<article>';
    replacement += e.post;
    replacement += '</article>\n<p  class="all-comments__date">';
    replacement += e.date;
    replacement += '\n</p>\n</span>\n</button>\n';
  });

  replacement += '</section>\n<!-- end of comments -->';

  cb(null, replacement);
};

const addLoginBox = (cb) => {
  let replacement = '<!-- log in header -->\n';
  replacement += ' <header class="header">\n';
  replacement += '   <form id ="login" method="POST" action="/login">\n';
  replacement += '     <label for="username">Username:</label>\n';
  replacement += '     <input id="username" name="username" type="text">\n';
  replacement += '     <label for="password">Password:</label>\n';
  replacement += '     <input id="password" name="password" type="password">\n';
  replacement += '     <p class="invisible" id="loginWarning">Don\'t forget to write your login information!</p>\n';
  replacement += '     <button type="submit" name="submit-login" value="Log In" >Submit</button>\n';
  replacement += '   </form>\n';
  replacement += ' </header>\n';
  replacement += '<!-- end of log in header -->';

  cb(null, replacement);
};


const addUserInfo = (data, cb) => {
  let replacement = '<!-- log in header -->\n<header class="header">\n<img src="';
  replacement += data.avatar;
  replacement += '" alt="Avatar"><p class="header__welcome">Welcome ';
  replacement += data.faccer;
  replacement += '   <form id ="logout" method="POST" action="/logout">\n';
  replacement += '     <p class="invisible" id="logoutWarning">Don\'t forget to logout when you\'re done :)!</p>\n';
  replacement += '     <button type="submit" name="submit-logout" value="Log Out" >Log Out</button>\n';
  replacement += '   </form>\n';
  replacement += '</p>\n</header>\n';
  replacement += '<!-- end of log in header -->';

  cb(null, replacement);
};

const replaceHTML = (replacementLogin, replacementComments, cb) => {
  fs.readFile(`${__dirname}/../Public/index.html`, 'utf8', (err, data) => {
    if (err) {
      cb(err);
    } else {
      let result = data.replace(/<!-- log in header -->(\n|.)*<!-- end of log in header -->/g, replacementLogin);
      result = result.replace(/<!-- display comments here -->(\n|.)*<!-- end of comments -->/g, replacementComments);
      cb(null, result);
    }
  });
};


const updateIndex = (userInfo, cb) => {
  getPosts((error, result) => {
    if (error) return console.log(error);
    if (!userInfo.isValid) {
      parseCommentSQL(result, (err, responseParsed) => {
        addLoginBox((err, responseLogin) => {
          replaceHTML(responseLogin, responseParsed, (err, res) => {
            cb(null, res);
          });
        });
      });
    } else {
      parseCommentSQL(result, (err, responseParsed) => {
        addUserInfo(userInfo, (err, responseLogin) => {
          replaceHTML(responseLogin, responseParsed, (err, res) => {
            cb(null, res);
          });
        });
      });
    }
  });
};


module.exports = { updateIndex, getPosts, replaceHTML, parseCommentSQL, addUserInfo, addLoginBox };
