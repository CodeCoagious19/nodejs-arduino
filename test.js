var serialport = require("serialport");
var byteFromArduino = '';
let connectionEstabilished = false;
let varToggle = false;
const buf = Buffer.from([65]);
const buf2 = Buffer.from([66]);

var sp = new serialport('COM3', {
  baudRate: 115200,
});

function write() //for writing
{
  if (connectionEstabilished){
    if (varToggle){
      console.log('LED ON, pin 13');
      sp.write(buf);
      varToggle = !varToggle;
    }
    else{
      console.log('LED OFF, pin 13');
      sp.write(buf2);
      varToggle = !varToggle;
    }
  }
}

function waitForConnection(){
  sp.on('data', function (data) 
  {
    byteFromArduino = parseInt(data.toString('hex'), 16); 
    console.log(byteFromArduino);
    if (byteFromArduino === 233){
      console.log('connection estabilished');
      connectionEstabilished = true;
    }
    else{
      console.log('connection not estabilished');
      connectionEstabilished = false;
    }

  });
}

sp.on('open', function() 
{
    // execute your functions
    waitForConnection();
    setInterval(write,1000);
});