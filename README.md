# MIS-FP-Peer-Review-114

資管系期末專題同儕互評系統（114 學年度）

## 系統組成

| 檔案 | 用途 | 使用者 |
|------|------|--------|
| `index.html` | 學生互評表單（待上傳） | 全班學生 |
| `teacher.html` | 老師評分表 | 老師（密碼保護）|
| `admin.html` | 後台管理介面 | 老師（密碼保護）|
| `apps_script.gs` | Google Apps Script 後端 | 自動運作 |

**計分公式：** 同學評分平均 × 30% + 老師給分 × 70% = 最終分數

## 部署

透過 GitHub Pages 部署，詳細設定請見 [SETUP_GUIDE.md](SETUP_GUIDE.md)。

## 使用流程

1. 老師分享 `index.html` 給學生填寫互評
2. 老師進入 `teacher.html` 輸入密碼並提交給分
3. 老師進入 `admin.html` 查看各組報告、下載 Excel

---
© 2026 NDHU MIS
