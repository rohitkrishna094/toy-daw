import React from 'react';
import Tone from 'tone';
import './App.css';

function App() {
  const sing = () => {
    //create a synth and connect it to the master output (your speakers)
    const synth = new Tone.Synth().toMaster();

    //play a middle 'C' for the duration of an 8th note
    synth.triggerAttackRelease('C4', '8n');
  };

  return (
    <div className="App">
      <h1>Hello to Toy-DAW</h1>
      <button onClick={sing}>Click Me</button>
    </div>
  );
}

export default App;
