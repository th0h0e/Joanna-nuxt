Starting prompt:

I am currently working on a nuxt project that has an admin page
serving as a cms for the content [admin].
However the actual data is mostly fetched from a pocketbase instance on a remote vps.
I would like to work on the cms with you but
before we do so I want you to familiarize yourself with
[@server][@composables] to get a better understanding of the project

Taks:

- Add Tab or sidebar to the admin page for collections (maybe)
- change delay to 400 ms
- Create a clean interface for the api responses within the components.
- If neccesary create a layer for the server that parses the data first so that it can be called in a clean interface on within the component

Maybe:

for H3 error in the terminal:

routeRules: {
'/api/\*\*': { cors: true },
'/\_nuxt/': { redirect: '/' } // redirect bare path to home
}

Copy the pure math/utilities as-is (~15 files, ~500 lines total)
Write a Vue composable (useCarousel.ts) that:
Sets up the engine in onMounted
Cleans up in onUnmounted
Exposes reactive state (currentIndex, scrollProgress, etc.)
Adapt DragHandler to work with your composable — the event handling logic stays identical, just wire it to Vue lifecycle
Write a simplified wheel gesture handler — you can skip the full wheel-gestures library complexity if you're willing to accept a slightly less polished experience. The momentum detection is the hardest part; for a simpler version you can just:
Accumulate wheel.deltaX on each event
Debounce the end with a simple timeout
Snap to next/prev slide based on accumulated delta direction
