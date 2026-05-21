export default defineEventHandler(async (event) => {
  const { pocketbaseUrl } = useRuntimeConfig(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing project ID' })
  }

  const contentType = getRequestHeader(event, 'content-type') || ''
  const formData = new FormData()

  if (contentType.includes('multipart/form-data')) {
    const parts = await readMultipartFormData(event)
    if (parts) {
      for (const part of parts) {
        const fieldName = part.name!

        // Special case: images_remove arrives as a JSON array of filenames.
        // Parse it and append each filename individually to PocketBase's "Images-" field.
        if (fieldName === 'images_remove') {
          const filenames = JSON.parse(part.data.toString()) as string[]
          for (const f of filenames) {
            formData.append('Images-', f)
          }
          continue
        }

        const pbFieldName
          = fieldName === 'title' ? 'Title'
            : fieldName === 'description' ? 'Description'
              : fieldName === 'responsibility' ? 'Responsibility_json'
                : fieldName === 'images_add' ? 'Images+'
                  : fieldName === 'images' ? 'Images'
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

    if (body.title !== undefined) formData.append('Title', body.title)
    if (body.description !== undefined) formData.append('Description', body.description)
    if (body.responsibility !== undefined) formData.append('Responsibility_json', body.responsibility)
  }

  const response = await fetch(
    `${pocketbaseUrl}/api/collections/Portfolio_Projects/records/${id}`,
    {
      method: 'PATCH',
      body: formData
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw createError({ statusCode: response.status, statusMessage: error.message || 'Update failed' })
  }

  return { success: true }
})
