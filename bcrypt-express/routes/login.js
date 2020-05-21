const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;




router.post('/login', async (req, res, next)=> {
  const queryy = {
    text: 'SELECT * FROM users WHERE username = $1 LIMIT 1',
    values: [req.body.name],
  }
  try {
    const foundUser = await db.query(queryy);
    if (foundUser.rows.length === 0) {
      res.json({message : 'Invalid Username'});
    }
    const comparePass = await bcrypt.compare(req.body.password, foundUser.rows[0].password);
    if(comparePass === false) {
      return res.json({message: 'Incorrect Password'})
    }

    const token = jwt.sign(
      {username: foundUser.rows[0].username},
      SECRET,
      {expiresIn: '30m'}
    );

    return res.json({token});
  } catch (err) {
    next(err);
  }
});

//helper Middleware
// const helperMiddleware = (req, res, next) => {
//   try {
//     const authHeaderValue = req.headers.authorization;
//     const token = jwt.verify(authHeaderValue.split(' ')[1], SECRET);
//     return next();
//   }catch(e) {
//     return res.status(401).json({message: 'Unauthorized'})
//   }
// }

//the api

// router.post('/secret', helperMiddleware, async (req, res, next)=> {
//   try {
//     res.json({message: 'you made it!'})
//   } catch (err) {
//     res.json(err);
//   }
// })


//ensuring a correct user
const correctUserhelperMiddleware = (req, res, next) => {
  try {
    const authHeaderValue = req.headers.authorization;
    const token = jwt.verify(authHeaderValue.split(' ')[1], SECRET);
    if(token.username === req.params.username) {
      return next();
    }else {
    return res.status(401).json({message: 'Unauthorized'})
    }
  }catch(e) {
    return res.status(401).json({message: 'Unauthorized'})
  }
}

//the api
router.get('/secret/:username', correctUserhelperMiddleware, async (req, res, next)=> {
  try {
    res.json({message: 'you made it!'})
  } catch (err) {
    res.json(err);
  }
})

module.exports = router;