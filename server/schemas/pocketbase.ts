import { z } from 'zod'

// ── Portfolio Projects ──────────────────────────────────────
export const portfolioProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  images: z.array(z.string()).optional(),
  responsibility: z.array(z.string()).optional(),
  order: z.number().int().optional(),
})
export const portfolioProjectUpdateSchema = portfolioProjectSchema.partial()

// ── About ───────────────────────────────────────────────────
export const aboutSchema = z.object({
  aboutDescription: z.string().min(1),
  clientListJson: z.unknown().optional(),
  contactEmail: z.string().min(1),
  contactMessage: z.string().optional(),
  expertiseDescription: z.string().optional(),
  expertiseTitle: z.string().optional(),
  portfolioTitle: z.string().optional(),
  selectedClientsTitle: z.string().optional(),
  isActive: z.boolean().optional(),
})
export const aboutUpdateSchema = aboutSchema.partial()

// ── Homepage ────────────────────────────────────────────────
export const homepageSchema = z.object({
  heroTitle: z.string().min(1),
  heroImage: z.string().optional(),
  heroImageMobile: z.string().optional(),
  isActive: z.boolean().optional(),
})
export const homepageUpdateSchema = homepageSchema.partial()

// ── Settings ────────────────────────────────────────────────
export const settingsSchema = z.object({
  mobileFontSize: z.number().int().positive().optional(),
  tabletFontSize: z.number().int().positive().optional(),
  desktopFontSize: z.number().int().positive().optional(),
  largeDesktopFontSize: z.number().int().positive().optional(),
  showTopProgressBar: z.boolean().optional(),
  favicon: z.string().optional(),
})
export const settingsUpdateSchema = settingsSchema.partial()

// ── Table Order ─────────────────────────────────────────────
export const tableOrderSchema = z.object({
  key: z.string().optional(),
  orderedIds: z.array(z.string()),
})
