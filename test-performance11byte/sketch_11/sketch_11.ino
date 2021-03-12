void setup()
{
  // Open serial communications and wait for port to open:
  Serial.begin(115200);
}
 
void loop() // run over and over
{
  static uint8_t myBuf[11];
  if (Serial.available() == 11){
    Serial.readBytes(myBuf, 11);
    Serial.write(myBuf, 11);
  }
}
