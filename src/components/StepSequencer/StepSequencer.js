import React, { useEffect, useRef, useState } from 'react';
import { Button, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Flex } from '@chakra-ui/react';
import * as Tone from 'tone';
import 'webaudio-pianoroll';
import Nexus from 'nexusui';
import './StepSequencer.scss';

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
  const [oscilloscope, setOscilloscope] = useState();
  const [volumeDial, setVolumeDial] = useState();
  const pianoRollRef = useRef();
  const [isStart, setIsStart] = useState(false);
  const [BPM, setBPM] = useState(defaultProps.BPM);
  const [rows, setRows] = useState(defaultProps.rows);
  const [columns, setColumns] = useState(defaultProps.columns);
  let [beat, setBeat] = useState(defaultProps.beatOffset);
  let [masterVolume, setMasterVolume] = useState(0.0);
  const [volNode, setVolNode] = useState();
  const seqRef = useRef();
  const volumeRef = useRef();
  const oscilloscopeRef = useRef();

  useEffect(() => {
    // const players = new Tone.Players({
    //   urls: {
    //     0: 'A1.mp3',
    //     1: 'Cs2.mp3',
    //     2: 'E2.mp3',
    //     3: 'Fs2.mp3',
    //   },
    //   fadeOut: '64n',
    //   baseUrl: 'https://tonejs.github.io/audio/casio/',
    // }).toDestination();
    const volNode = new Tone.Volume(masterVolume).toDestination();
    setVolNode(volNode);
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

  useEffect(() => {
    const id = oscilloscopeRef.current;
    const oscilloscope = new Nexus.Oscilloscope(id);
    oscilloscope.connect(Tone.Destination);
    setOscilloscope(oscilloscope);

    return () => {
      oscilloscope.destroy();
      setOscilloscope(undefined);
    };
  }, [oscilloscopeRef]);

  useEffect(() => {
    const id = volumeRef.current.id;
    const dial = new Nexus.Dial(id, {
      size: [75, 75],
      interaction: 'radial', // "radial", "vertical", or "horizontal"
      mode: 'relative', // "absolute" or "relative"
      min: -60,
      max: 5.6,
      value: 0,
    });
    dial.on('change', (v) => {
      setMasterVolume(v);
    });

    return () => {
      setVolumeDial(undefined);
      volumeDial.destroy();
    };
  }, [volumeRef]);

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
    };

    Tone.Transport.bpm.value = BPM;
    Tone.Transport.scheduleRepeat(repeat, '16n');
  };

  const onBPMSliderChange = (value) => {
    Tone.Transport.bpm.value = value;
    setBPM(value);
  };

  return (
    <div className="step-sequencer-container">
      <webaudio-pianoroll
        ref={pianoRollRef}
        editMode="dragpoly"
        style={{ overflowY: 'scroll' }}
        xRange={256}
        yRange={20}
        width="1000"
        xScroll={1}
        yScroll={1}
        wheelZoom={1}
        markStart={0}
        markEnd={256}
        collt="#34444E"
        coldk="#2E3E48"
        colgrid="#24343E"
        colnote="#A4D4AD"
        colnotesel="#AFD4BA"
        colnoteborder="#A4D4AD"
        colrulerbg="#1F2A32"
        colrulerfg="#b0b0b0"
        // colrulerborder="pink"
        kbwidth="80"
      ></webaudio-pianoroll>
      <Flex flexDir="column" mt={5}>
        <h3>{BPM} BPM</h3>
        <Slider w="500px" defaultValue={defaultProps.BPM} min={defaultProps.minBPM} max={defaultProps.maxBPM} step={defaultProps.BPMStep} onChange={onBPMSliderChange}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Flex id="oscilloscope" ref={oscilloscopeRef}></Flex>
        <Button colorScheme="blue" onClick={onClick} pl={100} pr={100}>
          {play ? 'Pause' : 'Play'}
        </Button>
        <Flex id="volumne" mt={5} ref={volumeRef}></Flex>
        <Flex id="sequencer" mt={5} ref={seqRef}></Flex>
      </Flex>
    </div>
  );
};

export default StepSequencer;
