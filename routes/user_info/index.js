const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

var User = require('../user_info/userinfo.modal');

const responeObj = {
  data: new Object(),
  error: new Object(),

};

const response = Object.create(responeObj);

// role checks code
const { roles } = require('./../../roles')

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}


exports.grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
      return res.status(401).json({
        error: "You need to be logged in to access this route"
      });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
// role check code end

router.post("/signup", (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then(async user => {
      console.log(req.body.email)
      console.log('=======', user)
      console.log(user.length)
      if (user.length >= 1) {
        response.data = null;
        response.error = "Email Already Exists";
        res.status(400);
        res.send(response);
      }
      else {
        let password = req.body.password;
        const hashedPassword = await hashPassword(password);
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          fname: req.body.fname,
          user_name: req.body.user_name,
          image: req.body.image,
          password: hashedPassword,
          role: req.body.role || "basic"
        });
          console.log("user id",user);

        const accessToken = jwt.sign({ userId: user._id }, 'naveedaslambaloach', {
          expiresIn: "1d"
        });
        user.accessToken = accessToken;
        user
          .save()
          .then(result => {
            console.log(result);
            res.send(result);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
      }
    });

});

router.post('/login', (req, res, next) => {


  User.find({ email: req.body.email })
    .exec()
    .then(async user => {
      console.log("user response", user);

      if (user.length >= 1) {
        console.warn('got user',req.body,user.password);
        const validPassword = await validatePassword(req.body.password,user[0].password);
        if (!validPassword)
        return next(new Error('Password is not correct'))
        else
         {
          console.log("user id login",user);
          const accessToken = jwt.sign({ userId: user._id }, 'naveedaslambaloach', {
            expiresIn: "1d"
           });
           res.status(200).json({
            data:  accessToken,
            error:null
           })
          // response.data = accessToken;
          // response.error = null;
          // res.send(response);
        }
        // else {
        //   response.data = null;
        //   response.error = "Email and Password are Incorrect";
        //   res.status(400);
        //   res.send(response);
        // }
      }
      else {
        res.status(500);
        return next("user not exist");
      }
    }).catch(e => {
      console.log("error", e);

      return next(e);
    });
});




module.exports = router;