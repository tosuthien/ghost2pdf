var express = require('express');
var router = express.Router();
const fs = require('fs');
const pdf = require('html-pdf');
const axios = require('axios');
const { Readable } = require('stream')

const GHOST_URL = process.env.GHOST_URL
const GHOST_API_KEY = process.env.GHOST_API_KEY

const defaultOption = {
  border: {
      top: "10mm",
      right: "5mm",
      bottom: "10mm",
      left: "7mm"
    },
}

/* GET home page. */
router.get('/books', (req, res, next) => {
  axios.get(`${GHOST_URL}/ghost/api/v3/content/posts/?key=${GHOST_API_KEY}`)
  .then( (response) => {
    // handle success
    res.json(response.data);
  })
  .catch( (error) => {
    // handle error
    res.json({error: error.message});
  })
  .then( () => {
    // always executed
  });
});


router.get('/books/:postId', (req, res, next) => {
  const {postId} = req.params
  const {w = 450,h = 800} = req.query;
  const options = {
    ...defaultOption,
    width: `${w}mm`, height: `${h}mm`
  }
  axios.get(`${GHOST_URL}/ghost/api/v3/content/posts/${postId}?key=${GHOST_API_KEY}`)
  .then( (response) => {
    pdf.create(response.data.posts[0]['html'], options).toStream((err, stream) => {
      if (err) return res.end(err.stack)
      res.setHeader('Content-type', 'application/pdf')
      stream.pipe(res)
    })

  })
  .catch( (error) => {
    // handle error
    res.json({error: error.message});
  })
  .then( () => {
    // always executed
  });
})

module.exports = router;
