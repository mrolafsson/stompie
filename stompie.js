/**
 * Stompie 0.0.5
 *
 * Angular module for managing connection and subscribing to STOMP queues.
 *
 * @author mrolafsson
 */
angular.module('stompie', [])
    .factory('$stompie', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        'use strict';

        var _stompie = {},
            _endpoint = null,
            _init_callbacks = [],
            _socket = {};

        /**
         * Creates a connection to the server.
         *
         * @private
         */
        var _init = function () {
            if (_endpoint !== null) {
                _socket.client = new SockJS(_endpoint);
                _socket.stomp = Stomp.over(_socket.client);
                _socket.stomp.connect({}, _ready, _reconnect);
            }
        };

        /**
         * Periodically attempts reconnect if the connection is closed.
         *
         * @private
         */
        var _reconnect = function () {
            $timeout(function () {
                _init();
            }, 3000);
        };

        /**
         * Invoke all initialisation callbacks provided once the server connects.
         *
         * @private
         */
        var _ready = function () {
            $rootScope.$apply(function () {
                for (var i = 0; i < _init_callbacks.length; i++) {
                    _init_callbacks[i]();
                }
            });
        };

        /**
         * Initiate a new connection to a STOMP server. You should be using the using() method (pun intended).
         *
         * @param endpoint
         * @param callback
         * @private
         */
        _stompie._connect = function (endpoint, callback) {
            _endpoint = endpoint;
            _init();
            _init_callbacks.push(callback);
        };

        /**
         * Use and create a connection if one is not already present.
         * TODO At present it will only allow connections to a single endpoint.
         *
         * @param endpoint
         * @param callback
         */
        _stompie.using = function (endpoint, callback) {
            if (_endpoint === null || endpoint != _endpoint) {
                _stompie._connect(endpoint, callback);
            } else {
                _init_callbacks.push(callback);
            }
        };

        /**
         * Disconnect the socket, obviously terminating all subscriptions.
         *
         * @param callback
         */
        _stompie.disconnect = function (callback) {
            _socket.stomp.disconnect(callback);
        };

        /**
         * Subscribe to a given channel with the callback provided.
         *
         * @param channel
         * @param callback
         * @returns subscription with which you can unsubscribe.
         */
        _stompie.subscribe = function (channel, callback) {
            return _socket.stomp.subscribe(channel, function (data) {
                var payload = null;
                try {
                    payload = JSON.parse(data.body);
                } finally {
                    $rootScope.$digest(callback(payload));
                }
            });
        };

        /**
         * If application prefixes are set on the STOMP server you need to specify that in the queue parameter.
         *
         * @param queue
         * @param obj
         * @param priority
         * @returns {_stompie}
         */
        _stompie.send = function (queue, obj, priority) {
            try {
                var json = JSON.stringify(obj);
                _socket.stomp.send(queue, {
                    priority: (priority !== undefined ? priority : 9)
                }, json);
            } catch (e) {
                throw e;
            }

            return this;
        };

        return _stompie;
    }]);
