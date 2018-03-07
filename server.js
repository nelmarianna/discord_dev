
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var sourceToReturn;

function scrape(meme){

  // The URL we will scrape from - in our example Anchorman 2.
    url = 'https://www.memecenter.com/search/'+meme;

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
            	console.log(link);
            })
        	
        }
  })
   

}

scrape(msg);

