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

    const data = await response.json()

    // Get first record (assuming Homepage collection has only one record)
    const record = data.items?.[0]

    if (!record) {
      return null
    }

    return {
      id: record.id,
      title: record.Hero_Title,
      image: record.Hero_Image,
      imageUrl: `${pocketbaseUrl}/api/files/Homepage/${record.id}/${record.Hero_Image}`,
      heroImageMobile: record.Hero_Image_Mobile,
      isActive: record.Is_Active
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    throw createError({ statusCode: 503, statusMessage: 'PocketBase is unreachable' })
  }
})
