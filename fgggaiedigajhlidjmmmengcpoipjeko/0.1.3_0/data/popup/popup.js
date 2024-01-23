var background = {
  "port": null,
  "message": {},
  "receive": function (id, callback) {
    if (id) {
      background.message[id] = callback;
    }
  },
  "send": function (id, data) {
    if (id) {
      chrome.runtime.sendMessage({
        "method": id,
        "data": data,
        "path": "popup-to-background"
      }, function () {
        return chrome.runtime.lastError;
      });
    }
  },
  "connect": function (port) {
    chrome.runtime.onMessage.addListener(background.listener); 
    /*  */
    if (port) {
      background.port = port;
      background.port.onMessage.addListener(background.listener);
      background.port.onDisconnect.addListener(function () {
        background.port = null;
      });
    }
  },
  "post": function (id, data) {
    if (id) {
      if (background.port) {
        background.port.postMessage({
          "method": id,
          "data": data,
          "path": "popup-to-background",
          "port": background.port.name
        });
      }
    }
  },
  "listener": function (e) {
    if (e) {
      for (let id in background.message) {
        if (background.message[id]) {
          if ((typeof background.message[id]) === "function") {
            if (e.path === "background-to-popup") {
              if (e.method === id) {
                background.message[id](e.data);
              }
            }
          }
        }
      }
    }
  }
};

var config = {
  "slider": {
    "min": 0.07,
    "max": 16.0,
    "step": 0.1
  },
  "render": function (e) {
    config.value.value = Number(e.playbackRate);
    config.range.value = config.value.value;
    config.badge.checked = e.badge;
  },
  "adjust": function (e) {
    e = Number(e);
    let tmp = e > config.slider.max ? config.slider.max : (e < config.slider.min ? config.slider.min : e);
    /*  */
    return tmp.toFixed(2);
  },
  "load": function () {
    config.plus = document.getElementById("plus");
    config.badge = document.getElementById("badge");
    config.reset = document.getElementById("reset");
    config.minus = document.getElementById("minus");
    config.reload = document.getElementById("reload");
    config.support = document.getElementById("support");
    config.range = document.getElementById("rate-range");
    config.value = document.getElementById("rate-value");
    config.donation = document.getElementById("donation");
    config.activate = document.getElementById("activate");
    /*  */
    config.badge.addEventListener("change", function (e) {
      background.send("store", {
        "badge": e.target.checked,
        "playbackRate": Number(config.value.value)
      });
    });
    /*  */
    config.range.addEventListener("input", function (e) {
      config.value.value = config.adjust(e.target.value);
      background.send("store", {
        "badge": config.badge.checked,
        "playbackRate": Number(config.value.value)
      });
    });
    /*  */
    config.value.addEventListener("change", function (e) {
      config.value.value = config.adjust(e.target.value);
      config.range.value = config.value.value;
      background.send("store", {
        "badge": config.badge.checked,
        "playbackRate": Number(config.value.value)
      });
    });
    /*  */
    config.reset.addEventListener("click", function () {
      config.value.value = 1;
      config.badge.checked = true;
      config.range.value = config.value.value;
      /*  */
      background.send("store", {
        "badge": config.badge.checked,
        "playbackRate": Number(config.value.value)
      });
    });
    /*  */
    config.plus.addEventListener("click", function () {
      let tmp = Number(config.value.value) + config.slider.step;
      /*  */
      config.value.value = config.adjust(tmp);
      config.range.value = config.value.value;
      background.send("store", {
        "badge": config.badge.checked,
        "playbackRate": Number(config.value.value)
      });
    });
    /*  */
    config.minus.addEventListener("click", function () {
      let tmp = Number(config.value.value) - config.slider.step;
      /*  */
      config.value.value = config.adjust(tmp);
      config.range.value = config.value.value;
      background.send("store", {
        "badge": config.badge.checked,
        "playbackRate": Number(config.value.value)
      });
    });
    /*  */
    config.reload.addEventListener("click", function () {background.send("reload")});
    config.support.addEventListener("click", function () {background.send("support")});
    config.donation.addEventListener("click", function () {background.send("donation")});
    config.activate.addEventListener("click", function () {background.send("activate")});
    /*  */
    background.send("load");
    window.removeEventListener("load", config.load, false);
  }
};

background.receive("storage", config.render);
window.addEventListener("load", config.load, false);
background.connect(chrome.runtime.connect({"name": "popup"}));
