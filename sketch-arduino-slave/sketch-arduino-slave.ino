
//Arduino === slave
//Node.js === master
//SC = Serial communication module
//E = error
//STATUS = stato, riferito alla macchina a stati

#define FRAME_LENGHT_BYTE 9

struct Sc_FrameType
{
  uint8_t seqID;
  uint8_t masterCommands; 
  uint8_t pwmFrequency;
  uint8_t pwmDutyCicle;
  uint8_t auxOutput;
  uint8_t slaveFeedbackStatus;
  uint8_t pumpFeedbackStatus;
  uint8_t auxInputFeedback;
  uint8_t auxSlaveError;
};

Sc_FrameType slaveKeyFrameTx = {
  .seqID = 0,
  .masterCommands = 0,
  .pwmFrequency = 0,
  .pwmDutyCicle = 0,
  .auxOutput = 0,
  .slaveFeedbackStatus = 255,
  .pumpFeedbackStatus = 0,
  .auxInputFeedback = 0,
  .auxSlaveError = 0
};

uint8_t slaveFrameTxArray[FRAME_LENGHT_BYTE] = {
  slaveKeyFrameTx.seqID,
  slaveKeyFrameTx.masterCommands,
  slaveKeyFrameTx.pwmFrequency,
  slaveKeyFrameTx.pwmDutyCicle,
  slaveKeyFrameTx.auxOutput,
  slaveKeyFrameTx.slaveFeedbackStatus,
  slaveKeyFrameTx.pumpFeedbackStatus,
  slaveKeyFrameTx.auxInputFeedback,
  slaveKeyFrameTx.auxSlaveError
};

Sc_FrameType masterKeyFrameRx = {
  .seqID = 1,
  .masterCommands = 0,
  .pwmFrequency = 0,
  .pwmDutyCicle = 0,
  .auxOutput = 0,
  .slaveFeedbackStatus = 255,
  .pumpFeedbackStatus = 0,
  .auxInputFeedback = 0,
  .auxSlaveError = 0
};

uint8_t masterKeyFrameTxArray[FRAME_LENGHT_BYTE] = {
  masterKeyFrameRx.seqID,
  masterKeyFrameRx.masterCommands,
  masterKeyFrameRx.pwmFrequency,
  masterKeyFrameRx.pwmDutyCicle,
  masterKeyFrameRx.auxOutput,
  masterKeyFrameRx.slaveFeedbackStatus,
  masterKeyFrameRx.pumpFeedbackStatus,
  masterKeyFrameRx.auxInputFeedback,
  masterKeyFrameRx.auxSlaveError
};

Sc_FrameType slaveFrameTxStruct;
Sc_FrameType masterFrameRxStruct;

/* ************************************ ************************************ */

/* api */

/* ************************************ ************************************ */

/* ************************************ ************************************ */
/* Macchina a stati */
typedef enum {
  SC_STATUS_UNINITIALIZED = 0,  
  SC_STATUS_INITIALIZED = 1,
  SC_STATUS_CONNECTED = 2,
  SC_STATUS_RECEIVING = 3, 
  SC_STATUS_TRANSMITTING = 4,    
}Sc_StatusType;
Sc_StatusType Sc_Status = SC_STATUS_UNINITIALIZED;

typedef enum {
  SC_E_NO_ERROR = 0,
  SC_E_WRONG_KEY_FRAME_FROM_MASTER = 1
}Sc_ErrorType;
Sc_ErrorType Sc_Error = SC_E_NO_ERROR;
/* ************************************ ************************************ */

/* ************************************ ************************************ */
void Sc_Init(uint32_t baudRate){
  Serial.begin(baudRate);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB
  }
  Sc_Status = SC_STATUS_INITIALIZED;
}

//Questa API dovrà inviare la key frame al master e attendere che
//il master risponda con la sua key frame
//Ritornerà un boolean true se la connessione è stabilit, false altrimenti 
//Dovrà essere un'operazione "non bloccante" nel senso che dovrà leggere il dato solo quando arriva 
//e non aspettare di leggere un dato

/*
Sc_ErrorType Sc_WaitForConnection(slaveKeyFrameTx, masterKeyFrameRx, &isConnectionEstabilished){

  //1 - converti la struct slaveKeyFrameTx in un array di uint8_t, slaveKeyFrameTxArray
  //  - converti la struct masterKeyFrameRx in un array di uint8_t, masterKeyFrameRxArray
  //2 - invia slaveKeyFrameTxArray attraverso Serial.write()
  //3 - if(Serial.available()) allora leggi ciò che arriva attraverso while(Serial.available())
  //  - decodifica quello che leggi salvandolo in un array frameReceived 
  //  - confronta frameReceived con masterKeyFrameTxArray
  //  - se sono uguali, isConnectionEstabilished ritorna true
  //  - altrimenti, isConnectionEstabilished ritorna false e ritorna un errore WRONG_KEY_FRAME_FROM_MASTER

  SerialCommunicationErrorType
  
  Serial.write(slaveFrameTxArray, FRAME_LENGHT_BYTE);
  SerialComStatusValue = SERIAL_COM_CONNECTED;
}
*/


void Sc_WaitForConnection(){
  Serial.write(slaveFrameTxArray, FRAME_LENGHT_BYTE);
  Sc_Status = SC_STATUS_CONNECTED;
}

//Utilities function
bool compareArray(uint8_t arr1[], uint8_t arr2[], uint8_t dim){
  bool result = true;
  for(int i = 0; i < dim; i++){
    result &= (arr1[i] == arr2[i]);
  }
  return result;
}

void setup() {
  Sc_Init(115200); // opens serial port

  delay(1000);
  Sc_WaitForConnection(); 
  pinMode(13, OUTPUT);

}

bool connectionEstabilished = false;
bool complete = false;  // whether the string is complete
uint8_t myArr[FRAME_LENGHT_BYTE] = {0,0,0,0,0,0,0,0,0};
bool state = false;

void loop() {
  delay(200);
  if (complete) {
    Serial.write(myArr, FRAME_LENGHT_BYTE);
    complete = false;
  }
  if (connectionEstabilished){
    //connectionEstabilished = false;
    state = !state;
    digitalWrite(13,state);
  }
  while (Serial.available()) {
    static uint8_t i = 0;
    // get the new byte:
    myArr[i] = (uint8_t)Serial.read();
    i++;
    if (i == FRAME_LENGHT_BYTE) {
      if (compareArray(myArr, masterKeyFrameTxArray, FRAME_LENGHT_BYTE)){
         connectionEstabilished = true;
      }
      else{
        complete = true;
      }
      i = 0;
    }
  }
}
