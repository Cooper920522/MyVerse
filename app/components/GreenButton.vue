<template>
    <button :disabled="loading || disabled"
        class="w-full text-white rounded-xl py-3 text-sm font-medium transition disabled:opacity-50"
        style="background: linear-gradient(135deg, #059669, #34d399)" @click="$emit('click')">
        {{ loading ? loadingText : text }}
    </button>
</template>

<script setup>
defineProps({
    text: {
        type: String,
        required: true
    },
    loadingText: {
        type: String,
        default: '處理中...'
    },
    loading: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

defineEmits(['click'])
</script>