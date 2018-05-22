import React from 'react';

import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import Header from '../components/Header';
import Messages from '../components/Messages';
import Input from '../components/Input';

export default () => (
  <AppLayout>
    <Sidebar currentTeamId={4} />
    <Header channelName="main" />
    <Messages>
      <ul className="message-list">
        <li />
        <li />
      </ul>
    </Messages>
    <Input channelName="main" />
  </AppLayout>
);
