import { LINK, RESOURCE } from '../constants/types'

export const isExternalLink = (type) => type === LINK || type === RESOURCE
export const isNews = (type) => type === LINK
export const isResource = (type) => type === RESOURCE