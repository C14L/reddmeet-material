(function () { 'use strict';
    /**
     * Keep the app connected to the backend, provide a singleton to all
     * controllers that use Websocket messages.
     */

    angular.module('reddmeetApp').factory('WsFactory', ['$log', '$websocket', WsFactory]);

    function WsFactory($log, $websocket) {
        // Connect to websocket.
        let _ws = $websocket(WS_BASE, {'reconnectIfNotNormalClose': true});

        _ws.onMessage(message => {
            $log.debug('### $websocket ### Message received: ', message);
        });
        _ws.onOpen(() => {
            $log.debug('### $websocket ### Websocket opened!');
        });
        _ws.onClose(() => {
            $log.debug('### $websocket ### Websocket closed!');
        });
        _ws.onError(() => {
            $log.debug('### $websocket ### Websocket ERROR!');
        });

        return _ws;
    }
})();
