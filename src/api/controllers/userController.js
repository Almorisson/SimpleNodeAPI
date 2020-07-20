const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

exports.user_register = async (req, res) => {
	let new_user = await new User(req.body);
	new_user.password = await new_user.encryptPassword(req.body.password); // Encrypt password

	new_user
		.save()
		.then((user) => {
			res.status(201);
			res.json(user);
		})
		.catch((error) => {
			res.status(500);
			console.log(error);
			res.json({ message: 'Erreur serveur.' });
		});
};

exports.user_login = async (req, res, next) => {
	try {
		const email = req.body.email;
		const password = req.body.password;

		const user = await User.findOne({ email }).select('+password');
		if (!user) {
			res.status(500);
			res.json({ message: 'Mauvais adresse email' });
		}

		const isValidPassword = await user.comparePassword(password);
		if (!isValidPassword) {
			res.status(500);
			res.json({ message: 'Mot de passe incorrect' });
		}

		let userData = {
			email: user.email
		};
		await jwt.sign({ userData }, process.env.JWT_KEY, { expiresIn: '30 days' }, (error, token) => {
			if (error) {
				res.status(500);
				console.log(error);
				res.json({ message: 'Erreur serveur' });
			} else {
				res.json({user: userData,  token });
			}
		});
	} catch (error) {
		console.log(error);
		next();
	}
};

exports.all_users = () => {};
