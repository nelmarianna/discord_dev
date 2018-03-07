//Set up dependencies
var Discord = require('discord.io');
var logger = require('winston');
var giphy = require('giphy-api')('5jOIGY9lfaWpKAn2nyfY1tS0jCUMcjIW'); //please don't steal my api key
var auth = require('./auth.json');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'silly';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

// Connect the discord bot
bot.on('ready', function (evt) {
   logger.info('Connected');
   logger.info('Logged in as: ');
   logger.info(bot.username + ' - (' + bot.id + ')');
});

// Listening to messages starting with '!' or '$'
bot.on('message', function (user, userID, channelID, message, evt) {
  
    // If the message begins with '!' then send a gif
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        
        // Generate a random gif using giphy-api
        giphy.random(cmd, function (err, res) {
          //res returns an object, turn it into json and parse it for the url
          var giffy = JSON.stringify(res);
          var toSend = JSON.parse(giffy);
          var msg = toSend.data.image_url;

          // if the api couldn't find a gif for this word msg will be 
          // undefined but we still want the bot to reply with somehting
          if(msg === undefined){
            undefinedMsg();
          }
          else{
            send(msg);
          }
          
        });
      
    }
    // If the message begins with '$' send a meme from memecenter
    else if (message.substring(0, 1) == '$') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);

        // The URL to scrape form
        url = 'https://www.memecenter.com/search/'+cmd;
        // Use request method to scrape the url
        request.get(url, function(error, response, html){

              if(!error){
                  // Utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                  var $ = cheerio.load(html);

                  // Define the variable I want to capture
                  var link;
                  // Filter the DOM to find the attribute I want
                  $('#fdc_contcontainer').filter(function(){
                    var data = $(this).children();
                    // Choose random meme from the searh results
                    var choose = Math.floor((Math.random()*(data.length-2)+1));
                    // Use random number to find the html tag I want to look into (the meme in the search)
                    link = data.eq(choose).children().first().children().first().children().attr("src");
                    // If it is undefined then the post is a gif and i need to look for a different attribute
                    if(link ===undefined){
                      link = data.eq(choose).children().first().children().first().children().attr("poster");
                    }
                    // If the search results as nothing or there is no gif 
                    //or meme then send a random gif using giphy
                    if(link ===undefined){
                      undefinedMsg();
                    }
                    else{
                      send(link);
                      
                    }
                  })
                
              }
        })

     }
     
     //choose random giphy (using udefined as search)
    function undefinedMsg(){
         giphy.random("undefined", function (err, res) {
         var giffy = JSON.stringify(res);
          var toSend = JSON.parse(giffy);
          var msg = toSend.data.image_url;
         send("Sorry I can't find that word. Here's a random gif instead.");
         send(msg);

        });
      }
      // function used to send the message back to the 
      //discord channel the input message came from
      function send(msg){
            bot.sendMessage({
              to: channelID,
              message: msg
            });
        }

});



