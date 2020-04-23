const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var User = require('../user_info/userinfo.modal');

const responeObj = {
  data: new Object(),
  error:new Object(),

};

const response = Object.create(responeObj);



router.post("/signup", (req, res) => {
    User.find({ email: req.body.email})
      .exec()
      .then(user => {
        console.log(req.body.email)
        console.log('=======',user)
        console.log(user.length)
        if (user.length >= 1) {
          response.data = null;
          response.error = "Email Already Exists";
          res.status(400);
          res.send(response);
        } 
             else {
              const user = new User({
                 _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
				fname:req.body.fname,
                user_name:req.body.user_name,
				image:req.body.image,
        password:req.body.password ,
				 
              });
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
  
  router.post('/login',(req,res,next)=>{
    User.find({ email: req.body.email})
       .exec()
      .then(user => {
        if (user.length >= 1) {
         if(user[0].password == req.body.password){
          response.data = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
          response.error = null;
          res.send(response);
         }
         else{
          response.data = null;
          response.error = "Email and Password are Incorrect";
          res.status(400);
                  res.send(response);
         }
        } 
            //  else {
            //     res.status(500);
            //     return next(err);
            // }
          });
      });




module.exports = router;