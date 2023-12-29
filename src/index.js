const express = require('express');

const {ServerConfig,Logger} = require('./config');  //If we are taking env from index we dont need to mention them 
const apirouter = require('./routes')

const app = express();

const CRON = require('./utils/common/cron-jobs')



app.use(express.json()); //Convert res parameters to json file .
app.use(express.urlencoded({ extended : true }));  //it is used to read uncoding digits

app.use('/api',apirouter);



app.listen(ServerConfig.PORT,() =>{
    console.log(`SuccessFull Started the Server on port :${ServerConfig.PORT}`);
    CRON();
});