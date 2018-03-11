'use strict';

console.log('Loading Function')
const doc = require('dynamodb-doc')
const dynamo = new doc.DynamoDB()

module.exports.getAllShows = (event, context, callback) => {
  var parmsGetAll = {
      TableName: process.env.DYNAMODB_TABLE
    }
  dynamo.scan(parmsGetAll, (error, result) => {
    var response = getResponse(error, result)
    callback(null, response)
  })
}

module.exports.getAllShowsForBand = (event, context, callback) => {
  var parmsGetAll = {
      TableName: process.env.DYNAMODB_TABLE,
      FilterExpression: "bandId = :bandId",
      ExpressionAttributeValues: {
        ":bandId": event.pathParameters.bandId
      }
    }
  dynamo.scan(parmsGetAll, (error, result) => {
    var response = getResponse(error, result)
    callback(null, response)
  })
}

module.exports.getOneShow = (event, context, callback) => {
  //note: this var is the only unique thing in this whole handler
  var parmsGetOne = {
    TableName: process.env.DYNAMODB_TABLE,
    FilterExpression: "identifier = :showId",
    ExpressionAttributeValues: {
      ":showId": event.pathParameters.showId
    }
  }
  dynamo.scan(parmsGetOne, (error, result) => {
    var response = getResponse(error, result)
    callback(null, response)
  })
}

function getResponse(error, result) {
  var response = {}
  if (error) {
    console.error(error)
    var errorResp = {
      status: error.statusCode || 501,
      message: error
    }
    response = {
      statusCode: error.statusCode || 501,
      body: JSON.stringify(errorResp),
      headers: { 'Content-Type': 'application/json'}
    }
  }
  else {
    response = {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    //body: JSON.stringify(result)        // might want this instead(?)
    }
  }
  return response;
}
// THIS WORKS TOO - keep for reference; I like the event.body condition for mocking
//
// module.exports.getAll = (event, context, callback) => {
//
//   const response = (err, res) => callback(null, {
//     statusCode: err ? '400' : '200',
//     body: err ? err.message : JSON.stringify(res),
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
//   // to allow mock testing, accept objects (not just strings)
//   if (typeof event.body == 'string') {
//     event.body = JSON.parse(event.body)
//   }
//   var parmsGetAllTaperBand = {
//     TableName: process.env.DYNAMODB_TABLE
//   }
//   dynamo.scan(parmsGetAllTaperBand, response)
// };
