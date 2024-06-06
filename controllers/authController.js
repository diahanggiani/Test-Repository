const users = require("../database/models/users");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const signup = async (req, res, next) => {
    const body = req.body;

    const newUser = await users.create({
        username: body.username,
        email: body.email,
        password: body.password
    });

    const result = newUser.toJSON();

    delete result.password;
    delete result.deleteAt;

    result.token = generateToken({
        id: result.id
    });

    if(!result){
        return res.status(400).json({
            status: 'Fail',
            message: 'Failed to create the user'
        });
    }

    return res.status(201).json({
        status: 'Success',
        data: result
    });
};

const login = async (req, res, next) => {
    const{ email, password } = req.body;
    
    if(!email || !password){
        return res.status(400).json({
            status: 'Fail',
            message: 'Please provide email and password'
        });
    }

    const result = await users.findOne({ where: { email } });
    if(!result || (await bcrypt.compare(password, result.password))){
        return res.status(401).json({
            status: 'Fail',
            message: 'Incorrect email or password'
        });
    }

    const token = generateToken({
        id: result.id,
    });

    return res.json({
        status: 'Success',
        token
    });
};

module.exports = {
    signup,
    login
};