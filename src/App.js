import React, { Component } from 'react';
import Tone from 'tone';
import { mapping } from './keymapping';
import './App.css';

const pressedKeys = keyMap => {
  let res = [];
  for (let key in keyMap) {
    if (keyMap[key]) res.push(key);
  }
  return res;
};

class App extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  state = { keyMap: {} };

  onKeyDown = e => {
    // e.preventDefault();
    this.setState({ ...this.state, keyMap: { ...this.state.keyMap, [e.key]: true } });
  };
  onKeyUp = e => {
    // e.preventDefault();
    this.setState({ ...this.state, keyMap: { ...this.state.keyMap, [e.key]: false } });
  };

  sing = () => {
    //create a synth and connect it to the master output (your speakers)
    const synth = new Tone.Synth().toMaster();

    //play a middle 'C' for the duration of an 8th note
    synth.triggerAttackRelease('C4', '8n');
  };

  render() {
    return (
      <div className="App">
        <h1>Currently Playing {JSON.stringify(pressedKeys(this.state.keyMap))}</h1>
      </div>
    );
  }
}

export default App;
