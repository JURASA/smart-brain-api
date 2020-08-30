const handleProfileGet = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
        .then(user => {
            // given the id that was entered, the array should have a 
            // length greate than 0, therefore, user.length should be true
            if(user.length){
                // we receive a json object array, but we only want the
                // the one user, so we just say user[0]
                res.json(user[0]);
            } else {
                res.status(400).json('Not found');
            }
        })
        .catch(err => res.status(400).json('error getting use'));

 }

module.exports = {
    handleProfileGet
}
