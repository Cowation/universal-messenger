import Pusher, { Response, TriggerParams } from 'pusher';

type ChannelOption = 'channel' | 'message' | 'reaction';
type EventOption = 'created' | 'updated' | 'deleted';

class MessagePusher extends Pusher {
  trigger(
    channel: ChannelOption | ChannelOption[],
    event: EventOption,
    data: any,
    params?: TriggerParams | undefined
  ): Promise<Response> {
    return super.trigger(channel, event, data, params);
  }
}

if (!process.env.PUSHER_APP_ID) {
  throw new Error('PUSHER_APP_ID is not defined');
}
if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
  throw new Error('PUSHER_KEY is not defined');
}
if (!process.env.PUSHER_SECRET) {
  throw new Error('PUSHER_SECRET is not defined');
}
if (!process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
  throw new Error('PUSHER_CLUSTER is not defined');
}

const pusher = new MessagePusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

export { pusher };
