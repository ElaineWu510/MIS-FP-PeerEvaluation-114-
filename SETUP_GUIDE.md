# 🎓 MIS Peer Evaluation System — 完整部署指南

## 系統架構

| 檔案 | 用途 | 使用者 |
|------|------|--------|
| `index.html` | 學生互評表單 | 全班學生 |
| `teacher.html` | 老師評分表 | 老師（密碼保護）|
| `admin.html` | 後台管理介面 | 老師（密碼保護）|
| `apps_script.gs` | Google Apps Script 後端 | 自動運作 |

**計分公式：** 同學評分平均 × 30% + 老師給分 × 70% = 最終分數

---

## Step 1 — 設定 Google Sheet + Apps Script

1. 建立新的 Google Sheet，命名為 `MIS Peer Evaluation`
2. 複製網址中的 Spreadsheet ID（`/d/` 和 `/edit` 之間的字串）
3. 在 Sheet 點選 **Extensions → Apps Script**
4. 刪除預設程式碼，貼入 `apps_script.gs` 的全部內容
5. 把第一行 `YOUR_SPREADSHEET_ID_HERE` 換成你的 Spreadsheet ID
6. 點選 **Deploy → New deployment**
   - Type: Web app
   - Execute as: **Me**
   - Who has access: **Anyone**
7. 複製產出的 Web App URL（長得像 `https://script.google.com/macros/s/AKf.../exec`）

---

## Step 2 — 設定三個 HTML 檔案

在 `index.html`、`teacher.html`、`admin.html` 三個檔案的最上方都有：

```javascript
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
const ADMIN_PASSWORD  = 'YOUR_ADMIN_PASSWORD_HERE';
```

把這兩行換成你的實際值。

> ⚠️ 三個檔案的設定值必須一致，密碼建議用英數混合（例如 `MIS2024!`）

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

1. 建立 GitHub repository（例如 `mis-peer-eval`）
2. 上傳所有 HTML 檔案（`index.html`、`teacher.html`、`admin.html`）
3. 到 **Settings → Pages → Source: main branch / root**
4. 等約 1 分鐘後，網址為：`https://你的帳號.github.io/mis-peer-eval/`

---

## 使用流程

### 老師操作
```
1. 分享 index.html 給學生填寫
2. 進入 teacher.html → 輸入密碼 → 填入10組評分 → Submit
3. 進入 admin.html → 查看缺交名單、各組報告、下載 Excel
```

### Admin 後台功能
| 頁籤 | 功能 |
|------|------|
| **Overview** | 各組提交人數概覽、缺交狀態 |
| **Missing** | 列出所有未繳交的學生姓名、學號 |
| **Group Reports** | 每組的雷達圖式評分（同學 vs 老師對比）|
| **Peer Summaries** | 各組收到的文字評語（來自哪組，但不顯示姓名）|
| **Final Scores** | 加權最終成績表 |
| **⬇ Download Excel** | 下載含5個分頁的完整報告 |

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

- Apps Script 修改後需重新 **Deploy → New deployment** 才會生效
- 老師評分可以重新提交（會覆蓋舊資料）
- 學生的評語顯示「來自第X組」，不顯示學生姓名，符合匿名需求
- Demo 模式（URL 未設定時）會用隨機假資料展示後台功能
