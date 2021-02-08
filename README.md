# Libreria SerialPort

## Link utili

- [Documentazione ufficiale](https://serialport.io/docs/)
- [Stream Interface](https://serialport.io/docs/api-stream)
- [Arduino & nodejs](https://github.com/codeadamca/arduino-to-nodejs)

## Primo script

Il seguente script stamperà una lista delle porte disponibili

```javascript
const SerialPort = require('serialport')
SerialPort.list().then(
  ports => ports.forEach(elem => console.log(elem))
)
```

```bash
{
    path: 'COM3',
    manufacturer: 'Arduino LLC (www.arduino.cc)',
    serialNumber: 'A413937353035101F0E0',
    pnpId: 'USB\\VID_2341&PID_0042\\A413937353035101F0E0',
    locationId: 'Port_#0001.Hub_#0002',
    vendorId: '2341',
    productId: '0042'
}
```
