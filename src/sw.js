//custom service worker using workbox

console.log('In sw.js file');

workbox.skipWaiting();
workbox.clientsClaim();

//install event listener
self.addEventListener('install', event => {
  console.log('install')
  // const asyncInstall = new Promise(resolve => {
  //   console.log('Waiting to resolve...')
  //   setTimeout(resolve, 5000);
  // })

  // event.waitUntil(asyncInstall)
})
//activate event listener
self.addEventListener('activate', event => {
  console.log('activate')
})

//lets use cahce for CDN Third party libs
/** for this we will use registerRout an input params url to lib or
 * RegExp for all urls which start from https and finishe .css or .js
 * Second input param, strategy
 */
// workbox.routing.registerRoute(
//   new RegExp('https:.*min\.(css|js)'),
//   workbox.strategies.staleWhileRevalidate({
//     cacheName: 'cdn-cache'
//   })
// )

//lets use cahce for API calls. 
workbox.routing.registerRoute(
  new RegExp('http://.*:4567.*\.json'),
  workbox.strategies.networkFirst()
)

/** even listener for cath any fetch from app */
self.addEventListener('fetch', event =>{
  //check req is POST or DELETE
  if(event.request.method === 'POST' || event.request.method === 'DELETE') {
    //call this fetch
    event.respondWith(
      fetch(event.request).catch(err => {
        return new Response(
          JSON.stringify({ error: "This action disabled while app is offline"}),
          {
            headers: { 'Content-Type': 'application/json'}
          }
        )
      })
    )
  }
})

//tell worbox to cache static res.
/**
 * This will use the list of files from the __precacheManifest,
 * which is automatically generated by the inject manifest webpack plug-in and cache those files at the correct route.
 * */
workbox.precaching.precacheAndRoute(self.__precacheManifest || [])