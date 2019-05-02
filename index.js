var low     = require('lowdb');
var fs      = require('lowdb/adapters/FileSync');
var adapter = new fs('db.json');
var db      = low(adapter);
var kindleRevs = require('./kindle_reviews_reduced.json');

// init the data store
db.defaults({ reviews: []}).write();


async function quickstart(text) {
    // Imports the Google Cloud client library
    const language = require('@google-cloud/language');
  
    // Instantiates a client
    const client = new language.LanguageServiceClient();
  
    // The text to analyze as input
    console.log("quickstart called")
    const document = {
      content: text,
      type: 'PLAIN_TEXT',

    };
    var results = {};
    var entitiesArr = []
    // Detects the sentiment of the text
    const [result] = await client.analyzeSentiment({document: document});
    const sentiment = result.documentSentiment;

    // Detects sentiment of entities in the document
    const [result2] = await client.analyzeEntitySentiment({document});
    const entities = result2.entities;
    
    entities.forEach(entity => {
      entitiesArr.push({
        name : entity.name,
        type : entity.type,
        score : entity.sentiment.score,
        salience : entity.salience});
    });
    
    results.entities = entitiesArr;
    results.score = sentiment.score;
    results.magnitude = sentiment.magnitude;
    console.log(results);
    return results;

}


// [END language_quickstart]
var newReview = function (data,sentiment){
    console.log("newReview called")
    var review = {
        asin : data.asin,
        reviewerID : data.reviewerID,
        date : data.reviewTime, //check the key for the date
        sentimentScore : sentiment.score,
        magnitude : sentiment.magnitude,
        entities: sentiment.entities,
      
    }
    //Add post to db
    db.get('reviews')
    .push(review)
    .write();
}

//Set variable for timing the function
var i = 0;
var Timer = setInterval(async() => {
    var sentiment = await quickstart(kindleRevs[i].reviewText);
    newReview(kindleRevs[i],sentiment);
    i+=1;
    if (i >= kindleRevs.length){ 
      clearInterval(Timer);
    }
} , 1500);


//read post
//console.log(db.get('vehicles').value())