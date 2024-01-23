var config = {};

config.welcome = {
  set lastupdate (val) {app.storage.write("lastupdate", val)},
  get lastupdate () {return app.storage.read("lastupdate") !== undefined ? app.storage.read("lastupdate") : 0}
};

config.badge = {
  set text (val) {app.storage.write("badge-text", val)},
  get text () {return app.storage.read("badge-text") !== undefined ? app.storage.read("badge-text") : true}
};

config.playback = {
  set rate (val) {app.storage.write("playback-rate", val)},
  get rate () {return app.storage.read("playback-rate") !== undefined ? app.storage.read("playback-rate") : 2}
};
