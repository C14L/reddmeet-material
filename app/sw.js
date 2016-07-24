// Manual service worker setup

self.addEventListener('fetch', event => {
    const args = { headers: { 'Content-Type': 'text/html;charset=UTF-8' } };
    const response = new Response('<p>Reddmeet app</p>', args);

    event.respondWith(
        fetch(event.request).then(response => {
            if (response.status == 404)
                return new Response("NOT FOUND :(", args)

            return response;
        })
        .catch(err => new Response("No network :("), args)
    );
});
