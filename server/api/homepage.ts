export default defineEventHandler(async (event) => {
  const response = await fetch(
    "https://admin.kontext.site/api/collections/Homepage/records",
  ).then((res) => res.json());

  // Get first record (assuming Homepage collection has only one record)
  const record = response.items?.[0];

  if (!record) {
    return null;
  }

  // Transform to match expected format
  return {
    id: record.id,
    title: record.Hero_Title,
    image: record.Hero_Image,
    imageUrl: `https://admin.kontext.site/api/files/Homepage/${record.id}/${record.Hero_Image}`,
  };
});
