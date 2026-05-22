export default defineEventHandler(async (event) => {
  const { pocketbaseUrl } = useRuntimeConfig(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing about record ID' })
  }

  const contentType = getRequestHeader(event, 'content-type') || ''
  const formData = new FormData()

  try {
    if (contentType.includes('multipart/form-data')) {
      const parts = await readMultipartFormData(event)
      if (parts) {
        for (const part of parts) {
          const fieldName = part.name!

          const pbFieldName
            = fieldName === 'aboutDescription' ? 'About_Description'
              : fieldName === 'clientListJson' ? 'Client_List_Json'
                : fieldName === 'contactEmail' ? 'Contact_Email'
                  : fieldName === 'contactMessage' ? 'Contact_Message'
                    : fieldName === 'expertiseDescription' ? 'Expertise_Description'
                      : fieldName === 'expertiseTitle' ? 'Expertise_Title'
                        : fieldName === 'isActive' ? 'Is_Active'
                          : fieldName === 'portfolioTitle' ? 'Portfolio_Title'
                            : fieldName === 'selectedClientsTitle' ? 'Selected_Clients_Title'
                              : fieldName

          if (part.filename && part.type) {
            formData.append(pbFieldName, new Blob([part.data], { type: part.type }), part.filename)
          } else {
            formData.append(pbFieldName, part.data.toString())
          }
        }
      }
    } else {
      // Convert JSON body to FormData for PocketBase
      // Always using FormData since About may have file fields in the future
      const body = await readBody(event)

      if (body.aboutDescription !== undefined) formData.append('About_Description', body.aboutDescription)
      if (body.clientListJson !== undefined) formData.append('Client_List_Json', typeof body.clientListJson === 'object' ? JSON.stringify(body.clientListJson) : body.clientListJson)
      if (body.contactEmail !== undefined) formData.append('Contact_Email', body.contactEmail)
      if (body.contactMessage !== undefined) formData.append('Contact_Message', body.contactMessage)
      if (body.expertiseDescription !== undefined) formData.append('Expertise_Description', body.expertiseDescription)
      if (body.expertiseTitle !== undefined) formData.append('Expertise_Title', body.expertiseTitle)
      if (body.isActive !== undefined) formData.append('Is_Active', String(body.isActive))
      if (body.portfolioTitle !== undefined) formData.append('Portfolio_Title', body.portfolioTitle)
      if (body.selectedClientsTitle !== undefined) formData.append('Selected_Clients_Title', body.selectedClientsTitle)
    }

    const response = await fetch(
      `${pocketbaseUrl}/api/collections/About/records/${id}`,
      {
        method: 'PATCH',
        body: formData
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw createError({ statusCode: response.status, statusMessage: data.message || 'Update failed' })
    }

    return { success: true }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    throw createError({ statusCode: 503, statusMessage: 'PocketBase is unreachable' })
  }
})
