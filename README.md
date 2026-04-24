# MIS-FP-PeerEvaluation-114

資管系期末專題同儕互評系統（114 學年度）· 兩班獨立部署

## 資料夾結構

```
.
├── index.html            ← 根目錄 landing page（連到兩班入口）
├── msf/                  ← MSF 班
│   ├── index.html        學生互評表單
│   ├── teacher.html      老師評分表
│   └── admin.html        後台管理
├── im/                   ← IM 班
│   ├── index.html
│   ├── teacher.html
│   └── admin.html
├── apps_script.gs        Google Apps Script 後端（兩班共用這份程式碼）
├── SETUP_GUIDE.md        部署/設定說明
└── DEPLOY_COMMANDS.md    git 指令
```

## 兩班各自需要

兩個班完全獨立，互不影響：

| 資源 | MSF | IM |
|---|---|---|
| Google Sheet | `MIS Peer Eval · MSF` | `MIS Peer Eval · IM` |
| Apps Script 專案 | Script A（綁 MSF Sheet）| Script B（綁 IM Sheet）|
| Web App URL | 填進 `msf/` 三個 HTML | 填進 `im/` 三個 HTML |
| `ADMIN_PASSWORD`（Script Properties）| 可獨立設定 | 可獨立設定 |
| ROSTER 學生名單 | `msf/admin.html` | `im/admin.html` |

## 網址（GitHub Pages 部署後）

- 班級入口頁：`https://elainewu510.github.io/MIS-FP-PeerEvaluation-114-/`
- MSF 學生互評：`https://elainewu510.github.io/MIS-FP-PeerEvaluation-114-/msf/`
- MSF 老師評分：`https://elainewu510.github.io/MIS-FP-PeerEvaluation-114-/msf/teacher.html`
- MSF 後台管理：`https://elainewu510.github.io/MIS-FP-PeerEvaluation-114-/msf/admin.html`
- IM 三個網址比照 `msf/` 格式改成 `im/`

## 計分公式

同學評分平均 × 30% + 老師給分 × 70% = 最終分數

## 密碼安全

管理員密碼存在 Apps Script 的 Script Properties（伺服器端），**不會**出現在 HTML 原始碼中。學生檢視網頁原始碼或拉取 GitHub repo 都看不到密碼。

完整部署步驟請見 [SETUP_GUIDE.md](SETUP_GUIDE.md)。

---
© 2026 NDHU MIS
