function updateDateTime() {
    const now = new Date();
    const hour = now.getHours();

    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const timeString = now.toLocaleTimeString('fr-FR', timeOptions);
    document.getElementById('local-time').textContent = timeString;

    const dateString = now.toLocaleDateString('fr-FR', dateOptions);
    document.getElementById('local-date').textContent = dateString.charAt(0).toUpperCase() + dateString.slice(1);
    
    let timeIconHTML = '';
    
    if (hour >= 0 && hour <= 6) { 
        timeIconHTML = '<span class="time-icon">🌑</span>';
    
    } else if (hour > 6 && hour <= 8) {
        timeIconHTML = '<span class="time-icon">🌅</span>';
        
    } else if (hour > 8 && hour <= 12) {
        timeIconHTML = '<span class="time-icon">☀️</span>';
        
    } else if (hour > 12 && hour <= 17) {
        timeIconHTML = '<span class="time-icon">🌤️</span>';
        
    } else if (hour > 17 && hour <= 20) {
        timeIconHTML = '<span class="time-icon">🌇</span>';
        
    } else { 
        timeIconHTML = '<span class="time-icon">🌙</span>';
    }

    document.getElementById('time-of-day-icon').innerHTML = timeIconHTML;
}



document.addEventListener('DOMContentLoaded', () => {
    // Nouvelle référence à la case à cocher
    const toggleInput = document.getElementById('dark-mode-toggle');
    const body = document.body;
    
    // --- 1. Charger la préférence enregistrée ---
    const savedTheme = localStorage.getItem('theme');
    
    // Appliquer le thème sauvegardé
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        toggleInput.checked = true; // Coche la case à cocher
    } else {
        body.classList.remove('dark-mode');
        toggleInput.checked = false; // Décoche la case à cocher
    }

    // --- 2. Gérer l'événement de changement (click ou keypress) ---
    if (toggleInput) {
        toggleInput.addEventListener('change', () => {
            // Basculer la classe sur le body
            body.classList.toggle('dark-mode', toggleInput.checked);
            
            // Sauvegarder la nouvelle préférence
            if (toggleInput.checked) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }
});