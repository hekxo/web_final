const express = require('express');
const router = express.Router();
const { pool } = require('./dbConfig');

router.get('/dashboard', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM portfolio_items');
        console.log(result.rows);
        const items = result.rows;
        console.log("Items fetched:", items);

        if (req.user && req.user.role === 'admin') {
            res.render('adminDashboard', { user: req.user, items: items });
        } else {
            res.render('dashboard', { user: req.user ? req.user.name : 'regular', items: items });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;