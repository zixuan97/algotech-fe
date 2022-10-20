import Pusher from 'pusher-js';
import { SalesOrder } from 'src/models/types';

interface PusherData {
  data: string;
}

const pusher = new Pusher('33f7d7f44d38ff91c104', {
  cluster: 'ap1'
});

const subscribeToPusher = <T>(event: string, callback: (value: T) => void) => {
  const pusherChannel = pusher.subscribe('algotech-pusher');
  pusherChannel.bind(event, (pusherData: PusherData) =>
    callback(JSON.parse(pusherData.data) as T)
  );
};

export const unsubscribeToPusher = () => {
  pusher.unsubscribe('algotech-pusher');
};

export const subscribeToShopify = (
  callback: (salesOrder: SalesOrder) => void
) => subscribeToPusher<SalesOrder>('shopify-webhook', callback);
