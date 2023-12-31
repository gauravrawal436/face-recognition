const handleSignIn = (db, bcrypt) => (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json("Please enter your details.")
    }
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
        if(isValid){
            return db.select('*').from('users')
                .where('email', '=', req.body.email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('Unable to get user'))
        }
        else{
            res.status(400).json('Incorrect Credintials')
        }
    })
    .catch(err => res.status(400).json('User not found'))
}

module.exports = {
    handleSignIn: handleSignIn
};