'use strict'

const express = require('express');
const pg = require('./dbconfig').pool;
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const server = app.listen(port, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`listening at: http://${host}:${port}`);
})

app.post('/create/user', ( req, res ) => {
  const body = req.body;
  pg.query('INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING id;', [body.username, body.email, body.password], (err, results) => {
    if(err){
      res.status(500).send("Error creating user");
      return console.error('error creating user', err);
    } else {
      res.status(201).send(results.rows[0]);
    }
  })
});


app.post('/create/survey', (req, res) => {
  //builds a query for each option
  const pollQueryBuilder = function(id, options){
    let queryString = 'INSERT INTO options (poll_id, option) VALUES';
    for(let i = 1; i <= options; i++ ){
      queryString = queryString + `(${id}, $${i})` + (i !== options ? ', ' : ';')
    }
    return queryString;
  }

  const body = req.body;
  pg.connect( (err, client, done) => {
    if(err) {
      done();
      return console.error('error fetching client from pool', err);
    } 

    client.query('INSERT INTO polls (title, created_at, created_by, url, private) VALUES ($1, $2, $3, $4, $5) RETURNING id;', 
                  [body.title, new Date(), (body.createdBy || 0), body.url.toLowerCase(), (body.private || 0)], ( err, results ) => {
      if(err) {
        done();
        res.status(500).send("Error");
        return console.error('error running query 1', err);
      } else {
        let pollId = results.rows[0].id;
        let optionsQuery = pollQueryBuilder(pollId, body.options.length);
        client.query(optionsQuery, body.options, ( err, results ) => {
          done();
          if(err) {
            res.status(500).send("Error");
            return console.error('error running query 2', err);
          } else {
            res.status(201).send('created');
          }
        });
      }
    })
  });
});

app.post('/create/comment', ( req, res ) => {
  const body = req.body;
  pg.query('INSERT INTO comments (user_id, polls_id, comment) VALUES ($1, $2, $3);', [body.userid, body.pollid, body.comment],( err, results ) => {
    if(err){
      res.status(500).send("Error creating comment");
      return console.error('error creating comment', err);
    } else {
      res.status(201).send(results.rows[0]);
    }
  })
});

app.post('/vote', ( req, res ) => {
  const body = req.body;
  pg.query('INSERT INTO votes ( option_id, user_id, comments_id, polls_id, type) VALUES ($1, $2, $3, $4);', 
            [(body.optionid || null), (body.userid || 0), (body.commentid || null), (body.pollid || null)], ( err, results ) => {
    if(err){
      res.status(500).send("Error creating vote");
      return console.error('error creating vote', err);
    } else {
      res.status(201).send(results.rows);
    }
  })
})



