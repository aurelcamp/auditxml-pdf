import { renderToString } from 'vue/server-renderer';
import { createApp } from './main';
import { basename } from 'node:path'

/**
 * initiate the Vue App for a server-side application,
 * we use renderToString to render the app to HTML,
 * which can be sent from the server to the cleint
 */

export const render = async (xmlUrl, manifest) => {
  const { app } = createApp();
  app.provide('xmlUrl', xmlUrl)
  const ctx = {}
  const html = await renderToString(app, ctx);
  // console.log(html)
  // console.log(ctx)
  // const preloadLinks = renderPreloadLinks(ctx.modules, manifest)
  // console.log(preloadLinks)
  return {
    html,
  };
};

// function renderPreloadLinks(modules, manifest) {
//   let links = ''
//   const seen = new Set()
//   modules.forEach((id) => {
//     const files = manifest[id]
//     if (files) {
//       files.forEach((file) => {
//         if (!seen.has(file)) {
//           seen.add(file)
//           console.log(file)
//           const filename = basename(file)
//           if (manifest[filename]) {
//             for (const depFile of manifest[filename]) {
//               links += renderPreloadLink(depFile)
//               seen.add(depFile)
//             }
//           }
//           links += renderPreloadLink(file)
//         }
//       })
//     }
//   })
//   return links
// }

// function renderPreloadLink(file) {
//   if (file.endsWith('.js')) {
//     return `<link rel="modulepreload" crossorigin href="${file}">`
//   } else if (file.endsWith('.css')) {
//     return `<link rel="stylesheet" href="${file}">`
//   } else if (file.endsWith('.woff')) {
//     return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
//   } else if (file.endsWith('.woff2')) {
//     return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
//   } else if (file.endsWith('.gif')) {
//     return ` <link rel="preload" href="${file}" as="image" type="image/gif">`
//   } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
//     return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`
//   } else if (file.endsWith('.png')) {
//     return ` <link rel="preload" href="${file}" as="image" type="image/png">`
//   } else {
//     // TODO
//     return ''
//   }
// }
