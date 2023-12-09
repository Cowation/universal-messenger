import { Client } from '@androz2091/insta.js';
import { prisma, PrismaTypes } from 'database';
import type { Handler } from 'express';
import discordClient from '../bridges/discord';
import instagramClient from '../bridges/instagram';

export type Payload = {
  content: string;
  channelId: string;
  platform: PrismaTypes.Platform;
};

type ExternalMessage = {
  id: string;
  content: string;
  channelId: string;
};

export async function sendDiscordMessage(
  channelId: string,
  content: string
): Promise<ExternalMessage> {
  const channel = await discordClient.channels.fetch(channelId);

  if (!channel) {
    throw new Error('Channel not found');
  }

  if (!channel.isText()) {
    throw new Error('Channel is not a text channel');
  }

  const discordMessage = await channel.send(content);

  return {
    id: discordMessage.id,
    content: discordMessage.content,
    channelId: discordMessage.channel.id,
  };
}

export async function sendInstagramMessage(
  channelId: string,
  content: string
): Promise<ExternalMessage> {
  const channel = await (instagramClient as Client).fetchChat(channelId, false);

  if (!channel) {
    throw new Error('Channel not found');
  }

  // @ts-ignore
  const instagramMessage = await channel.sendMessage(content);

  return {
    id: instagramMessage.id,
    content: instagramMessage.content!,
    channelId: instagramMessage.chatID,
  };
}

export const post: Handler = async (req, res) => {
  const { content, channelId, platform } = req.body as Payload;

  let externalMessage: ExternalMessage;
  switch (platform) {
    case 'DISCORD':
      externalMessage = await sendDiscordMessage(channelId, content);
      break;
    case 'INSTAGRAM':
      externalMessage = await sendInstagramMessage(channelId, content);
      break;
    default:
      throw new Error('Unsupported platform');
  }

  const prismaMessage = await prisma.message.create({
    data: {
      id: externalMessage.id,
      content: externalMessage.content,
      authorId: 'cld3afcy40000s7cwi0v9ms0a',
      channelId: externalMessage.channelId,
    },
  });

  return res.json(prismaMessage);
};
