import React, { useEffect, useRef, useState } from 'react';
import { Button, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Flex } from '@chakra-ui/react';
import * as Tone from 'tone';
import Nexus from 'nexusui';
import './StepSequencer.scss';
import Dial from '../core/Dial/Dial';
import Oscilloscope from '../core/Oscilloscope/Oscilloscope';
import Draggable from 'react-draggable';
import PianoRoll from '../core/PianoRoll/PianoRoll';

const defaultProps = {
  BPM: 120,
  minBPM: 60,
  maxBPM: 240,
  BPMStep: 1,
  rows: 4,
  columns: 16,
  beatOffset: 0,
};

const StepSequencer = () => {
  const [play, setPlay] = useState(false);
  const [players, setPlayers] = useState();
  const [sequencer, setSequencer] = useState();
  const pianoRollRef = useRef();
  const [isStart, setIsStart] = useState(false);
  const [BPM, setBPM] = useState(defaultProps.BPM);
  const [rows, setRows] = useState(defaultProps.rows);
  const [columns, setColumns] = useState(defaultProps.columns);
  let [beat, setBeat] = useState(defaultProps.beatOffset);
  let [masterVolume, setMasterVolume] = useState(-20);
  const [volNode, setVolNode] = useState();
  const seqRef = useRef();
  const mainRef = useRef();

  useEffect(() => {
    const volNode = new Tone.Volume(masterVolume).toDestination();
    setVolNode(volNode);
    // const players = new Tone.Players({
    //   urls: {
    //     0: 'A1.mp3',
    //     1: 'Cs2.mp3',
    //     2: 'E2.mp3',
    //     3: 'Fs2.mp3',
    //   },
    //   fadeOut: '64n',
    //   baseUrl: 'https://tonejs.github.io/audio/casio/',
    // }).connect(volNode);
    const players = new Tone.Players({
      urls: {
        0: 'kick.mp3',
        1: 'hihat.mp3',
        2: 'snare.mp3',
        3: 'tom1.mp3',
      },
      // fadeOut: '64n',
      // baseUrl: 'https://github.com/Tonejs/audio/tree/master/drum-samples/acoustic-kit/',
      baseUrl: 'https://tonejs.github.io/audio/drum-samples/acoustic-kit/',
    }).connect(volNode);
    setPlayers(players);

    return () => {
      setPlayers(undefined);
    };
  }, []);

  useEffect(() => {
    if (volNode) volNode.volume.value = masterVolume;
  }, [masterVolume, volNode]);

  useEffect(() => {
    const id = seqRef?.current?.id;
    const sequencer = new Nexus.Sequencer(id, {
      size: [500, 160],
      mode: 'toggle',
      rows,
      columns,
      paddingRow: 5,
      paddingColumn: 5,
    });
    sequencer.colorize('fill', '#51575B');
    sequencer.colorize('accent', '#AABAC4');
    const rects = seqRef.current.getElementsByTagName('rect');

    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];
      const rem = Math.floor(i / 4);
      rect.setAttribute('rx', 4);
      if (rem % 2 === 1) {
        // rect.setAttribute('fill', '#6C5B5C');
      }
    }
    // sequencer.on('change', (v) => console.log(v));
    sequencer.matrix.set.all([
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);

    setSequencer(sequencer);

    return () => {
      sequencer.destroy();
      setSequencer(undefined);
    };
  }, [seqRef]);

  const onClick = (e) => {
    if (!isStart) {
      Tone.start();
      setIsStart(true);
      configLoop(sequencer);
    }
    if (!play) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
      pianoRollRef.current.stop();
    }
    setPlay(!play);
  };

  const configLoop = (sequencer) => {
    const repeat = (time) => {
      sequencer.next();
      pianoRollRef.current.play(Tone.getContext().rawContext, (ev) => {
        console.log(ev);
      });
      const grid = sequencer.matrix.pattern;
      grid.forEach((row, index) => {
        let synth = players.player(index);
        let note = row[beat];
        if (note) synth.start(time, 0, '1n');
      });

      beat = (beat + 1) % columns;
      // setBeat((beat + 1) % columns);
    };

    Tone.Transport.bpm.value = BPM;
    Tone.Transport.scheduleRepeat(repeat, '16n');
  };

  const onBPMSliderChange = (value) => {
    Tone.Transport.bpm.value = value;
    setBPM(value);
  };

  return (
    <Draggable bounds="parent" nodeRef={mainRef}>
      <Flex className="step-sequencer-container" ref={mainRef}>
        <PianoRoll pianoRollRef={pianoRollRef} />
        <Flex flexDir="column" mt={5}>
          <h3>{BPM} BPM</h3>
          <Slider w="500px" defaultValue={defaultProps.BPM} min={defaultProps.minBPM} max={defaultProps.maxBPM} step={defaultProps.BPMStep} onChange={onBPMSliderChange}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Oscilloscope uiProps={{ id: 'oscilloscope' }} destination={Tone.Destination} />
          <Button colorScheme="blue" onClick={onClick} pl={100} pr={100}>
            {play ? 'Pause' : 'Play'}
          </Button>
          <Dial value={masterVolume} onChange={(v) => setMasterVolume(v)} uiProps={{ id: 'volume', mt: 5 }} />
          <Flex id="sequencer" mt={5} ref={seqRef}></Flex>
        </Flex>
      </Flex>
    </Draggable>
  );
};

export default StepSequencer;
