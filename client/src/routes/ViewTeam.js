import React, { Fragment } from 'react';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';

import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import Header from '../components/Header';
import MessageContainer from '../containers/MessageContainer';
import Input from '../components/Input';
import { meQuery } from '../graphql/team';

const ViewTeam =
({ mutate, data: { loading, me }, match: { params: { teamId, channelId } } }) => {
  if (loading) {
    return null;
  }

  const { teams, username } = me;

  if (!teams.length) {
    return (<Redirect to="/create-team" />);
  }

  const teamIdInteger = parseInt(teamId, 10);
  const teamIdx = teamIdInteger ? findIndex(teams, ['id', teamIdInteger]) : 0;
  const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

  const channelIdInteger = parseInt(channelId, 10);
  const channelIdx = channelIdInteger ? findIndex(team.channels, ['id', channelIdInteger]) : 0;
  const channel = channelIdx === -1 ? team.channels[0] : team.channels[channelIdx];

  return (
    <AppLayout>
      <Sidebar
        username={username}
        team={team}
        teams={teams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
      />
      {channel &&
        <Fragment>
          <Header channelName={channel.name} />
          <MessageContainer channelId={channel.id} />
          <Input
            placeholder={channel.name}
            onSubmit={async (text) => {
              await mutate({ variables: { text, channelId: channel.id } });
            }}
          />
        </Fragment>}
    </AppLayout>
  );
};

const createMessageMutation = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

export default compose(
  graphql(meQuery, { fetchPolicy: 'network-only' }),
  graphql(createMessageMutation),
)(ViewTeam);
