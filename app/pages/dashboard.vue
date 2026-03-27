<template>
    <div class="min-h-screen bg-purple-50">

        <!-- 載入中 -->
        <div v-if="loading" class="flex items-center justify-center min-h-screen">
            <p class="text-gray-400 text-sm">載入中...</p>
        </div>

        <!-- 還沒設定 username -->
        <div v-else-if="!profile" class="flex items-center justify-center min-h-screen">
            <div class="bg-white rounded-2xl shadow-sm border border-purple-100 p-8 w-full max-w-sm">
                <h1 class="text-2xl font-medium text-purple-700 mb-1">設定你的 Myverse</h1>
                <p class="text-sm text-gray-400 mb-6">選一個獨特的用戶名稱</p>

                <div class="mb-4">
                    <label class="text-sm text-gray-500 mb-1 block">用戶名稱</label>
                    <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <span class="text-sm text-gray-300 px-3">myverse.me/</span>
                        <input v-model="username" type="text" placeholder="yourname"
                            class="flex-1 py-3 pr-3 text-sm outline-none" />
                    </div>
                    <p v-if="usernameError" class="text-xs text-red-400 mt-1">{{ usernameError }}</p>
                </div>

                <button @click="createProfile" :disabled="saving"
                    class="w-full bg-purple-600 text-white rounded-xl py-3 text-sm hover:bg-purple-700 transition disabled:opacity-50">
                    {{ saving ? '建立中...' : '建立我的頁面' }}
                </button>
            </div>
        </div>

        <!-- 主要後台 -->
        <div v-else class="max-w-xl mx-auto py-12 px-4">

            <!-- 標題列 -->
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-xl font-medium text-purple-700">Myverse</h1>
                    <p class="text-sm text-gray-400">myverse.me/{{ profile.username }}</p>
                </div>
                <div class="flex items-center gap-4">

                    <a :href="`/${profile.username}`" target="_blank"
                        class="text-sm text-purple-500 hover:text-purple-700 transition">
                        查看我的頁面 →
                    </a>
                    <button @click="logout" class="text-sm text-gray-400 hover:text-gray-600 transition">
                        登出
                    </button>
                </div>
            </div>
            <!-- 背景設定 -->
            <div class="bg-white rounded-2xl border border-purple-100 p-6 mb-4">
                <h2 class="text-sm font-medium text-gray-600 mb-4">背景設定</h2>

                <!-- 背景類型切換 -->
                <div class="flex gap-2 mb-4">
                    <button @click="setBgType('color')"
                        :class="profile.bg_type === 'color' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'"
                        class="text-xs px-4 py-2 rounded-xl transition">
                        顏色
                    </button>
                    <button @click="setBgType('image')"
                        :class="profile.bg_type === 'image' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'"
                        class="text-xs px-4 py-2 rounded-xl transition">
                        圖片
                    </button>
                </div>

                <!-- 顏色選擇 -->
                <div v-if="profile.bg_type === 'color'" class="flex flex-wrap gap-2">
                    <button v-for="color in bgColors" :key="color" @click="setBgColor(color)"
                        :style="{ backgroundColor: color }"
                        :class="profile.bg_color === color ? 'ring-2 ring-purple-500 ring-offset-2' : ''"
                        class="w-8 h-8 rounded-full transition" />
                </div>

                <!-- 圖片上傳 -->
                <div v-if="profile.bg_type === 'image'">
                    <input type="file" accept="image/*" @change="uploadBgImage" class="text-sm text-gray-500" />
                    <div v-if="profile.bg_image_url" class="mt-3 relative">
                        <img :src="profile.bg_image_url" class="w-full h-24 object-cover rounded-xl" />
                        <button @click="removeBgImage"
                            class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg hover:bg-red-600 transition">
                            刪除圖片
                        </button>
                    </div>
                </div>
            </div>
            <!-- 新增卡片 -->
            <div class="bg-white rounded-2xl border border-purple-100 p-6 mb-4">
                <h2 class="text-sm font-medium text-gray-600 mb-4">新增卡片</h2>

                <!-- 類型選擇 -->
                <div class="flex gap-2 mb-4">
                    <button v-for="t in cardTypes" :key="t.value" @click="newType = t.value"
                        :class="newType === t.value ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'"
                        class="text-xs px-4 py-2 rounded-xl transition">
                        {{ t.label }}
                    </button>
                </div>

                <div class="flex flex-col gap-3">
                    <input v-model="newTitle" type="text" :placeholder="titlePlaceholder"
                        class="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-300" />
                    <input v-if="newType !== 'image'" v-model="newUrl" type="text" :placeholder="urlPlaceholder"
                        class="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-300" />
                    <input v-if="newType === 'image'" type="file" accept="image/*" @change="onCardImageSelected"
                        class="text-sm text-gray-500" />
                    <p v-if="linkError" class="text-xs text-red-400">{{ linkError }}</p>
                    <button @click="addLink" :disabled="addingLink"
                        class="bg-purple-600 text-white rounded-xl py-3 text-sm hover:bg-purple-700 transition disabled:opacity-50">
                        {{ addingLink ? '新增中...' : '+ 新增卡片' }}
                    </button>
                </div>
            </div>

            <!-- 連結清單 -->
            <div class="bg-white rounded-2xl border border-purple-100 p-6">
                <h2 class="text-sm font-medium text-gray-600 mb-4">我的連結（{{ links.length }}）</h2>
                <div v-if="links.length === 0" class="text-sm text-gray-300 text-center py-4">
                    還沒有連結，新增一個吧！
                </div>
                <div v-else>
                    <VueDraggable v-model="links" :animation="150" handle=".drag-handle" class="flex flex-col gap-3"
                        @end="onDragEnd">
                        <div v-for="link in links" :key="link.id"
                            class="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                            <div class="flex items-center gap-3">
                                <span class="drag-handle cursor-grab text-gray-300 hover:text-gray-400">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <circle cx="9" cy="5" r="1" fill="currentColor" />
                                        <circle cx="9" cy="12" r="1" fill="currentColor" />
                                        <circle cx="9" cy="19" r="1" fill="currentColor" />
                                        <circle cx="15" cy="5" r="1" fill="currentColor" />
                                        <circle cx="15" cy="12" r="1" fill="currentColor" />
                                        <circle cx="15" cy="19" r="1" fill="currentColor" />
                                    </svg>
                                </span>
                                <div>
                                    <p class="text-sm font-medium text-gray-700">{{ link.title }}</p>
                                    <p class="text-xs text-gray-400 mt-0.5">{{ link.url }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3 ml-4">
                                <button @click="openEdit(link)"
                                    class="text-xs text-purple-400 hover:text-purple-600 transition">
                                    編輯
                                </button>
                                <button @click="deleteLink(link.id)"
                                    class="text-xs text-red-400 hover:text-red-600 transition">
                                    刪除
                                </button>
                            </div>
                        </div>
                    </VueDraggable>
                </div>
                <!-- 編輯表單 Modal -->
                <div v-if="editingLink"
                    class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
                    @click.self="closeEdit">
                    <div class="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
                        <h2 class="text-sm font-medium text-gray-600 mb-4">編輯卡片</h2>
                        <div class="flex flex-col gap-3">
                            <input v-model="editTitle" type="text" placeholder="標題"
                                class="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-300" />
                            <input v-if="editingLink.type !== 'image'" v-model="editUrl" type="text" placeholder="網址"
                                class="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-300" />
                            <p v-if="editError" class="text-xs text-red-400">{{ editError }}</p>
                            <div class="flex gap-2">
                                <button @click="closeEdit"
                                    class="flex-1 border border-gray-200 text-gray-500 rounded-xl py-3 text-sm hover:bg-gray-50 transition">
                                    取消
                                </button>
                                <button @click="saveEdit" :disabled="saving"
                                    class="flex-1 bg-purple-600 text-white rounded-xl py-3 text-sm hover:bg-purple-700 transition disabled:opacity-50">
                                    {{ saving ? '儲存中...' : '儲存' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { VueDraggable } from 'vue-draggable-plus'

const { $supabase } = useNuxtApp()

const loading = ref(true)
const saving = ref(false)
const profile = ref(null)
const username = ref('')
const usernameError = ref('')

const editingLink = ref(null)
const editTitle = ref('')
const editUrl = ref('')
const editError = ref('')

const newTitle = ref('')
const links = ref([])
const newUrl = ref('')
const newType = ref('link')
const newCardImageFile = ref(null)
const linkError = ref('')
const addingLink = ref(false)

const cardTypes = [
    { value: 'link', label: '連結' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'image', label: '圖片' }
]

const titlePlaceholder = computed(() => {
    if (newType.value === 'youtube') return '影片標題（例如：我的頻道精選）'
    if (newType.value === 'image') return '圖片說明（選填）'
    return '連結名稱（例如：我的 YouTube）'
})

const urlPlaceholder = computed(() => {
    if (newType.value === 'youtube') return 'YouTube 網址（例如：https://youtube.com/watch?v=...）'
    return '網址（例如：https://youtube.com/...）'
})

function onCardImageSelected(event) {
    newCardImageFile.value = event.target.files[0]
}

//在頁面載入時查看登入狀態，若沒登入就導向登入頁面。
onMounted(async () => {
    const { data: { user } } = await $supabase.auth.getUser()
    if (!user) return navigateTo('/login')

    const { data } = await $supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    profile.value = data
    loading.value = false

    if (data) await fetchLinks()
})

//獲取連結
async function fetchLinks() {
    const { data } = await $supabase
        .from('links')
        .select('*')
        .eq('profile_id', profile.value.id)
        .order('position')

    links.value = data || []
}

//新增連結
async function addLink() {
    linkError.value = ''

    if (!newTitle.value && newType.value !== 'image') {
        linkError.value = 'Please enter a title'
        return
    }

    if (newType.value === 'link') {
        if (!newUrl.value) {
            linkError.value = 'Please enter a URL'
            return
        }
        if (!newUrl.value.startsWith('http')) {
            linkError.value = 'URL must start with http:// or https://'
            return
        }
    }

    if (newType.value === 'youtube') {
        if (!newUrl.value.includes('youtube.com') && !newUrl.value.includes('youtu.be')) {
            linkError.value = '請輸入有效的 YouTube 網址'
            return
        }
    }

    if (newType.value === 'image' && !newCardImageFile.value) {
        linkError.value = '請選擇一張圖片'
        return
    }

    addingLink.value = true

    let finalUrl = newUrl.value

    // 上傳圖片卡片的圖片
    if (newType.value === 'image' && newCardImageFile.value) {
        const file = newCardImageFile.value
        const fileExt = file.name.split('.').pop()
        const fileName = `${profile.value.id}-card-${Date.now()}.${fileExt}`

        const { error: uploadError } = await $supabase.storage
            .from('backgrounds')
            .upload(fileName, file)

        if (uploadError) {
            linkError.value = '圖片上傳失敗，請再試一次'
            addingLink.value = false
            return
        }

        const { data } = $supabase.storage
            .from('backgrounds')
            .getPublicUrl(fileName)

        finalUrl = data.publicUrl
    }

    const { error } = await $supabase
        .from('links')
        .insert({
            profile_id: profile.value.id,
            title: newTitle.value,
            url: finalUrl,
            type: newType.value,
            position: links.value.length
        })

    if (error) {
        linkError.value = 'Failed to add, please try again'
        addingLink.value = false
        return
    }

    newTitle.value = ''
    newUrl.value = ''
    newType.value = 'link'
    newCardImageFile.value = null
    addingLink.value = false
    await fetchLinks()
}

//刪除連結
async function deleteLink(id) {
    await $supabase.from('links').delete().eq('id', id)
    await fetchLinks()
}

function openEdit(link) {
    editingLink.value = link
    editTitle.value = link.title
    editUrl.value = link.url
}

function closeEdit() {
    editingLink.value = null
    editTitle.value = ''
    editUrl.value = ''
    editError.value = ''
}

async function saveEdit() {
    editError.value = ''

    if (!editTitle.value && editingLink.value.type !== 'image') {
        editError.value = '請輸入標題'
        return
    }

    if (editingLink.value.type === 'link' && !editUrl.value.startsWith('http')) {
        editError.value = '網址必須以 http:// 或 https:// 開頭'
        return
    }

    saving.value = true

    const { error } = await $supabase
        .from('links')
        .update({
            title: editTitle.value,
            url: editingLink.value.type !== 'image' ? editUrl.value : editingLink.value.url
        })
        .eq('id', editingLink.value.id)

    if (error) {
        editError.value = '儲存失敗，請再試一次'
        saving.value = false
        return
    }

    saving.value = false
    closeEdit()
    await fetchLinks()
}

//登出帳號
async function logout() {
    await $supabase.auth.signOut()
    navigateTo('/login')
}

//背景顏色選項
const bgColors = [
    '#f3e8ff', '#ede9fe', '#dbeafe', '#e0f2fe',
    '#dcfce7', '#fef9c3', '#ffe4e6', '#f1f5f9',
    '#1e1b4b', '#0f172a'
]

//選擇背景類型(圖片、顏色)
async function setBgType(type) {
    profile.value.bg_type = type
    await $supabase
        .from('profiles')
        .update({ bg_type: type })
        .eq('id', profile.value.id)
}

//設定背景顏色
async function setBgColor(color) {
    profile.value.bg_color = color
    await $supabase
        .from('profiles')
        .update({ bg_color: color })
        .eq('id', profile.value.id)
}

//上傳背景圖片
async function uploadBgImage(event) {
    const file = event.target.files[0]
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${profile.value.id}-bg.${fileExt}`

    const { error } = await $supabase.storage
        .from('backgrounds')
        .upload(fileName, file, { upsert: true })

    if (error) {
        console.error(error)
        return
    }

    const { data } = $supabase.storage
        .from('backgrounds')
        .getPublicUrl(fileName)

    await $supabase
        .from('profiles')
        .update({ bg_image_url: data.publicUrl })
        .eq('id', profile.value.id)

    profile.value.bg_image_url = data.publicUrl
}

//刪除背景圖片
async function removeBgImage() {
    await $supabase
        .from('profiles')
        .update({ bg_image_url: null, bg_type: 'color' })
        .eq('id', profile.value.id)

    profile.value.bg_image_url = null
    profile.value.bg_type = 'color'
}

async function onDragEnd() {
    const updates = links.value.map((link, index) => ({
        id: link.id,
        position: index
    }))

    for (const update of updates) {
        await $supabase
            .from('links')
            .update({ position: update.position })
            .eq('id', update.id)
    }
}

//建立個人頁面
async function createProfile() {
    usernameError.value = ''

    if (!username.value) {
        usernameError.value = '請輸入用戶名稱'
        return
    }
    if (!/^[a-z0-9_]+$/.test(username.value)) {
        usernameError.value = '只能使用小寫英文、數字和底線'
        return
    }

    saving.value = true

    const { data: { user } } = await $supabase.auth.getUser()

    const { error } = await $supabase
        .from('profiles')
        .insert({
            id: user.id,
            username: username.value,
            display_name: user.user_metadata.full_name
        })

    if (error) {
        if (error.code === '23505') {
            usernameError.value = '這個名稱已經被使用了'
        } else {
            usernameError.value = '建立失敗，請再試一次'
        }
        saving.value = false
        return
    }

    const { data } = await $supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    profile.value = data
    saving.value = false
    await fetchLinks()
}
</script>