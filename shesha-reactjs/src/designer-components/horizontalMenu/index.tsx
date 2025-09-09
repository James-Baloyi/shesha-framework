import LayoutMenu from "@/components/menu";
import { ILayoutColor } from "@/components/menu/model";
import { filterObjFromKeys } from "@/utils";
import { EditOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  ConfigurableComponentRenderer,
  getStyle,
  IConfigurableFormComponent,
  ISidebarMenuItem,
  IToolboxComponent,
  migratePrevStyles,
  useFormData,
  useMainMenu,
  validateConfigurableComponentSettings,
} from '@/index';
import { useMemo, useEffect, useState } from 'react';
import { IBackgroundValue } from '../_settings/utils/background/interfaces';
import { getBackgroundStyle, getBackgroundImageUrl } from '../_settings/utils/background/utils';
import { useSheshaApplication } from '@/providers';
import { IConfigurableComponentContext } from '@/providers/configurableComponent/contexts';
import { ItemType } from "antd/es/menu/interface";
import React from "react";
import Editor from "./modal";
import { getSettings } from "./settings";
import { defaultStyles } from "./utils";

interface IMenuListProps extends IConfigurableFormComponent, ILayoutColor {
  items?: ItemType[];
  overflow?: "dropdown" | "menu" | "scroll";
  fontSize?: string;
  gap?: string;
  height?: string;
  styleOnHover?: string;
  styleOnSelected?: string;
  styleOnSubMenu?: string;
  width?: string;
  dimensions?: {
    width?: string;
    height?: string;
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
  };
  font?: {
    type?: string;
    size?: number;
    weight?: string;
    color?: string;
    align?: string;
  };
  background?: IBackgroundValue;
}

interface ISideBarMenuProps {
  items: ISidebarMenuItem[];
}

export const MenuListComponent: IToolboxComponent<IMenuListProps> = {
  type: "menuList",
  name: "Menu List",
  isInput: false,
  isOutput: false,
  icon: <MenuUnfoldOutlined />,
  Factory: ({ model }) => {
    const { data } = useFormData();
    const { loadedMenu, changeMainMenu, saveMainMenu } = useMainMenu();
    const { backendUrl, httpHeaders } = useSheshaApplication();
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>('');

    // Handle stored file background images
    useEffect(() => {
      if (model.background?.type === 'storedFile' && model.background?.storedFile?.id) {
        getBackgroundImageUrl(model.background, backendUrl, httpHeaders)
          .then(url => setBackgroundImageUrl(url))
          .catch(() => setBackgroundImageUrl(''));
      } else {
        setBackgroundImageUrl('');
      }
    }, [model.background, backendUrl, httpHeaders]);

    const context: IConfigurableComponentContext<ISideBarMenuProps> = {
      settings: loadedMenu,
      load: () => {/**/ },
      save: (settings: ISideBarMenuProps) =>
        saveMainMenu({ ...loadedMenu, ...settings }).then(() => {
          changeMainMenu({ ...loadedMenu, ...settings });
        }),
      setIsInProgressFlag: () => {/**/ },
      setSucceededFlag: () => {/**/ },
      setFailedFlag: () => {/**/ },
      setActionedFlag: () => {/**/ },
      resetIsInProgressFlag: () => {/**/ },
      resetSucceededFlag: () => {/**/ },
      resetFailedFlag: () => {/**/ },
      resetActionedFlag: () => {/**/ },
      resetAllFlag: () => {/**/ },
    };

    const fontSize = model?.font?.size || model?.fontSize || "14";
    const gap = model?.gap || "12";
    const height = model?.height || "6";
    const width = model?.dimensions?.width || model?.width || "500px";

    const colors: ILayoutColor = {
      selectedItemColor: model.selectedItemColor,
      selectedItemBackground: model.selectedItemBackground,
      itemColor: model.itemColor,
      itemBackground: model.itemBackground,
      hoverItemColor: model.hoverItemColor,
      hoverItemBackground: model.hoverItemBackground,
      ...(model.itemColor ? {} : { itemColor: model.font?.color }),
      ...(model.itemBackground ? {} : { itemBackground: model.background?.color }),
    };

    const wrapperBackgroundStyles = useMemo(() => {
      const backgroundStyles = model.background 
        ? getBackgroundStyle(model.background, {}, backgroundImageUrl) 
        : {};
      
      return {
        ...model.allStyles?.backgroundStyles,
        ...backgroundStyles,
      };
    }, [model.allStyles?.backgroundStyles, model.background, backgroundImageUrl]);

    const finalStyle = useMemo(() => {
      return {
        ...model.allStyles?.fullStyle,
        ...(model.style ? getStyle(model.style, data) : {}),
        background: undefined,
        backgroundColor: undefined,
        backgroundImage: undefined,
        backgroundSize: undefined,
        backgroundPosition: undefined,
        backgroundRepeat: undefined,
      };
    }, [model.allStyles, model.style, data]);

    const finalFontStyles = useMemo(() => {
      return {
        fontSize: model?.font?.size ? `${model.font.size}px` : `${fontSize}px`,
        fontFamily: model?.font?.type,
        fontWeight: model?.font?.weight as any,
        color: model?.font?.color,
        textAlign: model?.font?.align as any,
      };
    }, [model.font, fontSize]);

    if (model.hidden) return null;

    return (
      <ConfigurableComponentRenderer
        canConfigure={true}
        contextAccessor={() => context}
        settingsEditor={{ render: Editor }}
      >
        {(componentState, BlockOverlay) => {
          return (
            <div 
              className={`sidebar ${componentState.wrapperClassName}`}
              style={wrapperBackgroundStyles as React.CSSProperties}
            >
              <BlockOverlay>
                <EditOutlined className="sha-configurable-sidemenu-button-wrapper" />
              </BlockOverlay>
              <LayoutMenu
                colors={colors}
                fontSize={typeof fontSize === 'string' ? fontSize : String(fontSize)}
                padding={{ x: gap, y: height }}
                style={{
                  ...finalStyle,
                  ...finalFontStyles,
                  width: width,
                } as React.CSSProperties}
                styleOnHover={getStyle(model?.styleOnHover, data)}
                styleOnSelected={getStyle(model?.styleOnSelected, data)}
                styleOnSubMenu={getStyle(model?.styleOnSubMenu, data)}
                overflow={model.overflow}
                width={width}
                fontStyles={finalFontStyles as React.CSSProperties}
                menuId={`horizontal-menu-${model.id}`}
              />
            </div>
          );
        }}
      </ConfigurableComponentRenderer>
    );
  },
  settingsFormMarkup: (data) => getSettings(data),
  validateSettings: (model) => validateConfigurableComponentSettings(getSettings(model), model),
    migrator: (m) => m
      .add<IMenuListProps>(0, (prev) => ({ ...migratePrevStyles(prev, defaultStyles()) })),
};

export default MenuListComponent;
