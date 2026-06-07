function createRemoteScriptBookmarklet(mediaUrl) {
    const source = `
(function() {
  "use strict";

  var LOG_ID = "x-delete-debug-log";
  var LOG_PREFIX = "[x-delete]";
  var payloadStarted = false;

  function log(message, detail) {
    try {
      if (detail === undefined) console.log(LOG_PREFIX + " " + message);
      else console.log(LOG_PREFIX + " " + message, detail);
    } catch (e) {}

    var box = document.getElementById(LOG_ID);
    if (!box) {
      box = document.createElement("div");
      box.id = LOG_ID;
      box.style.cssText = [
        "z-index:2147483647",
        "width:min(92vw,720px)",
        "max-height:45vh",
        "overflow:auto",
        "position:fixed",
        "left:50%",
        "top:16px",
        "transform:translateX(-50%)",
        "box-sizing:border-box",
        "padding:12px",
        "border:1px solid #999",
        "border-radius:6px",
        "background:#fbf7f7",
        "color:#111",
        "font:13px/1.5 monospace",
        "white-space:pre-wrap",
        "box-shadow:0 8px 28px rgba(0,0,0,.25)"
      ].join(";");
      document.body.appendChild(box);
    }

    var line = document.createElement("div");
    line.textContent = new Date().toLocaleTimeString() + " " + message;
    box.appendChild(line);
    box.scrollTop = box.scrollHeight;
  }

  function fail(message, detail) {
    log("ERROR: " + message, detail);
    alert("ツールの起動に失敗しました。\\n" + message + "\\n画面上のログと開発者ツールのConsoleを確認してください。");
  }

  function extractNonce(policy) {
    if (!policy) return "";
    var match = String(policy).match(/nonce-([^'\\s;]+)/);
    return match ? match[1] : "";
  }

  function findNonce() {
    var script = document.querySelector("script[nonce]");
    return script ? script.nonce || script.getAttribute("nonce") || "" : "";
  }

  function decodePayload(blob) {
    return new Promise(function(resolve, reject) {
      var canvas = document.createElement("canvas");
      var image = new Image();
      var objectUrl = URL.createObjectURL(blob);

      image.onerror = function() {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("PNGを画像として読み込めませんでした"));
      };

      image.onload = function() {
        try {
          var context = canvas.getContext("2d", { willReadFrequently: true });
          var width = image.width;
          var height = image.height;
          var bytes = [];
          var previousWas255 = false;
          var payload = "";

          canvas.width = width;
          canvas.height = height;
          context.drawImage(image, 0, 0, width, height);

          outer:
          for (var i = 0; i < width * height; i++) {
            var pixel = context.getImageData(Math.floor(i / width), i % width, 1, 1);
            for (var channel = 0; channel < 3; channel++) {
              var value = pixel.data[channel];
              if (previousWas255 && value === 255) break outer;
              bytes.push(value);
              previousWas255 = value === 255;
            }
          }

          for (var j = 0; j < (bytes.length - 1) / 2; j++) {
            payload += String.fromCharCode(256 * bytes[2 * j] + bytes[2 * j + 1]);
          }

          URL.revokeObjectURL(objectUrl);
          resolve(payload);
        } catch (error) {
          URL.revokeObjectURL(objectUrl);
          reject(error);
        }
      };

      image.src = objectUrl;
    });
  }

  function runPayload(payload) {
    var script = document.createElement("script");
    script.textContent = payload + "\\n//# sourceURL=x-delete-payload.js";
    if (window.nonce) script.nonce = window.nonce;
    document.body.appendChild(script);

    if (typeof init !== "function") {
      fail("payloadは読み込まれましたが init() が見つかりません。CSPでscript実行がブロックされた可能性があります。");
      return;
    }

    log("payload実行: init()");
    init();
  }

  function start(policy) {
    if (payloadStarted) return;
    payloadStarted = true;

    window.nonce = extractNonce(policy) || findNonce() || window.nonce || "";
    log("起動開始 host=" + location.hostname);
    log(window.nonce ? "nonce取得成功" : "nonce未取得。nonceなしで試行します。");
    log("PNG取得開始");

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "${mediaUrl}");
    xhr.responseType = "blob";
    xhr.onerror = function() {
      fail("PNGの取得に失敗しました。ネットワークまたはCORSを確認してください。", { status: xhr.status });
    };
    xhr.onload = function() {
      if (xhr.status !== 200) {
        fail("PNGの取得に失敗しました。status=" + xhr.status);
        return;
      }

      log("PNG取得完了 " + xhr.response.size + " bytes");
      decodePayload(xhr.response).then(function(payload) {
        log("payload復元完了 " + payload.length + " chars");
        runPayload(payload);
      }).catch(function(error) {
        fail("payload復元に失敗しました: " + (error && error.message ? error.message : error), error);
      });
    };
    xhr.send();
  }

  function onCspViolation(event) {
    log("CSP violation: " + event.violatedDirective);
    if (!window.nonce) window.nonce = extractNonce(event.originalPolicy);
    start(event.originalPolicy);
  }

  if (location.hostname !== "x.com" && location.hostname !== "www.x.com") {
    alert("Twitter(X)を開いた状態で実行してください");
    return;
  }

  window.addEventListener("error", function(event) {
    log("window error: " + event.message);
  });
  window.addEventListener("unhandledrejection", function(event) {
    log("unhandled rejection: " + (event.reason && event.reason.message ? event.reason.message : event.reason));
  });
  document.addEventListener("securitypolicyviolation", onCspViolation, { once: true });

  try {
    eval("");
  } catch (error) {
    log("eval trigger failed: " + error.message);
  }

  setTimeout(function() {
    start();
  }, 300);
})();
void 0`;

    return "javascript:" + encodeURIComponent(source);
}

function createInlineScriptBookmarklet(payload) {
    const source = `
(function() {
  "use strict";

  var LOG_ID = "x-delete-debug-log";
  var LOG_PREFIX = "[x-delete]";
  var payload = ${JSON.stringify(payload)};

  function log(message, detail) {
    try {
      if (detail === undefined) console.log(LOG_PREFIX + " " + message);
      else console.log(LOG_PREFIX + " " + message, detail);
    } catch (e) {}

    var box = document.getElementById(LOG_ID);
    if (!box) {
      box = document.createElement("div");
      box.id = LOG_ID;
      box.style.cssText = [
        "z-index:2147483647",
        "width:min(92vw,720px)",
        "max-height:45vh",
        "overflow:auto",
        "position:fixed",
        "left:50%",
        "top:16px",
        "transform:translateX(-50%)",
        "box-sizing:border-box",
        "padding:12px",
        "border:1px solid #999",
        "border-radius:6px",
        "background:#fbf7f7",
        "color:#111",
        "font:13px/1.5 monospace",
        "white-space:pre-wrap",
        "box-shadow:0 8px 28px rgba(0,0,0,.25)"
      ].join(";");
      document.body.appendChild(box);
    }

    var line = document.createElement("div");
    line.textContent = new Date().toLocaleTimeString() + " " + message;
    box.appendChild(line);
    box.scrollTop = box.scrollHeight;
  }

  function fail(message, detail) {
    log("ERROR: " + message, detail);
    alert("ツールの起動に失敗しました。\\n" + message + "\\n画面上のログと開発者ツールのConsoleを確認してください。");
  }

  function extractNonce(policy) {
    if (!policy) return "";
    var match = String(policy).match(/nonce-([^'\\s;]+)/);
    return match ? match[1] : "";
  }

  function findNonce() {
    var script = document.querySelector("script[nonce]");
    return script ? script.nonce || script.getAttribute("nonce") || "" : "";
  }

  function runPayload() {
    var script = document.createElement("script");
    script.textContent = payload + "\\n//# sourceURL=x-delete-payload.js";
    if (window.nonce) script.nonce = window.nonce;
    document.body.appendChild(script);

    if (typeof init !== "function") {
      fail("payloadは挿入されましたが init() が見つかりません。CSPでscript実行がブロックされた可能性があります。");
      return;
    }

    log("payload実行: init()");
    init();
  }

  function start(policy) {
    window.nonce = extractNonce(policy) || findNonce() || window.nonce || "";
    log("起動開始 host=" + location.hostname);
    log(window.nonce ? "nonce取得成功" : "nonce未取得。nonceなしで試行します。");
    log("内蔵payload使用 " + payload.length + " chars");
    runPayload();
  }

  function onCspViolation(event) {
    log("CSP violation: " + event.violatedDirective);
    if (!window.nonce) window.nonce = extractNonce(event.originalPolicy);
    start(event.originalPolicy);
  }

  if (location.hostname !== "x.com" && location.hostname !== "www.x.com") {
    alert("Twitter(X)を開いた状態で実行してください");
    return;
  }

  window.addEventListener("error", function(event) {
    log("window error: " + event.message);
  });
  window.addEventListener("unhandledrejection", function(event) {
    log("unhandled rejection: " + (event.reason && event.reason.message ? event.reason.message : event.reason));
  });
  document.addEventListener("securitypolicyviolation", onCspViolation, { once: true });

  try {
    eval("");
  } catch (error) {
    log("eval trigger failed: " + error.message);
  }

  setTimeout(function() {
    start();
  }, 300);
})();
void 0`;

    return "javascript:" + encodeURIComponent(source);
}
