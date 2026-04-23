# MIS Peer Evaluation System — 完整部署指南

## 系統架構

| 檔案 | 用途 | 使用者 |
|------|------|--------|
| `index.html` | 學生互評表單 | 全班學生 |
| `teacher.html` | 老師評分表 | 老師（密碼保護）|
| `admin.html` | 後台管理介面 | 老師（密碼保護）|
| `apps_script.gs` | Google Apps Script 後端 | 自動運作 |

**計分公式：** 同學評分平均 × 30% + 老師給分 × 70% = 最終分數

**密碼安全：** 密碼存在 Apps Script 的 Script Properties（伺服器端），**不會**出現在網頁原始碼中。檢視 HTML 原始碼看不到密碼。

---

## Step 1 — 設定 Google Sheet + Apps Script

1. 建立新的 Google Sheet，命名為 `MIS Peer Evaluation`
2. 複製網址中的 Spreadsheet ID（`/d/` 和 `/edit` 之間的字串）
3. 在 Sheet 點選 **Extensions → Apps Script**
4. 刪除預設程式碼，貼入 `apps_script.gs` 的全部內容
5. 把 `SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'` 換成你的 Spreadsheet ID
6. **設定管理員密碼：**
   - 左側選 **⚙ Project Settings**
   - 往下捲到 **Script Properties** → 點 **Add script property**
   - **Property：** `ADMIN_PASSWORD`
   - **Value：** 你想要的密碼（例如 `MIS2026!`）
   - 按 **Save script properties**
7. 回到編輯器，點 **Deploy → New deployment**
   - Type: `Web app`
   - Execute as: **Me**
   - Who has access: **Anyone**
8. 複製產出的 Web App URL（長得像 `https://script.google.com/macros/s/AKf.../exec`）

> 以後要改密碼：回到 Script Properties 改掉 ADMIN_PASSWORD 的 Value 即可，**不用重新部署、不用改程式碼**。

---

## Step 2 — 設定 HTML 檔案

在 `index.html`、`teacher.html`、`admin.html` 三個檔案的最上方都有：

```javascript
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
```

把這一行換成 Step 1 取得的 Web App URL。

> 三個檔案的 URL 要一致。**不再需要設定密碼**——密碼已改成由後端驗證。

---

## Step 3 — 填入學生名單（admin.html）

打開 `admin.html`，找到 `ROSTER` 陣列，把 Student 01~30 換成實際名單：

```javascript
const ROSTER = [
  { id:'B10901001', name:'王小明', group:1 },
  { id:'B10901002', name:'李小華', group:1 },
  // ...
];
```

---

## Step 4 — 上傳到 GitHub Pages

1. 建立 GitHub repository
2. 上傳所有 HTML 檔案
3. 到 **Settings → Pages → Source: main branch / root**
4. 等約 1 分鐘後，網址為：`https://你的帳號.github.io/repo名稱/`

---

## 使用流程

### 老師操作
```
1. 分享 index.html 給學生填寫
2. 進入 teacher.html → 輸入密碼 → 填入10組評分 → Submit
3. 進入 admin.html → 查看缺交名單、各組報告、下載 Excel / PDF
```

### Admin 後台功能
| 頁籤 | 功能 |
|------|------|
| **Overview** | 各組提交人數概覽、缺交狀態 |
| **Missing** | 列出所有未繳交的學生姓名、學號 |
| **Group Reports** | 每組的評分對比（同學 vs 老師）+ **PDF 下載** |
| **Peer Summaries** | 各組收到的文字評語（匿名顯示「來自第X組」）|
| **Final Scores** | 加權最終成績表 |
| **⬇ Download Excel** | 下載含5個分頁的完整報告 |
| **⬇ Download This Group PDF** | 下載目前選中組別的評分報告 PDF |
| **⬇ Download All Group PDFs** | 下載全班 10 組合一的 PDF |

### PDF 報告內容（每組一份）
- 組別標題、產生日期、評分者人數
- 最終加權分數（同學平均 30% + 老師 70%）
- 每項評分準則的同學平均 vs 老師給分對比表
- 老師文字評語
- 每位同學的細項分數表（匿名，只顯示「From Group X」）
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

## 注意事項

- Apps Script 修改後需要 **Deploy → Manage deployments → Edit（鉛筆）→ 版本選 New version → Deploy** 才會生效
- 改 Script Properties 的密碼**不用重新部署**，即時生效
- 老師評分可以重新提交（會覆蓋舊資料）
- 學生的評語顯示「來自第X組」，不顯示學生姓名，符合匿名需求
- Demo 模式（URL 未設定時）會用隨機假資料展示後台功能，所有密碼都可以通過

## 安全性說明

本系統安全性涵蓋：
- ✅ 檢視網頁原始碼看不到密碼（密碼在 Apps Script 後端）
- ✅ GitHub repo 公開也不會洩漏密碼
- ✅ `getData` 端點要求密碼，避免資料被直接撈取
- ✅ 老師評分送出時伺服器端驗證密碼

本系統**不涵蓋**（課堂用途通常足夠）：
- ⚠ 瀏覽器 Network 面板可以看到登入時傳輸的密碼（HTTPS 已加密）
- ⚠ 無速率限制，搭配強密碼以防暴力破解
