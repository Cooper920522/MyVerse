<template>
    <div class="rounded-full overflow-hidden flex items-center justify-center flex-shrink-0" :style="{
        width: size + 'px',
        height: size + 'px',
        background: 'rgba(5,150,105,0.15)',
        border: `${borderWidth}px solid rgba(52,211,153,0.4)`
    }">
        <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" />
        <span v-else class="font-medium" :style="{ fontSize: fontSize + 'px', color: '#059669' }">
            {{ initial }}
        </span>
    </div>
</template>

<script setup>
const props = defineProps({
    avatarUrl: {
        type: String,
        default: null
    },
    displayName: {
        type: String,
        default: ''
    },
    username: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        default: 64
    },
    borderWidth: {
        type: Number,
        default: 2
    }
})

const initial = computed(() => {
    return props.displayName?.charAt(0) || props.username.charAt(0)
})

const fontSize = computed(() => {
    return Math.round(props.size * 0.35)
})
</script>