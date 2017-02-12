var socket = io();
var prevBoxid;

// var selectBox = function(ev){
//   console.log('SELECT BOX: ', ev);
//
//   console.log('prev ID: ', prevBoxid);
//
//   var highlighted = document.getElementById('selectedBox');
//   if(highlighted){// highlighted box
//     // console.log('HIGHLIGHTED BOX: ', highlighted);
//     $('#add-images').css('display', 'none');
//     // $('add-icon').css("visibility", "hidden");
//     if(ev.id != "selectedBox"){ //this ISN't the highlighted box
//     // console.log('THIS SHOULD NOT the selected bx', ev.id);
//       highlighted.id = prevBoxid;
//     }else{//this IS ALREADY the selected box
//       // console.log('THIS is Already HIGHLIGHTED');
//       ev.id = prevBoxid;
//     }
//   }else{  //no highlighted box
//     // console.log('THERE ARE NO HIGHLIGHTED BOXES');
//     prevBoxid = ev.id;
//     ev.id = "selectedBox";
//     $('#add-images').css('display', 'block');
//
//     console.log('SHOULD DISPLAY ADD BUTTON');
//   }
// }

// var fd = function(evt){
//
//   console.log(event);
//   console.log(event.srcElement);
//   clickedElement = event.srcElement;
//   var file = event.srcElement.files[0].name;
//
//   var extension = file.substring(file.lastIndexOf('.'));
//   console.log(extension);
//   acceptable = event.srcElement.accept.split(',')
//   var acc = false;
//   acceptable.forEach((ex)=>{
//     console.log('ext: ',ex);
//     if(ex === extension) acc = true;
//   });
//   if(!acc)return alert('File must be an image (".png", ".jpg")');
//   // console.log('THIS.VAL(): ', $(this).val());
//   alert(clickedElement.value);
//   // clickedElement.on('change', function(){
//   //   var files = $(this).get(0).files;
//   //   console.log(files);
//   // });
//
//   var length = event.srcElement.files.length;
//   for(i = 0; i <=(length-2)/2; i++){
//     console.log('\n\n\n\n\nADD ROWS');
//     $('#add-row').click();
//   }
//   var index = 1;
//   for(x = 0; x < length; x++){
//     var i = event.srcElement.files[x];
//     console.log(i);
//     i = URL.createObjectURL(i);
//     var img = new Image();
//     // img.src = "data:image/png;base64," + event.srcElement.files[x].toString('Base64');
//     // img.src = "data:image/png;base64," + i.toString('base64');
//
//     img.src = i;
//     var canvas = document.createElement('canvas');
//     canvas.width = img.width;
//     canvas.height = img.height;
//     canvas.getContext('2d').drawImage(img, 0,0);
//     dataURI = canvas.toDataURL();
//     console.log(dataURI);
//
//
//     var h;
//     var w;
//     $('#box'+index).html('<img src="' + i + '"/>');
//     index++;
//   }
// }
var w = 1;
var t=1;

socket.on('connect', function(){
  console.log(socket.id);

  var delivery = new Delivery(socket);

  delivery.on('delivery.connect', function(delivery){
    $('#fd').on('click', function(){
      var selectedBox = document.getElementById('selectedBox');
      // if(!selectedBox) return alert('No box selected');
      $('#fd').unbind('change');

      $('#fd').on('change', function(evt){
        var filledBoxes = document.querySelectorAll('.box1, .box2');
        console.log('BOXES FILLED: ', filledBoxes);
        var nextBox = "";
        filledBoxes.forEach((b)=>{
          if(nextBox != "") return;
          console.log(b.firstElementChild);
          console.log(b.firstElementChild.src);
          var sr = b.firstElementChild.src;
          console.log(sr.substring(sr.lastIndexOf('/')));
          if(sr.substring(sr.lastIndexOf('/')) === '/temp2.png'){
            console.log('Box empty at ', b);
            return nextBox = b.id;
          }
        });

        var files = evt.currentTarget.files;
        var length = event.currentTarget.files.length;

        for(i = 0; i <(length)/2; i++){
          console.log('\n\n\n\n\nADD ROWS');
          ///read if there are any existing empy rows
          $('#add-row').click();
        }
        if(nextBox === ""){
          console.log('\n\n\nBOXES FILLED: ', filledBoxes);
          nextBox = "box" + (filledBoxes.length+1);
          console.log('\n\n\nNEXT BOX: ', nextBox);
        }



        var boxnum = nextBox.substring(nextBox.lastIndexOf('x')+1);
        // console.log('BOX TO INPUT TO: #', boxnum);
        // console.log('# of files: ', length);
        // var extraParams = {box: length};
        // delivery.send(evt.currentTarget.files, extraParams);

        var index = parseInt(boxnum)-1;
        // var index = 0;
        for(x = 0; x <= length -1; x++){
          var i = event.currentTarget.files[x];
          // console.log(i);
          i = URL.createObjectURL(i);
          var img = new Image();
          // img.src = "data:image/png;base64," + event.srcElement.files[x].toString('Base64');
          // img.src = "data:image/png;base64," + i.toString('base64');

          var extraParams = {box: prevBoxid};
          index++;

          // delivery.send(evt.currentTarget.files[0], extraParams);
          // delivery.on('send.success', function(fileUID){
          //   console.log('FILEUID: ', fileUID);
          //   console.log('File was successfully sent!');
          //   // $('#box2-image').attr("src", fileUID.name);
          // });
          var h;
          var w;
          $('#box'+index).html('<img class="img" src="' + i + '"/>');
        }
      });
    });
  });




  socket.on('image', function(info){
    var correctBox = document.getElementById('selectedBox');
    console.log('\n\n\nINFO: ', info);
    console.log('SELECTED BOX: ', correctBox);
    if(correctBox) correctBox.id = info.params.box;

    var box = info.params.box;
    var ctx =$('#'+ box)[0].firstElementChild;
    console.log(ctx);
    // ctx = ctx.getContext('2d');
    if(info.image){
      var img = new Image();
      img.src = 'data:image/jpeg;binary,'+info.buffer;
      console.log("IMAGE received from server for box#: ", box);

      $('#'+box).html('<img class ="img" src="data:image/jpg;base64,' + info.buffer + '" />');

      $('#add-images').css('display', 'none');
    }
  });

  $('#delete-row').on('click', function(i){
    console.log('DELETE Row!!', w);
    var au = document.getElementById('au' + w);
    console.log(au);
    au.parentNode.removeChild(au);
    w-=2;
    if(w < 3) return $('#delete-row').css('display', 'none');
  });
  $('#add-row').on('click', function(i){
    w+=2;
    if(w >=3) $('#delete-row img').css('display', 'inline-block');
    console.log('ADD a new Row!!', w);
    var n = document.getElementById('au'); //returns a HTML DOM Object
    // console.log(n);
    var dupNode = n.cloneNode(true);
    console.log(dupNode);
    var au = dupNode.children[0].children;
    console.log('\n\nAU: ', au);

    var textboxes = dupNode.getElementsByTagName('input');
    for(x = 0; x <= textboxes.length; x++){
      if(textboxes[x]){
        if(textboxes[x].getAttribute("type")){
          textboxes[x].value = "";
        }
      }
    }
    console.log('TEXT DESCs: ', textboxes);

    var b1 = dupNode.children[0].children[0].children[0];
    var b2 = dupNode.children[0].children[2].children[0];
    var sp1 = dupNode.children[0].children[1];
    var br1 = dupNode.children[1];
    console.log('BREAK???: ', br1);
    console.log('SPACE??? ', sp1);

    console.log('BOX!: ', b1);
    console.log('BOX2: ', b2);
    sp1.id = sp1.id + w;
    br1.id = br1.id +w;
    dupNode.id = dupNode.id + w;

    b1.id = "box"+ w;
    var b1img = b1.getElementsByClassName('img')[0];
    console.log('IMAGE: ', b1img);
    if(b1img){
      b1img.src = 'images/temp2.png';
    }


    b2.id = "box"+ (w+1);
    var b2img = b2.getElementsByClassName('img')[0];
    console.log('IMAGE: ', b2img);
    if(b2img){
      b2img.src = 'images/temp2.png';
    }
    // $('#'+b2.id).css("margin-right", "20px");
    // $('#'+b2.id).css("float", "right");
    // $('#'+b2.id).css("width", "300px");
    // $('#'+b2.id).css("border", "2px black solid");

    var doc = document.getElementById("page-container");
    doc.appendChild(dupNode);
    console.log(dupNode);

    // document.append(dupNode);
  });

  // $('#au').on('click', function() {
  //   console.log('\n\n\nBUTTON CLICKED');
  //    var clickedBtnID = $(this).attr('id'); // or var clickedBtnID = this.id
  //    alert('you clicked on button #' + clickedBtnID);
  // });

});

// var boxClick = function(doc){
//   console.log('\n\n\nBUTTON CLICKED', doc);
//    var clickedBtnID = $(this).attr('id'); // or var clickedBtnID = this.id
//    alert('you clicked on button #' + clickedBtnID);
// }

// document.onclick = clickListener;


// var clickListener = function(e) {
//     var clickedElement;
//     if(e == null) {
//         clickedElement = event.srcElement;
//     } else {
//         clickedElement = e.target;
//     }
//     arrayWithElements.push(clickedElement)
//     alert(arrayWithElements);
// }
