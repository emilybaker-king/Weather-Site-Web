
(function () {
    //Submit button event handler 
    $("#submit").click(function() {
        //get the value the user has entered in the search bar and store it
        const searchLocation = $("#searchBar").val();
        //call the geocode function and pass in the value
        geocode(searchLocation);
        //clear out the search bar
        $("#searchBar").val("");
    });
})();

//Function to connect to the Dark Sky API and get weather data
function getWeatherInfo(latitude, longitude, city, state) {

    //Base-URL/APIKey/Latitude,Longitude
    $.ajax("https://api.darksky.net/forecast/" + darkSkyKey + "/" + latitude + "," + longitude, { dataType: "jsonp"})
    .done(function(data) {
        //see if youcan get the following data from the JSON:

        //1. get the current temperature
        //2. get the probability of precipitation
        //3. get the high and low temperature for the current day (first element in the data array in the daily object)
        
        let currentTemp = data.currently[0].temperature[0] ;
        console.log(currentTemp);
    })
    .fail(function(error) {
        console.log(error);
    })
    .always(function() {
        console.log("Weather call complete!")
    })

}

//Function to connect  tohe MapQuest Geocoding API and get geocoding data
function geocode(location) {

    //Base-URL + APIKeys + &Location= + Address
    $.ajax("http://www.mapquestapi.com/geocoding/v1/address?key=" + mapQuestKey + "&location=" + location)
    .done(function(data) {
        //get the lat and lng from our response
        let locations = data.results[0].locations[0];

        let lat = locations.latLng.lat;
        let lng = locations.latLng.lng;

        //Get the city and the state so we can display it to the user
        let city = locations.adminArea5;
        let state = locations.adminArea3;

        //pass the lat and lng to our getWeatherInfo function
        getWeatherInfo(lat, lng, city, state);
    })
    .fail(function(error) {
        console.log(error);
    })
    .always(function() {
        console.log("Geocoding call complete!")
    })

}