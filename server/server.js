const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var fs = require('fs');
var dl = require('delivery');
var wkhtmltopdf = require('wkhtmltopdf');

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
  console.log(`\n\nNew User Connected: \n\t(socket.id):${socket.id}`);
  var delivery = dl.listen(socket);
  delivery.on('receive.success', function(file){
    var params = file.params;
    var buf = file.buffer.toString('binary');
    socket.emit('image', { image: true, buffer: file.buffer.toString('base64'), params:params});

    // fs.writeFile(file.name, file.buffer, function(err){
    //   if(err) {
    //     console.log('FAIL: File could NOT be saved');
    //   }else{
    //     console.log('SUCCESS: File SAVED on server');
    //     socket.emit('image', { image: true, buffer: file.buffer.toString('base64'), params:params});
    //
    //   }
    // });
    // console.log(file);
    // delivery.send({
    //   name: file.name,
    //   path: file.name,
    //   params: {sender: 'SERVER'}
    // });
    fs.readFile(__dirname + file.name, function(err, buf){
    console.log('\n\nPARAMS: box', params);
    // it's possible to embed binary data
    // within arbitrarily-complex objects
    // socket.emit('image', { image: true, buffer: file.buffer.toString('base64'), params:params});
    console.log('image file is initialized');
  });
  });

  socket.on('pdf', function(params){
    wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

    console.log('wkHTMLtoPDF in progress: ', params);

    // wkhtmltopdf('http://localhost:3000/index.html', {
    //     output: 'localhost.pdf',
    //     pageSize: 'letter'
    // });
    // var fs = require("fs");
    // fs.writeFile(file.name, file.buffer, function(err){
    //   if(err) {
    //     console.log('FAIL: File could NOT be saved');
    //   }else{
    //     console.log('SUCCESS: File SAVED on server');
    //
    //   }
    // });
    // wkhtmltopdf(fs.readFileSync(params, "utf8"), {
    //     output: 'demo.pdf',
    //     pageSize: 'letter'
    // });
    // wkhtmltopdf('http://ourcodeworld.com', {
    //     output: 'ourcodeworld.pdf',
    //     pageSize: 'letter'
    // });
  });
});




server.listen(port, function(){
  console.log(`Server is up and running on port: ${port}`);
});
