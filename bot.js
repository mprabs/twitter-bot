var Twit = require('twit');
var component=require('./config.js');
var config=component.keys;
var quotes =component.quotes;
var T = new Twit(config);
var numberOfQuotes=58;
var stream = T.stream('user');
console.log('Its working');
	var i=0;
	var $ = require('jQuery');


searchTweet();
function searchTweet(){
	T.get('search/tweets',
	{
	  q: 'Nepal since:2018-01-04',
	   count: 1
	},

	function(err, data, response) {
		var tweets=data.statuses;
		for (var i = 0; i < tweets.length; i++) {
			console.log(tweets[i].text);
			if (err)
				console.log(err)
			else
				console.log('Successfull !');
		}
		// eventMsg=tweets[0];
		// var replyto=eventMsg.in_reply_to_screen_name;
		// var text=eventMsg.text;
		// var from=eventMsg.user.screen_name;
		// var randomNumber=Math.floor(Math.random()*100);
		// if(replyto === 'PrabinBot'){
		// 	var newtweet = '@' + from + ' You mentioned Prabin. He will soon be informed. Thanks ! #BotPrabin'+randomNumber;
		// 	tweetPost(newtweet);	
		// }
	})
}

setInterval(function(){ tweetregular()},86400000);
function tweetregular(){
	console.log('Tweet regular called');
	getRandom(); 
	function getRandom(numberOfQuotes) {
	console.log('Tweet regular down called');
		var limit =  quotes.length;
		var out = new Array(limit);
		var quote;
		var quoteAlreadyUsed;
		for (var i = 0; i < limit; i++) {
			quote = quotes[Math.floor(Math.random() * quotes.length)];
			quoteAlreadyUsed = out.indexOf(quote) > -1;
			while (quoteAlreadyUsed) {
				quote = quotes[Math.floor(Math.random() * quotes.length)];
				quoteAlreadyUsed = out.indexOf(quote) > -1;
			}

			out[i] = quote;
			tweetPost(out[i]);
			console.log('The tweet is' +tweetPost(out[i]));

		}
}
}

var datetime = new Date();

setInterval(function tweetPost(){
	var randomNumber=Math.floor(Math.random()*100);
	T.post('statuses/update', { 
		status: 'Its ' + datetime + ' #BotPrabin'
	}, tweetingIt) 
		
	var tweetingIt = function(err, data, response)
		{
			if (err)
				console.log(err)
			else
				console.log('Successfull !')  
		}
}
,100000);

function tweetPost(txt){
	var randomNumber=Math.floor(Math.random()*100);
	T.post('statuses/update', { 
		status: txt + ' #BotPrabin'
	}, tweetingIt) 
		
	var tweetingIt = function(err, data, response)
		{
			if (err)
				console.log(err)
			else
				console.log('Successfull !')  
		}
}

stream.on('favourite',favourited);
function favourited(event)
{
	var name=event.source.name;
	var screenName=event.source.screen_name;
	console.log('The favourite call is on access');
	tweetPost('Hey ! @'+screenName+' Thank you for liking my tweet.');
}

// T.get('favourites/list', { screen_name: 'm_prabs' },  function (err, data, response) {
//   console.log(data)
// })

// Anytime someone follows me
stream.on('follow', followed);

// Just looking at the event but I could tweet back!
function followed(event) {
  var randomNumber=Math.floor(Math.random()*100);
  var name = event.source.name;
  var screenName = event.source.screen_name;
  tweetPost('Thank you for liking my tweet : ' + name + '@' + screenName + ' #BotPrabin' + randomNumber);
}

// Now looking for tweet events
// See: https://dev.twitter.com/streaming/userstreams
stream.on('tweet', tweetEvent);

// Here a tweet event is triggered!
function tweetEvent(tweet) {

  // If we wanted to write a file out
  // to look more closely at the data
  // var fs = require('fs');
  // var json = JSON.stringify(tweet,null,2);
  // fs.writeFile("tweet.json", json, output);

  // Who is this in reply to?
  var reply_to = tweet.in_reply_to_screen_name;
  // Who sent the tweet?
  var name = tweet.user.screen_name;
  // What is the text?
  var txt = tweet.text;
  // If we want the conversation thread
  var id = tweet.id_str;

  // Ok, if this was in reply to me
  // Tweets by me show up here too
  if (reply_to === 'm_prabs'){
    // Get rid of the @ mention
    txt = txt.replace(/@m_prabs/g,'');
    var randomNumber=Math.floor(Math.random()*100);
    // Start a reply back to the sender
    var replyText = '@'+name + ' Thank you for the text! #BotPrabin'+ randomNumber;
    // Reverse their text
    // for (var i = txt.length-1; i >= 0; i--) {
    //   replyText += txt.charAt(i);
    // }

    // Post that tweet
    T.post('statuses/update', { status: replyText, in_reply_to_status_id: id}, tweeted);

    // Make sure it worked!
    function tweeted(err, reply) {
      if (err) {
        console.log(err.message);
      } else {
        console.log('Tweeted: ' + reply.text);
      }
    }
  }
}

