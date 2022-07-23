const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function hashPassword(password) {
	return bcrypt.hash(password, 10);
}

function generateAccessToken(payload) {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '10m' });
}

module.exports = {
	hashPassword,
	JWT_SECRET,
	generateAccessToken,
};
