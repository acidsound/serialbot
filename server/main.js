/* https://github.com/node-serialport/node-serialport 
   https://www.npmjs.com/package/serialport
*/
import { Meteor } from 'meteor/meteor';
import SerialPort from 'serialport';
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort (Meteor.settings.serial.port.name);
const parser = port.pipe(new Readline());

Meteor.startup(() => {
  // code to run on server at startup
  console.log(Meteor.settings.serial.port.name);
});

Meteor.publish("serial/rx", function() {
  parser.on('data', (data)=>{
    this.added("serial", Random.id(), {
      message: data,
      createdAt: new Date()
    })
  });
  this.ready();
});

Meteor.methods({
  "serial/tx": function(data) {
    port.write(data);
  }
});