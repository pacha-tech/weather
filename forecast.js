
function getWeatherIcon(main) {
    switch (main) {
        case 'Clouds': return '☁️';
        case 'Rain': case 'Drizzle': return '🌧️';
        case 'Clear': return '☀️';
        case 'Thunderstorm': return '⛈️';
        case 'Snow': return '❄️';
        default: return '❓';
    }
}

function loadForecastData(data) {
    const container = document.getElementById('forecast-container');
    container.innerHTML = '';


    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
        const tempMin = day.main.temp_min.toFixed(1);
        const tempMax = day.main.temp_max.toFixed(1);
        const icon = getWeatherIcon(day.weather[0].main);

        const forecastHTML = `
            <div class="forecast-day">
                <p class="forecast-day-name">${date}</p>
                <span class="forecast-icon">${icon}</span>
                <p class="forecast-temp">${tempMin} / ${tempMax} °C</p>
                <p class="forecast-temp">${day.weather[0].description}</p>
            </div>
        `;
        container.innerHTML += forecastHTML;
    });

    document.getElementById('status-message').textContent = 'Prévisions météo chargées.';
    document.getElementById('status-message').className = 'status-message success';
    setTimeout(() => document.getElementById('status-message').style.display = 'none', 5000);
}

function getForecast() {
    getUserLocation(async (lat, lon, error) => {
        if (error) {
            document.getElementById('status-message').textContent = error;
            document.getElementById('status-message').className = 'status-message error';
            return;
        }

        try {
            document.getElementById('status-message').textContent = 'Chargement des prévisions météo...';
            document.getElementById('status-message').className = 'status-message loading';
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=fr&appid=${key_api}&units=metric`);
            if (!response.ok) throw new Error('Erreur HTTP: ' + response.status);
            const data = await response.json();
            loadForecastData(data);
            console.log(data);
        } catch (error) {
            console.error('Erreur de récupération des prévisions météo: ', error);
            document.getElementById('status-message').textContent = 'Erreur lors du chargement des prévisions météo';
            document.getElementById('status-message').className = 'status-message error';
        }
    });
}
