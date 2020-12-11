const express = require('express');
const router = express.Router();


//////////////   DASHBOARD ARTICLE   //////////////
//// Affiche les articles dans Dashboard Article Admin //////
router.get('/admin', async (req, res) => {
    try {
        const id = req.params.postId
        // const articles = await query("SELECT postId, title, description, content,  image, dateCreated, status, userId, CategoryId FROM post WHERE postId =  '" + id + "';")
        // const articles = await query("SELECT p.postId, p.title, p.description, p.content, p.image, p.dateCreated, p.status, p.backImage, u.userId, c.Name FROM post as p JOIN user as u on p.userId = u.userId JOIN Category as c on p.CategoryId = c.CategoryId WHERE postId = '"+ id +"';")
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
                        await query("insert into post (title, content, description, status, image, backImage, userId, CategoryId, dateCreated) values (?, ?, ?, ?, ?, ?, 1, ?, NOW() );", [title, content, description, status, images, img, user, Category, dateCreated])
                            res.redirect("/dashboard/admin")
                    } catch (err) {
                        res.send(err)
                    } 
                });
            }
        });
    }
});

/////////////  Pour supprimer un Article   //////////////

router.delete('/admin/:postId', async (req, res) => {
    try {
        const id = req.params.postId
        const articles = await query("DELETE FROM post WHERE postId = '" + id + "';")
            res.redirect("/dashboard/admin")
    } catch (err) {
        res.send(err)
    }
});


/////////////  Pour Modifier un Article   //////////////

router.put('/admin/:postId', async(req, res) => {
    let id = req.params.postId
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
                        await query("UPDATE post SET title = '"+ title +"', content = '"+ content +"', description = '"+ description +"', status = '"+ status +"', image = '"+ images +"', backImage = '"+ img +"', userId = '"+ user +"', CategoryId = '"+ Category +"', dateCreated = '"+ dateCreated +"' WHERE postId = '" + id +"' ");
                        res.redirect("/dashboard/admin")
                    } catch (err) {
                        res.send(err)
                    } ;
                });
            }
        });
    }
});

////////////////////////////////////////////////////////////////////
//////////////////////// UTILISATEUR  //////////////////////////////
////////////////////////////////////////////////////////////////////

router.get('/users', async (req, res) => {
    try {
        const users = await query("SELECT * FROM user")
        res.render("users", {
            users
        });
    } catch (err) {
        res.send(err)
    }
});


module.exports = router;