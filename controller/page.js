const express = require('express');
const router = express.Router();

// PAGE INDEX ----- CONTACT ---------//
// METHODE GET //
// RÉCUPERE LES DONNÉE DE LA TABLE POST ET MANG//
router.get('/index', async (req, res) => {
        const articles = await query ("SELECT postId,title, description, content, image, DATE_FORMAT(dateCreated, '%d/%m/%Y %H:%i:%s') dateCreated FROM post")
        const ListeManga = await query("SELECT m.mangaId, m.title, m.image, m.content, m.dateCreated, a.name, mc.name AS genre FROM manga as m JOIN mangaCategory as mc on m.mangaCategoryId = mc.mangaCategoryId JOIN author as a on m.authorId = a.authorId WHERE mangaId;")

        res.render("index", {
                 articles,
                 ListeManga
                })
  });


//////////////////////////////////////////////////////
// PAGE INDEX ----- CONTACT ---------//
// METHODE POST //
// CREER UN MESSAGE POUR L'ADMIN//
router.post('/index', async (req, res) => {
  const Name = req.body.name
  const Email = req.body.email
  const Phone = req.body.phone
  const Message = req.body.message
  const date = req.body.date
  try{
         await query ("INSERT INTO contact (name, email, phone, message, date ) VALUES (?,?,?,?, now() );", [Name, Email , Phone , Message, date])
         res.redirect("/page/index")
       
  }catch (err){ 
         res.send(err)
  }
});


module.exports = router;