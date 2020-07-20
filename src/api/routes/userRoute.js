module.exports = (server) => {
  const { user_login, user_register} = require('../controllers/userController');

  server.post('/users/register', user_register)

  server.post('/users/login', user_login)

  //server.all('/users', all_users)

}
