const apiKey = "20f80f60d74acf5419e80528f290a5b9";

function dateFormat(timestamp) {
    let date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let day = days[date.getDay()];
    if(minutes <= 9){
        return `${day} ${hours}:0${minutes}`;
    } else {
          return `${day} ${hours}:${minutes}`;
    }
}



function displayTemp(response) {
    let tempElement = document.querySelector("#temperature");
    let cityElement = document.querySelector("#city");
    let conditionsElement = document.querySelector("#conditions");
    let humidityElement = document.querySelector("#humidity");
    let windElement = document.querySelector("#windspeed");
    let dateElement = document.querySelector("#date");
    let iconElement = document.querySelector("#icon");

    celsiusTemp = response.data.main.temp;

    tempElement.innerHTML = Math.round(celsiusTemp);
    cityElement.innerHTML = response.data.name;
    conditionsElement.innerHTML = response.data.weather[0].description;
    humidityElement.innerHTML = response.data.main.humidity;
    windElement.innerHTML = Math.round(response.data.wind.speed);
    dateElement.innerHTML = dateFormat(response.data.dt *1000);
    iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    iconElement.setAttribute("alt", response.data.weather[0].description);
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
    axios.get(apiURL).then(displayTemp);
}
function showPosition(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    let units = "metric";
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`
    axios.get(`${apiURL}&appid=${apiKey}`).then(displayTemp);
    }
function getCurrentLocandTemp(event) {
    navigator.geolocation.getCurrentPosition(showPosition);
    }
getCurrentLocandTemp();

