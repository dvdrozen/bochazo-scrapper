var http = require("http");
var cheerio = require("cheerio");
var urls = ["http://www.haycancha.com/busqueda.php",
			"http://www.haycancha.com/busqueda.php?p=2",
			"http://www.haycancha.com/busqueda.php?p=3",
			"http://www.haycancha.com/busqueda.php?p=4",
			"http://www.haycancha.com/busqueda.php?p=5",
			"http://www.haycancha.com/busqueda.php?p=6",
			"http://www.haycancha.com/busqueda.php?p=7",
			"http://www.haycancha.com/busqueda.php?p=8"];

var url = urls[0];

function getPlaces(data) {
	var places = [];
	var $ = cheerio.load(data);
    
    //Table with the list of places
    $(".fondo_blanco").each(function(i, e) {
        
        //Each table with a place
        $(e).find("table").each(function(j, t) {
        	
        	//Tables with cellpadding == 3 have each place
        	if( $(t).attr("cellpadding") == 3 ) {
        		var place = {};
        		var link = "";

    			//Name
        		$(t).find("a").each(function(k, a) {
					if( $(a).attr("class") != "txt_verde_11" ) {
						place.name = $(a).text().trim();
					}
				});

    			//Courts number
				$(t).find(".txt_verde_11").each(function(k, a) {
					//console.log(a);
					console.log($(a).text());
				});

    			//Address

    			//Phone

				//Link

				places.push(place);
        	}
        });

      });

    return places;
}

function download(url, callback) {

  http.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function(data) {
  	console.log(data);
    callback(null);
  });

}

//Have fun!
download(url, function(data) {
  	if (data) {
    	var places = getPlaces(data);
    	console.log(places);
  	}
  	else 
  	{ 
  		console.log("error") 
	}
});