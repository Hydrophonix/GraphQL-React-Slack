import React from 'react';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';

import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import Header from '../components/Header';
import DirectMessageContainer from '../containers/DirectMessageContainer';
import Input from '../components/Input';
import { meQuery } from '../graphql/team';

const ViewTeam =
({ mutate, data: { loading, me }, match: { params: { teamId, userId } } }) => {
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
      <Header channelName="keko" />
      <DirectMessageContainer
        userId={userId}
        teamId={teamId}
      />
      <Input
        placeholder={userId}
        onSubmit={async (text) => {
          await mutate({
            variables: {
              text,
              teamId,
              receiverId: userId,
            },
          });
        }}
      />
    </AppLayout>
  );
};

const createDirectMessageMutation = gql`
  mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

export default compose(
  graphql(meQuery, { fetchPolicy: 'network-only' }),
  graphql(createDirectMessageMutation),
)(ViewTeam);
