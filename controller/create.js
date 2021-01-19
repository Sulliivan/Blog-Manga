const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/account', function(req, res, next){
    res.render('account', { messageError : req.flash('messageError') });
 });

/* enregistrer un utilisateur */
router.post('/account', async (req, res, ) => {
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email
    const password = req.body.password
    const password2 = req.body.password2
    const emailQuery = "SELECT email FROM user WHERE email = '" + email + "';"
 
    if (password2 === password) {
    try {
        const resultEmail = await query(emailQuery)
      if(resultEmail.length > 0) {
                req.flash ('messageError', 'le compte existe deja '),
                res.redirect("/create/account"); 
      }else{
          bcrypt.hash(password, 10, async (err, hash) =>{   // stocker le hashage dans la base de donnée
              /* ajoute dans users */
                await query ("INSERT INTO user (firstname, lastname, email, password, roleId, DateInscription ) VALUES ('" + firstname + "', '" + lastname + "', '"+ email +"', '" + hash +"', '2', NOW() )",);
                res.redirect('/users/login')
            })    
        }
    }catch(err) {
        res.send(err)
    }
 }else { 
    req.flash ('messageError', 'Mot de passe pas identique'),
    res.redirect("/create/account");
}
});


module.exports = router;