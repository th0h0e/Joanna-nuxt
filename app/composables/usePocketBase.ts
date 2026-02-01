/**
 * PocketBase Client Composable
 * Provides a typed PocketBase client that proxies through Nuxt API
 */

import PocketBase from 'pocketbase'
import type {
  TypedPocketBase,
  Collections,
  CollectionResponses,
} from '~/shared/types/pocketbase-types'

let pb: TypedPocketBase | null = null

/**
 * Get the typed PocketBase instance
 * Uses the Nuxt API proxy endpoint
 */
export function usePocketBase(): TypedPocketBase {
  if (!pb) {
    // Use the Nuxt API proxy as the base URL
    pb = new PocketBase('/api/pocketbase') as TypedPocketBase

    // Disable auto-cancellation to prevent issues with navigation
    pb.autoCancellation(false)
  }

  return pb
}

/**
 * Fetch a single record by ID
 * @example
 * const { data, error, status } = await usePocketBaseRecord('Homepage', 'abc123')
 */
export async function usePocketBaseRecord<T extends keyof CollectionResponses>(
  collection: T,
  id: string,
  options?: {
    expand?: string
    fields?: string
  },
) {
  const { data, error, status, refresh } = await useLazyFetch<CollectionResponses[T]>(
    () => `/api/pocketbase/collections/${collection}/records/${id}`,
    {
      query: options,
      server: false, // Client-side only
    },
  )

  return { data, error, status, refresh }
}

/**
 * Fetch a list of records with pagination
 * @example
 * const { data } = await usePocketBaseList('Portfolio_Projects', {
 *   page: 1,
 *   perPage: 10,
 *   sort: '-created',
 * })
 */
export async function usePocketBaseList<T extends keyof CollectionResponses>(
  collection: T,
  options?: {
    page?: number
    perPage?: number
    sort?: string
    filter?: string
    expand?: string
    fields?: string
  },
) {
  const { data, error, status, refresh } = await useLazyFetch<{
    page: number
    perPage: number
    totalItems: number
    totalPages: number
    items: CollectionResponses[T][]
  }>(
    () => `/api/pocketbase/collections/${collection}/records`,
    {
      query: {
        page: options?.page || 1,
        perPage: options?.perPage || 30,
        ...(options?.sort && { sort: options.sort }),
        ...(options?.filter && { filter: options.filter }),
        ...(options?.expand && { expand: options.expand }),
        ...(options?.fields && { fields: options.fields }),
      },
      server: false, // Client-side only
    },
  )

  return { data, error, status, refresh }
}

/**
 * Fetch all records (no pagination)
 * @example
 * const { data } = await usePocketBaseFullList('Portfolio_Projects', {
 *   sort: '-Order',
 * })
 */
export async function usePocketBaseFullList<T extends keyof CollectionResponses>(
  collection: T,
  options?: {
    sort?: string
    filter?: string
    expand?: string
    fields?: string
  },
) {
  const { data, error, status, refresh } = await useLazyFetch<CollectionResponses[T][]>(
    () => `/api/pocketbase/collections/${collection}/records`,
    {
      query: {
        perPage: 500, // PocketBase max for getFullList
        ...(options?.sort && { sort: options.sort }),
        ...(options?.filter && { filter: options.filter }),
        ...(options?.expand && { expand: options.expand }),
        ...(options?.fields && { fields: options.fields }),
      },
      server: false, // Client-side only
      transform: (response: any) => {
        // Transform paginated response to just items array
        return response.items || response
      },
    },
  )

  return { data, error, status, refresh }
}

/**
 * Fetch the first record matching a filter
 * @example
 * const { data } = await usePocketBaseFirstListItem('Homepage', 'Is_Active = true')
 */
export async function usePocketBaseFirstListItem<T extends keyof CollectionResponses>(
  collection: T,
  filter: string,
  options?: {
    expand?: string
    fields?: string
  },
) {
  const { data, error, status, refresh } = await useLazyFetch<CollectionResponses[T]>(
    () => `/api/pocketbase/collections/${collection}/records`,
    {
      query: {
        filter,
        perPage: 1,
        ...(options?.expand && { expand: options.expand }),
        ...(options?.fields && { fields: options.fields }),
      },
      server: false, // Client-side only
      transform: (response: any) => {
        // Return first item from the list
        return response.items?.[0] || null
      },
    },
  )

  return { data, error, status, refresh }
}

/**
 * Get the URL for a PocketBase file (image, document, etc.)
 * @example
 * const imageUrl = usePocketBaseFileUrl(homepageRecord, 'Hero_Image', { thumb: '800x600' })
 */
export function usePocketBaseFileUrl<T extends keyof CollectionResponses>(
  record: CollectionResponses[T] | null | undefined,
  filename: string,
  options?: {
    thumb?: string // e.g., '100x100', '0x100', '100x0'
  },
): string {
  if (!record || !filename) {
    return ''
  }

  const collection = record.collectionName
  const recordId = record.id

  let url = `/api/pb-files/${collection}/${recordId}/${filename}`

  if (options?.thumb) {
    url += `?thumb=${options.thumb}`
  }

  return url
}
