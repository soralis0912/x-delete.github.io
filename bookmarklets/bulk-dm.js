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
var get_request_id=()=>{
    var c=crypto.getRandomValues(new Uint8Array(16)), b=b=[1|c[0], c[1], c[2], c[3], c[4], c[5]], e=16383&(c[6]<<8|c[7]);
    c=[];
    for(var a=0;
    256>a;
    a++)c[a]=(a+256).toString(16).substr(1);
    var f=void 0, g=0;
    a=[];
    var k=void 0!==(f=f||{
    }).clockseq?f.clockseq:e;
    e=void 0!==f.msecs?f.msecs:(new Date).getTime();
    var l=void 0!==f.nsecs?f.nsecs:1, h=e-0+(l-0)/1E4;
    if(0>h&&void 0===f.clockseq&&(k=k+1&16383), (0>h||0<e)&&void 0===f.nsecs&&(l=0), 1E4<=l)throw Error("uuid.v1(): Can't create more than 10M uuids/sec");
    h=(1E4*(268435455&(e+=122192928E5))+l)%4294967296;
    a[g++]=h>>>24&255;
    a[g++]=h>>>16&255;
    a[g++]=h>>>8&255;
    a[g++]=255&h;
    e=e/4294967296*1E4&268435455;
    a[g++]=e>>>8&255;
    a[g++]=255&e;
    a[g++]=e>>>24&15|16;
    a[g++]=e>>>16&255;
    a[g++]=k>>>8|128;
    a[g++]=255&k;
    b=f.node||b;
    for(f=0;
    6>f;
    f++)a[g+f]=b[f];
    b=0;
    return c[a[b++]]+c[a[b++]]+c[a[b++]]+c[a[b++]]+"-"+c[a[b++]]+c[a[b++]]+"-"+c[a[b++]]+c[a[b++]]+"-"+c[a[b++]]+c[a[b++]]+"-"+c[a[b++]]+c[a[b++]]+c[a[b++]]+c[a[b++]]+c[a[b++]]+c[a[b++]]
}, setxhr=c=>{
    c.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA");
    c.setRequestHeader("x-csrf-token", ct0);
    c.setRequestHeader("x-twitter-active-user", "yes");
    c.setRequestHeader("x-twitter-auth-type", "OAuth2Session");
    c.setRequestHeader("x-twitter-client-language", "ja");
    c.withCredentials=!0
}, getquery=c=>{
    let b=webpackChunk_twitter_responsive_web;
    for(let e=b.length;
    e--;
    )for(let a in b[e][1])try{
        if(1==b[e][1][a].length){
            let f={
                exports:{
                }
            };
            b[e][1][a](f);
            if(f.exports.operationName==c){
                let g=f.exports.metadata.featureSwitches, k={
                };
                for(let l=g.length;
                l--;
                )k[g[l]]=g[l]in FS?FS[g[l]].value:!0;
                return[f.exports.queryId, k]
            }
        }
        else{
            let f=b[e][1][a].toString(), g=f.match(/operation:\{(.*?)\}/)[1].match(/name:"(.*?)"/), k=f.match(/params:\{(.*?)\}/)[1].match(/id:"(.*?)"/);
            if(g[1]==c)return[k[1], {
            }
            ]
        }
    }
    catch(f){
    }
}, count=0, init=()=>{
    function c(e, a){
        e=document.querySelector("#"+e);
        e.classList.add("hide");
        e.addEventListener("animationend", function g(){
            document.body.classList.remove("inactive");
            this.classList.remove("hide");
            this.close();
            this.removeEventListener("animationend", g)
        })
    }
    if(location.href.includes("https://x.com/messages")){
        document.cookie.split("; ").forEach(e=>{
            e=e.split("=");
            "ct0"==e[0]&&(window.ct0=e[1])
        });
        var b=readInitialState(), f=b.entities.users.entities[Object.keys(b.entities.users.entities)[0]];
        window.userid=f.id_str;
        window.data1={
            variables:{
                userId:f.id_str, count:20, includePromotedContent:!1
            }, features:{
            }
        };
        window.FS=b.featureSwitch.defaultConfig;
        b=document.createElement("style");
        b.innerHTML='\n    .dialog {\n      width: 95%;\n      height: 90%;\n      border: none;\n      border-radius: 4px;\n      box-shadow: 0 0 24px 4px rgba(0, 0, 0, 0.4);\n      padding: 0;\n      font-family: "Segoe UI",Meiryo,system-ui,-apple-system,BlinkMacSystemFont,sans-serif;\n      font-weight: bold;\n      color: black !important;\n    }\n    .dialog::backdrop {\n      background-color: rgba(0, 0, 0, 0.4);\n    }\n    .dialog .body {\n      background-color: #fff;\n      margin: 0;\n      padding: 1em;\n      text-align: center;\n    }\n    .dialog .imgbox {\n      display: flex;\n      flex-direction: row;\n      justify-content: center;\n    }\n    .dialog p {\n      display: flex;\n      justify-content: space-evenly;\n      align-items: center;\n    }\n    .dialog .body p {\n      margin: 1em;\n    }\n    .dialog .footer {\n      background-color: #fff;\n      text-align: center;\n      margin: 0;\n      padding: 1em;\n      position: sticky;\n      bottom: 0;\n    }\n    .dialog .button {\n      width: 8em;\n      height: 2.4em;\n      border: none;\n      border-radius: 4px;\n      font-size: smaller;\n      font-weight: bold;\n      color: black !important;\n    }\n    #dialogFade .body button {\n      border: none;\n      background-color: #fff;\n    }\n    .dialog .button:hover {\n      opacity: 0.8;\n    }\n    .dialog .button.cancel {\n      background-color: #e6eae6;\n    }\n    .dialog .button.ok {\n      background-color: #0075c2;\n      color: #fff !important;\n    }\n    .dialog textarea {\n      width: 90%;\n      height: 80%;\n      margin: 0.5em;\n      padding: 0.5em;\n      font-weight: bold;\n      color: black !important;\n      background-color: white;\n      margin-top: 4em;\n      white-space: pre;\n      overflow-wrap: normal;\n      overflow-x: auto;\n    }\n    .dialog .inner {\n      text-align: center;\n      height: 100%;\n    }\n\n    .dialog[open],\n    .dialog[open]::backdrop {\n      animation: fadeIn 200ms ease normal;\n    }\n    @keyframes fadeIn {\n      from {\n        opacity: 0;\n      }\n      to {\n        opacity: 1;\n      }\n    }\n    .dialog.hide,\n    .dialog.hide::backdrop {\n      animation: fadeOut 200ms ease normal;\n    }\n    @keyframes fadeOut {\n      to {\n        opacity: 0;\n      }\n    }\n    .number {\n      width: 3em;\n    }\n    .checkbox {\n      margin-bottom: 1em !important;\n      font-size: xx-small;\n      font-weight: normal;\n      justify-content: center !important;\n    }\n    ';
        document.head.insertAdjacentElement("beforeend", b);
        b=document.createElement("div");
        b.innerHTML='\n    <dialog id="dialogFade" class="dialog">\n        <div class="inner">\n          <textarea id="text"></textarea>\n          <div class="footer">\n            <p><button class="button cancel">\u30ad\u30e3\u30f3\u30bb\u30eb</button>\n            <button class="button ok">\u9001\u4fe1\u3059\u308b</button></p>\n          </div>\n        </div>\n    </dialog>\n    ';
        document.body.appendChild(b);
        document.getElementById("dialogFade").showModal();
        document.querySelectorAll(".button.cancel")[0].addEventListener("click", ()=>{
            c("dialogFade", !0)
        });
        document.querySelector(".button.ok").addEventListener("click", ()=>{
            window.send_text=document.getElementById("text").value;
            ""==send_text?alert("\u30c6\u30ad\u30b9\u30c8\u304c\u7a7a\u767d\u3067\u3059"):(document.getElementById("dialogFade").innerHTML='<div class="body" id="counter">0\u4ef6\u9001\u4fe1\u3057\u307e\u3057\u305f</div>', query(data1))
        });
        count=0
    }
    else alert("https://x.com/messages \u3092\u958b\u3044\u3066\u304f\u3060\u3055\u3044")
};
function create_dm(c, b){
    return new Promise((e, a)=>{
        var f=(h, m)=>{
            let d=new XMLHttpRequest, n={
                conversation_id:h
            };
            d.open("POST", "https://x.com/i/api/1.1/dm/welcome_messages/add_to_conversation.json?cards_platform=Web-12&request_id="+get_request_id());
            setxhr(d);
            d.setRequestHeader("content-type", "application/json");
            d.onreadystatechange=()=>{
                4==d.readyState&&(200==d.status?g(h, m):(alert("\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f"), a()))
            };
            d.send(JSON.stringify(n))
        }, g=(h, m)=>{
            let d=new XMLHttpRequest;
            d.open("GET", "https://x.com/i/api/1.1/dm/user_updates.json?active_conversation_id="+h+"&dm_users=false&nsfw_filtering_enabled=false&cursor=GRwmooHXndWite8xFtqB1ZHawsbvMSUGAAA&dm_secret_conversations_enabled=false&krs_registration_enabled=true&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_ext_limited_action_results=true&include_quote_count=true&include_reply_count=1&tweet_mode=extended&include_ext_views=true&include_groups=true&include_inbox_timelines=true&include_ext_media_color=true&supports_reactions=true&include_ext_edit_control=true&include_ext_business_affiliations_label=true&ext=mediaColor%2CaltText%2CbusinessAffiliationsLabel%2CmediaStats%2ChighlightedLabel%2CvoiceInfo%2CbirdwatchPivot%2CsuperFollowMetadata%2CunmentionInfo%2CeditControl%2Carticle");
            setxhr(d);
            d.setRequestHeader("content-type", "application/json");
            d.onreadystatechange=()=>{
                4==d.readyState&&(200==d.status?k(h, m):e())
            };
            d.send()
        }, k=(h, m)=>{
            let d=new XMLHttpRequest, n=getquery("useTypingNotifierMutation"), p={
                variables:{
                    conversationId:h
                }, queryId:n[0]
            };
            d.open("POST", "https://x.com/i/api/graphql/"+n[0]+"/useTypingNotifierMutation");
            setxhr(d);
            d.setRequestHeader("content-type", "application/json");
            d.onreadystatechange=()=>{
                4==d.readyState&&(200==d.status?l(h, m):(end(1E3*Number(d.getResponseHeader("X-Rate-Limit-Reset"))), a()))
            };
            d.send(JSON.stringify(p))
        }, l=(h, m)=>{
            let d=new XMLHttpRequest;
            h={
                conversation_id:h, recipient_ids:!1, request_id:get_request_id(), text:m, cards_platform:"Web-12", include_cards:1, include_quote_count:!0, dm_users:!1
            };
            d.open("POST", "https://x.com/i/api/1.1/dm/new2.json?ext=mediaColor%2CaltText%2CmediaStats%2ChighlightedLabel%2CvoiceInfo%2CbirdwatchPivot%2CsuperFollowMetadata%2CunmentionInfo%2CeditControl%2Carticle&include_ext_alt_text=true&include_ext_limited_action_results=true&include_reply_count=1&tweet_mode=extended&include_ext_views=true&include_groups=true&include_inbox_timelines=true&include_ext_media_color=true&supports_reactions=true");
            setxhr(d);
            d.setRequestHeader("content-type", "application/json");
            d.onreadystatechange=()=>{
                4==d.readyState&&(200==d.status?"entries"in JSON.parse(d.responseText)&&(count++, document.getElementById("counter").innerText=count+"\u4ef6\u9001\u4fe1\u3057\u307e\u3057\u305f", e()):(alert("\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f"), a()))
            };
            d.send(JSON.stringify(h))
        };
        ((h, m)=>{
            let d=new XMLHttpRequest;
            d.open("GET", "https://x.com/i/api/1.1/dm/conversation/"+h+".json?context=FETCH_DM_CONVERSATION&include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&include_ext_is_blue_verified=1&include_ext_verified_type=1&include_ext_profile_image_shape=1&skip_status=1&dm_secret_conversations_enabled=false&krs_registration_enabled=true&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_ext_limited_action_results=true&include_quote_count=true&include_reply_count=1&tweet_mode=extended&include_ext_views=true&dm_users=false&include_groups=true&include_inbox_timelines=true&include_ext_media_color=true&supports_reactions=true&include_conversation_info=true&ext=mediaColor%2CaltText%2CmediaStats%2ChighlightedLabel%2CvoiceInfo%2CbirdwatchPivot%2CsuperFollowMetadata%2CunmentionInfo%2CeditControl%2Carticle");
            setxhr(d);
            d.setRequestHeader("content-type", "application/json");
            d.onreadystatechange=()=>{
                4==d.readyState&&(200==d.status?f(h, m):(end(1E3*Number(d.getResponseHeader("X-Rate-Limit-Reset"))), a()))
            };
            d.send()
        })(c, b)
    })
}
var end=c=>{
    c?alert("API\u5236\u9650\u3067\u3059\u3002\n"+(new Date(c)).toLocaleTimeString()+"\u306b\u89e3\u9664\u3055\u308c\u307e\u3059\u306e\u3067\u3001\u305d\u308c\u4ee5\u964d\u306b\u518d\u5ea6\u304a\u8a66\u3057\u4e0b\u3055\u3044"):alert("\u5b8c\u4e86\u3057\u307e\u3057\u305f\u3002\u30da\u30fc\u30b8\u306e\u30ea\u30ed\u30fc\u30c9\u3067\u9589\u3058\u307e\u3059");
    document.getElementById("loading").remove()
}, query=c=>{
    let b=new XMLHttpRequest, e=getquery("Following");
    c.features=e[1];
    c="?"+Object.entries(c).map(a=>`${a[0].replaceAll("%22","")}=${encodeURIComponent(JSON.stringify(a[1]))}`).join("&");
    b.open("GET", "https://x.com/i/api/graphql/"+e[0]+"/Following"+c);
    setxhr(b);
    b.setRequestHeader("content-type", "application/json");
    b.onreadystatechange=async()=>{
        if(4==b.readyState)if(200==b.status){
            let a=0, f=JSON.parse(b.responseText).data.user.result.timeline.timeline.instructions;
            f=f[f.length-1].entries;
            for(let g=0;
            g<f.length;
            g++)try{
                if(f[g].entryId.includes("user")){
                    a++;
                    let k=f[g].content.itemContent.user_results.result;
                    if("followed_by"in k.legacy&&8E3<=k.legacy.followers_count)try{
                        k.legacy.followed_by&&await create_dm(k.rest_id+"-"+userid, send_text)
                    }
                    catch{
                        break
                    }
                }
                else if(f[g].entryId.includes("bottom")){
                    if(0==a){
                        end();
                        break
                    }
                    let k=JSON.parse(JSON.stringify(data1));
                    k.variables.cursor=f[g].content.value;
                    query(k);
                    break
                }
            }
            catch{
            }
        }
        else end(1E3*Number(b.getResponseHeader("X-Rate-Limit-Reset")))
    };
    b.send()
};
init();
void+0
