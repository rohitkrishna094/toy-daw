import React, { useEffect, useState } from 'react';
import Tone from 'tone';
import { mapping } from './keymapping';
import './App.css';

function App() {
  const [keyMap, setKeyMap] = useState({});

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  }, [keyMap]);

  const onKeyDown = e => {
    e.preventDefault();
    setKeyMap(prevKeyMap => ({ ...prevKeyMap, [e.key]: true }));
  };
  const onKeyUp = e => {
    e.preventDefault();
    setKeyMap(prevKeyMap => ({ ...prevKeyMap, [e.key]: false }));
  };

  const pressedKeys = keyMap => {
    let res = [];
    for (let key in keyMap) {
      if (keyMap[key]) res.push(key);
    }
    return res;
  };

  const sing = () => {
    //create a synth and connect it to the master output (your speakers)
    const synth = new Tone.Synth().toMaster();

    //play a middle 'C' for the duration of an 8th note
    synth.triggerAttackRelease('C4', '8n');
  };

  return (
    <div className="App">
      <h1>Currently Playing {JSON.stringify(pressedKeys(keyMap))}</h1>
    </div>
  );
}

export default App;
