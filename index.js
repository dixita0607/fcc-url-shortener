const express = require('express');
const app = express();

const validUrl = require('valid-url');

const redirections = [];

app.use(express.static('.'));

app.get(/^\/\d+$/, (req, res) => {
  const url = redirections[req.originalUrl.slice(1)];
  if(url) res.redirect(url);
  else res.json({error: 'Not in database.'});
});

app.get(/^\/.*/, (req, res) => {
  const url = validUrl.isWebUri(req.originalUrl.slice(1));
  if (!url) {
    res.json({error: 'Invalid URL.'});
    return;
  }
  let index =  redirections.indexOf(url);
  if (index < 0) {
    redirections.push(url);
    index = redirections.length - 1;
  }
  res.json({original_url: url, short_url: process.env.PUBLIC_ADDRESS + '/' + index});
});

app.listen(8080);