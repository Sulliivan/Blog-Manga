const express = require('express');
const router = express.Router();


router.get('/article/:postId', async (req, res) => {
    const id = req.params.postId
    const articles = await query ("SELECT postId, title, description, content, image, backImage FROM post WHERE postId = '"+id+"' ;")
    console.log(articles);    
    res.render("article",{
            articles
        })
 });

module.exports = router;