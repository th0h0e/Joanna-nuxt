/**
 * Client-side image compression utility.
 *
 * Reduces image files to a target size by:
 *   1. Scaling the canvas dimensions (area-based estimate)
 *   2. Iteratively reducing JPEG quality until the blob fits
 *
 * Falls back to the lowest quality (0.1) if the target can't be reached,
 * so you always get at least some compression attempt.
 */

/**
 * Compress an image file to fit within `maxSizeKB`.
 *
 * @param file      The source image (any browser-readable format).
 * @param maxSizeKB Target ceiling in kilobytes (default 140 KB).
 * @returns         A JPEG File whose name matches the original.
 */
export default async function compressImage(file: File, maxSizeKB = 140): Promise<File> {
  const MAX_BYTES = maxSizeKB * 1024
  if (file.size <= MAX_BYTES) return file

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img

      // Scale dimensions down using an area-based heuristic
      // with a safety margin (0.85) to account for JPEG overhead.
      const scale = Math.sqrt(MAX_BYTES / file.size) * 0.85
      width = Math.round(width * scale)
      height = Math.round(height * scale)

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)

      const tryCompress = (quality: number): void => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error(`Failed to compress ${file.name}`))
              return
            }
            if (blob.size <= MAX_BYTES || quality <= 0.1) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }))
            } else {
              tryCompress(quality - 0.1)
            }
          },
          'image/jpeg',
          quality
        )
      }

      tryCompress(0.8)
    }
    img.onerror = () => reject(new Error(`Failed to load ${file.name}`))
    img.src = URL.createObjectURL(file)
  })
}
