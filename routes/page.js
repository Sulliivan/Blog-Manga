const express = require('express');
const router = express.Router();


router.get('/index', async (req, res) => {
        const articles = await query ("SELECT postId, title, description, content, image, dateCreated, status, userId, CategoryId FROM post")
         res.render("index", {
                 articles
                })
  });

module.exports = router;