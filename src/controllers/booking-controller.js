
const {StatusCodes} = require('http-status-codes');
const {BookingServices} = require('../services')

const {ErrorResponse,SuccessResponse} = require('../utils/common')
async function createBooking(req,res){
    
         try { 

            console.log('body',req.body);
              
             const response  = await BookingServices.createBooking({
                  
                flightID: req.body.flightID,
                userID : req.body.userID,
                noOfSeats : req.body.noOfSeats

               
                 
             });
    
             SuccessResponse.data = response;
    
             return res.
                       status(StatusCodes.OK)
                      .json( SuccessResponse );
    
            
         } catch (error) {
    
            ErrorResponse.error = error 
            return res
                      .status(error.statusCode) //Error has Self Property statusCode we simply not write again we just
                                                //Pass it with statusCode
                      .json(ErrorResponse);
            
         }
    
}


module.exports ={
     createBooking
}