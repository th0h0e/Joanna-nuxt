export default defineEventHandler(async (event) => {
  const { pocketbaseUrl } = useRuntimeConfig(event);

  const response: {
    items: Array<{
      id: string;
      Title: string;
      Description: string;
      Images: string[];
      Order: number;
      Responsibility_json: unknown;
      created: string;
      updated: string;
    }>;
  } = await fetch(
    `${pocketbaseUrl}/api/collections/Portfolio_Projects/records`,
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
