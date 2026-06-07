var $jscomp=$jscomp|| {
};
$jscomp.scope= {
};
function parseInitialStateText(a) {
    var b=a.indexOf("INITIAL_STATE"), c=a.indexOf("{", b);
    if(0>b||0>c)return null;
    for(var u=0, h=!1, p="", r=!1, k=c;
    k<a.length;
    k++) {
        var q=a[k];
        if(h) {
            if(r)r=!1;
            else if("\\"===q)r=!0;
            else if(q===p)h=!1;
            continue
        }
        if('"'===q||"'"===q) {
            h=!0;
            p=q;
            continue
        }
        if("{"===q)u++;
        if("}"===q&&0===--u)return JSON.parse(a.slice(c, k+1))
    }
    return null
}
function readInitialState() {
    for(var a=document.getElementsByTagName("script"), b=0;
    b<a.length;
    b++) {
        var c=a[b].textContent||"";
        if(c.includes("INITIAL_STATE")) {
            c=parseInitialStateText(c);
            if(c)return c
        }
    }
    throw Error("INITIAL_STATE が見つからない、または解析できません")
}
$jscomp.createTemplateTagFirstArg=function(a) {
    return a.raw=a
};
$jscomp.createTemplateTagFirstArgWithRaw=function(a, b) {
    a.raw=b;
    return a
};
document.cookie.split("; ").forEach(function(a) {
    a=a.split("=");
    "ct0"==a[0]&&(window.t=a[1])
});
var _$jscomp$1=readInitialState(), a$jscomp$1=_$jscomp$1.entities.users.entities[Object.keys(_$jscomp$1.entities.users.entities)[0]];
n=a$jscomp$1.screen_name;
d= {
    variables: {
        userId:a$jscomp$1.id_str, count:20, includePromotedContent:!1, withClientEventToken:!1, withBirdwatchNotes:!1, withVoice:!0, withV2Timeline:!0
    }, features: {
    }
};
f=_$jscomp$1.featureSwitch.defaultConfig;
g=function(a) {
    for(var b=webpackChunk_twitter_responsive_web, c=b.length;
    c--;
    )for(var u in b[c][1])try {
        if(1==b[c][1][u].length) {
            var h= {
            };
            b[c][1][u](h);
            if(h.exports.operationName==a) {
                for(var p=h.exports.metadata.featureSwitches, r= {
                }, k=p.length;
                k--;
                )r[p[k]]=p[k]in f?f[p[k]].value:!0;
                return[h.exports.queryId, r]
            }
        }
    }
    catch(v) {
    }
};
x=function(a) {
    a.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA");
    a.setRequestHeader("x-csrf-token", t);
    a.setRequestHeader("x-twitter-active-user", "yes");
    a.setRequestHeader("x-twitter-auth-type", "OAuth2Session");
    a.setRequestHeader("x-twitter-client-language", "ja");
    a.setRequestHeader("content-type", "application/json");
    a.withCredentials=!0
};
m=0;
e=function(a) {
    var b=new XMLHttpRequest;
    b.open("POST", "https://x.com/i/api/graphql/"+g("UnfavoriteTweet")[0]+"/UnfavoriteTweet");
    x(b);
    b.onload=function() {
        m++;
        l.innerText=m+"件削除しました"
    };
    b.send(JSON.stringify( {
        variables: {
            tweet_id:a
        }
    }))
};
z=function(a) {
    a?alert("API制限です。\n"+(new Date(a)).toLocaleTimeString()+"に解除されますので、それ以降に再度お試し下さい"):alert("完了しました。\nサークルから外された、ブロックされたなどにより、全て削除できない場合があります")
};
q=function(a) {
    var b=g("Likes");
    a.features=b[1];
    a="?"+Object.entries(a).map(function(u) {
        return u[0].replaceAll("%22", "")+"="+encodeURIComponent(JSON.stringify(u[1]))
    }).join("&");
    var c=new XMLHttpRequest;
    c.open("GET", "https://x.com/i/api/graphql/"+b[0]+"/Likes"+a);
    x(c);
    c.onreadystatechange=function() {
        if(4==c.readyState)if(200==c.status) {
            var u=!0, h, p=JSON.parse(c.responseText).data.user.result.timeline_v2.timeline.instructions;
            if(0==p.length)z();
            else {
                var r=0;
                a:for(;
                r<p.length;
                r++) {
                    if("entries"in p[r])var k=p[r].entries;
                    else if("entry"in p[r])k=[p[r].entry];
                    else continue;
                    try {
                        for(h=0;
                        h<k.length;
                        h++)try {
                            if(!k[h].entryId.includes("promoted")&&!k[h].entryId.includes("cursor")) {
                                var v=k[h].content.itemContent.tweet_results.result;
                                "tweet"in v&&(v=v.tweet);
                                e(v.rest_id);
                                u=!1
                            }
                            else if(k[h].entryId.includes("bottom")) {
                                var w=JSON.parse(JSON.stringify(d));
                                w.variables.cursor=k[h].content.value;
                                u?z():q(w);
                                break a
                            }
                        }
                        catch(y) {
                        }
                    }
                    catch(y) {
                    }
                }
            }
        }
        else z(1E3*Number(c.getResponseHeader("X-Rate-Limit-Reset")))
    };
    c.send()
};
l=document.createElement("div");
l.style.cssText="z-index:99999;width:80%;height:80px;position:fixed;background-color:#fbf7f7;color:#000;inset:0;margin:auto;white-space:nowrap;text-align:center;line-height:80px;font-size:20px;font-weight:bold;font-family:sans-serif;";
"x.com"!=window.location.host?alert("Twitter(X)を開いた状態で実行してください"):window.confirm("@"+n+"の\nいいねを削除します")&&window.confirm("開発者は一切の責任を負いかねます。\n削除を開始しますか？")&&(l.innerHTML="0件削除しました", alert("このアラートを閉じると開始します。\nXの画面は開いたままにしていてください"), document.body.appendChild(l), q(d));
void+0
