export type Metadata = {
  aspectRatio: number | null
  height: number | null
  width: number | null
}

export type MobileNavItem = Omit<NavConfigChild, 'description'>

export type NavConfigChild = {
  description: string
  id: string
  link: string
  premium?: boolean
  title: string
}

export type NavConfig = {
  children?: NavConfigChild[]
  display?: { description: string; icon?: string; title: string }
  id: string
  link?: string
  title: string
}

export type Publication = {
  date: Date | string
  description?: string
  end: Date | string | null
  free: boolean
  id: string
  language: string
  limited: boolean
  link: string
  metadata: {
    aspectRatio: number | null
    height: number | null
    width: number | null
  } | null
  onlineOnly: boolean
  premium: boolean
  source: string | null
  tags: Tag[]
  title: string | null
  type: string
  url: string | null
  visual: string | null
}

export type Tag = { label: string; slug: string }

export type Target = '_blank' | '_self'
