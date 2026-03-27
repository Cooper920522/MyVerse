<template>
    <div class="min-h-screen bg-purple-50">

        <!-- Navbar -->
        <nav class="flex items-center justify-between px-8 py-5">
            <h1 class="text-xl font-medium text-purple-700">Myverse</h1>

            <a href="/login"
                class="bg-purple-600 text-white text-sm px-5 py-2 rounded-xl hover:bg-purple-700 transition">
                立即開始
            </a>
        </nav>

        <!-- Hero -->
        <div class="flex flex-col items-center text-center px-4 pt-20 pb-32">
            <div class="inline-block bg-purple-100 text-purple-600 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
                你在網路上的專屬宇宙
            </div>
            <h2 class="text-5xl font-medium text-gray-800 leading-tight max-w-lg">
                一個連結。<br />展現完整的你。
            </h2>
            <p class="text-gray-400 mt-6 max-w-sm text-base leading-relaxed">
                Myverse 讓你把所有連結、社群帳號和內容，整合在一個漂亮的個人頁面。
            </p>

            <a href="/login" class="mt-10 bg-purple-600 text-white px-8 py-4 rounded-2xl text-sm font-medium hover:bg-purple-700
            transition">
                免費建立我的 Myverse
            </a>
            <p class="text-xs text-gray-300 mt-3">不需要信用卡</p>
        </div>

        <!-- Features -->
        <div class="max-w-3xl mx-auto px-4 pb-32">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div class="bg-white border border-purple-100 rounded-2xl p-6">
                    <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                    </div>
                    <h3 class="text-sm font-medium text-gray-700 mb-1">所有連結一次整合</h3>
                    <p class="text-xs text-gray-400 leading-relaxed">無限新增連結，社群帳號、網站、作品集通通放進來。</p>
                </div>

                <div class="bg-white border border-purple-100 rounded-2xl p-6">
                    <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4l3 3" />
                        </svg>
                    </div>
                    <h3 class="text-sm font-medium text-gray-700 mb-1">即時更新</h3>
                    <p class="text-xs text-gray-400 leading-relaxed">隨時修改你的頁面，更新立即生效，訪客馬上看到。</p>
                </div>

                <div class="bg-white border border-purple-100 rounded-2xl p-6">
                    <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                    </div>
                    <h3 class="text-sm font-medium text-gray-700 mb-1">完全個人化</h3>
                    <p class="text-xs text-gray-400 leading-relaxed">自訂主題、個人簡介和頭貼，打造專屬於你的風格。</p>
                </div>

            </div>
        </div>

        <!-- Footer -->
        <div class="text-center pb-10">
            <p class="text-xs text-gray-300">© 2026 Myverse. 保留所有權利。</p>
        </div>

    </div>
</template>