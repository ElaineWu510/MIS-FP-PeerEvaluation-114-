# MIS Peer Evaluation System — 完整部署指南

## 系統架構（兩班獨立）

```
.
├── index.html            ← 根目錄 landing page
├── msf/                  ← MSF 班（完整 3 個 HTML）
│   ├── index.html        學生互評表單
│   ├── teacher.html      老師評分表
│   └── admin.html        後台管理
├── im/                   ← IM 班（完整 3 個 HTML）
│   ├── index.html
│   ├── teacher.html
│   └── admin.html
└── apps_script.gs        後端程式碼（兩班共用這份原始碼）
```

**計分公式：** 同學評分平均 × 30% + 老師給分 × 70% = 最終分數

**密碼安全：** 密碼存在 Apps Script 的 Script Properties（伺服器端），**不會**出現在網頁原始碼中。檢視 HTML 原始碼看不到密碼。

---

## 重要：每個班要各做一次

下面整個 Step 1 和 Step 2 要**各做兩次**——一次給 MSF、一次給 IM。兩次會產生兩個獨立的 Google Sheet、兩個 Apps Script 部署、兩個 Web App URL。**完全互不干擾**。

---

## Step 1 — 為這個班建立 Google Sheet + Apps Script

### 1. 建立 Google Sheet

- 打開 <https://sheets.new>
- 左上角檔名改成 `MIS Peer Eval · MSF`（或 `... · IM`，看您現在在做哪一班）
- 複製網址列的 Spreadsheet ID（`/d/` 和 `/edit` 之間那串）

### 2. 貼上 Apps Script 程式碼

- Sheet 上方點選 **Extensions → Apps Script**
- 刪除預設程式碼，把 `apps_script.gs` **全部內容**貼進去
- 把 `SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'` 換成步驟 1 複製的 ID

### 3. 設定管理員密碼

- 左側選 **⚙ Project Settings**
- 往下捲到 **Script Properties** → **Add script property**
  - Property: `ADMIN_PASSWORD`
  - Value: 您想要的密碼（例如 `MSF2026!`、`IM2026!`，兩班可不同也可相同）
- 按 **Save script properties**

### 4. Deploy

- 回編輯器，**Deploy → New deployment**
- Type: `Web app`
- Execute as: **Me**
- Who has access: **Anyone**
- 點 Deploy
- **複製產出的 Web App URL**（`https://script.google.com/macros/s/AKf.../exec`），待會要用

> 改密碼：回 Script Properties 改 Value 即可，**不用重新部署**。

---

## Step 2 — 把 URL 填進該班的 HTML

假設您現在在做 MSF 班，剛拿到 MSF 專用的 URL。

打開以下**三個**檔案，各把第一個常數換掉：

- `msf/index.html`
- `msf/teacher.html`
- `msf/admin.html`

```javascript
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
// 改成
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
```

> ⚠ **不要跨班填錯** — MSF 的 URL 只能進 `msf/` 三個檔案，IM 的 URL 只進 `im/` 三個檔案。

---

## Step 3 — 填入學生名單

打開該班的 `admin.html`，找到 `ROSTER` 陣列，換成實際名單：

```javascript
const ROSTER = [
  { id:'B10901001', name:'王小明', group:1 },
  { id:'B10901002', name:'李小華', group:1 },
  // ...
];
```

MSF 班名單放在 `msf/admin.html`、IM 班名單放在 `im/admin.html`。

---

## Step 4 — 做完 MSF，再從 Step 1 重做一次給 IM

重複 Step 1–3，記得：

- Google Sheet 名稱用 `MIS Peer Eval · IM`
- Apps Script 是**新的一個專案**（不要跟 MSF 共用）
- 取得 IM 專用 URL，填進 `im/index.html`、`im/teacher.html`、`im/admin.html`
- IM 班名單填進 `im/admin.html`

---

## Step 5 — 上傳到 GitHub Pages

已經設定過 GitHub Pages 就不用再做第 3–4 步，直接 commit + push 即可。

1. 建立 GitHub repository（若已建好跳過）
2. Push 所有檔案
3. **Settings → Pages → Source: main branch / root**
4. 等約 1 分鐘，取得網址：

- 班級入口：`https://你的帳號.github.io/repo名稱/`
- MSF 學生：`https://你的帳號.github.io/repo名稱/msf/`
- MSF 老師：`https://你的帳號.github.io/repo名稱/msf/teacher.html`
- MSF 後台：`https://你的帳號.github.io/repo名稱/msf/admin.html`
- IM 三個網址比照，把 `msf/` 換成 `im/`

---

## 使用流程

### 老師操作（每班獨立）
```
1. 分享該班學生互評網址（.../msf/ 或 .../im/）給對應班級
2. 進 teacher.html → 輸入該班密碼 → 填完 10 組 → Submit
3. 進 admin.html → 查看缺交名單、各組報告、下載 Excel / PDF
```

### Admin 後台功能
| 頁籤 | 功能 |
|------|------|
| **Overview** | 各組提交人數概覽、缺交狀態 |
| **Missing** | 列出所有未繳交的學生姓名、學號 |
| **Group Reports** | 每組的評分對比（同學 vs 老師）+ **PDF 下載** |
| **Peer Summaries** | 各組收到的文字評語（匿名顯示「來自第X組」）|
| **Final Scores** | 加權最終成績表 |
| **⬇ Download Excel** | 下載含 5 個分頁的完整報告 |
| **⬇ Download This Group PDF** | 下載目前選中組別的評分報告 PDF |

### PDF 報告內容（每組一份）
- 組別標題、產生日期、評分者人數
- 最終加權分數（同學平均 30% + 老師 70%）
- 每項評分準則的同學平均 vs 老師給分對比表
- 老師文字評語
- 每位同學的細項分數表（匿名「From Group X」）
- 每位同學的文字評語（匿名）

### Excel 下載內容
| 分頁 | 說明 |
|------|------|
| Final Scores | 各組最終加權分數 |
| Submission Status | 全班繳交狀況 |
| Peer Scores | 所有學生的評分明細 |
| Teacher Scores | 老師的評分明細 |
| Peer Summaries | 所有文字評語 |

---

## 清空測試資料

如果部署完先測試過，正式啟用前要清掉測試資料：

1. 打開對應班的 Google Sheet
2. **PeerScores**、**PeerSummaries** 兩個分頁：選第 2 列到最後一列 → Delete rows（留下第 1 列標題）
3. **TeacherScores** 分頁不用處理，老師下次提交會自動覆蓋
4. 或更乾脆：直接刪掉整個分頁，下次學生一提交會自動重建

---

## 注意事項

- Apps Script 程式碼修改後：**Deploy → Manage deployments → ✏ Edit → Version: New version → Deploy**（保留原 URL）
- 改 Script Properties 的密碼：**不用重新部署**，即時生效
- 老師評分可以重新提交（會覆蓋舊資料）
- 學生的評語顯示「來自第X組」，不顯示學生姓名，符合匿名需求
- Demo 模式（URL 未設定時）會用隨機假資料展示後台功能，任何密碼都可通過

## 安全性說明

本系統安全性涵蓋：
- ✅ 檢視網頁原始碼看不到密碼（密碼在 Apps Script 後端）
- ✅ GitHub repo 公開也不會洩漏密碼
- ✅ `getData` 端點要求密碼，避免資料被直接撈取
- ✅ 老師評分送出時伺服器端驗證密碼
- ✅ MSF / IM 兩班資料完全隔離（各自獨立 Sheet 與 Apps Script）

本系統**不涵蓋**（課堂用途通常足夠）：
- ⚠ 瀏覽器 Network 面板可以看到登入時傳輸的密碼（HTTPS 已加密）
- ⚠ 無速率限制，搭配強密碼以防暴力破解
