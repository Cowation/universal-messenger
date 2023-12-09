import { PrismaTypes } from 'database';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
import { ChatChannel, ChatMessage } from './getChannel';

export default function useConnectedMessages(channel: ChatChannel) {
  const [messages, setMessages] = useState<ChatMessage[]>(channel.messages);

  useEffect(() => {
    // TODO: Maybe extract this to a higher level so that we can also update the sidebar with the new message
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const messageChannel = pusher.subscribe('message');
    messageChannel.bind('created', (data: PrismaTypes.Message) => {
      if (data.channelId === channel.id) {
        setMessages((messages) => [
          ...messages,
          {
            createdAt: new Date(data.createdAt),
            id: data.id,
            authorId: data.authorId,
            content: data.content,
            edited: data.edited,
            reactions: [],
          },
        ]);
      }
    });
    messageChannel.bind('deleted', (data: PrismaTypes.Message) => {
      if (data.channelId === channel.id) {
        setMessages((messages) => {
          const messageIndex = messages.findIndex(
            (message) => message.id === data.id
          );
          if (messageIndex === -1) {
            return messages;
          }
          return [
            ...messages.slice(0, messageIndex),
            ...messages.slice(messageIndex + 1),
          ];
        });
      }
    });
    messageChannel.bind('updated', (data: PrismaTypes.Message) => {
      if (data.channelId === channel.id) {
        setMessages((messages) => {
          const messageIndex = messages.findIndex(
            (message) => message.id === data.id
          );
          if (messageIndex === -1) {
            return messages;
          }
          const message = messages[messageIndex];
          return [
            ...messages.slice(0, messageIndex),
            {
              ...message,
              content: data.content,
              edited: data.edited,
            },
            ...messages.slice(messageIndex + 1),
          ];
        });
      }
    });

    const reactionChannel = pusher.subscribe('reaction');
    reactionChannel.bind('created', (data: PrismaTypes.Reaction) => {
      console.log('reaction create invoked');
      if (
        channel.messages.findIndex(
          (message) => message.id === data.messageId
        ) !== -1
      ) {
        setMessages((messages) => {
          const messageIndex = messages.findIndex(
            (message) => message.id === data.messageId
          );
          if (messageIndex === -1) {
            return messages;
          }
          const message = messages[messageIndex];
          return [
            ...messages.slice(0, messageIndex),
            {
              ...message,
              reactions: [
                ...message.reactions,
                {
                  id: data.id,
                  emoji: data.emoji,
                  count: data.count,
                  messageId: data.messageId,
                },
              ],
            },
            ...messages.slice(messageIndex + 1),
          ];
        });
      }
    });
    reactionChannel.bind('deleted', (data: PrismaTypes.Reaction) => {
      if (
        channel.messages.findIndex(
          (message) => message.id === data.messageId
        ) !== -1
      ) {
        setMessages((messages) => {
          const messageIndex = messages.findIndex(
            (message) => message.id === data.messageId
          );
          if (messageIndex === -1) {
            return messages;
          }
          const message = messages[messageIndex];
          return [
            ...messages.slice(0, messageIndex),
            {
              ...message,
              reactions: message.reactions.filter(
                (reaction) => reaction.id !== data.id
              ),
            },
            ...messages.slice(messageIndex + 1),
          ];
        });
      }
    });

    return () => {
      pusher.unsubscribe('message');
      pusher.unsubscribe('reaction');
    };
  }, [channel.id, channel.messages]);

  return [messages, setMessages] as const;
}
