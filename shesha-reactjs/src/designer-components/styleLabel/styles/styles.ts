import { createStyles } from '@/styles';


export const useStyles = createStyles(({ css, cx, token }) => {

  const flexWrapper = cx("", css`
        display: flex;
        flex-direction: row;
        gap: 8px;
        position: absolute;
        right: 0px;
        top: -2px;
    `);

  const hidelLabelIcon = cx("", css`
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    color: ${token.colorPrimary};
    border: 1px solid ${token.colorPrimary};
    `);

  return {
    flexWrapper,
    hidelLabelIcon
  };
});