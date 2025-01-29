import React, { FC } from 'react';
import { Collapse, Skeleton } from 'antd';
import { CollapseProps } from 'antd/lib/collapse';
import classNames from 'classnames';
import { IStyleType } from '@/index';
import { useStyles } from './styles/styles';

export type headerType = 'parent' | 'child' | 'default';

export interface ICollapsiblePanelProps extends CollapseProps, Omit<IStyleType, 'style'> {
  isActive?: boolean;
  header?: React.ReactNode;
  className?: string;
  extraClassName?: string;
  showArrow?: boolean;
  forceRender?: boolean;
  extra?: React.ReactNode;
  noContentPadding?: boolean;
  loading?: boolean;
  collapsedByDefault?: boolean;
  headerColor?: string;
  bodyColor?: string;
  isSimpleDesign?: boolean;
  hideCollapseContent?: boolean;
  hideWhenEmpty?: boolean;
  parentPanel?: boolean;
  primaryColor?: string;
  dynamicBorderRadius?: number;
  panelHeadType?: headerType;
  headerStyles?: IStyleType;
  bodyStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
}

/**
 * There was an error 
 * TS4023: Exported variable 'xxx' has or is using name 'zzz' from external module "yyy" but cannot be named.
 * 
 * found a solution
 * https://stackoverflow.com/questions/43900035/ts4023-exported-variable-x-has-or-is-using-name-y-from-external-module-but
 * 
 */

export const CollapsiblePanel: FC<Omit<ICollapsiblePanelProps, 'radiusLeft' | 'radiusRight'>> = ({
  expandIconPosition = 'end',
  onChange,
  header,
  extra,
  children,
  loading,
  className,
  extraClassName,
  collapsedByDefault = false,
  showArrow,
  collapsible,
  ghost,
  bodyStyle = { borderRadius: '8px 8px 8px 8px', },
  headerStyle = {
    borderRadius: '8px 8px 8px 8px'
  },
  panelHeadType,
  noContentPadding,
  hideWhenEmpty,
  hideCollapseContent
}) => {
  // Prevent the CollapsiblePanel from collapsing every time you click anywhere on the extra and header
  const onContainerClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => event?.stopPropagation();
  headerStyle.borderBottom = !headerStyle.borderBottom && ghost ? '2px solid var(--primary-color)' : bodyStyle.borderBottom;
  headerStyle.fontWeight = headerStyle.fontWeight || 500;

  const { styles } = useStyles({ bodyStyle, headerStyles: headerStyle, panelHeadType, ghost, noContentPadding, hideWhenEmpty, hideCollapseContent });

  return (
    <Collapse
      defaultActiveKey={collapsedByDefault ? [] : ['1']}
      onChange={onChange}
      expandIconPosition={expandIconPosition}
      className={classNames(styles.shaCollapsiblePanel, { [styles.hideWhenEmpty]: hideWhenEmpty }, className)}
      ghost={ghost}
      items={[
        {
          key: "1",
          collapsible: collapsible,
          showArrow: showArrow,
          label: header || ' ',
          extra: (
            <span onClick={onContainerClick} className={extraClassName}>
              {extra}
            </span>
          ),
          children: <Skeleton loading={loading}>{children}</Skeleton>,
        }
      ]}
    />
  );
};

export default CollapsiblePanel;