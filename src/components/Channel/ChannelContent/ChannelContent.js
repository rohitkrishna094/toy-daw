import React from 'react';
import './ChannelContent.css';
import Sequencer from '../../Sequencer/Sequencer';
export default function ChannelContent() {
    return (
        <div class="channel-content-container">
            <div className="channel-content">
                <Sequencer />
            </div>
        </div>
    );
}
