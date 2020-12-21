import React, { Component } from 'react';
import * as Tone from 'tone';
import Nexus from 'nexusui';
import { delay } from '../../utils/index';
import './Sequencer.css';

class Sequencer extends Component {
  constructor(props) {
    super(props);
    this.seqRef = React.createRef();

    const synths = [new Tone.Synth()];
    synths[0].oscillator.type = 'triangle';
    const gain = new Tone.Gain(0.6);
    gain.toMaster();
    synths.forEach((synth) => synth.connect(gain));

    const player = new Tone.Players(
      {
        kick: 'https://raw.githubusercontent.com/Tonejs/Tone.js/dev/examples/audio/505/kick.mp3',
        snare: 'https://raw.githubusercontent.com/Tonejs/Tone.js/dev/examples/audio/505/snare.ogg',
        closedHiHate: 'https://raw.githubusercontent.com/Tonejs/Tone.js/dev/examples/audio/505/hh.mp3',
        openHiHat: 'https://raw.githubusercontent.com/Tonejs/Tone.js/dev/examples/audio/505/hho.mp3',
      },
      function () {
        //sampler will repitch the closest sample
      }
    );
    player.connect(gain);
    // setInterval(() => {
    //   player.get('kick').start();
    // }, 1000);
    this.state = { index: 0, synths, boxes: {}, sequencer: null, player, instruments: ['Kick', 'Clap', 'Hat', 'Snare', 'Kick', 'Clap', 'Hat', 'Snare'] };
  }

  componentDidMount() {
    const rows = this.state.instruments.length;
    const columns = 16;
    const sequencer = new Nexus.Sequencer('#sequencer', {
      size: [25 * columns, 28.75 * rows],
      mode: 'toggle',
      rows,
      columns,
    });
    sequencer.colorize('fill', '#51575B');
    sequencer.colorize('accent', '#AABAC4');

    const rects = this.seqRef.current.getElementsByTagName('rect');

    for (let i = 0; i < rects.length; i++) {
      const rem = Math.floor(i / 4);
      if (rem % 2 === 1) {
        rects[i].setAttribute('fill', '#6C5B5C');
      }
    }

    // const firstSpan = spans[0];
    // console.log(firstSpan);
    // const rect = firstSpan.querySelector('rect');

    sequencer.on('change', (v) => {
      console.log(v);
      if (v.state === true) {
        const sum = v.row * 16 + v.column;
        const rem = Math.floor(sum / 4);
        if (rem % 2 === 1) {
          setTimeout(() => {
            rects[sum].setAttribute('fill', '#C99C9E');
          }, 0);
        }
      }

      if (v.state === false) {
        const sum = v.row * 16 + v.column;
        const rem = Math.floor(sum / 4);
        if (rem % 2 === 1) {
          setTimeout(() => {
            rects[sum].setAttribute('fill', '#6C5B5C');
          }, 0);
        }
      }
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

  onChange = (e) => {
    this.setState({ ...this.state, boxes: { ...this.state.boxes, [e.target.name]: e.target.checked } });
  };

  render() {
    const { sequencer } = this.state;
    // if (sequencer) console.log(this.state.sequencer);
    const instruments = this.state.instruments;
    return (
      <div className="sequencer_container">
        <div className="sequencer_side">
          {instruments.map((i) => (
            <div className="sequencer_side_container" key={i}>
              <div className="sequencer_label">
                <span className="sequencer_label_text">{i}</span>
              </div>
              <div className="sequencer_indicator"></div>
            </div>
          ))}
        </div>
        <div id="sequencer" ref={this.seqRef}></div>
      </div>
    );
  }
}

export default Sequencer;
