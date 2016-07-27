// Manual service worker setup

self.addEventListener('fetch', event => {
    //const defaultArgs = { headers: { 'Content-Type': 'text/html;charset=UTF-8' } };
    //const defaultResponse = new Response('<p>Reddmeet app</p>', args);

    event.respondWith(
        fetch(event.request).then(response => {
            if (response.status == 404) {
                return fetch('/static/nopic.jpg');
            }

            return response;
        })
        .catch(err => new Response("No network :("))
    );
});
