import { ChatChannel, ChatMessage } from '@/app/message/[id]/getChannel';
import { User } from '@prisma/client';
import MessageGroup from './messageGroup';

const MessageList = ({
  messages,
  channel,
}: {
  messages: ChatMessage[];
  channel: ChatChannel;
}) => {
  if (!channel) {
    return null;
  }

  const messageGroups = messages.reduce((groups, message) => {
    const lastGroup = groups[groups.length - 1];
    const author = channel.participants.find(
      (participant) => participant.id === message.authorId
    )!;

    if (lastGroup && lastGroup.messages[0].authorId === message.authorId) {
      lastGroup.messages.push(message);
    } else {
      groups.push({ messages: [message], author });
    }

    return groups;
  }, [] as { messages: ChatMessage[]; author: User }[]);

  return (
    <div className="flex min-h-full flex-col items-start justify-end gap-4 py-4">
      {messageGroups.map((group, index) => (
        <MessageGroup
          key={index}
          author={group.author}
          messages={group.messages}
        />
      ))}
    </div>
  );
};

export default MessageList;
