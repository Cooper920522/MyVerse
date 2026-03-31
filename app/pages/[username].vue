<template>
    <div class="min-h-screen flex flex-col items-center py-16 px-4" :style="bgStyle">
        <div v-if="pending" class="text-gray-400 text-sm">Loading...</div>

        <div v-else-if="!profile" class="text-gray-400 text-sm">
            此頁面不存在
        </div>

        <div v-else class="w-full max-w-xs">

            <!-- 頭像和基本資訊 -->
            <div class="text-center mb-10">
                <div class="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center"
                    style="box-shadow: 0 4px 20px rgba(0,0,0,0.12); border: 3px solid rgba(255,255,255,0.8)">
                    <img v-if="profile.avatar_url" :src="profile.avatar_url" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center"
                        style="background: rgba(255,255,255,0.5)">
                        <span class="text-3xl font-medium" style="color: #374151">
                            {{ profile.display_name?.charAt(0) || profile.username.charAt(0) }}
                        </span>
                    </div>
                </div>
                <h1 class="text-xl font-medium" :style="{ color: profileTextColor }">
                    {{ profile.display_name || profile.username }}
                </h1>
                <p v-if="profile.bio" class="text-sm mt-2 leading-relaxed max-w-xs mx-auto"
                    :style="{ color: profileSubTextColor }">
                    {{ profile.bio }}
                </p>
            </div>

            <!-- 卡片清單 -->
            <div class="flex flex-col gap-3">
                <template v-for="link in links" :key="link.id">

                    <!-- 一般連結 -->
                    <a v-if="link.type === 'link' || !link.type" :href="link.url" target="_blank"
                        rel="noopener noreferrer" :style="{
                            backgroundColor: profile.link_color || '#ffffff',
                            borderRadius: linkRadius,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }"
                        class="block w-full px-6 py-4 text-center text-sm font-medium transition-all duration-200 hover:opacity-75 hover:-translate-y-0.5"
                        :class="linkTextClass" style="border: 1px solid rgba(255,255,255,0.6)"
                        @click="recordClick(link.id)">
                        {{ link.title }}
                        <CountdownBadge v-if="link.expires_at" :expires-at="link.expires_at" :center="true"
                            class="mt-2" />
                    </a>
                    <!-- YouTube 影片 -->
                    <div v-else-if="link.type === 'youtube'" class="w-full overflow-hidden" :style="{
                        borderRadius: linkRadius,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        border: '1px solid rgba(255,255,255,0.6)'
                    }">
                        <p v-if="link.title" class="text-sm font-medium px-4 py-3 text-center"
                            style="background: rgba(255,255,255,0.8); color: #374151">
                            {{ link.title }}
                        </p>
                        <div class="relative w-full" style="padding-top: 56.25%">
                            <iframe :src="getYoutubeEmbedUrl(link.url)" class="absolute top-0 left-0 w-full h-full"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen />
                        </div>
                    </div>

                    <!-- 圖片 -->
                    <div v-else-if="link.type === 'image'" class="w-full overflow-hidden" :style="{
                        borderRadius: linkRadius,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        border: '1px solid rgba(255,255,255,0.6)'
                    }">
                        <img :src="link.url" class="w-full object-cover" />
                        <p v-if="link.title" class="text-sm font-medium px-4 py-3 text-center"
                            style="background: rgba(255,255,255,0.8); color: #374151">
                            {{ link.title }}
                        </p>
                    </div>

                    <!-- 蝦皮商品卡片 -->
                    <a v-else-if="link.type === 'shopee'" :href="link.url" target="_blank" rel="noopener noreferrer"
                        class="block w-full overflow-hidden transition-all duration-200 hover:opacity-75 hover:-translate-y-0.5"
                        :style="{
                            backgroundColor: profile.link_color || '#ffffff',
                            borderRadius: linkRadius,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            border: '1px solid rgba(255,255,255,0.6)'
                        }" @click="recordClick(link.id)">
                        <img v-if="link.thumbnail" :src="link.thumbnail" class="w-full h-40 object-cover" />
                        <div class="px-5 py-3 flex items-center justify-between gap-3">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium" :class="linkTextClass">{{ link.title }}</p>
                                <CountdownBadge v-if="link.expires_at" :expires-at="link.expires_at" class="mt-1" />
                            </div>
                            <span class="text-xs font-medium flex-shrink-0 px-3 py-1 rounded-full"
                                style="background: #ee4d2d; color: white">蝦皮</span>
                        </div>
                    </a>

                    <!-- LINE 加好友 -->
                    <a v-else-if="link.type === 'line'" :href="link.url" target="_blank" rel="noopener noreferrer"
                        class="block w-full py-4 text-center text-sm font-medium transition-all duration-200 hover:opacity-75 hover:-translate-y-0.5"
                        :style="{
                            borderRadius: linkRadius,
                            boxShadow: '0 2px 8px rgba(6,199,85,0.25)'
                        }" style="background: #06C755; color: white;" @click="recordClick(link.id)">
                        <div class="flex items-center justify-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11.5h-3.5V17h-3v-3.5H7v-3h3.5V7h3v3.5H17v3z" />
                            </svg>
                            {{ link.title || '加入 LINE 好友' }}
                        </div>
                    </a>

                    <!-- Pressplay 訂閱卡片 -->
                    <a v-else-if="link.type === 'pressplay'" :href="link.url" target="_blank" rel="noopener noreferrer"
                        class="block w-full overflow-hidden transition-all duration-200 hover:opacity-75 hover:-translate-y-0.5"
                        :style="{
                            borderRadius: linkRadius,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            border: '1px solid rgba(255,255,255,0.6)'
                        }" @click="recordClick(link.id)">
                        <img v-if="link.thumbnail" :src="link.thumbnail" class="w-full h-36 object-cover" />
                        <div class="px-4 py-3 flex items-center justify-between gap-3"
                            :style="{ backgroundColor: profile.link_color || '#ffffff' }">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium truncate" :class="linkTextClass">{{ link.title }}</p>
                                <CountdownBadge v-if="link.expires_at" :expires-at="link.expires_at" class="mt-1" />
                            </div>
                            <span class="text-xs font-medium flex-shrink-0 px-3 py-1 rounded-full"
                                style="background: #e8554e; color: white">
                                Pressplay
                            </span>
                        </div>
                    </a>

                </template>
            </div>

            <!-- 頁腳 -->
            <p class="text-center text-xs mt-12"
                :style="{ color: isDarkBg ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)' }">
                Powered by Myverse
            </p>

        </div>
    </div>
</template>

<script setup>
const route = useRoute()
const { $supabase } = useNuxtApp()

const profile = ref(null)
const links = ref([])
const pending = ref(true)

const bgStyle = computed(() => {
    if (!profile.value) return { backgroundColor: '#f3e8ff' }
    if (profile.value.bg_type === 'image' && profile.value.bg_image_url) {
        return {
            backgroundImage: `url(${profile.value.bg_image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }
    }
    return { backgroundColor: profile.value.bg_color || '#f3e8ff' }
})

const now = ref(new Date())

onMounted(() => {
    setInterval(() => {
        now.value = new Date()
    }, 1000)
})

function getCountdown(expiresAt) {
    const diff = new Date(expiresAt) - now.value
    if (diff <= 0) return null

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    if (days > 0) return `${days} 天 ${hours} 時 ${minutes} 分 ${seconds} 秒`
    if (hours > 0) return `${hours} 時 ${minutes} 分 ${seconds} 秒`
    return `${minutes} 分 ${seconds} 秒`
}

useHead({
    title: () => profile.value ? `${profile.value.display_name || profile.value.username} | Myverse` : 'Myverse',
    meta: [
        {
            name: 'description',
            content: () => profile.value?.bio || `查看 ${profile.value?.display_name || profile.value?.username} 的 Myverse 個人頁面`
        },
        {
            property: 'og:title',
            content: () => profile.value ? `${profile.value.display_name || profile.value.username} | Myverse` : 'Myverse'
        },
        {
            property: 'og:description',
            content: () => profile.value?.bio || `查看 ${profile.value?.display_name || profile.value?.username} 的 Myverse 個人頁面`
        },
        {
            property: 'og:image',
            content: () => profile.value?.avatar_url || ''
        },
        {
            property: 'og:type',
            content: 'profile'
        },
        {
            name: 'twitter:card',
            content: 'summary'
        }
    ]
})

onMounted(async () => {
    const { data: profileData } = await $supabase
        .from('profiles')
        .select('*')
        .eq('username', route.params.username)  //從profiles表內查詢值和route.params.username相同的username欄位
        .single()

    profile.value = profileData //找到後將profileData(也就是profiles表的data)的資料存到profile

    if (profileData) {
        const { data: linksData } = await $supabase
            .from('links')
            .select('*')
            .eq('profile_id', profileData.id)
            .neq('is_visible', false)
            .order('position')

        // 過濾掉已到期的連結
        const now = new Date()
        links.value = (linksData || []).filter(link => {
            if (!link.expires_at) return true
            return new Date(link.expires_at) > now
        })
    }

    if (profileData) {
        await $supabase
            .from('page_views')
            .insert({ profile_id: profileData.id })
    }

    pending.value = false
})

function getYoutubeEmbedUrl(url) {
    let videoId = ''
    if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0]
    } else if (url.includes('watch?v=')) {
        videoId = url.split('watch?v=')[1].split('&')[0]
    }
    return `https://www.youtube.com/embed/${videoId}`
}

const linkRadius = computed(() => {
    if (profile.value?.link_radius === 'square') return '8px'
    if (profile.value?.link_radius === 'pill') return '9999px'
    return '16px' // rounded（預設）
})

const linkTextClass = computed(() => {
    const color = profile.value?.link_color || '#ffffff'
    // 深色背景用白色文字，淺色背景用深色文字
    const dark = ['#1e293b', '#0f172a', '#065f46']
    return dark.includes(color) ? 'text-white' : 'text-gray-700'
})

const isDarkBg = computed(() => {
    const color = profile.value?.bg_color || '#f3e8ff'
    if (profile.value?.bg_type === 'image') return false

    // 把 hex 顏色轉成 RGB，計算亮度
    const hex = color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    // 亮度公式（人眼對綠色最敏感）
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness < 128
})

const profileTextColor = computed(() => {
    return isDarkBg.value ? 'rgba(255,255,255,0.9)' : '#1f2937'
})

const profileSubTextColor = computed(() => {
    return isDarkBg.value ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'
})

async function recordClick(linkId) {
    await $supabase
        .from('link_clicks')
        .insert({ link_id: linkId })
}
</script>