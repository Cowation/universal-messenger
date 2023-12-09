import cors from 'cors';
import express from 'express';
import { router } from 'express-file-routing';
import discordClient from './bridges/discord';
import instagramClient from './bridges/instagram';

// EXPRESS
const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router());

app.listen(process.env.PORT ?? 3001, () => {
  console.log(`Server started on port ${process.env.PORT ?? 3001}`);
});

// DISCORD
discordClient.on('ready', () => {
  if (!discordClient.user) throw new Error('Discord client is not logged in');

  console.log(`Logged in on Discord as ${discordClient.user.tag}!`);

  discordClient.user.setPresence({
    status: 'online',
  });
});

// INSTAGRAM
instagramClient.on('connect', () => {
  console.log(`Logged in as ${instagramClient.user!.username}!`);
});
