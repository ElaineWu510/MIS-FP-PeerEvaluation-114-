# GitHub 部署指令步驟

> **Repo 名稱建議：** `MIS-FP-Peer-Review-114`
> （GitHub 不允許 repo 名稱包含空格或括號，原本的 `MIS-FP-Peer Review (114)` 會被自動轉成此格式）

---

## Step 1 — 在 GitHub 建立 repository

前往 <https://github.com/new> 並填寫：

- **Repository name:** `MIS-FP-Peer-Review-114`
- **Visibility:** Public（GitHub Pages 免費版需要公開）
- **不要** 勾選 "Add a README"、"Add .gitignore"、"Add license"（這些我已經準備好了）
- 點擊 **Create repository**

建立後請記下您的 repo URL，格式為：
`https://github.com/您的帳號/MIS-FP-Peer-Review-114.git`

---

## Step 2 — 開啟終端機（Terminal）並執行以下指令

打開 macOS 的「終端機」應用程式，逐行複製貼上以下指令：

```bash
# 1. 切換到專案資料夾
cd "/Users/yi-lingwu/Documents/Claude/Projects/MIS課程/mis-fp-peer-review-114"

# 2. 初始化 git
git init
git branch -M main

# 3. 加入所有檔案並建立第一次 commit
git add .
git commit -m "Initial commit: MIS peer evaluation system"

# 4. 連接到您的 GitHub repo（請把 <您的帳號> 換成您的 GitHub username）
git remote add origin https://github.com/<您的帳號>/MIS-FP-Peer-Review-114.git

# 5. 推送到 GitHub
git push -u origin main
```

執行 `git push` 時系統會要求您登入 GitHub：
- **Username:** 您的 GitHub 帳號
- **Password:** 不是帳號密碼，是 **Personal Access Token (PAT)**
  - 若沒有 PAT，前往 <https://github.com/settings/tokens> → Generate new token (classic) → 勾選 `repo` → 產生並複製

---

## Step 3 — 啟用 GitHub Pages

1. 進入您的 repo 網頁
2. 點 **Settings → Pages**
3. **Source:** 選 `Deploy from a branch`
4. **Branch:** 選 `main` / `/ (root)`
5. 點 **Save**
6. 等約 1 分鐘，網址會是：
   `https://您的帳號.github.io/MIS-FP-Peer-Review-114/`

---

## Step 4 — 之後要更新檔案時

例如補上 `index.html` 或修改程式：

```bash
cd "/Users/yi-lingwu/Documents/Claude/Projects/MIS課程/mis-fp-peer-review-114"
git add .
git commit -m "Add index.html"
git push
```

---

## 遇到問題？

- **`git: command not found`** → 先安裝 Xcode Command Line Tools：`xcode-select --install`
- **推送時卡住** → 可能 remote 已存在，執行：`git remote set-url origin https://github.com/您的帳號/MIS-FP-Peer-Review-114.git`
- **想改用 SSH** → 把 remote 換成 `git@github.com:您的帳號/MIS-FP-Peer-Review-114.git`（需先設定 SSH key）
