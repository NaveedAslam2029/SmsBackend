const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var Phonecontroller = require('./importphone.controller');
const http = require('http');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const csv = require('fast-csv');






router.post('/test', Phonecontroller.upload_file_PhoneModal);
router.get('/get-all',Phonecontroller.get_all_PhoneModal);
router.post('/create',Phonecontroller.create_a_PhoneModal);
router.get('/getByUserId/:Id',Phonecontroller.getByUserId);
router.put('/update/:Id',Phonecontroller.update_a_PhoneModal);
router.delete('/delete/:Id',Phonecontroller.Delete_a_PhoneModal);





module.exports = router;