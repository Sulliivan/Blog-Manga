const express = require('express');
const router = express.Router();


//////////////   DASHBOARD ARTICLE   //////////////
//// Affiche les articles dans Dashboard Article Admin //////
router.get('/admin', async (req, res) => {
    try {
        const id = req.params.postId
        // const articles = await query("SELECT postId, title, description, content,  image, dateCreated, status, userId, CategoryId FROM post WHERE postId =  '" + id + "';")
        const articles = await query("SELECT postId, title, description, content, image, dateCreated, status, userId, CategoryId FROM post ")
        res.render("admin" , {
            articles
        })
    }catch(err){
        res.send(err)
    }
        
});

module.exports = router;