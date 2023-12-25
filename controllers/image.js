const returnClarifiRequestOptions = (imageUrl) => {
    const PAT = '92fdb111621b45e2b574038b693ba1f3';
    const USER_ID = 'gauravrawal436';
    const APP_ID = 'face-recognition';
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
    const IMAGE_URL = imageUrl;
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
  
    return requestOptions
  }

const handleApi = (req, res) => {
    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifiRequestOptions(req.body.input))
    .then(response => response.json())
    .then(result => {
        res.json(result);
    })
    .catch(err => res.status(400).json("Unable to get API."))
}

const handleImage = (db) => (req, res) => {
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => {res.status(400).json("Unable to fetche entries.")})
}

module.exports = {
    handleImage: handleImage,
    handleApi: handleApi
}