// Imports
require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Models
const { Book } = require('../models');

// Controllers
const index = async (req, res) => {
    console.log('inside of api/books');
    try {
        const allBooks = await Book.find({});

        res.json({book: allBooks});
    } catch (error) {
        console.log('error inside of /api/books');
        console.log(error)
        return res.status(400).json({message: 'books not found, please try again'})
    }
}

const show = async (req, res) => {
    const {id}= req.params;
    //look for book based on index
    try {
        const book = await Book.findById(id);
        res.json({book})
    } catch (error) {
        console.log('Error inside of api/books.:id')
        console.log(error)
        return res.status(400).json({message : ' Book not found, try again'});
        
    }
}

const create = async (req, res) => {
    const {title, author, price, pages, isbn, genre}= req.body;
    try {
        const newBook = await Book.create({title, author, price, pages, isbn, genre})
        console.log('new book create', newBook)
        res.json({book: newBook});
    } catch (error) {
        console.log('error inside of POST of /api/books')
        //bc we're creating a new instace of something
        console.log(error)
        return res.status(400).json({message: 'Book was not created, please try again'})
    }

}

const update = async (req, res) => {
    console.log(req.body)
    // const {title} = req.body
    try {
        // const book = await Book.findOne({title: req.body.title});
        // book.author = req.body.author;
        // book.pages = req.body.pages;
        // book.isbn = req.body.isbn;
        // book.price = req.body.price;
        // book.genre = req.body.genre;

        // const savedBook = await book.save();
        const updatedBook = await Book.updateOne({title: req.body.title}, req.body);
        const book = await Book.findOne({title: req.body.title})
        console.log(updatedBook)
        console.log(book)
        res.redirect(`/api/books/${book.id}`)
    } catch (error) {
        console.log('Error inside of UPDATE route')
        console.log(error);
        return res.status(400).json({message: 'Book cold not be updated. Please try again...'})
        
    }
}

const deleteBook = async (req, res) => {

    const {id} = req.params;
    try {
        console.log(id)
        const result = await Book.findByIdAndRemove(id);
        console.log(result);
        res.redirect('/api/books');
    } catch (error) {
       console.log('inside of DELETE route') 
       console.log(error)
       return res.status(400).json({message: 'Book was not deleted, please try again'});
    }
}


// GET api/books/test (Public)
router.get('/test', (req, res) => {
    res.json({ msg: 'Books endpoint OK!'});
});

router.get('/',passport.authenticate('jwt', {session: false}), index);//route is currently not protected
router.get('/:id',passport.authenticate('jwt', {session: false }), show);
router.post('/',passport.authenticate('jwt', {session: false }), create);
router.put('/',passport.authenticate('jwt', {session: false }), update);
//delete -> /api/books/:id
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteBook);

module.exports = router;