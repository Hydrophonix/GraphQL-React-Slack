import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const ChannelWrapper = styled.div`
  grid-column: 2;
  grid-row: 1 / 4;
  background-color: #4e3a4c;
  color: #958993;
`;

const TeamNameHeader = styled.h1`
  color: #fff;
  font-size: 20px;
`;

const SideBarList = styled.ul`
  width: 100%;
  list-style: none;
  padding-left: 0px;
`;

const paddingLeft = 'padding-left: 10px';

const SideBarListItem = styled.li`
  padding: 2px;
  ${paddingLeft};
  &:hover {
    background: #3e313c;
  }
`;

const SideBarListHeader = styled.li`${paddingLeft};`;
const PushLeft = styled.div`${paddingLeft};`;
const Green = styled.span`color: #38978d;`;

const Bubble = ({ on = true }) => (on ? <Green>●</Green> : '○');

export default ({
  userName,
  teamName,
  teamId,
  isOwner,
  users,
  channels,
  onAddChannelClick,
  onInvitePeopleClick,
  onDirectMessageClick,
}) => (
  <ChannelWrapper>
    <PushLeft>
      <TeamNameHeader>{teamName}</TeamNameHeader>
      {userName}
    </PushLeft>
    <div>
      <SideBarList>
        <SideBarListHeader>
          Channels
          {isOwner && <Icon name="add circle" onClick={onAddChannelClick} />}
        </SideBarListHeader>
        {channels.map(({ id, name }) => (
          <Link to={`/view-team/${teamId}/${id}`} key={`channel-${id}`}>
            <SideBarListItem># {name}</SideBarListItem>
          </Link>))}
      </SideBarList>
    </div>
    <div>
      <SideBarList>
        <SideBarListHeader>
          Direct Messages
          <Icon name="add circle" onClick={onDirectMessageClick} />
        </SideBarListHeader>
        {users.map(({ id, username }) => (
          <SideBarListItem key={`user-${id}`}>
            <Link to={`/view-team/user/${teamId}/${id}`}>
              <Bubble /> {username}
            </Link>
          </SideBarListItem>))}
      </SideBarList>
    </div>
    {isOwner &&
      <div>
        <a href="#invite-people" onClick={onInvitePeopleClick}>
        + Invite people
        </a>
      </div>}
  </ChannelWrapper>
);
