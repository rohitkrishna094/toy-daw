import React from 'react';
import ChannelHeader from './ChannelHeader/ChannelHeader';
import ChannelContent from './ChannelContent/ChannelContent';
import ChannelFooter from './ChannelFooter/ChannelFooter';
import './Channel.css';

export default function Channel() {
    return (
        <div className="channel">
            <ChannelHeader></ChannelHeader>
            <ChannelContent></ChannelContent>
            <ChannelFooter></ChannelFooter>
        </div>
    );
}
