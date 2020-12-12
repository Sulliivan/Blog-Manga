const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const verifAuth = require('../middleware/auth.middleware');
const session = require('express-session');
//////////////////////////////////////////////////////
//////////// Connexion d'un utilisateur  /////////////
router.get('/login', function(req, res, next) {
	res.render('login', { messageSuccess : req.flash('message') });
  });

  
router.post('/login',async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
  
  await query('SELECT * FROM user WHERE email = ?', [email], (err, result) => {
    if (err || result.length === 0) {   
      return req.flash ('message', 'Mail ou Mot de passe incorrect'),
             res.redirect('/user/login');
    } else {
      bcrypt.compare(password, result[0].password, async (err, success) => {
        if (err) {
          return res.status(401).json({
            error: `Bcrypt Auth failed`
          });
        }
        // console.log("password :", password);
        // console.log("password :",result[0].password);
        
        if (success) {
          await query('SELECT * FROM user WHERE email = ? AND password = ?', [email, result[0].password], function (err, results) {
            if (results.length) {
              req.session.auth = true;
              req.session.userId = result[0].userId;
              req.session.firstname = result[0].firstname;
              req.session.email = result[0].email;
              req.session.roleId = result[0].roleId;
              req.session.DateInscription = result[0].roleId;
              req.session.cookie.expires = false;
              req.session.cookie.maxAge = 24 * 60 * 60 * 7 * 1000;
              res.redirect("/page/index")
             // console.log("login",req.session);
             // console.log(result[0]);
            } else {
              res.send('err');
            }
          });
        } else {
          res.send('Email ou mot de passe incorrect !');
        }
      })
    };
  })
})


//////////////////////////////////////////////////////
//////////// recupere profil d'un user ///////////// OK //

router.get('/profil/:userId',verifAuth, async(req, res) => {
  try{
    const id = req.params.userId
    const profil = await query ("SELECT * FROM user WHERE userId = '"+ id +"' ;")
    res.render("profil",{ 
      profil 
    });
  }catch (err){
    res.send(err)
  }
});

//////////////////////////////////////////////////////
/////////// Changer mot de passe d'un user ///////// //

router.put('/profil/:userId', async(req, res) => {
    const id = req.params.userId;
    const mdp = req.body.password;
    const email = req.body.email;

      await query ("UPDATE user SET password = '" + mdp + "' , email = '"+ email +"' WHERE userId = '"+ id +"'", [email], (err, result) => {
        if (err || result.length === 0) {   
          return req.flash ('message', 'Mail ou Mot de passe incorrect'),
                res.redirect('/users/login');
        } else  {
          bcrypt.compare(mdp, result[0].password, async (err, success) => {
            if (err) {
              return res.status(401).json({
                error: `Bcrypt Auth failed`
              });
            }
            if (success) {
              await query('SELECT * FROM user WHERE email = ? AND password = ?', [email, result[0].password], function (err, results) {
                if (results.length) {
                  req.session.auth = true;
                  req.session.userID = result[0].id;
                  req.session.userName = result[0].firstname;
                  req.session.email = result[0].email;
                  req.session.roles = result[0].rolesId;
                  req.session.cookie.expires = false;
                  req.session.cookie.maxAge = 24 * 60 * 60 * 7 * 1000;
                  res.redirect("/page/index")
                } else {
                  res.send('err');
                }
              });
            } else {
              res.send('Email ou mot de passe incorrect !');
            }
          })
        };
  })
})


//////////////////////////////////////////////////////
//////////////////// Delete User ///////////////////////
////// users qui efface ces données ////// OK  //

router.delete('/profil/:userId', async (req, res) => {
    try{
        const id = req.params.userId
        const user = await query ("DELETE FROM user WHERE userId = '"+ id +"';")
         req.session.destroy()
        res.redirect("/page/index");
        console.log(user);
    }catch (err){
        res.send(err)
    }
  });



//////////////////////////////////////////////////////
///////////////// Deconnexion d'un user ////////// OK //

router.get('/logout',(req, res) => {
  req.session.destroy()
  res.redirect("/page/index")
  }
)

module.exports = router;
