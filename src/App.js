import React from 'react';
import './App.css';
import Channel from './components/Channel/Channel';

export default function App() {
    return (
        <div className="App" onContextMenu={e => e.preventDefault()}>
            <Channel></Channel>
        </div>
    );
}
