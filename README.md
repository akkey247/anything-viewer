# React Pages Viewer

Claudeのアーティファクトで作成したReactコンポーネントをローカルで管理・プレビューするためのツールです。

## 特徴

- 📁 **ページ一覧**: `src/pages/` ディレクトリ内のファイルを自動的に一覧表示
- 👁️ **プレビュー機能**: 選択したコンポーネントやファイルをリアルタイムでプレビュー
- 💻 **多形式対応**: TSX、Markdown、SVG、Mermaid、テキストファイルに対応
- 🔄 **自動読み込み**: ファイルを追加するだけで自動的にページリストに表示
- 📝 **メタデータ**: ファイル形式に応じたコメントでページ情報を管理

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスします。

## ファイル構成

```
react-pages-viewer/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── components/
│   │   ├── PageList.tsx
│   │   ├── PagePreview.tsx
│   │   └── FileRenderer.tsx
│   └── pages/
│       ├── index.ts
│       ├── 00001_sample.md
│       ├── 00002_sample.mermaid
│       ├── 00003_sample.svg
│       ├── 00004_sample.txt
│       └── 01000_DefaultLoginPage.tsx
└── README.md
```

## 対応ファイル形式

- **.tsx** - Reactコンポーネント（動的インポートでレンダリング）
- **.md** - Markdownファイル（react-markdownでレンダリング）
- **.svg** - SVGファイル（直接HTMLとして表示）
- **.mermaid** - Mermaidダイアグラム（mermaidライブラリでレンダリング）
- **.txt** - テキストファイル（プレーンテキストとして表示）

## メタデータコメントの書き方

各ファイル形式には、そのファイル形式に適したコメント記述でメタデータを記載できます。メタデータは表示時に自動的に除去され、ページリストでの表示名や説明として使用されます。

### TSX ファイル (.tsx)

```tsx
/*
Name: コンポーネント名
Description: コンポーネントの説明
*/

import React from 'react'

export default function MyComponent() {
  return <div>Hello World</div>
}
```

### Markdown ファイル (.md)

```markdown
<!--
Name: ドキュメント名
Description: ドキュメントの説明
-->

# マークダウンタイトル

本文はここに書きます...
```

### Mermaid ダイアグラム (.mermaid)

```mermaid
%%{
  "Name": "ダイアグラム名",
  "Description": "ダイアグラムの説明"
}%%

graph TD
    A[開始] --> B[処理]
    B --> C[終了]
```

### SVG ファイル (.svg)

```xml
<!--
Name: SVG図形名
Description: SVG図形の説明
-->
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="blue" />
</svg>
```

### テキストファイル (.txt)

```text
# Name: ファイル名
# Description: ファイルの説明

実際のテキスト内容はここに書きます...
```

## 新しいページの追加方法

### 1. ファイルをpagesディレクトリに追加

`src/pages/` ディレクトリに新しいファイルを作成するだけで、自動的にページリストに表示されます。

```tsx
// src/pages/MyNewComponent.tsx
/*
Name: 新しいコンポーネント
Description: 新機能のデモンストレーション
*/

import React from 'react'

export default function MyNewComponent() {
  return (
    <div className="p-4 bg-blue-100 rounded-lg">
      <h2 className="text-xl font-bold">My New Component</h2>
      <p>This is a new page component!</p>
    </div>
  )
}
```

### 2. 自動読み込み機能

- ファイルを追加すると `src/pages/index.ts` の `import.meta.glob` により自動的に読み込まれます
- 手動でindex.tsを編集する必要はありません
- ファイル名の順序でソートされて表示されます

### 3. ファイル命名規則

ファイル名は表示順序に影響します：

- `00001_sample.md` - 数字プレフィックスで順序制御
- `01000_DefaultLoginPage.tsx` - より大きな数字で後方配置
- メタデータのNameフィールドが表示名として使用されます

### 4. Claudeのアーティファクトからの追加

1. Claudeのアーティファクトからコードをコピー
2. 適切なメタデータコメントを先頭に追加
3. `src/pages/` ディレクトリに保存
4. 自動的にページリストに表示されます

## Page型の構造

```typescript
interface Page {
  id: string           // ファイル名（拡張子なし）
  name: string         // 表示名（メタデータまたはファイル名から生成）
  description?: string // 説明（メタデータから取得）
  type: 'tsx' | 'md' | 'svg' | 'mermaid' | 'txt'
  content?: string     // ファイル内容（TSX以外）
  extension: string    // ファイル拡張子
}
```

## 技術スタック

- **React 18** - UIライブラリ
- **TypeScript** - 型安全性
- **Vite** - 高速ビルドツール（import.meta.globによる動的インポート）
- **Tailwind CSS** - スタイリング
- **Lucide React** - アイコン
- **react-markdown** - Markdownレンダリング
- **mermaid** - ダイアグラムレンダリング

## カスタマイズ

### 新しいファイル形式の追加

1. `src/pages/index.ts` の `getFileType` 関数に新しい拡張子を追加
2. `extractMetadataFromContent` 関数に新しい形式のメタデータ抽出ロジックを追加
3. `removeMetadata` 関数に新しい形式のコメント除去ロジックを追加
4. `src/components/FileRenderer.tsx` に新しいレンダラーを追加

### テーマの変更

`src/index.css` でグローバルスタイルを、各コンポーネントでTailwindクラスを編集してカスタマイズできます。

### 新しいメタデータフィールドの追加

`src/pages/index.ts` のPage型に新しいフィールドを追加し、対応するUIコンポーネントを更新してください。

### 修正内容エクスポートコマンド

```
mkdir -p src_export/components src_export/pages src_export/utils && cp -r src/components/* src_export/components/ && cp src/pages/index.ts src_export/pages/ && cp -r src/utils/* src_export/utils/ && cp src/App.tsx src_export/ && cp src/index.css src_export/ && cp src/main.tsx src_export/
```

## ライセンス

MIT License