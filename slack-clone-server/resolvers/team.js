export default {
  Mutation: {
    createTeam: (parent, args, { models, user }) =>
      models.Team.create({ ...args, owner: user.id }),
  },
};
