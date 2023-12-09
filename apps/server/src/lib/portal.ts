import { prisma, PrismaTypes } from 'database';
import { pusher } from 'realtime';

export async function createMessage(data: {
  id: string;
  content: string;
  authorId: string;
  channelId: string;
}) {
  const message = await prisma.message.create({
    data,
  });

  pusher.trigger('message', 'created', message);

  return message;
}

export async function fetchMessage(id: string) {
  return await prisma.message.findUnique({
    where: {
      id,
    },
  });
}

export async function deleteMessage(id: string) {
  // Delete all reactions on the message
  await prisma.reaction.deleteMany({
    where: {
      messageId: id,
    },
  });

  const message = await prisma.message.delete({
    where: {
      id,
    },
  });

  pusher.trigger('message', 'deleted', message);

  return message;
}

export async function updateMessage(id: string, data: { content: string }) {
  const message = await prisma.message.update({
    where: {
      id,
    },
    data: {
      ...data,
      edited: true,
    },
  });

  pusher.trigger('message', 'updated', message);

  return message;
}

export async function createReaction(data: {
  id: string;
  emoji: any;
  count: number;
  messageId: string;
}) {
  const reaction = await prisma.reaction.create({ data });

  pusher.trigger('reaction', 'created', reaction);

  return reaction;
}

export async function deleteReaction(id: string) {
  const reaction = await prisma.reaction.delete({ where: { id } });

  pusher.trigger('reaction', 'deleted', reaction);

  return reaction;
}

export async function fetchOrCreateUser(
  id: string,
  data: {
    id: string;
    displayName: string;
    username: string;
    avatarURL: string | null;
    platform: PrismaTypes.Platform;
  }
) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return await prisma.user.create({
      data,
    });
  }

  return user;
}

export async function fetchOrCreateChannel(
  id: string,
  data: {
    id: string;
    name: string;
    avatarURL: string | null;
    platform: PrismaTypes.Platform;
    participants: {
      connect: {
        id: string;
      }[];
    };
  }
) {
  const channel = await prisma.channel.findUnique({
    where: {
      id,
    },
  });

  if (!channel) {
    const channel = await prisma.channel.create({
      data,
    });

    pusher.trigger('channel', 'created', channel);

    return channel;
  }

  return channel;
}
