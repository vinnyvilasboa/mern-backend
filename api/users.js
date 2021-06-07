// Imports
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JWT_SECRET = process.env.JWT_SECRET;

// Models
const { User }= require('../models')
// controllers
const test = async (req, res) => {
    res.json({ message: 'User endpoint OK!'});
}

const signup = async (req, res) => {
   console.log('-----INSIDE SIGNUP-----')
    console.log('req.body => ', req.body);
   const {name, email, password} = req.body;

   try {
       //see if a user exist in the database by email
       //catches any email that's already repeated
       const user = await User.findOne({email})
       //logic: if a user exist return 400 error and message
        /*
        if email already exist a message will be returned
        saying the email already exists. Otherwise if it doesnt exist
        create a new user with name, email, and password with hashed functions through
        bcrypt (12) then await then save it. 

        if it catches any errors run the catch function
        */

       if (user){
        return res.status(400).json({message: 'Email already exists'})   
       }  else {
           console.log('Create New User');
           let saltRounds = 12;
           let salt = await bcrypt.genSalt(saltRounds);
           let hash = await bcrypt.hash(password, salt)

           const newUser = new User({
               name,
               email,
               password: hash
           })
           const savedNewUser = await newUser.save();

           res.json(savedNewUser);
       }
   } catch (error) {
       console.log('Error inside of /api/users/signup')
       console.log(error);
       return res.status(400).json({mesage: 'Error occurred, please try again....'})       
   }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        //find user via email address
        const user = await User.findOne({email: email});
        console.log(user);

        //if there is no user by the email
        if (!user) {
            return res.status(400).json({message: 'either email or password is incorrect...'});
        } else {
            //a user is found in database 
            /*
            if it matches the password variable that has the bcrypt in it
            */
            let isMatch = await bcrypt.compare(password, user.password);
            console.log('password correct', isMatch);

            if(isMatch) {
                //create token payload (object) -> going to include the user info
                let logs = user.timesLoggedIn + 1;
                user.timesLoggedIn = logs;
                const savedUser = await user.save();
                const payload = {
                    id: user.id,
                    email: user.email,
                    expiredToken: Date.now()
                }
                try {
                    let token = await jwt.sign(payload, JWT_SECRET, {expiresIn : 3600 })
                    console.log('token', token);
                    let legit = await jwt.verify(token, JWT_SECRET, {expiresIn: 60});

                    res.json({
                        success: true,
                        token: `Bearer ${token}`,
                        userData: legit
                    })
                } catch (error) {
                    console.log('Error inside of isMatch conditional');
                    console.log(error)
                    res.status(400).json({message: 'Session has ended. Please log in again'})
                }
            }else {
                return res.status(400).json({message: 'Either email or password is incorrect'})
            }
        }
    } catch (error) {
        console.log('Error inside of /api/users/login')
        console.log(error);
        return res.status(400).json({message: 'either email or password is incorrect. Please try again'})
    }
}

const profile = async (req, res)=> {
    console.log('inside of profile routes');
    res.json({
        id: req.user.id,
        name: req.user.name, 
        email: req.user.email
    });
}



 // routes
//get -> 
router.get('/test', test);

// POST api/users/register (Public)
router.post('/signup', signup);

// POST api/users/login (Public)
router.post('/login', login);

// GET api/users/profile (Private)
router.get('/profile', passport.authenticate('jwt', { session: false }), profile);
// router.get('/all-users', fetchUsers);

module.exports = router; 