import { createStyles } from '@/styles';

export const useStyles = createStyles(({ css, cx, token, responsive }) => {
  const trigger = cx('sha-action-trigger', css`
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    text-align: left;
    padding: 8px 10px;
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadius}px;
    cursor: pointer;
    transition: border-color 0.2s, background-color 0.2s;

    &:hover:not(.disabled) {
      border-color: ${token.colorPrimaryBorderHover};
      background: ${token.colorPrimaryBg};
    }

    &:focus-visible {
      outline: 2px solid ${token.colorPrimaryBorder};
      outline-offset: 1px;
    }

    &.empty {
      border-style: dashed;
      color: ${token.colorTextTertiary};
    }

    &.disabled {
      cursor: default;
      background: ${token.colorBgContainerDisabled};
    }
  `);

  const fieldLabel = cx(css`
    display: block;
    margin-bottom: 4px;
  `);

  const triggerIcon = cx(css`
    color: ${token.colorPrimary};
    font-size: 14px;
    line-height: 20px;
    flex: none;
  `);

  const triggerBody = cx(css`
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  `);

  const triggerTitle = cx(css`
    font-size: 13px;
    font-weight: 500;
    color: ${token.colorText};
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .owner {
      color: ${token.colorTextTertiary};
      font-weight: 400;
    }
  `);

  const triggerDescription = cx(css`
    font-size: 12px;
    color: ${token.colorTextSecondary};
    line-height: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  `);

  const triggerBadges = cx(css`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 4px;

    .ant-tag {
      margin: 0;
      font-size: 11px;
      line-height: 16px;
      padding: 0 5px;
    }
  `);

  const triggerActions = cx(css`
    flex: none;
    display: flex;
    align-items: center;
    gap: 2px;
    color: ${token.colorTextTertiary};
  `);

  /* ---------------- tray ---------------- */

  const tray = cx('sha-action-tray', css`
    .ant-drawer-body {
      padding: 0;
      overflow: hidden;
    }
  `);

  const trayFooter = cx(css`
    display: flex;
    justify-content: flex-end;
  `);

  const trayLayout = cx(css`
    display: flex;
    height: 100%;
    min-height: 0;

    ${responsive.mobile} {
      flex-direction: column;
    }
  `);

  const catalogue = cx(css`
    flex: 0 0 280px;
    display: flex;
    flex-direction: column;
    min-height: 0;
    border-right: 1px solid ${token.colorBorderSecondary};
    background: ${token.colorFillQuaternary};

    ${responsive.mobile} {
      flex: 0 0 auto;
      max-height: 40%;
      border-right: none;
      border-bottom: 1px solid ${token.colorBorderSecondary};
    }
  `);

  const catalogueSearch = cx(css`
    padding: 12px;
    border-bottom: 1px solid ${token.colorBorderSecondary};
    flex: none;
  `);

  const catalogueList = cx(css`
    flex: 1 1 auto;
    overflow-y: auto;
    padding-bottom: 12px;
  `);

  const catalogueGroup = cx(css`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    padding: 10px 12px 4px;
    position: sticky;
    top: 0;
    background: ${token.colorFillQuaternary};
    z-index: 1;

    .name {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: ${token.colorTextTertiary};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .count {
      font-size: 11px;
      color: ${token.colorTextQuaternary};
      flex: none;
    }
  `);

  const catalogueItem = cx(css`
    display: block;
    width: 100%;
    text-align: left;
    padding: 6px 12px;
    border-left: 2px solid transparent;
    cursor: pointer;
    background: none;
    border-top: none;
    border-right: none;
    border-bottom: none;

    &:hover {
      background: ${token.colorFillTertiary};
    }

    &:focus-visible {
      outline: 2px solid ${token.colorPrimaryBorder};
      outline-offset: -2px;
    }

    &.selected {
      background: ${token.colorPrimaryBg};
      border-left-color: ${token.colorPrimary};
    }

    .label {
      font-size: 13px;
      color: ${token.colorText};
      line-height: 18px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    &.selected .label {
      font-weight: 500;
      color: ${token.colorPrimaryText};
    }

    .description {
      font-size: 11.5px;
      color: ${token.colorTextTertiary};
      line-height: 16px;
      margin-top: 1px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `);

  const catalogueEmpty = cx(css`
    padding: 24px 12px;
    text-align: center;
    color: ${token.colorTextTertiary};
    font-size: 12px;
  `);

  /* ---------------- detail pane ---------------- */

  const detail = cx(css`
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    padding: 20px 24px 32px;
  `);

  const detailHeader = cx(css`
    margin-bottom: 20px;

    .owner {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: ${token.colorTextTertiary};
    }

    .name {
      font-size: 19px;
      font-weight: 600;
      color: ${token.colorText};
      line-height: 1.3;
      margin: 2px 0 0;
    }

    .description {
      font-size: 13px;
      color: ${token.colorTextSecondary};
      margin-top: 6px;
      max-width: 70ch;
    }
  `);

  const section = cx(css`
    border-top: 1px solid ${token.colorBorderSecondary};
    padding-top: 16px;
    margin-top: 20px;
  `);

  const sectionTitle = cx(css`
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${token.colorTextSecondary};
    margin-bottom: 12px;
  `);

  const sectionHint = cx(css`
    font-size: 12.5px;
    color: ${token.colorTextTertiary};
    margin: -6px 0 12px;
    max-width: 70ch;
  `);

  const handler = cx(css`
    padding: 12px 0 0;

    & + & {
      margin-top: 8px;
      border-top: 1px dashed ${token.colorBorderSecondary};
    }
  `);

  const handlerBody = cx(css`
    margin-top: 10px;
    padding-left: 12px;
    border-left: 2px solid ${token.colorBorderSecondary};
  `);

  const emptyDetail = cx(css`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: ${token.colorTextTertiary};
    text-align: center;
    padding: 40px 24px;

    .icon {
      font-size: 30px;
      color: ${token.colorTextQuaternary};
    }

    .title {
      font-size: 14px;
      color: ${token.colorTextSecondary};
    }
  `);

  return {
    fieldLabel,
    trigger,
    triggerIcon,
    triggerBody,
    triggerTitle,
    triggerDescription,
    triggerBadges,
    triggerActions,
    tray,
    trayFooter,
    trayLayout,
    catalogue,
    catalogueSearch,
    catalogueList,
    catalogueGroup,
    catalogueItem,
    catalogueEmpty,
    detail,
    detailHeader,
    section,
    sectionTitle,
    sectionHint,
    handler,
    handlerBody,
    emptyDetail,
  };
});
