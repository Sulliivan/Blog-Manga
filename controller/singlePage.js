const express = require('express');
const router = express.Router();

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PAGE D'UN ARTICLE //
// METHODE GET //
// RECUPERE ET AFFICHE UN ARTICLE PAR ID//
// RECUPERE ET AFFICHE LES COMMENTAIRES PAR ID //
router.get('/article/:postId', async (req, res) => {
    const id = req.params.postId
    // const id = req.params.commentaireId
    const articles = await query ("SELECT postId, title, description, content, image, backImage FROM post WHERE postId = '"+id+"' ;")
    const commentaire = await query ("SELECT c.content, u.firstname, u.lastname, DATE_FORMAT(c.created, '%d/%m/%Y %H:%i:%s') created FROM commentaire as c join post as p on c.postId = p.postId join user as u on c.userId = u.userId WHERE p.postId = '"+id+"' ;" )
    res.render("article",{
            articles,
            commentaire
        })
 });

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PAGE D'UN ARTICLE //
// METHODE POST //
// CREER UN COMMENTAIRE//
router.post('/article/:postId', async (req, res) => {
    const id = req.params.postId
    const content = req.body.content
    const postId = req.body.postId
    const userId = req.body.userId
    try{
           await query ("INSERT INTO commentaire (content, created, postId, userId) VALUES (?, now(),?,?);", [content, postId, userId])
           res.redirect(`/singlePage/article/${id}`)  
           
    }catch (err){ 
           res.send(err)
    }
  });
  



module.exports = router;