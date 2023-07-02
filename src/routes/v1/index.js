const express = require('express');


const {InfoController} = require('../../controllers')  //Object name should be the same as we export them from different module
const router = express.Router();




router.get('/info',InfoController.info);

module.exports = router;

