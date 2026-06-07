debugLog = (message, detail) => {
    try {
        if (detail === undefined) console.log("[x-delete payload] " + message);
        else console.log("[x-delete payload] " + message, detail);
    } catch {}
    const debugBox = document.getElementById("x-delete-debug-log");
    if (debugBox) {
        const line = document.createElement("div");
        line.textContent = new Date().toLocaleTimeString() + " payload: " + message;
        debugBox.appendChild(line);
        debugBox.scrollTop = debugBox.scrollHeight;
    }
};

payloadDebugVersion = "delete-20260607-gql-shape-v5";
payloadStartedAt = performance.now();

init = () => {
    const parseInitialStateText = (text) => {
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
    };

    const readInitialState = () => {
        const scripts = document.getElementsByTagName("script");
        for (let index = 0; index < scripts.length; index++) {
            const text = scripts[index].textContent || "";
            if (!text.includes("INITIAL_STATE")) continue;
            const state = parseInitialStateText(text);
            if (state) return state;
        }
        throw new Error("INITIAL_STATE が見つからない、または解析できません");
    };

    const findInitialStateValue = (node, key, depth = 0) => {
        if (!node || depth > 8) return "";
        if (Array.isArray(node)) {
            for (let index = 0; index < node.length; index++) {
                const value = findInitialStateValue(node[index], key, depth + 1);
                if (value) return value;
            }
            return "";
        }
        if (typeof node !== "object") return "";
        if (node[key]) return node[key];
        for (const name in node) {
            const value = findInitialStateValue(node[name], key, depth + 1);
            if (value) return value;
        }
        return "";
    };

    const pickCurrentUser = (state) => {
        const users = state.entities && state.entities.users && state.entities.users.entities || {};
        const values = Object.keys(users).map((key) => users[key]).filter(Boolean);
        const session = state.session || state.user || {};
        const sessionUserId = session.user_id || session.userId || session.id_str || session.rest_id ||
            findInitialStateValue(state, "user_id") || findInitialStateValue(state, "userId");
        const profileName = location.pathname.split("/")[1] || "";
        return users[sessionUserId] ||
            values.find((user) => user.id_str == sessionUserId || user.rest_id == sessionUserId) ||
            values.find((user) => profileName && String(user.screen_name).toLowerCase() == profileName.toLowerCase()) ||
            values[0];
    };

    document.cookie.split("; ").forEach(a => {
        let b = a.split('=');
        if (b[0] == "ct0") window.ct0 = b[1]
    });
    let b = readInitialState(),
        c = pickCurrentUser(b);
    if (!c) throw new Error("ユーザー情報を取得できません");
    username = c.screen_name;
    debugLog("payload版 " + payloadDebugVersion);
    debugLog("対象ユーザー screen_name=" + username + " userId=" + (c.id_str || c.rest_id || "none") + " path=" + location.pathname);
    logPrePayloadGraphqlOperations();
    discoverWebpackGraphqlOperations();
    data1 = {
        variables: {
            rawQuery: "from:" + username,
            count: 20,
            cursor: "",
            querySource: "typed_query",
            product: "Latest",
            withGrokTranslatedBio: false
        },
        features: {}
    };
    data2 = {
        variables: {
            userId: c.id_str || c.rest_id,
            count: 20,
            includePromotedContent: !0,
            withCommunity: !0,
            withVoice: !0
        },
        features: {},
        fieldToggles: {
            withArticlePlainText: !1
        }
    };
    data3 = {
        variables: {
            listId: "",
            count: 20
        },
        features: {}
    };
    FS = b.featureSwitch.defaultConfig;
    queryIds = [
        {
            id: "SearchTimeline",
            data: data1,
            entry: false,
            number: 0
        },
        {
            id: "ListLatestTweetsTimeline",
            data: data3,
            entry: false,
            number: 1
        },
        {
            id: "ListRankedTweetsTimeline",
            data: data3,
            entry: false,
            number: 2
        },
        {
            id: "UserTweets",
            data: data2,
            entry: true,
            number: 3
        },
        {
            id: "UserTweetsAndReplies",
            aliases: ["UserTweetsAndReplies", "UserTweets", "UserTweetsAndRepliesTimeline"],
            data: data2,
            entry: true,
            number: 4
        }
    ];
    current = queryIds[0];
    seenCursors = {};
    visibleDomFallbackTried = !1;
    visibleDomFallbackSeen = {};
    let styleTag = document.createElement('style');
    styleTag.innerHTML = `
    .dialog {
      width: 26em;
      max-width: 95%;
      max-height: 60%;
      border: none;
      border-radius: 4px;
      box-shadow: 0 0 24px 4px rgba(0, 0, 0, 0.4);
      padding: 0;
      font-family: "Segoe UI",Meiryo,system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
      font-weight: bold;
      color: black !important;
    }
    .dialog p {
      margin: 0;
    }
    .dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.4);
    }
    .dialog .header {
      background-color: #1089d9;
      color: #fff !important;
      font-weight: bold;
      padding: 1em;
      position: sticky;
      top: 0;
      text-align: center;
    }
    .dialog .body {
      background-color: #fff;
      margin: 0;
      padding: 1em;
      text-align: center;
    }
    .dialog p {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
    .dialog .body p {
      margin: 1em;
    }
    .dialog .footer {
      background-color: #fff;
      text-align: center;
      margin: 0;
      padding: 1em;
      position: sticky;
      bottom: 0;
    }
    .dialog .button {
      width: 8em;
      height: 2.4em;
      border: none;
      border-radius: 4px;
      font-size: smaller;
      font-weight: bold;
      color: black !important;
    }
    #dialogFade .body button {
      border: none;
      background-color: #fff;
    }
    .dialog .button:hover {
      opacity: 0.8;
    }
    .dialog .button.cancel {
      background-color: #e6eae6;
    }
    .dialog .button.add {
      background-color: #a0def0;
      margin-bottom: 1em;
    }
    .dialog .button.ok {
      background-color: #0075c2;
      color: #fff !important;
    }
    .dialog select, input {
      margin: 0.5em;
      padding: 0.5em;
      font-size: smaller;
      font-weight: bold;
      color: black !important;
      background: white;
    }

    .dialog[open],
    .dialog[open]::backdrop {
      animation: fadeIn 200ms ease normal;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .dialog.hide,
    .dialog.hide::backdrop {
      animation: fadeOut 200ms ease normal;
    }
    @keyframes fadeOut {
      to {
        opacity: 0;
      }
    }
    .number {
      width: 3em;
    }
    .checkbox {
      margin-bottom: 1em !important;
      font-size: xx-small;
      font-weight: normal;
      justify-content: center !important;
    }
    `;
    document.head.insertAdjacentElement('beforeend', styleTag);
    let dialogs = document.createElement('div');
    dialogs.id = "dialogs";
    dialogs.innerHTML = `
    <dialog id="dialogFade" class="dialog">
      <div class="inner">
        <div class="header">
          <p>ツイ消しツール</p>
        </div>
        <div class="body">
        </div>
        <div class="footer">
          <p><button class="button add">条件追加</button></p>
          <p class="checkbox"><input type="checkbox">一時的に非公開のリストを作成(削除可能件数が大幅に増えます)</p>
          <p><button class="button cancel">キャンセル</button>
          <button class="button ok">削除する！</button></p>
        </div>
      </div>
    </dialog>

    <dialog id="loglog" class="dialog">
      <div class="inner">
        <div class="header">
          <p>ツイ消しツール</p>
        </div>
        <div class="body">
          <p><span id="log">＜検索中＞TLを遡っています</span>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="loading" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve">
          <rect fill="none" width="32" height="32"/>
          <path fill="#040100" d="M16,3.2L16,3.2c0.619,0,1.12,0.716,1.12,1.6V8c0,0.884-0.501,1.6-1.12,1.6l0,0c-0.619,0-1.12-0.716-1.12-1.6  V4.8C14.88,3.917,15.381,3.2,16,3.2z">
          <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0s" dur="1s" to="0" from="1" attributeName="opacity">
              </animate>
          </path>
          <path fill="#040100" d="M22.4,4.915L22.4,4.915c0.535,0.309,0.611,1.18,0.17,1.945L20.97,9.632c-0.441,0.765-1.233,1.135-1.77,0.826  l0,0c-0.536-0.309-0.612-1.18-0.17-1.946l1.6-2.771C21.072,4.975,21.864,4.605,22.4,4.915z">
          <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.08333333333333333s" dur="1s" to="0" from="1" attributeName="opacity">
              </animate>
          </path>
          <path fill="#040100" d="M27.085,9.6L27.085,9.6c0.31,0.536-0.06,1.328-0.825,1.77l-2.771,1.6c-0.766,0.442-1.637,0.366-1.945-0.17  l0,0c-0.31-0.536,0.061-1.328,0.825-1.77l2.771-1.6C25.904,8.988,26.775,9.064,27.085,9.6z">
          <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.16666666666666666s" dur="1s" to="0" from="1" attributeName="opacity">
              </animate>
          </path>
          <path fill="#040100" d="M28.8,16L28.8,16c0,0.619-0.716,1.12-1.6,1.12H24c-0.884,0-1.6-0.501-1.6-1.12l0,0  c0-0.619,0.716-1.12,1.6-1.12h3.2C28.084,14.88,28.8,15.381,28.8,16z">
          <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.25s" dur="1s" to="0" from="1" attributeName="opacity">
              </animate>
          </path>
          <path fill="#040100" d="M27.085,22.4L27.085,22.4c-0.31,0.535-1.181,0.611-1.945,0.17l-2.771-1.601  c-0.765-0.441-1.135-1.233-0.825-1.77l0,0c0.309-0.536,1.18-0.612,1.945-0.17l2.771,1.6C27.025,21.072,27.395,21.864,27.085,22.4z">
          <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.3333333333333333s" dur="1s" to="0" from="1" attributeName="opacity">
              </animate>
          </path>
          <path fill="#040100" d="M22.4,27.085L22.4,27.085c-0.536,0.31-1.328-0.06-1.771-0.825l-1.6-2.771  c-0.442-0.766-0.366-1.637,0.17-1.945l0,0c0.536-0.31,1.328,0.061,1.77,0.825l1.601,2.771C23.012,25.904,22.936,26.775,22.4,27.085z  ">
          <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.4166666666666667s" dur="1s" to="0" from="1" attributeName="opacity">
              </animate>
          </path>
          <path fill="#040100" d="M16,28.8L16,28.8c-0.619,0-1.12-0.716-1.12-1.6V24c0-0.884,0.501-1.6,1.12-1.6l0,0  c0.619,0,1.12,0.716,1.12,1.6v3.2C17.12,28.084,16.619,28.8,16,28.8z">
          <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.5s" dur="1s" to="0" from="1" attributeName="opacity">
              </animate>
          </path>
          <path fill="#040100" d="M9.6,27.085L9.6,27.085c-0.536-0.31-0.612-1.181-0.17-1.945l1.6-2.771c0.441-0.765,1.234-1.135,1.77-0.825  l0,0c0.536,0.309,0.612,1.18,0.17,1.945l-1.6,2.771C10.928,27.025,10.136,27.395,9.6,27.085z">
          <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.5833333333333334s" dur="1s" to="0" from="1" attributeName="opacity">
              </animate>
          </path>
          <path fill="#040100" d="M4.915,22.4L4.915,22.4c-0.31-0.536,0.06-1.328,0.826-1.771l2.771-1.6c0.765-0.442,1.636-0.366,1.946,0.17  l0,0c0.309,0.536-0.061,1.328-0.826,1.77L6.86,22.57C6.095,23.012,5.224,22.936,4.915,22.4z">
          <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.6666666666666666s" dur="1s" to="0" from="1" attributeName="opacity">
              </animate>
          </path>
          <path fill="#040100" d="M3.2,16L3.2,16c0-0.619,0.716-1.12,1.6-1.12H8c0.884,0,1.6,0.501,1.6,1.12l0,0c0,0.619-0.716,1.12-1.6,1.12  H4.8C3.917,17.12,3.2,16.619,3.2,16z">
          <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.75s" dur="1s" to="0" from="1" attributeName="opacity">
              </animate>
          </path>
          <path fill="#040100" d="M4.915,9.6L4.915,9.6c0.309-0.536,1.18-0.612,1.945-0.17l2.771,1.6c0.765,0.441,1.135,1.234,0.826,1.77l0,0  c-0.31,0.536-1.181,0.612-1.946,0.17l-2.771-1.6C4.975,10.928,4.605,10.136,4.915,9.6z">
          <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.8333333333333334s" dur="1s" to="0" from="1" attributeName="opacity">
              </animate>
          </path>
          <path fill="#040100" d="M9.6,4.915L9.6,4.915c0.536-0.31,1.328,0.06,1.77,0.826l1.6,2.771c0.442,0.766,0.366,1.637-0.17,1.946l0,0  c-0.536,0.309-1.328-0.061-1.77-0.826L9.43,6.86C8.988,6.095,9.064,5.224,9.6,4.915z">
          <animate fill="remove" restart="always" calcMode="linear" additive="replace" accumulate="none" repeatCount="indefinite" begin="0.9166666666666666s" dur="1s" to="0" from="1" attributeName="opacity">
              </animate>
          </path>
          </svg>
          </p>
        </div>
        <div class="footer"><p class="checkbox">ページのリロードで停止します</p></div>
      </div>
    </dialog>

    <dialog id="dialogFade2" class="dialog">
      <div class="inner">
        <div class="body">
          <p><button class="button ok">日付</button>
          <button class="button ok">日付&時刻</button></p>
          <p><button class="button ok">リツイート</button>
          <button class="button ok">リプライ</button></p>
          <p><button class="button ok">画像&動画</button>
          <button class="button ok">文字列</button></p>
          <p><button class="button ok">リツイート数</button>
          <button class="button ok">いいね数</button></p>
          <p><button class="button cancel">キャンセル</button></p>
        </div>
      </div>
    </dialog>

    <dialog id="date" class="dialog">
      <div class="inner">
        <div class="body">
          <p><input type="date"><select><option value="true">より前</option><option value="false">より後</option></select>を削除</p>
          <p><button class="button cancel">キャンセル</button>
          <button class="button ok">追加</button></p>
        </div>
      </div>
    </dialog>
    </div>

    <dialog id="time" class="dialog">
      <div class="inner">
        <div class="body">
          <p><input type="datetime-local"><select><option value="true">より前</option><option value="false">より後</option></select>を削除</p>
          <p><button class="button cancel">キャンセル</button>
          <button class="button ok">追加</button></p>
        </div>
      </div>
    </dialog>
    </div>

    <dialog id="retweet" class="dialog">
      <div class="inner">
        <div class="body">
          <p>リツイート<select><option value="true">のみ</option><option value="false">以外</option></select>を削除</p>
          <p><button class="button cancel">キャンセル</button>
          <button class="button ok">追加</button></p>
        </div>
      </div>
    </dialog>
    </div>

    <dialog id="reply" class="dialog">
      <div class="inner">
        <div class="body">
          <p>リプライ<select><option value="true">のみ</option><option value="false">以外</option></select>を削除</p>
          <p><button class="button cancel">キャンセル</button>
          <button class="button ok">追加</button></p>
        </div>
      </div>
    </dialog>
    </div>

    <dialog id="photo" class="dialog">
      <div class="inner">
        <div class="body">
          <p>画像や動画<select><option value="true">を含む</option><option value="false">を含まない</option></select>ものを削除</p>
          <p><button class="button cancel">キャンセル</button>
          <button class="button ok">追加</button></p>
        </div>
      </div>
    </dialog>
    </div>

    <dialog id="word" class="dialog">
      <div class="inner">
        <div class="body">
          <p><input type="text" size="10">を<select><option value="true">含む</option><option value="false">含まない</option></select>ものを削除</p>
          <p><button class="button cancel">キャンセル</button>
          <button class="button ok">追加</button></p>
        </div>
      </div>
    </dialog>
    </div>

    <dialog id="retweetnum" class="dialog">
      <div class="inner">
        <div class="body">
          <p>ﾘﾂｲｰﾄ数が<input type="number" class="number"><select><option value="true">以上</option><option value="false">以下</option></select>のものを削除</p>
          <p><button class="button cancel">キャンセル</button>
          <button class="button ok">追加</button></p>
        </div>
      </div>
    </dialog>
    </div>

    <dialog id="like" class="dialog">
      <div class="inner">
        <div class="body">
          <p>いいね数が<input type="number" class="number"><select><option value="true">以上</option><option value="false">以下</option></select>のものを削除</p>
          <p><button class="button cancel">キャンセル</button>
          <button class="button ok">追加</button></p>
        </div>
      </div>
    </dialog>
    `;
    document.body.appendChild(dialogs);

    let functions = [],
        log = document.getElementById('log'),
        funclist = document.querySelector('#dialogFade .body'),
        showButtonFade = document.querySelector('#showButtonFade');

    window.judge = function(a, b, c, d, e) {
        for (let i = 0; i < functions.length; i++) {
            if (!functions[i](a, b, c, d, e)) return false;
        }
        return true;
    }

    duration = [[0], [10e13]];

    document.querySelector('#dialogFade .button.ok').addEventListener('click', () => {
        let msg = functions.length == 0 ? "全ての" : 'これらの条件を全て満たす';
        if (window.confirm(msg + '\n@' + username + ' のツイートを削除します\n開発者は一切の責任を負いかねます\n削除を開始してよろしいですか？')) {
            duration = [Math.max(...duration[0]), Math.min(...duration[1])];
            uselist = document.querySelector(".checkbox input").checked;
            document.getElementById('dialogFade').remove();
            showdialog("loglog");
            alert("確認のため、削除するツイート最初の5件が表示されます");
            query(current.data);
        }
    });

    document.querySelector('#dialogFade .button.add').addEventListener('click', () => {
        showdialog("dialogFade2")
    });
    let showlist = document.querySelectorAll('#dialogFade2 .button.ok'),
        showlist2 = ["date", "time", "retweet", "reply", "photo", "word", "retweetnum", "like"];
    for (let i = 0; i < showlist.length; i++) {
        showlist[i].addEventListener('click', () => {
            showdialog(showlist2[i])
        })
    }

    function showdialog(name) {
        document.querySelector('#' + name).showModal();
    }

    let removelist = ["dialogFade", "dialogFade2", "date", "time", "retweet", "reply", "photo", "word", "retweetnum", "like"];
    for (let i = 0; i < removelist.length; i++) {
        document.querySelector('#' + removelist[i] + ' .button.cancel').addEventListener('click', () => {
            remove(removelist[i])
        })
    }

    function remove(name) {
        let dia = document.querySelector('#' + name);
        dia.classList.add('hide');
        dia.addEventListener('animationend', function closeDialog() {
            document.body.classList.remove('inactive');
            this.classList.remove('hide');
            this.close();
            this.removeEventListener('animationend', closeDialog);
            if (name == "dialogFade") document.getElementById("dialogs").remove()
        });
    }

    function removefunc(a) {
        let funclist2 = Array.from(document.querySelectorAll("#dialogFade .body p")),
            index = funclist2.findIndex(p => p === a);
        functions.splice(index, 1);
        a.remove();
    }

    let trashsvg = '<button><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24"><path d="M 10 2 L 9 3 L 4 3 L 4 5 L 7 5 L 17 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z"></path></svg></button>';

    document.querySelector('#date .button.ok').addEventListener('click', () => {
        let val = document.querySelector('#date input').value;
        if (val == "") {
            alert("日付が空白です");
            return
        }
        remove("date");
        remove("dialogFade2");
        let dat = new Date(val);
        if (document.querySelector('#date select').value == "true") {
            dat.setHours(23);
            dat.setMinutes(59);
            dat.setSeconds(59);
            duration[1].push(dat);
            let func = function(a, b, c, d, e) {
                if (a <= dat) return true;
                return false;
            }
            functions.push(func);
            let tag = document.createElement("p");
            tag.innerHTML = dat.toLocaleString("ja").slice(0, -8) + " より前を削除" + trashsvg;
            funclist.appendChild(tag);
            tag.lastElementChild.addEventListener('click', () => {
                removefunc(tag);
                duration[1].splice(duration[1].indexOf(dat), 1)
            })
        } else {
            dat.setHours(0);
            dat.setMinutes(0);
            dat.setSeconds(0);
            duration[0].push(dat);
            let func = function(a, b, c, d, e) {
                if (dat <= a) return true;
                return false;
            }
            functions.push(func);
            let tag = document.createElement("p");
            tag.innerHTML = dat.toLocaleString("ja").slice(0, -8) + " より後を削除" + trashsvg;
            funclist.appendChild(tag);
            tag.lastElementChild.addEventListener('click', () => {
                removefunc(tag)
                duration[0].splice(duration[0].indexOf(dat), 1)
            })
        }
    });

    document.querySelector('#time .button.ok').addEventListener('click', () => {
        let val = document.querySelector('#time input').value;
        if (val == "") {
            alert("日付が空白です");
            return
        }
        remove("time");
        remove("dialogFade2");
        let dat = new Date(val);
        if (document.querySelector('#time select').value == "true") {
            dat.setSeconds(59);
            duration[1].push(dat);
            let func = function(a, b, c, d, e) {
                if (a <= dat) return true;
                return false;
            }
            functions.push(func);
            let tag = document.createElement("p");
            tag.innerHTML = dat.toLocaleString("ja").slice(0, -3) + "より前を削除" + trashsvg;
            funclist.appendChild(tag);
            tag.lastElementChild.addEventListener('click', () => {
                removefunc(tag)
                duration[1].splice(duration[1].indexOf(dat), 1)
            })
        } else {
            dat.setSeconds(0);
            duration[0].push(dat)
            let func = function(a, b, c, d, e) {
                if (dat <= a) return true;
                return false;
            }
            functions.push(func);
            let tag = document.createElement("p");
            tag.innerHTML = dat.toLocaleString("ja").slice(0, -3) + "より後を削除" + trashsvg;
            funclist.appendChild(tag);
            tag.lastElementChild.addEventListener('click', () => {
                removefunc(tag)
                duration[0].splice(duration[0].indexOf(dat), 1)
            })
        }
    });

    RT = 0;
    document.querySelector('#retweet .button.ok').addEventListener('click', () => {
        remove("retweet");
        remove("dialogFade2");
        let flag = document.querySelector('#retweet select').value == "true";
        if (flag) RT++;
        let func = function(a, b, c, d, e) {
            if (b.slice(0, 3) == "RT ") return flag;
            return !flag;
        }
        functions.push(func);
        let tag = document.createElement("p"),
            word = flag ? "のみ" : "以外";
        tag.innerHTML = "リツイート" + word + "を削除" + trashsvg;
        funclist.appendChild(tag);
        tag.lastElementChild.addEventListener('click', () => {
            removefunc(tag);
            if (flag) RT--
        })
    });

    RP = 0;
    document.querySelector('#reply .button.ok').addEventListener('click', () => {
        remove("reply");
        remove("dialogFade2");
        let flag = document.querySelector('#reply select').value == "true";
        if (flag) RP++;
        let func = function(a, b, c, d, e) {
            if (b.slice(0, 1) == "@") return flag;
            return !flag;
        }
        functions.push(func);
        let tag = document.createElement("p"),
            word = flag ? "のみ" : "以外";
        tag.innerHTML = "リプライ" + word + "を削除" + trashsvg;
        funclist.appendChild(tag);
        tag.lastElementChild.addEventListener('click', () => {
            removefunc(tag);
            if (flag) RP--
        })
    });

    document.querySelector('#photo .button.ok').addEventListener('click', () => {
        remove("photo");
        remove("dialogFade2");
        let flag = document.querySelector('#photo select').value == "true";
        let func = function(a, b, c, d, e) {
            if (e) return flag;
            return !flag;
        }
        functions.push(func);
        let tag = document.createElement("p"),
            word = flag ? "を含む" : "を含まない";
        tag.innerHTML = "画像や動画" + word + "ものを削除" + trashsvg;
        funclist.appendChild(tag);
        tag.lastElementChild.addEventListener('click', () => {
            removefunc(tag)
        })
    });

    document.querySelector('#word .button.ok').addEventListener('click', () => {
        let val = document.querySelector('#word input').value;
        if (val === "") {
            alert("文字列が空白です");
            return
        }
        remove("word");
        remove("dialogFade2");
        let flag = document.querySelector('#word select').value == "true";
        let func = function(a, b, c, d, e) {
            if (b.includes(val)) return flag;
            return !flag;
        }
        functions.push(func);
        let tag = document.createElement("p"),
            word = flag ? "を含む" : "を含まない";
        tag.innerHTML = "「" + val + "」" + word + "ものを削除" + trashsvg;
        funclist.appendChild(tag);
        tag.lastElementChild.addEventListener('click', () => {
            removefunc(tag)
        })
    });

    document.querySelector('#retweetnum .button.ok').addEventListener('click', () => {
        let val = Number(document.querySelector('#retweetnum input').value);
        if (val === "" || !Number.isInteger(val) || val < 0) {
            alert("0以上の半角整数を入力してください");
            return
        }
        remove("retweetnum");
        remove("dialogFade2");
        let flag = document.querySelector('#retweetnum select').value == "true";
        let func = function(a, b, c, d, e) {
            if (c >= val && flag) return true;
            if (c <= val && !flag) return true;
            return false;
        }
        functions.push(func);
        let tag = document.createElement("p"),
            word = flag ? "以上" : "以下";
        tag.innerHTML = "ﾘﾂｲｰﾄ数が" + val + word + "のものを削除" + trashsvg;
        funclist.appendChild(tag);
        tag.lastElementChild.addEventListener('click', () => {
            removefunc(tag)
        })
    });

    document.querySelector('#like .button.ok').addEventListener('click', () => {
        let val = Number(document.querySelector('#like input').value);
        if (val === "" || !Number.isInteger(val) || val < 0) {
            alert("0以上の半角整数を入力してください");
            return
        }
        remove("like");
        remove("dialogFade2");
        let flag = document.querySelector('#like select').value == "true";
        let func = function(a, b, c, d, e) {
            if (d >= val && flag) return true;
            if (d <= val && !flag) return true;
            return false;
        }
        functions.push(func);
        let tag = document.createElement("p"),
            word = flag ? "以上" : "以下";
        tag.innerHTML = "いいね数が" + val + word + "のものを削除" + trashsvg;
        funclist.appendChild(tag);
        tag.lastElementChild.addEventListener('click', () => {
            removefunc(tag)
        })
    });

    document.body.classList.add('inactive');
    dialogFade.showModal();
}

getqueryCandidates = (_) => {
    let a = webpackChunk_twitter_responsive_web,
        candidates = [],
        seen = {},
        related = [];
    const addCandidate = (operationName, queryId, featureSwitches) => {
        if (!operationName || !queryId) return;
        if (operationName.includes("UserTweets")) related.push(operationName + ":" + queryId);
        if (operationName != _ || seen[queryId + ":" + operationName]) return;
        let features = {};
        featureSwitches = featureSwitches || [];
        for (let j = featureSwitches.length; j--;) {
            if (featureSwitches[j] in FS) features[featureSwitches[j]] = FS[featureSwitches[j]].value;
            else features[featureSwitches[j]] = !0
        }
        seen[queryId + ":" + operationName] = !0;
        candidates.push([queryId, features, operationName])
    };
    const scanFunctionSource = (fn) => {
        const source = String(fn);
        const operationMatch = source.match(/operationName["']?\s*[:=]\s*["']([^"']+)["']/);
        const queryMatch = source.match(/queryId["']?\s*[:=]\s*["']([^"']+)["']/);
        const featureMatch = source.match(/featureSwitches["']?\s*[:=]\s*\[([^\]]*)\]/);
        if (!operationMatch || !queryMatch) return;
        const switches = featureMatch ? featureMatch[1].match(/["']([^"']+)["']/g) || [] : [];
        addCandidate(operationMatch[1], queryMatch[1], switches.map((value) => value.slice(1, -1)));
    };
    for (let i = a.length; i--;) {
        for (let c in a[i][1]) {
            try {
                scanFunctionSource(a[i][1][c]);
                if (a[i][1][c].length == 1) {
                    let d = {};
                    a[i][1][c](d);
                    addCandidate(d.exports.operationName, d.exports.queryId, d.exports.metadata && d.exports.metadata.featureSwitches)
                }
            } catch {}
        }
    }
    return candidates
};

    getLiveGraphqlCandidates = (operationNames) => {
    const names = operationNames || [current.id];
    const entries = performance.getEntriesByType ? performance.getEntriesByType("resource").filter((entry) => entry.startTime < payloadStartedAt).slice().reverse() : [];
    const candidates = [];
    const seen = {};
    for (let index = 0; index < entries.length; index++) {
        try {
            const url = new URL(entries[index].name);
            const match = url.pathname.match(/\/i\/api\/graphql\/([^/]+)\/([^/]+)/);
            if (!match) continue;
            const queryId = match[1], operationName = decodeURIComponent(match[2]);
            const isTarget = names.includes(operationName) ||
                (names.some((name) => name.includes("UserTweets")) && operationName.includes("UserTweets"));
            if (!isTarget || seen[queryId + ":" + operationName]) continue;
            const variablesText = url.searchParams.get("variables");
            const featuresText = url.searchParams.get("features");
            const variables = variablesText ? JSON.parse(variablesText) : null;
            const features = featuresText ? JSON.parse(featuresText) : {};
            if (variables && variables.userId && variables.userId != data2.variables.userId) continue;
            seen[queryId + ":" + operationName] = !0;
            candidates.push([queryId, features, operationName, variables]);
        } catch {}
    }
        return candidates;
    };

    userTimelineFeatureOverrides = {
        rweb_video_screen_enabled: !1,
        rweb_cashtags_enabled: !0,
        profile_label_improvements_pcf_label_in_post_enabled: !0,
        responsive_web_profile_redirect_enabled: !1,
        rweb_tipjar_consumption_enabled: !1,
        verified_phone_label_enabled: !1,
        creator_subscriptions_tweet_preview_api_enabled: !0,
        responsive_web_graphql_timeline_navigation_enabled: !0,
        responsive_web_graphql_skip_user_profile_image_extensions_enabled: !1,
        premium_content_api_read_enabled: !1,
        communities_web_enable_tweet_community_results_fetch: !0,
        c9s_tweet_anatomy_moderator_badge_enabled: !0,
        responsive_web_grok_analyze_button_fetch_trends_enabled: !1,
        responsive_web_grok_analyze_post_followups_enabled: !0,
        rweb_cashtags_composer_attachment_enabled: !0,
        responsive_web_jetfuel_frame: !0,
        responsive_web_grok_share_attachment_enabled: !0,
        responsive_web_grok_annotations_enabled: !0,
        articles_preview_enabled: !0,
        responsive_web_edit_tweet_api_enabled: !0,
        rweb_conversational_replies_downvote_enabled: !1,
        graphql_is_translatable_rweb_tweet_is_translatable_enabled: !0,
        view_counts_everywhere_api_enabled: !0,
        longform_notetweets_consumption_enabled: !0,
        responsive_web_twitter_article_tweet_consumption_enabled: !0,
        content_disclosure_indicator_enabled: !0,
        content_disclosure_ai_generated_indicator_enabled: !0,
        responsive_web_grok_show_grok_translated_post: !0,
        responsive_web_grok_analysis_button_from_backend: !0,
        post_ctas_fetch_enabled: !1,
        freedom_of_speech_not_reach_fetch_enabled: !0,
        standardized_nudges_misinfo: !0,
        tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: !0,
        longform_notetweets_rich_text_read_enabled: !0,
        longform_notetweets_inline_media_enabled: !1,
        responsive_web_grok_image_annotation_enabled: !0,
        responsive_web_grok_imagine_annotation_enabled: !0,
        responsive_web_grok_community_note_auto_translation_is_enabled: !0,
        responsive_web_enhance_cards_enabled: !1
    };

    logPrePayloadGraphqlOperations = () => {
        const entries = performance.getEntriesByType ? performance.getEntriesByType("resource").filter((entry) => entry.startTime < payloadStartedAt).slice().reverse() : [];
        const seen = {};
        const operations = [];
    for (let index = 0; index < entries.length; index++) {
        try {
            const url = new URL(entries[index].name);
            const match = url.pathname.match(/\/i\/api\/graphql\/([^/]+)\/([^/]+)/);
            if (!match) continue;
            const operationName = decodeURIComponent(match[2]);
            if (seen[operationName]) continue;
            seen[operationName] = !0;
            operations.push(operationName);
        } catch {}
    }
        debugLog("起動前GraphQL operation一覧 count=" + operations.length + " " + operations.slice(0, 40).join(" | "));
    };

    discoverWebpackGraphqlOperations = () => {
        let chunks = webpackChunk_twitter_responsive_web,
            seen = {},
            operations = [];
        const addOperation = (operationName, queryId) => {
            if (!operationName || !queryId || seen[operationName + ":" + queryId]) return;
            seen[operationName + ":" + queryId] = !0;
            operations.push(operationName + ":" + queryId);
        };
        const scanFunctionSource = (fn) => {
            const source = String(fn);
            const operationMatch = source.match(/operationName["']?\s*[:=]\s*["']([^"']+)["']/);
            const queryMatch = source.match(/queryId["']?\s*[:=]\s*["']([^"']+)["']/);
            if (operationMatch && queryMatch) addOperation(operationMatch[1], queryMatch[1]);
        };
        for (let i = chunks.length; i--;) {
            for (let key in chunks[i][1]) {
                try {
                    scanFunctionSource(chunks[i][1][key]);
                    if (chunks[i][1][key].length == 1) {
                        let module = {};
                        chunks[i][1][key](module);
                        addOperation(module.exports.operationName, module.exports.queryId);
                    }
                } catch {}
            }
        }
        const interesting = operations.filter((operation) => /Replies|UserTweets|SearchTimeline|TweetDetail|Profile|Timeline/i.test(operation));
        debugLog("webpack GraphQL要約 count=" + operations.length + " interesting=" + interesting.slice(0, 30).join(" | "));
    };

    getquery = (_) => {
        return getqueryCandidates(_)[0]
    };

	setxhr = (a) => {
	    let _ = (b, c) => a.setRequestHeader(b, c);
	    _('Authorization', 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA');
	    _('x-csrf-token', ct0);
    _('x-twitter-active-user', 'yes');
    _('x-twitter-auth-type', 'OAuth2Session');
    _('x-twitter-client-language', 'ja');
    _('content-type', 'application/json');
    a.withCredentials = !0
};

count = 0;
check = 0;
erase = (a) => {
    if (check < 0) return;
    if (0 <= check && check < 5) {
        if (!window.confirm("「" + a.legacy.full_text + "」を削除します")) {
            alert("条件の指定が間違えている、もしくは何らかのバグが起きている可能性があります\nもう一度お試しください");
            if (check == 0) log.innerText = "0件削除しました";
            document.getElementById('loading').remove();
            document.querySelector("#loglog .checkbox").innerText = "ページのリロードで閉じます";
            check = -1;
            return
        } else check++
    }
    if (check == 5) {
        alert("確認が終わりました\nこのアラートを閉じると一括削除を開始します\nXの画面は開いたままにしていてください");
        check++
    }
    let c = new XMLHttpRequest();
    c.open('POST', 'https://x.com/i/api/graphql/' + getquery('DeleteTweet')[0] + '/DeleteTweet');
    setxhr(c);
    c.onload = function() {
        count++;
        log.innerText = count + "件削除しました"
    };
    c.send(JSON.stringify({
        "variables": {
            "tweet_id": a.rest_id,
            "dark_request": !1
        }
    }))
};

createlist = () => {
    let a = new XMLHttpRequest(),
        b = getquery('CreateList');
    a.open('POST', 'https://x.com/i/api/graphql/' + b[0] + '/CreateList');
    setxhr(a);
    a.onreadystatechange = () => {
        if (a.readyState == 4 && a.status == 200) {
            let c = new XMLHttpRequest(),
                d = getquery('ListAddMember'),
                response = JSON.parse(a.responseText).data.list;
            listid = response.id_str;
            data3.variables.listId = listid;
            c.open('POST', 'https://x.com/i/api/graphql/' + d[0] + '/ListAddMember');
            setxhr(c);
            c.onreadystatechange = () => {
                if (c.readyState == 4 && c.status == 200) query(current.data);
            };
            c.send(JSON.stringify({
                "variables": {
                    "listId": listid,
                    "userId": response.user_results.result.rest_id
                },
                "features": d[1]
            }))
        }
    };
    a.send(JSON.stringify({
        "variables": {
            "isPrivate": true,
            "name": "delete_tool",
            "description": ""
        },
        "features": b[1]
    }))
}

	deletelist = () => {
	    let a = new XMLHttpRequest(),
	        b = getquery('DeleteList');
    a.open('POST', 'https://x.com/i/api/graphql/' + b[0] + '/DeleteList');
    setxhr(a);
    a.send(JSON.stringify({
        "variables": {
            "listId": data3.variables.listId
        },
        "queryId": b[0]
	    }))
	}

    queryVisibleDomFallback = (round = 0, emptyRounds = 0) => {
        const maxRounds = 30;
        const articles = Array.from(document.querySelectorAll('article[data-testid="tweet"], article'));
        const seen = {};
        const targets = [];
        let statusLinks = 0,
            otherUsers = 0,
            noDate = 0,
            alreadySeen = 0;
        for (let articleIndex = 0; articleIndex < articles.length; articleIndex++) {
            const article = articles[articleIndex];
            const links = Array.from(article.querySelectorAll('a[href*="/status/"]'));
            for (let linkIndex = 0; linkIndex < links.length; linkIndex++) {
                const href = links[linkIndex].getAttribute("href") || "";
                const match = href.match(/^\/([^/?#]+)\/status\/(\d+)/);
                if (!match) continue;
                statusLinks++;
                const screenName = match[1];
                const tweetId = match[2];
                if (screenName.toLowerCase() != String(username).toLowerCase()) {
                    otherUsers++;
                    continue;
                }
                if (seen[tweetId]) continue;
                if (visibleDomFallbackSeen[tweetId]) {
                    alreadySeen++;
                    continue;
                }
                const time = article.querySelector("time[datetime]");
                const date = time ? new Date(time.getAttribute("datetime")) : null;
                if (!date || Number.isNaN(date.getTime())) {
                    noDate++;
                    continue;
                }
                const textNode = article.querySelector('[data-testid="tweetText"]');
                const text = (textNode && textNode.innerText || article.innerText || "").trim();
                const hasMedia = !!article.querySelector('[data-testid="tweetPhoto"], [data-testid="videoPlayer"], img[src*="twimg.com/media"]');
                seen[tweetId] = !0;
                visibleDomFallbackSeen[tweetId] = !0;
                targets.push({
                    legacy: {
                        full_text: text,
                        created_at: date.toUTCString(),
                        quote_count: 0,
                        retweet_count: 0,
                        favorite_count: 0,
                        entities: hasMedia ? { media: [{}] } : {}
                    },
                    rest_id: tweetId,
                    _domDate: date,
                    _domText: text
                });
            }
        }
        const samples = targets.slice(0, 5).map((target) => target.rest_id + " text=" + target._domText.slice(0, 50).replace(/\s+/g, " "));
        debugLog("DOM fallback収集 round=" + round + " articles=" + articles.length + " statusLinks=" + statusLinks + " ownNew=" + targets.length + " seen=" + alreadySeen + " otherUsers=" + otherUsers + " noDate=" + noDate + " sample=" + samples.join(" || "));
        let scheduled = 0;
        for (let index = 0; index < targets.length; index++) {
            const target = targets[index];
            if (judge(target._domDate, target.legacy.full_text, 0, 0, "media" in target.legacy.entities)) {
                erase(target);
                scheduled++;
            }
        }
        debugLog("DOM fallback削除候補 round=" + round + " scheduled=" + scheduled);
        if (round >= maxRounds) {
            debugLog("DOM fallback最大ラウンド到達 maxRounds=" + maxRounds);
            return !1;
        }
        const nextEmptyRounds = scheduled ? 0 : emptyRounds + 1;
        const beforeY = window.scrollY;
        const beforeHeight = document.documentElement.scrollHeight;
        const scrollAmount = Math.max(Math.floor(window.innerHeight * 0.9), 600);
        window.scrollBy(0, scrollAmount);
        setTimeout(() => {
            const moved = Math.abs(window.scrollY - beforeY) > 10;
            const heightChanged = document.documentElement.scrollHeight != beforeHeight;
            debugLog("DOM fallbackスクロール round=" + round + " moved=" + moved + " heightChanged=" + heightChanged + " y=" + Math.floor(window.scrollY) + " emptyRounds=" + nextEmptyRounds);
            if (!moved && !heightChanged && nextEmptyRounds >= 2) {
                end();
                return;
            }
            if (nextEmptyRounds >= 4) {
                debugLog("DOM fallback空ラウンド上限のため終了");
                end();
                return;
            }
            queryVisibleDomFallback(round + 1, nextEmptyRounds);
        }, scheduled ? 2200 : 1200);
        return !0;
    };

	skip = !0;
	end = (a) => {
	    debugLog("end呼び出し current=" + current.id + " number=" + current.number + " reset=" + (a || "none") + " count=" + count + " check=" + check);
    skip = !0;
    if (current.number == 2) {
        debugLog("一時リスト削除を実行");
        deletelist();
    }
    if (current.number < 4) {
        const previous = current.id;
        current = queryIds[current.number + 1];
        debugLog("次の取得方法へ移行 from=" + previous + " to=" + current.id + " reset=" + (a || "none"));
        if (current.number == 1) {
            if (uselist && RP <= 0) createlist();
            else {
                current = queryIds[3];
                debugLog("リスト未使用のためUserTweetsへスキップ");
                query(current.data)
            }
        }
        else query(current.data);
        return
    }
	    else if (a) {
	        debugLog("API制限として停止 resetAt=" + new Date(a).toLocaleString() + " count=" + count);
	        b = "API制限です。\n" + new Date(a).toLocaleTimeString() + "に解除されますので、それ以降に再度お試し下さい";
	        if (count == 0) alert(b + "。\nまた削除件数が0の場合、当ツールが削除可能な期間より前の期間が指定されている可能性があります");
	        else alert(b);
	    } else {
            if (!visibleDomFallbackTried) {
                visibleDomFallbackTried = !0;
                debugLog("API取得完了後にDOM fallbackを試行");
                if (queryVisibleDomFallback()) return;
            }
	        debugLog("完了判定 count=" + count);
	        alert("完了しました。\n全て削除できていない場合、再度の実行で削除されることがあります")
	    }
    document.getElementById('loading').remove();
    document.querySelector("#loglog .checkbox").innerText = "ページのリロードで閉じます";
    if (log.innerText.includes("検")) log.innerText = "0件削除しました";
};

bi = (a) => {
    return BigInt(a)
};
    cursor = (h) => {
        let _ = (bi(duration[1]) + bi(1000)) * bi(67108863) + bi("503803561041329172778"),
            a = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'],
            b = "",
            c = current.number == 0 ? 26 : 22;
    while (_ > bi(0)) {
        b = a[_ % bi(64)] + b;
        _ = _ / bi(64);
    }
        return h.slice(0, c) + b.slice(0, 11) + h.slice(c + 11)
    };

    querySearchFallback = (data) => {
        const searchQueries = [
            data.variables.rawQuery,
            data.variables.rawQuery + " filter:replies"
        ];
        const searchIndex = data._legacySearchIndex || 0;
        const rawQuery = searchQueries[searchIndex];
        let xhr = new XMLHttpRequest(),
            params = new URLSearchParams({
                q: rawQuery,
                count: String(data.variables.count || 20),
                tweet_search_mode: "live",
                query_source: data.variables.querySource || "typed_query"
            });
        if (data.variables.cursor) params.set("cursor", data.variables.cursor);
        const endpoint = "https://x.com/i/api/2/search/adaptive.json?" + params.toString();
        debugLog("legacy検索送信 queryIndex=" + (searchIndex + 1) + "/" + searchQueries.length + " query=" + rawQuery + " cursor=" + (data.variables.cursor || "none"));
        xhr.open("GET", endpoint);
        setxhr(xhr);
        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                const resetHeader = xhr.getResponseHeader("X-Rate-Limit-Reset");
                const resetAt = resetHeader ? Number(resetHeader) * 1000 : 0;
                debugLog("legacy検索失敗 status=" + xhr.status + " resetAt=" + (resetAt ? new Date(resetAt).toLocaleString() : "none"));
                debugLog("legacy検索response=" + (xhr.responseText || "").slice(0, 500));
                if (xhr.status == 429) end(resetAt);
                else end();
                return;
            }
            let response;
            try {
                response = JSON.parse(xhr.responseText);
            } catch (error) {
                debugLog("legacy検索JSON解析失敗 message=" + error.message + " status=" + xhr.status + " length=" + (xhr.responseText || "").length + " type=" + (xhr.getResponseHeader("content-type") || "none"));
                debugLog("legacy検索responseHead=" + (xhr.responseText || "").slice(0, 300));
                if (searchIndex + 1 < searchQueries.length && !data.variables.cursor) {
                    let copy = JSON.parse(JSON.stringify(data));
                    copy._legacySearchIndex = searchIndex + 1;
                    debugLog("legacy検索JSON解析失敗のため次の検索式へ切り替え nextQuery=" + searchQueries[searchIndex + 1]);
                    querySearchFallback(copy);
                    return;
                }
                end();
                return;
            }
            const tweets = response.globalObjects && response.globalObjects.tweets || {};
            const values = Object.keys(tweets).map((id) => tweets[id]).filter(Boolean);
            const cursors = [];
            const timelineInstructions = response.timeline && response.timeline.instructions || [];
            const timelineEntries = [];
            const collectEntryIds = (node, depth = 0) => {
                if (!node || depth > 12 || timelineEntries.length >= 12) return;
                if (Array.isArray(node)) {
                    for (let index = 0; index < node.length; index++) collectEntryIds(node[index], depth + 1);
                    return;
                }
                if (typeof node != "object") return;
                if (node.entryId) timelineEntries.push(node.entryId);
                for (const key in node) collectEntryIds(node[key], depth + 1);
            };
            const collectCursors = (node, depth = 0) => {
                if (!node || depth > 20) return;
                if (Array.isArray(node)) {
                    for (let index = 0; index < node.length; index++) collectCursors(node[index], depth + 1);
                    return;
                }
                if (typeof node != "object") return;
                if ((node.cursorType == "Bottom" || node.cursorType == "ShowMore") && node.value) cursors.push(node.value);
                if (node.cursor && (node.cursor.cursorType == "Bottom" || node.cursor.cursorType == "ShowMore") && node.cursor.value) cursors.push(node.cursor.value);
                for (const key in node) collectCursors(node[key], depth + 1);
            };
            collectEntryIds(response.timeline);
            collectCursors(response.timeline);
            let matchedTweets = 0,
                checkedTweets = 0,
                replyTweets = 0,
                otherUserTweets = 0,
                remain = !1,
                samples = [];
            values.sort((left, right) => {
                try {
                    return Number(BigInt(right.id_str || right.id || 0) - BigInt(left.id_str || left.id || 0));
                } catch {
                    return 0;
                }
            });
            for (let index = 0; index < values.length; index++) {
                const tw = values[index];
                if (!tw) continue;
                if (tw.in_reply_to_status_id_str || tw.in_reply_to_screen_name) replyTweets++;
                if (tw.user_id_str != data2.variables.userId) {
                    otherUserTweets++;
                    continue;
                }
                matchedTweets++;
                if (samples.length < 3) {
                    samples.push((tw.id_str || tw.id || "no-id") + " replyTo=" + (tw.in_reply_to_screen_name || "none") + " text=" + String(tw.full_text || tw.text || "").slice(0, 60).replace(/\s+/g, " "));
                }
                const date = new Date(tw.created_at);
                if (judge(date, tw.full_text || tw.text || "", (tw.quote_count || 0) + (tw.retweet_count || 0), tw.favorite_count || 0, !!(tw.entities && tw.entities.media))) {
                    erase({ legacy: tw, rest_id: tw.id_str || tw.id });
                }
                checkedTweets++;
                if (date < duration[0]) remain = !0;
            }
            debugLog("legacy検索概要 queryIndex=" + (searchIndex + 1) + " responseKeys=" + Object.keys(response).join(",") + " instructions=" + timelineInstructions.length + " entriesSample=" + timelineEntries.join(" | "));
            debugLog("legacy検索成功 tweets=" + values.length + " matched=" + matchedTweets + " otherUsers=" + otherUserTweets + " replies=" + replyTweets + " checked=" + checkedTweets + " cursors=" + cursors.length);
            if (samples.length) debugLog("legacy検索sample " + samples.join(" || "));
            if (cursors.length && !(remain && checkedTweets > 0)) {
                let copy = JSON.parse(JSON.stringify(data));
                copy._legacySearchIndex = searchIndex;
                copy.variables.cursor = cursors[cursors.length - 1];
                const cursorKey = current.id + ":legacy:" + copy.variables.cursor;
                if (!seenCursors[cursorKey]) {
                    seenCursors[cursorKey] = !0;
                    debugLog("legacy検索次ページ cursor=" + copy.variables.cursor.slice(0, 24));
                    querySearchFallback(copy);
                    return;
                }
                debugLog("legacy検索cursor重複のため終了");
            }
            if (!matchedTweets && searchIndex + 1 < searchQueries.length && !data.variables.cursor) {
                let copy = JSON.parse(JSON.stringify(data));
                copy._legacySearchIndex = searchIndex + 1;
                delete copy.variables.cursor;
                debugLog("legacy検索matched=0のため次の検索式へ切り替え nextQuery=" + searchQueries[searchIndex + 1]);
                querySearchFallback(copy);
                return;
            }
            end();
        };
        xhr.send();
    };

		query = (data, queryIndex = 0) => {
		    let a = new XMLHttpRequest(),
	            operationNames = current.aliases || [current.id],
	            candidates = getLiveGraphqlCandidates(operationNames);
        for (let index = 0; index < operationNames.length; index++) {
            candidates = candidates.concat(getqueryCandidates(operationNames[index]));
        }
	    let b = candidates[queryIndex],
            operationName = b && b[2] || current.id;
		    if (!b) {
		        debugLog("query情報取得失敗 operation=" + current.id + " candidates=" + candidates.length);
                if (current.number == 0) {
                    debugLog("SearchTimeline候補なしのためlegacy検索へ切り替え");
                    querySearchFallback(data);
                    return;
                }
		        alert("Xの内部API情報を取得できませんでした。ページを再読み込みしてから再実行してください。");
		        return;
		    }
        if (b[3] && !data.variables.cursor) {
            data.variables = Object.assign({}, b[3], {
                userId: data2.variables.userId,
                count: data.variables.count || b[3].count || 20
            });
            debugLog("performance variablesを採用 operation=" + current.id + " keys=" + Object.keys(data.variables).join(","));
        }
	    data.features = b[1];
        if (operationName.includes("UserTweets")) {
            data.features = Object.assign({}, userTimelineFeatureOverrides, data.features);
        }
	    let prop = "?" + Object.entries(data).map((c) => {
	            return `${c[0].replaceAll("%22","")}=${encodeURIComponent(JSON.stringify(c[1]))}`
	        }).join("&");
	    let endpoint = 'https://x.com/i/api/graphql/' + b[0] + '/' + operationName + prop;
	    debugLog("query送信 operation=" + current.id + " actual=" + operationName + " queryId=" + b[0] + " candidate=" + (queryIndex + 1) + "/" + candidates.length + " ct0=" + (ct0 ? "yes" : "no"));
        if (current.entry) debugLog("variables operation=" + current.id + " keys=" + Object.keys(data.variables).join(",") + " features=" + Object.keys(data.features || {}).length + " fieldToggles=" + Object.keys(data.fieldToggles || {}).join(",") + " cursor=" + (data.variables.cursor || "none"));
	    a.open('GET', endpoint);
	    setxhr(a);
	    a.onreadystatechange = () => {
	        if (a.readyState == 4) {
	            if (a.status == 200) {
                let remain = !0, foundBottomCursor = !1, matchedTweets = 0, checkedTweets = 0, unhandledEntries = 0, tweets, tweet, entries = JSON.parse(a.responseText).data;
                try {
                    if (current.entry) {
                        const userResult = entries.user && entries.user.result;
                        const timeline = userResult && (userResult.timeline_v2 || userResult.timeline);
                        entries = timeline.timeline.instructions;
                    } else if (current.number == 0) {
                        entries = entries.search_by_raw_query.search_timeline.timeline.instructions;
                    } else {
                        entries = entries.list.tweets_timeline.timeline.instructions;
                    }
                } catch (error) {
                    debugLog("timeline解析失敗 operation=" + current.id + " message=" + error.message);
                    debugLog("responseKeys=" + Object.keys(entries || {}).join(","));
                    end();
                    return;
                }
                const getTweetItems = (entry) => {
                    const content = entry.content || {};
                    if (Array.isArray(content.items)) return content.items;
                    if (content.itemContent) return [{ item: content }];
                    if (content.content && content.content.itemContent) return [{ item: content.content }];
                    return null;
                };
                const getTweetResult = (tweetItem) => {
                    const item = tweetItem.item || tweetItem;
                    const itemContent = item.itemContent || (item.content && item.content.itemContent);
                    let result = itemContent && itemContent.tweet_results && itemContent.tweet_results.result;
                    if (result && result.tweet) result = result.tweet;
                    return { result, item };
                };
                const collectTimelineObjects = (node, result, depth = 0) => {
                    if (!node || depth > 32) return result;
                    if (Array.isArray(node)) {
                        for (let index = 0; index < node.length; index++) collectTimelineObjects(node[index], result, depth + 1);
                        return result;
                    }
                    if (typeof node !== "object") return result;
                    if (node.cursorType === "Bottom" && node.value) result.cursors.push(node.value);
                    if (node.tweet_results && node.tweet_results.result) result.tweets.push({
                        result: node.tweet_results.result,
                        item: {}
                    });
                    for (const key in node) collectTimelineObjects(node[key], result, depth + 1);
                    return result;
                };
                const continueWithCursor = (cursorValue, fallbackReason) => {
                    let copy = JSON.parse(JSON.stringify(current.data));
                    copy.variables.cursor = cursorValue;
                    if (!current.entry && skip && duration[1] < 10e13) {
                        copy.variables.cursor = cursor(copy.variables.cursor);
                        skip = !1
                    }
                    const cursorKey = current.id + ":" + copy.variables.cursor;
                    if (seenCursors[cursorKey]) {
                        debugLog("cursor重複のため終了 operation=" + current.id + " reason=" + fallbackReason + " cursor=" + copy.variables.cursor.slice(0, 24));
                        end();
                        return;
                    }
                    seenCursors[cursorKey] = !0;
                    debugLog("次ページへ operation=" + current.id + " reason=" + fallbackReason + " nextCursor=" + copy.variables.cursor.slice(0, 24));
                    query(copy);
                };
                debugLog("query成功 operation=" + current.id + " instructions=" + entries.length + " cursor=" + (data.variables.cursor || "none"));
                debugLog("instructions概要 operation=" + current.id + " " + entries.slice(0, 5).map((entry) => [entry.type || "no-type", Object.keys(entry).join("/")].join(":")).join(" | "));
                entries.slice(0, 5).forEach((entry, index) => {
                    const timelineEntries = entry.entries || (entry.entry ? [entry.entry] : []);
                    debugLog("instruction詳細 operation=" + current.id + " index=" + index + " type=" + (entry.type || "none") + " entries=" + timelineEntries.length + " sample=" + timelineEntries.slice(0, 5).map((item) => (item.entryId || "no-id") + ":" + (item.content && item.content.entryType || "no-entry-type")).join(","));
                });
                loop: for (let j = 0; j < entries.length; j++) {
                    if ("entries" in entries[j]) tweets = entries[j].entries;
                    else if ("entry" in entries[j]) tweets = [entries[j].entry];
                    else continue;
                    try {
                        for (let i = 0; i < tweets.length; i++) {
                            try {
                                    const entryId = tweets[i].entryId || "";
                                    const content = tweets[i].content || {};
                                    const cursorValue = content.value || (content.cursor && content.cursor.value);
                                    const isBottomCursor = entryId.includes("bottom") || content.cursorType === "Bottom";
	                                if (!entryId.includes("promoted") && !(entryId.includes("cursor") || content.entryType === "TimelineTimelineCursor")) {
	                                    tweet = getTweetItems(tweets[i]);
	                                    if (!tweet) {
                                            if (unhandledEntries < 5) debugLog("未処理entry operation=" + current.id + " entryId=" + entryId + " entryType=" + (content.entryType || "none"));
                                            unhandledEntries++;
                                            continue;
                                        }
	                                    for (let k = 0; k < tweet.length; k++) {
                                            let parsed = getTweetResult(tweet[k]),
                                                tw = parsed.result,
                                                item = parsed.item;
                                            if (!tw || !tw.legacy) continue;
                                            const tweetUserId = tw.legacy.user_id_str || (tw.core && tw.core.user_results && tw.core.user_results.result && tw.core.user_results.result.rest_id);
	                                        if (tweetUserId == data2.variables.userId) {
	                                            matchedTweets++;
	                                            let date = new Date(tw.legacy.created_at);
	                                            if (judge(date, tw.legacy.full_text, tw.legacy.quote_count + tw.legacy.retweet_count, tw.legacy.favorite_count, "media" in tw.legacy.entities)) erase(tw);
	                                            checkedTweets++;
	                                            if (current.entry) {
                                                    const component = item.clientEventInfo && item.clientEventInfo.component || "";
	                                                if (!component.includes("pin")) remain = !1;
	                                                if (k == tweet.length - 1 && date < duration[0]) remain = !0
	                                            } else {
	                                                if (date <= duration[1]) skip = !1;
                                                remain = (date < duration[0]) ? !0 : !1
                                            }
                                        }
                                    }
		                                } else if (isBottomCursor && cursorValue) {
		                                    if (check < 0) break loop;
                                        foundBottomCursor = !0;
		                                    let copy = JSON.parse(JSON.stringify(current.data));
		                                    copy.variables.cursor = cursorValue;
	                                    if (!current.entry && skip && duration[1] < 10e13) {
	                                        copy.variables.cursor = cursor(copy.variables.cursor);
	                                        skip = !1
	                                    }
                                            const cursorKey = current.id + ":" + copy.variables.cursor;
                                            if (seenCursors[cursorKey]) {
                                                debugLog("cursor重複のため終了 operation=" + current.id + " matched=" + matchedTweets + " checked=" + checkedTweets + " cursor=" + copy.variables.cursor.slice(0, 24));
                                                end();
                                                break loop;
                                            }
                                            seenCursors[cursorKey] = !0;
		                                    if ((remain && checkedTweets > 0) || (current.number == 0 && RT > 0)) {
                                            debugLog("ページ終了 operation=" + current.id + " remain=" + remain + " matched=" + matchedTweets + " checked=" + checkedTweets + " nextCursor=" + copy.variables.cursor.slice(0, 24));
		                                        if (current.number == 1 && "cursor" in data.variables) data3.variables.cursor = data.variables.cursor;
		                                        end()
		                                    }
		                                    else {
                                            if (remain && checkedTweets == 0) debugLog("空ページのため継続 operation=" + current.id + " nextCursor=" + copy.variables.cursor.slice(0, 24));
                                            else debugLog("次ページへ operation=" + current.id + " matched=" + matchedTweets + " checked=" + checkedTweets + " nextCursor=" + copy.variables.cursor.slice(0, 24));
	                                            query(copy);
	                                        }
	                                    break loop
	                                }
	                            } catch {}
	                        }
	                    } catch {}
	                }
	                if (!foundBottomCursor) {
                        const collected = collectTimelineObjects(entries, { tweets: [], cursors: [] });
                        const collectedSamples = collected.tweets.slice(0, 5).map((tweet) => {
                            let tw = tweet.result;
                            if (tw && tw.tweet) tw = tw.tweet;
                            const legacy = tw && tw.legacy || {};
                            const userId = legacy.user_id_str || (tw && tw.core && tw.core.user_results && tw.core.user_results.result && tw.core.user_results.result.rest_id) || "none";
                            return "user=" + userId + " replyTo=" + (legacy.in_reply_to_screen_name || "none") + " text=" + String(legacy.full_text || "").slice(0, 40).replace(/\s+/g, " ");
                        });
                        debugLog("fallback収集 operation=" + current.id + " tweets=" + collected.tweets.length + " cursors=" + collected.cursors.length + " matched=" + matchedTweets + " checked=" + checkedTweets + " sample=" + collectedSamples.join(" || "));
                        if (checkedTweets == 0 && collected.tweets.length) {
                            for (let index = 0; index < collected.tweets.length; index++) {
                                let tw = collected.tweets[index].result;
                                if (tw && tw.tweet) tw = tw.tweet;
                                if (!tw || !tw.legacy) continue;
                                const tweetUserId = tw.legacy.user_id_str || (tw.core && tw.core.user_results && tw.core.user_results.result && tw.core.user_results.result.rest_id);
                                if (tweetUserId == data2.variables.userId) {
                                    matchedTweets++;
                                    const date = new Date(tw.legacy.created_at);
                                    if (judge(date, tw.legacy.full_text, tw.legacy.quote_count + tw.legacy.retweet_count, tw.legacy.favorite_count, "media" in tw.legacy.entities)) erase(tw);
                                    checkedTweets++;
                                    if (date < duration[0]) remain = !0;
                                    else remain = !1;
                                }
                            }
                        }
                        if (collected.cursors.length && !((remain && checkedTweets > 0) || (current.number == 0 && RT > 0))) {
                            debugLog("fallback cursorで継続 operation=" + current.id + " matched=" + matchedTweets + " checked=" + checkedTweets);
                            continueWithCursor(collected.cursors[collected.cursors.length - 1], "fallback");
                            return;
                        }
	                    debugLog("bottom cursorなし operation=" + current.id + " matched=" + matchedTweets + " checked=" + checkedTweets + " remain=" + remain);
	                    end();
	                }
	            } else {
	                const resetHeader = a.getResponseHeader("X-Rate-Limit-Reset");
	                const remainingHeader = a.getResponseHeader("X-Rate-Limit-Remaining");
	                const limitHeader = a.getResponseHeader("X-Rate-Limit-Limit");
	                const resetAt = resetHeader ? Number(resetHeader) * 1000 : 0;
	                debugLog("query失敗 status=" + a.status + " operation=" + current.id + " actual=" + operationName + " queryId=" + b[0]);
	                debugLog("rateLimit limit=" + (limitHeader || "none") + " remaining=" + (remainingHeader || "none") + " reset=" + (resetHeader || "none") + " resetAt=" + (resetAt ? new Date(resetAt).toLocaleString() : "none"));
	                debugLog("response=" + (a.responseText || "").slice(0, 500));
	                if (a.status == 404 && queryIndex + 1 < candidates.length) {
	                    debugLog("次のqueryId候補を試行 operation=" + current.id);
	                    query(data, queryIndex + 1);
	                    return;
	                }
		                if (a.status == 404) {
                            if (current.number == 0) {
                                debugLog("SearchTimeline 404のためlegacy検索へ切り替え");
                                querySearchFallback(data);
                                return;
                            }
		                    debugLog("404候補切れ。API制限扱いにせず次の取得方法へ進みます operation=" + current.id);
		                    end();
		                    return;
	                }
		                if (a.status == 401) {
		                    alert("X API が 401 を返しました。ログイン状態、ct0 cookie、Bearer token のいずれかが拒否されています。ページを再読み込みしてから再実行してください。");
		                    check = -1;
	                    log.innerText = "401で停止しました";
	                    const loading = document.getElementById("loading");
	                    if (loading) loading.remove();
			                    document.querySelector("#loglog .checkbox").innerText = "ページのリロードで閉じます";
			                    return;
			                }
		                if (a.status == 429) {
		                    debugLog("429のためAPI制限扱い resetAt=" + (resetAt ? new Date(resetAt).toLocaleString() : "unknown"));
		                    end(resetAt);
		                    return;
		                }
		                debugLog("API制限扱いにせず次の取得方法へ進みます status=" + a.status);
		                end();
		            }
	        }
    };
    a.send()
};
