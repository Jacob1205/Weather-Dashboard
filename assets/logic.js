const apiKey = "&appid=e07139e518a6bb618b7831a40e2be519";
var city = $("#searchTerm").val();

var date = new Date(),
  d = date.getDate(),
  m = date.getMonth(),
  y = date.getFullYear();

for (i = 0; i < 5; i++) {
  var curdate = new Date(y, m, d + i);
}

$("#searchTerm").keypress(function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    $("#searchButton").click();
  }
});

$("#searchButton").on("click", function () {
  $("#five-day-forecast").addClass("show");
  city = $("#searchTerm").val();
  $("#searchTerm").val("");

  const queryUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;
  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (data) {
    getCurrentWeather(data);
    retrieveForecast(data);
    createList();
  });
});

function createList() {
  var listItem = $("<li>").addClass("list-group-item").text(city);
  $(".list").append(listItem);
}

function getCurrentWeather(data) {
  var temperatureFaren = (data.main.temp - 273.15) * 1.8 + 32;
  temperatureFaren = Math.floor(temperatureFaren);
  $("#currentCity").empty();
  const card = $("<div>").addClass("card");
  const cardBody = $("<div>").addClass("card-body");
  const city = $("<h4>").addClass("card-title").text(data.name);
  const cityDate = $("<h4>")
    .addClass("card-title")
    .text(date.toLocaleDateString("en-US"));
  const temperature = $("<p>")
    .addClass("card-text")
    .text("Temperature: " + temperatureFaren + " °F");
  const humidity = $("<p>")
    .addClass("card-text")
    .text("Humidity: " + data.main.humidity + "%");
  const wind = $("<p>")
    .addClass("card-text")
    .text("Wind Speed: " + data.wind.speed + "MPH");
  const logoImage = $("<img>").attr(
    "src",
    "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
  );

  city.append(cityDate, logoImage);
  cardBody.append(city, temperature, humidity, wind);
  card.append(cardBody);
  $("#currentCity").append(card);
}

function retrieveForecast() {
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey,
    method: "GET",
  }).then(function (data) {
    $("#forecast").empty();
    var results = data.list;
    for (var i = 0; i < results.length; i++) {
      if (results[i].dt_txt.indexOf("12:00:00") !== -1) {
        var temp = (results[i].main.temp - 273.15) * 1.8 + 32;
        var temperatureFaren = Math.floor(temp);
        const card = $("<div>").addClass(
          "card col-md-2 ml-4 bg-dark text-white"
        );
        const cardBody = $("<div>").addClass("card-body p-3");
        const cityDate = $("<h4>")
          .addClass("card-title")
          .text(curdate.toLocaleDateString("en-US"));
        const temperature = $("<p>")
          .addClass("card-text")
          .text("Temperature: " + temperatureFaren + " °F");
        const humidity = $("<p>")
          .addClass("card-text")
          .text("Humidity: " + results[i].main.humidity + "%");
        const logoImage = $("<img>").attr(
          "src",
          "https://openweathermap.org/img/w/" +
            results[i].weather[0].icon +
            ".png"
        );

        cardBody.append(cityDate, logoImage, temperature, humidity);
        card.append(cardBody);
        $("#forecast").append(card);
      }
    }
  });
}
