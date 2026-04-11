<template>
    <div>

        <!-- 一般連結 -->
        <component :is="isPreview ? 'div' : 'a'" v-if="link.type === 'link' || !link.type"
            v-bind="isPreview ? {} : { href: link.url, target: '_blank', rel: 'noopener noreferrer' }" :style="{
                backgroundColor: profile.link_color || '#ffffff',
                borderRadius: linkRadius,
                boxShadow: isPreview ? 'none' : '0 2px 8px rgba(0,0,0,0.06)'
            }" :class="[
                'block w-full text-center font-medium transition',
                isPreview ? 'px-4 py-3 text-xs' : 'px-6 py-4 text-sm hover:opacity-75 hover:-translate-y-0.5 duration-200',
                linkTextClass
            ]" style="border: 1px solid rgba(255,255,255,0.6)" @click="!isPreview && $emit('click', link.id)">
            <div class="flex items-center justify-center gap-2">
                <img v-if="link.icon_url && link.icon_url.startsWith('http')" :src="link.icon_url"
                    class="w-5 h-5 object-cover rounded" />
                <div v-else-if="link.icon_url" class="w-5 h-5 flex-shrink-0" v-html="getPresetIconSvg(link.icon_url)" />
                <span>{{ link.title }}</span>
            </div>
            <CountdownBadge v-if="link.expires_at" :expires-at="link.expires_at" :center="true" class="mt-1.5" />
        </component>

        <!-- YouTube -->
        <div v-else-if="link.type === 'youtube'" class="w-full overflow-hidden" :style="{
            borderRadius: linkRadius,
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: isPreview ? 'none' : '0 2px 8px rgba(0,0,0,0.06)'
        }">
            <p v-if="link.title"
                :class="['font-medium text-center', isPreview ? 'text-xs py-2 px-3' : 'text-sm px-4 py-3', linkTextClass]"
                style="background: rgba(255,255,255,0.8)">
                {{ link.title }}
            </p>
            <div v-if="!isPreview" class="relative w-full" style="padding-top: 56.25%">
                <iframe :src="getYoutubeEmbedUrl(link.url)" class="absolute top-0 left-0 w-full h-full" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen />
            </div>
            <div v-else class="relative w-full" style="padding-top: 56.25%; background: #000">
                <div class="absolute inset-0 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white" opacity="0.8">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- 圖片 -->
        <div v-else-if="link.type === 'image'" class="w-full overflow-hidden" :style="{
            borderRadius: linkRadius,
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: isPreview ? 'none' : '0 2px 8px rgba(0,0,0,0.06)'
        }">
            <img :src="link.url" class="w-full object-cover" :style="isPreview ? 'max-height: 120px' : ''" />
            <p v-if="link.title"
                :class="['font-medium text-center', isPreview ? 'text-xs py-2 px-3' : 'text-sm px-4 py-3']"
                style="color: #374151; background: rgba(255,255,255,0.8)">
                {{ link.title }}
            </p>
        </div>

        <!-- 蝦皮 -->
        <component :is="isPreview ? 'div' : 'a'" v-else-if="link.type === 'shopee'"
            v-bind="isPreview ? {} : { href: link.url, target: '_blank', rel: 'noopener noreferrer' }"
            class="block w-full overflow-hidden transition-all duration-200"
            :class="{ 'hover:opacity-75 hover:-translate-y-0.5': !isPreview }" :style="{
                backgroundColor: profile.link_color || '#ffffff',
                borderRadius: linkRadius,
                boxShadow: isPreview ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid rgba(255,255,255,0.6)'
            }" @click="!isPreview && $emit('click', link.id)">
            <img v-if="link.thumbnail" :src="link.thumbnail" class="w-full object-cover"
                :style="isPreview ? 'max-height: 80px' : 'max-height: 160px'" />
            <div :class="['flex items-center justify-between gap-2', isPreview ? 'px-3 py-2' : 'px-5 py-3']">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                        <img v-if="link.icon_url && link.icon_url.startsWith('http')" :src="link.icon_url"
                            class="w-4 h-4 object-cover rounded flex-shrink-0" />
                        <div v-else-if="link.icon_url" class="w-4 h-4 flex-shrink-0"
                            v-html="getPresetIconSvg(link.icon_url)" />
                        <p :class="['font-medium truncate', isPreview ? 'text-xs' : 'text-sm', linkTextClass]">{{
                            link.title }}</p>
                    </div>
                    <CountdownBadge v-if="link.expires_at" :expires-at="link.expires_at" class="mt-1" />
                </div>
                <span
                    :class="['font-medium flex-shrink-0 rounded-full', isPreview ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1']"
                    style="background: #ee4d2d; color: white">蝦皮</span>
            </div>
        </component>

        <!-- LINE -->
        <component :is="isPreview ? 'div' : 'a'" v-else-if="link.type === 'line'"
            v-bind="isPreview ? {} : { href: link.url, target: '_blank', rel: 'noopener noreferrer' }" :class="[
                'block w-full text-center font-medium transition-all duration-200',
                isPreview ? 'py-3 text-xs' : 'py-4 text-sm hover:opacity-75 hover:-translate-y-0.5'
            ]" :style="{ borderRadius: linkRadius }" style="background: #06C755; color: white;"
            @click="!isPreview && $emit('click', link.id)">
            <div class="flex items-center justify-center gap-2">
                <img v-if="link.icon_url && link.icon_url.startsWith('http')" :src="link.icon_url"
                    class="w-5 h-5 object-cover rounded flex-shrink-0" />
                <div v-else-if="link.icon_url" class="w-5 h-5 flex-shrink-0" v-html="getPresetIconSvg(link.icon_url)" />
                <svg v-else :width="isPreview ? 14 : 20" :height="isPreview ? 14 : 20" viewBox="0 0 24 24" fill="white">
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11.5h-3.5V17h-3v-3.5H7v-3h3.5V7h3v3.5H17v3z" />
                </svg>
                {{ link.title || '加入 LINE 好友' }}
            </div>
        </component>

        <!-- Pressplay -->
        <component :is="isPreview ? 'div' : 'a'" v-else-if="link.type === 'pressplay'"
            v-bind="isPreview ? {} : { href: link.url, target: '_blank', rel: 'noopener noreferrer' }"
            class="block w-full overflow-hidden transition-all duration-200"
            :class="{ 'hover:opacity-75 hover:-translate-y-0.5': !isPreview }" :style="{
                borderRadius: linkRadius,
                boxShadow: isPreview ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid rgba(255,255,255,0.6)'
            }" @click="!isPreview && $emit('click', link.id)">
            <img v-if="link.thumbnail" :src="link.thumbnail" class="w-full object-cover"
                :style="isPreview ? 'max-height: 80px' : 'max-height: 144px'" />
            <div :class="['flex items-center justify-between gap-2', isPreview ? 'px-3 py-2' : 'px-4 py-3']"
                :style="{ backgroundColor: profile.link_color || '#ffffff' }">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                        <img v-if="link.icon_url && link.icon_url.startsWith('http')" :src="link.icon_url"
                            class="w-4 h-4 object-cover rounded flex-shrink-0" />
                        <div v-else-if="link.icon_url" class="w-4 h-4 flex-shrink-0"
                            v-html="getPresetIconSvg(link.icon_url)" />
                        <p :class="['font-medium truncate', isPreview ? 'text-xs' : 'text-sm', linkTextClass]">{{
                            link.title }}</p>
                    </div>
                    <CountdownBadge v-if="link.expires_at" :expires-at="link.expires_at" class="mt-1" />
                </div>
                <span
                    :class="['font-medium flex-shrink-0 rounded-full', isPreview ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1']"
                    style="background: #e8554e; color: white">Pressplay</span>
            </div>
        </component>

    </div>
</template>

<script setup>
const props = defineProps({
    link: { type: Object, required: true },
    profile: { type: Object, required: true },
    isPreview: { type: Boolean, default: false }
})

const presetIconSvgs = {
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="#E1306C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="#E1306C" stroke="none"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    twitter: `<svg viewBox="0 0 24 24" fill="#000000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.73-8.835L1.254 2.25H8.08l4.713 5.935L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    tiktok: `<svg viewBox="0 0 24 24" fill="#000000"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    line: `<svg viewBox="0 0 24 24" fill="#06C755"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>`,
    dcard: `<svg viewBox="0 0 24 24" fill="#006AA6"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5c1.243 0 2.25 1.007 2.25 2.25S13.243 9 12 9 9.75 7.993 9.75 6.75 10.757 4.5 12 4.5zm4.5 13.5h-9v-1.5c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5V18z"/></svg>`,
    github: `<svg viewBox="0 0 24 24" fill="#181717"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
    discord: `<svg viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>`,
    twitch: `<svg viewBox="0 0 24 24" fill="#9146FF"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>`,
    email: `<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    website: `<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
}

function getPresetIconSvg(id) {
    return presetIconSvgs[id] || ''
}

// 宣告這個元件會發出 'click' 事件
defineEmits(['click'])

// 把資料庫存的字串轉換成css的圓角值
const linkRadius = computed(() => {
    if (props.profile?.link_radius === 'square') return '8px'
    if (props.profile?.link_radius === 'pill') return '9999px'
    return '16px'
})

// 根據連結卡片的背景顏色，決定文字要用白色還是深色
const linkTextClass = computed(() => {
    const color = props.profile?.link_color || '#ffffff'
    const dark = ['#1e293b', '#0f172a', '#065f46']
    return dark.includes(color) ? 'text-white' : 'text-gray-700'
})

//將兩種youtube影片網址格式轉換成可嵌入iframe的格式
function getYoutubeEmbedUrl(url) {
    let videoId = ''
    if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0]
    } else if (url.includes('watch?v=')) {
        videoId = url.split('watch?v=')[1].split('&')[0]
    }
    return `https://www.youtube.com/embed/${videoId}`
}
</script>