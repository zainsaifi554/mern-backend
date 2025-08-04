import express from 'express';
import HelperFunction from '../HelperFunction/HelperFunction.js';
import User from '../Modals/UserSchema.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import Cookies from 'cookies';
const router = express.Router();

const registerSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'dev', 'co', 'pk'] } }).required(),

    password: Joi.string().min(6).required(),
})

const loginSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'dev', 'co', 'pk'] } }).required(),

    password: Joi.string().min(6).required(),
})


router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const { error, value } = registerSchema.validate(req.body);
        if (error) return HelperFunction(res, 400, true, null, "Invalid input data");

        const existingUser = await User.findOne({ email: value.email });
        if (existingUser) return HelperFunction(res, 400, true, null, "User already exists");

        const hashedPassword = await bcrypt.hash(value.password, parseInt(process.env.saltRounds));

        value.password = hashedPassword;
        let newUser = new User({ ...value });

        newUser = await newUser.save();
        HelperFunction(res, 201, false, newUser, "User registered successfully");
    } catch (error) {
        HelperFunction(res, 500, true, null, "Internal server error");
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { error, value } = loginSchema.validate(req.body);
        if (error) return HelperFunction(res, 400, true, null, "Invalid input data");
        const existingUser = await User.findOne({ email: value.email }).lean();

        if (!existingUser) return HelperFunction(res, 400, true, null, "User does not exist");

        const isPasswordValid = await bcrypt.compare(value.password, existingUser.password);
        if (!isPasswordValid) return HelperFunction(res, 400, true, null, "Invalid password");

        const token = jwt.sign(existingUser, process.env.JWT_SECRET);
        // const cookies = new Cookies(req, res);
        // cookies.set('token', token)
        HelperFunction(res, 200, false, { existingUser, token }, "Login successful");


    } catch (error) {
        HelperFunction(res, 500, true, null, "Internal server error");
    }
})

router.get('/users', async (req, res) => {

    try {
        const users = await User.find();
        HelperFunction(res, 201, false, users, "User fetch successfully");
    } catch (error) {
        HelperFunction(res, 500, true, null, "Internal server error");
    }

})

export default router;

