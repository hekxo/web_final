const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const { pool } = require("./dbConfig");
const {isAdmin} = require("./roleCheckMiddleware");

const fileFields = [
    { name: 'image_1', maxCount: 1 },
    { name: 'image_2', maxCount: 1 },
    { name: 'image_3', maxCount: 1 }
];

router.post('/portfolio/add', upload.fields(fileFields), async (req, res) => {
    const { name_en, name_other, description_en, description_other } = req.body;
    const imagePaths = [
        req.files['image_1'] ? req.files['image_1'][0].filename : null,
        req.files['image_2'] ? req.files['image_2'][0].filename : null,
        req.files['image_3'] ? req.files['image_3'][0].filename : null,
    ].map(filename => filename ? `uploads/${filename}` : null);

    try {
        const newItem = await pool.query(
            `INSERT INTO portfolio_items 
            (name_en, name_other, description_en, description_other, image_url_1, image_url_2, image_url_3) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *`,
            [name_en, name_other, description_en, description_other, imagePaths[0], imagePaths[1], imagePaths[2]]
        );

        if (newItem.rows[0]) {
            res.redirect('/admin/dashboard');
        } else {
            res.status(400).send('Unable to add portfolio item');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


router.post('/portfolio/update/:id', upload.fields(fileFields), isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name_en, name_other, description_en, description_other } = req.body;
    const imagePaths = [
        req.files['image_1'] ? req.files['image_1'][0].filename : null,
        req.files['image_2'] ? req.files['image_2'][0].filename : null,
        req.files['image_3'] ? req.files['image_3'][0].filename : null,
    ].map(filename => filename ? `uploads/${filename}` : null);

    try {
        const updateResult = await pool.query(
            `UPDATE portfolio_items SET
            name_en = $1,
            name_other = $2,
            description_en = $3,
            description_other = $4,
            image_url_1 = $5,
            image_url_2 = $6,
            image_url_3 = $7
            WHERE id = $8
            RETURNING *`,
            [name_en, name_other, description_en, description_other, imagePaths[0], imagePaths[1], imagePaths[2], id]
        );

        if (updateResult.rows.length > 0) {
            res.redirect('/admin/dashboard');
        } else {
            res.status(400).send('Unable to update portfolio item');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/portfolio/edit/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM portfolio_items WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            const item = result.rows[0];
            res.render('adminDashboard',{ user: req.user, item: item });
        } else {
            res.status(404).send('Item not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/portfolio/delete/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM portfolio_items WHERE id = $1', [id]);
        req.flash('success_msg', 'Item deleted successfully.');
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error deleting item.');
        res.redirect('/admin/dashboard');
    }
});

router.get('/pokemonsPage', (req, res) => {
    res.render('pokemonsPage');
});

router.get('/randomMemesPage', (req, res) => {
    res.render('randomMemesPage');
});

router.get('/marvelAPI', (req, res) => {
    res.render('marvelAPI');
});

module.exports = router;
