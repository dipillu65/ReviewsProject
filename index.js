var low     = require('lowdb');
var fs      = require('lowdb/adapters/FileSync');
var adapter = new fs('db.json');
var db      = low(adapter);
var kindleRevs = require('./kindle_reviews_reduced.json');

// init the data store
db.defaults({ reviews: []}).write();

// [START language_quickstart]
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
    var results = [];
    // Detects the sentiment of the text
    const [result] = await client.analyzeSentiment({document: document});
    const sentiment = result.documentSentiment;
    results.push(sentiment.score)
    results.push(sentiment.magnitude)
    console.log(results)
    return sentiment
}


// [END language_quickstart]
var newReview = function (data,sentiment){
    console.log("newReview called")
    var review = {
        asin : data.asin,
        date : data.reviewTime, //check the key for the date
        score : sentiment.score,
        magnitude : sentiment.magnitude
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