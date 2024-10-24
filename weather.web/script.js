document.getElementById('getWeatherBtn').addEventListener('click', function() {
    const location = document.getElementById('locationInput').value;
    if (location) {
        getWeather(location);
    } else {
        showError('Please enter a city name.');
    }
});

window.onload = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByCoords(lat, lon);
            },
            () => {
                showError('Unable to retrieve your location.');
            }
        );
    } else {
        showError('Geolocation is not supported by this browser.');
    }
};

function updateDate() {
    const dateElement = document.getElementById('currentDate');
    const currentDate = new Date();
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    
    dateElement.textContent = `${formattedDate}`;
}

updateDate();


function getWeather(location) {
    const apiKey = '6154c613c666e47f8ad04e04df204411';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
    fetchWeather(url);
}

function getWeatherByCoords(lat, lon) {
    const apiKey = '6154c613c666e47f8ad04e04df204411';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    fetchWeather(url);
}

function fetchWeather(url) {
    showLoading();

    fetch(url)
        .then(response => response.json())
        .then(data => {
            hideLoading();
            if (data.cod === 200) {
                updateUI(data);
            } else {
                showError('City not found. Please try again.');
            }
        })
        .catch(() => {
            hideLoading();
            showError('Error fetching the weather data.');
        });
}


function showLoading() {
    document.getElementById('loadingSpinner').classList.remove('hidden');
    document.getElementById('weatherData').classList.add('hidden'); 
    document.getElementById('errorMessage').classList.add('hidden'); 
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.add('hidden');
}


function updateUI(data) {
    document.getElementById('city').textContent = ` ${data.name} Weather`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('temperature').textContent = `${data.main.temp} °C`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `Wind Speed: ${data.wind.speed} km/h`;

    changeBackground(data.weather[0].main.toLowerCase());

    const weatherData = document.getElementById('weatherData');
    weatherData.classList.remove('hidden');
    setTimeout(() => {
        weatherData.classList.add('show');
    }, 100);
}

function changeBackground(weather) {
    let weatherIcon = document.getElementById('weatherIcon');

    switch (weather) {
        case 'clear':
            weatherIcon.src = 'assets/icons/clear-sky.png';
            break;
        case 'rain':
            weatherIcon.src = 'assets/icons/rain.png';
            break;
        case 'clouds':
            weatherIcon.src = 'assets/icons/clouds.png';
            break;
        case 'snow':
            weatherIcon.src = 'assets/icons/snow.png';
            break;
        case 'haze':
            weatherIcon.src = 'assets/icons/haze.png';
            break;
        case 'night':
            weatherIcon.src = 'assets/icons/night.png';
    }
}



function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorMessage').classList.remove('hidden');
}
