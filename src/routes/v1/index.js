const express = require('express');


const {InfoController} = require('../../controllers');  //Object name should be the same as we export them from different module
const bookingRoutes = require('./booking-routes');
const router = express.Router();




router.get('/info',InfoController.info);
router.use('/bookings',bookingRoutes);



module.exports = router;

