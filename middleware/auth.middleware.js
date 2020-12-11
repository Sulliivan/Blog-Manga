module.exports = async(req, res, next)=>{
    const idSession = req.session.userId
   // console.log("idsession:", req.session.userId);
    try{
        const verif = await query("SELECT userId FROM user WHERE userId = ?",[idSession])
        if(verif.length > 0){
            next()
        }else {
            res.redirect('/users/login')
        }
    }catch(err){
        res.send(err)
    }
}






