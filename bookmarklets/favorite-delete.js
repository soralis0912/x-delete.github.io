debugLog = (message, detail) => {
    try {
        if (detail === undefined) console.log("[x-delete favorite] " + message);
        else console.log("[x-delete favorite] " + message, detail);
    } catch {}
    const debugBox = document.getElementById("x-delete-debug-log");
    if (debugBox) {
        const line = document.createElement("div");
        line.textContent = new Date().toLocaleTimeString() + " favorite: " + message;
        debugBox.appendChild(line);
        debugBox.scrollTop = debugBox.scrollHeight;
    }
};

favoriteDebugVersion = "favorite-20260608-debug-v1";

init = async () => {
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

    const readCookie = (name) => {
        const prefix = name + "=";
        const cookie = document.cookie.split("; ").find((entry) => entry.startsWith(prefix));
        return cookie ? cookie.slice(prefix.length) : "";
    };

    const state = readInitialState();
    const currentUser = pickCurrentUser(state);
    if (!currentUser) throw new Error("ユーザー情報を取得できません");

    ct0 = readCookie("ct0");
    FS = state.featureSwitch && state.featureSwitch.defaultConfig || {};
    favoriteUserId = currentUser.id_str || currentUser.rest_id;
    favoriteScreenName = currentUser.screen_name;
    favoriteDeletedCount = 0;
    favoriteSeenTweetIds = {};
    favoriteSeenCursors = {};
    favoriteStop = false;

    debugLog("payload版 " + favoriteDebugVersion);
    debugLog("対象ユーザー screen_name=" + favoriteScreenName + " userId=" + favoriteUserId + " ct0=" + (ct0 ? "yes" : "no"));

    if (!ct0) throw new Error("ct0 cookie を取得できません");
    if (!favoriteUserId) throw new Error("userId を取得できません");
    if (!window.confirm("@" + favoriteScreenName + " のいいねを削除します")) return;
    if (!window.confirm("削除したいいねは元に戻せません。\n削除を開始しますか？")) return;

    showFavoriteLog();
    await queryLikes("");
};

showFavoriteLog = () => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
    #x-delete-favorite-status {
      z-index: 2147483646;
      width: min(92vw, 520px);
      min-height: 72px;
      position: fixed;
      left: 50%;
      bottom: 18px;
      transform: translateX(-50%);
      box-sizing: border-box;
      padding: 14px 18px;
      border: 1px solid #d8a0aa;
      border-radius: 6px;
      background: #fff7f8;
      color: #111 !important;
      font: bold 15px/1.5 "Segoe UI", Meiryo, sans-serif;
      text-align: center;
      box-shadow: 0 8px 28px rgba(0,0,0,.25);
    }
    #x-delete-favorite-status button {
      margin-top: 8px;
      padding: 6px 14px;
      border: none;
      border-radius: 4px;
      background: #e6eae6;
      font-weight: bold;
    }
    `;
    document.head.insertAdjacentElement("beforeend", styleTag);

    const status = document.createElement("div");
    status.id = "x-delete-favorite-status";
    status.innerHTML = `<div id="x-delete-favorite-message">0件削除しました</div><button type="button">停止</button>`;
    document.body.appendChild(status);
    status.querySelector("button").addEventListener("click", () => {
        favoriteStop = true;
        updateFavoriteStatus("停止中です。処理中の通信が終わるまで待ってください");
        debugLog("ユーザー操作で停止");
    });
};

updateFavoriteStatus = (message) => {
    const target = document.getElementById("x-delete-favorite-message");
    if (target) target.textContent = message;
};

setxhr = (request, contentType) => {
    request.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA");
    request.setRequestHeader("x-csrf-token", ct0);
    request.setRequestHeader("x-twitter-active-user", "yes");
    request.setRequestHeader("x-twitter-auth-type", "OAuth2Session");
    request.setRequestHeader("x-twitter-client-language", "ja");
    if (contentType) request.setRequestHeader("content-type", contentType);
    request.withCredentials = !0;
};

graphqlRequest = (method, operationName, data) => {
    const operation = getquery(operationName);
    if (!operation) throw new Error(operationName + " の queryId が見つかりません");
    const [queryId, features] = operation;
    const payload = JSON.parse(JSON.stringify(data));
    payload.features = features;

    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        let endpoint = "https://x.com/i/api/graphql/" + queryId + "/" + operationName;
        if (method == "GET") {
            endpoint += "?" + Object.entries(payload).map((entry) => {
                return entry[0] + "=" + encodeURIComponent(JSON.stringify(entry[1]));
            }).join("&");
        }
        request.open(method, endpoint);
        setxhr(request, method == "POST" ? "application/json" : "");
        request.onreadystatechange = () => {
            if (request.readyState != 4) return;
            if (request.status >= 200 && request.status < 300) {
                try {
                    resolve(JSON.parse(request.responseText));
                } catch (error) {
                    reject(error);
                }
                return;
            }
            reject({
                status: request.status,
                reset: request.getResponseHeader("X-Rate-Limit-Reset"),
                body: request.responseText
            });
        };
        debugLog("GraphQL送信 " + operationName + " queryId=" + queryId + " method=" + method);
        request.send(method == "POST" ? JSON.stringify(payload) : null);
    });
};

getquery = (operationName) => {
    const candidates = [];
    const seen = {};
    const addCandidate = (name, queryId, switches) => {
        if (name != operationName || !queryId || seen[queryId]) return;
        const features = {};
        (switches || []).forEach((key) => {
            features[key] = key in FS ? FS[key].value : !0;
        });
        seen[queryId] = !0;
        candidates.push([queryId, features]);
    };

    const chunks = window.webpackChunk_twitter_responsive_web || [];
    for (let index = chunks.length; index--;) {
        const modules = chunks[index][1] || {};
        for (const key in modules) {
            try {
                if (modules[key].length == 1) {
                    const module = {};
                    modules[key](module);
                    addCandidate(module.exports && module.exports.operationName, module.exports && module.exports.queryId, module.exports && module.exports.metadata && module.exports.metadata.featureSwitches);
                }
            } catch {}
        }
    }

    const resources = performance.getEntriesByType ? performance.getEntriesByType("resource") : [];
    resources.forEach((resource) => {
        const match = String(resource.name).match(/\/i\/api\/graphql\/([^/?]+)\/([^/?]+)/);
        if (!match) return;
        addCandidate(decodeURIComponent(match[2]), match[1], []);
    });

    debugLog(operationName + " queryId候補 " + candidates.length);
    return candidates[0];
};

extractLikesPayload = (cursor) => {
    const variables = {
        userId: favoriteUserId,
        count: 20,
        includePromotedContent: false,
        withClientEventToken: false,
        withBirdwatchNotes: false,
        withVoice: true,
        withV2Timeline: true
    };
    if (cursor) variables.cursor = cursor;
    return { variables };
};

queryLikes = async (cursor) => {
    if (favoriteStop) {
        updateFavoriteStatus(favoriteDeletedCount + "件削除しました。停止しました");
        return;
    }
    if (cursor) {
        if (favoriteSeenCursors[cursor]) {
            debugLog("同じcursorを検出したため終了");
            updateFavoriteStatus(favoriteDeletedCount + "件削除しました。完了しました");
            return;
        }
        favoriteSeenCursors[cursor] = !0;
    }

    try {
        updateFavoriteStatus(favoriteDeletedCount + "件削除しました。いいねを取得中です");
        const response = await graphqlRequest("GET", "Likes", extractLikesPayload(cursor));
        const parsed = parseLikesResponse(response);
        debugLog("Likes取得 tweets=" + parsed.tweetIds.length + " nextCursor=" + (parsed.cursor ? "yes" : "no"));

        for (const tweetId of parsed.tweetIds) {
            if (favoriteStop) break;
            await unfavoriteTweet(tweetId);
            await sleep(250);
        }

        if (favoriteStop) {
            updateFavoriteStatus(favoriteDeletedCount + "件削除しました。停止しました");
            return;
        }
        if (parsed.cursor) {
            await queryLikes(parsed.cursor);
            return;
        }
        updateFavoriteStatus(favoriteDeletedCount + "件削除しました。完了しました");
        alert("完了しました。\nサークルから外された、ブロックされたなどにより、全て削除できない場合があります");
    } catch (error) {
        debugLog("ERROR", error);
        if (error && error.reset) {
            alert("API制限です。\n" + new Date(Number(error.reset) * 1000).toLocaleTimeString() + "に解除されますので、それ以降に再度お試し下さい");
            updateFavoriteStatus(favoriteDeletedCount + "件削除しました。API制限で停止しました");
            return;
        }
        alert("いいね削除中にエラーが発生しました。\n画面上のログとConsoleを確認してください。");
        updateFavoriteStatus(favoriteDeletedCount + "件削除しました。エラーで停止しました");
    }
};

unfavoriteTweet = async (tweetId) => {
    await graphqlRequest("POST", "UnfavoriteTweet", {
        variables: {
            tweet_id: tweetId
        }
    });
    favoriteDeletedCount++;
    updateFavoriteStatus(favoriteDeletedCount + "件削除しました");
    debugLog("UnfavoriteTweet OK tweetId=" + tweetId);
};

parseLikesResponse = (response) => {
    const instructions =
        response && response.data && response.data.user && response.data.user.result &&
        response.data.user.result.timeline_v2 && response.data.user.result.timeline_v2.timeline &&
        response.data.user.result.timeline_v2.timeline.instructions ||
        response && response.data && response.data.user && response.data.user.result &&
        response.data.user.result.timeline && response.data.user.result.timeline.timeline &&
        response.data.user.result.timeline.timeline.instructions ||
        [];

    const tweetIds = [];
    let cursor = "";

    const visit = (node) => {
        if (!node) return;
        if (Array.isArray(node)) {
            node.forEach(visit);
            return;
        }
        if (typeof node != "object") return;

        if (typeof node.entryId == "string" && node.entryId.includes("promoted")) return;
        if (typeof node.entryId == "string" && node.entryId.includes("cursor-bottom") && node.content && node.content.value) {
            cursor = node.content.value;
        }

        let result = node.tweet_results && node.tweet_results.result ||
            node.itemContent && node.itemContent.tweet_results && node.itemContent.tweet_results.result ||
            node.content && node.content.itemContent && node.content.itemContent.tweet_results && node.content.itemContent.tweet_results.result;
        if (result) {
            if (result.tweet) result = result.tweet;
            const tweetId = result.rest_id || result.legacy && result.legacy.id_str;
            if (tweetId && !favoriteSeenTweetIds[tweetId]) {
                favoriteSeenTweetIds[tweetId] = !0;
                tweetIds.push(tweetId);
            }
        }

        if (node.entries) visit(node.entries);
        if (node.entry) visit(node.entry);
        if (node.items) visit(node.items);
        if (node.content) visit(node.content);
        if (node.item) visit(node.item);
    };

    visit(instructions);
    return { tweetIds, cursor };
};

sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
