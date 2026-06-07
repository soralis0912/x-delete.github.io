'use strict';
function parseInitialStateText(text) {
    const marker = text.indexOf("INITIAL_STATE");
    const start = text.indexOf("{", marker);
    if (marker < 0 || start < 0) return null;
    let depth = 0;
    let inString = false;
    let quote = "";
    let escaped = false;
    for (let index = start; index < text.length; index++) {
        const char = text[index];
        if (inString) {
            if (escaped) escaped = false;
            else if (char === "\\") escaped = true;
            else if (char === quote) inString = false;
            continue;
        }
        if (char === '"' || char === "'") {
            inString = true;
            quote = char;
            continue;
        }
        if (char === "{") depth++;
        if (char === "}") {
            depth--;
            if (depth === 0) return JSON.parse(text.slice(start, index + 1));
        }
    }
    return null;
}
function readInitialState() {
    const scripts = document.getElementsByTagName("script");
    for (let index = 0; index < scripts.length; index++) {
        const text = scripts[index].textContent || "";
        if (!text.includes("INITIAL_STATE")) continue;
        const state = parseInitialStateText(text);
        if (state) return state;
    }
    throw new Error("INITIAL_STATE が見つからない、または解析できません");
}
var init=()=>{
    function g(a){
        document.querySelector("#"+a).showModal()
    }
    function f(a){
        let b=document.querySelector("#"+a);
        b.classList.add("hide");
        b.addEventListener("animationend", function m(){
            document.body.classList.remove("inactive");
            this.classList.remove("hide");
            this.close();
            this.removeEventListener("animationend", m);
            "dialogFade"==a&&document.getElementById("dialogs").remove()
        })
    }
    function e(a){
        let b=Array.from(document.querySelectorAll("#dialogFade .body p")).findIndex(c=>c===a);
        d.splice(b, 1);
        a.remove()
    }
    document.cookie.split("; ").forEach(a=>{
        a=a.split("=");
        "ct0"==a[0]&&(window.ct0=a[1])
    });
    var h=readInitialState(), c=h.entities.users.entities[Object.keys(h.entities.users.entities)[0]];
    window.username=c.screen_name;
    window.data1={
        variables:{
            userId:c.id_str, count:20, includePromotedContent:!1
        }, features:{
        }
    };
    window.FS=h.featureSwitch.defaultConfig;
    h=document.createElement("style");
    h.innerHTML='\n  .dialog {\n    width: 26em;\n    max-width: 95%;\n    max-height: 54%;\n    border: none;\n    border-radius: 4px;\n    box-shadow: 0 0 24px 4px rgba(0, 0, 0, 0.4);\n    padding: 0;\n    font-family: "Segoe UI",Meiryo,system-ui,-apple-system,BlinkMacSystemFont,sans-serif;\n    font-weight: bold;\n    color: black !important;\n  }\n  .dialog p {\n    margin: 0;\n  }\n  .dialog::backdrop {\n    background-color: rgba(0, 0, 0, 0.4);\n  }\n  .dialog .header {\n    background-color: #1089d9;\n    color: #fff !important;\n    font-weight: bold;\n    padding: 1em;\n    position: sticky;\n    top: 0;\n    text-align: center;\n  }\n  .dialog .body {\n    background-color: #fff;\n    margin: 0;\n    padding: 1em;\n    text-align: center;\n  }\n  .dialog p {\n    display: flex;\n    justify-content: space-evenly;\n    align-items: center;\n  }\n  .dialog .body p {\n    margin: 1em;\n  }\n  .dialog .footer {\n    background-color: #fff;\n    text-align: center;\n    margin: 0;\n    padding: 1em;\n    position: sticky;\n    bottom: 0;\n  }\n  .dialog .button {\n    width: 8em;\n    height: 2.4em;\n    border: none;\n    border-radius: 4px;\n    font-size: smaller;\n    font-weight: bold;\n    color: black !important;\n  }\n  #dialogFade .body button {\n    border: none;\n    background-color: #fff;\n  }\n  .dialog .button:hover {\n    opacity: 0.8;\n  }\n  .dialog .button.cancel {\n    background-color: #e6eae6;\n  }\n  .dialog .button.add {\n    background-color: #a0def0;\n    margin-bottom: 1em;\n  }\n  .dialog .button.ok {\n    background-color: #0075c2;\n    color: #fff !important;\n  }\n  .dialog select, input {\n    margin: 0.5em;\n    padding: 0.5em;\n    font-size: smaller;\n    font-weight: bold;\n    color: black !important;\n  }\n\n  .dialog[open],\n  .dialog[open]::backdrop {\n    animation: fadeIn 200ms ease normal;\n  }\n  @keyframes fadeIn {\n    from {\n      opacity: 0;\n    }\n    to {\n      opacity: 1;\n    }\n  }\n  .dialog.hide,\n  .dialog.hide::backdrop {\n    animation: fadeOut 200ms ease normal;\n  }\n  @keyframes fadeOut {\n    to {\n      opacity: 0;\n    }\n  }\n  .number {\n    width: 3em;\n  }\n  .checkbox {\n    margin-bottom: 1em !important;\n    font-size: xx-small;\n    font-weight: normal;\n    justify-content: center !important;\n  }\n  ';
    document.head.insertAdjacentElement("beforeend", h);
    h=document.createElement("div");
    h.id="dialogs";
    h.innerHTML='\n  <dialog id="dialogFade" class="dialog">\n    <div class="inner">\n      <div class="header">\n        <p>FF\u4e00\u62ec\u524a\u9664\u30c4\u30fc\u30eb</p>\n      </div>\n      <div class="body">\n      </div>\n      <div class="footer">\n        <p><button class="button add">\u6761\u4ef6\u8ffd\u52a0</button></p>\n        <p><button class="button ok">\uff8c\uff6b\uff9b\uff9c\uff70\uff8c\uff9e\uff9b\uff6f\uff78</button>\n        <button class="button ok">\uff8c\uff6b\uff9b\uff9c\uff70\uff8c\uff9e\uff9b\u89e3</button></p><br>\n        <p><button class="button cancel">\u30ad\u30e3\u30f3\u30bb\u30eb</button>\n        <button class="button ok">\uff8c\uff6b\uff9b\uff70\u89e3\u9664(\uff98\uff91)</button></p>\n      </div>\n    </div>\n  </dialog>\n\n  <dialog id="loglog" class="dialog">\n    <div class="inner">\n      <div class="header">\n        <p>FF\u4e00\u62ec\u524a\u9664\u30c4\u30fc\u30eb</p>\n      </div>\n      <div class="body">\n        <p><span id="log">\uff1c\u691c\u7d22\u4e2d\uff1e</span>\n        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="loading" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve">\n        <rect fill="none" width="32" height="32"/>\n        <path fill="#040100" d="M16,3.2L16,3.2c0.619,0,1.12,0.716,1.12,1.6V8c0,0.884-0.501,1.6-1.12,1.6l0,0c-0.619,0-1.12-0.716-1.12-1.6  V4.8C14.88,3.917,15.381,3.2,16,3.2z">\n        <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0s" dur="1s" to="0" from="1" attributeName="opacity">\n            </animate>\n        </path>\n        <path fill="#040100" d="M22.4,4.915L22.4,4.915c0.535,0.309,0.611,1.18,0.17,1.945L20.97,9.632c-0.441,0.765-1.233,1.135-1.77,0.826  l0,0c-0.536-0.309-0.612-1.18-0.17-1.946l1.6-2.771C21.072,4.975,21.864,4.605,22.4,4.915z">\n        <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.08333333333333333s" dur="1s" to="0" from="1" attributeName="opacity">\n            </animate>\n        </path>\n        <path fill="#040100" d="M27.085,9.6L27.085,9.6c0.31,0.536-0.06,1.328-0.825,1.77l-2.771,1.6c-0.766,0.442-1.637,0.366-1.945-0.17  l0,0c-0.31-0.536,0.061-1.328,0.825-1.77l2.771-1.6C25.904,8.988,26.775,9.064,27.085,9.6z">\n        <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.16666666666666666s" dur="1s" to="0" from="1" attributeName="opacity">\n            </animate>\n        </path>\n        <path fill="#040100" d="M28.8,16L28.8,16c0,0.619-0.716,1.12-1.6,1.12H24c-0.884,0-1.6-0.501-1.6-1.12l0,0  c0-0.619,0.716-1.12,1.6-1.12h3.2C28.084,14.88,28.8,15.381,28.8,16z">\n        <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.25s" dur="1s" to="0" from="1" attributeName="opacity">\n            </animate>\n        </path>\n        <path fill="#040100" d="M27.085,22.4L27.085,22.4c-0.31,0.535-1.181,0.611-1.945,0.17l-2.771-1.601  c-0.765-0.441-1.135-1.233-0.825-1.77l0,0c0.309-0.536,1.18-0.612,1.945-0.17l2.771,1.6C27.025,21.072,27.395,21.864,27.085,22.4z">\n        <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.3333333333333333s" dur="1s" to="0" from="1" attributeName="opacity">\n            </animate>\n        </path>\n        <path fill="#040100" d="M22.4,27.085L22.4,27.085c-0.536,0.31-1.328-0.06-1.771-0.825l-1.6-2.771  c-0.442-0.766-0.366-1.637,0.17-1.945l0,0c0.536-0.31,1.328,0.061,1.77,0.825l1.601,2.771C23.012,25.904,22.936,26.775,22.4,27.085z  ">\n        <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.4166666666666667s" dur="1s" to="0" from="1" attributeName="opacity">\n            </animate>\n        </path>\n        <path fill="#040100" d="M16,28.8L16,28.8c-0.619,0-1.12-0.716-1.12-1.6V24c0-0.884,0.501-1.6,1.12-1.6l0,0  c0.619,0,1.12,0.716,1.12,1.6v3.2C17.12,28.084,16.619,28.8,16,28.8z">\n        <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.5s" dur="1s" to="0" from="1" attributeName="opacity">\n            </animate>\n        </path>\n        <path fill="#040100" d="M9.6,27.085L9.6,27.085c-0.536-0.31-0.612-1.181-0.17-1.945l1.6-2.771c0.441-0.765,1.234-1.135,1.77-0.825  l0,0c0.536,0.309,0.612,1.18,0.17,1.945l-1.6,2.771C10.928,27.025,10.136,27.395,9.6,27.085z">\n        <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.5833333333333334s" dur="1s" to="0" from="1" attributeName="opacity">\n            </animate>\n        </path>\n        <path fill="#040100" d="M4.915,22.4L4.915,22.4c-0.31-0.536,0.06-1.328,0.826-1.771l2.771-1.6c0.765-0.442,1.636-0.366,1.946,0.17  l0,0c0.309,0.536-0.061,1.328-0.826,1.77L6.86,22.57C6.095,23.012,5.224,22.936,4.915,22.4z">\n        <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.6666666666666666s" dur="1s" to="0" from="1" attributeName="opacity">\n            </animate>\n        </path>\n        <path fill="#040100" d="M3.2,16L3.2,16c0-0.619,0.716-1.12,1.6-1.12H8c0.884,0,1.6,0.501,1.6,1.12l0,0c0,0.619-0.716,1.12-1.6,1.12  H4.8C3.917,17.12,3.2,16.619,3.2,16z">\n        <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.75s" dur="1s" to="0" from="1" attributeName="opacity">\n            </animate>\n        </path>\n        <path fill="#040100" d="M4.915,9.6L4.915,9.6c0.309-0.536,1.18-0.612,1.945-0.17l2.771,1.6c0.765,0.441,1.135,1.234,0.826,1.77l0,0  c-0.31,0.536-1.181,0.612-1.946,0.17l-2.771-1.6C4.975,10.928,4.605,10.136,4.915,9.6z">\n        <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.8333333333333334s" dur="1s" to="0" from="1" attributeName="opacity">\n            </animate>\n        </path>\n        <path fill="#040100" d="M9.6,4.915L9.6,4.915c0.536-0.31,1.328,0.06,1.77,0.826l1.6,2.771c0.442,0.766,0.366,1.637-0.17,1.946l0,0  c-0.536,0.309-1.328-0.061-1.77-0.826L9.43,6.86C8.988,6.095,9.064,5.224,9.6,4.915z">\n        <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.9166666666666666s" dur="1s" to="0" from="1" attributeName="opacity">\n            </animate>\n        </path>\n        </svg>\n        </p>\n      </div>\n      <div class="footer"><p class="checkbox">\u30da\u30fc\u30b8\u306e\u30ea\u30ed\u30fc\u30c9\u3067\u505c\u6b62\u3057\u307e\u3059</p></div>\n    </div>\n  </dialog>\n\n  <dialog id="dialogFade2" class="dialog">\n    <div class="inner">\n      <div class="body">\n        <p><button class="button ok">\u540d\u524d</button>\n        <button class="button ok">bio</button></p>\n        <p><button class="button ok">\u30d5\u30a9\u30ed\u30ef\u30fc</button>\n        <button class="button ok">\u30d5\u30a9\u30ed\u30fc</button></p>\n        <p><button class="button ok">\u30d5\u30a9\u30ed\u30fc\u6570</button>\n        <button class="button ok">\u30d5\u30a9\u30ed\u30ef\u30fc\u6570</button></p>\n        <p><button class="button ok">\u30c4\u30a4\u30fc\u30c8\u6570</button>\n        <button class="button ok">\u3044\u3044\u306d\u6570</button></p>\n        <p><button class="button ok">\u6700\u65b0\u6295\u7a3f</button></p>\n        <p><button class="button cancel">\u30ad\u30e3\u30f3\u30bb\u30eb</button></p>\n      </div>\n    </div>\n  </dialog>\n\n  <dialog id="name" class="dialog">\n    <div class="inner">\n      <div class="body">\n        <p>\u540d\u524d\u306b<input type="text" size="10">\u3092<select><option value="true">\u542b\u3080</option><option value="false">\u542b\u307e\u306a\u3044</option></select>\u57a2</p>\n        <p><button class="button cancel">\u30ad\u30e3\u30f3\u30bb\u30eb</button>\n        <button class="button ok">\u8ffd\u52a0</button></p>\n      </div>\n    </div>\n  </dialog>\n\n  <dialog id="bio" class="dialog">\n    <div class="inner">\n      <div class="body">\n        <p>bio\u306b<input type="text" size="10">\u3092<select><option value="true">\u542b\u3080</option><option value="false">\u542b\u307e\u306a\u3044</option></select>\u57a2</p>\n        <p><button class="button cancel">\u30ad\u30e3\u30f3\u30bb\u30eb</button>\n        <button class="button ok">\u8ffd\u52a0</button></p>\n      </div>\n    </div>\n  </dialog>\n  \n  <dialog id="isfollowed" class="dialog">\n    <div class="inner">\n      <div class="body">\n        <p>\u81ea\u5206\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u3066<select><option value="true">\u3044\u308b</option><option value="false">\u3044\u306a\u3044</option></select>\u57a2</p>\n        <p><button class="button cancel">\u30ad\u30e3\u30f3\u30bb\u30eb</button>\n        <button class="button ok">\u8ffd\u52a0</button></p>\n      </div>\n    </div>\n  </dialog>\n  </div>\n\n  <dialog id="isfollow" class="dialog">\n    <div class="inner">\n      <div class="body">\n        <p>\u81ea\u5206\u304c\u30d5\u30a9\u30ed\u30fc\u3057\u3066<select><option value="true">\u3044\u308b</option><option value="false">\u3044\u306a\u3044</option></select>\u57a2</p>\n        <p><button class="button cancel">\u30ad\u30e3\u30f3\u30bb\u30eb</button>\n        <button class="button ok">\u8ffd\u52a0</button></p>\n      </div>\n    </div>\n  </dialog>\n  </div>\n\n  <dialog id="follow" class="dialog">\n    <div class="inner">\n      <div class="body">\n        <p>\uff8c\uff6b\uff9b\uff70\u3057\u3066\u3044\u308b\u6570\u304c<input type="number" class="number"><select><option value="true">\u4ee5\u4e0a</option><option value="false">\u4ee5\u4e0b</option></select>\u306e\u57a2</p>\n        <p><button class="button cancel">\u30ad\u30e3\u30f3\u30bb\u30eb</button>\n        <button class="button ok">\u8ffd\u52a0</button></p>\n      </div>\n    </div>\n  </dialog>\n  </div>\n\n  <dialog id="follower" class="dialog">\n    <div class="inner">\n      <div class="body">\n        <p>\u30d5\u30a9\u30ed\u30ef\u30fc\u6570\u304c<input type="number" class="number"><select><option value="true">\u4ee5\u4e0a</option><option value="false">\u4ee5\u4e0b</option></select>\u306e\u57a2</p>\n        <p><button class="button cancel">\u30ad\u30e3\u30f3\u30bb\u30eb</button>\n        <button class="button ok">\u8ffd\u52a0</button></p>\n      </div>\n    </div>\n  </dialog>\n\n  <dialog id="tweets" class="dialog">\n    <div class="inner">\n      <div class="body">\n        <p>\u30c4\u30a4\u30fc\u30c8\u6570\u304c<input type="number" class="number"><select><option value="true">\u4ee5\u4e0a</option><option value="false">\u4ee5\u4e0b</option></select>\u306e\u57a2</p>\n        <p><button class="button cancel">\u30ad\u30e3\u30f3\u30bb\u30eb</button>\n        <button class="button ok">\u8ffd\u52a0</button></p>\n      </div>\n    </div>\n  </dialog>\n\n  <dialog id="like" class="dialog">\n    <div class="inner">\n      <div class="body">\n        <p>\u3044\u3044\u306d\u6570\u304c<input type="number" class="number"><select><option value="true">\u4ee5\u4e0a</option><option value="false">\u4ee5\u4e0b</option></select>\u306e\u57a2</p>\n        <p><button class="button cancel">\u30ad\u30e3\u30f3\u30bb\u30eb</button>\n        <button class="button ok">\u8ffd\u52a0</button></p>\n      </div>\n    </div>\n  </dialog>\n\n  <dialog id="active" class="dialog">\n    <div class="inner">\n      <div class="body">\n        <p>\u6700\u65b0\u6295\u7a3f\u304c<input type="number" class="number"><select><option value="true">\u65e5\u4ee5\u4e0a\u524d</option><option value="false">\u65e5\u4ee5\u5185</option></select>\u306e\u57a2</p>\n        <p><button class="button cancel">\u30ad\u30e3\u30f3\u30bb\u30eb</button>\n        <button class="button ok">\u8ffd\u52a0</button></p>\n      </div>\n    </div>\n  </dialog>\n  ';
    document.body.appendChild(h);
    let d=[];
    document.getElementById("log");
    let k=document.querySelector("#dialogFade .body");
    document.querySelector("#showButtonFade");
    window.judge=async function(a){
        for(let b=0;
        b<d.length;
        b++){
            let c=a.content.itemContent.user_results.result.legacy;
            c.rest_id=a.content.itemContent.user_results.result.rest_id;
            if(!await d[b](c))return!1
        }
        return!0
    };
    document.querySelectorAll("#dialogFade .button.ok")[0].addEventListener("click", ()=>{
        window.confirm((0==d.length?"\u5168\u3066\u306e":"\u3053\u308c\u3089\u306e\u6761\u4ef6\u3092\u5168\u3066\u6e80\u305f\u3059")+"\n@"+username+" \u306e\u30d5\u30a9\u30ed\u30ef\u30fc\u3092\u30d6\u30ed\u30c3\u30af\u3057\u307e\u3059\n\u958b\u767a\u8005\u306f\u4e00\u5207\u306e\u8cac\u4efb\u3092\u8ca0\u3044\u304b\u306d\u307e\u3059\n\u958b\u59cb\u3057\u3066\u3088\u308d\u3057\u3044\u3067\u3059\u304b\uff1f")&&(document.getElementById("dialogFade").remove(), g("loglog"), alert("\u78ba\u8a8d\u306e\u305f\u3081\u3001\u30d6\u30ed\u30c3\u30af\u3059\u308b\u57a2\u6700\u521d\u306e3\u4ef6\u304c\u8868\u793a\u3055\u308c\u307e\u3059"), query(0, data1))
    });
    document.querySelectorAll("#dialogFade .button.ok")[1].addEventListener("click", ()=>{
        window.confirm((0==d.length?"\u5168\u3066\u306e":"\u3053\u308c\u3089\u306e\u6761\u4ef6\u3092\u5168\u3066\u6e80\u305f\u3059")+"\n@"+username+" \u306e\u30d5\u30a9\u30ed\u30ef\u30fc\u3092\u30d6\u30ed\u30c3\u30af\u3057\u305f\u306e\u3061\u89e3\u9664\u3057\u307e\u3059\n\u958b\u767a\u8005\u306f\u4e00\u5207\u306e\u8cac\u4efb\u3092\u8ca0\u3044\u304b\u306d\u307e\u3059\n\u958b\u59cb\u3057\u3066\u3088\u308d\u3057\u3044\u3067\u3059\u304b\uff1f")&&(document.getElementById("dialogFade").remove(), g("loglog"), alert("\u78ba\u8a8d\u306e\u305f\u3081\u3001\u30d6\u30ed\u89e3\u3059\u308b\u57a2\u6700\u521d\u306e3\u4ef6\u304c\u8868\u793a\u3055\u308c\u307e\u3059"), query(1, data1))
    });
    document.querySelectorAll("#dialogFade .button.ok")[2].addEventListener("click", ()=>{
        window.confirm((0==d.length?"\u5168\u3066\u306e":"\u3053\u308c\u3089\u306e\u6761\u4ef6\u3092\u5168\u3066\u6e80\u305f\u3059")+"\n@"+username+" \u306e\u30d5\u30a9\u30ed\u30fc\u3092\u89e3\u9664\u3057\u307e\u3059\n\u958b\u767a\u8005\u306f\u4e00\u5207\u306e\u8cac\u4efb\u3092\u8ca0\u3044\u304b\u306d\u307e\u3059\n\u958b\u59cb\u3057\u3066\u3088\u308d\u3057\u3044\u3067\u3059\u304b\uff1f")&&(document.getElementById("dialogFade").remove(), g("loglog"), alert("\u78ba\u8a8d\u306e\u305f\u3081\u3001\u30d5\u30a9\u30ed\u30fc\u89e3\u9664\u3059\u308b\u57a2\u6700\u521d\u306e3\u4ef6\u304c\u8868\u793a\u3055\u308c\u307e\u3059"), query(2, data1))
    });
    document.querySelector("#dialogFade .button.add").addEventListener("click", ()=>{
        g("dialogFade2")
    });
    h=document.querySelectorAll("#dialogFade2 .button.ok");
    let l="name bio isfollowed isfollow follow follower tweets like active".split(" ");
    for(let a=0;
    a<h.length;
    a++)h[a].addEventListener("click", ()=>{
        g(l[a])
    });
    let n="dialogFade dialogFade2 name bio isfollowed isfollow follow follower tweets like active".split(" ");
    for(let a=0;
    a<n.length;
    a++)document.querySelector("#"+n[a]+" .button.cancel").addEventListener("click", ()=>{
        f(n[a])
    });
    document.querySelector("#name .button.ok").addEventListener("click", ()=>{
        let a=document.querySelector("#name input").value;
        if(""===a)alert("\u6587\u5b57\u5217\u304c\u7a7a\u767d\u3067\u3059");
        else{
            f("name");
            f("dialogFade2");
            var b="true"==document.querySelector("#name select").value;
            d.push(function(m){
                return m.name.includes(a)?b:!b
            });
            var c=document.createElement("p");
            c.innerHTML="\u540d\u524d\u306b\u300c"+a+"\u300d"+(b?"\u3092\u542b\u3080":"\u3092\u542b\u307e\u306a\u3044")+'\u57a2<button><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24"><path d="M 10 2 L 9 3 L 4 3 L 4 5 L 7 5 L 17 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z"></path></svg></button>';
            k.appendChild(c);
            c.lastElementChild.addEventListener("click", ()=>{
                e(c)
            })
        }
    });
    document.querySelector("#bio .button.ok").addEventListener("click", ()=>{
        let a=document.querySelector("#bio input").value;
        if(""===a)alert("\u6587\u5b57\u5217\u304c\u7a7a\u767d\u3067\u3059");
        else{
            f("bio");
            f("dialogFade2");
            var b="true"==document.querySelector("#bio select").value;
            d.push(function(m){
                return m.description.includes(a)?b:!b
            });
            var c=document.createElement("p");
            c.innerHTML="bio\u306b\u300c"+a+"\u300d"+(b?"\u3092\u542b\u3080":"\u3092\u542b\u307e\u306a\u3044")+'\u57a2<button><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24"><path d="M 10 2 L 9 3 L 4 3 L 4 5 L 7 5 L 17 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z"></path></svg></button>';
            k.appendChild(c);
            c.lastElementChild.addEventListener("click", ()=>{
                e(c)
            })
        }
    });
    document.querySelector("#isfollowed .button.ok").addEventListener("click", ()=>{
        f("isfollowed");
        f("dialogFade2");
        let a="true"==document.querySelector("#isfollowed select").value;
        d.push(function(c){
            return"followed_by"in c&&c.followed_by?a:!a
        });
        let b=document.createElement("p");
        b.innerHTML="\u81ea\u5206\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u3066"+(a?"\u3044\u308b":"\u3044\u306a\u3044")+'\u57a2<button><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24"><path d="M 10 2 L 9 3 L 4 3 L 4 5 L 7 5 L 17 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z"></path></svg></button>';
        k.appendChild(b);
        b.lastElementChild.addEventListener("click", ()=>{
            e(b)
        })
    });
    document.querySelector("#isfollow .button.ok").addEventListener("click", ()=>{
        f("isfollow");
        f("dialogFade2");
        let a="true"==document.querySelector("#isfollow select").value;
        d.push(function(c){
            return"following"in c&&c.following?a:!a
        });
        let b=document.createElement("p");
        b.innerHTML="\u81ea\u5206\u304c\u30d5\u30a9\u30ed\u30fc\u3057\u3066"+(a?"\u3044\u308b":"\u3044\u306a\u3044")+'\u57a2<button><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24"><path d="M 10 2 L 9 3 L 4 3 L 4 5 L 7 5 L 17 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z"></path></svg></button>';
        k.appendChild(b);
        b.lastElementChild.addEventListener("click", ()=>{
            e(b)
        })
    });
    document.querySelector("#follow .button.ok").addEventListener("click", ()=>{
        let a=Number(document.querySelector("#follow input").value);
        if(""===a||!Number.isInteger(a)||0>a)alert("0\u4ee5\u4e0a\u306e\u534a\u89d2\u6574\u6570\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044");
        else{
            f("follow");
            f("dialogFade2");
            var b="true"==document.querySelector("#follow select").value;
            d.push(function(m){
                return m.friends_count>=a&&b||m.friends_count<=a&&!b?!0:!1
            });
            var c=document.createElement("p");
            c.innerHTML="\uff8c\uff6b\uff9b\uff70\u3057\u3066\u3044\u308b\u6570\u304c"+a+(b?"\u4ee5\u4e0a":"\u4ee5\u4e0b")+'\u306e\u57a2<button><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24"><path d="M 10 2 L 9 3 L 4 3 L 4 5 L 7 5 L 17 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z"></path></svg></button>';
            k.appendChild(c);
            c.lastElementChild.addEventListener("click", ()=>{
                e(c)
            })
        }
    });
    document.querySelector("#follower .button.ok").addEventListener("click", ()=>{
        let a=Number(document.querySelector("#follower input").value);
        if(""===a||!Number.isInteger(a)||0>a)alert("0\u4ee5\u4e0a\u306e\u534a\u89d2\u6574\u6570\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044");
        else{
            f("follower");
            f("dialogFade2");
            var b="true"==document.querySelector("#follower select").value;
            d.push(function(m){
                return m.followers_count>=a&&b||m.followers_count<=a&&!b?!0:!1
            });
            var c=document.createElement("p");
            c.innerHTML="\u30d5\u30a9\u30ed\u30ef\u30fc\u6570\u304c"+a+(b?"\u4ee5\u4e0a":"\u4ee5\u4e0b")+'\u306e\u57a2<button><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24"><path d="M 10 2 L 9 3 L 4 3 L 4 5 L 7 5 L 17 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z"></path></svg></button>';
            k.appendChild(c);
            c.lastElementChild.addEventListener("click", ()=>{
                e(c)
            })
        }
    });
    document.querySelector("#tweets .button.ok").addEventListener("click", ()=>{
        let a=Number(document.querySelector("#tweets input").value);
        if(""===a||!Number.isInteger(a)||0>a)alert("0\u4ee5\u4e0a\u306e\u534a\u89d2\u6574\u6570\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044");
        else{
            f("tweets");
            f("dialogFade2");
            var b="true"==document.querySelector("#tweets select").value;
            d.push(function(m){
                return m.statuses_count>=a&&b||m.statuses_count<=a&&!b?!0:!1
            });
            var c=document.createElement("p");
            c.innerHTML="\u30c4\u30a4\u30fc\u30c8\u6570\u304c"+a+(b?"\u4ee5\u4e0a":"\u4ee5\u4e0b")+'\u306e\u57a2<button><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24"><path d="M 10 2 L 9 3 L 4 3 L 4 5 L 7 5 L 17 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z"></path></svg></button>';
            k.appendChild(c);
            c.lastElementChild.addEventListener("click", ()=>{
                e(c)
            })
        }
    });
    document.querySelector("#like .button.ok").addEventListener("click", ()=>{
        let a=Number(document.querySelector("#like input").value);
        if(""===a||!Number.isInteger(a)||0>a)alert("0\u4ee5\u4e0a\u306e\u534a\u89d2\u6574\u6570\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044");
        else{
            f("like");
            f("dialogFade2");
            var b="true"==document.querySelector("#like select").value;
            d.push(function(m){
                return m.favourites_count>=a&&b||m.favourites_count<=a&&!b?!0:!1
            });
            var c=document.createElement("p");
            c.innerHTML="\u3044\u3044\u306d\u6570\u304c"+a+(b?"\u4ee5\u4e0a":"\u4ee5\u4e0b")+'\u306e\u57a2<button><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24"><path d="M 10 2 L 9 3 L 4 3 L 4 5 L 7 5 L 17 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z"></path></svg></button>';
            k.appendChild(c);
            c.lastElementChild.addEventListener("click", ()=>{
                e(c)
            })
        }
    });
    document.querySelector("#active .button.ok").addEventListener("click", ()=>{
        let a=Number(document.querySelector("#active input").value);
        if(""===a||!Number.isInteger(a)||0>a)alert("0\u4ee5\u4e0a\u306e\u534a\u89d2\u6574\u6570\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044");
        else{
            f("active");
            f("dialogFade2");
            var b="true"==document.querySelector("#active select").value;
            d.push(function(m){
                return new Promise(x=>{
                    let t=new XMLHttpRequest, A=getquery("UserTweets"), y={
                        variables:{
                            userId:m.rest_id, count:20, includePromotedContent:!0, withCommunity:!0, withVoice:!0, withV2Timeline:!0
                        }, features:{
                        }
                    };
                    y.features=A[1];
                    let C="?"+Object.entries(y).map(p=>`${p[0].replaceAll("%22","")}=${encodeURIComponent(JSON.stringify(p[1]))}`).join("&");
                    t.open("GET", "https://x.com/i/api/graphql/"+A[0]+"/UserTweets"+C);
                    setxhr(t);
                    t.onreadystatechange=()=>{
                        if(4==t.readyState)if(200==t.status){
                            let p, w, r=JSON.parse(t.responseText).data;
                            r=r.user.result.timeline_v2.timeline.instructions;
                            a:for(let u=0;
                            u<r.length;
                            u++)if(r[u].type.includes("Entries")){
                                if("entries"in r[u])p=r[u].entries;
                                else if("entry"in r[u])p=[r[u].entry];
                                else continue;
                                try{
                                    for(let q=0;
                                    q<p.length;
                                    q++)try{
                                        if(!p[q].entryId.includes("promoted")&&!p[q].entryId.includes("cursor")){
                                            if(p[q].entryId.includes("conversation"))w=[p[q].content.items[p[q].content.items.length-1]];
                                            else if(p[q].entryId.includes("tweet"))w=[{
                                                item:p[q].content
                                            }
                                            ];
                                            else continue;
                                            for(let z=0;
                                            z<w.length;
                                            z++){
                                                let v=w[z].item.itemContent.tweet_results.result;
                                                "tweet"in v&&(v=v.tweet);
                                                if(v.legacy.user_id_str==y.variables.userId){
                                                    let B=(new Date-new Date(v.legacy.created_at))/1E3/60/60/24;
                                                    b?B>a&&x(!0):B<a&&x(!0);
                                                    x(!1);
                                                    break a
                                                }
                                            }
                                        }
                                    }
                                    catch{
                                    }
                                }
                                catch{
                                }
                            }
                        }
                        else alert("API\u5236\u9650\u3067\u3059")
                    };
                    t.send()
                })
            });
            var c=document.createElement("p");
            c.innerHTML="\u6700\u65b0\u6295\u7a3f\u304c"+a+"\u65e5"+(b?"\u4ee5\u4e0a\u524d":"\u4ee5\u5185")+'\u306e\u57a2<button><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24"><path d="M 10 2 L 9 3 L 4 3 L 4 5 L 7 5 L 17 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z"></path></svg></button>';
            k.appendChild(c);
            c.lastElementChild.addEventListener("click", ()=>{
                e(c)
            })
        }
    });
    document.body.classList.add("inactive");
    dialogFade.showModal()
}, getquery=g=>{
    let f=webpackChunk_twitter_responsive_web;
    for(let e=f.length;
    e--;
    )for(let h in f[e][1])try{
        if(1==f[e][1][h].length){
            let d={
            };
            f[e][1][h](d);
            if(d.exports.operationName==g){
                let k=d.exports.metadata.featureSwitches, l={
                };
                for(let n=k.length;
                n--;
                )l[k[n]]=k[n]in FS?FS[k[n]].value:!0;
                return[d.exports.queryId, l]
            }
        }
    }
    catch{
    }
}, setxhr=g=>{
    g.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA");
    g.setRequestHeader("x-csrf-token", ct0);
    g.setRequestHeader("x-twitter-active-user", "yes");
    g.setRequestHeader("x-twitter-auth-type", "OAuth2Session");
    g.setRequestHeader("x-twitter-client-language", "ja");
    g.withCredentials=!0
}, count=0, check=0, erase=(g, f)=>{
    if(!(0>check)){
        var e=f.content.itemContent.user_results.result.legacy, h=0==g?"\u30d6\u30ed\u30c3\u30af":1==g?"\u30d6\u30ed\u89e3":"\u30d5\u30a9\u30ed\u30fc\u89e3\u9664";
        if(0<=check&&3>check)if(window.confirm(e.name+" (@"+e.screen_name+")\u3092"+h+"\u3057\u307e\u3059"))check++;
        else{
            alert("\u6761\u4ef6\u306e\u6307\u5b9a\u304c\u9593\u9055\u3048\u3066\u3044\u308b\u3001\u3082\u3057\u304f\u306f\u4f55\u3089\u304b\u306e\u30d0\u30b0\u304c\u8d77\u304d\u3066\u3044\u308b\u53ef\u80fd\u6027\u304c\u3042\u308a\u307e\u3059\n\u3082\u3046\u4e00\u5ea6\u304a\u8a66\u3057\u304f\u3060\u3055\u3044");
            0==check&&(log.innerText="0\u4ef6\u5b8c\u4e86\u3057\u307e\u3057\u305f");
            document.getElementById("loading").remove();
            document.querySelector("#loglog .checkbox").innerText="\u30da\u30fc\u30b8\u306e\u30ea\u30ed\u30fc\u30c9\u3067\u9589\u3058\u307e\u3059";
            check=-1;
            return
        }
        3==check&&(alert("\u78ba\u8a8d\u304c\u7d42\u308f\u308a\u307e\u3057\u305f\n\u3053\u306e\u30a2\u30e9\u30fc\u30c8\u3092\u9589\u3058\u308b\u3068\u4e00\u62ec\u5b9f\u884c\u3092\u958b\u59cb\u3057\u307e\u3059\nX\u306e\u753b\u9762\u306f\u958b\u3044\u305f\u307e\u307e\u306b\u3057\u3066\u3044\u3066\u304f\u3060\u3055\u3044"), check++);
        if(0==g||1==g){
            let d=new XMLHttpRequest, k=new FormData;
            k.append("user_id", f.content.itemContent.user_results.result.rest_id);
            d.open("POST", "https://x.com/i/api/1.1/blocks/create.json");
            setxhr(d);
            d.onreadystatechange=()=>{
                if(4==d.readyState&&200==d.status)if(0==g)count++, log.innerText=count+"\u4ef6\u5b8c\u4e86\u3057\u307e\u3057\u305f";
                else{
                    let l=new XMLHttpRequest;
                    l.open("POST", "https://x.com/i/api/1.1/blocks/destroy.json");
                    setxhr(l);
                    l.onreadystatechange=()=>{
                        4==l.readyState&&200==l.status&&(count++, log.innerText=count+"\u4ef6\u5b8c\u4e86\u3057\u307e\u3057\u305f")
                    };
                    l.send(k)
                }
            };
            d.send(k)
        }
        else{
            let d=new XMLHttpRequest;
            e=new FormData;
            e.append("include_profile_interstitial_type", 1);
            e.append("include_blocking", 1);
            e.append("include_blocked_by", 1);
            e.append("include_followed_by", 1);
            e.append("include_want_retweets", 1);
            e.append("include_mute_edge", 1);
            e.append("include_can_dm", 1);
            e.append("include_can_media_tag", 1);
            e.append("include_ext_is_blue_verified", 1);
            e.append("include_ext_verified_type", 1);
            e.append("include_ext_profile_image_shape", 1);
            e.append("skip_status", 1);
            e.append("user_id", f.content.itemContent.user_results.result.rest_id);
            d.open("POST", "https://x.com/i/api/1.1/friendships/destroy.json");
            setxhr(d);
            d.onreadystatechange=()=>{
                4==d.readyState&&200==d.status&&(count++, log.innerText=count+"\u4ef6\u5b8c\u4e86\u3057\u307e\u3057\u305f")
            };
            d.send(e)
        }
    }
}, end=g=>{
    0>check||(g?alert("API\u5236\u9650\u3067\u3059\u3002\n"+(new Date(g)).toLocaleTimeString()+"\u306b\u89e3\u9664\u3055\u308c\u307e\u3059\u306e\u3067\u3001\u305d\u308c\u4ee5\u964d\u306b\u518d\u5ea6\u304a\u8a66\u3057\u4e0b\u3055\u3044"):alert("\u5b8c\u4e86\u3057\u307e\u3057\u305f\u3002\u5927\u91cf\u306b\u51e6\u7406\u3057\u305f\u5834\u5408\u306f\u51cd\u7d50\u56de\u907f\u306e\u305f\u3081\u3001\u3057\u3070\u3089\u304f\u30d5\u30a9\u30ed\u30fc\u30fb\u30d5\u30a9\u30ed\u30fc\u89e3\u9664\u3092\u63a7\u3048\u308b\u306e\u3092\u304a\u52e7\u3081\u3057\u307e\u3059"), document.getElementById("loading").remove(), document.querySelector("#loglog .checkbox").innerText="\u30da\u30fc\u30b8\u306e\u30ea\u30ed\u30fc\u30c9\u3067\u9589\u3058\u307e\u3059", log.innerText.includes("\u691c")&&(log.innerText="0\u4ef6\u5b8c\u4e86\u3057\u307e\u3057\u305f"))
}, query=(g, f)=>{
    let e=0==g||1==g?"Followers":"Following", h=new XMLHttpRequest, d=getquery(e);
    f.features=d[1];
    f="?"+Object.entries(f).map(k=>`${k[0].replaceAll("%22","")}=${encodeURIComponent(JSON.stringify(k[1]))}`).join("&");
    h.open("GET", "https://x.com/i/api/graphql/"+d[0]+"/"+e+f);
    setxhr(h);
    h.setRequestHeader("content-type", "application/json");
    h.onreadystatechange=()=>{
        if(4==h.readyState)if(200==h.status){
            let k=0, l=JSON.parse(h.responseText).data.user.result.timeline.timeline.instructions;
            l=l[l.length-1].entries;
            for(let n=0;
            n<l.length;
            n++)try{
                if(l[n].entryId.includes("user"))k++, judge(l[n]).then(a=>{
                    a&&erase(g, l[n])
                });
                else if(l[n].entryId.includes("bottom")){
                    if(0==k){
                        end();
                        break
                    }
                    let a=JSON.parse(JSON.stringify(data1));
                    a.variables.cursor=l[n].content.value;
                    query(g, a);
                    break
                }
            }
            catch{
            }
        }
        else end(1E3*Number(h.getResponseHeader("X-Rate-Limit-Reset")))
    };
    h.send()
};
init();
void+0
