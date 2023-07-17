// Create web server

// Import modules
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import models
const Comment = require('../models/Comment');
const User = require('../models/User');
const Post = require('../models/Post');

// Import middleware
const auth = require('../middleware/auth');

// @route   POST api/comments
// @desc    Create a comment
// @access  Private
router.post(
    '/',
    [
        auth,
        [
            check('text', 'Text is required').not().isEmpty(),
            check('post', 'Post is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        
        // Check for errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        };
        
        try {
            
            // Create comment
            const comment = new Comment({
                user: req.user.id,
                text: req.body.text,
                post: req.body.post,
            });
            
            // Save comment
            await comment.save();
            
            // Send comment
            res.json(comment);
            
        } catch (err) {
            
            // Log error
            console.error(err.message);
            
            // Send error
            res.status(500).send('Server Error');
            
        };
        
    }
);

// @route   GET api/comments
// @desc    Get all comments
// @access  Private
router.get('/', auth, async (req, res) => {
    try {

        // Get comments
        const comments = await Comment.find().sort({ date: -1 });

        // Send comments
        res.json(comments);

    } catch (err) {

        // Log error
        console.error(err.message);

        // Send error
        res.status(500).send('Server Error');

    };

}
);