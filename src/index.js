const express = require('express');

const {ServerConfig,Logger} = require('./config');  //If we are taking env from index we dont need to mention them 
const apirouter = require('./routes')

const app = express();


app.use('/api',apirouter);



app.listen(ServerConfig.PORT,() =>{
    console.log(`SuccessFull Started the Server on port :${ServerConfig.PORT}`);
    Logger.info("Successfully Started the Server");
});