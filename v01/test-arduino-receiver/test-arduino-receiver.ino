byte incomingByte[1]; // for incoming serial data
bool isReadyTransimetted = false;

void setup() {
  Serial.begin(115200); // opens serial port, sets data rate to 9600 bps
  pinMode(13, OUTPUT);
}

void loop() {
  // send data only when you receive data:
  if (Serial.available() > 0) {
    isReadyTransimetted = true;
    // read the incoming byte:
    Serial.readBytes(incomingByte, 1);

    if (incomingByte[0] == 65){
      digitalWrite(13, HIGH); 
    }
    else{
      digitalWrite(13, LOW); 
    }
  }
  else{
    if (!isReadyTransimetted){
      Serial.write(233);
      delay(1000);
    }
  }
}
