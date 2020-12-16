const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const app = express();
app.use(fileUpload());


//////////////   DASHBOARD ARTICLE   //////////////


// METHODE GET //
//// Affiche les articles dans Dashboard Article Admin //////
router.get('/admin', async (req, res) => {
    try {
        const articles = await query("SELECT postId, title, description, content, image, dateCreated, status, userId, CategoryId FROM post ")
        console.log();
        res.render("admin" , {
            articles
        })
    }catch(err){
        res.send(err)
    }
});


// METHODE POST //
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
                        await query("insert into post (title, content, description, status, image, backImage, userId, CategoryId, dateCreated) values (?, ?, ?, ?, ?, ?, 1, ?, NOW() );", [title, content, description, status, images, img, user, Category])
                            res.redirect("/dashboard/admin")
                    } catch (err) {
                        res.send(err)
                    } 
                });
            }
        });
    }
});


// METHODE DELETE //
/////////////  Pour supprimer un Article par ID  //////////////

router.delete('/admin/:postId', async (req, res) => {
    try {
        const id = req.params.postId
        const post = await query("DELETE FROM post WHERE postId = '" + id + "';")
        req.flash('MessageSuccess', 'Article Supprimé'),
            res.redirect("/dashboard/admin")
    } catch (err) {
        res.send(err)
    }
});


////////////////////////////////////////////////////////////////////
//////////////////////// UPDATE UN ARTICLE PAR L'ID  ///////////////
////////////////////////////////////////////////////////////////////


// METHODE GET //
///// Affiche Article par Id dans la page /Dashboard/updateArticle //////
router.get('/updateArticle/:postId', async (req, res) => {
    try {
        const id = req.params.postId
        const articles = await query("SELECT postId, title, description, content, image, dateCreated, status, userId, CategoryId FROM post WHERE postId = '"+id+"' ;")
        res.render("updateArticle" , {
            articles
        })
    }catch(err){
        res.send(err)
    }     
});

// METHODE UPDATE //
/////////////  Pour Modifier un Article avec sont Id  //////////////
router.put('/updateArticle/:postId', async(req, res) => {
    let id = req.params.postId
    let title = req.body.title
    let content = req.body.content
    let description = req.body.description
    let imageUpload = req.files.image
    let imageBack = req.files.backImage
    let images = `/images/${imageUpload.name}`
    let img = `/images/${imageBack.name}`

    if (imageUpload.mimetype === "image/jpeg" || imageUpload.mimetype === "image/jpg" || imageUpload.mimetype === "image/gif" || imageUpload.mimetype === "image/png") {
        imageUpload.mv(`public/images/${imageUpload.name}`, async function (err) {
            if (err) {
             //   return res.status(500).send(err)
             res.json("ok1")
            // console.log(1);
            }
            if (imageBack.mimetype === "image/jpeg" || imageBack.mimetype === "image/jpg" || imageBack.mimetype === "image/gif" || imageBack.mimetype === "image/png") {
                imageBack.mv(`public/images/${imageBack.name}`, async function (err) {
                    if (err) {
                       // return res.status(500).send(err); 
                       res.json("ok2")
                        //console.log(2);
                    } 
                    try {
                         await query("UPDATE post SET title = '"+ title +"', content = '"+ content +"', description = '"+ description +"', image = '"+ images +"', backImage = '"+ img +"'  WHERE postId = '"+ id +"'; ")
                        // await query("UPDATE post SET title = ?, content = ?, description = ?, image = ?, backImage = ?, WHERE postId = ?",[ title, content, description, images, img ])
                         res.redirect("/dashboard/admin")
                      // console.log(3);
                    } catch (err) {
                        res.send(err) 
                       // res.json("Error")
                        console.log(4);
                    } ;
                });
            }
        });
    }
});

//////////////////////////////////////////////////////////////////////////////////////

// router.put('/updateArticle/:postId', async(req, res) => {
//     let id = req.params.postId
//     let title = req.body.title
//     let content = req.body.content
//     let description = req.body.description
//     let dateCreated = req.body.dateCreated
//     let status = req.body.status
//     let user = req.body.userId
//     let Category = req.body.CategoryId
//  console.log(0);
//         if (!title ||  !content){
//             res.json('remplissez tout les champs')
//         };
//         if(!req.files){
//             try{
//                 await query("UPDATE post SET title = ?, content = ?, description = ?, dateCreated = now(), status = 0  userId, = ?, CategoryId = ? WHERE postId = ?",[id, title, content, description, dateCreated, status, user, Category ])
//                 //res.json("Article a bien été mis a jour mais pas l'image")
//                 res.redirect("/dashboard/admin")
//                 console.log(1);
//             }catch(err){
//                 res.send(err)
//             }
//         }
//         let imageUpload = req.files.image
//         let imageBack = req.files.backImage
//         let images = `/images/${imageUpload.name}`
//         let img = `/images/${imageBack.name}`

//             if (imageUpload.mimetype === "image/jpeg" || imageUpload.mimetype === "image/jpg" || imageUpload.mimetype === "image/gif" || imageUpload.mimetype === "image/png") {
//         imageUpload.mv(`public/images/${imageUpload.name}`, async function (err) {
//             if (err) {
//               return res.status(500).send(err)
             
//             }
//             if (imageBack.mimetype === "image/jpeg" || imageBack.mimetype === "image/jpg" || imageBack.mimetype === "image/gif" || imageBack.mimetype === "image/png") {
//                 imageBack.mv(`public/images/${imageBack.name}`, async function (err) {
//                     if (err) {
//                      return res.status(500).send(err); 
//                     }
//                     try{
//                         await query("UPDATE post SET image = ?, backImage = ?, title = ?, content = ?, description = ?, dateCreated = now(), status = 0  userId, = ?, CategoryId = ? WHERE postId = ?",[images, img, title, content, description, dateCreated, status, user, Category, id])
//                        // res.json("l'article a bien été mis a jour avec l'image")
//                         res.redirect("/dashboard/admin")
//                         console.log(2);
//                     }catch(err){
//                         res.send
//                     }
//                 });
//             }
//         });
//     }
// });

////////////////////////////////////////////////////////////////////
//////////////////////// LISTE MANGA  //////////////////////////////
////////////////////////////////////////////////////////////////////
/////////////  affiche liste Manga dans le dashboard ///////////////
////////////////////////////////////////////////////////////////////

router.get('/listeManga', async (req, res) => {
    try {
        const Category = await query ("SELECT * FROM mangaCategory")
        const ListeManga = await query("SELECT m.mangaId, m.title, m.image, m.content, m.dateCreated, a.name, mc.name as genre FROM manga as m JOIN mangaCategory as mc on m.mangaCategoryId = mc.mangaCategoryId JOIN author as a on m.authorId = a.authorId;")
        res.render("listeManga", ({
            Category,
            ListeManga,
            messageSuccess: req.flash('MessageSuccess'),
            MessageError: req.flash('MessageError'),
        }));
    } catch (err) {
        res.send(err)
    }
});


// Creer la liste des manga //
router.post('/listeManga', async (req, res) => {

    let title = req.body.title
    let content = req.body.content
    let author = req.body.author
    let mangaCategory = req.body.mangaCategory
    let imageUpload = req.files.image
    let images = `/images/${imageUpload.name}`
    console.log(0);
    if (imageUpload.mimetype === "image/jpeg" || imageUpload.mimetype === "image/jpg" || imageUpload.mimetype === "image/gif" || imageUpload.mimetype === "image/png") {
        imageUpload.mv(`public/images/${imageUpload.name}`, async function (err) {
            if (err) {
                return res.status(500).send(err)
            }console.log(11);
            try {   
                await query ("INSERT INTO mangaCategory ( name ) VALUES (?);", [ mangaCategory])
                const SelectCategory = await query ("SELECT mangaCategoryId FROM mangaCategory WHERE name = ?", [ mangaCategory] )
                // console.log(SelectCategory[0].mangaCategoryId);
                await query ("INSERT INTO author ( name ) VALUES (?);", [author])                               
                const SelectAuthor = await query ("SELECT authorId FROM author WHERE name = ?", [ author] )
                await query ("INSERT INTO manga (title, content, image, mangaCategoryId, authorId) VALUES (?,?,?,?,?);", [title, content, images, SelectCategory[0].mangaCategoryId, SelectAuthor[0].authorId])
               
                    req.flash('MessageSuccess', 'ajouté à la liste')
                    res.redirect("/dashboard/listeManga")
                    
                    console.log(22);
            } catch (err) {
                console.log(err);
                req.flash('MessageError', 'Error')
                res.redirect("/dashboard/listeManga")
            }
        });
    }
});

/* delete une ligne Liste */

router.delete('/ListeManga/:mangaId', async (req, res) => {
    try {
        const id = req.params.mangaId
        const ListeManga = await query("DELETE FROM manga WHERE mangaId = '" + id + "';")
            req.flash('MessageSuccess', "L'articles à été supprimé"),
            res.redirect("/dashboard/listeManga")
        } catch (err) {
        res.send(err)
    }
});



////////////////////////////////////////////////////////////////////
//////////////////////// UTILISATEUR  //////////////////////////////
////////////////////////////////////////////////////////////////////

router.get('/users', async (req, res) => {
    try {
        const users = await query("SELECT *, DATE_FORMAT(DateInscription, '%d/%m/%Y %H:%i:%s') FROM user")
        res.render("users", {
            users
        });
    } catch (err) {
        res.send(err)
    }
});


///////////////////////////////////////////////////////
/////////////   DASHBOARD MESSAGE   //////////////////
/////////////////////////////////////////////////////

///// Recupere et affiche le message dans dashboardMessage //////
router.get('/message', async (req, res) => {
    try {
        const id = req.params.id
        const Contact = await query("SELECT id, name, email, phone, message, DATE_FORMAT(date, '%d/%m/%Y %H:%i:%s') AS date FROM contact;")
        res.render("message", ({
            Contact,
            messageSuccess: req.flash('MessageSuccess'),
        }));
    } catch (err) {
        res.send(err)
    }
});


// supprime message dans dashboard //
router.delete('/message/:id', async (req, res) => {
    try {
        const id = req.params.id
        const contact = await query("DELETE FROM contact WHERE id = '" + id + "';")
            req.flash('MessageSuccess', "Message supprimé"),
            res.redirect("/message")
    } catch (err) {
        res.send(err)
    }
});


module.exports = router;