'use client';

import MessageList from '@/app/message/[id]/chat/messageList';
import {
  DiscordIcon,
  IMessageIcon,
  InstagramIcon,
  TwitterIcon,
  WhatsAppIcon,
} from '@/components/social-icons';
import { PrismaTypes } from 'database';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { BsChatLeftDots } from 'react-icons/bs';
import { ChatChannel } from './getChannel';
import useAutosizeTextArea from './useAutoSizeTextArea';
import useConnectedMessages from './useConnectedMessages';

const DEBUG_SELF_ID = 'cld3afcy40000s7cwi0v9ms0a';

// {
//     createdAt: Date;
//     id: string;
//     authorId: string;
//     content: string;
//     edited: boolean;
//     reactions: Reaction[];
// }

export default function ChatArea({ channel }: { channel: ChatChannel }) {
  const [messages, setMessages] = useConnectedMessages(channel);
  const [messageToSend, setMessageToSend] = useState<string>('');

  const messageBoxRef = useRef<HTMLTextAreaElement | null>(null);
  useAutosizeTextArea(messageBoxRef.current, messageToSend);
  const onMessageBoxKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && messageToSend.length > 0 && !e.shiftKey) {
      e.preventDefault();

      const localId = 'local' + Math.random();

      // Put a local message in the message list immediately
      setMessages((messages) => [
        ...messages,
        {
          createdAt: new Date(),
          id: localId,
          authorId: DEBUG_SELF_ID,
          content: messageToSend,
          edited: false,
          reactions: [],
        },
      ]);

      // Send the message to the server
      fetch(`${process.env.NEXT_PUBLIC_PORTAL_URL}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelId: channel.id,
          content: messageToSend,
          platform: channel.platform,
        }),
      })
        .then((res) => res.json())
        .then((serverMessage: PrismaTypes.Message) => {
          setMessages((messages) =>
            messages.map((message) =>
              message.id === localId
                ? { ...message, id: serverMessage.id }
                : message
            )
          );
        });

      setMessageToSend('');
    }
  };

  const messageFeedRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = (force: boolean) => {
    if (!messageFeedRef.current) return;

    const distanceToBottom =
      messageFeedRef.current.scrollHeight -
      messageFeedRef.current.scrollTop -
      messageFeedRef.current.clientHeight;

    if (distanceToBottom > 100 && !force) return;

    messageFeedRef.current.scrollTop = messageFeedRef.current.scrollHeight;
  };
  useEffect(() => scrollToBottom(true), []);
  useEffect(() => scrollToBottom(false), [messages]);

  return (
    <div className="flex h-full grow flex-col overflow-clip">
      <div className="sticky flex w-full flex-row items-center gap-4 border-b border-neutral-100 px-5 py-4">
        <Image
          alt={`${channel.name} avatar`}
          src={channel?.avatarURL ?? '/greater-gabe.jpg'}
          className="h-10 w-10 rounded-full"
          width={40}
          height={40}
        />
        <div>
          <p className="text-lg font-semibold text-neutral-600">
            {channel.name}
          </p>
          <div className="flex flex-row items-center gap-1 fill-neutral-400 text-neutral-400">
            <div className="flex h-3 w-3">
              {
                {
                  UNIVERSAL: <></>,
                  INSTAGRAM: <InstagramIcon />,
                  DISCORD: <DiscordIcon />,
                  TWITTER: <TwitterIcon />,
                  WHATSAPP: <WhatsAppIcon />,
                  IMESSAGE: <IMessageIcon />,
                }[channel.platform]
              }
            </div>
            {channel.participants.length === 2 ? (
              <p className="text-xs leading-none">
                {
                  channel.participants.filter(
                    (participant) => participant.id !== DEBUG_SELF_ID
                  )[0].username
                }
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <div
        ref={messageFeedRef}
        className="grow overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300"
      >
        <MessageList messages={messages} channel={channel} />
      </div>
      <div className="px-4 pb-4">
        <textarea
          className="h-min w-full resize-none rounded-lg border border-gray-200 bg-gray-100 py-3 pl-4 outline-none"
          spellCheck={false}
          rows={1}
          ref={messageBoxRef}
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.target.value)}
          onKeyDown={onMessageBoxKeyDown}
          placeholder="Send a message..."
        />
        <div className="flex flex-row items-center gap-1.5 p-1 text-neutral-600">
          <BsChatLeftDots className="mt-1 animate-pulse" />
          <p className="mt-1 items-center text-sm">
            <span className="font-semibold">Deez Nuts</span> is typing...
          </p>
        </div>
      </div>
    </div>
  );
}
