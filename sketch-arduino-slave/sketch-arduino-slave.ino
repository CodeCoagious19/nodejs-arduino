

//NodejsSerialCommunication

#define FRAME_LENGHT_BYTE 9

typedef enum {
  SERIAL_COM_UNINITIALIZED = 0,  
  SERIAL_COM_INITIALIZED = 1,
  SERIAL_COM_CONNECTED = 2,
  SERIAL_COM_RECEIVING = 3, 
  SERIAL_COM_TRANSMITTING = 3,    
}SerialComStatusType;

struct FrameArduinoToNodeJS
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

SerialComStatusType SerialComStatusValue = SERIAL_COM_UNINITIALIZED;

FrameArduinoToNodeJS frameTX = {
  .seqID = 0,
  .masterCommands = 0,
  .pwmFrequency = 0,
  .pwmDutyCicle = 0,
  .auxOutput = 0,
  .slaveFeedbackStatus = 56,
  .pumpFeedbackStatus = 0,
  .auxInputFeedback = 0,
  .auxSlaveError = 0
};


void SerialComInit(uint32_t baudRate){
  Serial.begin(baudRate);
  SerialComStatusValue = SERIAL_COM_INITIALIZED;
}

void SerialComRequestForConnection(){
  uint8_t myArr[9] = {frameTX.seqID,
                      frameTX.masterCommands,
                      frameTX.pwmFrequency,
                      frameTX.pwmDutyCicle,
                      frameTX.auxOutput,
                      frameTX.slaveFeedbackStatus,
                      frameTX.pumpFeedbackStatus,
                      frameTX.auxInputFeedback,
                      frameTX.auxSlaveError
                      };
  Serial.write(myArr, sizeof (myArr));
  SerialComStatusValue = SERIAL_COM_CONNECTED;
}

void setup() {
  SerialComInit(115200); // opens serial port
  
  SerialComRequestForConnection(); //invio la stringa READY
  pinMode(13, OUTPUT);


}

void loop() {
  // send data only when you receive data:
  if (Serial.available() > 0 && (SerialComStatusValue == SERIAL_COM_CONNECTED) ) {
    byte incomingByte[4]; // for incoming serial data
    Serial.readBytes(incomingByte, 4);

    uint8_t seqId = (uint8_t)incomingByte[0];
    uint8_t dutyCicle = (uint8_t)incomingByte[1];
    uint16_t frequency = ((uint16_t)(incomingByte[2]) << 8) | (uint16_t)incomingByte[3];

    uint8_t myArr[2] = {200, 123};
    Serial.write(myArr, sizeof (myArr));
    

    if (seqId == 0 && frequency == 456 && dutyCicle == 150){
      digitalWrite(13, HIGH); 
    }
    else{
      digitalWrite(13, LOW); 
    }
  }
}
