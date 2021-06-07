// Imports
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JWT_SECRET = process.env.JWT_SECRET;

// Models
const { } = require('../models');

// Controllers
const index = async (req, res) => {

}

const show = async (req, res) => {
    
}

const create = async (req, res) => {

}

const update = async (req, res) => {
    
}

const deleteBook = async (req, res) => {
    
}


// GET api/books/test (Public)
router.get('/test', (req, res) => {
    res.json({ msg: 'Books endpoint OK!'});
});

router.get('/books', index);
router.get('/books/:id', show);
router.post('/books', passport.authenticate('jwt', { session: false }), create);
router.put('/books/:id', passport.authenticate('jwt', { session: false }), update);
router.delete('/books/:id', passport.authenticate('jwt', { session: false }), deleteBook);

module.exports = router;