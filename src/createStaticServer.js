const http = require('http')
const fs = require('fs')
const path = require('path')

const createStaticServer = (port) => {
  console.log(`Running static server on http://localhost:${port}`)

  return http.createServer((request, response) => {
    // Get req path without query string
    let reqPath = request.url.split('?')[0]
    // console.log('req: ' + reqPath)

    // If request is a page
    if (!reqPath.includes('.')) {
      // Use root index page
      reqPath = '/index.html'
    }

    const filePath = path.join(__dirname, '../../../../dist', reqPath)

    const extname = String(path.extname(filePath)).toLowerCase()
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.wav': 'audio/wav',
      '.mp4': 'video/mp4',
      '.woff': 'application/font-woff',
      '.ttf': 'application/font-ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.otf': 'application/font-otf',
      '.svg': 'application/image/svg+xml',
      '.wasm': 'application/wasm'
    }

    const contentType = mimeTypes[extname] || 'application/octet-stream'

    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.writeHead(404, { 'Content-Type': 'text/plain' })
        response.write('404 Not found')
      } else {
        response.writeHead(200, { 'Content-Type': contentType })
        response.end(content, 'utf-8')
      }
    })
  }).listen(port)
}

module.exports = createStaticServer
