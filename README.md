# Stompie

Angular module to manage communicating with STOMP queues over WebSocket.

## Getting started

1. If you're using bower just install:

```bash
bower install -save stompie
```

1. Add `<script>` tags to the module and the two required dependencies:

```html
<script src="/scripts/lib/sockjs/sockjs.min.js"></script>
<script src="/scripts/lib/stomp-websocket/lib/stomp.min.js"></script>
<script src="/scripts/lib/stompie/stompie-min.js"></script>
```

1. Declare the module as a dependency in your application:

```js
angular.module('yourApplication', ['stompie']);
```

1. Inject it in your controller:

```js
angular.module('yourApplication')
    .controller('YourCtrl', ['$stompie', '$scope', function ($stompie, $scope) {
        ...
    }
```

1. Use and subscribe:

```js
$stompie.using('/your/stomp/endpoint', function () {

    // The $scope is applied for you, the subscription object is returned
    var subscription = $stompie.subscribe('/your/topic', function (data) {
        $scope.foo = data;
    });

    // Unsubscribe using the subscription object
    subscription.unsubscribe();

    // Send messages to a STOMP broker
    $stompie.send('/some/queue', {message: 'some message'});

    // Disconnect from the socket
    $stompie.disconnect(function () {
        // Called when you're out
    });
});
```