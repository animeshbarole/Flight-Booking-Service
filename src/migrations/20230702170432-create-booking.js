'use strict';
/** @type {import('sequelize-cli').Migration} */
const {Enums} =require('../utils/common');
const {PENDING,BOOKED,INITIATED,CANCELLED} = Enums.BOOKING_STATUS;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flightID: {
        type: Sequelize.INTEGER,
        allowNull:false,
      },
      userID: {
        type: Sequelize.INTEGER,
        allowNull:false,
      },
      status: {
        type: Sequelize.ENUM,
        values : [PENDING,BOOKED,INITIATED,CANCELLED],
        defaultValue:INITIATED,
        allowNull:false,
      },
      noOfSeats:{  //Seats that user Booked when he wanted to book a flight
         type: Sequelize.INTEGER,
         allowNull :false,
         defaultValue :1,
      },
      totalCost: {
        type: Sequelize.INTEGER,
        allowNull:false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};