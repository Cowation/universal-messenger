import { notFound } from 'next/navigation';
import ChatArea from './chatArea';
import { getChannel } from './getChannel';

export default async function MessageBox({
  params,
}: {
  params: { id: string };
}) {
  const channel = await getChannel(params.id);

  if (!channel) {
    notFound();
  }

  return <ChatArea channel={channel} data-superjson />;
}
