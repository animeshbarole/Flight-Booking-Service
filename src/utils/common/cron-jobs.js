const cron = require('node-cron');



const {BookingServices} =require('../../services');

function scheduleCrons() {
    cron.schedule('*/30 * * * *', async () => {
        
        await BookingServices.cancelOldBookings();
    });
}

module.exports = scheduleCrons;