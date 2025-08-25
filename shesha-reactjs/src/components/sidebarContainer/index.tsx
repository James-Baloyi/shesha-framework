import React, { FC, PropsWithChildren, ReactNode, useEffect, useState, useMemo, useRef, useCallback } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import { ISidebarProps, SidebarPanelPosition } from './models';
import { SidebarPanel } from './sidebarPanel';
import { useStyles } from './styles/styles';
import { SizableColumns } from '../sizableColumns';
import { getPanelSizes } from './utilis';
import { Button, Checkbox, Space, Tooltip } from 'antd';
import { ExpandOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useCanvas } from '@/index';
import { calculateAutoZoom } from './canvasUtils';

export interface ISidebarContainerProps extends PropsWithChildren<any> {
  leftSidebarProps?: ISidebarProps;
  rightSidebarProps?: ISidebarProps;
  header?: ReactNode | (() => ReactNode);
  sideBarWidth?: number;
  allowFullCollapse?: boolean;
  minZoom?: number;
  maxZoom?: number;
}

const usePinchZoom = (
  onZoomChange: (zoom: number) => void,
  currentZoom: number,
  minZoom: number = 10,
  maxZoom: number = 200,
  isAutoWidth: boolean = false
) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const lastDistance = useRef<number>(0);
  const initialZoom = useRef<number>(currentZoom);

  const getDistance = useCallback((touches: TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isAutoWidth || e.touches.length !== 2) return;
    
    e.preventDefault();
    lastDistance.current = getDistance(e.touches);
    initialZoom.current = currentZoom;
  }, [getDistance, currentZoom, isAutoWidth]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isAutoWidth || e.touches.length !== 2) return;

    e.preventDefault();
    const currentDistance = getDistance(e.touches);
    
    if (lastDistance.current > 0) {
      const scale = currentDistance / lastDistance.current;
      const newZoom = Math.max(minZoom, Math.min(maxZoom, initialZoom.current * scale));
      onZoomChange(Math.round(newZoom));
    }
  }, [getDistance, onZoomChange, minZoom, maxZoom, isAutoWidth]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (isAutoWidth || !e.ctrlKey) return;

    e.preventDefault();
    const delta = e.deltaY > 0 ? -5 : 5;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom + delta));
    onZoomChange(newZoom);
  }, [onZoomChange, currentZoom, minZoom, maxZoom, isAutoWidth]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length < 2) {
      lastDistance.current = 0;
    }
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleWheel]);

  return elementRef;
};

export const SidebarContainer: FC<ISidebarContainerProps> = ({
  leftSidebarProps,
  rightSidebarProps,
  header,
  children,
  allowFullCollapse = false,
  noPadding,
  minZoom = 10,
  maxZoom = 200,
}) => {
  const { styles } = useStyles();
  const [isOpenLeft, setIsOpenLeft] = useState(false);
  const [isOpenRight, setIsOpenRight] = useState(false);
  const [autoWidth, setAutoWidth] = useState(true);
  const { zoom, setCanvasZoom, setCanvasWidth, designerDevice, designerWidth } = useCanvas();

  const [currentSizes, setCurrentSizes] = useState([]);

  const handleZoomChange = useCallback((newZoom: number) => {
    setCanvasZoom(newZoom);
  }, [setCanvasZoom]);

  const pinchZoomRef = usePinchZoom(
    handleZoomChange,
    zoom,
    minZoom,
    maxZoom,
    autoWidth
  );

  useEffect(() => {
    const newSizes = getPanelSizes(isOpenLeft, isOpenRight, leftSidebarProps, rightSidebarProps, allowFullCollapse);
    setCurrentSizes(newSizes.sizes);
    setCanvasWidth(`calc(100vw)`, designerDevice);
    setCanvasZoom(autoWidth ? calculateAutoZoom({
      isOpenLeft,
      isOpenRight, 
      leftSidebarProps,
      rightSidebarProps, 
      allowFullCollapse, 
      currentZoom: zoom, 
      options: {
        noPanelsOpenZoom: 100,
        onePanelOpenZoom: 84,
        bothPanelsOpenZoom: 65,
      }
    }) : zoom);
  }, [isOpenRight, isOpenLeft, autoWidth]);

  const sizes = useMemo(() => getPanelSizes(isOpenLeft, isOpenRight, leftSidebarProps, rightSidebarProps, allowFullCollapse),
    [isOpenRight, leftSidebarProps, rightSidebarProps, allowFullCollapse, isOpenLeft]
  );

  const renderSidebar = (side: SidebarPanelPosition) => {
    const sidebarProps = side === 'left' ? leftSidebarProps : rightSidebarProps;
    const hideFullCollapse = allowFullCollapse && !sidebarProps?.open;

    return sidebarProps && !hideFullCollapse ? (
      <SidebarPanel
        {...sidebarProps}
        allowFullCollapse={allowFullCollapse}
        side={side}
        setIsOpenGlobal={side === 'left' ? setIsOpenLeft : setIsOpenRight}
      />
    ) : null;
  };
  
  return (
    <div className={styles.sidebarContainer}>
      {header && (
        <div className={styles.sidebarContainerHeader}>{typeof header === 'function' ? header() : header}</div>
      )}

      <SizableColumns
        sizes={currentSizes}
        expandToMin={false}
        minSize={sizes?.minSizes}
        maxSize={sizes?.maxSizes}
        gutterSize={8}
        gutterAlign="center"
        snapOffset={5}
        dragInterval={12}
        direction="horizontal"
        cursor="col-resize"
        onDragEnd={(sizes => setCurrentSizes(sizes))}
        className={classNames(styles.sidebarContainerBody)}
      >
        {renderSidebar('left')}

        <div
          ref={pinchZoomRef}
          className={classNames(
            styles.sidebarContainerMainArea,
            { 'both-open': leftSidebarProps?.open && rightSidebarProps?.open },
            { 'left-only-open': leftSidebarProps?.open && !rightSidebarProps?.open },
            { 'right-only-open': rightSidebarProps?.open && !leftSidebarProps?.open },
            { 'no-left-panel': !leftSidebarProps },
            { 'no-right-panel': !rightSidebarProps },
            { 'no-padding': noPadding },
            { 'allow-full-collapse': allowFullCollapse }
          )}
          style={{ 
            touchAction: autoWidth ? 'auto' : 'pan-x pan-y',
            userSelect: 'none'
          }}
        >
          <div 
            className={styles.sidebarContainerMainAreaBody} 
            style={{ 
              width: designerWidth, 
              zoom: `${zoom}%`, 
              overflow: 'auto', 
              margin: '0 auto',
              transition: autoWidth ? 'zoom 0.2s ease-out' : 'none'
            }}
          >
            {children}
          </div>
          <div>
            <Space style={{position: 'fixed', bottom: 50 }}>
              <Tooltip title={autoWidth ? `Auto (${zoom}%)` : `Manual (${zoom}%)`}>
                <Button 
                  type={autoWidth ? 'primary' : 'default'} 
                  icon={<ExpandOutlined/>} 
                  title='Auto zoom' 
                  onClick={() => setAutoWidth(!autoWidth)}
                />
              </Tooltip>
              <Tooltip title={`Zoom out (${zoom - 1}%)`}>
                <Button 
                  disabled={autoWidth || zoom <= minZoom} 
                  type='default' 
                  icon={<MinusOutlined/>} 
                  title='Zoom out' 
                  onClick={() => setCanvasZoom(zoom - 1)}
                />
              </Tooltip>
              <Tooltip title={`Zoom in (${zoom + 1}%)`}>
                <Button 
                  disabled={autoWidth || zoom >= maxZoom} 
                  type='default' 
                  icon={<PlusOutlined/>} 
                  title='Zoom in' 
                  onClick={() => setCanvasZoom(zoom + 1)}
                >
              </Button>
              </Tooltip>
            </Space>
          </div>
        </div>
        {renderSidebar('right')}
      </SizableColumns>
    </div>
  );
};