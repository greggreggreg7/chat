(function(scope) {
  function WSClient (url, pubsub) {
    this.url = url;
    this.pubsub = pubsub;
  }

  WSClient.prototype.login = function (username) {
    this.username = username;
    this.connect();
  };

  WSClient.prototype.connect = function () {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = function (msg) { this.onOpen(msg); }.bind(this);
    this.socket.onmessage = function (msg) { this.onMessage(msg); }.bind(this);
    this.socket.onclose = function (msg) { this.onClose(msg); }.bind(this);
  },

  WSClient.prototype.disconnect = function () {
    this.socket.close();
  },

  WSClient.prototype.send = function (msg, type) {
    type = type || 'user';
    message = JSON.stringify({
      type: type,
      content: msg
    });
    this.socket.send(message);
  },

  WSClient.prototype.onOpen = function (e) {
    this.send(this.username, 'login');
  },

  WSClient.prototype.onMessage = function (e) {
    this.pubsub.emit('message', JSON.parse(e.data));
  },

  WSClient.prototype.onClose = function(e) {
    this.pubsub.emit('message', {type: 'server', content: 'Disconnected from server.'});
  }

  scope.WSClient = WSClient;
})(this);
