import { Message, User } from '@androz2091/insta.js';
import {
  createMessage,
  createReaction,
  deleteMessage,
  deleteReaction,
  fetchMessage,
  fetchOrCreateChannel,
  fetchOrCreateUser,
} from '../lib/portal';

// FIXME: Watch out, I manually commented out the preLoginFlow in the login method of the client to stop errors. Perhaps fork the project and iterate on insta.js.
// This is just janky in general.
import { Client } from '@androz2091/insta.js';
const instagramClient = new Client({
  disableReplyPrefix: true,
});

// FIXME: Find some way to make this work with other emoji reactions
instagramClient.on('likeAdd', onLikeAdd);
async function onLikeAdd(user: User, instagramMessage: Message) {
  if (user.id === instagramClient.user!.id) return;

  const message = await fetchMessage(instagramMessage.id);

  if (!message) {
    console.warn(`Ignoring like to unknown message ${instagramMessage.id}`);
    return;
  }

  // TODO: Update the reaction if the count is not 1
  await createReaction({
    id: instagramMessage.id + '❤️',
    emoji: '❤️',
    count: instagramMessage.likes.length,
    messageId: message.id,
  });
}

instagramClient.on('likeRemove', onLikeRemove);
async function onLikeRemove(user: User, instagramMessage: Message) {
  if (user.id === instagramClient.user!.id) return;

  const message = await fetchMessage(instagramMessage.id);

  if (!message) {
    console.warn(`Ignoring like to unknown message ${instagramMessage.id}`);
    return;
  }

  // TODO: Likewise, update the reaction if the count is not 0.
  await deleteReaction(instagramMessage.id + '❤️');
}

// TODO: Handle group chats
instagramClient.on('messageCreate', onMessageCreate);
async function onMessageCreate(message: Message) {
  if (message.author.id === instagramClient.user!.id) return;

  const author = await fetchOrCreateUser(
    (message.author.id as unknown as number).toString(),
    {
      id: (message.author.id as unknown as number).toString(),
      displayName: message.author.username,
      username: message.author.username,
      avatarURL: message.author.avatarURL,
      platform: 'INSTAGRAM',
    }
  );

  const channel = await fetchOrCreateChannel(message.chatID, {
    id: message.chatID,
    name: message.chat.name ?? message.chatID,
    avatarURL: author.avatarURL,
    platform: 'INSTAGRAM',
    participants: {
      connect: [
        {
          id: 'cld3afcy40000s7cwi0v9ms0a',
        },
        {
          id: author.id,
        },
      ],
    },
  });

  await createMessage({
    id: message.id,
    // FIXME: Watch out for image/file uploads with potentially no content.
    content: message.content!,
    authorId: author.id,
    channelId: channel.id,
  });
}

instagramClient.on('messageDelete', onMessageDelete);
async function onMessageDelete(message: Message) {
  await deleteMessage(message.id);
}

// FIXME: Also made the state object in the login method optional so typescript doesn't complain. (Make a fork!)
instagramClient.login(process.env.IG_USERNAME!, process.env.IG_PASSWORD!);

export default instagramClient;
