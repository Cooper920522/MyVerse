# Myverse

> 你在網路上的專屬宇宙 · Your universe on the internet

Myverse 是一個針對台灣創作者設計的個人主頁生成器，讓你把所有連結、社群帳號和內容整合在一個漂亮的個人頁面。類似 LinkTree，但針對台灣使用者習慣深度優化。

![Nuxt](https://img.shields.io/badge/Nuxt-3-00DC82?style=flat&logo=nuxt.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat&logo=vercel)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat&logo=tailwindcss)
![Vue](https://img.shields.io/badge/Vue-3-4FC08D?style=flat&logo=vue.js)

---

## 功能特色

### 個人主頁
- 自訂 username，專屬網址 `myverse.cc/你的名字`
- 編輯顯示名稱、個人簡介、頭貼上傳
- SEO 優化，Google 可搜尋到個人頁面
- 分享到 LINE / Facebook 自動顯示預覽圖（Open Graph）
- 一鍵複製個人頁連結

### 七種卡片類型
| 類型 | 說明 |
|------|------|
| 連結卡片 | 一般網址連結，支援自訂圖示 |
| YouTube 卡片 | 嵌入 YouTube 影片，自動轉換 embed 格式 |
| 圖片卡片 | 上傳圖片展示 |
| 蝦皮商品卡片 | 貼上蝦皮網址自動抓取商品圖片和名稱 |
| LINE 加好友卡片 | 綠色品牌樣式，點擊直接開啟 LINE |
| Pressplay 訂閱卡片 | 自動抓取課程封面和標題 |
| 限時優惠卡片 | 設定到期時間，倒計時自動顯示，到期自動隱藏 |

### 個人化設定
- 背景顏色（36 種色系）或背景圖片上傳
- 連結卡片圓角樣式（方形 / 圓角 / 膠囊）
- 連結卡片背景顏色（18 種選擇）
- 文字顏色自動適應背景深淺（W3C 亮度公式）
- 連結自訂圖示（14 種社群平台預設 icon + 自訂上傳）

### 連結管理
- 拖拉排序
- 連結開關（暫時隱藏，不需要刪除）
- 新增 / 編輯 / 刪除卡片
- 限時優惠到期時間設定與編輯

### 數據統計
- 總點擊數 / 今日點擊數
- 總訪客數 / 今日訪客數
- 連結數量

### 帳號功能
- Google OAuth 一鍵登入
- Email / Password 登入與註冊
- Dashboard 即時預覽（手機框樣式）

---

## 技術架構

### 前端
| 技術 | 說明 |
|------|------|
| Nuxt 3 | Vue 3 全端框架，SSR 確保 SEO 效果 |
| Vue 3 | Composition API、響應式系統、元件化 |
| Tailwind CSS | 原子化 CSS 樣式 |
| vue-draggable-plus | 拖拉排序功能 |

### 後端
| 技術 | 說明 |
|------|------|
| Nuxt API Routes | `server/api/` 資料夾，H3 框架 |
| Supabase | PostgreSQL 資料庫 + Auth + Storage |

### 部署
| 技術 | 說明 |
|------|------|
| Vercel | 自動 CI/CD，push 到 GitHub 自動部署 |

---

## 資料庫結構

```
auth.users（Supabase 內建）
      ↓
profiles（用戶個人資料）
      ↓
links（用戶的連結卡片）
      ↓
link_clicks（連結點擊紀錄）

page_views（頁面訪客紀錄）
```

### profiles 表
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | uuid | 對應 auth.users.id |
| username | text | 個人頁網址（唯一） |
| display_name | text | 顯示名稱 |
| bio | text | 個人簡介 |
| avatar_url | text | 頭貼網址 |
| bg_type | text | 背景類型（color / image） |
| bg_color | text | 背景顏色 hex 值 |
| bg_image_url | text | 背景圖片網址 |
| link_radius | text | 連結圓角（square / rounded / pill） |
| link_color | text | 連結卡片背景顏色 |
| created_at | timestamptz | 建立時間 |

### links 表
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | uuid | 主鍵 |
| profile_id | uuid | 對應 profiles.id |
| title | text | 連結標題 |
| url | text | 網址 |
| type | text | 卡片類型（link / youtube / image / shopee / line / pressplay） |
| position | int4 | 排列順序 |
| thumbnail | text | 商品 / 課程封面圖片網址 |
| is_visible | boolean | 顯示 / 隱藏開關 |
| expires_at | timestamptz | 限時優惠到期時間 |
| icon_url | text | 連結自訂圖示 |
| created_at | timestamptz | 建立時間 |

### link_clicks 表
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | uuid | 主鍵 |
| link_id | uuid | 對應 links.id |
| clicked_at | timestamptz | 點擊時間 |

### page_views 表
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | uuid | 主鍵 |
| profile_id | uuid | 對應 profiles.id |
| viewed_at | timestamptz | 訪客造訪時間 |

---

## 元件結構

```
app/components/
  ├── CountdownBadge.vue  # 限時優惠倒計時標籤
  ├── LinkCard.vue        # 卡片渲染（支援六種類型）
  ├── StatCard.vue        # 統計數字格子
  ├── AvatarDisplay.vue   # 頭像顯示
  ├── GreenButton.vue     # 綠色漸層按鈕
  └── IconPicker.vue      # 連結圖示選擇器
```

---

## 專案結構

```
myverse/
├── app/
│   ├── components/        # 可重複使用的 Vue 元件
│   ├── pages/
│   │   ├── index.vue      # 首頁 Landing page
│   │   ├── login.vue      # 登入 / 註冊頁
│   │   ├── dashboard.vue  # 後台（需要登入）
│   │   └── [username].vue # 公開個人頁（動態路由）
│   ├── plugins/
│   │   └── supabase.client.ts
│   └── app.vue
├── server/
│   └── api/
│       └── fetch-og.post.ts  # 抓取 Open Graph 資料
├── public/
│   ├── Logo.png
│   └── favicon.svg
├── .env                   # 環境變數（不上傳 GitHub）
├── nuxt.config.ts
└── package.json
```

---

## 本地開發

### 環境需求
- Node.js 18.0 以上
- npm

### 安裝步驟

**1. Clone 專案**
```bash
git clone https://github.com/Cooper920522/MyVerse.git
cd MyVerse
```

**2. 安裝套件**
```bash
npm install
```

**3. 設定環境變數**

建立 `.env` 檔案：
```
SUPABASE_URL=你的 Supabase Project URL
SUPABASE_KEY=你的 Supabase Publishable Key
```

**4. 啟動開發伺服器**
```bash
npm run dev
```

打開 `http://localhost:3000`

---

## 環境變數

| 變數 | 說明 | 取得方式 |
|------|------|----------|
| SUPABASE_URL | Supabase 專案網址 | Supabase 後台 → Settings → API |
| SUPABASE_KEY | Supabase Publishable Key | Supabase 後台 → Settings → API |

---

## 部署

本專案部署在 Vercel，連結 GitHub repo 後每次 push 自動部署。

```bash
git add .
git commit -m "你的更新說明"
git push
```

push 之後 Vercel 自動觸發部署，約 1-2 分鐘後生效。

---

## 技術亮點

### SSR 與 SEO
使用 Nuxt 3 的 SSR（伺服器端渲染），個人頁面在伺服器端渲染完成後再送給瀏覽器，Google 可以完整索引每個用戶的個人頁面內容。每個頁面都有動態產生的 Open Graph meta tag，分享到社群時自動顯示預覽圖。

### 蝦皮 / Pressplay 卡片原理
瀏覽器有 CORS 限制，無法直接抓取第三方頁面。透過 Nuxt 的 `server/api/` 在伺服器端發送請求，解析頁面的 Open Graph meta tag，取得標題和封面圖後回傳給前端顯示。

### 即時預覽
Dashboard 左側設定區和右側預覽區共用同一份 `profile` 和 `links` 響應式資料，修改設定時 Vue 的響應式系統自動更新預覽畫面，不需要任何額外的同步邏輯。

### 文字顏色自動適應
使用 W3C 亮度公式計算背景顏色的深淺，自動決定文字要用深色還是淺色，確保任何背景下的文字可讀性。

### 限時優惠倒計時
`CountdownBadge` 元件內建計時器，每秒更新一次，到期時自動隱藏。公開頁面在載入時過濾掉已到期的連結，不需要後端額外處理。

### Row Level Security
所有資料表都啟用 Supabase RLS，確保用戶只能存取和修改自己的資料，訪客統計使用 `anon` 角色允許未登入用戶寫入。

---

## License

Copyright © 2026 BoKai Chang. All rights reserved.