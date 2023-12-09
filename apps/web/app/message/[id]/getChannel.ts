import { prisma } from 'database';

export async function getChannel(id: string) {
  return await prisma.channel.findUnique({
    where: {
      id: id,
    },
    include: {
      participants: true,
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          id: true,
          authorId: true,
          content: true,
          createdAt: true,
          edited: true,
          reactions: true,
        },
      },
    },
  });
}

export type ChatChannel = NonNullable<Awaited<ReturnType<typeof getChannel>>>;
export type ChatMessage = ChatChannel['messages'][number];
