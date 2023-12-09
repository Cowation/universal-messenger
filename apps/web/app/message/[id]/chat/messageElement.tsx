import { ChatMessage } from '@/app/message/[id]/getChannel';

const MessageElement = ({ message }: { message: ChatMessage }) => {
  return (
    <div className="flex flex-col items-start">
      <p className="rounded-lg border border-neutral-200 px-3 py-2 text-neutral-600">
        {message.content}
      </p>
      {message.edited ? (
        <p className="text-xs text-neutral-400">(edited)</p>
      ) : null}
      {message.reactions.length > 0 ? (
        <div className="mt-1 flex flex-row gap-1">
          {message.reactions.map((reaction, index) => (
            <button
              key={index}
              className="flex flex-row gap-1 rounded-lg border border-neutral-200 bg-neutral-300/20 py-1 px-2 text-center leading-none"
            >
              <span className="-ml-1">{reaction.emoji}</span>
              <span>{reaction.count}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default MessageElement;
