import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, cx }) => {
  const shaGlobalHeader = cx(
    'sha-global-header',
    css `

    .separator {
        border-left: 2px solid rgba(189, 189, 189, 0.37);
        margin-right: 5px;
      }
    `
  );
  return {
    shaGlobalHeader,
  };
});
