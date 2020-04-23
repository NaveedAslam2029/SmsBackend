'use strict';
var mongoose = require('mongoose');
var ClientModal = require('./Clients.Model');
var uploadModal = require('../upload/upload');
var multer  = require('multer');
var path  = require('path');

    var controller = {}
var imageData = uploadModal.find({});
// router.use(express.static(__dirname+".public/"));



// router.post('/upload',upload,function (req,res,next)
controller.upload_file_ClientModal =(req, res, next) => {
    //   const file = req.file;
      console.log("asdasd",file);
      if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
      }
      res.send(filePath);  
    }
// controller.upload_listfile_ClientModal=upload.single('file'),(req, res, next) => {
//     //   const file = req.file;
//       console.log(file);
//       if (!file) {
//         const error = new Error('No File')
//         error.httpStatusCode = 400
//         return next(error)
//       }
//         res.send(file);  
//     }



    controller.get_all_ClientModals = function(req,res){
        ClientModal.find({},function(err,cm){
            console.log('All Staff are Successfully Retreived')
            if(err)
            res.send(err);
            res.json(cm);
        });
    }
    controller.create_a_ClientModal = function(req,res){
        var new_ClientModal = new ClientModal(req.body,req.body.image);
        console.log(req.image);
        new_ClientModal.save(function(err,cm){
            console.log('Successfully Inserted');
            if (err)
            res.send (err);
            res.json(cm);
        });   
    }
    controller.getByUserId = function (req, res) {
            console.log('i a working',req.params);
            ClientModal.find( { _id:req.params.Id},function (err, cm){
            if (err)
                res.send(err);
            res.json(cm);
        });
    };
    // controller.read_a_ClientModal = function(req,res){
    //     ClientModal.findById(req.params.id, function(err,cm){
    //         console.log('Successfully Retreived')
    //         if(err)
    //         res.send(err);
    //         var ClientArray = [];
    //         CMArray.push(cm)
    //     res.json(ClientArray);
    //     });
    // }
    controller.update_a_ClientModal = function(req,res){
        ClientModal.findOneAndUpdate({_id: req.params.Id},req.body,{new : true},function(err,cm){
        console.log('successfully updated')
        if(err)
        res.send(err);
        res.json(cm);
    });
    }
    // controller.Delete_a_ClientModal = function (req, res) {
    //     ClientModal.remove({
    //         _id: req.params.id
    //     }, function (err, cm) {
    //         if (err)
    //             res.send(err);
    //         res.json({ message: 'item Model successfully deleted' });
    //         res.json(cm);
    //     });
    // };
    controller.Delete_a_ClientModal = function (req, res) {
        console.log("===>id:",req.params.Id)
        ClientModal.deleteOne({
        _id: req.params.Id
        }, function (err, cm) {
        if (err)
        res.send(err);
        res.json({ message: 'item Model successfully deleted' });
        // res.json(cm);
        });
        };

    module.exports = controller; 