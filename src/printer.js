const ipp = require('ipp');
const PDFDocument = require('pdfkit');
const concat = require("concat-stream");
const printer = require('printer')


async function printExamples (printerName) {

  var doc = new PDFDocument({margin:0});
  
  doc.text("############################################", 0, 0);
  doc.text('Hello world!', 50, 50)
  doc.text('Hello world again!')
  doc.text("############################################", 0, 0);

  

  doc.pipe(concat(function (data) {
    var printer = ipp.Printer(printerName);
    var msg = {
      "operation-attributes-tag": {
        "requesting-user-name": "Whatever",
        "job-name": "whatever.pdf",
        "document-format": "application/pdf"
      }
      , data: data
    };
    printer.execute("Print-Job", msg, function(err, res){
      console.log(err);
      console.log(res);
    });
  }));
  doc.end();
}

module.exports.printExamples = printExamples
module.exports.getPrinters = printer.getPrinters