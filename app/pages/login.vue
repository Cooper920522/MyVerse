<template>
    <div class="min-h-screen flex items-center justify-center px-4"
        style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 40%, #a7f3d0 100%);">

        <div class="w-full max-w-sm rounded-2xl p-8"
            style="background: rgba(255,255,255,0.75); border: 1px solid rgba(16,185,129,0.2); backdrop-filter: blur(20px)">

            <div class="mb-8">
                <img src="/Logo.png" alt="Myverse" style="height: 80px; width: auto;" class="mb-1" />
                <p class="text-sm mt-1" style="color: #6b7280">你在網路上的專屬宇宙</p>
            </div>

            <!-- 切換登入/註冊 -->
            <div class="flex gap-2 mb-6">
                <button @click="mode = 'login'" :style="mode === 'login'
                    ? 'background: linear-gradient(135deg, #059669, #34d399); color: white;'
                    : 'background: white; border: 1px solid rgba(16,185,129,0.25); color: #6b7280'"
                    class="flex-1 py-2 text-xs font-medium rounded-xl transition">
                    登入
                </button>
                <button @click="mode = 'register'" :style="mode === 'register'
                    ? 'background: linear-gradient(135deg, #059669, #34d399); color: white;'
                    : 'background: white; border: 1px solid rgba(16,185,129,0.25); color: #6b7280'"
                    class="flex-1 py-2 text-xs font-medium rounded-xl transition">
                    註冊
                </button>
            </div>

            <div class="flex flex-col gap-3">
                <!-- Email 輸入 -->
                <input v-model="email" type="email" placeholder="電子郵件"
                    class="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                    style="background: white; border: 1px solid rgba(16,185,129,0.25); color: #065f46"
                    onfocus="this.style.borderColor='rgba(5,150,105,0.5)'"
                    onblur="this.style.borderColor='rgba(16,185,129,0.25)'" />

                <!-- 密碼輸入 -->
                <input v-model="password" type="password" placeholder="密碼"
                    class="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                    style="background: white; border: 1px solid rgba(16,185,129,0.25); color: #065f46"
                    onfocus="this.style.borderColor='rgba(5,150,105,0.5)'"
                    onblur="this.style.borderColor='rgba(16,185,129,0.25)'" />

                <!-- 確認密碼（只有註冊時顯示） -->
                <input v-if="mode === 'register'" v-model="confirmPassword" type="password" placeholder="確認密碼"
                    class="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                    style="background: white; border: 1px solid rgba(16,185,129,0.25); color: #065f46"
                    onfocus="this.style.borderColor='rgba(5,150,105,0.5)'"
                    onblur="this.style.borderColor='rgba(16,185,129,0.25)'" />

                <p v-if="error" class="text-xs" style="color: #ef4444">{{ error }}</p>
                <p v-if="successMsg" class="text-xs" style="color: #059669">{{ successMsg }}</p>

                <!-- 登入/註冊按鈕 -->
                <GreenButton :text="mode === 'login' ? '登入' : '註冊'"
                    :loading-text="mode === 'login' ? '登入中...' : '註冊中...'" :loading="loading"
                    @click="mode === 'login' ? loginWithEmail() : registerWithEmail()" />

                <!-- 分隔線 -->
                <div class="flex items-center gap-3 my-1">
                    <div class="flex-1 h-px" style="background: rgba(16,185,129,0.2)"></div>
                    <span class="text-xs" style="color: #9ca3af">或</span>
                    <div class="flex-1 h-px" style="background: rgba(16,185,129,0.2)"></div>
                </div>

                <!-- Google 登入 -->
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
                    使用 Google 帳號登入
                </button>
            </div>

            <p class="text-xs text-center mt-6" style="color: #9ca3af">登入即代表你同意我們的服務條款</p>
        </div>

    </div>
</template>

<script setup>
const { $supabase } = useNuxtApp()

const mode = ref('login')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const successMsg = ref('')

async function loginWithEmail() {
    error.value = ''
    if (!email.value || !password.value) {
        error.value = '請輸入電子郵件和密碼'
        return
    }

    loading.value = true
    const { error: err } = await $supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
    })

    if (err) {
        if (err.message.includes('Invalid login credentials')) {
            error.value = '帳號或密碼錯誤，如果你之前使用 Google 登入，請點擊下方的 Google 登入按鈕'
        } else if (err.message.includes('Email not confirmed')) {
            error.value = '請先到信箱點擊驗證連結，完成帳號驗證後再登入'
        } else {
            error.value = '登入失敗，請再試一次'
        }
        loading.value = false
        return
    }
    navigateTo('/dashboard')
}

async function registerWithEmail() {
    error.value = ''
    successMsg.value = ''

    if (!email.value || !password.value) {
        error.value = '請輸入電子郵件和密碼'
        return
    }
    if (password.value.length < 6) {
        error.value = '密碼至少需要 6 個字元'
        return
    }
    if (password.value !== confirmPassword.value) {
        error.value = '兩次密碼輸入不一致'
        return
    }

    loading.value = true
    const { error: err } = await $supabase.auth.signUp({
        email: email.value,
        password: password.value
    })

    if (err) {
        error.value = '註冊失敗，請再試一次'
        loading.value = false
        return
    }

    successMsg.value = '註冊成功！請檢查你的電子郵件並點擊驗證連結'
    loading.value = false
}

async function loginWithGoogle() {
    loading.value = true
    const { error: err } = await $supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/dashboard`
        }
    })
    if (err) {
        error.value = '登入失敗，請再試一次'
        loading.value = false
    }
}
</script>