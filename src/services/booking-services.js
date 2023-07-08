
const axios = require('axios');
const {ServerConfig} = require('../config');
const {BookingRepository} =require('../repositories');
const db = require('../models');

async function createBooking(data)
{
    try {
       const result  = db.sequelize.transaction(async function bookingImpl(t)
       {
           console.log('booking imp');
           console.log(`localhost:3000/api/v1/flights/${data.flightID}`);
           const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightID}`);
           console.log(flight.data);
          
            return true;
       });     
        
    } catch (error) {
         
        console.log(error);
        throw error;
      
    }
}

module.exports = {
  
    createBooking,
}