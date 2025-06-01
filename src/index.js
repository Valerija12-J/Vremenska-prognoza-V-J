function displayTemperature(response) {
  let temperatureElement = document.querySelector("#current-temperature");
  let temperature = Math.round(response.data.temperature.current);
  let cityElement = document.querySelector("#current-city");
  let conditionElement = document.querySelector("#current-condition");
  let humidityElement = document.querySelector("#current-humidity");
  let windElement = document.querySelector("#current-wind");

  cityElement.innerHTML = response.data.city;
  temperatureElement.innerHTML = temperature;
  conditionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windElement.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;
}

function getWeatherEmoji(description) {
  const emojiMap = {
    "clear sky": "☀️",
    "sky is clear": "☀️",
    "few clouds": "🌤️",
    "scattered clouds": "☁️",
    "broken clouds": "☁️",
    "overcast clouds": "☁️",
    "light rain": "🌦️",
    "moderate rain": "🌧️",
    "heavy rain": "🌧️",
    "shower rain": "🌧️",
    thunderstorm: "⛈️",
    snow: "❄️",
    "light snow": "🌨️",
    mist: "🌫️",
    fog: "🌫️",
  };

  description = description.toLowerCase();

  if (emojiMap[description]) {
    return emojiMap[description];
  } else {
    return "";
  }
}

function displayForecast(response) {
  let forecastContainer = document.querySelector("#forecast-container");
  forecastContainer.innerHTML = "";

  response.data.daily.forEach(function (forecastDay, index) {
    if (index < 7) {
      let emoji = getWeatherEmoji(forecastDay.condition.description);
      let forecastCard = `
        <div class="forecast-card">
          <h3>${formatDay(forecastDay.time)}</h3>
          <p>${emoji} ${forecastDay.condition.description}</p>
          <p><strong>${Math.round(forecastDay.temperature.day)}°C</strong></p>
        </div>
      `;
      forecastContainer.innerHTML += forecastCard;
    }
  });
}

function handleError(error) {
  alert("Sorry, we couldn't find the city you entered. Please try again.");
}

function search(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#search-input");
  let city = searchInputElement.value.trim();

  if (city === "") {
    alert("Please enter a city name");
    return;
  }

  let apiKey = "b2a5adcct04b33178913oc335f405433";
  let currentWeatherUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  axios.get(currentWeatherUrl).then(displayTemperature).catch(handleError);
  axios.get(forecastUrl).then(displayForecast).catch(handleError);
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let day = date.getDay();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let formattedDay = days[day];
  return `${formattedDay} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

let currentDateElement = document.querySelector("#current-date");
let currentDate = new Date();

currentDateElement.innerHTML = formatDate(currentDate);
