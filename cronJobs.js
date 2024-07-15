const cron = require('node-cron');
const {sendPromotionalEmail} = require('./emailService');
const Customer = require('./src/models/sql/customer');
const moment = require('moment');

// Schedule a task to send promotional email every day at midnight
const cronSchedulerToSendPromotionalEmails= () => {
    const now = moment();
    // const cronExpForTest = `${now.minute()+1} ${now.hour()} ${now.date()} ${now.month()+1} ${now.day()}`;
    const cronExpForMidnight = '0 0 * * 0';
    cron.schedule(cronExpForMidnight,async () => {
        try{
            const customers = await Customer.findAll();
            customers.forEach(customer => {
                sendPromotionalEmail(customer.email);
            })
        }
        catch(err){
            console.error('Error sending promotional emails:',err);
        }
    });
    console.log(`Promotional email scheduler started at ${cronExpForMidnight}`);
}



module.exports = cronSchedulerToSendPromotionalEmails;