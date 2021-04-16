const apiKey = "20f80f60d74acf5419e80528f290a5b9";

function dateFormat(timestamp, timedisplay = true) {
    let date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let day = days[date.getDay()];
    if (timedisplay === false) {
        return `${day}`;
    }
    if (minutes <= 9) {
        return `${day} ${hours}:0${minutes}`;
    } else {
        return `${day} ${hours}:${minutes}`;
    }
}
function displayForecast(values) {
    /*
       days needs to have: 
            array of days
       each day needs to have: 
            name of the day, 
            icon for the weather for that day,
            max temp,
            min temp
    
     days: [day, day, day]
     day: {name: "Tuesday", icon: "cats.jpg", max_temp: 12.34, min_temp: -32.10}
    */
  let days = values.slice(1,7);
  let forecastElement = document.querySelector("#forecast-temps");
    
  let forecastHTML = `<div class="row">`;
    days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
      <div class="col-2">
        <div class="weather-forecast-date">${dateFormat(day.dt * 1000, false)}</div>
        <img
          src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="forecast-temp-max"> ${Math.round(day.temp.max)}˚ </span>
          <span class="forecast-temp-min"> ${Math.round(day.temp.min)}˚ </span>
        </div>
      </div>
  `;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates){
    // coordinates: {lat: 123.123, lon: 124.124}
    console.log(coordinates);
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(function (response) {
        let days = response.data.daily
        displayForecast(days);
    }); // When we call this, we make an API request, then pass the response from that request to displayForecast
    // response: {data: {daily: [{dt: 1231232, sunrise: 123123123, etc}]}}
}

function displayTemp(values) {
    // values = {
    //         celsius: '',
    //         city: '',
    //         conditions: '',
    //         humidity: '',
    //         wind_speed: '',
    //         dt: '',
    //         description: '',
    //         icon: '',
    //         lat: '',
    //         lon: '',
    //     };
    let tempElement = document.querySelector("#temperature");
    let cityElement = document.querySelector("#city");
    let conditionsElement = document.querySelector("#conditions");
    let humidityElement = document.querySelector("#humidity");
    let windElement = document.querySelector("#windspeed");
    let dateElement = document.querySelector("#date");
    let iconElement = document.querySelector("#icon");

    celsiusTemp = values.celsius;
    tempElement.innerHTML = Math.round(celsiusTemp);
    cityElement.innerHTML = values.city || "Seattle";
    conditionsElement.innerHTML = values.conditions;
    humidityElement.innerHTML = values.humidity;
    windElement.innerHTML = Math.round(values.wind_speed);
    dateElement.innerHTML = dateFormat(values.dt *1000);
    iconElement.setAttribute("src", `https://openweathermap.org/img/wn/${values.icon}@2x.png`);
    iconElement.setAttribute("alt", values.description);

    // response: {data: {coord: {lat: 123.123, lon: 124.124}}}
    // response.data: {coord: {lat: 123.123, lon: 124.124}}
    // response.data.coord: {lat: 123.123, lon: 124.124}
    getForecast({lat: values.lat, lon: values.lon}); // Take the response object and pass its data.coord value to getForecast, using the example above would mean that we're passing: {lat: 123.123, lon: 124.124} to getForecast
}
function showFahrenheitTemp (event) {
    event.preventDefault();
    let tempElement = document.querySelector("#temperature");
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
    let fahrenheitTemp = (celsiusTemp * 9) /5 + 32;
    tempElement.innerHTML = Math.round(fahrenheitTemp);
}

function showCelsiusTemp (event) {
    event.preventDefault ();
    let tempElement = document.querySelector("#temperature");
    fahrenheitLink.classList.remove("active");
    celsiusLink.classList.add("active");
    tempElement.innerHTML = Math.round(celsiusTemp);
}

let fahrenheitLink = document.querySelector("#f-conversion");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

let celsiusLink = document.querySelector("#c-conversion");
celsiusLink.addEventListener("click", showCelsiusTemp);

let celsiusTemp = null;

let searchForm = document.querySelector("#search-city-form");
    searchForm.addEventListener("submit", searchCity);

function searchCity(event) {
    console.log("search-city-form submitted");
    event.preventDefault();
    let cityInput = document.querySelector("#city-form");
    let city = cityInput.value;
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiURL).then(function (response) {
        console.log(response);
        let main = response.data.main
        let coord = response.data.coord
        let values = {
            celsius: main.temp,
            city: response.data.name,
            conditions: response.data.weather[0].description,
            humidity: main.humidity,
            wind_speed: response.data.wind.speed,
            dt: response.data.dt,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
            lat: coord.lat,
            lon: coord.lon,
        }
        displayTemp(values);
    });
}

function showPosition(position) {
    console.log("showPosition called with position:", position);
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    console.log(lat, long)
    let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`
    // axios.get(apiURL).then(displayTemp)
    axios.get(apiURL).then(function (response) {
        let current = response.data.current
        // celsiusTemp = response.data.current.temp;
        // cityElement = response.data.name
        // conditions = response.data.current.weather[0].description
        // humidity = response.data.current.humidity
        // wind_speed = response.data.current.wind_speed
        // dt = response.data.current.dt
        // icon = response.data.current.weather[0].icon
        // description = response.data.current.weather[0].description
        let values = {
            celsius: current.temp,
            city: response.data.name,
            conditions: current.weather[0].description,
            humidity: current.humidity,
            wind_speed: current.wind_speed,
            dt: current.dt,
            description: current.weather[0].description,
            icon: current.weather[0].icon,
            lat: response.data.lat,
            lon: response.data.lon,
        };
        displayTemp(values);
    });
}

function getCurrentLocandTemp(event) {
    console.log("getCurrentLocandTemp called");
    showPosition({coords: {latitude: 47.6062, longitude: -122.3321}})
    navigator.geolocation.getCurrentPosition(showPosition);
}

getCurrentLocandTemp();
