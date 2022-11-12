import { defineStore } from 'pinia';
import { State } from './type';

const mainStore = defineStore('main', {
  state: () =>
    ({
      userId: null,
      userName: '',
      userAvatar: 'https://xsgames.co/randomusers/avatar.php?g=male',
      token: '',
      ws: null,
      roomId: '',
    } as State),
});

export { mainStore };
