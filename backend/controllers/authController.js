const User = require('../models/users.js');
const express = require('express');
const bcrypt = require('bcryptjs');

const authControllers = express.Router();

authControllers.post('/signup', async (req, res) => {
    const {username, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    if(email === '' || username === '' || password === ''){
        return res.status(400).json({message: 'All fields are required'});
    }

    const exists = await User.findOne({email});
    if(exists){
        return res.status(400).json({message: 'User already exists'});
    }
    const user = await User.create({username, email, password: hashedPassword});
    res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
    });
});

authControllers.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(email === '' || password === ''){
        return res.status(400).json({message: 'All fields are required'});
    }
    if(!user){
        return res.status(401).json({message: 'Invalid credentials'});
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(401).json({message: 'Invalid credentials'});
    }
    res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
    });
});

module.exports = authControllers;