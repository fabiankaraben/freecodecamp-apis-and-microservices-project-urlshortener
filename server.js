require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// URL storage
let urls = [];

// GET 'shorturl' endpoint
app.get('/api/shorturl/:idx', function(req, res) {
  if (urls[req.params.idx] !== undefined) {
    res.redirect(urls[req.params.idx]);
  }
});

// POST 'shorturl' endpoint
app.post('/api/shorturl', function(req, res) {
  // Validate URL
  if (!isValidHttpUrl(req.body.url)) {
    res.json({ error: 'invalid url' });
    return;
  }

  // Add URL 
  if (urls.indexOf(req.body.url) === -1) {
    urls.push(req.body.url);    
  }

  res.json({
    original_url : req.body.url,
    short_url : urls.indexOf(req.body.url)
  });
});

function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
