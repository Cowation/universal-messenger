// @ts-nocheck

import { RemoteAuthClient } from 'discord-remote-auth';
import * as fs from 'fs';
import * as https from 'https';

const client = new RemoteAuthClient();

client.on('pendingRemoteInit', (fingerprint) => {
  const qrCodeStream = fs.createWriteStream('code.png');
  const data = `https://discordapp.com/ra/${fingerprint}`;
  https.get(
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${data}`,
    (res) => {
      res.pipe(qrCodeStream);
    }
  );
  qrCodeStream.once('close', () => {
    console.log('Scan ./code.png');
  });
});
client.on('pendingFinish', (user) => {
  fs.unlinkSync('code.png');
  console.log('Incoming User:', user);
});
client.on('finish', (token) => {
  console.log('Token:', token);
});
client.on('close', () => {
  if (fs.existsSync('code.png')) fs.unlinkSync('code.png');
});

client.connect();
