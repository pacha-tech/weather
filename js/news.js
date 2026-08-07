// Assurez-vous que 'key_news_api' est défini dans config.js
// et est accessible globalement ou importé.
const NEWS_API_KEY = key_news; // Exemple : Récupération de la clé depuis config.js

function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    
    // Si le conteneur n'est pas trouvé (erreur dans l'ID), on arrête
    if (!newsContainer) {
        console.error("Erreur: L'élément #news-container est introuvable.");
        return;
    }

    // Vider le message de statut initial
    newsContainer.innerHTML = ''; 

    if (articles.length === 0) {
        newsContainer.innerHTML = '<p class="section-note">Aucune actualité trouvée pour cette région.</p>';
        return;
    }

    articles.forEach(article => {
        // Crée l'élément div pour chaque article
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('news-article');

        let imageHtml = '';
        // 1. Image
        if (article.urlToImage) {
            imageHtml = `<img src="${article.urlToImage}" alt="${article.title}" class="news-image">`;
        } else {
             // Utiliser une icône ou une image par défaut si l'URL est manquante
             imageHtml = '<div class="news-no-image">📰</div>';
        }
        
        // 2. Formatage du temps
        const publishedDate = new Date(article.publishedAt);
        const timeAgo = publishedDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

        // 3. Construction de la carte d'article
        articleDiv.innerHTML = `
            <a href="${article.url}" target="_blank" class="news-link">
                ${imageHtml}
                <div class="news-content">
                    <h3 class="news-title">${article.title}</h3>
                    <p class="news-source">${article.source.name} - ${timeAgo}</p>
                </div>
            </a>
        `;
        
        newsContainer.appendChild(articleDiv);
    });
}

function getNewsData() {
    // Note: Pour obtenir des 'Actualités Locales', nous allons utiliser le paramètre 'country'.
    // Remplacez 'fr' par le code du pays souhaité (par exemple: 'us', 'ca', 'gb', etc.) 
    
    const apiUrl = `https://newsapi.org/v2/everything?q=bitcoin&apiKey=${NEWS_API_KEY}&language=fr`;
    
    // Utilisation de Fetch (moderne et ne nécessite pas l'import d'Axios)
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                // Si la clé est invalide ou la limite est atteinte, une erreur est lancée
                throw new Error(`Erreur API News: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Afficher seulement les 5 premiers articles pour ne pas surcharger la grille
            displayNews(data.articles.slice(0, 5)); 
        })
        .catch(error => {
            console.error('Erreur de récupération des actualités:', error);
            const newsContainer = document.getElementById('news-container');
            if (newsContainer) {
                newsContainer.innerHTML = `<p class="section-note error">Échec du chargement des actualités. Vérifiez la clé API. (${error.message})</p>`;
            }
        });
}