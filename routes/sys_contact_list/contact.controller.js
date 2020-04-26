'use strict';
var mongoose = require('mongoose');
var ContactModal = require('./contact.Model');
var multer  = require('multer');
var path  = require('path');
var csv = require('fast-csv');
const fs = require('fs');

// var req = require('../../uploadscontactlists')
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
     

        controller.importContacts = function (req, res) {
            console.log(req.body);
            
            var fileData = [];
            csv.parseFile(`./uploadscontactlists/${req.body.fileName}`)
              .on('data',
                  function(data) {
                    console.log('working on data',data);
                              
                    fileData.push(data);
                  })
              .on('end', function () {
                console.log('er')
                // at zero index you can see there is only headers of the file not data
                  console.log('file ended: ', fileData[0]);
                  for (let index = 0; index < fileData.length; index++) {
                    // beacause at zero index there will be no data there will be only headings like in the sample file  
                    if(index !== 0) {
                        var contacts =  new ContactModal({
                            phone_number: fileData[index][0],
                            email_address: fileData[index][1],
                            user_name: fileData[index][2],
                            company: fileData[index][3],
                            first_name: fileData[index][4],
                            last_name: fileData[index][5]
                          })
                          contacts.save();
                      }

                      if(index == fileData.length-1){
                          // deleting temp import file 
                          let path = `./uploadscontactlists/${req.body.fileName}`;
                          if (fs.existsSync(path)) {
                            //file exists
                            console.log('deleteing file ');
                            
                            fs.unlink(path, (err) => {
                                if (err) throw err;
                                console.log('File deleted successfuly');
                              });
                          }
                          

                          return res.json(fileData);
                      }
                      
                  }
                  

                //   res.send(fileData[0]);

               });
          
            
            };
        
 


    module.exports = controller; 