import React, { Component } from 'react';
import Tone from 'tone';
import Nexus from 'nexusui';
import './Sequencer.css';
import { formatResultsErrors } from 'jest-message-util';

class Sequencer extends Component {
  constructor(props) {
    super(props);
    this.seqRef = React.createRef();

    const synths = [new Tone.Synth()];
    synths[0].oscillator.type = 'triangle';
    const gain = new Tone.Gain(0.6);
    gain.toMaster();
    synths.forEach(synth => synth.connect(gain));

    this.state = { index: 0, synths, boxes: {}, sequencer: null };
  }

  componentDidMount() {
    const sequencer = new Nexus.Sequencer('#sequencer', {
      size: [400, 115],
      mode: 'toggle',
      rows: 4,
      columns: 16
    });
    sequencer.colorize('fill', '#51575B');
    sequencer.colorize('accent', '#AABAC4');

    const current = this.seqRef.current;
    const rects = current.getElementsByTagName('rect');

    for (let i = 0; i < rects.length; i++) {
      const rem = Math.floor(i / 4);
      if (rem % 2 === 1) {
        rects[i].setAttribute('fill', '#6C5B5C');
      }
    }

    // const firstSpan = spans[0];
    // console.log(firstSpan);
    // const rect = firstSpan.querySelector('rect');

    sequencer.on('change', v => {
      console.log(v);
    });

    sequencer.on('step', v => {
      console.log(v);
    });

    document.documentElement.addEventListener('mousedown', () => {
      console.log(Tone.context.state);
      if (Tone.context.state !== 'running') Tone.context.resume();
    });

    Tone.Transport.scheduleRepeat(this.repeat.bind(this), '8n');
    Tone.Transport.start();

    this.setState({ ...this.state, sequencer });
  }

  repeat(time) {
    const { index, boxes } = this.state;
    const step = index % 8;
    const synth = this.state.synths[0];
    const note = 'C3';
    // console.log(boxes[step], time);
    if (boxes[step] === true) {
      synth.triggerAttackRelease(note, '8n', time);
    }
    this.setState({ ...this.state, index: index + 1 });
  }

  onChange = e => {
    this.setState({ ...this.state, boxes: { ...this.state.boxes, [e.target.name]: e.target.checked } });
  };

  render() {
    const { sequencer } = this.state;
    // if (sequencer) console.log(this.state.sequencer);

    return (
      <div className="sequencer_container">
        <div className="sequencer_labels">
          <div className="sequencer_label">
            <span className="sequencer_label_text">Kick</span>
          </div>
          <div className="sequencer_label">
            <span className="sequencer_label_text">Clap</span>
          </div>
          <div className="sequencer_label">
            <span className="sequencer_label_text">Hat</span>
          </div>
          <div className="sequencer_label">
            <span className="sequencer_label_text">Snare</span>
          </div>
        </div>
        <div id="sequencer" ref={this.seqRef}></div>
      </div>
    );
  }
}

export default Sequencer;
