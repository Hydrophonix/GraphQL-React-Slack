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
({ mutate, data: { loading, me, getUser }, match: { params: { teamId, userId } } }) => {
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
      <Header channelName={getUser.username} />
      <DirectMessageContainer
        userId={userId}
        teamId={team.id}
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
            optimisticResponse: {
              createDirectMessage: true,
            },
            update: (store) => {
              const data = store.readQuery({ query: meQuery });
              const teamidx2 = findIndex(data.me.teams, ['id', team.id]);
              const notAlreadyThere = data.me.teams[teamidx2].directMessageMembers.every(member =>
                member.id !== parseInt(userId, 10));
              if (notAlreadyThere) {
                data.me.teams[teamidx2].directMessageMembers.push({
                  __typename: 'User',
                  id: userId,
                  username: getUser.username,
                });
                store.writeQuery({ query: meQuery, data });
              }
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

const directMessageMeQuery = gql`
  query($userId: Int!) {
    getUser(userId: $userId) {
      username
    }
    me {
      id
      username
      teams {
        id
        name
        admin
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
        }
      }
    }
  }
`;

export default compose(
  graphql(directMessageMeQuery, {
    options: props => ({
      variables: { userId: props.match.params.userId },
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(createDirectMessageMutation),
)(ViewTeam);
