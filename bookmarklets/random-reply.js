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
    var b=location.pathname.split("/");
    if(19!=b[b.length-1].length)alert("\u30c4\u30a4\u30fc\u30c8\u3092\u958b\u3044\u3066\u304f\u3060\u3055\u3044");
    else{
        window.start_id=b[b.length-1];
        document.cookie.split("; ").forEach(a=>{
            a=a.split("=");
            "ct0"==a[0]&&(window.ct0=a[1])
        });
        b=readInitialState();
        let c=b.entities.users.entities[Object.keys(b.entities.users.entities)[0]];
        window.username=c.screen_name;
        window.data1={
            variables:{
                userId:c.id_str, count:20, includePromotedContent:!1
            }, features:{
            }
        };
        window.FS=b.featureSwitch.defaultConfig;
        show_log()
    }
}, getquery=b=>{
    let a=webpackChunk_twitter_responsive_web;
    for(let e=a.length;
    e--;
    )for(let c in a[e][1])try{
        if(1==a[e][1][c].length){
            let h={
            };
            a[e][1][c](h);
            if(h.exports.operationName==b){
                let k=h.exports.metadata.featureSwitches, l={
                };
                for(let g=k.length;
                g--;
                )l[k[g]]=k[g]in FS?FS[k[g]].value:!0;
                return[h.exports.queryId, l]
            }
        }
    }
    catch{
    }
}, setxhr=b=>{
    b.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA");
    b.setRequestHeader("x-csrf-token", ct0);
    b.setRequestHeader("x-twitter-active-user", "yes");
    b.setRequestHeader("x-twitter-auth-type", "OAuth2Session");
    b.setRequestHeader("x-twitter-client-language", "ja");
    b.withCredentials=!0
}, get_prop=b=>"?"+Object.entries(b).map(a=>`${a[0].replaceAll("%22","")}=${encodeURIComponent(JSON.stringify(a[1]))}`).join("&"), count=0, ids=[], tws=[], start_id="", create=(b=start_id)=>{
    if(""==tws[count])alert("\u30a8\u30e9\u30fc : \u7a7a\u767d\u884c\u304c\u3042\u308a\u307e\u3059");
    else{
        var a=new XMLHttpRequest, e=getquery("CreateTweet"), c={
            variables:{
                batch_compose:0==count?"BatchFirst":"BatchSubsequent", dark_request:!1, semantic_annotation_ids:[], media:{
                    media_entities:[], possibly_sensitive:!1
                }, tweet_text:tws[count]
            }, queryId:e[0], features:e[1]
        };
        ""!=b&&(c.variables.reply={
            in_reply_to_tweet_id:b, exclude_reply_user_ids:[]
        });
        a.open("POST", "https://x.com/i/api/graphql/"+e[0]+"/CreateTweet");
        setxhr(a);
        a.setRequestHeader("content-type", "application/json");
        a.onreadystatechange=()=>{
            if(4==a.readyState&&200==a.status){
                let l=JSON.parse(a.responseText).data.create_tweet.tweet_results.result;
                var k=l.rest_id;
                ids.push(k);
                count++;
                if(count<tws.length)create(k);
                else{
                    let g=new XMLHttpRequest;
                    k=getquery("UserTweets");
                    let q=l.legacy.conversation_id_str;
                    g.open("GET", "https://x.com/i/api/graphql/"+k[0]+"/UserTweets"+get_prop({
                        variables:{
                            userId:l.legacy.user_id_str, count:20, includePromotedContent:!0, withQuickPromoteEligibilityTweetFields:!0, withVoice:!0, withV2Timeline:!0
                        }, fieldToggles:{
                            withArticlePlainText:!1
                        }, features:k[1]
                    }));
                    setxhr(g);
                    g.onreadystatechange=()=>{
                        if(4==g.readyState&&200==g.status){
                            var m=JSON.parse(g.responseText).data.user.result.timeline_v2.timeline.instructions;
                            a:for(var f=0;
                            f<m.length;
                            f++)if("TimelineAddEntries"==m[f].type){
                                var d=m[f].entries;
                                let u=0;
                                for(let n=0;
                                n<d.length;
                                n++){
                                    let p=[];
                                    if(d[n].entryId.includes("conversation"))p=d[n].content.items;
                                    else if(d[n].entryId.includes("tweet")&&0!=n)p.push({
                                        item:d[n].content
                                    });
                                    else continue;
                                    for(let r=0;
                                    r<p.length;
                                    r++){
                                        let t=p[r].item.itemContent.tweet_results.result.legacy;
                                        if(q==t.conversation_id_str)if(u<Number(t.id_str))u=Number(t.id_str);
                                        else{
                                            if(confirm("\u30c4\u30ea\u30fc\u5d29\u308c\u3092\u691c\u77e5\u3057\u307e\u3057\u305f\n\u518d\u6295\u7a3f\u3057\u307e\u3059\u304b\uff1f")){
                                                let v=0;
                                                for(m=0;
                                                m<ids.length;
                                                m++)f=new XMLHttpRequest, d=getquery("DeleteTweet"), f.open("POST", "https://x.com/i/api/graphql/"+d[0]+"/DeleteTweet"), setxhr(f), f.setRequestHeader("content-type", "application/json"), f.onreadystatechange=()=>{
                                                    4==a.readyState&&200==a.status&&(v++, v==ids.length&&(ids=[], count=0, create()))
                                                }, f.send(JSON.stringify({
                                                    variables:{
                                                        tweet_id:ids[m], dark_request:!1
                                                    }, queryId:d[0]
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
                    g.send()
                }
            }
        };
        var h=setInterval(()=>{
            upflag==upflag2&&(a.send(JSON.stringify(c)), clearInterval(h))
        }, 10)
    }
}, show_log=()=>{
    function b(c, h){
        c=document.querySelector("#"+c);
        c.classList.add("hide");
        c.addEventListener("animationend", function l(){
            document.body.classList.remove("inactive");
            this.classList.remove("hide");
            this.close();
            this.removeEventListener("animationend", l);
            h&&document.getElementById("dialogs").remove()
        })
    }
    var a=document.createElement("style");
    a.innerHTML='\n    .dialog {\n      width: 95%;\n      height: 90%;\n      border: none;\n      border-radius: 4px;\n      box-shadow: 0 0 24px 4px rgba(0, 0, 0, 0.4);\n      padding: 0;\n      font-family: "Segoe UI",Meiryo,system-ui,-apple-system,BlinkMacSystemFont,sans-serif;\n      font-weight: bold;\n      color: black !important;\n    }\n    .dialog p {\n      margin: 0;\n    }\n    .dialog::backdrop {\n      background-color: rgba(0, 0, 0, 0.4);\n    }\n    .dialog .body {\n      background-color: #fff;\n      margin: 0;\n      padding: 1em;\n      text-align: center;\n    }\n    .dialog .imgbox {\n      display: flex;\n      flex-direction: row;\n      justify-content: center;\n    }\n    .dialog p {\n      display: flex;\n      justify-content: space-evenly;\n      align-items: center;\n    }\n    .dialog .body p {\n      margin: 1em;\n    }\n    .dialog .footer {\n      background-color: #fff;\n      text-align: center;\n      margin: 0;\n      padding: 1em;\n      position: sticky;\n      bottom: 0;\n    }\n    .dialog .button {\n      width: 8em;\n      height: 2.4em;\n      border: none;\n      border-radius: 4px;\n      font-size: smaller;\n      font-weight: bold;\n      color: black !important;\n    }\n    #dialogFade .body button {\n      border: none;\n      background-color: #fff;\n    }\n    .dialog .button:hover {\n      opacity: 0.8;\n    }\n    .dialog .button.cancel {\n      background-color: #e6eae6;\n    }\n    .dialog .button.ok {\n      background-color: #0075c2;\n      color: #fff !important;\n    }\n    .dialog textarea {\n      width: 90%;\n      height: 80%;\n      margin: 0.5em;\n      padding: 0.5em;\n      font-weight: bold;\n      color: black !important;\n      background-color: white;\n      margin-top: 4em;\n      white-space: pre;\n      overflow-wrap: normal;\n      overflow-x: auto;\n    }\n    .dialog .inner {\n      text-align: center;\n      height: 100%;\n    }\n\n    .dialog[open],\n    .dialog[open]::backdrop {\n      animation: fadeIn 200ms ease normal;\n    }\n    @keyframes fadeIn {\n      from {\n        opacity: 0;\n      }\n      to {\n        opacity: 1;\n      }\n    }\n    .dialog.hide,\n    .dialog.hide::backdrop {\n      animation: fadeOut 200ms ease normal;\n    }\n    @keyframes fadeOut {\n      to {\n        opacity: 0;\n      }\n    }\n    .number {\n      width: 3em;\n    }\n    .checkbox {\n      margin-bottom: 1em !important;\n      font-size: xx-small;\n      font-weight: normal;\n      justify-content: center !important;\n    }\n    ';
    document.head.insertAdjacentElement("beforeend", a);
    a=document.createElement("div");
    a.id="dialogs";
    let e=localStorage.getItem("links");
    a.innerHTML='\n    <dialog id="dialogFade" class="dialog">\n      <div class="inner">\n        <textarea id="text">'+(null===e?"":e)+'</textarea>\n        <div class="footer">\n          <p><button class="button cancel">\u30ad\u30e3\u30f3\u30bb\u30eb</button>\n          <button class="button ok">\u6295\u7a3f\u3059\u308b</button></p>\n        </div>\n      </div>\n    </dialog>\n    ';
    document.body.appendChild(a);
    dialogFade.showModal();
    document.querySelectorAll(".button.cancel")[0].addEventListener("click", ()=>{
        b("dialogFade", !0)
    });
    document.querySelector(".button.ok").addEventListener("click", ()=>{
        ids=[];
        count=0;
        var c=document.getElementById("text").value;
        localStorage.setItem("links", c);
        c=c.split("\n");
        if(7>c.length)alert("\u884c\u30927\u3064\u4ee5\u4e0a\u6307\u5b9a\u3057\u3066\u304f\u3060\u3055\u3044");
        else{
            var h=getRandomUniqueNumbers(c.length, 7);
            tws=[];
            for(let k=0;
            k<h.length;
            k++)tws.push(c[h[k]]);
            create();
            b("dialogFade", !1)
        }
    })
}, getRandomUniqueNumbers=(b, a)=>{
    if(b<a)throw Error("\u7bc4\u56f2\u304c\u72ed\u3059\u304e\u3066\u91cd\u8907\u306a\u3057\u306e\u6570\u5b57\u3092\u751f\u6210\u3067\u304d\u307e\u305b\u3093");
    const e=new Set;
    for(;
    e.size<a;
    )e.add(Math.floor(Math.random()*b));
    return Array.from(e)
}, upflag=0, upflag2=0, upload=(b, a, e)=>{
    let c=new XMLHttpRequest;
    c.responseType="blob";
    c.open("GET", b);
    c.onreadystatechange=()=>{
        if(4==c.readyState&&200==c.status){
            var h=c.response;
            h=new File([h], "file", {
                type:h.type
            });
            var k=new FormData;
            k.append("media", h, "blob");
            h="https://upload.x.com/i/media/upload.json?command=INIT&total_bytes="+h.size+"&media_type=image%2Fjpeg&media_category=tweet_image";
            var l="";
            document.cookie.replaceAll(" ", "").split(";").forEach(function(f){
                f=f.split("=");
                "ct0"==f[0]&&(l=f[1])
            });
            var g=new XMLHttpRequest;
            g.onreadystatechange=function(){
                4==this.readyState&&q(JSON.parse(this.responseText).media_id_string)
            };
            g.open("POST", h);
            g.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA");
            g.setRequestHeader("x-csrf-token", l);
            g.setRequestHeader("x-twitter-auth-type", "OAuth2Session");
            g.withCredentials=!0;
            g.send();
            function q(f){
                var d=new XMLHttpRequest;
                d.onreadystatechange=function(){
                    4==this.readyState&&m(f)
                };
                d.open("POST", "https://upload.x.com/i/media/upload.json?command=APPEND&media_id="+f+"&segment_index=0");
                d.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA");
                d.setRequestHeader("x-csrf-token", l);
                d.setRequestHeader("x-twitter-auth-type", "OAuth2Session");
                d.withCredentials=!0;
                d.send(k)
            }
            function m(f){
                var d=new XMLHttpRequest;
                d.onreadystatechange=function(){
                    4==this.readyState&&(a[e]={
                        media_id:f, tagged_users:[]
                    }, upflag++)
                };
                d.open("POST", "https://upload.x.com/i/media/upload.json?command=FINALIZE&media_id="+f);
                d.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA");
                d.setRequestHeader("x-csrf-token", l);
                d.setRequestHeader("x-twitter-auth-type", "OAuth2Session");
                d.withCredentials=!0;
                d.send()
            }
        }
    };
    c.send()
};
init();
void+0
