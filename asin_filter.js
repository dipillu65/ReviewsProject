var low     = require('lowdb');
var fs      = require('lowdb/adapters/FileSync');
var adapter = new fs('complete.json');
var db      = low(adapter);
var kindleRevs = require('./kindle_reviews_reduced.json');
var AsinTitles = require('./ASINTITLES.json');

// init the data store for complete reviews
db.defaults({ completeRevs: []}).write();

var Asin = [];
AsinTitles.forEach( element =>{
Asin.push(element.ASIN)
})
console.log(Asin)

//COUNT MONITORS TO ENSURE COMPLETE LOOPS
var countrev= 0;
var count2 = 0


//FILTER ARRAY
filtered = [];
kindleRevs.forEach(el =>{
    countrev ++;
    for (i=0; i< Asin.length; i++){
    count2 ++;
        if( el.asin === Asin[i]){
            filtered.push({
                asin : el.asin,
                title : search(Asin[i],AsinTitles),
                reviewTime : el.reviewTime,
                reviewerID : el.reviewerID,
                reviewerName : el.reviewerName,
                summary : el.summary,
                overall : el.overall,
                reviewText : el.reviewText,
            });
        }
    }
})
//PUSH OBJECTS INTO NEW JSON FILE
db.get('completeRevs').push(filtered).write();
console.log(filtered)

//SEARCH FUNCTION TO RETURN TITLE
function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].ASIN === nameKey) {
            return myArray[i].TITLE;
        }
    }
}


