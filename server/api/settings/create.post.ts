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
            fieldName === 'desktopFontSize'
              ? 'Desktop_Font_Size'
              : fieldName === 'largeDesktopFontSize'
                ? 'Large_Desktop_Font_Size'
                : fieldName === 'mobileFontSize'
                  ? 'Mobile_Font_Size'
                  : fieldName === 'showTopProgressBar'
                    ? 'Show_Top_Progress_Bar'
                    : fieldName === 'tabletFontSize'
                      ? 'Tablet_Font_Size'
                      : fieldName === 'favicon'
                        ? 'favicon'
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

      if (body.desktopFontSize !== undefined)
        formData.append('Desktop_Font_Size', String(body.desktopFontSize))
      if (body.largeDesktopFontSize !== undefined)
        formData.append('Large_Desktop_Font_Size', String(body.largeDesktopFontSize))
      if (body.mobileFontSize !== undefined)
        formData.append('Mobile_Font_Size', String(body.mobileFontSize))
      if (body.showTopProgressBar !== undefined)
        formData.append('Show_Top_Progress_Bar', String(body.showTopProgressBar))
      if (body.tabletFontSize !== undefined)
        formData.append('Tablet_Font_Size', String(body.tabletFontSize))
    }

    const response = await fetch(`${pocketbaseUrl}/api/collections/Settings/records`, {
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
