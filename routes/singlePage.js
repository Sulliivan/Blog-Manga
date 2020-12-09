const express = require('express');
const router = express.Router();


router.get('/article', async (req, res) => {
        res.render("article")
 });

module.exports = router;