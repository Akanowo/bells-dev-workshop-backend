const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./model/User');
const { hashPassword, generateAccessToken } = require('./util');
const authenticate = require('./middlewares/authenticate');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// configure mongoose
mongoose
	.connect('mongodb://localhost:27017/usersDB')
	.then(() => {
		console.log('DB connected succesfully');
	})
	.catch((error) => {
		console.log(error);
	});

app.get('/users', authenticate, async (req, res) => {
	const users = await User.find().select('-password');

	return res.status(200).json({
		status: true,
		data: users,
	});
});

app.post('/login', async (req, res) => {
	console.log(req.body);
	const { email, password } = req.body;

	// check if user exists
	const user = await User.findOne({ email: email });

	if (!user) {
		// That means user does not exist
		return res.status(401).json({
			status: false,
			message: 'Invalid username or password',
		});
	}

	// check if passwords match
	if (!(await bcrypt.compare(password, user.password))) {
		return res.status(401).json({
			status: false,
			message: 'Invalid username or password',
		});
	}

	// generate accesss token
	const access_token = generateAccessToken({ user_id: user._id });

	return res.status(200).json({
		status: true,
		message: 'login successful',
		data: {
			user,
			access_token,
		},
	});
});

app.post('/signup', async (req, res) => {
	const { name, email, password } = req.body;
	// create new user in database

	const userObject = {
		name,
		email,
		password: await hashPassword(password),
	};

	console.log(userObject);

	const user = await User.create(userObject);

	return res.status(201).json({
		status: true,
		message: 'User created successfully, proceeed to login',
	});
});

app.listen(8080, () => {
	console.log('App listening on port 8080');
});
