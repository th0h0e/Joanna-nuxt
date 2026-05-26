

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
  '/api/**': { cors: true },
  '/_nuxt/': { redirect: '/' }  // redirect bare path to home
}
