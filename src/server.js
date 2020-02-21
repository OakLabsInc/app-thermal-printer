
require('dotenv').config()

const oak = require('oak')
const { join } = require('path')
const _ = require('lodash')

oak.catchErrors()

const express = require('express')
const stylus = require('stylus')
const app = express()


const port = process.env.PORT ? _.toNumber(process.env.PORT) : 9000
const printer = require(join(__dirname, 'printer'))
const printerName = process.env.PRINTER_NAME || "http://localhost:631/printers/TM-T88V"

let publicPath = join(__dirname, 'public')
let viewsPath = join(__dirname, 'views')

let window = null

app.set('views', viewsPath)
app.set('view engine', 'pug')
app.use(stylus.middleware({
  src: viewsPath,
  dest: publicPath
}))

app.use(express.static(publicPath))

app.listen(port, function () {
  oak.on('ready', () => loadWindow())
})

app.get('/', function (req, res) {
  res.render('index')
})


function loadWindow () {

  window = oak.load({
    url: `http://localhost:${port}/`,
    ontop: false,
    insecure: true,
    flags: ['enable-vp8-alpha-playback'],
    size: "1080x1920",
    sslExceptions: ['localhost'],
    background: '#ffffff',
    scripts: [
      {
        name: 'lodash',
        path: 'lodash'
      },
      {
        name: 'uuid',
        path: 'uuid'
      }
    ]
  }).on('printer.examples', function (data) {
    printer.printExamples(printerName)
  }).on('printer.getPrinters', function(){
    printer.getPrinterAttributes(printerName, function (name, ppd) {
      //console.log(name, JSON.stringify(ppd, null, 2))
      window.send('printer.connectedPrinters', {
        name: printerName,
        ppd: ppd
      })
    })

  })

}
