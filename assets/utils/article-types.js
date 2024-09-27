import {
  BRAND,
  COMMUNITY,
  COVIDNET,
  DIRECTORY,
  EVENT,
  FORUM,
  HEALTH,
  LIBRARY,
  NEWS,
  PRODUCT,
  RESOURCE,
  SEARCH,
  TAG,
  VIDEO
} from '../constants/types'

export const isBrand = (type) => type === BRAND
export const isCommunity = (type) => type === COMMUNITY
export const isCovidnet = (type) => type === COVIDNET
export const isDirectory = (type) => type === DIRECTORY
export const isEvent = (type) => type === EVENT
export const isForum = (type) => type === FORUM
export const isHealth = (type) => type === HEALTH
export const isLibrary = (type) => type === LIBRARY
export const isNews = (type) => type === NEWS
export const isProduct = (type) => type === PRODUCT
export const isResource = (type) => type === RESOURCE
export const isSearch = (type) => type === SEARCH
export const isTag = (type) => type == TAG
export const isVideo = (type) => type === VIDEO

export const isExternalLink = (type) => isNews(type) || isHealth(type)
export const showPublicationDate = (type) => !isBrand(type) && !isCovidnet(type) && !isDirectory(type) && !isResource(type)
//  || isResource(type) || isLibrary(type) || isEvent(type)
