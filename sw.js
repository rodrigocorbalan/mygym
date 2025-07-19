// Em sw.js
const CACHE_NAME = 'mygym-cache-v2'; // Mude a versão para o navegador atualizar o cache
const urlsToCache = [
    '/',
    'index.html',
    'manifest.json',
    'https://placehold.co/192x192/8f44fd/ffffff?text=Gym', // Ícone do manifesto
    'https://placehold.co/512x512/8f44fd/ffffff?text=Gym', // Ícone do manifesto
    'https://cdn.tailwindcss.com', // Tailwind CSS
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', // Fontes
    'https://cdn.jsdelivr.net/npm/chart.js' // Biblioteca de gráficos
];

// Evento de Instalação: Salva os arquivos principais em cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento de Fetch: Intercepta as requisições
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se encontrar no cache, retorna do cache
                if (response) {
                    return response;
                }
                // Senão, busca na rede
                return fetch(event.request);
            })
    );
});

// Evento de Ativação: Limpa caches antigos
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
