const AWS = require('aws-sdk')
const fs = require('fs')


AWS.config.update({
    "accessKeyId": "",
    "secretAccessKey": "",
    "region": "us-east-1",
    "endpoint": "http://s3.us-east-1.amazonaws.com",
});

var s3 = new AWS.S3({apiVersion: '2006-03-01', region: 'us-east-1'});

function uploadFile(file){
    const fileStream = fs.createReadStream(file.path)

    var params = {
        Bucket: '2022-pet-bucket',
        Key: file.filename,
        Body: fileStream
    };
    
    return s3.upload(params).promise()
}

exports.uploadFile = uploadFile

