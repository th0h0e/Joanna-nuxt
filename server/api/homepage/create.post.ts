export default defineEventHandler(async event => {
  const { pocketbaseUrl } = useRuntimeConfig(event)
  const contentType = getRequestHeader(event, 'content-type') || ''
  const formData = new FormData()

  try {
    if (contentType.includes('multipart/form-data')) {
      const parts = await readMultipartFormData(event)

      if (parts) {
        for (const part of parts) {
          const fieldName = part.name!

          const pbFieldName =
            fieldName === 'heroTitle'
              ? 'Hero_Title'
              : fieldName === 'heroImage'
                ? 'Hero_Image'
                : fieldName === 'heroImageMobile'
                  ? 'Hero_Image_Mobile'
                  : fieldName === 'isActive'
                    ? 'Is_Active'
                    : fieldName

          if (part.filename && part.type) {
            formData.append(pbFieldName, new Blob([part.data], { type: part.type }), part.filename)
          } else {
            formData.append(pbFieldName, part.data.toString())
          }
        }
      }
    } else {
      const body = await readBody(event)

      if (body.heroTitle !== undefined) formData.append('Hero_Title', body.heroTitle)
      if (body.isActive !== undefined) formData.append('Is_Active', String(body.isActive))
    }

    const response = await fetch(`${pocketbaseUrl}/api/collections/Homepage/records`, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: data.message || 'Create failed'
      })
    }

    return { success: true, id: data.id }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    throw createError({ statusCode: 503, statusMessage: 'PocketBase is unreachable' })
  }
})
