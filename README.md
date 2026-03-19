# AI-Selection-Relay
ブラウザ上で選択したテキストを、任意の設定済みAIチャットへ最速で転送するためのChrome拡張機能です。

## Features
- **マルチインスタンス対応**
  - 本拡張機能をコピーして個別に読み込むことで、「要約用」「英訳用」「汎用回答用」など、用途別のAIリレーを複数構築可能です。
- **URLカスタマイズ機能**
  - お気に入りのAIサービスや、特定のプロンプトを付与したURLを設定できます。
- **ワークフローの最適化**
  - 右クリックメニューからの転送により、コピー＆ペーストの手間を論理的に排除します。

## Customization
転送先のAIや用途の変更は、以下のいずれかの方法で行えます。

### 1. 拡張機能のオプション画面から変更（推奨）
1. ブラウザのツールバーにある「拡張機能アイコン」をクリック。
2. 本拡張機能の [詳細] または [オプション] を選択。
3. 設定画面で利用したいAIのURL（クエリ付き）を入力して保存してください。

### 2. ソースファイルを直接書き換え
`options.js` 内の初期URLを任意のものに書き換えてから、拡張機能を再読み込みしてください。
- 活用例: ChatGPT, Claude, Gemini, DeepL等のURL末尾にクエリを渡す設定。

## Installation
1. `Download ZIP` からソースを取得し解凍。
2. Chromeの `chrome://extensions/` で「デベロッパー モード」を有効化。
3. 「パッケージ化されていない拡張機能を読み込む」から解凍フォルダを選択。

## Feedback
不具合報告や要望は [Issues](https://github.com/KANNAGI-Hakuya/AI-Selection-Relay/issues) へ。

---
**珀夜's ゲーム Ch**
https://www.youtube.com/@hakuyaslive

(c) 2026 Hakuya Kannagi
