import { ChakraProvider } from '@chakra-ui/react';
import './App.scss';
import StepSequencer from './components/StepSequencer/StepSequencer';

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <StepSequencer />
      </div>
    </ChakraProvider>
  );
}

export default App;
