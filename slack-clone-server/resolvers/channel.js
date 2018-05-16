export default {
  Mutation: {
    createChannel: (parent, args, { models }) => models.Channel.create(args),
  },
};
