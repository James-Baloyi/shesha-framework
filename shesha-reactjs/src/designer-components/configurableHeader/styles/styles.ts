import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, cx }) => {
  const shaGlobalHeader = cx(
    'sha-global-header',
    css `
    float: left;
    position: relative;
    `
  );
  return {
    shaGlobalHeader,
  };
});
