// Import your Client Component
import FilterButton from '@/app/filterButton';
import MessageButton from '@/app/messageButton';
import SearchBar from '@/app/searchBar';
import {
  DiscordIcon,
  IMessageIcon,
  InstagramIcon,
  TwitterIcon,
  WhatsAppIcon,
} from '@/components/social-icons';
import Image from 'next/image';
import Link from 'next/link';
import { getChannels } from './getChannels';

export default async function SideBar() {
  const channels = await getChannels();

  return (
    <div className="flex h-full w-80 flex-col bg-gray-100">
      <div className="flex flex-col gap-3 p-3">
        <Link href="/" className="flex flex-row items-center gap-2">
          <Image
            src="/drnefardio.png"
            alt="Personal avatar"
            className="h-7 w-7 rounded-md"
            width={28}
            height={28}
          />
          <p className="font-semibold text-neutral-600">DobtorPebbler</p>
        </Link>
        <SearchBar />
        <div className="flex w-full flex-row gap-2">
          <FilterButton bgClassName="bg-instagram" icon={<InstagramIcon />} />
          <FilterButton bgClassName="bg-discord" icon={<DiscordIcon />} />
          <FilterButton bgClassName="bg-whatsapp" icon={<WhatsAppIcon />} />
          <FilterButton bgClassName="bg-twitter" icon={<TwitterIcon />} />
          <FilterButton
            bgClassName="bg-gradient-to-b from-[#5BF675] bg-[#0CBD2A]"
            icon={<IMessageIcon />}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 overflow-y-scroll pl-2 pr-4 scrollbar-thin scrollbar-thumb-gray-200">
        {channels.map((channel) => (
          <MessageButton key={channel.id} channel={channel} selected={false} />
        ))}
      </div>
    </div>
  );
}
