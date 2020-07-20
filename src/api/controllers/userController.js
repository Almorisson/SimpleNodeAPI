const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

exports.user_register = async (req, res) => {
	let new_user = await new User(req.body);
	new_user.password = await new_user.encryptPassword(req.body.password); // Encrypt password

	new_user
		.save()
		.then((user) => {
			const { _id, name, email, role } = user;
			res.status(201);
			res.json({ user: { _id, name, email, role } });
		})
		.catch((error) => {
			res.status(500);
			console.log(error);
			res.json({ message: `${req.body.email} est déjà utilisé.` });
		});
};

exports.user_login = async (req, res, next) => {
	try {
		const email = req.body.email;
		const password = req.body.password;

		const user = await User.findOne({ email }).select('+password');
		if (!user) {
			res.status(500);
			res.json({ message: 'Mauvaise adresse email' });
		}

		const isValidPassword = await user.comparePassword(password);
		if (!isValidPassword) {
			res.status(500);
			res.json({ message: 'Mot de passe incorrect' });
		}

		let userData = {
			email: user.email,
			role: user.role
		};
		await jwt.sign({ userData }, process.env.JWT_KEY, { expiresIn: '30 days' }, (error, token) => {
			if (error) {
				res.status(500);
				console.log(error);
				res.json({ message: 'Erreur serveur' });
			} else {
				// persist the token in cookies with expiry date
				res.cookie('token_noddy_ipssi', token, { expire: new Date() + 9999 });
				const { _id, name, email, role } = user;
				res.json({ user: { _id, name, email, role }, token });
			}
		});
	} catch (error) {
		console.log(error);
		next();
	}
};

exports.logout = (req, res) => {
	res.clearCookie('token_noddy_ipssi');
	return res.json({ message: 'Vous avez été déconnecté avec succès !' });
};
//exports.all_users = () => {};

// findUserById method to easily query DB and retrieve a user from it
exports.findUserById = async (req, res, next, id) => {
	try {
		await User.findById(id).sort('created_at').exec((err, user) => {
			if (err || !user) {
				return res.status(400).json({
					error: 'Utilisateur non trouvé !'
				});
			}
			req.profile = user; // adds profile object to req with user infos
			next();
		});
	} catch (err) {
		next(err);
	}
};
