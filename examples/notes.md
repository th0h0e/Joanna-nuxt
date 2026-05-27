Starting prompt:

I am currently working on a nuxt project that has an admin page
serving as a cms for the content [admin].
However the actual data is mostly fetched from a pocketbase instance on a remote vps.
I would like to work on the cms with you but
before we do so I want you to familiarize yourself with
[@server][@composables] to get a better understanding of the project

Taks:

- Try reusing code (composables & utilities)
- Add Tab or sidebar to the admin page for collections (maybe)
- change delay to 400 ms
-

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



For the Nuxt Carousel Layer


Embla Core (copied from open source)
app/composables/carousel/

Alignment.ts
Animations.ts
Axis.ts
Counter.ts
DragHandler.ts
DragTracker.ts
EmblaCarousel.ts
Engine.ts
EventHandler.ts
EventStore.ts
Limit.ts
NodeRects.ts
Options.ts
OptionsHandler.ts
PercentOfView.ts
Plugins.ts
PluginsHandler.ts
ResizeHandler.ts
ScrollBody.ts
ScrollBounds.ts
ScrollContain.ts
ScrollLimit.ts
ScrollLooper.ts
ScrollProgress.ts
ScrollSnaps.ts
ScrollTarget.ts
ScrollTo.ts
SlideFocus.ts
SlideLooper.ts
SlideRegistry.ts
SlideSizes.ts
SlidesHandler.ts
SlidesInView.ts
SlidesToScroll.ts
Translate.ts
Vector1d.ts
utils.ts


Vue Composables

app/composables/useCarousel.ts          — Vue wrapper (lifecycle, reactive state, actions)
app/composables/useWheelGestures.ts     — Trackpad swipe adapter (wheel-gestures → synthetic mouse events)

Vue Components

app/components/Carousel/EmblaRoot.vue              — Carousel wrapper (ref, provide)
app/components/Carousel/EmblaSlide.vue             — Individual slide
app/components/Carousel/CarouselNewCarousel.vue    — Full carousel with title overlay + modal (like CarouselDesktop)

Page

app/pages/custom-carousel.vue         — Test page (same data/layout as index.vue)

npm Dependency

wheel-gestures                         — Trackpad wheel event normalization + momentum detection
