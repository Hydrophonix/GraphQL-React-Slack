export default {
  Mutation: {
    createMessage: (parent, args, { models, user }) =>
      models.Message.create({ ...args, userId: user.id }),
  },
};
