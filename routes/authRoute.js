const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');


router.use(express.static("public"));

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    }else {
        res.render('index')
    };
});

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        res.render('login');
    }
})

router.post('/login', (req, res, next) => {
    try {
        passport.authenticate('local', {
            successRedirect: '/dashboard',
            successFlash: true,
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    } catch (error) {
        console.log(error)
    }
    
})

router.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    }else {
        res.render('register');
    }
})

router.post('/register', async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body;
    
        let warnings = []
        let errors = []
        
        // check fields 

        if (!firstName || !lastName || !email || !password) {
            await warnings.push({msg: 'Please fill in all fields'})
        }

        // Check password length
        if (password.length < 6) {
           await warnings.push({msg: 'Password must be at least 6 characters'});
        }; 

        if (warnings.length > 0) {

            res.render('register', {
                warnings,
                firstName,
                lastName,
                email,
                lists: [],
                password
            })

        } else {
            const user = await User.findOne({email: email});

            if (user) {
                errors.push({msg: 'User already exists'})

                res.render('register', {
                    errors,
                    firstName,
                    lastName,
                    email,
                    password
                })

            } else {
                const hash = await bcrypt.hash(password, 10)

                const newUser = await User.create({
                    firstName,
                    lastName,
                    email,
                    password: hash
                })

                req.login(newUser, (err) => {
                    if (err) { 
                    return res.status(500).send(err);
                    }
                    req.flash('success_msg', 'You have successfully registered');
                    res.redirect('/dashboard');
                });
            }
            
        }
        
      } catch(err) {
        res.status(500).send(err)
      }
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/')
})


module.exports = router;