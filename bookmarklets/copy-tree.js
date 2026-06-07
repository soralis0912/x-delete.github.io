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
    var a=location.pathname.split("/");
    if(19!=a[a.length-1].length)alert("\u30c4\u30a4\u30fc\u30c8\u3092\u958b\u3044\u3066\u304f\u3060\u3055\u3044");
    else{
        document.cookie.split("; ").forEach(e=>{
            e=e.split("=");
            "ct0"==e[0]&&(window.ct0=e[1])
        });
        a=readInitialState();
        let c=a.entities.users.entities[Object.keys(a.entities.users.entities)[0]];
        window.username=c.screen_name;
        window.data1={
            variables:{
                userId:c.id_str, count:20, includePromotedContent:!1
            }, features:{
            }
        };
        window.FS=a.featureSwitch.defaultConfig;
        show_log()
    }
}, getquery=a=>{
    let e=webpackChunk_twitter_responsive_web;
    for(let b=e.length;
    b--;
    )for(let c in e[b][1])try{
        if(1==e[b][1][c].length){
            let d={
            };
            e[b][1][c](d);
            if(d.exports.operationName==a){
                let g=d.exports.metadata.featureSwitches, h={
                };
                for(let f=g.length;
                f--;
                )h[g[f]]=g[f]in FS?FS[g[f]].value:!0;
                return[d.exports.queryId, h]
            }
        }
    }
    catch(d){
    }
}, setxhr=a=>{
    a.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA");
    a.setRequestHeader("x-csrf-token", ct0);
    a.setRequestHeader("x-twitter-active-user", "yes");
    a.setRequestHeader("x-twitter-auth-type", "OAuth2Session");
    a.setRequestHeader("x-twitter-client-language", "ja");
    a.withCredentials=!0
}, get_prop=a=>"?"+Object.entries(a).map(e=>`${e[0].replaceAll("%22","")}=${encodeURIComponent(JSON.stringify(e[1]))}`).join("&"), get_tweet=()=>{
    let a=new XMLHttpRequest, e=getquery("TweetDetail"), b=location.pathname.split("/");
    a.open("GET", "https://x.com/i/api/graphql/"+e[0]+"/TweetDetail"+get_prop({
        variables:{
            focalTweetId:b[b.length-1], with_rux_injections:!1, includePromotedContent:!0, withCommunity:!0, withQuickPromoteEligibilityTweetFields:!0, withBirdwatchNotes:!0, withVoice:!0, withV2Timeline:!0
        }, features:e[1]
    }));
    setxhr(a);
    a.onreadystatechange=()=>{
        if(4==a.readyState&&200==a.status){
            let c=JSON.parse(a.responseText).data.threaded_conversation_with_injections_v2.instructions[0].entries, d=document.getElementsByClassName("body")[0], g=c[0].content.itemContent.tweet_results.result.core.user_results.result.rest_id;
            a:for(let f=0;
            f<c.length;
            f++)if(c[f].entryId.includes("tweet-"))add_box(c[f].content.itemContent.tweet_results.result.legacy, d);
            else{
                let m=c[f].content.items;
                for(let n=0;
                n<m.length;
                n++)if(m[n].entryId.includes("tweet-"))if(g==m[n].item.itemContent.tweet_results.result.core.user_results.result.rest_id)add_box(m[n].item.itemContent.tweet_results.result.legacy, d);
                else continue a;
                break
            }
            function h(f, m){
                f=document.querySelector("#"+f);
                f.classList.add("hide");
                f.addEventListener("animationend", function k(){
                    document.body.classList.remove("inactive");
                    this.classList.remove("hide");
                    this.close();
                    this.removeEventListener("animationend", k);
                    m&&document.getElementById("dialogs").remove()
                })
            }
            document.querySelectorAll(".button.cancel")[0].addEventListener("click", ()=>{
                h("dialogFade", !0)
            });
            document.querySelectorAll(".button.cancel")[1].addEventListener("click", ()=>{
                sort()
            });
            document.querySelector(".button.ok").addEventListener("click", ()=>{
                ids=[];
                count=0;
                create();
                h("dialogFade", !1)
            })
        }
    };
    a.send()
}, count=0, ids=[], create=(a="")=>{
    let e=document.getElementsByClassName("body")[0].children, b=new XMLHttpRequest, c=getquery("CreateTweet"), d={
        variables:{
            batch_compose:0==count?"BatchFirst":"BatchSubsequent", dark_request:!1, semantic_annotation_ids:[], media:{
                media_entities:[], possibly_sensitive:!1
            }, tweet_text:e[2*count].value
        }, queryId:c[0], features:c[1]
    }, g=e[2*count+1].children;
    0<g.length&&(d.variables.media={
        media_entities:[], possibly_sensitive:!1
    });
    upflag2=upflag=0;
    for(var h=0;
    h<g.length;
    h++)d.variables.media.media_entities.push("");
    for(h=0;
    h<g.length;
    h++)upflag2++, upload(g[h].src, d.variables.media.media_entities, h);
    ""!=a&&(d.variables.reply={
        in_reply_to_tweet_id:a, exclude_reply_user_ids:[]
    });
    b.open("POST", "https://x.com/i/api/graphql/"+c[0]+"/CreateTweet");
    setxhr(b);
    b.setRequestHeader("content-type", "application/json");
    b.onreadystatechange=()=>{
        if(4==b.readyState&&200==b.status){
            let n=JSON.parse(b.responseText).data.create_tweet.tweet_results.result;
            var m=n.rest_id;
            ids.push(m);
            count++;
            if(2*count<e.length)create(m);
            else{
                let k=new XMLHttpRequest;
                m=getquery("UserTweets");
                let l=n.legacy.conversation_id_str;
                k.open("GET", "https://x.com/i/api/graphql/"+m[0]+"/UserTweets"+get_prop({
                    variables:{
                        userId:n.legacy.user_id_str, count:20, includePromotedContent:!0, withQuickPromoteEligibilityTweetFields:!0, withVoice:!0, withV2Timeline:!0
                    }, fieldToggles:{
                        withArticlePlainText:!1
                    }, features:m[1]
                }));
                setxhr(k);
                k.onreadystatechange=()=>{
                    if(4==k.readyState&&200==k.status){
                        var r=JSON.parse(k.responseText).data.user.result.timeline_v2.timeline.instructions;
                        a:for(var p=0;
                        p<r.length;
                        p++)if("TimelineAddEntries"==r[p].type){
                            var q=r[p].entries;
                            let x=0;
                            for(let t=0;
                            t<q.length;
                            t++){
                                let u=[];
                                if(q[t].entryId.includes("conversation"))u=q[t].content.items;
                                else if(q[t].entryId.includes("tweet")&&0!=t)u.push({
                                    item:q[t].content
                                });
                                else continue;
                                for(let v=0;
                                v<u.length;
                                v++){
                                    let w=u[v].item.itemContent.tweet_results.result.legacy;
                                    if(l==w.conversation_id_str)if(x<Number(w.id_str))x=Number(w.id_str);
                                    else{
                                        if(confirm("\u30c4\u30ea\u30fc\u5d29\u308c\u3092\u691c\u77e5\u3057\u307e\u3057\u305f\n\u518d\u6295\u7a3f\u3057\u307e\u3059\u304b\uff1f")){
                                            let y=0;
                                            for(r=0;
                                            r<ids.length;
                                            r++)p=new XMLHttpRequest, q=getquery("DeleteTweet"), p.open("POST", "https://x.com/i/api/graphql/"+q[0]+"/DeleteTweet"), setxhr(p), p.setRequestHeader("content-type", "application/json"), p.onreadystatechange=()=>{
                                                4==b.readyState&&200==b.status&&(y++, y==ids.length&&(ids=[], count=0, create()))
                                            }, p.send(JSON.stringify({
                                                variables:{
                                                    tweet_id:ids[r], dark_request:!1
                                                }, queryId:q[0]
                                            }))
                                        }
                                        else document.getElementById("dialogs").remove();
                                        break a
                                    }
                                    else{
                                        document.getElementById("dialogs").remove();
                                        alert("\u6295\u7a3f\u3057\u307e\u3057\u305f");
                                        break a
                                    }
                                }
                            }
                            document.getElementById("dialogs").remove();
                            alert("\u6295\u7a3f\u3057\u307e\u3057\u305f")
                        }
                    }
                };
                k.send()
            }
        }
    };
    const f=setInterval(()=>{
        upflag==upflag2&&(b.send(JSON.stringify(d)), clearInterval(f))
    }, 10)
}, count2=0, add_box=(a, e)=>{
    let b=a.entities.media;
    var c=document.createElement("textarea");
    c.id="";
    var d=a.full_text;
    if(b)for(var g=0;
    g<b.length;
    g++)d=d.replaceAll(b[g].url, "");
    a=a.entities.urls;
    if(0<a.length&&a[0].expanded_url.includes("af_id=")){
        a=a[0];
        g=a.expanded_url.split(/af_id=.+?&/);
        count2++;
        var h=count2+"\u3064\u76ee\u306e\u30ea\u30f3\u30af\n\n"+g[0]+"af_id=\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588&"+g[1];
        let f=a.expanded_url.split("af_id=")[1].split("&")[0];
        d=(h=window.prompt(h, f))?d.replaceAll(a.url, "\n"+(g[0]+"af_id="+h+"&"+g[1])):d.replaceAll(a.url, a.expanded_url)
    }
    c.value=d;
    e.appendChild(c);
    c=document.createElement("div");
    c.classList.add("imgbox");
    if(b)for(d=0;
    d<b.length;
    d++){
        let f=document.createElement("img");
        f.src=b[d].media_url_https;
        a=e.clientWidth/4;
        f.width=a;
        f.height=a/b[d].original_info.width*b[d].original_info.height;
        f.addEventListener("click", ()=>{
            f.remove()
        });
        c.appendChild(f)
    }
    e.appendChild(c)
}, sort=()=>{
    let a=document.getElementsByClassName("body")[0].children, e=[];
    for(var b=1;
    b<a.length/2;
    b++)a[2*b].value.includes("https://")||(e=e.concat(Array.from(a[2*b+1].children)), a[2*b+1].innerHTML="");
    b=0;
    for(let c=1;
    c<a.length/2;
    c++)if(!a[2*c].value.includes("https://")){
        for(let d=0;
        4>d;
        d++)b<e.length&&(a[2*c+1].appendChild(e[b]), b++);
        0==a[2*c+1].children.length&&(a[2*c+1].remove(), a[2*c].remove(), c--)
    }
}, show_log=()=>{
    var a=document.createElement("style");
    a.innerHTML='\n    .dialog {\n      width: 95%;\n      max-height: 90%;\n      border: none;\n      border-radius: 4px;\n      box-shadow: 0 0 24px 4px rgba(0, 0, 0, 0.4);\n      padding: 0;\n      font-family: "Segoe UI",Meiryo,system-ui,-apple-system,BlinkMacSystemFont,sans-serif;\n      font-weight: bold;\n      color: black !important;\n    }\n    .dialog p {\n      margin: 0;\n    }\n    .dialog::backdrop {\n      background-color: rgba(0, 0, 0, 0.4);\n    }\n    .dialog .body {\n      background-color: #fff;\n      margin: 0;\n      padding: 1em;\n      text-align: center;\n    }\n    .dialog .imgbox {\n      display: flex;\n      flex-direction: row;\n      justify-content: center;\n    }\n    .dialog p {\n      display: flex;\n      justify-content: space-evenly;\n      align-items: center;\n    }\n    .dialog .body p {\n      margin: 1em;\n    }\n    .dialog .footer {\n      background-color: #fff;\n      text-align: center;\n      margin: 0;\n      padding: 1em;\n      position: sticky;\n      bottom: 0;\n    }\n    .dialog .button {\n      width: 8em;\n      height: 2.4em;\n      border: none;\n      border-radius: 4px;\n      font-size: smaller;\n      font-weight: bold;\n      color: black !important;\n    }\n    #dialogFade .body button {\n      border: none;\n      background-color: #fff;\n    }\n    .dialog .button:hover {\n      opacity: 0.8;\n    }\n    .dialog .button.cancel {\n      background-color: #e6eae6;\n    }\n    .dialog .button.ok {\n      background-color: #0075c2;\n      color: #fff !important;\n    }\n    .dialog textarea {\n      width: 90%;\n      margin: 0.5em;\n      padding: 0.5em;\n      font-weight: bold;\n      color: black !important;\n      background-color: white;\n      height: 5em;\n      margin-top: 4em;\n    }\n\n    .dialog[open],\n    .dialog[open]::backdrop {\n      animation: fadeIn 200ms ease normal;\n    }\n    @keyframes fadeIn {\n      from {\n        opacity: 0;\n      }\n      to {\n        opacity: 1;\n      }\n    }\n    .dialog.hide,\n    .dialog.hide::backdrop {\n      animation: fadeOut 200ms ease normal;\n    }\n    @keyframes fadeOut {\n      to {\n        opacity: 0;\n      }\n    }\n    .number {\n      width: 3em;\n    }\n    .checkbox {\n      margin-bottom: 1em !important;\n      font-size: xx-small;\n      font-weight: normal;\n      justify-content: center !important;\n    }\n    ';
    document.head.insertAdjacentElement("beforeend", a);
    a=document.createElement("div");
    a.id="dialogs";
    a.innerHTML='\n    <dialog id="dialogFade" class="dialog">\n      <div class="inner">\n        <div class="body">\n        </div>\n        <div class="footer">\n          <p><button class="button cancel">\u30ad\u30e3\u30f3\u30bb\u30eb</button>\n          <button class="button cancel">\u8a70\u3081\u308b</button>\n          <button class="button ok">\u6295\u7a3f\u3059\u308b</button></p>\n        </div>\n      </div>\n    </dialog>\n    ';
    document.body.appendChild(a);
    dialogFade.showModal();
    get_tweet()
}, upflag=0, upflag2=0, upload=(a, e, b)=>{
    let c=new XMLHttpRequest;
    c.responseType="blob";
    c.open("GET", a);
    c.onreadystatechange=()=>{
        if(4==c.readyState&&200==c.status){
            var d=c.response;
            d=new File([d], "file", {
                type:d.type
            });
            var g=new FormData;
            g.append("media", d, "blob");
            d="https://upload.x.com/i/media/upload.json?command=INIT&total_bytes="+d.size+"&media_type=image%2Fjpeg&media_category=tweet_image";
            var h="";
            document.cookie.replaceAll(" ", "").split(";").forEach(function(k){
                k=k.split("=");
                "ct0"==k[0]&&(h=k[1])
            });
            var f=new XMLHttpRequest;
            f.onreadystatechange=function(){
                4==this.readyState&&m(JSON.parse(this.responseText).media_id_string)
            };
            f.open("POST", d);
            f.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA");
            f.setRequestHeader("x-csrf-token", h);
            f.setRequestHeader("x-twitter-auth-type", "OAuth2Session");
            f.withCredentials=!0;
            f.send();
            function m(k){
                var l=new XMLHttpRequest;
                l.onreadystatechange=function(){
                    4==this.readyState&&n(k)
                };
                l.open("POST", "https://upload.x.com/i/media/upload.json?command=APPEND&media_id="+k+"&segment_index=0");
                l.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA");
                l.setRequestHeader("x-csrf-token", h);
                l.setRequestHeader("x-twitter-auth-type", "OAuth2Session");
                l.withCredentials=!0;
                l.send(g)
            }
            function n(k){
                var l=new XMLHttpRequest;
                l.onreadystatechange=function(){
                    4==this.readyState&&(e[b]={
                        media_id:k, tagged_users:[]
                    }, upflag++)
                };
                l.open("POST", "https://upload.x.com/i/media/upload.json?command=FINALIZE&media_id="+k);
                l.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA");
                l.setRequestHeader("x-csrf-token", h);
                l.setRequestHeader("x-twitter-auth-type", "OAuth2Session");
                l.withCredentials=!0;
                l.send()
            }
        }
    };
    c.send()
};
init();
void+0
