var Discord = require('discord.io');
var logger = require('winston');
var giphy = require('giphy-api')('5jOIGY9lfaWpKAn2nyfY1tS0jCUMcjIW');
var auth = require('./auth.json');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
console.log("initialize client");
logger.level = 'silly';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {

   logger.info('Connected');
   logger.info('Logged in as: ');
   logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    flag = false;
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        
      var msg = giphy.random(cmd, function (err, res) {
         var giffy = JSON.stringify(res);
          var toSend = JSON.parse(giffy);
          var msg = toSend.data.image_url;
          
          if(msg === undefined){
            undefinedMsg();
          }
          else{
          send(msg);
        }
          
        });
      
    }
    else if (message.substring(0, 1) == '$') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);

        // The URL we will scrape from - in our example Anchorman 2.
          url = 'https://www.memecenter.com/search/'+cmd;

          // The structure of our request call
          // The first parameter is our URL
          // The callback function takes 3 parameters, an error, response status code and the html

          request.get(url, function(error, response, html){

              // First we'll check to make sure no errors occurred when making the request
          var json;
              if(!error){
                  // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

                  var $ = cheerio.load(html);

                  // Finally, we'll define the variables we're going to capture

                  var link;
                  // json = { link : ""};

                  $('#fdc_contcontainer').filter(function(){

                    var data = $(this).children();
                    var choose = Math.floor((Math.random()*(data.length-2)+1));
                      link = data.eq(choose).children().first().children().first().children().attr("src");
                    if(link ===undefined){
                      link = data.eq(choose).children().first().children().first().children().attr("poster");
                    }
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
     
    function undefinedMsg(){
         giphy.random("undefined", function (err, res) {
         var giffy = JSON.stringify(res);
          var toSend = JSON.parse(giffy);
          var msg = toSend.data.image_url;
         send("Sorry I can't find that word. Here's a random gif instead.");
         send(msg);

        });
      }

      function send(msg){
            bot.sendMessage({
              to: channelID,
              message: msg
            });
        }

});



