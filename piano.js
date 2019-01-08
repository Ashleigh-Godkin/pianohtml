
// SETUP
// --------------------------------------------------
// 1.
// Run Ableton Live
//
// 2.
// Create a MIDI Track
// 
// 3.
// Insert an instrument - e.g. piano
//
// 4.
// Record enable the track
//
// 5. Enable the IAC Driver on the MAC:
// IAC stands for Inter Application Communication
// It acts as a vitual midi device
//
// 5.1 Open AUDIO MIDI SETUP
// 5.2 Window | Show Midi Studio
// 5.3 Click on the IAC driver
// 5.4 Tick the box "Go Online"
//
// 6.
// In Ableton,
// 
// 6.1 select Preferences | MIDI
// 6.2 turn TRACK ON for IAC Driver
// this enables Ableton to read an accept the midi messages coming in from the IAC driver
// https://help.ableton.com/hc/en-us/articles/209774205-Live-s-MIDI-Ports-explained
// 
// 7.
// Download and Run the MIDI MONITOR program on Apple Mac, 
// to monitor the MIDI messages output from your program
//
// ---------------------------------------------------------


// MidiIndex
// This sample code looks for a midi interface on your system
// If you only have one it will be index 0
// If you have two, you need to decide which one you are sending data to
// index 0 or index 1 and so on

var MidiIndex = 0;


if (navigator.requestMIDIAccess) {
 
  // Try to connect to the MIDI interface.
  navigator.requestMIDIAccess().then(onSuccess, onFailure);
  console.log("Web MIDI API supported!");
 
} else {
  console.log("Web MIDI API not supported!");
}
 




// Function executed on failed connection
function onFailure(error) {
  console.log("Could not connect to the MIDI interface");
}





// Function executed on successful connection
function onSuccess(interface) {


  var outputs = [];


  console.log("Duration:", dur);
  console.log("Sixteenth:", sixteenth);
  
  // init
  initMidiInterface(interface,outputs); 
  setUpGrid();

}



/* -------------------------------------------------------*/


function initMidiInterface(interface,outputs){
 // Grab an array of all available devices
  var iter = interface.outputs.values();

  for (var i = iter.next(); i && !i.done; i = iter.next()) {
    outputs.push(i.value);
    console.log(i.value);

  }  
}

function PlayNote(outputs,notenum,time,dur){

  var noteon,
      noteoff;


  // Craft 'note on' and 'note off' messages (channel 3, note number 60 [C3], max velocity)
  noteon = [0x92, notenum, 127];
  noteoff = [0x82, notenum, 127];


  // Send the 'note on' and schedule the 'note off' for dur later
  outputs[MidiIndex].send(noteon, time);
  console.log("ON",notenum,time,dur);
  
  //setTimeout(    function() {       outputs[0].send(noteoff);  console.log("OFF",notenum,time,dur);  },    dur  );

  outputs[MidiIndex].send(noteoff,time+dur);   // send a noteoff at the right time (i.e. the start time + the duration)
}

function setUpGrid(){
    panel = new Interface.Panel();
    setUpPiano(panel);
    
}


function setUpPiano(panel){
    

 let l = new Interface.Label({
        bounds:[0,.6,1,.2],
     value: 'test label',
     size: 14
 });
 
 let piano1 = new Interface.Piano({ 
  bounds:[0,0,1,.5],  
  startletter : "C",
   startoctave : 3,
   endletter : "C",
   endoctave : 5,
   noteLabels:true,
     
     onvaluechange: function(){
      var freq = Math.round(this.frequency);
      var midi = freqToMidi(freq);
      l.setValue("Freq:" + freq + " " + "MIDI note: " + midi);
      
      if(this.value){
       PlayNote(outputs, midi, 0, dur);
     }
    
 });


panel.background = 'black';
panel.add(piano1, l);
}


setUpGrid();
setUpPiano();
