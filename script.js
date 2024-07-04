document.getElementById('fetchDataBtn').addEventListener('click', () => {
    console.log("Fetch Data button clicked.");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log(`Latitude: ${lat}, Longitude: ${lon}`);
    initMap(lat, lon);
    fetchWeatherData(lat, lon);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function initMap(lat, lon) {
    console.log(`Initializing map with Latitude: ${lat}, Longitude: ${lon}`);
    const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: lat, lng: lon},
        zoom: 8
    });
    new google.maps.Marker({
        position: {lat: lat, lng: lon},
        map: map
    });
}

async function fetchWeatherData(lat, lon) {
    const apiKey = '62115aa18a33eff08637e249e641775a';  // Replace with your actual OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}`;

    console.log(`Fetching weather data from URL: ${url}`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Weather data:', data);
        displayWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayWeatherData(data) {
    const weatherDataDiv = document.getElementById('weatherData');
    const temp = data.current.temp;
    const weather = data.current.weather[0].description;

    weatherDataDiv.innerHTML = `
        <h2>Current Weather</h2>
        <p>Temperature: ${temp}°K</p>
        <p>Condition: ${weather}</p>
    `;
}

function initMap() {
    const initialLocation = { lat: 0, lng: 0 }; // Default to center of the world
    const map = new google.maps.Map(document.getElementById('map'), {
        center: initialLocation,
        zoom: 8
    });

    // Try HTML5 geolocation to get the user's current position
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(userLocation);
                const marker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: 'You are here'
                });
            },
            () => {
                handleLocationError(true, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, pos) {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 8
    });
    const infoWindow = new google.maps.InfoWindow();
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? 'Error: The Geolocation service failed.'
            : 'Error: Your browser doesn\'t support geolocation.'
    );
    infoWindow.open(map);
}