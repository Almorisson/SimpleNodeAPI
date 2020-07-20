const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

exports.user_register = (req, res) => {
  let new_user = new User(req.body);

  new_user.save()
  .then(user => {
    res.status(201);
    res.json(user);
  })
  .catch(error => {
    res.status(500);
    console.log(error);
    res.json({message: "Erreur serveur."})
  })
}

exports.user_login = (req, res) => {
  let {body} = req;
  // let body = req.body

  User.findOne({email: body.email})
  .then(user => {
    if(user.password === body.password){
      let userData = {
        email: user.email
      }
      jwt.sign({userData}, process.env.JWT_KEY, {expiresIn: '30 days'}, (error, token) => {
        if(error){
          res.status(500);
          console.log(error);
          res.json({message: "Erreur serveur."});
        }
        else {
          res.json({token});
        }
      })
    }
    else{
      res.status(500);
      res.json({message: "Erreur serveur."})
    }
  })
  .catch(error => {
    res.status(500);
    console.log(error);
    res.json({message: "Erreur serveur."})
  })
}
