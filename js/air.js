

function loadAirData(data) {
    const aqi = document.getElementById('air-quality');
    aqi.textContent = data.list[0].main.aqi;
}


function getAirQualityData(){
    getUserLocation(async (lat, lon, error)=>{
        if(error){
            console.log("Erreur lors de la recuperation des donnee de l'air");
            return;
        }

        const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key_weather_api}`;

        try{
            const response = await fetch(airQualityUrl);
            if (!response.ok) throw new Error('Erreur HTTP IQA: ' + response.status);
            const data = await response.json();
            loadAirData(data);

        }catch(error){
            console.log("erreur lors de la recuperation des donnees de l'air");
        }
    });
}
