const spApi = require('../libraries/spApi');


let serialCommunication = new spApi.SerialCommunication({
  port: 'COM3',
  baudRate: 115200,
  frameLenght: 11
});


serialCommunication.on('frame', (buffer, description) => {
  const time = new Date();
  const arr_time = [time.getMinutes(), time.getSeconds(), time.getMilliseconds()];
  console.log("\n---");
  console.log(`${arr_time[0]}.${arr_time[1]}.${arr_time[2]}`);
  console.log(buffer);
  console.log("---\n");
  write();
});

function wait(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}


let write = async () => {
  await serialCommunication.writeFrame(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]));
}

let main = async () => {

  console.log('start');
  console.log('attendi 1 sec..');
  await wait(1000);

  console.log('Apro una connessione con Arduino...');
  console.log('Arduino si riavvia...');
  try {
    await serialCommunication.open();
  } catch (error) {
    console.log(error);
  }

   console.log('attendi 1 sec..');
   await wait(1000);

  try {
    console.log("Invio un frame generico ad Arduino..");
    write();
    console.log("Frame trasmesso con successo!");
  } catch (error) {
    console.log(error);
  }

};

main();
