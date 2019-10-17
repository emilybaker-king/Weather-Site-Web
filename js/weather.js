
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

    //When a button is clicked with the id of remove in the document, call the function
    $(document).on("click", "button#remove", function() {
        //get the parent element of the button
        let parentDiv = $(this).parent(); //this refers to the element that triggered the event hadler (in this case the buttton that was clicked)
        let weatherCardContainer = parentDiv.parent();
        //remove the container and all of its contents
        weatherCardContainer.remove();
    })
})();

//Function to connect to the Dark Sky API and get weather data
function getWeatherInfo(latitude, longitude, city, state) {

    //Base-URL/APIKey/Latitude,Longitude
    $.ajax("https://api.darksky.net/forecast/" + darkSkyKey + "/" + latitude + "," + longitude, { dataType: "jsonp"})
    .done(function(data) {
        //Get the HTML from the div with the ID template
        let templateHTML = $("#template").html();
        //We need to get the temp from Dark Sky data
         let temperature = data.currently.temperature;
         let conditions = data.currently.summary;

        let currentDayInfo = data.daily.data[0];
        let highTemp = currentDayInfo.temperatureHigh;
        let lowTemp = currentDayInfo.temperatureLow;
        let precipChance = currentDayInfo.precipProbability * 100;
        
        //Replace the string @@city@@ with the city we pass into this functiom in the HTML
        templateHTML = templateHTML.replace("@@city@@", city);
        //Replace the string "@@currentTemp@@' with the temperature we get back from the API call
        templateHTML = templateHTML.replace("@@currentTemp@@", Math.round(temperature));

        templateHTML = templateHTML.replace("@@cityState@@", city + " " + state);

        templateHTML = templateHTML.replace("@@conditions@@", conditions);

        templateHTML = templateHTML.replace("@@highTemp@@", Math.round(highTemp));

        templateHTML = templateHTML.replace("@@lowTemp@@", Math.round(lowTemp));

        templateHTML = templateHTML.replace("@@precip@@", Math.round(precipChance));

        //Add the configured template HTML to our row in the card container
        $(".row").append(templateHTML);
       
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