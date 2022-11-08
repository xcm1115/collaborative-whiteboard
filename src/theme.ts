import { useMutationObserver } from '@vueuse/core';
import { GlobalThemeOverrides } from 'naive-ui';

// 修复 Naive UI 和 Tailwind 样式优先级引起的样式错误问题
useMutationObserver(
  document.head,
  () => {
    const naiveStyles = Array.from(document.head.querySelectorAll('style[cssr-id]'));

    if (
      naiveStyles.find((style) =>
        style.nextElementSibling ? !style.nextElementSibling.hasAttribute('cssr-id') : false
      )
    ) {
      naiveStyles.forEach((style) => {
        document.head.appendChild(style);
      });
    }
  },
  {
    childList: true,
  }
);

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#3d69cf',
    primaryColorHover: '#6A92E2',
    primaryColorPressed: '#3d69cf',
    // borderRadius: '8px',
  },
};

export default themeOverrides;
