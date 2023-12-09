import { PrismaTypes } from 'database';
import {
  Client,
  DMChannel,
  Intents,
  Message,
  MessageReaction,
  PartialGroupDMChannel,
  PartialMessage,
  PartialMessageReaction,
  PartialUser,
  TextChannel,
  User,
} from 'discord.js-selfbot-v13';
import {
  createMessage,
  createReaction,
  deleteMessage,
  deleteReaction,
  fetchMessage,
  fetchOrCreateChannel,
  fetchOrCreateUser,
  updateMessage,
} from '../lib/portal';

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not defined');
}

const allIntents = new Intents(7796);
const discordClient = new Client({
  checkUpdate: false,
  intents: allIntents,
});
discordClient.login(process.env.BOT_TOKEN!);

discordClient.on('messageReactionAdd', onMessageReactionAdd);
async function onMessageReactionAdd(
  messageReaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) {
  if (user.id === discordClient.user!.id) return;

  const message = await fetchMessage(messageReaction.message.id);

  if (!message) {
    console.warn(
      `Ignoring reaction to unknown message ${messageReaction.message.id}`
    );
    return;
  }

  // TODO: Update the reaction if the count is not 1
  await createReaction({
    id: messageReaction.message.id + messageReaction.emoji.name,
    emoji: messageReaction.emoji.name,
    count: (await messageReaction.fetch()).count ?? 1,
    messageId: message.id,
  });
}

discordClient.on('messageReactionRemove', onMessageReactionRemove);
async function onMessageReactionRemove(
  messageReaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) {
  if (user.id === discordClient.user!.id) return;

  const message = await fetchMessage(messageReaction.message.id);

  if (!message) {
    console.warn(
      `Ignoring reaction to unknown message ${messageReaction.message.id}`
    );
    return;
  }

  // TODO: Likewise, update the reaction if the count is not 0.
  await deleteReaction(messageReaction.message.id + messageReaction.emoji.name);
}

// TODO: Handle file uploads
discordClient.on('messageCreate', onMessageCreate);
async function onMessageCreate(message: Message) {
  if (message.author.id === discordClient.user!.id) return;

  let author: PrismaTypes.User;

  if (message.channel.type === 'GUILD_TEXT') {
    for (const member of message.channel.members.values()) {
      const user = await fetchOrCreateUser(member.user.id, {
        id: member.user.id,
        displayName: member.user.username,
        username: member.user.tag,
        avatarURL: member.user.avatarURL({ size: 128 }) ?? null,
        platform: 'DISCORD',
      });

      if (user.id === message.author.id) author = user;
    }
    // @ts-ignore
  } else if (message.channel.type === 'GROUP_DM') {
    for (const recipient of (
      message.channel as PartialGroupDMChannel
    ).recipients.values()) {
      const user = await fetchOrCreateUser(recipient.id, {
        id: recipient.id,
        displayName: recipient.username,
        username: recipient.tag,
        avatarURL: recipient.avatarURL({ size: 128 }) ?? null,
        platform: 'DISCORD',
      });

      if (user.id === message.author.id) author = user;
    }
  } else if (message.channel.type === 'DM') {
    author = await fetchOrCreateUser(message.channel.recipient.id, {
      id: message.channel.recipient.id,
      displayName: message.channel.recipient.username,
      username: message.channel.recipient.tag,
      avatarURL: message.channel.recipient.avatarURL({ size: 128 }) ?? null,
      platform: 'DISCORD',
    });
  }

  const participants: { id: string }[] = [];

  if (message.channel.type === 'GUILD_TEXT') {
    message.channel.members.forEach((member) => {
      participants.push({ id: member.user.id });
    });
    // @ts-ignore
  } else if (message.channel.type === 'GROUP_DM') {
    for (const recipient of (
      message.channel as PartialGroupDMChannel
    ).recipients.values()) {
      participants.push({ id: recipient.id });
    }
    participants.push({ id: 'cld3afcy40000s7cwi0v9ms0a' });
  } else if (message.channel.type === 'DM') {
    participants.push({ id: message.channel.recipient.id });
    participants.push({ id: 'cld3afcy40000s7cwi0v9ms0a' });
  }

  const channel = await fetchOrCreateChannel(message.channel.id, {
    id: message.channel.id,
    name:
      (message.channel as TextChannel)?.name ??
      // @ts-ignore
      (message.channel as PartialGroupDMChannel)?.name ??
      (message.channel as DMChannel)?.recipient?.username ??
      'Unknown',
    avatarURL:
      // @ts-ignore
      (message.channel as PartialGroupDMChannel)?.icon ??
      (message.channel as DMChannel)?.recipient?.avatarURL({ size: 128 }) ??
      null,
    platform: 'DISCORD',
    participants: {
      connect: participants,
    },
  });

  await createMessage({
    id: message.id,
    content: message.content,
    authorId: author!.id,
    channelId: channel.id,
  });
}

discordClient.on('messageDelete', onMessageDelete);
async function onMessageDelete(message: Message | PartialMessage) {
  await deleteMessage(message.id);
}

discordClient.on('messageUpdate', onMessageUpdate);
async function onMessageUpdate(
  _: Message | PartialMessage,
  newMessage: Message | PartialMessage
) {
  await updateMessage(newMessage.id, {
    content: (await newMessage.fetch()).content,
  });
}

export default discordClient;
