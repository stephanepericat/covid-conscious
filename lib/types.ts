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
  display?: {
    description: string
    icon?: string
    title: string
  }
  id: string
  link?: string
  title: string
}
