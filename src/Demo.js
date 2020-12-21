import React, { Component } from 'react';
import * as Tone from 'tone';
import Nexus from 'nexusui';
import { mapping } from './keymapping';

class Demo extends Component {
  constructor(props) {
    super(props);
    const octaveOffset = -1;
    const synth = new Tone.PolySynth().toDestination();
    // const synth = new Tone.PolySynth(6, Tone.Synth, {
    //   oscillator: {
    //     // type: 'sine'
    //   },
    // }).toMaster();
    synth.set({ oscillator: { type: 'sine' } });
    this.state = { keyMap: {}, synth, octaveOffset, noteMap: mapping(octaveOffset) };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);

    const dial = Nexus.Add.Dial('#instrument', {
      size: [700, 100],
    });

    const slider = Nexus.Add.Slider('#instrument', {
      size: [25, 100],
    });

    // then, to remove them tlater
    // dial.destroy();
    // slider.destroy();
  }

  onKeyDown = (e) => {
    const { keyMap } = this.state;
    const key = e.key.toUpperCase();

    if (key in keyMap && keyMap[key]) {
    } else {
      this.sing(key);
    }

    this.setState({ ...this.state, keyMap: { ...keyMap, [key]: true } });
  };

  onKeyUp = (e) => {
    const key = e.key.toUpperCase();
    this.setState({ ...this.state, keyMap: { ...this.state.keyMap, [key]: false } });
  };

  sing = (letter) => {
    const { synth } = this.state;
    const { noteMap } = this.state;
    if (letter.toUpperCase() in noteMap) {
      const note = noteMap[letter];
      synth.triggerAttackRelease(note, '8n');
    }
  };

  pressedKeys = (keyMap) => {
    let res = [];
    for (let key in keyMap) {
      if (keyMap[key]) res.push(key);
    }
    return res;
  };

  pressedNotes = (keyMap) => {
    let res = [];
    const { noteMap } = this.state;
    for (let key in keyMap) {
      if (keyMap[key] && noteMap[key]) res.push(noteMap[key]);
    }
    return res;
  };

  render() {
    return (
      <div className="Demo">
        <h1>Currently Playing {JSON.stringify(this.pressedNotes(this.state.keyMap))}</h1>
        <div id="instrument"></div>
      </div>
    );
  }
}

export default Demo;
