'use strict';
var mongoose = require('mongoose');
var PhoneModal = require('./importphone.Model');
var uploadModal = require('../upload/upload');
var multer  = require('multer');
var path  = require('path');

    var controller = {}
var imageData = uploadModal.find({});

controller.upload_file_PhoneModal =(req, res, next) => {
      console.log("importfile",file);
      if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
      }
      res.send(filePath);  
    }

    controller.get_all_PhoneModal = function(req,res){
        PhoneModal.find({},function(err,cm){
            console.log('All Staff are Successfully Retreived')
            if(err)
            res.send(err);
            res.json(cm);
        });
    }
    controller.create_a_PhoneModal = function(req,res){
        var new_PhoneModal = new PhoneModal(req.body,req.body.image);
        console.log(req.image);
        new_PhoneModal.save(function(err,cm){
            console.log('Successfully Inserted');
            if (err)
            res.send (err);
            res.json(cm);
        });   
    }
    controller.getByUserId = function (req, res) {
            console.log('i a working',req.params);
            PhoneModal.find( { _id:req.params.Id},function (err, cm){
            if (err)
                res.send(err);
            res.json(cm);
        });
    };
    controller.update_a_PhoneModal = function(req,res){
        PhoneModal.findOneAndUpdate({_id: req.params.Id},req.body,{new : true},function(err,cm){
        console.log('successfully updated')
        if(err)
        res.send(err);
        res.json(cm);
    });
    }
    controller.Delete_a_PhoneModal = function (req, res) {
        console.log("===>id:",req.params.Id)
        PhoneModal.deleteOne({
        _id: req.params.Id
        }, function (err, cm) {
        if (err)
        res.send(err);
        res.json({ message: 'item Model successfully deleted' });
        });
        };

    module.exports = controller; 