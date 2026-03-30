// 接收前端請求
export default defineEventHandler(async (event) => {    //evnt代表HTTP請求的所有資訊，由Nuxt建立
    const body = await readBody(event) //readBody把前端傳過來的body JSON字串轉換成物件
    const { url } = body //解構賦值，從body裡取出url

    if (!url) {
        throw createError({ statusCode: 400, message: 'URL is required' })
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)'
            }
        })

        const html = await response.text()

        // 從HTML解析商品資訊
        const getMetaContent = (property: string) => {
            const match = html.match(
                new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i')
            ) || html.match(
                new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`, 'i')
            )
            return match ? match[1] : ''
        }

        const title = getMetaContent('og:title')
        const image = getMetaContent('og:image')
        const description = getMetaContent('og:description')

        return { title, image, description }
    } catch (error) {
        throw createError({ statusCode: 500, message: 'Failed to fetch URL' })
    }
})