import { FORUM, POST } from "../constants/types";

export const mapForumSearchResult = (result) => {
  const { t } = useI18n()
  const [year, month, day] = result.created_at.split("-");

  return {
    categoryUri: result.topic,
    type: FORUM,
    author: {
      nickname: result.profiles.username,
      slug: result.profiles.id,
    },
    published: `${year}-${month}-${day}T12:00:01Z`,
    category: t(`supabase-forum.create.categories.${result.topic}`),
    avatar: result.avatar,
    title: result.headline,
    path: `/${FORUM}/${POST}/${result.id}`,
  }
}