import React, { Component } from 'react';
import Tone from 'tone';
import './Sequencer.scss';

class Sequencer extends Component {
  constructor(props) {
    super(props);

    const synths = [new Tone.Synth()];
    synths[0].oscillator.type = 'triangle';
    const gain = new Tone.Gain(0.6);
    gain.toMaster();
    synths.forEach(synth => synth.connect(gain));

    this.state = { index: 0, synths, boxes: {} };
  }

  componentDidMount() {
    Tone.Transport.scheduleRepeat(this.repeat.bind(this), '8n');
    Tone.Transport.start();
  }

  repeat(time) {
    const { index, boxes } = this.state;
    const step = index % 8;
    const synth = this.state.synths[0];
    const note = 'G5';
    console.log(boxes[step], time);
    if (boxes[step] === true) {
      synth.triggerAttackRelease(note, '8n', time);
    }
    this.setState({ ...this.state, index: index + 1 });
  }

  onChange = e => {
    // console.log(e.target.name, e.target.checked);
    this.setState({ ...this.state, boxes: { ...this.state.boxes, [e.target.name]: e.target.checked } });
  };

  render() {
    // console.log(this.state.boxes);
    return (
      <div>
        <div>
          <input type="checkbox" name="0" onChange={e => this.onChange(e)} />
          <input type="checkbox" name="1" onChange={e => this.onChange(e)} />
          <input type="checkbox" name="2" onChange={e => this.onChange(e)} />
          <input type="checkbox" name="3" onChange={e => this.onChange(e)} />
          <input type="checkbox" name="4" onChange={e => this.onChange(e)} />
          <input type="checkbox" name="5" onChange={e => this.onChange(e)} />
          <input type="checkbox" name="6" onChange={e => this.onChange(e)} />
          <input type="checkbox" name="7" onChange={e => this.onChange(e)} />
        </div>
      </div>
    );
  }
}

export default Sequencer;
