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


/////////////  Pour Poster un Article   //////////////
router.post('/admin', async (req, res) => {

    let title = req.body.title
    let content = req.body.content
    let description = req.body.description
    let dateCreated = req.body.dateCreated
    let status = req.body.status
    let user = req.body.userId
    let Category = req.body.CategoryId
    let imageUpload = req.files.image
    let imageBack = req.files.backImage
    let images = `/images/${imageUpload.name}`
    let img = `/images/${imageBack.name}`

    if (imageUpload.mimetype === "image/jpeg" || imageUpload.mimetype === "image/jpg" || imageUpload.mimetype === "image/gif" || imageUpload.mimetype === "image/png") {
        imageUpload.mv(`public/images/${imageUpload.name}`, async function (err) {
            if (err) {
                return res.status(500).send(err)
            }
           
            if (imageBack.mimetype === "image/jpeg" || imageBack.mimetype === "image/jpg" || imageBack.mimetype === "image/gif" || imageBack.mimetype === "image/png") {
                imageBack.mv(`public/images/${imageBack.name}`, async function (err) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    
                    try {
                        await query("insert into post (title, content, description, status, image, backImage, userId, CategoryId, dateCreated) values (?, ?, ?, ?, ?, ?, ?, ?, NOW() );", [title, content, description, status, images, img, user, Category, dateCreated])
                            res.redirect("/dashboard/admin")
                    } catch (err) {
                        res.send(err)
                    } 
                });
            }
        });
    }
});

module.exports = router;