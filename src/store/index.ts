import { defineStore } from 'pinia';
import { State } from './type';

const mainStore = defineStore('main', {
  state: () =>
    ({
      userId: null,
      userName: '',
      userAvatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
      token: '',
      ws: null,
    } as State),
  actions: {
    setUserInfo(userId: string, userName: string) {
      this.userId = userId;
      this.userName = userName;
      this.userAvatar = `https://r.hrc.woa.com/photo/500/${userName}.png`;
    },
  },
});

export { mainStore };
