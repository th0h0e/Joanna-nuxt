export default defineEventHandler(async (event) => {
  const { pocketbaseUrl } = useRuntimeConfig(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing about record ID' })
  }

  try {
    const response = await fetch(
      `${pocketbaseUrl}/api/collections/About/records/${id}`
    )

    if (!response.ok) {
      throw createError({ statusCode: response.status, statusMessage: 'About record not found' })
    }

    const item: {
      id: string
      About_Description?: string
      Client_List_Json?: unknown
      Contact_Email?: string
      Contact_Message?: string
      Expertise_Description?: string
      Expertise_Title?: string
      Is_Active?: boolean
      Portfolio_Title?: string
      Selected_Clients_Title?: string
      created: string
      updated: string
    } = await response.json()

    return {
      id: item.id,
      aboutDescription: item.About_Description,
      clientListJson: item.Client_List_Json,
      contactEmail: item.Contact_Email,
      contactMessage: item.Contact_Message,
      expertiseDescription: item.Expertise_Description,
      expertiseTitle: item.Expertise_Title,
      isActive: item.Is_Active,
      portfolioTitle: item.Portfolio_Title,
      selectedClientsTitle: item.Selected_Clients_Title,
      created: item.created,
      updated: item.updated
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    throw createError({ statusCode: 503, statusMessage: 'PocketBase is unreachable' })
  }
})
