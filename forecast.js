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

    // Filtrer les prévisions pour 12h00 (midi) sur 5 jours
    const dailyForecasts = data.list
        .filter(item => item.dt_txt.includes('12:00:00'))
        .slice(0, 5);

    // Préparer les données pour le chart
    const labels = dailyForecasts.map(day =>
        new Date(day.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
    );
    const tempMinData = dailyForecasts.map(day => day.main.temp_min);
    const tempMaxData = dailyForecasts.map(day => day.main.temp_max);

    // Afficher les prévisions dans le HTML
    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
        const tempMin = day.main.temp_min.toFixed(1);
        const tempMax = day.main.temp_max.toFixed(1);
        const icon = getWeatherIcon(day.weather[0].main);
        const description = day.weather[0].description.charAt(0).toUpperCase() + day.weather[0].description.slice(1);

        const forecastHTML = `
            <div class="forecast-day">
                <p class="forecast-day-name">${date}</p>
                <span class="forecast-icon">${icon}</span>
                <p class="forecast-temp">${tempMin} / ${tempMax} °C</p>
                <p class="forecast-description">${description}</p>
            </div>
        `;
        container.innerHTML += forecastHTML;
    });

    // Créer le chart
    const ctx = document.getElementById('forecastChart').getContext('2d');
    // Détruire le chart existant s'il y en a un
    let chart = Chart.getChart('forecastChart');
    if (chart) chart.destroy();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Température Min (°C)',
                    data: tempMinData,
                    borderColor: '#3b82f6', // Bleu
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Température Max (°C)',
                    data: tempMaxData,
                    borderColor: '#f97316', // Orange
                    backgroundColor: 'rgba(249, 115, 22, 0.2)',
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Température (°C)'
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

    // Afficher le message de succès
    document.getElementById('status-message').textContent = `Prévisions météo chargées pour ${data.city.name || 'votre localisation'}.`;
    document.getElementById('status-message').className = 'status-message success';
    setTimeout(() => document.getElementById('status-message').style.display = 'none', 5000);
}


function loadForecastDayData(data) {

    
    const today = new Date().toISOString().split('T')[0];
    const hourlyForecasts = data.list.filter(item => item.dt_txt.startsWith(today)).slice(0, 8);

    
    const labels = hourlyForecasts.map(item =>
        new Date(item.dt * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    );
    const tempData = hourlyForecasts.map(item => item.main.temp);
    const feelsLikeData = hourlyForecasts.map(item => item.main.feels_like);

    /*
    // Afficher les prévisions horaires dans le HTML
    hourlyForecasts.forEach(item => {
        const time = new Date(item.dt * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const temp = item.main.temp.toFixed(1);
        const feelsLike = item.main.feels_like.toFixed(1);
        const icon = getWeatherIcon(item.weather[0].main);
        const description = item.weather[0].description.charAt(0).toUpperCase() + item.weather[0].description.slice(1);

        const forecastHTML = `
            <div class="forecast-hour">
                <p class="forecast-time">${time}</p>
                <span class="forecast-icon">${icon}</span>
                <p class="forecast-temp">${temp} °C (Ressenti: ${feelsLike} °C)</p>
                <p class="forecast-description">${description}</p>
            </div>
        `;
        container.innerHTML += forecastHTML;
    });
    */

    
    const ctx = document.getElementById('forecast-day-Chart').getContext('2d');

   
    //let chart = Chart.getChart('forecast-day-Chart');

    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Température (°C)',
                    data: tempData,
                    borderColor: '#3b82f6', // Bleu
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Ressenti (°C)',
                    data: feelsLikeData,
                    borderColor: '#f97316', // Orange
                    backgroundColor: 'rgba(249, 115, 22, 0.2)',
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Température (°C)'
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
            loadForecastDayData(data);
            console.log(data); // Pour débogage
        } catch (error) {
            console.error('Erreur de récupération des prévisions météo:', error);
            document.getElementById('status-message').textContent = 'Erreur lors du chargement des prévisions météo';
            document.getElementById('status-message').className = 'status-message error';
        }
    });
}