import React from 'react';
import './ChannelHeader.css';

export default function ChannelHeader() {
  return (
    <div className="channel-header">
      <span className="item">
        <i class="fas fa-caret-right"></i>
      </span>
      <span className="item" id="ellipsis">
        <i class="fas fa-ellipsis-v"></i>
      </span>
      <span className="item">
        <i class="fas fa-play-circle"></i>
      </span>
      <span className="item">
        <span id="title">Channel Rack</span>
      </span>
      <span className="item">
        <i class="fas fa-signal"></i>
      </span>
      <span className="item" id="step-switch">
        <i class="fas fa-server"></i>
      </span>
      <span className="item">
        <i class="fas fa-times"></i>
      </span>
    </div>
  );
}
