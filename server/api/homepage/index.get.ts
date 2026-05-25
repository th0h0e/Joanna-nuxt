export default defineEventHandler(async event => {
  const { pocketbaseUrl } = useRuntimeConfig(event)

  try {
    const response = await fetch(`${pocketbaseUrl}/api/collections/Homepage/records`)

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Failed to fetch homepage records'
      })
    }

    const data: {
      items: Array<{
        id: string
        Hero_Image?: string
        Hero_Image_Mobile?: string
        Hero_Title?: string
        Is_Active?: boolean
        created: string
        updated: string
      }>
    } = await response.json()

    return data.items.map(item => ({
      id: item.id,
      heroTitle: item.Hero_Title ?? '',
      heroImage: item.Hero_Image ?? '',
      heroImageMobile: item.Hero_Image_Mobile ?? '',
      isActive: item.Is_Active ?? false,
      created: item.created,
      updated: item.updated
    }))
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    throw createError({ statusCode: 503, statusMessage: 'PocketBase is unreachable' })
  }
})
