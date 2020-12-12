const express = require('express');
const router = express.Router();


router.get('/index', async (req, res) => {
        const articles = await query ("SELECT postId, title, description, content, image, dateCreated, status, userId, CategoryId FROM post")
        const ListeManga = await query("SELECT m.mangaId, m.title, m.image, m.content, m.dateCreated, a.name, mc.name AS genre FROM manga as m JOIN mangaCategory as mc on m.mangaCategoryId = mc.mangaCategoryId JOIN author as a on m.authorId = a.authorId WHERE mangaId;")

        res.render("index", {
                 articles,
                 ListeManga
                })
  });

module.exports = router;