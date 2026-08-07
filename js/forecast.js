let dailyForecasts = [];
let hourlyForecasts = [];
let dailyChart = null;
let hourlyChart = null;

// Définition des couleurs pour le thème (Même si elles devraient être dans un fichier theme.js)
const LIGHT_COLOR = '#4b5563'; 
const DARK_COLOR = '#e0e0e0'; 
const GRID_LIGHT = '#e5e7eb'; 
const GRID_DARK = '#3b2929ff'; 

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

/**
 * Met à jour les options de couleur d'un graphique Chart.js pour le mode sombre/clair.
 * Cette fonction doit être appelée après la création du graphique.
 */
function setChartTheme(chartInstance) {
    if (!chartInstance) return;

    // Détecte si le body a la classe 'dark-mode'
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    const textColor = isDarkMode ? DARK_COLOR : LIGHT_COLOR;
    const gridColor = isDarkMode ? GRID_DARK : GRID_LIGHT;

    // Mise à jour des couleurs des axes et de la grille
    if (chartInstance.options.scales.x) {
        chartInstance.options.scales.x.grid.color = gridColor;
        chartInstance.options.scales.x.ticks.color = textColor;
        if (chartInstance.options.scales.x.title) {
            chartInstance.options.scales.x.title.color = textColor;
        }
    }
    
    if (chartInstance.options.scales.y) {
        chartInstance.options.scales.y.grid.color = gridColor;
        chartInstance.options.scales.y.ticks.color = textColor;
        if (chartInstance.options.scales.y.title) {
            chartInstance.options.scales.y.title.color = textColor;
        }
    }

    // Mise à jour de la couleur de la légende
    if (chartInstance.options.plugins.legend) {
        chartInstance.options.plugins.legend.labels.color = textColor;
    }

    chartInstance.update();
}


function updateDailyChart(dataType) {
    const ctx = document.getElementById('forecastChart')?.getContext('2d');
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? DARK_COLOR : LIGHT_COLOR;
    const gridColor = isDarkMode ? GRID_DARK : GRID_LIGHT;

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
                        text: yAxisTitle,
                        color: textColor 
                    },
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Jour',
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: textColor
                    }
                }
            }
        }
    });

    // Appliquer le thème après la création/mise à jour
    setChartTheme(dailyChart);
}


function updateHourlyChart(dataType) {
    const ctx = document.getElementById('forecast-day-Chart')?.getContext('2d');
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? DARK_COLOR : LIGHT_COLOR;
    const gridColor = isDarkMode ? GRID_DARK : GRID_LIGHT;

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
                        text: yAxisTitle,
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Heure',
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: textColor
                    }
                }
            }
        }
    });

    // Appliquer le thème après la création/mise à jour
    setChartTheme(hourlyChart);
}

function loadForecastData(data) {
    const dailyContainer = document.getElementById('forecast-container');
    const hourlyContainer = document.getElementById('forecast-hourly-container');

    dailyContainer.innerHTML = '';
    hourlyContainer.innerHTML = '';

    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? DARK_COLOR : LIGHT_COLOR;
    //const gridColor = isDarkMode ? GRID_DARK : GRID_LIGHT;

    // Prévisions quotidiennes (midi sur 5 jours)
    dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);

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
        .slice(0, 8);

    hourlyForecasts.forEach(item => {
        const time = new Date(item.dt * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const temp = item.main.temp.toFixed(1);
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

    // Appeler la fonction de thème sur les graphiques après leur création initiale
    setChartTheme(dailyChart);
    setChartTheme(hourlyChart);


    // Gérer les clics sur les boutons quotidiens
    document.querySelectorAll('#daily-buttons .forecast-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('#daily-buttons .forecast-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateDailyChart(button.dataset.type);
            // Appliquer le thème après la mise à jour des données
            setChartTheme(dailyChart);
        });
    });
 

    // Gérer les clics sur les boutons horaires
    document.querySelectorAll('#hourly-buttons .forecast-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('#hourly-buttons .forecast-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateHourlyChart(button.dataset.type);
            // Appliquer le thème après la mise à jour des données
            setChartTheme(hourlyChart);
        });
    });

}

function getForecast() {
    getUserLocation(async (lat, lon, error) => {

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=fr&appid=${key_weather_api}&units=metric`
            );
            if (!response.ok) throw new Error('Erreur HTTP: ' + response.status);
            const data = await response.json();
            loadForecastData(data);
            console.log(data);
        } catch (error) {
            console.error('Erreur de récupération des prévisions météo:', error);
        }
    });
}