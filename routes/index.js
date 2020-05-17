var express = require('express');
var router = express.Router();
const fs = require('fs');
const tmpl = fs.readFileSync(require.resolve('./card.html'), 'utf8');
const pdf = require('html-pdf');
const axios = require('axios');
const { Readable } = require('stream')

const GHOST_URL = 'https://tosu-thien.com'
const GHOST_API_KEY = '22f02f889379cdfd103fdd5a29'


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
  const {w,h} = req.query;
  console.log(`w = ${w}, h = ${h}`)
  axios.get(`${GHOST_URL}/ghost/api/v3/content/posts/${postId}?key=${GHOST_API_KEY}`)
  .then( (response) => {
    pdf.create(response.data.posts[0]['html'], {width: `${w}mm`, height: `${h}mm`}).toStream((err, stream) => {
      if (err) return res.end(err.stack)
      res.setHeader('Content-type', 'application/pdf')
      stream.pipe(res)
    })

  })
  .catch( (error) => {
    // handle error
    console.log(error);
  })
  .then( () => {
    // always executed
  });
})

module.exports = router;
