export default defineEventHandler(async (event) => {
  try {
    const response = await $fetch(
      "https://admin.kontext.site/api/collections/Portfolio_Projects/records",
    );

    return response;
  } catch (error) {
    console.error("Error fetching portfolio projects:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch portfolio projects",
    });
  }
});
