const spApi = require('./spApi');
const led_on_command = Buffer.from([65]);
const led_off_command = Buffer.from([66]);

let ledState = false;

spApi.connectionEstabilished.subscribe(connection => {
  if (connection) {
    setInterval(() => {
      toggleLed()
    }, 500);
  }
})


function toggleLed() {
  if (ledState) {
    spApi.write(led_on_command);
  } else {
    spApi.write(led_off_command);
  }
  ledState = !ledState;
}