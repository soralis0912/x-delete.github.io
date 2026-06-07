function createInlineScriptBookmarklet(payload) {
    const source = `
(function() {
  "use strict";

  var LOG_ID = "x-delete-debug-log";
  var LOG_PREFIX = "[x-delete]";
  var payload = ${JSON.stringify(payload)};
  var started = false;

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
    if (started) {
      log("起動済みのため再実行をスキップ");
      return;
    }
    started = true;
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

function createManagedBookmarklet(key) {
    const entry = window.bookmarkletSources && window.bookmarkletSources[key];
    if (!entry) return "";
    if (entry.wrapper === "inline") return createInlineScriptBookmarklet(entry.source);
    return "javascript:" + encodeURIComponent(entry.source);
}
