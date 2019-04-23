async function main() {
  // Imports the Google Cloud client library
  const language = require('@google-cloud/language');

  // Instantiates a client
  const client = new language.LanguageServiceClient();

  // The text to analyze
  const text = 'Looking through reviews is a critical part of business and product strategy. But going through comments is time consuming, subjective, and difficult to analyze. We want to build a review visualizer that collects review data, analyzes it, and produces a useful visualization for business strategy. We will accomplish this by collecting review data from an amazon product using an API. we will then use JavaScript and JSON to clean up the data and organize it in a usefull manner. We will then take that data and analyze it using machine elarning or word ranking. We will then take the anayzed data and plot it on a visualization that is useful within a business context. The outcome will be that a user can take an Amazon product or products, run it through our program, and receive visualized and anayzed review data.';

  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  // Detects the sentiment of the text
  const [result] = await client.analyzeSentiment({document: document});
  const sentiment = result.documentSentiment;

  console.log(`Text: ${text}`);
  console.log(`Sentiment score: ${sentiment.score}`);
  console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
}

main().catch(console.error);