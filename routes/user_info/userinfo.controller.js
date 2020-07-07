'use strict';
var mongoose = require('mongoose');
var bycrypt = require('bcrypt');
var multer  = require('multer');
var path  = require('path');

    var controller = {}

    const { roles } = require('./../../roles')

    controller.grantAccess = function(action, resource) {
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

controller.allowIfLoggedin = async (req, res, next) => {
 try {
console.log("data to check",res.locals);
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

    module.exports = controller;

