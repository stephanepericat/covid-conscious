import { COMMUNITY, FORUM, LIBRARY, LINK, NEWS, RESOURCE, VIDEO } from '../constants/types'

export const isCommunity = (type) => type === COMMUNITY
export const isForum = (type) => type === FORUM
export const isLibrary = (type) => type === LIBRARY
export const isNews = (type) => type === LINK || type === NEWS
export const isResource = (type) => type === RESOURCE
export const isVideo = (type) => type === VIDEO

export const isExternalLink = (type) => isNews(type) || isResource(type) || isLibrary(type)
