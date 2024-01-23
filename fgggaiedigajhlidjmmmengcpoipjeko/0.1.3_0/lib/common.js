var core = {
  "start": function () {
    core.load();
  },
  "install": function () {
    core.load();
  },
  "load": function () {
    core.action.button("OFF");
  },
  "update": {
    "popup": function () {
      app.popup.send("storage", {
        "badge": config.badge.text,
        "playbackRate": Number(config.playback.rate)
      });
    },
    "page": function () {
      app.tab.query.active(function (tab) {
        if (tab) {
          app.page.send("storage", {
            "playbackRate": Number(config.playback.rate)
          }, tab.id, null);
        }
      });
    }
  },
  "action": {
    "storage": function (changes, namespace) {
      /*  */
    },
    "store": function (e) {
      config.playback.rate = e.playbackRate;
      config.badge.text = e.badge;
      core.update.page();
    },
    "deactivate": function (info) {
      if (info) {
        if (info.status === "loading") {
          core.action.button("OFF");
        }
      }
    },
    "activate": function () {
      app.tab.query.active(function (tab) {
        if (tab) {
          app.tab.inject.js({
            "files": ["/data/content_script/inject.js"],
            "target": {
              "tabId": tab.id, 
              "allFrames": true
            }
          });
        }
      });
    },
    "button": function (state) {
      app.tab.query.active(function (tab) {
        app.button.icon(tab ? tab.id : null, state);
        /*  */
        if (state === "ON") {
          if (config.badge.text) {
            const text = Number(config.playback.rate).toFixed(1) + '×';
            app.button.badge.text(tab ? tab.id : null, text);
          } else {
            app.button.badge.text(tab ? tab.id : null, '');
          }
        } else {
          app.button.badge.text(tab ? tab.id : null, '');
        }
      });
    }
  }
};

app.tab.on.updated(core.action.deactivate);
app.page.receive("load", core.update.page);
app.popup.receive("load", core.update.popup);
app.popup.receive("store", core.action.store);
app.popup.receive("activate", core.action.activate);
app.popup.receive("reload", function () {app.tab.reload()});
app.popup.receive("support", function () {app.tab.open(app.homepage())});
app.page.receive("playbackrate-success", function () {core.action.button("ON")});
app.popup.receive("donation", function () {app.tab.open(app.homepage() + "?reason=support")});

app.on.startup(core.start);
app.on.installed(core.install);
app.on.storage(core.action.storage);
