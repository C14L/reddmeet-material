if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/app/src/sw.js').then(reg => {
        reg.pushManager.getSubscription().then(sub => {
            console.log('Push notifications subscriptions', sub);

            // TODO subscribe for push here
        });
    });
} else {
    console.log('Push notifications subscriptions', 'Not suppported');
}
