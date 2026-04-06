<template>
    <div class="min-h-screen flex items-center justify-center px-4"
        style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 40%, #a7f3d0 100%);">

        <div class="w-full max-w-sm rounded-2xl p-8"
            style="background: rgba(255,255,255,0.75); border: 1px solid rgba(16,185,129,0.2); backdrop-filter: blur(20px)">

            <div class="mb-8">
                <img src="/Logo.png" alt="Myverse" class="h-34 w-auto mb-1" />
                <p class="text-sm mt-1" style="color: #6b7280">你在網路上的專屬宇宙</p>
            </div>

            <p class="text-sm mb-4" style="color: #374151">選擇登入方式</p>

            <button @click="loginWithGoogle" :disabled="loading"
                class="w-full flex items-center justify-center gap-3 rounded-xl py-3 text-sm transition cursor-pointer disabled:opacity-50"
                style="background: white; border: 1px solid rgba(16,185,129,0.25); color: #374151"
                onmouseenter="this.style.background='#f0fdf4'" onmouseleave="this.style.background='white'">
                <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4"
                        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                    <path fill="#34A853"
                        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
                    <path fill="#FBBC05"
                        d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" />
                    <path fill="#EA4335"
                        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" />
                </svg>
                {{ loading ? '登入中...' : '使用 Google 帳號登入' }}
            </button>

            <p class="text-xs text-center mt-6" style="color: #9ca3af">登入即代表你同意我們的服務條款</p>
        </div>

    </div>
</template>

<script setup>
const { $supabase } = useNuxtApp()
const loading = ref(false)

async function loginWithGoogle() {
    loading.value = true
    const { error } = await $supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/dashboard`
        }
    })
    if (error) {
        console.error(error)
        loading.value = false
    }
}
</script>