const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;

    // if either of these three inputs are blank...
    if (!email || !name || !password){
        // we are returning so that the function stops executing code below this block
        return res.stats(400).json('incorrect form submission');
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Before we augment the users table, we want to do something called 
    // transaction where we won't update the users table until the login
    // table is also updated. You always create a transaction when you
    // have to do more than two things at once, or in other words, 
    // it's mandatory to update multiple tables given one table is updating
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return db('users')
            // Before the ".then" method occurs, we are essentially saying 
            // we will be returning all columns, but first, insert these values
            // to their associated columns wihtin the database
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                // Always remember to add a response or you'll leave express hanging
                // In this case our data would have never been entered since the 
                // response would have never been resolved
                .then(user => {
                    // We wanna make sure that we're not returning an array and
                    // rather, just an object.
                    res.json(user[0]);
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
    .catch(err => res.status(400).json("unable to register"));
    
}

module.exports = {
    handleRegister: handleRegister
}