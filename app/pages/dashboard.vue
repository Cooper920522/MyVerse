<template>
    <div class="min-h-screen"
        style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 40%, #a7f3d0 100%); background-attachment: fixed;">

        <!-- 載入中 -->
        <div v-if="loading" class="flex items-center justify-center min-h-screen">
            <div class="flex items-center gap-3" style="color: #065f46">
                <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="31.4"
                        stroke-dashoffset="10" />
                </svg>
                <span class="text-sm">載入中...</span>
            </div>
        </div>

        <!-- 還沒設定 username -->
        <div v-else-if="!profile" class="flex items-center justify-center min-h-screen px-4">
            <div class="w-full max-w-sm rounded-2xl p-8"
                style="background: rgba(255,255,255,0.75); border: 1px solid rgba(16,185,129,0.2); backdrop-filter: blur(20px)">
                <h1 class="text-2xl font-medium mb-1" style="color: #065f46">設定你的 Myverse</h1>
                <p class="text-sm mb-6" style="color: #6b7280">選一個獨特的用戶名稱</p>

                <div class="mb-4">
                    <label class="text-xs mb-1.5 block font-medium" style="color: #6b7280">用戶名稱</label>
                    <div class="flex items-center rounded-xl overflow-hidden"
                        style="background: white; border: 1px solid rgba(16,185,129,0.25)">
                        <span class="text-sm px-3" style="color: #94a3b8">myverse.me/</span>
                        <input v-model="username" type="text" placeholder="yourname"
                            class="flex-1 py-3 pr-3 text-sm outline-none bg-transparent" style="color: #065f46" />
                    </div>
                    <p v-if="usernameError" class="text-xs mt-1.5" style="color: #ef4444">{{ usernameError }}</p>
                </div>

                <button @click="createProfile" :disabled="saving"
                    class="w-full text-white rounded-xl py-3 text-sm font-medium transition disabled:opacity-50"
                    style="background: linear-gradient(135deg, #059669, #34d399)">
                    {{ saving ? '建立中...' : '建立我的頁面' }}
                </button>
            </div>
        </div>

        <!-- 主要後台 -->
        <div v-else class="max-w-6xl mx-auto py-12 px-4">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- 左欄：設定區 -->
                <div class="flex flex-col gap-4">

                    <!-- 標題列 -->
                    <div class="flex flex-col gap-3 mb-8 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 class="text-xl font-medium" style="color: #065f46">Myverse</h1>
                            <p class="text-sm mt-0.5" style="color: #6b7280">myverse.me/{{ profile.username }}</p>
                        </div>
                        <div class="flex items-center gap-3 flex-wrap">
                            <a :href="`/${profile.username}`" target="_blank" class="text-sm font-medium transition"
                                style="color: #059669">
                                查看我的頁面 →
                            </a>
                            <button @click="copyProfileUrl"
                                class="text-sm font-medium transition px-3 py-1.5 rounded-lg" :style="copied
                                    ? 'background: rgba(5,150,105,0.15); color: #059669'
                                    : 'background: rgba(5,150,105,0.08); color: #059669'">
                                {{ copied ? '✓ 已複製' : '分享連結' }}
                            </button>
                            <button @click="logout" class="text-sm transition" style="color: #6b7280">
                                登出
                            </button>
                        </div>
                    </div>

                    <!-- 全域錯誤訊息 -->
                    <div v-if="globalError" class="flex items-center justify-between rounded-xl px-4 py-3 mb-4"
                        style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2)">
                        <p class="text-sm" style="color: #ef4444">{{ globalError }}</p>
                        <button @click="globalError = ''" class="text-xs" style="color: #ef4444">✕</button>
                    </div>

                    <!-- 統計儀表板 -->
                    <div class="grid grid-cols-3 gap-3 mb-4 lg:grid-cols-5">
                        <StatCard :value="stats.total" label="總點擊數" />
                        <StatCard :value="stats.today" label="今日點擊" />
                        <StatCard :value="links.length" label="連結數量" />
                        <StatCard :value="stats.totalViews" label="總訪客數" />
                        <StatCard :value="stats.todayViews" label="今日訪客" />
                    </div>

                    <!-- 個人資料 -->
                    <div class="rounded-2xl p-6 mb-4"
                        style="background: rgba(255,255,255,0.7); border: 1px solid rgba(16,185,129,0.15); backdrop-filter: blur(12px)">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-sm font-medium" style="color: #374151">個人資料</h2>
                            <button v-if="!editingProfile" @click="editingProfile = true"
                                class="text-xs font-medium transition" style="color: #059669">
                                編輯
                            </button>
                        </div>

                        <!-- 頭貼 -->
                        <div class="flex items-center gap-4 mb-4">
                            <div class="relative flex-shrink-0">
                                <div class="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center"
                                    style="background: rgba(5,150,105,0.15); border: 2px solid rgba(52,211,153,0.4)">
                                    <img v-if="profile.avatar_url" :src="profile.avatar_url"
                                        class="w-full h-full object-cover" />
                                    <span v-else class="text-xl font-medium" style="color: #059669">
                                        {{ profile.display_name?.charAt(0) || profile.username.charAt(0) }}
                                    </span>
                                </div>
                                <label
                                    class="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition"
                                    :style="uploadingAvatar ? 'background: #9ca3af' : 'background: #059669'">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white"
                                        stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    <input type="file" accept="image/*" class="hidden" @change="uploadAvatar" />
                                </label>
                            </div>
                            <div>
                                <p class="text-sm font-medium" style="color: #065f46">{{ profile.display_name ||
                                    profile.username }}</p>
                                <p class="text-xs mt-0.5" style="color: #6b7280">點擊頭貼旁的按鈕更換照片</p>
                            </div>
                        </div>

                        <!-- 顯示模式 -->
                        <div v-if="!editingProfile">
                            <p class="text-sm font-medium" style="color: #374151">{{ profile.display_name || '未設定名稱' }}
                            </p>
                            <p class="text-xs mt-1" style="color: #6b7280">{{ profile.bio || '未設定簡介' }}</p>
                        </div>

                        <!-- 編輯模式 -->
                        <div v-else class="flex flex-col gap-3">
                            <div>
                                <label class="text-xs mb-1.5 block font-medium" style="color: #6b7280">顯示名稱</label>
                                <input v-model="editDisplayName" type="text" placeholder="你的名字"
                                    class="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                                    style="background: white; border: 1px solid rgba(16,185,129,0.25); color: #065f46"
                                    onfocus="this.style.borderColor='rgba(5,150,105,0.5)'"
                                    onblur="this.style.borderColor='rgba(16,185,129,0.25)'" />
                            </div>
                            <div>
                                <label class="text-xs mb-1.5 block font-medium" style="color: #6b7280">個人簡介</label>
                                <textarea v-model="editBio" placeholder="介紹一下自己..." rows="3"
                                    class="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition"
                                    style="background: white; border: 1px solid rgba(16,185,129,0.25); color: #065f46"
                                    onfocus="this.style.borderColor='rgba(5,150,105,0.5)'"
                                    onblur="this.style.borderColor='rgba(16,185,129,0.25)'" />
                            </div>
                            <p v-if="profileError" class="text-xs" style="color: #ef4444">{{ profileError }}</p>
                            <div class="flex gap-2">
                                <button @click="cancelEditProfile"
                                    class="flex-1 rounded-xl py-3 text-sm font-medium transition"
                                    style="background: white; border: 1px solid rgba(16,185,129,0.25); color: #6b7280">
                                    取消
                                </button>
                                <button @click="saveProfile" :disabled="savingProfile"
                                    class="flex-1 text-white rounded-xl py-3 text-sm font-medium transition disabled:opacity-50"
                                    style="background: linear-gradient(135deg, #059669, #34d399)">
                                    {{ savingProfile ? '儲存中...' : '儲存' }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 背景設定 -->
                    <div class="rounded-2xl p-6 mb-4"
                        style="background: rgba(255,255,255,0.7); border: 1px solid rgba(16,185,129,0.15); backdrop-filter: blur(12px)">
                        <h2 class="text-sm font-medium mb-4" style="color: #374151">背景設定</h2>

                        <div class="flex gap-2 mb-4">
                            <button @click="setBgType('color')"
                                :style="profile.bg_type === 'color' ? 'background: linear-gradient(135deg, #059669, #34d399); color: white;' : 'background: white; border: 1px solid rgba(16,185,129,0.25); color: #6b7280'"
                                class="text-xs px-4 py-2 rounded-xl transition font-medium">
                                顏色
                            </button>
                            <button @click="setBgType('image')"
                                :style="profile.bg_type === 'image' ? 'background: linear-gradient(135deg, #059669, #34d399); color: white;' : 'background: white; border: 1px solid rgba(16,185,129,0.25); color: #6b7280'"
                                class="text-xs px-4 py-2 rounded-xl transition font-medium">
                                圖片
                            </button>
                        </div>

                        <div v-if="profile.bg_type === 'color'">
                            <div class="flex flex-wrap gap-2">
                                <button v-for="color in bgColors" :key="color" @click="setBgColor(color)"
                                    :style="{ backgroundColor: color }"
                                    :class="profile.bg_color === color ? 'ring-2 ring-emerald-400 ring-offset-2' : ''"
                                    class="w-8 h-8 rounded-full transition" />
                            </div>
                            <div v-if="profile.bg_color" class="flex items-center gap-2 mt-3">
                                <div class="w-4 h-4 rounded-full flex-shrink-0"
                                    :style="{ backgroundColor: profile.bg_color }">
                                </div>
                                <span class="text-xs font-mono" style="color: #6b7280">{{ profile.bg_color }}</span>
                            </div>
                        </div>

                        <div v-if="profile.bg_type === 'image'">
                            <label class="flex items-center gap-2 cursor-pointer w-fit">
                                <span class="text-sm font-medium rounded-xl px-4 py-2.5 transition"
                                    style="background: white; border: 1px solid rgba(16,185,129,0.25); color: #6b7280">
                                    {{ uploadingBg ? '上傳中...' : '選擇圖片' }}
                                </span>
                                <input type="file" accept="image/*" @change="uploadBgImage" class="hidden" />
                            </label>
                            <div v-if="profile.bg_image_url" class="mt-3 relative">
                                <img :src="profile.bg_image_url" class="w-full h-24 object-cover rounded-xl" />
                                <button @click="removeBgImage"
                                    class="absolute top-2 right-2 text-white text-xs px-2.5 py-1 rounded-lg transition"
                                    style="background: rgba(239,68,68,0.85)">
                                    刪除圖片
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 連結樣式設定 -->
                    <div class="rounded-2xl p-6 mb-4"
                        style="background: rgba(255,255,255,0.7); border: 1px solid rgba(16,185,129,0.15); backdrop-filter: blur(12px)">
                        <h2 class="text-sm font-medium mb-4" style="color: #374151">連結樣式</h2>

                        <!-- 圓角選擇 -->
                        <div class="mb-4">
                            <label class="text-xs font-medium mb-2 block" style="color: #6b7280">圓角樣式</label>
                            <div class="flex flex-wrap gap-2">
                                <button v-for="r in radiusOptions" :key="r.value" @click="setLinkRadius(r.value)"
                                    :style="profile.link_radius === r.value
                                        ? 'background: linear-gradient(135deg, #059669, #34d399); color: white;'
                                        : 'background: white; border: 1px solid rgba(16,185,129,0.25); color: #6b7280'"
                                    class="flex-1 py-2.5 text-xs font-medium transition"
                                    :class="r.value === 'square' ? 'rounded-lg' : r.value === 'rounded' ? 'rounded-xl' : 'rounded-full'">
                                    {{ r.label }}
                                </button>
                            </div>
                        </div>

                        <!-- 顏色選擇 -->
                        <div>
                            <label class="text-xs font-medium mb-2 block" style="color: #6b7280">連結卡片顏色</label>
                            <div class="flex flex-wrap gap-2">
                                <button v-for="color in linkColors" :key="color" @click="setLinkColor(color)"
                                    :style="{ backgroundColor: color }"
                                    :class="profile.link_color === color ? 'ring-2 ring-emerald-400 ring-offset-2' : ''"
                                    class="w-8 h-8 rounded-full transition"
                                    style="border: 1px solid rgba(0,0,0,0.08)" />
                            </div>
                            <div v-if="profile.link_color" class="flex items-center gap-2 mt-3">
                                <div class="w-4 h-4 rounded-full flex-shrink-0"
                                    :style="{ backgroundColor: profile.link_color }"
                                    style="border: 1px solid rgba(0,0,0,0.08)"></div>
                                <span class="text-xs font-mono" style="color: #6b7280">{{ profile.link_color }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 新增卡片 -->
                    <div class="rounded-2xl p-6 mb-4"
                        style="background: rgba(255,255,255,0.7); border: 1px solid rgba(16,185,129,0.15); backdrop-filter: blur(12px)">
                        <h2 class="text-sm font-medium mb-4" style="color: #374151">新增卡片</h2>

                        <div class="flex flex-wrap gap-2 mb-4">
                            <button v-for="t in cardTypes" :key="t.value" @click="newType = t.value"
                                :style="newType === t.value ? 'background: linear-gradient(135deg, #059669, #34d399); color: white;' : 'background: white; border: 1px solid rgba(16,185,129,0.25); color: #6b7280'"
                                class="text-xs px-4 py-2 rounded-xl transition font-medium">
                                {{ t.label }}
                            </button>
                        </div>

                        <div class="flex flex-col gap-3">
                            <input v-model="newTitle" type="text" :placeholder="titlePlaceholder"
                                class="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                                style="background: white; border: 1px solid rgba(16,185,129,0.25); color: #065f46"
                                onfocus="this.style.borderColor='rgba(5,150,105,0.5)'"
                                onblur="this.style.borderColor='rgba(16,185,129,0.25)'" />
                            <input v-if="newType !== 'image'" v-model="newUrl" type="text" :placeholder="urlPlaceholder"
                                class="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                                style="background: white; border: 1px solid rgba(16,185,129,0.25); color: #065f46"
                                onfocus="this.style.borderColor='rgba(5,150,105,0.5)'"
                                onblur="this.style.borderColor='rgba(16,185,129,0.25)'" />

                            <!-- 蝦皮預覽 -->
                            <div v-if="newType === 'shopee' && shopeePreview" class="rounded-xl overflow-hidden"
                                style="border: 1px solid rgba(16,185,129,0.2)">
                                <img v-if="shopeePreview.image" :src="shopeePreview.image"
                                    class="w-full h-40 object-cover" />
                                <div class="p-3">
                                    <p class="text-sm font-medium" style="color: #065f46">{{ shopeePreview.title }}</p>
                                </div>
                            </div>

                            <!-- Pressplay 預覽 -->
                            <div v-if="newType === 'pressplay' && pressplayPreview" class="rounded-xl overflow-hidden"
                                style="border: 1px solid rgba(16,185,129,0.2)">
                                <img v-if="pressplayPreview.image" :src="pressplayPreview.image"
                                    class="w-full h-40 object-cover" />
                                <div class="p-3">
                                    <p class="text-sm font-medium" style="color: #065f46">{{ pressplayPreview.title }}
                                    </p>
                                </div>
                            </div>

                            <button v-if="newType === 'pressplay' && newUrl && !pressplayPreview"
                                @click="fetchPressplayPreview" :disabled="fetchingPressplayPreview"
                                class="w-full rounded-xl py-3 text-sm font-medium transition disabled:opacity-50"
                                style="background: white; border: 1px solid rgba(16,185,129,0.25); color: #059669">
                                {{ fetchingPressplayPreview ? '抓取中...' : '預覽課程' }}
                            </button>

                            <button v-if="newType === 'shopee' && newUrl && !shopeePreview" @click="fetchShopeePreview"
                                :disabled="fetchingShopeePreview"
                                class="w-full rounded-xl py-3 text-sm font-medium transition disabled:opacity-50"
                                style="background: white; border: 1px solid rgba(16,185,129,0.25); color: #059669">
                                {{ fetchingShopeePreview ? '抓取中...' : '預覽商品' }}
                            </button>

                            <label v-if="newType === 'image'" class="flex items-center gap-2 cursor-pointer">
                                <span class="text-sm font-medium rounded-xl px-4 py-2.5 transition"
                                    style="background: white; border: 1px solid rgba(16,185,129,0.25); color: #6b7280">選擇圖片</span>
                                <input type="file" accept="image/*" @change="onCardImageSelected" class="hidden" />
                                <span v-if="newCardImageFile" class="text-xs" style="color: #059669">{{
                                    newCardImageFile.name
                                    }}</span>
                            </label>
                            <!-- 限時優惠設定 -->
                            <div v-if="newType === 'link' || newType === 'shopee' || newType === 'pressplay'"
                                class="flex flex-col gap-2">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" v-model="hasExpiry" class="rounded" />
                                    <span class="text-xs font-medium" style="color: #6b7280">設定限時優惠到期時間</span>
                                </label>
                                <input v-if="hasExpiry" v-model="expiresAt" type="datetime-local"
                                    class="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                                    style="background: white; border: 1px solid rgba(16,185,129,0.25); color: #065f46"
                                    onfocus="this.style.borderColor='rgba(5,150,105,0.5)'"
                                    onblur="this.style.borderColor='rgba(16,185,129,0.25)'" />
                            </div>
                            <p v-if="linkError" class="text-xs" style="color: #ef4444">{{ linkError }}</p>
                            <button @click="addLink" :disabled="addingLink"
                                class="w-full text-white rounded-xl py-3 text-sm font-medium transition disabled:opacity-50"
                                style="background: linear-gradient(135deg, #059669, #34d399)">
                                {{ addingLink ? '新增中...' : '+ 新增卡片' }}
                            </button>
                        </div>
                    </div>

                    <!-- 連結清單 -->
                    <div class="rounded-2xl p-6"
                        style="background: rgba(255,255,255,0.7); border: 1px solid rgba(16,185,129,0.15); backdrop-filter: blur(12px)">
                        <h2 class="text-sm font-medium mb-4" style="color: #374151">我的連結（{{ links.length }}）</h2>

                        <div v-if="links.length === 0" class="text-sm text-center py-4" style="color: #9ca3af">
                            還沒有連結，新增一個吧！
                        </div>

                        <div v-else>
                            <VueDraggable v-model="links" :animation="150" handle=".drag-handle"
                                class="flex flex-col gap-3" @end="onDragEnd">
                                <div v-for="link in links" :key="link.id"
                                    class="flex items-center justify-between rounded-xl px-4 py-3 transition"
                                    :style="link.is_visible !== false
                                        ? 'background: rgba(255,255,255,0.8); border: 1px solid rgba(16,185,129,0.12)'
                                        : 'background: rgba(255,255,255,0.4); border: 1px solid rgba(16,185,129,0.06); opacity: 0.6'">
                                    <div class="flex items-center gap-3 min-w-0">
                                        <span class="drag-handle cursor-grab flex-shrink-0" style="color: #6ee7b7">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2">
                                                <circle cx="9" cy="5" r="1" fill="currentColor" />
                                                <circle cx="9" cy="12" r="1" fill="currentColor" />
                                                <circle cx="9" cy="19" r="1" fill="currentColor" />
                                                <circle cx="15" cy="5" r="1" fill="currentColor" />
                                                <circle cx="15" cy="12" r="1" fill="currentColor" />
                                                <circle cx="15" cy="19" r="1" fill="currentColor" />
                                            </svg>
                                        </span>
                                        <div class="min-w-0">
                                            <p class="text-sm font-medium truncate" style="color: #065f46">{{ link.title
                                                }}</p>
                                            <p class="text-xs mt-0.5 truncate" style="color: #6b7280">{{ link.url }}</p>
                                            <p class="text-xs mt-1 font-medium" style="color: #059669">{{
                                                link.link_clicks[0].count }} 次點擊</p>
                                            <p v-if="link.expires_at" class="text-xs mt-0.5"
                                                :style="new Date(link.expires_at) < new Date() ? 'color: #ef4444' : 'color: #f59e0b'">
                                                {{ new Date(link.expires_at) < new Date() ? '已到期' : '到期：' + new
                                                    Date(link.expires_at).toLocaleString('zh-TW') }} </p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-3 ml-4 flex-shrink-0">
                                        <button @click="toggleVisible(link)" class="text-xs font-medium transition"
                                            :style="link.is_visible !== false ? 'color: #059669' : 'color: #9ca3af'">
                                            {{ link.is_visible !== false ? '顯示中' : '已隱藏' }}
                                        </button>
                                        <button @click="openEdit(link)" class="text-xs font-medium transition"
                                            style="color: #059669">編輯</button>
                                        <button @click="deleteLink(link.id)" :disabled="deletingId === link.id"
                                            class="text-xs font-medium transition disabled:opacity-50"
                                            style="color: #9ca3af">
                                            {{ deletingId === link.id ? '刪除中...' : '刪除' }}
                                        </button>
                                    </div>
                                </div>
                            </VueDraggable>
                        </div>

                        <!-- 編輯表單 Modal -->
                        <div v-if="editingLink" class="fixed inset-0 flex items-center justify-center z-50"
                            style="background: rgba(5,150,105,0.1); backdrop-filter: blur(12px)"
                            @click.self="closeEdit">
                            <div class="w-full max-w-sm mx-4 rounded-2xl p-6 shadow-xl"
                                style="background: white; border: 1px solid rgba(16,185,129,0.2)">
                                <h2 class="text-sm font-medium mb-4" style="color: #374151">編輯卡片</h2>
                                <div class="flex flex-col gap-3">
                                    <input v-model="editTitle" type="text" placeholder="標題"
                                        class="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                                        style="background: #f0fdf4; border: 1px solid rgba(16,185,129,0.25); color: #065f46"
                                        onfocus="this.style.borderColor='rgba(5,150,105,0.5)'"
                                        onblur="this.style.borderColor='rgba(16,185,129,0.25)'" />
                                    <input v-if="editingLink.type !== 'image'" v-model="editUrl" type="text"
                                        placeholder="網址"
                                        class="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                                        style="background: #f0fdf4; border: 1px solid rgba(16,185,129,0.25); color: #065f46"
                                        onfocus="this.style.borderColor='rgba(5,150,105,0.5)'"
                                        onblur="this.style.borderColor='rgba(16,185,129,0.25)'" />
                                    <!-- 限時優惠設定 -->
                                    <div v-if="editingLink.type === 'link' || editingLink.type === 'shopee' || editingLink.type === 'pressplay'"
                                        class="flex flex-col gap-2">
                                        <label class="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" v-model="editHasExpiry" class="rounded" />
                                            <span class="text-xs font-medium" style="color: #6b7280">設定限時優惠到期時間</span>
                                        </label>
                                        <input v-if="editHasExpiry" v-model="editExpiresAt" type="datetime-local"
                                            class="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                                            style="background: #f0fdf4; border: 1px solid rgba(16,185,129,0.25); color: #065f46"
                                            onfocus="this.style.borderColor='rgba(5,150,105,0.5)'"
                                            onblur="this.style.borderColor='rgba(16,185,129,0.25)'" />
                                    </div>
                                    <p v-if="editError" class="text-xs" style="color: #ef4444">{{ editError }}</p>
                                    <div class="flex gap-2">
                                        <button @click="closeEdit"
                                            class="flex-1 rounded-xl py-3 text-sm font-medium transition"
                                            style="background: white; border: 1px solid rgba(16,185,129,0.25); color: #6b7280">取消</button>
                                        <button @click="saveEdit" :disabled="saving"
                                            class="flex-1 text-white rounded-xl py-3 text-sm font-medium transition disabled:opacity-50"
                                            style="background: linear-gradient(135deg, #059669, #34d399)">
                                            {{ saving ? '儲存中...' : '儲存' }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- 右欄：預覽區 -->
                <div class="hidden lg:block">
                    <div class="sticky top-8">
                        <p class="text-xs font-medium mb-3 text-center" style="color: #6b7280">即時預覽</p>

                        <!-- 手機框 -->
                        <div class="mx-auto rounded-3xl overflow-hidden shadow-xl"
                            style="width: 280px; border: 8px solid #1f2937;">

                            <!-- 手機頂部 -->
                            <div class="h-6 flex items-center justify-center" style="background: #1f2937">
                                <div class="w-16 h-1.5 rounded-full" style="background: #374151"></div>
                            </div>

                            <!-- 預覽內容 -->
                            <div class="overflow-y-auto" style="height: 560px; padding: 24px 16px;"
                                :style="previewBgStyle">

                                <!-- 頭像 -->
                                <div class="text-center mb-6">
                                    <div class="w-16 h-16 rounded-full mx-auto mb-2 overflow-hidden flex items-center justify-center"
                                        style="background: rgba(5,150,105,0.15); border: 2px solid rgba(52,211,153,0.4)">
                                        <img v-if="profile.avatar_url" :src="profile.avatar_url"
                                            class="w-full h-full object-cover" />
                                        <span v-else class="text-xl font-medium" style="color: #059669">
                                            {{ profile.display_name?.charAt(0) || profile.username.charAt(0) }}
                                        </span>
                                    </div>
                                    <p class="text-sm font-medium" :style="{ color: previewProfileTextColor }">
                                        {{ profile.display_name || profile.username }}
                                    </p>
                                    <p v-if="profile.bio" class="text-xs mt-1"
                                        :style="{ color: previewProfileSubTextColor }">{{ profile.bio }}</p>
                                </div>

                                <!-- 連結清單預覽 -->
                                <div class="flex flex-col gap-2">
                                    <template v-for="link in links" :key="link.id">
                                        <LinkCard v-if="link.is_visible !== false" :link="link" :profile="profile"
                                            :is-preview="true" />
                                    </template>
                                </div>

                                <!-- 頁腳 -->
                                <p class="text-center mt-6" style="font-size: 10px; color: #9ca3af">Powered by Myverse
                                </p>
                            </div>

                            <!-- 手機底部 -->
                            <div class="h-6 flex items-center justify-center" style="background: #1f2937">
                                <div class="w-8 h-1.5 rounded-full" style="background: #374151"></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<script setup>
import { VueDraggable } from 'vue-draggable-plus'

const { $supabase } = useNuxtApp()

const loading = ref(true)
const saving = ref(false)
const profile = ref(null)
const username = ref('')
const usernameError = ref('')

const editingLink = ref(null)
const editTitle = ref('')
const editUrl = ref('')
const editError = ref('')

const deletingId = ref(null)       // 記錄哪個連結正在刪除
const uploadingAvatar = ref(false) // 頭貼上傳中
const uploadingBg = ref(false)     // 背景圖片上傳中
const globalError = ref('')        // 全域錯誤訊息

const newTitle = ref('')
const links = ref([])
const newUrl = ref('')
const newType = ref('link')
const newCardImageFile = ref(null)
const linkError = ref('')
const addingLink = ref(false)

const hasExpiry = ref(false)
const expiresAt = ref('')

const editHasExpiry = ref(false)
const editExpiresAt = ref('')

const editingProfile = ref(false)
const editDisplayName = ref('')
const editBio = ref('')
const profileError = ref('')
const savingProfile = ref(false)

const stats = ref({ total: 0, today: 0, totalViews: 0, todayViews: 0 })

const shopeePreview = ref(null)
const fetchingShopeePreview = ref(false)

const pressplayPreview = ref(null)
const fetchingPressplayPreview = ref(false)

const copied = ref(false)

const cardTypes = [
    { value: 'link', label: '連結' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'image', label: '圖片' },
    { value: 'shopee', label: '蝦皮' },
    { value: 'line', label: 'LINE' },
    { value: 'pressplay', label: 'Pressplay' }
]

const titlePlaceholder = computed(() => {
    if (newType.value === 'youtube') return '影片標題（例如：我的頻道精選）'
    if (newType.value === 'image') return '圖片說明（選填）'
    if (newType.value === 'shopee') return '商品名稱或說明（例如: 我的精選商品）'
    if (newType.value === 'line') return '按鈕文字（例如：加我的 LINE）'
    if (newType.value === 'pressplay') return '課程名稱或說明(選填)'
    return '連結名稱（例如：我的 YouTube）'
})

const urlPlaceholder = computed(() => {
    if (newType.value === 'youtube') return 'YouTube 網址（例如：https://youtube.com/watch?v=...）'
    if (newType.value === 'shopee') return '蝦皮商品網址（例如：https://shopee.tw/...）'
    if (newType.value === 'line') return 'LINE 連結（例如：https://line.me/ti/p/...）'
    if (newType.value === 'pressplay') return 'Pressplay 課程網址（例如：https://www.pressplay.cc/...）'
    return '網址（例如：https://youtube.com/...）'

})

const linkTextClass = computed(() => {
    const color = profile.value?.link_color || '#ffffff'
    const dark = ['#1e293b', '#0f172a', '#065f46']
    return dark.includes(color) ? 'text-white' : 'text-gray-700'
})

const previewBgStyle = computed(() => {
    if (profile.value?.bg_type === 'image' && profile.value?.bg_image_url) {
        return {
            backgroundImage: `url(${profile.value.bg_image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }
    }
    return { backgroundColor: profile.value?.bg_color || '#f3e8ff' }
})

const previewLinkRadius = computed(() => {
    if (profile.value?.link_radius === 'square') return '8px'
    if (profile.value?.link_radius === 'pill') return '9999px'
    return '16px'
})

const previewIsDarkBg = computed(() => {
    const color = profile.value?.bg_color || '#f3e8ff'
    if (profile.value?.bg_type === 'image') return false

    const hex = color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness < 128
})

const previewProfileTextColor = computed(() => {
    return previewIsDarkBg.value ? 'rgba(255,255,255,0.9)' : '#065f46'
})

const previewProfileSubTextColor = computed(() => {
    return previewIsDarkBg.value ? 'rgba(255,255,255,0.6)' : '#6b7280'
})

function onCardImageSelected(event) {
    newCardImageFile.value = event.target.files[0]
}

//獲取蝦皮商品資訊(呼叫後端API)
async function fetchShopeePreview() {
    if (!newUrl.value) return
    fetchingShopeePreview.value = true

    try {
        const data = await $fetch('/api/fetch-og', {
            method: 'POST',
            body: { url: newUrl.value }
        })
        shopeePreview.value = data
    } catch (e) {
        linkError.value = '無法抓取商品資訊，請確認網址是否正確'
    }

    fetchingShopeePreview.value = false
}

async function fetchPressplayPreview() {
    if (!newUrl.value) return
    fetchingPressplayPreview.value = true

    try {
        const data = await $fetch('/api/fetch-og', {
            method: 'POST',
            body: { url: newUrl.value }
        })
        pressplayPreview.value = data
    } catch (e) {
        linkError.value = '無法抓取課程資訊，請確認網址是否正確'
    }

    fetchingPressplayPreview.value = false
}

onMounted(async () => {
    const { data: { user } } = await $supabase.auth.getUser()
    if (!user) return navigateTo('/login')

    const { data } = await $supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    profile.value = data
    loading.value = false

    if (data) {
        await fetchLinks()
        await fetchStats()
    }
})

async function fetchLinks() {
    const { data } = await $supabase
        .from('links')
        .select('*, link_clicks(count)')
        .eq('profile_id', profile.value.id)
        .order('position')

    links.value = data || []
}

async function fetchStats() {
    const { count: total } = await $supabase
        .from('link_clicks')
        .select('*', { count: 'exact', head: true }) //只回傳數字，而不是整個點擊紀錄
        .in('link_id', links.value.map(l => l.id)) //只計算該用戶的連結的點擊紀錄，將連結陣列轉成id陣列
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count: todayCount } = await $supabase
        .from('link_clicks')
        .select('*', { count: 'exact', head: true }) //只回傳數字，而不是整個點擊紀錄
        .in('link_id', links.value.map(l => l.id)) //只計算該用戶的連結的點擊紀錄，將連結陣列轉成id陣列
        .gte('clicked_at', today.toISOString())

    const { count: totalViews } = await $supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profile.value.id)

    const today2 = new Date()
    today2.setHours(0, 0, 0, 0)

    const { count: todayViews } = await $supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profile.value.id)
        .gte('viewed_at', today2.toISOString())

    stats.value = {
        total: total || 0,
        today: todayCount || 0,
        totalViews: totalViews || 0,
        todayViews: todayViews || 0
    }
}

async function addLink() {
    linkError.value = ''

    if (!newTitle.value && newType.value !== 'image') {
        linkError.value = '請輸入標題'
        return
    }

    if (newType.value === 'link') {
        if (!newUrl.value) { linkError.value = '請輸入網址'; return }
        if (!newUrl.value.startsWith('http')) { linkError.value = '網址必須以 http:// 或 https:// 開頭'; return }
    }

    if (newType.value === 'youtube') {
        if (!newUrl.value.includes('youtube.com') && !newUrl.value.includes('youtu.be')) {
            linkError.value = '請輸入有效的 YouTube 網址'; return
        }
    }

    if (newType.value === 'image' && !newCardImageFile.value) {
        linkError.value = '請選擇一張圖片'; return
    }

    if (newType.value === 'shopee') {
        if (!newUrl.value.includes('shopee.tw')) {
            linkError.value = '請輸入有效的蝦皮網址'; return
        }
        if (!shopeePreview.value) {
            linkError.value = '請先點擊「預覽商品」'; return
        }
    }

    if (newType.value === 'pressplay') {
        if (!newUrl.value.includes('pressplay.cc')) {
            linkError.value = '請輸入有效的 Pressplay 網址'; return
        }
        if (!pressplayPreview.value) {
            linkError.value = '請先點擊「預覽課程」'; return
        }
    }

    if (newType.value === 'line') {
        if (!newUrl.value.includes('line.me') && !newUrl.value.includes('lin.ee')) {
            linkError.value = '請輸入有效的 LINE 連結'; return
        }
    }

    addingLink.value = true
    let finalUrl = newUrl.value

    if (newType.value === 'image' && newCardImageFile.value) {
        const file = newCardImageFile.value
        const fileExt = file.name.split('.').pop()
        const fileName = `${profile.value.id}-card-${Date.now()}.${fileExt}`

        const { error: uploadError } = await $supabase.storage.from('backgrounds').upload(fileName, file)
        if (uploadError) { linkError.value = '圖片上傳失敗，請再試一次'; addingLink.value = false; return }

        const { data } = $supabase.storage.from('backgrounds').getPublicUrl(fileName)
        finalUrl = data.publicUrl
    }

    const { error } = await $supabase.from('links').insert({
        profile_id: profile.value.id,
        title: newTitle.value || shopeePreview.value?.title || pressplayPreview.value?.title || '',
        url: finalUrl,
        type: newType.value,
        position: links.value.length,
        thumbnail: newType.value === 'shopee'
            ? shopeePreview.value?.image
            : newType.value === 'pressplay'
                ? pressplayPreview.value?.image
                : null,
        expires_at: hasExpiry.value && expiresAt.value ? new Date(expiresAt.value).toISOString() : null //如果用戶勾了勾選框而且也選了時間，就把時間轉成 ISO 格式存進資料庫否則存 null
    })

    if (error) { linkError.value = '新增失敗，請再試一次'; addingLink.value = false; return }

    newTitle.value = ''
    newUrl.value = ''
    newType.value = 'link'
    newCardImageFile.value = null
    shopeePreview.value = null
    pressplayPreview.value = null
    addingLink.value = false
    hasExpiry.value = false
    expiresAt.value = ''
    await fetchLinks()
}

//刪除連結
async function deleteLink(id) {
    deletingId.value = id
    const { error } = await $supabase.from('links').delete().eq('id', id)
    if (error) {
        globalError.value = '刪除失敗，請再試一次'
        deletingId.value = null
        return
    }
    deletingId.value = null
    await fetchLinks()
    await fetchStats()
}

// 切換連結隱藏/顯示
async function toggleVisible(link) {
    const newValue = link.is_visible === false ? true : false
    const { error } = await $supabase
        .from('links')
        .update({ is_visible: newValue })
        .eq('id', link.id)

    if (error) {
        globalError.value = '操作失敗，請再試一次'
        return
    }
    link.is_visible = newValue
}
//開啟編輯狀態
function openEdit(link) {
    editingLink.value = link
    editTitle.value = link.title
    editUrl.value = link.url
    editHasExpiry.value = !!link.expires_at
    editExpiresAt.value = link.expires_at
        ? new Date(link.expires_at).toISOString().slice(0, 16)
        : ''
}

//關閉編輯狀態
function closeEdit() {
    editingLink.value = null
    editTitle.value = ''
    editUrl.value = ''
    editError.value = ''
    editHasExpiry.value = false
    editExpiresAt.value = ''
}

//儲存編輯
async function saveEdit() {
    editError.value = ''

    if (!editTitle.value && editingLink.value.type !== 'image') { editError.value = '請輸入標題'; return }
    if (editingLink.value.type === 'link' && !editUrl.value.startsWith('http')) { editError.value = '網址必須以 http:// 或 https:// 開頭'; return }

    saving.value = true

    const { error } = await $supabase.from('links').update({
        title: editTitle.value,
        url: editingLink.value.type !== 'image' ? editUrl.value : editingLink.value.url,
        expires_at: editHasExpiry.value && editExpiresAt.value
            ? new Date(editExpiresAt.value).toISOString()
            : null
    }).eq('id', editingLink.value.id)

    if (error) { editError.value = '儲存失敗，請再試一次'; saving.value = false; return }

    saving.value = false
    closeEdit()
    await fetchLinks()
}

//登出
async function logout() {
    await $supabase.auth.signOut()
    navigateTo('/login')
}

//取消編輯個人資料
function cancelEditProfile() {
    editingProfile.value = false
    editDisplayName.value = profile.value.display_name || ''
    editBio.value = profile.value.bio || ''
    profileError.value = ''
}

//儲存個人資料
async function saveProfile() {
    profileError.value = ''
    if (!editDisplayName.value) { profileError.value = '請輸入顯示名稱'; return }

    savingProfile.value = true

    const { error } = await $supabase.from('profiles').update({
        display_name: editDisplayName.value,
        bio: editBio.value
    }).eq('id', profile.value.id)

    if (error) { profileError.value = '儲存失敗，請再試一次'; savingProfile.value = false; return }

    profile.value.display_name = editDisplayName.value
    profile.value.bio = editBio.value
    savingProfile.value = false
    editingProfile.value = false
}

//上傳個人資料頭像
async function uploadAvatar(event) {
    const file = event.target.files[0]
    if (!file) return

    uploadingAvatar.value = true
    const fileExt = file.name.split('.').pop()
    const fileName = `${profile.value.id}.${fileExt}`

    const { error } = await $supabase.storage.from('avatars').upload(fileName, file, { upsert: true })
    if (error) {
        globalError.value = '頭貼上傳失敗，請再試一次'
        uploadingAvatar.value = false
        return
    }

    const { data } = $supabase.storage.from('avatars').getPublicUrl(fileName)
    await $supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', profile.value.id)
    profile.value.avatar_url = data.publicUrl
    uploadingAvatar.value = false
}

async function copyProfileUrl() {
    const url = `${window.location.origin}/${profile.value.username}`
    await navigator.clipboard.writeText(url)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
}

const bgColors = [
    '#ffffff', '#f8f7f4', '#f5f0eb',
    '#f3e8ff', '#e9d5ff', '#c4b5fd',
    '#ede9fe', '#ddd6fe', '#a78bfa',
    '#dbeafe', '#bfdbfe', '#7dd3fc',
    '#dcfce7', '#bbf7d0', '#86efac',
    '#ffe4e6', '#fecdd3', '#fda4af',
    '#fff7ed', '#fed7aa', '#fdba74',
    '#fefce8', '#fef08a', '#fde047',
    '#e8d5c4', '#d4b8a0', '#c9b8a8',
    '#b8d4d4', '#a8c4c4', '#94b4b4',
    '#1e1b4b', '#0f172a', '#111827',
    '#1a0533', '#0c1a2e', '#0d1117',
]

const radiusOptions = [
    { value: 'square', label: '方形' },
    { value: 'rounded', label: '圓角' },
    { value: 'pill', label: '膠囊' }
]

const linkColors = [
    '#ffffff', '#f0fdf4', '#dcfce7',
    '#f3e8ff', '#ede9fe', '#ddd6fe',
    '#dbeafe', '#bfdbfe', '#e0f2fe',
    '#ffe4e6', '#fecdd3', '#fff7ed',
    '#fefce8', '#fef08a', '#e8d5c4',
    '#1e293b', '#0f172a', '#065f46',
]

//設定連結外框樣式
async function setLinkRadius(radius) {
    profile.value.link_radius = radius
    await $supabase
        .from('profiles')
        .update({ link_radius: radius })
        .eq('id', profile.value.id)
}

//設定連結顏色
async function setLinkColor(color) {
    profile.value.link_color = color
    await $supabase
        .from('profiles')
        .update({ link_color: color })
        .eq('id', profile.value.id)
}

//選擇背景類型(圖片、顏色)
async function setBgType(type) {
    profile.value.bg_type = type
    await $supabase.from('profiles').update({ bg_type: type }).eq('id', profile.value.id)
}

//設定背景顏色
async function setBgColor(color) {
    profile.value.bg_color = color
    await $supabase.from('profiles').update({ bg_color: color }).eq('id', profile.value.id)
}

//上傳背景圖片
async function uploadBgImage(event) {
    const file = event.target.files[0]
    if (!file) return

    uploadingBg.value = true
    const fileExt = file.name.split('.').pop()
    const fileName = `${profile.value.id}-bg.${fileExt}`

    const { error } = await $supabase.storage.from('backgrounds').upload(fileName, file, { upsert: true })
    if (error) {
        globalError.value = '背景圖片上傳失敗，請再試一次'
        uploadingBg.value = false
        return
    }

    const { data } = $supabase.storage.from('backgrounds').getPublicUrl(fileName)
    await $supabase.from('profiles').update({ bg_image_url: data.publicUrl }).eq('id', profile.value.id)
    profile.value.bg_image_url = data.publicUrl
    uploadingBg.value = false
}

//移除背景圖片
async function removeBgImage() {
    await $supabase.from('profiles').update({ bg_image_url: null, bg_type: 'color' }).eq('id', profile.value.id)
    profile.value.bg_image_url = null
    profile.value.bg_type = 'color'
}

async function onDragEnd() {
    const updates = links.value.map((link, index) => ({ id: link.id, position: index }))
    for (const update of updates) {
        const { error } = await $supabase
            .from('links')
            .update({ position: update.position })
            .eq('id', update.id)
        if (error) {
            globalError.value = '排序儲存失敗，請再試一次'
            return
        }
    }
}
//建立用戶名稱
async function createProfile() {
    usernameError.value = ''

    if (!username.value) { usernameError.value = '請輸入用戶名稱'; return }
    if (!/^[a-z0-9_]+$/.test(username.value)) { usernameError.value = '只能使用小寫英文、數字和底線'; return }

    saving.value = true

    const { data: { user } } = await $supabase.auth.getUser()

    const { error } = await $supabase.from('profiles').insert({
        id: user.id,
        username: username.value,
        display_name: user.user_metadata.full_name
    })

    if (error) {
        usernameError.value = error.code === '23505' ? '這個名稱已經被使用了' : '建立失敗，請再試一次'
        saving.value = false
        return
    }

    const { data } = await $supabase.from('profiles').select('*').eq('id', user.id).single()
    profile.value = data
    saving.value = false
    await fetchLinks()
}
</script>