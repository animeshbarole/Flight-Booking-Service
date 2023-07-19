
const axios = require('axios');
const {StatusCodes}= require('http-status-codes');
const {ServerConfig} = require('../config');
const {BookingRepository} =require('../repositories');
const db = require('../models');
const AppError = require('../utils/errors/app-error');

const bookingRepository = new BookingRepository();

async function createBooking(data)
{  
      
    const transaction  = await db.sequelize.transaction();
     try {
            const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightID}`);
            const flightData =flight.data.data;
            if(data.noOfSeats > flightData.totalSeats)
            { 
               
               throw new AppError('Not Enough Seats Available ',StatusCodes.BAD_REQUEST);
 
            }
            //If we can book the flights lets compute it ..
           
            const totalBillingAmount  = data.noOfSeats * flightData.price;
            console.log(totalBillingAmount);
            const bookingPayload = {...data,totalCost:totalBillingAmount};
            const booking  =  await bookingRepository.create(bookingPayload,transaction);
            
            await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightID}/seats`,{
                seats:data.noOfSeats,
            });
            await transaction.commit();
           
            return booking;
             
         
          
     } catch (error) {
          await  transaction.rollback();
          throw error;
     }
    
}

module.exports = {
  
    createBooking,
}