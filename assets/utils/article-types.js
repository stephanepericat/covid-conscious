import { COMMUNITY, LIBRARY, LINK, RESOURCE } from '../constants/types'

export const isCommunity = (type) => type === COMMUNITY
export const isExternalLink = (type) => type === LINK || type === RESOURCE || type === LIBRARY
export const isLibrary = (type) => type === LIBRARY
export const isNews = (type) => type === LINK
export const isResource = (type) => type === RESOURCE