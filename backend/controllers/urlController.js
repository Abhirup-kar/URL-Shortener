const Url = require('../models/urls.js');
const User = require('../models/users.js');
const express = require('express');
const bcrypt = require('bcryptjs');

const urlControllers = express.Router();

// 1. Shorten a URL
urlControllers.post('/urls/shorten', async (req, res) => {
    try {
        const { originalUrl, customAlias, email } = req.body;
        
        if (!originalUrl) {
            return res.status(400).json({ message: 'URL is required' });
        }

        // Find user by email if logged in
        let userId = null;
        if (email) {
            const user = await User.findOne({ email });
            if (user) {
                userId = user._id;
            }
        }

        // If no user was found but userId is required, we can find/create a default guest user or make it optional.
        // Since UrlSchema has userId as required: true, we must associate it with a user.
        // If not logged in, we can associate with a system guest user or require login.
        if (!userId) {
            // Find or create a default guest user to satisfy the schema requirement
            let guest = await User.findOne({ email: 'guest@shorten.it' });
            if (!guest) {
                const guestPassword = await bcrypt.hash(Math.random().toString(36), 10);
                guest = await User.create({
                    username: 'guest',
                    email: 'guest@shorten.it',
                    password: guestPassword
                });
            }
            userId = guest._id;
        }

        const alias = customAlias || Math.random().toString(36).substring(2, 7);
        
        // Check if alias is already in use
        const existing = await Url.findOne({ shortUrl: alias });
        if (existing) {
            return res.status(400).json({ message: 'Custom alias is already in use' });
        }

        const newUrl = await Url.create({
            userId,
            url: originalUrl,
            shortUrl: alias
        });

        res.status(201).json({
            id: newUrl._id,
            originalUrl: newUrl.url,
            alias: newUrl.shortUrl,
            shortUrl: `${req.protocol}://${req.get('host')}/r/${newUrl.shortUrl}`,
            clicks: newUrl.count,
            createdAt: newUrl.createdAt
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 2. Get user's shortened URLs
urlControllers.post('/urls/my-urls', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const urls = await Url.find({ userId: user._id }).sort({ createdAt: -1 });
        
        const mappedUrls = urls.map(item => ({
            id: item._id,
            originalUrl: item.url,
            alias: item.shortUrl,
            shortUrl: `${req.protocol}://${req.get('host')}/r/${item.shortUrl}`,
            clicks: item.count,
            createdAt: item.createdAt
        }));

        res.status(200).json(mappedUrls);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 3. Delete a shortened URL
urlControllers.delete('/urls/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Url.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'URL not found' });
        }
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 4. Redirect shortened URL & record click
urlControllers.get('/r/:alias', async (req, res) => {
    try {
        const { alias } = req.params;
        const record = await Url.findOne({ shortUrl: alias });
        
        if (!record) {
            return res.status(404).send('<h1>URL Not Found</h1>');
        }

        // Increment click count
        record.count += 1;
        await record.save();

        // Redirect to original URL
        res.redirect(record.url);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

module.exports = urlControllers;
