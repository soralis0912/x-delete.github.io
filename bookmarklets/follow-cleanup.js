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

  document.cookie.split("; ").forEach(a => {
      let b = a.split('=');
      if (b[0] == "ct0") window.ct0 = b[1]
  });
  let b = readInitialState(),
      c = b.entities.users.entities[Object.keys(b.entities.users.entities)[0]];
  username = c.screen_name;
  data1 = {
      variables: {
          userId: c.id_str,
          count: 20,
          includePromotedContent: false
      },
      features: {}
  };
  FS = b.featureSwitch.defaultConfig;

  let styleTag = document.createElement('style');
  styleTag.innerHTML = `
  .dialog {
    width: 26em;
    max-width: 95%;
    max-height: 54%;
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
        <p>FF一括削除ツール</p>
      </div>
      <div class="body">
      </div>
      <div class="footer">
        <p><button class="button add">条件追加</button></p>
        <p><button class="button ok">ﾌｫﾛﾜｰﾌﾞﾛｯｸ</button>
        <button class="button ok">ﾌｫﾛﾜｰﾌﾞﾛ解</button></p><br>
        <p><button class="button cancel">キャンセル</button>
        <button class="button ok">ﾌｫﾛｰ解除(ﾘﾑ)</button></p>
      </div>
    </div>
  </dialog>

  <dialog id="loglog" class="dialog">
    <div class="inner">
      <div class="header">
        <p>FF一括削除ツール</p>
      </div>
      <div class="body">
        <p><span id="log">＜検索中＞</span>
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
        <p><button class="button ok">名前</button>
        <button class="button ok">bio</button></p>
        <p><button class="button ok">フォロワー</button>
        <button class="button ok">フォロー</button></p>
        <p><button class="button ok">フォロー数</button>
        <button class="button ok">フォロワー数</button></p>
        <p><button class="button ok">ツイート数</button>
        <button class="button ok">いいね数</button></p>
        <p><button class="button cancel">キャンセル</button></p>
      </div>
    </div>
  </dialog>

  <dialog id="name" class="dialog">
    <div class="inner">
      <div class="body">
        <p>名前に<input type="text" size="10">を<select><option value="true">含む</option><option value="false">含まない</option></select>垢</p>
        <p><button class="button cancel">キャンセル</button>
        <button class="button ok">追加</button></p>
      </div>
    </div>
  </dialog>

  <dialog id="bio" class="dialog">
    <div class="inner">
      <div class="body">
        <p>bioに<input type="text" size="10">を<select><option value="true">含む</option><option value="false">含まない</option></select>垢</p>
        <p><button class="button cancel">キャンセル</button>
        <button class="button ok">追加</button></p>
      </div>
    </div>
  </dialog>

  <dialog id="isfollowed" class="dialog">
    <div class="inner">
      <div class="body">
        <p>自分をフォローして<select><option value="true">いる</option><option value="false">いない</option></select>垢</p>
        <p><button class="button cancel">キャンセル</button>
        <button class="button ok">追加</button></p>
      </div>
    </div>
  </dialog>
  </div>

  <dialog id="isfollow" class="dialog">
    <div class="inner">
      <div class="body">
        <p>自分がフォローして<select><option value="true">いる</option><option value="false">いない</option></select>垢</p>
        <p><button class="button cancel">キャンセル</button>
        <button class="button ok">追加</button></p>
      </div>
    </div>
  </dialog>
  </div>

  <dialog id="follow" class="dialog">
    <div class="inner">
      <div class="body">
        <p>ﾌｫﾛｰしている数が<input type="number" class="number"><select><option value="true">以上</option><option value="false">以下</option></select>の垢</p>
        <p><button class="button cancel">キャンセル</button>
        <button class="button ok">追加</button></p>
      </div>
    </div>
  </dialog>
  </div>

  <dialog id="follower" class="dialog">
    <div class="inner">
      <div class="body">
        <p>フォロワー数が<input type="number" class="number"><select><option value="true">以上</option><option value="false">以下</option></select>の垢</p>
        <p><button class="button cancel">キャンセル</button>
        <button class="button ok">追加</button></p>
      </div>
    </div>
  </dialog>

  <dialog id="tweets" class="dialog">
    <div class="inner">
      <div class="body">
        <p>ツイート数が<input type="number" class="number"><select><option value="true">以上</option><option value="false">以下</option></select>の垢</p>
        <p><button class="button cancel">キャンセル</button>
        <button class="button ok">追加</button></p>
      </div>
    </div>
  </dialog>

  <dialog id="like" class="dialog">
    <div class="inner">
      <div class="body">
        <p>いいね数が<input type="number" class="number"><select><option value="true">以上</option><option value="false">以下</option></select>の垢</p>
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

  window.judge = function(entry) {
      for (let i = 0; i < functions.length; i++) {
          if (!functions[i](entry.content.itemContent.user_results.result.legacy)) return false;
      }
      return true;
  }

  document.querySelectorAll('#dialogFade .button.ok')[0].addEventListener('click', () => {
      let msg = functions.length == 0 ? "全ての" : 'これらの条件を全て満たす';
      if (window.confirm(msg + '\n@' + username + ' のフォロワーをブロックします\n開発者は一切の責任を負いかねます\n開始してよろしいですか？')) {
          document.getElementById('dialogFade').remove();
          showdialog("loglog");
          alert("確認のため、ブロックする垢最初の3件が表示されます");
          query(0, data1);
      }
  });

  document.querySelectorAll('#dialogFade .button.ok')[1].addEventListener('click', () => {
    let msg = functions.length == 0 ? "全ての" : 'これらの条件を全て満たす';
    if (window.confirm(msg + '\n@' + username + ' のフォロワーをブロックしたのち解除します\n開発者は一切の責任を負いかねます\n開始してよろしいですか？')) {
        document.getElementById('dialogFade').remove();
        showdialog("loglog");
        alert("確認のため、ブロ解する垢最初の3件が表示されます");
        query(1, data1);
    }
  });

  document.querySelectorAll('#dialogFade .button.ok')[2].addEventListener('click', () => {
      let msg = functions.length == 0 ? "全ての" : 'これらの条件を全て満たす';
      if (window.confirm(msg + '\n@' + username + ' のフォローを解除します\n開発者は一切の責任を負いかねます\n開始してよろしいですか？')) {
          document.getElementById('dialogFade').remove();
          showdialog("loglog");
          alert("確認のため、フォロー解除する垢最初の3件が表示されます");
          query(2, data1);
      }
  });


  document.querySelector('#dialogFade .button.add').addEventListener('click', () => {
      showdialog("dialogFade2")
  });
  let showlist = document.querySelectorAll('#dialogFade2 .button.ok'),
      showlist2 = ["name", "bio", "isfollowed", "isfollow", "follow", "follower", "tweets", "like"];
  for (let i = 0; i < showlist.length; i++) {
      showlist[i].addEventListener('click', () => {
          showdialog(showlist2[i])
      })
  }

  function showdialog(name) {
      document.querySelector('#' + name).showModal();
  }

  let removelist = ["dialogFade", "dialogFade2", "name", "bio", "isfollowed", "isfollow", "follow", "follower", "tweets", "like"];
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

  document.querySelector('#name .button.ok').addEventListener('click', () => {
    let val = document.querySelector('#name input').value;
    if (val === "") {
        alert("文字列が空白です");
        return
    }
    remove("name");
    remove("dialogFade2");
    let flag = document.querySelector('#name select').value == "true";
    let func = function(legacy) {
        if (legacy.name.includes(val)) return flag;
        return !flag;
    }
    functions.push(func);
    let tag = document.createElement("p"),
        word = flag ? "を含む" : "を含まない";
    tag.innerHTML = "名前に「" + val + "」" + word + "垢" + trashsvg;
    funclist.appendChild(tag);
    tag.lastElementChild.addEventListener('click', () => {
        removefunc(tag)
    })
  });

  document.querySelector('#bio .button.ok').addEventListener('click', () => {
    let val = document.querySelector('#bio input').value;
    if (val === "") {
        alert("文字列が空白です");
        return
    }
    remove("bio");
    remove("dialogFade2");
    let flag = document.querySelector('#bio select').value == "true";
    let func = function(legacy) {
        if (legacy.description.includes(val)) return flag;
        return !flag;
    }
    functions.push(func);
    let tag = document.createElement("p"),
        word = flag ? "を含む" : "を含まない";
    tag.innerHTML = "bioに「" + val + "」" + word + "垢" + trashsvg;
    funclist.appendChild(tag);
    tag.lastElementChild.addEventListener('click', () => {
        removefunc(tag)
    })
  });

  document.querySelector('#isfollowed .button.ok').addEventListener('click', () => {
    remove("isfollowed");
    remove("dialogFade2");
    let flag = document.querySelector('#isfollowed select').value == "true";
    let func = function(legacy) {
        if ("followed_by" in legacy) {
          if (legacy.followed_by) return flag;
        }
        return !flag;
    }
    functions.push(func);
    let tag = document.createElement("p"),
        word = flag ? "いる" : "いない";
    tag.innerHTML = "自分をフォローして" + word + "垢" + trashsvg;
    funclist.appendChild(tag);
    tag.lastElementChild.addEventListener('click', () => {
        removefunc(tag);
    })
  });

  document.querySelector('#isfollow .button.ok').addEventListener('click', () => {
    remove("isfollow");
    remove("dialogFade2");
    let flag = document.querySelector('#isfollow select').value == "true";
    let func = function(legacy) {
        if ("following" in legacy) {
          if (legacy.following) return flag;
        }
        return !flag;
    }
    functions.push(func);
    let tag = document.createElement("p"),
        word = flag ? "いる" : "いない";
    tag.innerHTML = "自分がフォローして" + word + "垢" + trashsvg;
    funclist.appendChild(tag);
    tag.lastElementChild.addEventListener('click', () => {
        removefunc(tag);
    })
  });

  document.querySelector('#follow .button.ok').addEventListener('click', () => {
    let val = Number(document.querySelector('#follow input').value);
    if (val === "" || !Number.isInteger(val) || val < 0) {
        alert("0以上の半角整数を入力してください");
        return
    }
    remove("follow");
    remove("dialogFade2");
    let flag = document.querySelector('#follow select').value == "true";
    let func = function(legacy) {
        if (legacy.friends_count >= val && flag) return true;
        if (legacy.friends_count <= val && !flag) return true;
        return false;
    }
    functions.push(func);
    let tag = document.createElement("p"),
        word = flag ? "以上" : "以下";
    tag.innerHTML = "ﾌｫﾛｰしている数が" + val + word + "の垢" + trashsvg;
    funclist.appendChild(tag);
    tag.lastElementChild.addEventListener('click', () => {
        removefunc(tag)
    })
  });

  document.querySelector('#follower .button.ok').addEventListener('click', () => {
    let val = Number(document.querySelector('#follower input').value);
    if (val === "" || !Number.isInteger(val) || val < 0) {
        alert("0以上の半角整数を入力してください");
        return
    }
    remove("follower");
    remove("dialogFade2");
    let flag = document.querySelector('#follower select').value == "true";
    let func = function(legacy) {
        if (legacy.followers_count >= val && flag) return true;
        if (legacy.followers_count <= val && !flag) return true;
        return false;
    }
    functions.push(func);
    let tag = document.createElement("p"),
        word = flag ? "以上" : "以下";
    tag.innerHTML = "フォロワー数が" + val + word + "の垢" + trashsvg;
    funclist.appendChild(tag);
    tag.lastElementChild.addEventListener('click', () => {
        removefunc(tag)
    })
  });

  document.querySelector('#tweets .button.ok').addEventListener('click', () => {
    let val = Number(document.querySelector('#tweets input').value);
    if (val === "" || !Number.isInteger(val) || val < 0) {
        alert("0以上の半角整数を入力してください");
        return
    }
    remove("tweets");
    remove("dialogFade2");
    let flag = document.querySelector('#tweets select').value == "true";
    let func = function(legacy) {
        if (legacy.statuses_count >= val && flag) return true;
        if (legacy.statuses_count <= val && !flag) return true;
        return false;
    }
    functions.push(func);
    let tag = document.createElement("p"),
        word = flag ? "以上" : "以下";
    tag.innerHTML = "ツイート数が" + val + word + "の垢" + trashsvg;
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
    let func = function(legacy) {
        if (legacy.favourites_count >= val && flag) return true;
        if (legacy.favourites_count <= val && !flag) return true;
        return false;
    }
    functions.push(func);
    let tag = document.createElement("p"),
        word = flag ? "以上" : "以下";
    tag.innerHTML = "いいね数が" + val + word + "の垢" + trashsvg;
    funclist.appendChild(tag);
    tag.lastElementChild.addEventListener('click', () => {
        removefunc(tag)
    })
  });

  document.body.classList.add('inactive');
  dialogFade.showModal();
}

getquery = (_) => {
  let a = webpackChunk_twitter_responsive_web;
  for (let i = a.length; i--;) {
      for (let c in a[i][1]) {
          try {
              if (a[i][1][c].length == 1) {
                  let d = {};
                  a[i][1][c](d);
                  if (d.exports.operationName == _) {
                      let e = d.exports.metadata.featureSwitches,
                          f = {};
                      for (let j = e.length; j--;) {
                          if (e[j] in FS) f[e[j]] = FS[e[j]].value;
                          else f[e[j]] = !0
                      }
                      return [d.exports.queryId, f]
                  }
              }
          } catch {}
      }
  }
};

setxhr = (a) => {
  let _ = (b, c) => a.setRequestHeader(b, c);
  _('Authorization', 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA');
  _('x-csrf-token', ct0);
  _('x-twitter-active-user', 'yes');
  _('x-twitter-auth-type', 'OAuth2Session');
  _('x-twitter-client-language', 'ja');
  a.withCredentials = !0
};

count = 0;
check = 0;
erase = (num, a) => {
  if (check < 0) return;
  let legacy = a.content.itemContent.user_results.result.legacy,
      word = num == 0 ? "ブロック" : num == 1 ? "ブロ解" : "フォロー解除";
  if (0 <= check && check < 3) {
      if (!window.confirm(legacy.name + " (@" + legacy.screen_name + ")を" + word + "します")) {
          alert("条件の指定が間違えている、もしくは何らかのバグが起きている可能性があります\nもう一度お試しください");
          if (check == 0) log.innerText = "0件完了しました";
          document.getElementById('loading').remove();
          document.querySelector("#loglog .checkbox").innerText = "ページのリロードで閉じます";
          check = -1;
          return
      } else check++
  }
  if (check == 3) {
      alert("確認が終わりました\nこのアラートを閉じると一括実行を開始します\nXの画面は開いたままにしていてください");
      check++
  }
  if (num == 0 || num == 1) {
      let c = new XMLHttpRequest(),
          formData = new FormData();
      formData.append("user_id", a.content.itemContent.user_results.result.rest_id);
      c.open('POST', 'https://x.com/i/api/1.1/blocks/create.json');
      setxhr(c);
      c.onreadystatechange = () => {
          if (c.readyState == 4 && c.status == 200) {
              if (num == 0) {
                  count++;
                  log.innerText = count + "件完了しました"
              } else {
                  let b = new XMLHttpRequest();
                  b.open('POST', 'https://x.com/i/api/1.1/blocks/destroy.json');
                  setxhr(b);
                  b.onreadystatechange = () => {
                      if (b.readyState == 4 && b.status == 200) {
                          count++;
                          log.innerText = count + "件完了しました"
                      };
                  };
                  b.send(formData)
              }
          }
      };
      c.send(formData)
  } else {
      let c = new XMLHttpRequest(),
          formData = new FormData();
      formData.append("include_profile_interstitial_type", 1);
      formData.append("include_blocking", 1);
      formData.append("include_blocked_by", 1);
      formData.append("include_followed_by", 1);
      formData.append("include_want_retweets", 1);
      formData.append("include_mute_edge", 1);
      formData.append("include_can_dm", 1);
      formData.append("include_can_media_tag", 1);
      formData.append("include_ext_is_blue_verified", 1);
      formData.append("include_ext_verified_type", 1);
      formData.append("include_ext_profile_image_shape", 1);
      formData.append("skip_status", 1);
      formData.append("user_id", a.content.itemContent.user_results.result.rest_id);
      c.open('POST', 'https://x.com/i/api/1.1/friendships/destroy.json');
      setxhr(c);
      c.onreadystatechange = () => {
          if (c.readyState == 4 && c.status == 200) {
              count++;
              log.innerText = count + "件完了しました"
          }
      };
      c.send(formData)
  }

};

end = (a) => {
  if (check < 0) return;
  if (a) {
      alert("API制限です。\n" + new Date(a).toLocaleTimeString() + "に解除されますので、それ以降に再度お試し下さい");
  } else {
      alert("完了しました。大量に処理した場合は凍結回避のため、しばらくフォロー・フォロー解除を控えるのをお勧めします")
  }
  document.getElementById('loading').remove();
  document.querySelector("#loglog .checkbox").innerText = "ページのリロードで閉じます";
  if (log.innerText.includes("検")) log.innerText = "0件完了しました";
};

query = (num, data) => {
  let id = (num == 0 || num == 1) ? "Followers" : "Following",
      a = new XMLHttpRequest(),
      b = getquery(id);
  data.features = b[1];
  let prop = "?" + Object.entries(data).map((c) => {
          return `${c[0].replaceAll("%22","")}=${encodeURIComponent(JSON.stringify(c[1]))}`
      }).join("&");
  a.open('GET', 'https://x.com/i/api/graphql/' + b[0] + '/' + id + prop);
  setxhr(a);
  a.setRequestHeader('content-type', 'application/json')
  a.onreadystatechange = () => {
      if (a.readyState == 4) {
          if (a.status == 200) {
              let remain = 0,
                  entries = JSON.parse(a.responseText).data.user.result.timeline.timeline.instructions;
              entries = entries[entries.length - 1].entries;
              for (let i = 0; i < entries.length; i++) {
                  try {
                    if (entries[i].entryId.includes("user")) {
                      remain++;
                      if (judge(entries[i])) erase(num, entries[i]);
                    } else if (entries[i].entryId.includes("bottom")) {
                      if (remain == 0) {
                          end();
                          break
                      }
                      let copy = JSON.parse(JSON.stringify(data1));
                      copy.variables.cursor = entries[i].content.value;
                      query(num, copy);
                      break
                    }
                  } catch {}
              }
          } else {
              end(Number(a.getResponseHeader("X-Rate-Limit-Reset")) * 1000)
          }
      }
  };
  a.send()
};
