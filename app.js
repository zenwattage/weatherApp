

const notificationElement = document.querySelector('.notification');
const iconElement = document.querySelector('.weather-icon');
const tempElement = document.querySelector('.temp-value p');
const descriptionElement = document.querySelector('.temp-description p');
const locationElement = document.querySelector('.location p');
const KELVIN = 273;

//weather storage object
const weather = {};

weather.temperature = {
    unit: 'celsius'
}

//check for geolocation support in users browser
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = '<p>Your browser doesn\'t support geolocation.</p>'
}

// set user position
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
};

function showError(error) {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = `<p>${error.message}</p>`;
}


// Get weather from api
function getWeather(latitude, longitude) {

    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${config.apiKey} `;

    fetch(api)
        .then(function (response) {

            let data = response.json();

            return data;
        })
        .then(function (data) {

            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function () {
            displayWeather();
        });
};

//update page icons
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descriptionElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
};

//convert C to F
function celsiusToFahrenheit(temperature) {
    return (temperature * 9 / 5) + 32;
}


//get click
tempElement.addEventListener("click", function () {
    //if user denies location
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit === "celsius") {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);

        //round off 
        fahrenheit = Math.floor(fahrenheit);

        //update page
        tempElement.innerHTML = `${fahrenheit}° <span>F</span>`;

        weather.temperature.unit = 'fahrenheit';
    } else {
        tempElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;

        weather.temperature.unit = 'celsius';
    }
})


