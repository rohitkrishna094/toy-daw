import { Flex } from '@chakra-ui/react';
import Nexus from 'nexusui';
import React, { useEffect, useRef } from 'react';

const Oscilloscope = ({ uiProps, destination }) => {
  const oscilloscopeRef = useRef();

  useEffect(() => {
    const id = oscilloscopeRef.current;
    const oscilloscope = new Nexus.Oscilloscope(id);
    oscilloscope.connect(destination);

    return () => {
      oscilloscope.destroy();
    };
  }, [oscilloscopeRef]);

  return <Flex ref={oscilloscopeRef} {...uiProps}></Flex>;
};

export default Oscilloscope;
