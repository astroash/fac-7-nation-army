const fs = require('fs');
const databaseConnection = require('../database/db_connection.js');

const getPosts = (cb) => {
  databaseConnection.query('SELECT users.faccer, users.avatar, posts.post, posts.date FROM users INNER JOIN posts ON users.id = posts.user_id;', (err, res) => {
    if (err) cb(err);
    else cb(null, res.rows);
  });
};

const buildHtmlFromQueryData = (data) => {
  let replacement = '<!-- display comments here -->\n<section class = "display-comments">\n';

  data.forEach((e) => {
    replacement += `'<button id="all-comments">
    <span>
    <img src="${e.avatar}" alt="User Avatar">
    <p class="all-comments__avatar">${e.faccer}</p>
    </span>
    <article> ${e.post} </article>
    <p class="all-comments__date"> ${e.date} </p>
    </button>`;
  });

  replacement += '</section>\n<!-- end of comments -->';

  return  replacement;
};

const addLoginBox = () => {
  let replacement = `<!-- log in header -->
  <header class="header">
  <form id ="login" method="POST" action="/login">
  <label for="username">Username:</label>
  <input id="username" name="username" type="text">
  <label for="password">Password:</label>
  <input id="password" name="password" type="password">
  <p class="invisible" id="loginWarning">Don\'t forget to write your login information!</p>
  <button type="submit" name="submit-login" value="Log In" >Submit</button>
  </form></header>
  <!-- end of log in header -->`;

  return replacement;
};


const addUserInfo = (data) => {
  let userInfoHtml = `<!-- log in header -->
  <header class="header">
  <img src="${data.avatar}" alt="Avatar">
  <p class="header__welcome">Welcome ${data.faccer}
  <form id ="logout" method="POST" action="/logout">
  <p class="invisible" id="logoutWarning">Don\'t forget to logout when you\'re done :)!</p>
  <button type="submit" name="submit-logout" value="Log Out" >Log Out</button>
  </form>
  </header>
  <!-- end of log in header -->`;

  return userInfoHtml;
};

const addCorrectHeader=  (boolean, data) =>{
  if (boolean){
    return addUserInfo(data)
  } else {
    return addLoginBox()
  }
}

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
  getPosts((err, data) => {
    if (err) return console.log(error);
    const htmlHeader = addCorrectHeader(userInfo.isValid, data);
    const htmlFromDb = buildHtmlFromQueryData(data);
    replaceHTML(htmlHeader, htmlFromDb, (err, res) => {
      cb(null, res);
    })
  })
}

module.exports = { updateIndex };
