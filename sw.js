const CACHE_NAME = 'mygym-cache-v9'; // VERSÃO ATUALIZADA
const urlsToCache = [
    '.', // Representa o diretório raiz (a própria página index.html)
    'index.html',
    'manifest.json',
    'logo-mygym.png',
    'favicon.png'
];

// ... o resto do ficheiro continua exatamente igual

// 2. Evento de Instalação (continua igual)
// Guarda os arquivos principais em cache quando o Service Worker é instalado
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cache aberto e ficheiros adicionados');
                return cache.addAll(urlsToCache);
            })
    );
});

// 3. Evento de Ativação (continua igual)
// Limpa caches antigos para economizar espaço
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Service Worker: A limpar cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 4. Evento de Fetch (ESTRATÉGIA ATUALIZADA)
// Intercepta as requisições
self.addEventListener('fetch', event => {
    // Apenas para requisições de navegação (ex: abrir a página)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            // Tenta primeiro buscar da rede
            fetch(event.request)
                .catch(() => {
                    // Se a rede falhar (offline), busca a página principal do cache
                    return caches.match('index.html');
                })
        );
        return;
    }

    // Para todos os outros recursos (CSS, JS, imagens)
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