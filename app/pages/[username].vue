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
                    <LinkCard :link="link" :profile="profile" @click="recordClick" />
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

//監聽LinkCard元件發出的'click'
async function recordClick(linkId) {
    await $supabase
        .from('link_clicks')
        .insert({ link_id: linkId })
}
</script>