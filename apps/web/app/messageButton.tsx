import { SidebarChannel } from '@/app/getChannels';
import {
  DiscordIcon,
  IMessageIcon,
  InstagramIcon,
  TwitterIcon,
  WhatsAppIcon,
} from '@/components/social-icons';
import clsx from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Image from 'next/image';
import Link from 'next/link';
import { BsPeopleFill } from 'react-icons/bs';

dayjs.extend(relativeTime);

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const MessageButton = ({
  channel,
  selected,
}: {
  channel: SidebarChannel;
  selected: boolean;
}) => {
  const hasFirstMessage = channel.messages.length > 0;

  return (
    <Link
      href={`/message/${channel.id}`}
      className={clsx(
        'flex h-14 w-full select-none flex-row items-center rounded-lg py-2 pr-3 pl-1 text-left hover:bg-gray-200',
        {
          'bg-gray-200': selected,
        }
      )}
    >
      <div
        className={clsx('h-2 w-2 shrink-0 rounded-full bg-blue-500', {
          invisible: !false,
        })}
      ></div>
      {channel.avatarURL ? (
        <Image
          src={channel.avatarURL}
          alt={`Avatar for ${channel.name}`}
          className="mx-2 aspect-square h-9 rounded-full object-cover"
          width={36}
          height={36}
        />
      ) : (
        <div className="mx-2 flex aspect-square h-9 w-9 flex-row items-center justify-center rounded-full bg-red-500">
          <BsPeopleFill className="text-lg text-white" />
        </div>
      )}
      <div className="flex h-full min-w-0 grow flex-col justify-center gap-0.5">
        <div className="flex flex-row justify-between gap-1">
          <p className="overflow-y-visible text-ellipsis whitespace-nowrap font-semibold leading-tight text-neutral-600 overflow-x-hidden">
            {channel.name}
          </p>
          {hasFirstMessage ? (
            <p
              className="whitespace-nowrap text-xs leading-none text-neutral-500"
              suppressHydrationWarning
            >
              {dayjs(channel.messages[0].createdAt).fromNow()}
            </p>
          ) : null}
        </div>
        <div className="flex flex-row items-center gap-1.5">
          <div className="flex aspect-square h-full flex-col justify-center fill-gray-500">
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
          <p
            className={clsx(
              'overflow-y-visible text-ellipsis whitespace-nowrap text-xs text-gray-500 overflow-x-hidden',
              {
                'pr-1 italic': !hasFirstMessage,
              }
            )}
          >
            {hasFirstMessage
              ? channel.messages[0].content
              : `No messages on ${capitalizeFirstLetter(
                  channel.platform.toLocaleLowerCase()
                )}`}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MessageButton;
