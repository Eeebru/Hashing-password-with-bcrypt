const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');


router.get('/', async (req, res, next)=> {

  try {
    const result = await db.query('SELECT * FROM users');
    return res.json(result.rows);
  } catch (err) {
    next(err);
  }
});


router.post('/', async (req, res, next)=> {
  const becrypt = await bcrypt.hash(req.body.password, 10);
  const queryy = {
    text: 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
    values: [req.body.name, becrypt],
  }
  
  try {
    const result = await db.query(queryy);
    return res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }

});



module.exports = router;