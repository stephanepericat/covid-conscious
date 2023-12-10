import { COMMUNITY, LIBRARY, LINK, NEWS, RESOURCE } from '../constants/types'

export const isCommunity = (type) => type === COMMUNITY
export const isLibrary = (type) => type === LIBRARY
export const isNews = (type) => type === LINK || type === NEWS
export const isResource = (type) => type === RESOURCE

export const isExternalLink = (type) => isNews(type) || isResource(type) || isLibrary(type)
