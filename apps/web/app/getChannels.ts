import { prisma } from 'database';

export async function getChannels() {
  return (
    await prisma.channel.findMany({
      include: {
        participants: true,
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            content: true,
            createdAt: true,
          },
        },
      },
    })
  ).sort((a, b) => {
    const aDate = a.messages[0]?.createdAt;
    const bDate = b.messages[0]?.createdAt;

    if (!aDate && !bDate) {
      return 0;
    }

    if (!aDate) {
      return 1;
    }

    if (!bDate) {
      return -1;
    }

    return bDate.getTime() - aDate.getTime();
  });
}

export type SidebarChannel = Awaited<ReturnType<typeof getChannels>>[number];
