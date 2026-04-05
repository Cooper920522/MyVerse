<template>
    <div class="rounded-2xl p-4 text-center"
        style="background: rgba(255,255,255,0.7); border: 1px solid rgba(16,185,129,0.15); backdrop-filter: blur(12px)">
        <p class="text-2xl font-medium" style="color: #065f46">{{ value }}</p>
        <p class="text-xs mt-1" style="color: #6b7280">{{ label }}</p>
    </div>
</template>

<script setup>
defineProps({
    value: {
        type: Number,
        required: true
    },
    label: {
        type: String,
        required: true
    }
})
</script>