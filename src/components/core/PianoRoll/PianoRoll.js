import { Flex } from '@chakra-ui/react';
import 'webaudio-pianoroll';
import React from 'react';

const PianoRoll = ({ pianoRollRef }) => {
  return (
    <Flex>
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
      />
    </Flex>
  );
};

export default PianoRoll;
