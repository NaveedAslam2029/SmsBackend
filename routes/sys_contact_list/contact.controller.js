'use strict';
var mongoose = require('mongoose');
var ContactModal = require('./contact.Model');
var multer  = require('multer');
var path  = require('path');

    var controller = {}

    controller.get_all_ContactModals = function(req,res){
        ContactModal.find({},function(err,cm){
            console.log('All Staff are Successfully Retreived')
            if(err)
            res.send(err);
            res.json(cm);
        });
    }
    controller.create_a_ContactModal = function(req,res){
        var new_ContactModal = new ContactModal(req.body,req.body.image);
        console.log(req.image);
        new_ContactModal.save(function(err,cm){
            console.log('Successfully Inserted');
            if (err)
            res.send (err);
            res.json(cm);
        });   
    }
    controller.getByUserId = function (req, res) {
            console.log('i a working',req.params);
            ContactModal.find( { _id:req.params.Id},function (err, cm){
            if (err)
                res.send(err);
            res.json(cm);
        });
    };
    controller.update_a_ContactModal = function(req,res){
        ContactModal.findOneAndUpdate({_id: req.params.Id},req.body,{new : true},function(err,cm){
        console.log('successfully updated')
        if(err)
        res.send(err);
        res.json(cm);
    });
    }
    controller.Delete_a_ContactModal = function (req, res) {
        console.log("===>id:",req.params.Id)
        ContactModal.deleteOne({
        _id: req.params.Id
        }, function (err, cm) {
        if (err)
        res.send(err);
        res.json({ message: 'item Model successfully deleted' });
        });
        };
     
 


    module.exports = controller; 