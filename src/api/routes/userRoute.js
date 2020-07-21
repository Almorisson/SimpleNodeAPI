module.exports = (server) => {
	const { user_login, user_register, findUserById, logout } = require('../controllers/userController');

	server.post('/users/register', user_register);

	server.post('/users/login', user_login);

    server.get('/users/logout', logout);

	//server.all('/users', all_users)

	server.param('userId', findUserById);
};
