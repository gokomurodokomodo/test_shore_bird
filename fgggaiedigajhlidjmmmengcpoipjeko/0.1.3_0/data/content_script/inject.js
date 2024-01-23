if (!background) {
  var background = (function () {
    let tmp = {};
    /*  */
    chrome.runtime.onMessage.addListener(function (request) {
      for (let id in tmp) {
        if (tmp[id] && (typeof tmp[id] === "function")) {
          if (request.path === "background-to-page") {
            if (request.method === id) {
              tmp[id](request.data);
            }
          }
        }
      }
    });
    /*  */
    return {
      "receive": function (id, callback) {
        tmp[id] = callback;
      },
      "send": function (id, data) {
        chrome.runtime.sendMessage({
          "method": id, 
          "data": data,
          "path": "page-to-background"
        }, function () {
          return chrome.runtime.lastError;
        });
      }
    }
  })();
  /*  */
  var config = {
    "action": function (e) {
      const videos = [...document.querySelectorAll("video")];
      /*  */
      if (videos) {
        if (videos.length) {
          for (let i = 0; i < videos.length; i++) {
            const video = videos[i];
            const flag_1 = video.paused === false;
            const flag_2 = video.playbackRate !== e.playbackRate;
            /*  */
            if (flag_1 && flag_2) {
              video.playbackRate = e.playbackRate;
            }
            /*  */
            if (window === window.top) {
              background.send("playbackrate-success");
            }
          }
        }
      }
    }
  };  
  /*  */
  background.receive("storage", config.action);
}

if (window === window.top) {
  background.send("load");
}