import { ChatMessage } from '@/app/message/[id]/getChannel';
import { User } from '@prisma/client';
import Image from 'next/image';
import MessageElement from './messageElement';

const MessageGroup = ({
  messages,
  author,
}: {
  messages: ChatMessage[];
  author: User;
}) => {
  return (
    <div className="px-6">
      <div className="flex flex-col items-start gap-1">
        <p className="ml-10 text-sm font-semibold text-neutral-500">
          {author.displayName}{' '}
          <span className="text-xs font-normal text-neutral-400">
            {messages[0].createdAt.toLocaleDateString() ===
            new Date().toLocaleDateString()
              ? messages[0].createdAt.toLocaleTimeString(undefined, {
                  hour: 'numeric',
                  minute: '2-digit',
                })
              : messages[0].createdAt.toLocaleDateString(undefined)}
          </span>
        </p>
        <div className="flex flex-row items-start">
          <Image
            src={author.avatarURL ?? '/greater-gabe.jpg'}
            alt={`Avatar of ${author.displayName}`}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
          <div className="ml-2 flex max-w-none flex-col items-start gap-1 lg:max-w-xl">
            {messages.map((message) => (
              <MessageElement key={message.id} message={message} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageGroup;
