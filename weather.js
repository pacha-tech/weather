
function displayStatus(message, type = 'loading') {
    const statusEl = document.getElementById('status-message');
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    statusEl.style.display = 'block';
    if (type === 'success' || type === 'error') {
        setTimeout(() => statusEl.style.display = 'none', 5000);
    }
}

function updateDateTime() {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    const timeString = now.toLocaleTimeString('fr-FR', timeOptions);
    document.getElementById('local-time').textContent = timeString;

    const dateString = now.toLocaleDateString('fr-FR', dateOptions);
    document.getElementById('local-date').textContent = dateString.charAt(0).toUpperCase() + dateString.slice(1);
}

function loadWeatherData(data , cityName) {
    document.getElementById('city-name').textContent = cityName || data.name || 'Votre Localisation';
    document.getElementById('current-temp').textContent = data.main.temp;
    document.getElementById('feels-like').textContent = `${data.main.feels_like}°C`;
    
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.wind.speed.toFixed(2)} m/s`;
    
    const description = data.weather[0].description;
    document.getElementById('weather-description').textContent = description.charAt(0).toUpperCase() + description.slice(1);
    
    const main = data.weather[0].main;
    let iconText = '❓'; 
    if (main === 'Clouds') iconText = '☁️';
    else if (main === 'Rain' || main === 'Drizzle') iconText = '🌧️';
    else if (main === 'Clear') iconText = '☀️';
    else if (main === 'Thunderstorm') iconText = '⛈️';
    else if (main === 'Snow') iconText = '❄️';
    
    document.getElementById('weather-icon').textContent = iconText;

    const sunriseDate = new Date(data.sys.sunrise * 1000);
    const sunsetDate = new Date(data.sys.sunset * 1000);
    const sunriseTime = sunriseDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const sunsetTime = sunsetDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('sunrise-time').textContent = sunriseTime;
    document.getElementById('sunset-time').textContent = sunsetTime;
    document.getElementById('longitude').textContent = `${data.coord.lon}`;
    document.getElementById('lattitude').textContent = `${data.coord.lat}`;
    
    document.querySelectorAll('.forecast-placeholder').forEach(el => {
        el.style.display = 'none';
    });

    displayStatus(`Météo chargée pour ${data.name}.`, 'success');
}

function getData() {
    getUserLocation(async (lat, lon, error) => {
        if (error) {
            displayStatus(error, 'error');
            return;
        }

        try {
            displayStatus('Chargement des données météo...', 'loading');
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=fr&appid=${key_api}&units=metric`);
            const response2 = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${key_api}`);

            if (!response.ok) throw new Error('Erreur HTTP: ' + response.status);
            if (!response2.ok) throw new Error('Erreur géocodage: ' + response2.status);

            const data = await response.json();
            const data2 = await response2.json();
            const cityName = data2[0]?.name || null;

            loadWeatherData(data, cityName);
        } catch (error) {
            console.error('Erreur de récupération des données météo: ', error);
            displayStatus('Erreur lors du chargement des données météo', 'error');
        }
    });
}


window.onload = () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    getData();
    getForecast();
};