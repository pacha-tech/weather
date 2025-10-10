function getUserLocation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        callback(lat, lon); // Appeler le callback avec les coordonnées
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error.message);
        callback(null, null, 'Erreur de géolocalisation: ' + error.message);
      }
    );
  } else {
    console.error('Géolocalisation non supportée par ce navigateur.');
    callback(null, null, 'Géolocalisation non supportée');
  }
}

