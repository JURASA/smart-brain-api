const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '48edb7bf44a742768532725b389f43e2' 
  });


const handleApiCall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('unable to work with API'));
}
  

const handleImages = (req, res, db) => {
    const { id } = req.body;
    // WHERE column_name = some_value;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.status(400).json('unable to get entries'));
 }

 module.exports = {
     handleImages,
     handleApiCall
 }

