import {
  BLOG,
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
  VIDEO,
} from '../constants/types'

export const isBlog = (type: string) => type === BLOG
export const isBrand = (type: string) => type === BRAND
export const isCommunity = (type: string) => type === COMMUNITY
export const isCovidnet = (type: string) => type === COVIDNET
export const isDirectory = (type: string) => type === DIRECTORY
export const isEvent = (type: string) => type === EVENT
export const isForum = (type: string) => type === FORUM
export const isHealth = (type: string) => type === HEALTH
export const isLibrary = (type: string) => type === LIBRARY
export const isNews = (type: string) => type === NEWS
export const isProduct = (type: string) => type === PRODUCT
export const isResource = (type: string) => type === RESOURCE
export const isSearch = (type: string) => type === SEARCH
export const isTag = (type: string) => type == TAG
export const isVideo = (type: string) => type === VIDEO

export const isExternalLink = (type: string) => isNews(type) || isHealth(type)
export const showPublicationDate = (type: string) =>
  !isBrand(type) &&
  !isProduct(type) &&
  !isCovidnet(type) &&
  !isDirectory(type) &&
  !isResource(type)
