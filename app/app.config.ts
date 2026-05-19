export default defineAppConfig({
  ui: {
    colors: {
      primary: "black",
      secondary: "purple",
      neutral: "neutral",
    },
    modal: {
      slots: {
        title: "uppercase text-center",
        description: "uppercase text-center",
        body: "text-center",
      },
    },
    pageHero: {
      slots: {
        title: "text-4xl sm:text-4xl text-center text-pretty tracking-tight",
      },
    },
    pageList: {
      base: "relative flex flex-col items-center gap-0",
    },
    pageCard: {
      slots: {
        root: "text-center w-full text-pretty tracking-tight",
        container: "relative flex flex-col flex-1 lg:grid gap-x-8 gap-y-0 p-1 sm:p-1",
        body: "text-center w-full text-pretty tracking-tight",
        wrapper: "text-center w-full text-pretty tracking-tight",
      },
    },
  },
});
