# Myverse

> 你在網路上的專屬宇宙 · Your universe on the internet

Myverse 是一個針對台灣創作者設計的個人主頁生成器，讓你把所有連結、社群帳號和內容整合在一個漂亮的個人頁面。

![Myverse](https://img.shields.io/badge/Nuxt-3-00DC82?style=flat&logo=nuxt.js) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase) ![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat&logo=vercel) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat&logo=tailwindcss)

---

## 功能特色

### 個人主頁
- 自訂 username，專屬網址 `myverse.me/你的名字`
- 編輯顯示名稱、個人簡介
- 上傳頭貼
- SEO 優化，Google 可搜尋到個人頁面
- 分享到 LINE / Facebook 自動顯示預覽圖

### 卡片類型
- **連結卡片** — 一般網址連結
- **YouTube 卡片** — 嵌入 YouTube 影片，自動轉換 embed 格式
- **圖片卡片** — 上傳圖片展示
- **蝦皮商品卡片** — 貼上蝦皮網址自動抓取商品圖片和名稱（台灣本土特色功能）

### 個人化設定
- 背景顏色（36 種色系選擇）
- 背景圖片上傳
- 連結卡片圓角樣式（方形 / 圓角 / 膠囊）
- 連結卡片背景顏色（18 種選擇）

### 數據統計
- 每個連結的點擊次數統計

### 帳號功能
- Google OAuth 一鍵登入
- 拖拉排序連結
- 編輯 / 刪除卡片

---

## 技術架構

### 前端
| 技術 | 說明 |
|------|------|
| Nuxt 3 | Vue 3 全端框架，SSR 確保 SEO 效果 |
| Vue 3 | Composition API、響應式系統 |
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
| Cloudflare | DNS 管理 |

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
| type | text | 卡片類型（link / youtube / image / shopee） |
| position | int4 | 排列順序 |
| thumbnail | text | 蝦皮商品圖片網址 |
| created_at | timestamptz | 建立時間 |

### link_clicks 表
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | uuid | 主鍵 |
| link_id | uuid | 對應 links.id |
| clicked_at | timestamptz | 點擊時間 |

---

## 專案結構

```
myverse/
├── app/
│   ├── pages/
│   │   ├── index.vue          # 首頁 Landing page
│   │   ├── login.vue          # 登入頁
│   │   ├── dashboard.vue      # 後台（需要登入）
│   │   └── [username].vue     # 公開個人頁（動態路由）
│   ├── plugins/
│   │   └── supabase.client.ts # Supabase 連線設定
│   └── app.vue
├── server/
│   └── api/
│       └── fetch-og.post.ts   # 抓取 Open Graph 資料（蝦皮商品卡片）
├── public/
├── .env                       # 環境變數（不上傳 GitHub）
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

## 技術說明

### SSR 與 SEO
使用 Nuxt 3 的 SSR（伺服器端渲染），個人頁面在伺服器端渲染完成後再送給瀏覽器，Google 可以完整索引每個用戶的個人頁面內容。

每個個人頁面都有動態產生的 Open Graph meta tag：
```html
<title>用戶名稱 | Myverse</title>
<meta property="og:title" content="...">
<meta property="og:image" content="頭貼網址">
```

### 蝦皮商品卡片原理
瀏覽器有 CORS 限制，無法直接抓取蝦皮頁面。透過 Nuxt 的 `server/api/` 在伺服器端發送請求，解析蝦皮頁面的 Open Graph meta tag，取得商品標題和圖片後回傳給前端顯示。

### Supabase Auth
使用 Google OAuth 登入，透過自訂 `supabase.client.ts` plugin 建立連線（因為新版 Supabase Publishable Key 格式與 `@nuxtjs/supabase` 模組不相容，改用 `@supabase/supabase-js` 直接整合）。

### Row Level Security
所有資料表都啟用 RLS，確保用戶只能存取和修改自己的資料。

---

## License

Copyright © 2026 BoKai Chang. All rights reserved.