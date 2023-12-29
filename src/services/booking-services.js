
const axios = require('axios');
const {StatusCodes}= require('http-status-codes');
const {ServerConfig} = require('../config');
const {BookingRepository} =require('../repositories');
const db = require('../models');
const AppError = require('../utils/errors/app-error');
const {Enums} =require('../utils/common');

const {BOOKED,CANCELLED} = Enums.BOOKING_STATUS;

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


async function makePayment(data)
{  

    
   const transaction = await db.sequelize.transaction(); 
    try{
        const bookingDetails = await bookingRepository.get(data.bookingID,transaction);
     
          console.log(bookingDetails.totalCost);
           
           
           if(bookingDetails.status===CANCELLED)
          {
              throw new AppError('The Booking is Expired ',StatusCodes.BAD_REQUEST);  
          }
           const bookingTime  = new Date(bookingDetails.createdAt);
           const currTime  = new Date();
           if(currTime-bookingTime>300000)
           {
  
             await cancelBoooking(data.bookingID);
             throw new AppError('The Booking is Expired ',StatusCodes.BAD_REQUEST);  
           }
        if(bookingDetails.totalCost!==data.totalCost)
        {
            throw new AppError('The Amount of Payment Doesnt Matach ',StatusCodes.BAD_REQUEST);
        }

        if(bookingDetails.userID!==data.userID)
        {
            throw new AppError('The User Corresponding to the Booking does not match',StatusCodes.BAD_REQUEST);   
        }
        
        //We assume here the Payment is Done
        await bookingRepository.update(data.bookingID,{status:BOOKED},transaction);
        await transaction.commit();

  

    }catch(error){
      
        await transaction.rollback();
        throw error;
    }

}

async function cancelBoooking(bookingID)
{  
    const transaction = await db.sequelize.transaction(); 
    try{
        const bookingDetails = await bookingRepository.get(bookingID,transaction);
        console.log(bookingDetails);
       
        if(bookingDetails.status===CANCELLED)
        {
            await transaction.commit();
            return true;
        } 

        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightID}/seats`,{
            seats:bookingDetails.noOfSeats,
            dec:0,
        });
   
        await bookingRepository.update(bookingID,{status:CANCELLED},transaction);
        await transaction.commit();   

          
    }
    catch(error){
    
        await transaction.rollback();
        throw error;
    }

}


async function cancelOldBookings()
{
    try {
        console.log("Inside service")
        const time = new Date( Date.now() - 1000 * 300 ); // time 5 mins ago
        const response = await bookingRepository.cancelOldBookings(time);
        
        return response;
    } catch(error) {
        console.log(error);
    }
}

module.exports = {
  
    createBooking,
    makePayment,
    cancelOldBookings
}