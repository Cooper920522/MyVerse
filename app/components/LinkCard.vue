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
            {{ link.title }}
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
                    <p :class="['font-medium truncate', isPreview ? 'text-xs' : 'text-sm', linkTextClass]">{{ link.title
                        }}</p>
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
                <svg :width="isPreview ? 14 : 20" :height="isPreview ? 14 : 20" viewBox="0 0 24 24" fill="white">
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
                    <p :class="['font-medium truncate', isPreview ? 'text-xs' : 'text-sm', linkTextClass]">{{ link.title
                        }}</p>
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

defineEmits(['click'])

const linkRadius = computed(() => {
    if (props.profile?.link_radius === 'square') return '8px'
    if (props.profile?.link_radius === 'pill') return '9999px'
    return '16px'
})

const linkTextClass = computed(() => {
    const color = props.profile?.link_color || '#ffffff'
    const dark = ['#1e293b', '#0f172a', '#065f46']
    return dark.includes(color) ? 'text-white' : 'text-gray-700'
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
</script>