
let dailyForecasts = [];
let hourlyForecasts = [];
let dailyChart = null;
let hourlyChart = null;

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


function updateDailyChart(dataType) {
    const ctx = document.getElementById('forecastChart')?.getContext('2d');


    const labels = dailyForecasts.map(day =>
        new Date(day.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
    );
    let datasets, yAxisTitle;
    switch (dataType) {
        
        case 'temperature':
            datasets = [
                {
                    label: 'Température Min (°C)',
                    data: dailyForecasts.map(day => day.main.temp_min),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Température Max (°C)',
                    data: dailyForecasts.map(day => day.main.temp_max),
                    borderColor: '#f97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.2)',
                    fill: false,
                    tension: 0.4
                }
            ];
            yAxisTitle = 'Température (°C)';
            break;
        case 'feels_like':
            datasets = [{
                label: 'Ressenti (°C)',
                data: dailyForecasts.map(day => day.main.feels_like),
                borderColor: 'red',
                backgroundColor: 'rgba(249, 115, 22, 0.2)',
                fill: false,
                tension: 0.4
            }];
            yAxisTitle = 'Ressenti (°C)';
            break;
        case 'humidity':
            datasets = [{
                label: 'Humidité (%)',
                data: dailyForecasts.map(day => day.main.humidity),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                fill: false,
                tension: 0.4
            }];
            yAxisTitle = 'Humidité (%)';
            break;
        case 'wind_speed':
            datasets = [{
                label: 'Vitesse du vent (m/s)',
                data: dailyForecasts.map(day => day.wind.speed),
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                fill: false,
                tension: 0.4
            }];
            yAxisTitle = 'Vitesse du vent (m/s)';
            break;
        default:
            return;
    }


    if (dailyChart) dailyChart.destroy();

    dailyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: yAxisTitle
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Jour'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}


function updateHourlyChart(dataType) {
    const ctx = document.getElementById('forecast-day-Chart')?.getContext('2d');

    const labels = hourlyForecasts.map(item =>
        new Date(item.dt * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    );

    let dataset, yAxisTitle;

    switch (dataType) {
        case 'temperature':
            dataset = {
                label: 'Température (°C)',
                data: hourlyForecasts.map(item => item.main.temp),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
            };
            yAxisTitle = 'Température (°C)';
            break;
        case 'feels_like':
            dataset = {
                label: 'Ressenti (°C)',
                data: hourlyForecasts.map(item => item.main.feels_like),
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.2)',
            };
            yAxisTitle = 'Température (°C)';
            break;
        case 'humidity':
            dataset = {
                label: 'Humidité (%)',
                data: hourlyForecasts.map(item => item.main.humidity),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
            };
            yAxisTitle = 'Humidité (%)';
            break;
        case 'wind_speed':
            dataset = {
                label: 'Vitesse du vent (m/s)',
                data: hourlyForecasts.map(item => item.wind.speed),
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
            };
            yAxisTitle = 'Vitesse du vent (m/s)';
            break;
        default:
            return;
    }


    if (hourlyChart) hourlyChart.destroy();


    hourlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{ ...dataset, fill: false, tension: 0.4 }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: yAxisTitle
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Heure'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}

function loadForecastData(data) {
    const dailyContainer = document.getElementById('forecast-container');
    const hourlyContainer = document.getElementById('forecast-hourly-container');

    dailyContainer.innerHTML = '';
    hourlyContainer.innerHTML = '';

    // Prévisions quotidiennes (midi sur 5 jours)
    dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
        const tempMin = day.main.temp_min.toFixed(1);
        const tempMax = day.main.temp_max.toFixed(1);
        //const humidity = day.main.humidity;
        //const windSpeed = day.wind.speed.toFixed(1);
        const icon = getWeatherIcon(day.weather[0].main);
        const description = day.weather[0].description.charAt(0).toUpperCase() + day.weather[0].description.slice(1);

        const forecastHTML = `
            <div class="forecast-day">
                <p class="forecast-day-name">${date}</p>
                <span class="forecast-icon">${icon}</span>
                <p class="forecast-temp">${tempMin}/${tempMax} °C</p>
                <p class="forecast-temp">${description}</p> 
            </div>
        `;
        dailyContainer.innerHTML += forecastHTML;
    });

    // Prévisions horaires (aujourd'hui)
    const today = new Date().toISOString().split('T')[0];
    hourlyForecasts = data.list
        .filter(item => item.dt_txt.startsWith(today))
        .slice(0, 8); // Limiter à 8 points (00:00 à 21:00)

    hourlyForecasts.forEach(item => {
        const time = new Date(item.dt * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const temp = item.main.temp.toFixed(1);
        //const feelsLike = item.main.feels_like.toFixed(1);
        //const humidity = item.main.humidity;
        //const windSpeed = item.wind.speed.toFixed(1);
        const icon = getWeatherIcon(item.weather[0].main);
        const description = item.weather[0].description.charAt(0).toUpperCase() + item.weather[0].description.slice(1);

        const forecastHTML = `
            <div class="forecast-hour">
                <p class="forecast-time">${time}</p>
                <span class="forecast-icon">${icon}</span>
                <p class="forecast-temp">${temp} °C</p>
                <p class="forecast-description">${description}</p>
            </div>
        `;
        hourlyContainer.innerHTML += forecastHTML;
    });

    
    updateDailyChart('temperature');
    updateHourlyChart('temperature');

    // Gérer les clics sur les boutons quotidiens
    document.querySelectorAll('#daily-buttons .forecast-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('#daily-buttons .forecast-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateDailyChart(button.dataset.type);
        });
    });
 

    // Gérer les clics sur les boutons horaires
    document.querySelectorAll('#hourly-buttons .forecast-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('#hourly-buttons .forecast-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateHourlyChart(button.dataset.type);
        });
    });

    // Afficher le message de succès
    document.getElementById('status-message').textContent = `Prévisions météo chargées pour ${data.city.name || 'votre localisation'}.`;
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
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=fr&appid=${key_api}&units=metric`
            );
            if (!response.ok) throw new Error('Erreur HTTP: ' + response.status);
            const data = await response.json();
            loadForecastData(data);
            console.log(data);
        } catch (error) {
            console.error('Erreur de récupération des prévisions météo:', error);
            document.getElementById('status-message').textContent = 'Erreur lors du chargement des prévisions météo';
            document.getElementById('status-message').className = 'status-message error';
        }
    });
}
