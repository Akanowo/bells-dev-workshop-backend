const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { JWT_SECRET } = require('../util');

const authenticate = async (req, res, next) => {
	const authorization = req.headers.authorization;

	if (!authorization) {
		return res.status(401).json({
			status: false,
			message: 'Authorization required',
		});
	}

	const token = authorization.split(' ')[1];

	console.log(token);

	if (!token) {
		console.log('TOKEN IS NULL');
		return res.status(401).json({
			status: false,
			message: 'You are not allowed to access this resource.',
		});
	}

	// continue from here....
	jwt.verify(token, JWT_SECRET, async (err, payload) => {
		if (err) {
			return res.status(401).json({
				status: false,
				message: 'You are not allowed to access this resource.',
			});
		}

		const { user_id } = payload;

		// Check if user exits
		const user = await User.findById(user_id);
		if (!user) {
			return res.status(401).json({
				status: false,
				message: 'You are not allowed to access this resource',
			});
		}
		next();
	});
};

module.exports = authenticate;
