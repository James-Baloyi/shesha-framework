import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, cx, token }) => {
  const shaGlobalHeader = cx(
    'sha-global-header',
    css `
    backgroundColor: ${token.colorWhite},
    borderBottom: ${token.colorBorder} solid 0.5px
    `
  );
  return {
    shaGlobalHeader,
  };
});
