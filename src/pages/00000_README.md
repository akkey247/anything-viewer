<!--
Name: 使い方
Description: このツールの使い方
-->

# React Pages Viewer - 使い方ガイド

このツールは、Claudeのアーティファクトで作成したReactコンポーネントやドキュメントを効率的に管理・プレビューするためのWebアプリケーションです。

## 🚀 基本操作

### サイドバーの操作
- **ピン留め**: 右上のピンアイコンをクリックでサイドバーを固定表示
- **ドロワーモード**: ピン留めを解除すると、左上ホバーでドロワーが開く
- **ページ選択**: サイドバーからページをクリックしてプレビュー

### ページの表示・非表示
- **表示コントロール**: サイドバーの「Documents」横の目のアイコンをクリック
- **個別制御**: 表示コントロールモードで各ページの目のアイコンで表示/非表示を切り替え
- **設定保存**: 表示設定は自動的にクッキーに保存され、次回起動時に復元

## 📁 対応ファイル形式

### 1. TSX ファイル (.tsx)
Reactコンポーネントとして動的に読み込み・実行されます。

```tsx
/*
Name: ログインページ
Description: ユーザー認証用のログインフォーム
*/

import React from 'react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-3xl font-bold text-center">ログイン</h2>
        {/* フォームの実装 */}
      </div>
    </div>
  )
}
```

### 2. Markdown ファイル (.md)
GitHub Flavored Markdownとして表示されます。

```markdown
<!--
Name: プロジェクト仕様書
Description: システムの詳細仕様を記載
-->

# プロジェクト概要

## 機能一覧
- [ ] ユーザー認証
- [ ] データ管理
- [x] レポート生成
```

### 3. Mermaid ダイアグラム (.mermaid)
フローチャートやシーケンス図として表示されます。

```mermaid
%%{
  "Name": "ユーザー認証フロー",
  "Description": "ログインからダッシュボード表示までの流れ"
}%%

graph TD
    A[ログイン画面] --> B{認証情報確認}
    B -->|成功| C[ダッシュボード]
    B -->|失敗| D[エラー表示]
    D --> A
```

### 4. SVG ファイル (.svg)
ベクター画像として表示されます。

```xml
<!--
Name: ロゴデザイン
Description: アプリケーションのロゴ
-->
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="180" height="80" fill="#3b82f6" rx="10"/>
  <text x="100" y="55" text-anchor="middle" fill="white" font-size="20">Logo</text>
</svg>
```

### 5. テキストファイル (.txt)
プレーンテキストとして表示されます。

```text
# Name: 設定ファイル
# Description: アプリケーション設定の説明

DATABASE_URL=postgresql://localhost:5432/myapp
API_KEY=your-api-key-here
DEBUG=true
```

## 📝 新しいページの追加方法

### 1. ファイルの作成
`src/pages/` ディレクトリに新しいファイルを作成するだけで、自動的にページリストに表示されます。

### 2. ファイル命名規則
- **数字プレフィックス**: `00001_`, `01000_` など、表示順序を制御
- **拡張子**: `.tsx`, `.md`, `.mermaid`, `.svg`, `.txt` に対応
- **除外ファイル**: ファイル名が `_` で始まるファイルは自動的に読み込み除外される

### 3. メタデータの記述
各ファイル形式に応じたコメント形式でメタデータを記述してください：

| ファイル形式 | コメント形式 | 例 |
|-------------|-------------|-----|
| TSX | `/* Name: ... Description: ... */` | JSコメント |
| Markdown | `<!-- Name: ... Description: ... -->` | HTMLコメント |
| Mermaid | `%%{ "Name": "...", "Description": "..." }%%` | JSON形式 |
| SVG | `<!-- Name: ... Description: ... -->` | HTMLコメント |
| Text | `# Name: ... # Description: ...` | ハッシュコメント |

## 🔧 高度な機能

### 1. 状態の永続化
- **選択ページ**: 最後に選択したページを記憶
- **サイドバー状態**: ピン留め/ドロワーモードの設定を保存
- **表示設定**: 非表示にしたページの設定を保存
