import React from 'react';
import './App.css';
import Channel from './components/Channel/Channel';
import Demo from './Demo';

export default function App() {
  return (
    <div className="App" onContextMenu={(e) => e.preventDefault()}>
      <Channel></Channel>
      {/* <Demo></Demo> */}
    </div>
  );
}
