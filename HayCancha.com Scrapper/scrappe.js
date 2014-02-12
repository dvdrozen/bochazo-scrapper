if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

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
              var el = $(a);
    					if( el.attr("class") != "txt_verde_11" && el.attr("href") && el.attr("href")[0] == "h" ) {
    						place.name = el.text().trim();
                link = el.attr("href");
    					}
    				});

      			//Address & Phone
    				$(t).find(".txt_verde_11").each(function(k, a) {
    					var element = $(a).text().trim();
              var e = $(a);

              if( element && !element.startsWith('[+]') && element[0] != "(" && j <= 47 ) { //WTF
                  if( isNaN(element[0]) ) {
                      place.address = element;
                  } else {
                      place.phones = element;
                  }
              }
    				});

  				  //Get more detailed data from place detail page
            download(link, function(data) {
                if( data ){
                  place = getPlaceDetail(place, data);
                }
            })
        
  				  places.push(place);
        	}
        });

      });

    return places;
}

function getPlaceDetail(place, data) {
  return place;
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

for(var i=0; i< urls.length; i++) {

  //download each page of results and write them to a json file
  download(urls[i], function(data) {
    if (data) {
      var places = getPlaces(data);
      
      //Write places to json file here
      console.log(places);
    }
    else {
      console.log("error") 
    }
  });

}