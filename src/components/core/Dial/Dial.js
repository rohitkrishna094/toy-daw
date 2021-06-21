import { Flex } from '@chakra-ui/react';
import Nexus from 'nexusui';
import React, { useEffect, useRef, useState } from 'react';

const Dial = ({ min = -60, max = 5.6, value = 0, mode = 'relative', interaction = 'radial', size = [75, 75], onChange, uiProps }) => {
  const dialRef = useRef();

  useEffect(() => {
    const id = dialRef.current.id;
    const dial = new Nexus.Dial(id, {
      size,
      interaction,
      mode,
      min,
      max,
      value,
    });
    dial.on('change', onChange);

    return () => {
      dial.destroy();
    };
  }, [dialRef]);

  return <Flex ref={dialRef} {...uiProps}></Flex>;
};

export default Dial;
