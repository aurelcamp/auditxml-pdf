import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import cors from 'cors'
import exec from 'await-exec'
import { writeFile } from 'fs/promises'
import fs from 'node:fs'
import multer from 'multer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const port = 5174

async function createServer() {
  const app = express()

  app.use(cors())
  app.use(express.static('static'))

  var xmlStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'static/temp/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + uniqueSuffix() + path.extname(file.originalname))
    }
  })
  const upload = multer({ storage: xmlStorage })

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  const uniqueSuffix = () => Date.now() + '-' + Math.round(Math.random() * 1E9)

  const toAbsolute = (p) => path.resolve(__dirname, p)

  const toPublicUrl = (url) => url.replace('static\\', '');

  const manifest = JSON.parse(
    fs.readFileSync(toAbsolute('dist/client/.vite/ssr-manifest.json'), 'utf-8'),
  )

  app.post('/generate-pdf', [vite.middlewares, upload.single('xmlAudit')], async (req, res) => {
    const { render } = await vite.ssrLoadModule('/src/entry-server.js');
    const appHtml = await render(`http://localhost:${port}/${toPublicUrl(req.file.path)}`, manifest);

    appHtml.html = appHtml.html.replace(/src[ ]*=[ ]*"[ ]*(\/images\/.*?)"/g, 'src="./dist/client$1"')
    
    const htmlFileName = `data-${uniqueSuffix()}.html`
    const htmlFilePath = `${htmlFileName}`
    
    let indexHtml = fs.readFileSync(toAbsolute('dist/client/index.html'), 'utf-8')
    
    const regexHref = /href=\"(.*?)"\>/g
    indexHtml = indexHtml.replace(regexHref, 'href="./dist/client$1">')
    // remove useless js
    indexHtml = indexHtml.replace(/<script type="module" (.*?)\><\/script>/g, '')

    indexHtml = indexHtml.replace(`<!--main-app-->`, appHtml.html);
    
    try {
      await writeFile(htmlFilePath, indexHtml)
    } catch(e) {
      console.log(`error write html file: ${e.message}`);
    }

    const pdfFileName = `pdf-audit-${uniqueSuffix()}.pdf`
    try {
      await exec(`pagedjs-cli ${htmlFileName} -o temp/uploads/${pdfFileName}`)
    } catch(e) {
      console.log(`error generation pdf: ${e.message}`);
    }

    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.log(`error delete xml file: ${e.message}`);
      }
    })

    fs.unlink(htmlFilePath, (err) => {
      if (err) {
        console.log(`error delete html file: ${e.message}`);
      }
    })

    res.send('Generated');
  });

  app.listen(port)
}

createServer()
