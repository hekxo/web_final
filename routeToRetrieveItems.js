const express = require('express');
const router = express.Router();
const { pool } = require('./dbConfig');
const { isAdmin } = require('./roleCheckMiddleware');

router.get('/dashboard', isAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM portfolio_items');
        const items = result.rows;
        res.render('adminDashboard', { user: req.user, items: items });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


module.exports = router;
