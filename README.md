# x-delete.github.io

X 向けブックマークレット配布ページです。

## ローカルで確認する

このリポジトリは静的 HTML/CSS/JS だけで動きます。ローカル確認では、リポジトリ直下で簡易 HTTP サーバーを起動してください。

```bash
python3 -m http.server 8000
```

ブラウザで次を開きます。

```text
http://localhost:8000/
```

主なページ:

- `http://localhost:8000/delete.html`
- `http://localhost:8000/beta.html`
- `http://localhost:8000/follow.html`
- `http://localhost:8000/favorite.html`
- `http://localhost:8000/likes2.html`
- `http://localhost:8000/tools.html`

別のプロセスが `8000` 番ポートを使っている場合は、任意の空きポートを指定します。

```bash
python3 -m http.server 8080
```

## ブックマークレットを編集する

ブックマークレットの実体は `bookmarklets/*.js` にあります。直接 `js/generated-bookmarklets.js` は編集しません。

編集後は生成スクリプトを実行します。

```bash
node scripts/build-bookmarklets.js
```

生成スクリプトは各 payload の構文チェックをしてから、配布ページで使う `js/generated-bookmarklets.js` を更新します。
ブックマークレットは登録時点の JavaScript がブックマークに埋め込まれるため、payload を変更した後はページを再読み込みしてブックマークを登録し直してください。

## 動作確認

最低限、次を実行して構文エラーがないことを確認します。

```bash
node scripts/build-bookmarklets.js
node --check js/bookmarklet-builder.js
node --check js/main.js
node --check js/tools-bookmarklets.js
node --check js/generated-bookmarklets.js
find bookmarklets -maxdepth 1 -type f -name '*.js' -print | sort | xargs -r -n1 node --check
```

古い PNG payload 参照が戻っていないか確認する場合:

```bash
rg "pbs\.twimg\.com|createRemoteScriptBookmarklet" .
```
