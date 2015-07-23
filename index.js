if(typeof module !== 'undefined' && module.exports){
  console.log('require');
  XMLHttpRequest = require('xhr2');
  EventEmitter = require('eventemitter2').EventEmitter2;
}else{
  console.log('window');
}

// util.inherits
function inherits(ctor, superCtor){
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}

var ChunkedAjax = {
  _createStream: function(url, opts){
    opts = opts || {}; // stub
    var xhr = new XMLHttpRequest();
    return new ChunkedAjaxStream(xhr, url, opts);
  },
  get: function(url, opts){
    opts = opts || {}; // stub
    opts.method = "GET";
    return this._createStream(url, opts);
  },
  post: function(url, opts){
    opts = opts || {}; // stub
    opts.method = "POST";
    return this._createStream(url, opts);
  }
};

function ChunkedAjaxStream(xhr, url, opts){
  EventEmitter.call(this);
  this.xhr = xhr;
  var cursor = 0;
  var self = this;

  this.xhr.addEventListener("progress", function(){
    var newResponse = this.responseText.slice(cursor);
    if(cursor < this.responseText.length){
      self.emit('data', newResponse);
      cursor = this.responseText.length;
    }
  });

  this.xhr.addEventListener("loadend", function(){
    self.emit("loadend");
    self.emit("end");
  });

  this.xhr.addEventListener("load", function(){
    self.emit("load");
  });

  this.xhr.addEventListener("error", function(e){
    self.emit("error", e);
  });

  this.xhr.addEventListener("abort", function(){
    self.emit("abort");
  });

  this.xhr.open(opts.method, url, true);

  this.xhr.responseType = opts.responseType || "";

  if(opts.headers){
    for(var key in opts.headers){
      xhr.setRequestHeader(key, opts.headers[key]);
    }
  }
}
inherits(ChunkedAjaxStream, EventEmitter);

ChunkedAjaxStream.prototype.send = function(){
  this.xhr.send();
}

if(typeof module !== 'undefined' && module.exports){
  module.exports = ChunkedAjax;
}
