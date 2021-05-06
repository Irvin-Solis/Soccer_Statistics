require('dotenv').config()

const express = require('express');
const cors = require('cors');
const connection = require('./database');

const app = express();
const port = 3001;

app.use(cors());

app.get('/api/status', (req, res) => res.send('Working!'));

app.route('/api/TestTable')
  .get((req, res, next) => {
    connection.query(
      "select * from Team",
      function(error, results, fields) {
        if (error) throw error;
        console.log(res.json(results));
        
      }
    );
  });

  app.route('/api/TeamNames')
  .get((req, res, next) => {
    connection.query(
      "select Team_NAme from Team",
      function(error, results, fields) {
        if (error) throw error;
        console.log(res.json(results));
        
      }
    );
  });

// Stored Procedures

app.route('/api/knockout_teams')
  .get((req, res) => {
    connection.query(
      ` CALL sp_knockout_teams()`,
      function(error, results, fields) {
        if (error) throw error;
        console.log(res.json(results));
        
      }
    );
  });

  app.route('/api/Team_wins/:teamName')
  .get((req, res) => {
    connection.query(
      `CALL sp_win_loss(?)`, req.params.teamName,
      function(error, results, fields) {
        if (error) throw error;
        console.log(res.json(results));
      }
    );
  });

  app.route('/api/tie_games')
  .get((req, res) => {
    connection.query(
      `CALL sp_tie_game()`,
      function(error, results, fields) {
        if (error) throw error;
        console.log(res.json(results));
      }
    );
  });

  app.route('/api/high_score')
  .get((req, res) => {
    connection.query(
      `CALL sp_high_score()`,
      function(error, results, fields) {
        if (error) throw error;
        console.log(res.json(results));
      }
    );
  });

  app.route('/api/low_score')
  .get((req, res) => {
    connection.query(
      `CALL sp_low_score()`,
      function(error, results, fields) {
        if (error) throw error;
        console.log(res.json(results));
      }
    );
  });

  app.route('/api/team_grouping/:teamName')
  .get((req, res) => {
    connection.query(
      `CALL sp_team_group(?)`, req.params.teamName,
      function(error, results, fields) {
        if (error) throw error;
        console.log(res.json(results));
      }
    );
  });

  app.route('/api/team_group_score/:teamName')
  .get((req, res) => {
    connection.query(
      `CALL sp_group_score(?)`, req.params.teamName,
      function(error, results, fields) {
        if (error) throw error;
        console.log(res.json(results));
      }
    );
  });
// group name is : Group%20#someNumber
  app.route('/api/groups/:groupName')
  .get((req, res) => {
    connection.query(
      `CALL sp_teamsingroupstage(?)`, req.params.groupName,
      function(error, results, fields) {
        if (error) throw error;
        console.log(res.json(results));
      }
    );
  });

  app.route('/api/group_score/:groupName')
  .get((req, res) => {
    connection.query(
      `CALL sp_all_team_group_score(?)`, req.params.groupName,
      function(error, results, fields) {
        if (error) throw error;
        console.log(res.json(results));
      }
    );
  });  
  
  app.route('/api/team/:teamName')
  .get((req, res) => {
    connection.query(
      `CALL sp_roster(?)`, req.params.teamName,
      function(error, results, fields) {
        if (error) throw error;
        console.log(res.json(results));
      }
    );
  });
//firstname&lastname
  app.route('/api/player/:firstname&:lastname')
  .get((req, res) => {
    connection.query(
      `CALL sp_playergoals(?,?)`, [req.params.firstname,req.params.lastname],
      function(error, results, fields) {
        if (error) throw error;
        console.log(res.json(results));
      }
    );
  });

  app.route('/api/winner')
  .get((req, res) => {
    connection.query(
      `CALL sp_winner()`,
      function(error, results, fields) {
        if (error) throw error;
        console.log(res.json(results));
      }
    );
  });

  app.route('/api/semifinals')
  .get((req, res) => {
    connection.query(
      `CALL sp_semifinals()`,
      function(error, results, fields) {
        if (error) throw error;
        console.log(res.json(results));
      }
    );
  });

  app.route('/api/teamProgress/:teamName')
  .get((req, res) => {
    connection.query(
      `CALL sp_teamProgress(?)`, req.params.teamName,
      function(error, results, fields) {
        if (error) throw error;
        console.log(res.json(results));
      }
    );
  });

  app.route('/api/goldenBoot')
  .get((req, res) => {
    connection.query(
      `CALL sp_goldenBoot()`,
      function(error, results, fields) {
        if (error) throw error;
        console.log(res.json(results));
      }
    );
  });

  app.route('/api/winnerMatches')
  .get((req, res) => {
    connection.query(
      `CALL sp_winnerWasInGames()`,
      function(error, results, fields) {
        if (error) throw error;
        console.log(res.json(results));
      }
    );
  });

app.listen(port, () => console.log(`server started ${port}`))