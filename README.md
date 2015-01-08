# Stompie

Angular module to manage communicating with STOMP queues over a WebSocket.

> For more information see:
> * https://github.com/sockjs/sockjs-client
> * http://jmesnil.net/stomp-websocket/doc/
> * https://github.com/jmesnil/stomp-websocket/

## Getting started

1. If you're using bower just install:

```bash
bower install -save stompie
```

1. OK I know it's obvious but add `<script>` tags to the module and the two required dependencies:

```html
<script src="/bower_components/sockjs/sockjs.min.js"></script>
<script src="/bower_components/stomp-websocket/lib/stomp.min.js"></script>
<script src="/bower_components/stompie/stompie-min.js"></script>
```

1. Declare the module as a dependency in your application:

```js
angular.module('yourApplication', ['stompie']);
```

1. Inject it in your controller:

```js
angular.module('yourApplication')
    .controller('YourCtrl', ['$stompie', '$scope', function ($stompie, $scope) {
        // ...
    }
```

1. Use and subscribe:

```js
$stompie.using('/your/stomp/endpoint', function () {

    // The $scope bindings are updated for you so no need to $scope.$apply.
    // The subscription object is returned by the method.
    var subscription = $stompie.subscribe('/your/topic', function (data) {
        $scope.foo = data;
    });

    // Unsubscribe using said subscription object.
    subscription.unsubscribe();

    // Send messages to a STOMP broker.
    $stompie.send('/some/queue', {message: 'some message'});

    // Disconnect from the socket.
    $stompie.disconnect(function () {
        // Called once you're out...
    });

});
```