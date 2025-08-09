# FX Risk Lot Calculator

FXトレード用のリスク計算機Webアプリです。口座残高とリスクパーセンテージから適切なロットサイズを計算し、損益設定をサポートします。

## 機能

- **リスク計算**: 口座残高とリスクパーセンテージから許容損失額を算出
- **ロット計算**: 損切幅（pips）に基づいて推奨ロットサイズを0.01刻みで計算
- **通貨ペア対応**: JPY系ペアとクロス通貨ペアの両方に対応
- **利確価格計算**: R:R比1.0/1.5/2.0での利確価格を自動計算
- **URL共有**: 計算結果をURLクエリ文字列で保存・共有可能
- **スマホ最適化**: レスポンシブデザインでモバイル端末に最適化

## 計算仕様

### 基本設定
- **口座通貨**: JPY固定
- **1標準ロット**: 100,000単位
- **pip size**: JPY絡み=0.01、それ以外=0.0001

### 計算ロジック
1. **pip価値計算**: `1lot × pip_size × 100,000` をクオート通貨で算出、必要に応じてJPYに換算
2. **推奨ロット**: `(残高×リスク％) / (1lotのJPY換算pip価値 × 損切pips)` を0.01刻みで切り下げ
3. **証拠金計算**: 名目額をレバレッジで除算
4. **利確価格**: エントリー価格 ± (pip_size × 損切pips × R倍率)

## ローカル開発

### 前提条件
- Node.js 18以上
- npm

### セットアップ
```bash
# リポジトリをクローン
git clone <repository-url>
cd fx-risk-lot-calculator

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:5173` を開いてアプリケーションにアクセスできます。

### テスト実行
```bash
npm test
```

### ビルド
```bash
npm run build
```

ビルドされたファイルは`dist`ディレクトリに出力されます。

## GitHub Pages への公開

### 1. リポジトリ設定
```bash
# GitHubリポジトリを初期化
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. GitHub Actions設定
`.github/workflows/deploy.yml`を作成:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 3. GitHub Pages有効化
1. GitHubリポジトリのSettings > Pagesにアクセス
2. Source: "Deploy from a branch"を選択
3. Branch: "gh-pages"を選択
4. 数分後、`https://<username>.github.io/<repository-name>`でアクセス可能

### 4. Vite設定（必要に応じて）
GitHubリポジトリ名がアプリ名と異なる場合、`vite.config.ts`でbase pathを設定:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/your-repository-name/',
})
```

## 技術スタック

- **フレームワーク**: React 19 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **テスト**: Vitest
- **デプロイ**: GitHub Pages + GitHub Actions

## ライセンス

MIT License
