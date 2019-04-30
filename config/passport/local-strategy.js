const passport =require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../../models/user-model');

passport.use(new LocalStrategy({
  usernameField: 'email', 
  passwordField:'originalPassword'
},(email, password, next) => {
  User.findOne({ email })
  .then(userFromDb => {
    if(!userFromDb){
      return next(null, false, { message: 'Incorrect email!' })
    }

    if(userFromDb.encryptedPassword){
      if(!bcrypt.compareSync(password, userFromDb.encryptedPassword)){
        return next(null, false, { message: 'Incorrect password!' })
      }
    } 
    return next(null, userFromDb)
  })
  .catch( err => next(err))
}));