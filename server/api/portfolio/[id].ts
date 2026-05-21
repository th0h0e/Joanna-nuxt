import { defineEventHandler, getRouterParam, readBody, readMultipartFormData, createError, sendNoContent } from 'h3'

export default defineEventHandler(async (event) => {
  const { pocketbaseUrl } = useRuntimeConfig(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing project ID' })
  }

  const method = event.method

  // GET — fetch a single project (camelCase transformed)
  if (method === 'GET') {
    const response = await fetch(
      `${pocketbaseUrl}/api/collections/Portfolio_Projects/records/${id}`
    )

    if (!response.ok) {
      throw createError({ statusCode: response.status, statusMessage: 'Project not found' })
    }

    const item: {
      id: string
      Title: string
      Description: string
      Images: string[]
      Responsibility_json: unknown
      created: string
      updated: string
    } = await response.json()

    return {
      id: item.id,
      title: item.Title,
      description: item.Description,
      images: item.Images,
      responsibility: item.Responsibility_json,
      created: item.created,
      updated: item.updated
    }
  }

  // PATCH — update a project
  if (method === 'PATCH') {
    const contentType = getRequestHeader(event, 'content-type') || ''
    const formData = new FormData()

    if (contentType.includes('multipart/form-data')) {
      // Forward multipart data, transforming camelCase field names to PocketBase's PascalCase
      const parts = await readMultipartFormData(event)
      if (parts) {
        for (const part of parts) {
          const fieldName = part.name!

          // Map camelCase field names to PocketBase's PascalCase collection field names
          // Also handle PocketBase file modifiers:
          //   'images_add'    → 'Images+'  (append new files alongside existing)
          //   'images_remove' → 'Images-'  (delete specific files)
          const pbFieldName
            = fieldName === 'title' ? 'Title'
              : fieldName === 'description' ? 'Description'
                : fieldName === 'responsibility' ? 'Responsibility_json'
                  : fieldName === 'images_add' ? 'Images+'
                    : fieldName === 'images_remove' ? 'Images-'
                      : fieldName === 'images' ? 'Images'
                        : fieldName

          if (part.filename && part.type) {
            // File part — forward as Blob
            formData.append(pbFieldName, new Blob([part.data], { type: part.type }), part.filename)
          } else {
            // Text part
            formData.append(pbFieldName, part.data.toString())
          }
        }
      }
    } else {
      // Convert JSON body to FormData for PocketBase
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
  }

  // DELETE — remove a project
  if (method === 'DELETE') {
    const response = await fetch(
      `${pocketbaseUrl}/api/collections/Portfolio_Projects/records/${id}`,
      { method: 'DELETE' }
    )

    if (!response.ok) {
      const error = await response.json()
      throw createError({ statusCode: response.status, statusMessage: error.message || 'Delete failed' })
    }

    sendNoContent(event)
    return
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
