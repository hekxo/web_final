const express = require('express');
const app = express();
const { pool } = require("./dbConfig");
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const adminRoutes = require('./routeToRetrieveItems');
const adminRoutes2 = require('./adminRoutes');
const initializePassport = require("./passportConfing");
const {sendWelcomeEmail} = require("./mailer");
initializePassport(passport);
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

app.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use('/admin', adminRoutes);
app.use('/admin', adminRoutes2);

app.set('view engine', 'ejs');

app.get('/', (req, res)=> {
    res.render('index');
});

app.get('/users/register', checkAuthenticated, (req, res)=> {
    res.render('register.ejs');
});

app.get('/users/login', checkAuthenticated, (req, res)=> {
    res.render('login.ejs');
});

app.get('/redirect', (req, res) => {
    if (req.user.role === 'admin') {
        res.redirect('/admin/dashboard');
    } else {
        res.render('dashboard', { user: req.user, items: [] });
    }
});

app.get('/users/dashboard', checkNotAuthenticated, async (req, res)=> {
    console.log(req.isAuthenticated());
    res.render('dashboard', {user: req.user.name, items: [] });
});

app.get("/users/logout", (req,res) => {
    req.logOut(function(err) {
        if (err) { return next(err); }
        req.flash("success_msg", "You have successfully logged out.");
        res.redirect("/users/login");
    });
});

app.post('/users/register', async (req, res) => {
    let { username, email, name, password, password2 } = req.body;
    let errors = [];

    console.log({
        username,
        email,
        name,
        password,
        password2
    });

    if (!username || !email || !name || !password || !password2) {
        errors.push({message: "Please enter all fields"});
    }

    if (password.length < 6) {
        errors.push({message: "Password should be at least 6 characters"});
    }

    if (password !== password2) {
        errors.push({message: "Passwords do not match"});
    }

    const usernameCheck = await pool.query(
        `SELECT * FROM users WHERE username = $1`,
        [username]
    );

    if (usernameCheck.rows.length > 0) {
        errors.push({message: "Username already taken"});
    }

    if (errors.length > 0) {
        res.render('register', {errors, username, email, name, password, password2});
    } else {
        let hashedPassword = await bcrypt.hash(password, 10);

        try {
            const emailCheck = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
            if (emailCheck.rows.length > 0) {
                errors.push({message: "Email already registered"});
                res.render('register', {errors, username, email, name, password, password2});
            } else {
                const newUser = await pool.query(
                    `INSERT INTO users (username, email, name, password)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id, password`, [username, email, name, hashedPassword]
                );

                if (newUser.rows.length > 0) {
                    await sendWelcomeEmail(email); // Send welcome email
                    req.flash('success_msg', "You are now registered. Please log in");
                    res.redirect('/users/login');
                }
            }
        } catch (err) {
            console.error(err);
            res.send("An error occurred"); // Or handle the error as you see fit
        }
    }
});

app.post('/users/login', passport.authenticate('local', {
    successRedirect: "/redirect",
    failureRedirect: "/users/login",
    failureFlash: true
})
);

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/dashboard');
    }
    next();
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login');
}

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
});