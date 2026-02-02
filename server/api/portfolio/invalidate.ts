function escapeKey(key: string | string[]) {
  return String(key).replace(/\W/g, "");
}

export default defineEventHandler(async (event) => {
  const normalizedKey = escapeKey("portfolio");
  await useStorage("cache").removeItem(
    `nitro:handlers:portfolio:${normalizedKey}.json`,
  );
  return { success: true, message: "Portfolio cache invalidated" };
});
