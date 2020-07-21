const jwt = require('jsonwebtoken');

exports.verify_token = (req, res, next) => {
  let token = req.headers['authorization'];

  if(typeof token !== 'undefined'){
    jwt.verify(token, process.env.JWT_KEY, (error, authData) => {
      if(error){
        res.status(401);
        console.log(token)
        res.json({message: "Accès interdit 1 - " + error})
      }
      else{
        next();
      }
    })
  }
  else{
    res.status(401);
    res.json({message: "Accès interdit 2"})
  }
}
