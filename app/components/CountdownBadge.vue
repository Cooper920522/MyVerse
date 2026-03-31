<template>
    <div v-if="countdown" class="flex items-center gap-1.5 px-3 py-1 rounded-full w-fit"
        :class="center ? 'mx-auto justify-center' : 'justify-start'"
        style="background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25)">
        <span style="font-size: 11px">⏰</span>
        <span class="font-black tracking-wide" style="color: #ef4444; font-size: 13px">
            限時優惠倒數 {{ countdown }}
        </span>
    </div>
</template>

<script setup>
const props = defineProps({
    expiresAt: {
        type: String,
        required: true
    },
    center: {
        type: Boolean,
        default: false
    }
})

const now = ref(new Date())

onMounted(() => {
    setInterval(() => {
        now.value = new Date()
    }, 1000)
})

const countdown = computed(() => {
    const diff = new Date(props.expiresAt) - now.value
    if (diff <= 0) return null

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    if (days > 0) return `${days} 天 ${hours} 時 ${minutes} 分 ${seconds} 秒`
    if (hours > 0) return `${hours} 時 ${minutes} 分 ${seconds} 秒`
    return `${minutes} 分 ${seconds} 秒`
})
</script>