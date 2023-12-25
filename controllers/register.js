const handleRegister = (db, bcrypt) => (req, res) => {
    const {email, password, name} = req.body;
    if(!email || !password || !name){
        return res.status(400).json("Please enter your details.")
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return db('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            }).then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {res.status(400).json("Unable to regoster.")})
}

module.exports = {
    handleRegister: handleRegister
}