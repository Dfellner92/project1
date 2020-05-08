var lat ;
var long ;
var weatherCondition;
var CurrentTemp;
var placeName ;
var address;
var photoURL;

var inputAddress;
var searchType;
var placeID ;
var  photoreference;
var placesArray = [];
var apiKey; 
var cityName;
var currentConditions; 
var townName;

$("#button-addon2").on("click", function () {
// ----------function for converting address to coordinates -------
    inputAddress = $("#searchText").val();
    console.log(inputAddress);
    latAndLong();

function latAndLong() {
    //call places API with below URL to get Place details
    placeDetailsURL ="https://maps.googleapis.com/maps/api/geocode/json?address="+ inputAddress + "&key=AIzaSyCDdXamhyDjtM8Ttl4n3oKoRtvtoBnNI_Q";
    console.log(placeDetailsURL);
    $.ajax({
        url: "https://limitless-tor-79246.herokuapp.com/cors",
        method:"POST",
        data: {
        url: placeDetailsURL,
        key: "11e2d980d599766aa84847ae504d0f8257e7afacc76a285b05979fb7e17974e5"
    }}).then(function(response) {
        lat = response.results[0].geometry.location.lat;
        long = response.results[0].geometry.location.lng;
        $(".displayContainer").removeClass("invisible");
        callWeatherAPI();
    });
};



// Creates AJAX call for weather API
function callWeatherAPI () {
var weatherApiURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&units=imperial&appid=07f0e0a67e0b50a9e658e6cfe5b0368a";
$.ajax({
        url: weatherApiURL,
        method: "GET"
        }).then(function(response) {
            console.log(response);
            console.log(response.weather[0].main);
            weatherCondition = response.weather[0].main; //Weather conditions
            CurrentTemp = parseFloat(response.main.temp);
            console.log("Temp: " + CurrentTemp);
            if ((weatherCondition == "Clear"  || weatherCondition == "Clouds") && CurrentTemp > 60) {
                searchType = "tourist_attraction"; 
            } else {
                searchType = "restaurant";
            }
            console.log(response.name);
            townName = response.name;
            weatherData(townName);
            callGooglePlaces();
});
}

function weatherData(townName) {
    var weatherApiURL2 = 'https://api.openweathermap.org/data/2.5/weather?appid=4e5dbe7db2b5e9c8b47fa40b691443d5&q=' + townName;
    $.ajax({
        url: weatherApiURL2,
        method: "GET"
        }).then(function(response){
            console.log(response);
            var feelslike = response.main.temp
            feelslike = (feelslike - 273.15) * 1.8 + 32
            feelslike = Math.floor(feelslike)
            var city = response.name;
            var humidity = response.main.humidity;
            var wind = response.wind.speed;
            var newDiv1 = $("<div class='city'>").text(townName + " " + moment().format("MM/DD/YYYY"));
            $("#today").append(newDiv1);
            var newDiv2 = $("<div>").text("Temperature(F): " + feelslike);
            $("#today").append(newDiv2);
            var newDiv3 = $("<div>").text("Humidity: " + humidity + " %");
            $("#today").append(newDiv3);           
            var newDiv4 = $("<div>").text("Wind Speed: " + wind + " MPH");
            $("#today").append(newDiv4);
            });
};

async function callGooglePlaces() {
    
    var resp1 = await getPlaces();

    for (i=0; i < 5; i++) {
        placeName = resp1.results[i].name;
        placeID = resp1.results[i].place_id;
        photoreference = resp1.results[i].photos[0].photo_reference;
        var resp2 = await getPlaceDetials();
        var placedetailsObj = resp2.result;
        address = placedetailsObj.formatted_address
        var photoURL = await getPlacePhoto();
        createNewDiv(placeName, address, photoURL);
    }

};

function getPlaces(){
    googleApiURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + long + "&radius=1500&type=" + searchType + "&key=AIzaSyCDdXamhyDjtM8Ttl4n3oKoRtvtoBnNI_Q";
    
    return $.ajax({
        url: "https://limitless-tor-79246.herokuapp.com/cors",
        method:"POST",
        data: {
        url: googleApiURL,
        key: "11e2d980d599766aa84847ae504d0f8257e7afacc76a285b05979fb7e17974e5"
    }})
}
function getPlaceDetials() {
    //call places API with below URL to get Place details
    placeDetailsURL ="https://maps.googleapis.com/maps/api/place/details/json?place_id=" + placeID + "&fields=formatted_address&key=AIzaSyCDdXamhyDjtM8Ttl4n3oKoRtvtoBnNI_Q";

    return $.ajax({
        url: "https://limitless-tor-79246.herokuapp.com/cors",
        method:"POST",
        data: {
        url: placeDetailsURL,
        key: "11e2d980d599766aa84847ae504d0f8257e7afacc76a285b05979fb7e17974e5"
    }})
};

function getPlacePhoto() {
    //call places API again with below URL to get photo
    photoAPIURL = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + photoreference + "&key=AIzaSyCDdXamhyDjtM8Ttl4n3oKoRtvtoBnNI_Q";
    return $.ajax({
        url: "https://limitless-tor-79246.herokuapp.com/cors/google/places/photoUrl",
        method:"POST",
        data: {
        url: photoAPIURL,
        key: "11e2d980d599766aa84847ae504d0f8257e7afacc76a285b05979fb7e17974e5"
    }})
}

function createNewDiv (placename, address, photoUrl) {
    
    console.log(address);
    console.log(photoUrl);
    var newCard = $(".place").clone();
    newCard.removeClass("invisible");
    newCard.removeClass("place");
    newCard.find(".placeImg").attr({src: photoUrl, alt: placename});
    newCard.find(".card-title").text(placename);
    newCard.find(".card-text").text(address);
    var listDiv =  $(".listResults");
    
    listDiv.prepend(newCard);
}
});


// }:


//         // $
//         // var feelslike = response.main.temp
//         // feelslike = (feelslike - 273.15) * 1.8 + 32
//         //   feelslike = Math.floor(feelslike)
//         //   var city = response.name;
//         //   var humidity = response.main.humidity;
//         //   var wind = response.wind.speed;
//         //   $("#current-weather").append('<div class="city">' + city + " " + moment().format("MM/DD/YYYY") + '<span class="test"></span>' + "</div>")
//         //       if (response.weather[0].main === "Clouds") {
//         //           $(".test").html(' <i class="fa fa-cloud"></i>')
//         //       };
//         //       if (response.weather[0].main === "Clear") {
//         //           $(".test").html(' <i class="fas fa-sun"></i>')
      
//         //       }
//         //   $("#current-weather").append("<div>Temperature(F): " + feelslike + "</div>")
//         //   $("#current-weather").append("<div>Humidity: " + humidity + " %</div>")
//         //   $("#current-weather").append("<div>Wind Speed: " + wind + " MPH</div>")
//         //   $("#list").prepend('<button type="button" class="btn btn-secondary btn-lg btn-block">' + city + '</button>')
//         //   $('.btn').each(function(){  
//         //       var searchHistory = 'latest item';
//         //       var searchEntry = (('MMMM Do YYYY, h:mm:ss a'), city);
//         //       localStorage.setItem(searchHistory, searchEntry);  
//         //       return searchEntry;      
//         //   });
