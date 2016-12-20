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
      return console.error('Error creating user', err);
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
      return console.error('Error fetching client from pool', err);
    } 

    client.query('INSERT INTO polls (title, created_at, created_by, url, private) VALUES ($1, $2, $3, $4, $5) RETURNING id;', 
                  [body.title, new Date(), (body.createdBy || 0), body.url.toLowerCase(), (body.private || 0)], ( err, results ) => {
      if(err) {
        done();
        res.status(500).send("Error");
        return console.error('Error creating poll', err);
      } else {
        let pollId = results.rows[0].id;
        //TODO check to see if options are not empty
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
  pg.query('INSERT INTO votes ( option_id, user_id, comments_id, polls_id) VALUES ($1, $2, $3, $4);', 
            [(body.optionid || null), (body.userid || 0), (body.commentid || null), (body.pollid || null)], ( err, results ) => {
    if(err){
      res.status(500).send("Error creating vote");
      return console.error('error creating vote', err);
    } else {
      res.status(201).send(results.rows);
    }
  })
})

app.get('/polls/:title', ( req, res ) => {
  const title = req.params.title;
  let pollData;
  pg.connect( ( err, client, done ) => {
    if(err) {
      done();
      res.status(500).send("Error");
      return console.error('Error fetching client from pool', err);
    } 
    client.query(`SELECT polls.id as poll_id, polls.title, polls.url, polls.private, polls.created_at, 
                    polls.created_by, COUNT(votes.polls_id) as votes
                  FROM polls 
                  INNER JOIN votes 
                  ON polls.id = votes.polls_id 
                  WHERE polls.url = $1
                  GROUP BY polls.id`, [title],(err, results) => {
        if(err){
        done();
        res.status(500).send("Error retrieving poll");
        return console.error('error retrieving poll', err);
      } else if( results.rows.length < 1 ){
        done();
        res.status(404).send("<html><body><h1>404</h1><p>Error locating poll</p></body></html>")
      } else {
        pollData = results.rows[0];
        client.query(`SELECT options.option, COUNT(votes.option_id) 
                        FROM options 
                        LEFT OUTER JOIN votes 
                        ON options.id = votes.option_id 
                        WHERE options.poll_id = $1 
                        GROUP BY options.id;`, 
          [pollData.poll_id], ( err, results ) => {
            if(err){
              done();
              res.status(500).send("Error retrieving options");
              return console.error("Error retreiving options", err);
            } else {
              done();
              pollData.options = results.rows;
              res.status(200).send(pollData);
            }
          }
        )
      }
    })
  })
})



