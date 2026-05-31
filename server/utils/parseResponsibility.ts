// small utility that protects against null, missing values, and unexpected shapes in pocketbase json responses.
export function parseResponsibility(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string')
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.filter((v): v is string => typeof v === 'string')
    } catch {
      /* not JSON */
    }
    return value ? [value] : []
  }
  return []
}
