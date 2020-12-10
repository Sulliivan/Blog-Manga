module.exports = async(req, res, next)=>{
    const idRoles = req.session.roleId
    try{
        const verif = await query("SELECT * FROM user WHERE roleId = 1",[idRoles])
        if(req.session.roleId === 1){
            next()
            console.log(verif);
        }else {
            res.redirect('/users/login')
        }
    }catch(err){
        res.send(err)
    }
}








