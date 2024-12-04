import './_astro_content_Byp4kc5z.mjs';

function slugify(input) {
  if (!input) return "";
  var slug = input.toLowerCase().trim();
  slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  slug = slug.replace(/[^a-z0-9\s-]/g, " ").trim();
  slug = slug.replace(/[\s-]+/g, "-");
  return slug;
}

function sortItemsByDateDesc(itemA, itemB) {
  return new Date(itemB.data.publishDate).getTime() - new Date(itemA.data.publishDate).getTime();
}
function getAllTags(posts) {
  const tags = /* @__PURE__ */ new Set();
  posts.forEach((post) => {
    (post.data.tags || []).forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).map((tag) => ({
    name: tag,
    slug: slugify(tag)
  }));
}
function getPostsByTag(posts, tagSlug) {
  return posts.filter(
    (post) => (post.data.tags || []).map((tag) => slugify(tag)).includes(tagSlug)
  );
}

export { getPostsByTag as a, slugify as b, getAllTags as g, sortItemsByDateDesc as s };
