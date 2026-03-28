<template>
    <div class="min-h-screen flex flex-col items-center py-16 px-4" :style="bgStyle">
        <div v-if="pending" class="text-gray-400 text-sm">Loading...</div>

        <div v-else-if="!profile" class="text-gray-400 text-sm">
            This page does not exist.
        </div>

        <div v-else class="w-full max-w-sm">

            <!-- 頭像和基本資訊 -->
            <div class="text-center mb-8">
                <div
                    class="w-20 h-20 rounded-full bg-purple-200 mx-auto mb-3 overflow-hidden flex items-center justify-center">
                    <img v-if="profile.avatar_url" :src="profile.avatar_url" class="w-full h-full object-cover" />
                    <span v-else class="text-2xl text-purple-600 font-medium">
                        {{ profile.display_name?.charAt(0) || profile.username.charAt(0) }}
                    </span>
                </div>
                <h1 class="text-lg font-medium text-gray-800">{{ profile.display_name || profile.username }}</h1>
                <p v-if="profile.bio" class="text-sm text-gray-400 mt-1">{{ profile.bio }}</p>
            </div>

            <!-- 卡片清單 -->
            <div class="flex flex-col gap-3">
                <template v-for="link in links" :key="link.id">

                    <!-- 一般連結 -->
                    <a v-if="link.type === 'link' || !link.type" :href="link.url" target="_blank"
                        rel="noopener noreferrer" :style="{
                            backgroundColor: profile.link_color || '#ffffff',
                            borderRadius: linkRadius
                        }" class="block w-full px-6 py-4 text-center text-sm font-medium transition hover:opacity-80"
                        :class="linkTextClass" style="border: 1px solid rgba(0,0,0,0.08)" @click="recordClick(link.id)">
                        {{ link.title }}
                    </a>

                    <!-- YouTube 影片 -->
                    <div v-else-if="link.type === 'youtube'"
                        class="w-full bg-white border border-purple-100 rounded-2xl overflow-hidden">
                        <p v-if="link.title" class="text-sm font-medium text-gray-700 px-4 py-3 text-center">
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
                    <div v-else-if="link.type === 'image'"
                        class="w-full bg-white border border-purple-100 rounded-2xl overflow-hidden">
                        <img :src="link.url" class="w-full object-cover" />
                        <p v-if="link.title" class="text-sm font-medium text-gray-700 px-4 py-3 text-center">
                            {{ link.title }}
                        </p>
                    </div>

                </template>
            </div>

            <!-- 頁腳 -->
            <p class="text-center text-xs text-gray-300 mt-10">
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

    profile.value = profileData

    if (profileData) {
        const { data: linksData } = await $supabase
            .from('links')
            .select('*')
            .eq('profile_id', profileData.id)
            .order('position')

        links.value = linksData || []
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

async function recordClick(linkId) {
    await $supabase
        .from('link_clicks')
        .insert({ link_id: linkId })
}
</script>