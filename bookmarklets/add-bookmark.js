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
    document.cookie.split("; ").forEach(c=>{
        c=c.split("=");
        "ct0"==c[0]&&(window.ct0=c[1])
    });
    var b=readInitialState();
    window.FS=b.featureSwitch.defaultConfig;
    b=document.createElement("style");
    b.innerHTML='\n    .dialog {\n      width: 26em;\n      max-width: 95%;\n      max-height: 60%;\n      border: none;\n      border-radius: 4px;\n      box-shadow: 0 0 24px 4px rgba(0, 0, 0, 0.4);\n      padding: 0;\n      font-family: "Segoe UI",Meiryo,system-ui,-apple-system,BlinkMacSystemFont,sans-serif;\n      font-weight: bold;\n      color: black !important;\n    }\n    .dialog::backdrop {\n      background-color: rgba(0, 0, 0, 0.4);\n    }\n    .dialog .body {\n      background-color: #fff;\n      margin: 0;\n      padding: 1em;\n      text-align: center;\n    }\n    ';
    document.head.insertAdjacentElement("beforeend", b);
    window.data={
        variables:{
            count:20, includePromotedContent:!0, withQuickPromoteEligibilityTweetFields:!0, withVoice:!0, withV2Timeline:!0
        }
    };
    a=location.pathname.split("/")[1];
    let e=new XMLHttpRequest;
    b=getquery("UserByScreenName");
    a="?"+Object.entries({
        variables:{
            screen_name:a, withSafetyModeUserFields:!0
        }, features:b[1]
    }).map(c=>`${c[0].replaceAll("%22","")}=${encodeURIComponent(JSON.stringify(c[1]))}`).join("&");
    e.open("GET", "https://x.com/i/api/graphql/"+b[0]+"/UserByScreenName"+a);
    setxhr(e);
    e.onreadystatechange=()=>{
        if(4==e.readyState)if(200==e.status){
            var c=JSON.parse(e.responseText).data;
            "user"in c?(window.userid=c.user.result.rest_id, window.data.variables.userId=c.user.result.rest_id, c=document.createElement("div"), c.innerHTML='\n                    <dialog id="dialogFade" class="dialog">\n                        <div class="body" id="counter">0\u4ef6\u8ffd\u52a0\u3057\u307e\u3057\u305f</div>\n                    </dialog>\n                    ', document.body.appendChild(c), document.getElementById("dialogFade").showModal(), query(window.data)):alert("\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u3092\u958b\u3044\u3066\u304f\u3060\u3055\u3044")
        }
        else alert("\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f")
    };
    e.send()
}, getquery=b=>{
    let a=webpackChunk_twitter_responsive_web;
    for(let e=a.length;
    e--;
    )for(let c in a[e][1])try{
        if(1==a[e][1][c].length){
            let f={
            };
            a[e][1][c](f);
            if(f.exports.operationName==b){
                let d=f.exports.metadata.featureSwitches, m={
                };
                for(let g=d.length;
                g--;
                )m[d[g]]=d[g]in FS?FS[d[g]].value:!0;
                return[f.exports.queryId, m]
            }
        }
    }
    catch(f){
    }
}, setxhr=b=>{
    b.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA");
    b.setRequestHeader("x-csrf-token", ct0);
    b.setRequestHeader("x-twitter-active-user", "yes");
    b.setRequestHeader("x-twitter-auth-type", "OAuth2Session");
    b.setRequestHeader("x-twitter-client-language", "ja");
    b.setRequestHeader("content-type", "application/json");
    b.withCredentials=!0
}, count=0, bookmark=b=>{
    let a=new XMLHttpRequest;
    a.open("POST", "https://x.com/i/api/graphql/"+getquery("CreateBookmark")[0]+"/CreateBookmark");
    setxhr(a);
    a.onreadystatechange=()=>{
        4!=a.readyState||200!=a.status||"errors"in JSON.parse(a.responseText)||(count++, document.getElementById("counter").innerText=count+"\u4ef6\u8ffd\u52a0\u3057\u307e\u3057\u305f")
    };
    a.send(JSON.stringify({
        variables:{
            tweet_id:b
        }
    }))
}, apicount=0, query=b=>{
    let a=new XMLHttpRequest, e=getquery("UserTweets");
    b.features=e[1];
    let c="?"+Object.entries(b).map(f=>`${f[0].replaceAll("%22","")}=${encodeURIComponent(JSON.stringify(f[1]))}`).join("&");
    a.open("GET", "https://x.com/i/api/graphql/"+e[0]+"/UserTweets"+c);
    setxhr(a);
    a.onreadystatechange=()=>{
        if(4==a.readyState)if(200==a.status){
            let f=!0, d, m, g=JSON.parse(a.responseText).data.user.result.timeline_v2.timeline.instructions;
            a:for(let n=0;
            n<g.length;
            n++){
                if("entries"in g[n])d=g[n].entries;
                else if("entry"in g[n])d=[g[n].entry];
                else continue;
                for(let h=0;
                h<d.length;
                h++)try{
                    if(!d[h].entryId.includes("promoted")&&!d[h].entryId.includes("cursor")){
                        if(d[h].entryId.includes("conversation"))m=[d[h].content.items[0]];
                        else if(d[h].entryId.includes("tweet"))m=[{
                            item:d[h].content
                        }
                        ];
                        else continue;
                        for(let l=0;
                        1>l;
                        l++){
                            let k=m[l].item.itemContent.tweet_results.result;
                            "tweet"in k&&(k=k.tweet);
                            k.legacy.user_id_str==userid&&!("retweeted_status_result"in k.legacy)&&"count"in k.views&&(100*k.legacy.favorite_count>=Number(k.views.count)&&50<=k.legacy.favorite_count&&bookmark(k.legacy.id_str), m[l].item.clientEventInfo.component.includes("pin")||(f=!1))
                        }
                    }
                    else if(d[h].entryId.includes("bottom")){
                        let l=JSON.parse(JSON.stringify(b));
                        l.variables.cursor=d[h].content.value;
                        f?alert("\u5b8c\u4e86\u3057\u307e\u3057\u305f"):(apicount++, 0==apicount%10?window.confirm("API\u309210\u6d88\u8cbb\u3057\u307e\u3057\u305f\u3002\u7d9a\u884c\u3057\u307e\u3059\u304b\uff1f")?query(l):alert("\u4e2d\u65ad\u3057\u307e\u3057\u305f"):query(l));
                        break a
                    }
                }
                catch{
                }
            }
        }
        else alert("API\u5236\u9650\u3067\u3059\uff08\u3053\u308c\u4ee5\u4e0a\u3060\u3069\u308c\u307e\u305b\u3093\uff09")
    };
    a.send()
};
init();
void+0
