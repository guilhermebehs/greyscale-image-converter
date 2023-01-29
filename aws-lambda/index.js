const AWS = require('aws-sdk');
const fs = require('fs');


exports.handler = async (event) => {
    
    AWS.config.update({ region: 'us-east-1' });
    
    const [record] = event.Records

    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '))
    const eventTime = record.eventTime
        

    const template = fs
    .readFileSync('./template.html')
    .toString()
    .replace('${fileName}', key)
    .replace('${dateTime}', eventTime);

    const params = {
    Destination: {
        ToAddresses: [
        'guilhermebehs2013@hotmail.com',
        ],
    },
    Message: {
        Body: {
        Html: {
            Charset: 'UTF-8',
            Data: template,
        },
        },
        Subject: {
        Charset: 'UTF-8',
        Data: 'Término de conversão do arquivo',
        },
    },
    Source: 'saintjimmyrs@hotmail.com' 
};