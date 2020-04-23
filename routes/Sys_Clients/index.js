const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var Clientcontroller = require('./Clients.controller');


router.get('/get-all',Clientcontroller.get_all_ClientModals);
router.post('/create',Clientcontroller.create_a_ClientModal);
// router.get('/uploads',Clientcontroller.upload_file_ClientModal);
// router.get('/upload',Clientcontroller.upload_listfile_ClientModal);
router.get('/getByUserId/:Id',Clientcontroller.getByUserId);
router.put('/update/:Id',Clientcontroller.update_a_ClientModal);
router.delete('/delete/:Id',Clientcontroller.Delete_a_ClientModal);
router.post('/test', Clientcontroller.upload_file_ClientModal)
// router.post('/test', function(req,res){
// console.log("hello0")
// })




module.exports = router;