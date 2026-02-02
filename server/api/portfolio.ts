export default defineEventHandler(async (event) => {
  const response = await fetch(
    "https://admin.kontext.site/api/collections/Portfolio_Projects/records",
  ).then((res) => res.json());

  // Transform the response
  const projects = response.items.map((item) => ({
    id: item.id,
    title: item.Title,
    description: item.Description,
    images: item.Images,
    order: item.Order,
    responsibility: item.Responsibility_json,
    created: item.created,
    updated: item.updated,
  }));

  return projects;
});
