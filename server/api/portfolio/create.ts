import { defineEventHandler, readMultipartFormData, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { pocketbaseUrl } = useRuntimeConfig(event)

  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  const contentType = getRequestHeader(event, 'content-type') || ''

  if (contentType.includes('multipart/form-data')) {
    const parts = await readMultipartFormData(event)
    const formData = new FormData()

    if (parts) {
      for (const part of parts) {
        const fieldName = part.name!

        // Map camelCase field names to PocketBase's PascalCase collection field names
        const pbFieldName
          = fieldName === 'title' ? 'Title'
            : fieldName === 'description' ? 'Description'
              : fieldName === 'responsibility' ? 'Responsibility_json'
                : fieldName === 'order' ? 'Order'
                  : fieldName === 'images' ? 'Images'
                    : fieldName

        if (part.filename && part.type) {
          formData.append(pbFieldName, new Blob([part.data], { type: part.type }), part.filename)
        } else {
          formData.append(pbFieldName, part.data.toString())
        }
      }
    }

    const response = await fetch(
      `${pocketbaseUrl}/api/collections/Portfolio_Projects/records`,
      {
        method: 'POST',
        body: formData
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw createError({ statusCode: response.status, statusMessage: error.message || 'Create failed' })
    }

    // Invalidate cache after mutation
    await $fetch('/api/portfolio/invalidate', { method: 'POST' })

    const item = await response.json()
    return { success: true, id: item.id }
  }

  // Handle JSON body
  const body = await readBody(event)

  // Transform camelCase → PascalCase for PocketBase
  const pbData: Record<string, unknown> = {}
  if (body.title !== undefined) pbData.Title = body.title
  if (body.description !== undefined) pbData.Description = body.description
  if (body.responsibility !== undefined) pbData.Responsibility_json = body.responsibility
  if (body.order !== undefined) pbData.Order = body.order

  const response = await fetch(
    `${pocketbaseUrl}/api/collections/Portfolio_Projects/records`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pbData)
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw createError({ statusCode: response.status, statusMessage: error.message || 'Create failed' })
  }

  // Invalidate cache after mutation
  await $fetch('/api/portfolio/invalidate', { method: 'POST' })

  const item = await response.json()
  return { success: true, id: item.id }
})
