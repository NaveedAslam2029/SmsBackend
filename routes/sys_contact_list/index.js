const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var Contactcontroller = require('../sys_contact_list/contact.controller');



router.get('/get-all',Contactcontroller.get_all_ContactModals);
router.post('/add',Contactcontroller.create_a_ContactModal);
router.post('/import_contacts', Contactcontroller.importContacts );
router.get('/getByUserId/:Id',Contactcontroller.getByUserId);
router.put('/update/:Id',Contactcontroller.update_a_ContactModal);
router.delete('/delete/:Id',Contactcontroller.Delete_a_ContactModal);
module.exports = router;


