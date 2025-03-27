import { ConfigurableFormItem } from '@/components';
import KanbanReactComponent from '@/components/kanban';
import { IKanbanProps } from '@/components/kanban/model';
import {
  getStyle,
  IToolboxComponent,
  useDataTableStore,
  useSheshaApplication,
  validateConfigurableComponentSettings
} from '@/index';
import { RefListItemGroupConfiguratorProvider } from '@/providers/refList/provider';
import { removeUndefinedProps } from '@/utils/object';
import { FormOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import { getBackgroundImageUrl, getBackgroundStyle } from '../_settings/utils/background/utils';
import { getBorderStyle } from '../_settings/utils/border/utils';
import { getShadowStyle } from '../_settings/utils/shadow/utils';
import { getSettings } from './settingsForm';
import { migratePrevStyles } from '../_common-migrations/migrateStyles';
import { defaultStyles } from './utils';

const KanbanComponent: IToolboxComponent<IKanbanProps> = {
  type: 'kanban',
  isInput: false,
  name: 'Kanban',
  icon: <FormOutlined />,

  Factory: ({ model }) => {
    const store = useDataTableStore(false);
    const { httpHeaders, backendUrl } = useSheshaApplication();
    const data = model;
    const shadow = model?.shadow;
    const columnShadow = model?.columnShadow;
    const border = model?.border;
    const columnBorder = model?.columnBorder?.border;
    const background = model?.background;
    const columnBackground = model?.columnBackground;
    const headerStyle = getStyle(model?.headerStyles as string, data);
    const columnStyle = getStyle(model?.columnStyle as string, data);
    const borderStyles = useMemo(() => getBorderStyle(border, headerStyle), [border, headerStyle]);
    const columnBorderStyles = useMemo(() => getBorderStyle(columnBorder, columnStyle), [columnBorder, columnStyle]);
    const shadowStyles = useMemo(() => getShadowStyle(shadow), [shadow]);
    const columnShadowStyles = useMemo(() => getShadowStyle(columnShadow), [columnShadow]);

    const [backgroundStyles, setBackgroundStyles] = useState({});
    const [columnBackgroundStyle, setColumnBackgroundStyle] = useState({});

    useEffect(() => {
      const fetchStyles = async () => {
        const url = await getBackgroundImageUrl(background, backendUrl, httpHeaders);
        const style =  getBackgroundStyle(background, headerStyle, url);
    
        setBackgroundStyles((prev) => (JSON.stringify(prev) !== JSON.stringify(style) ? style : prev));
      };
      fetchStyles();
    }, [background, backendUrl, httpHeaders]);
    

    useEffect(() => {
      const fetchStyles = async () => {
        const url = await getBackgroundImageUrl(columnBackground, backendUrl, httpHeaders);
        const style = getBackgroundStyle(columnBackground, columnStyle, url);
    
        setColumnBackgroundStyle((prev) => (JSON.stringify(prev) !== JSON.stringify(style) ? style : prev));
      };
      fetchStyles();
    }, [columnBackground, backendUrl, httpHeaders]);
    

    const additionalColumnStyles: CSSProperties = removeUndefinedProps({
      ...columnBorderStyles,
      ...columnBackgroundStyle,
      ...columnShadowStyles,
      ...columnStyle,
    });

    const additionalHeaderStyles: CSSProperties = removeUndefinedProps({
      ...borderStyles,
      ...backgroundStyles,
      ...shadowStyles,
      ...headerStyle,
    });

    return (
      <div>
        <ConfigurableFormItem model={model}>
          {(value) => {
            return store ? (
              <RefListItemGroupConfiguratorProvider
                value={value}
                items={model.items}
                referenceList={model.referenceList}
                readOnly={model.readOnly}
              >
                <KanbanReactComponent
                  {...model}
                  headerStyles={additionalHeaderStyles}
                  columnStyle={additionalColumnStyles}
                />
              </RefListItemGroupConfiguratorProvider>
            ) : (
              <Alert
                className="sha-designer-warning"
                message="Kanban must be used within a Data Table Context"
                type="warning"
              />
            );
          }}
        </ConfigurableFormItem>
      </div>
    );
  },
  initModel: (model) => ({
    ...model,
    hideLabel: true,
  }),
  //  migrator: (m) => m
  //  .add<IKanbanProps>(6, (prev) => ({ ...migratePrevStyles(prev, defaultStyles()) })),
  settingsFormMarkup: (data) => getSettings(data),
  validateSettings: (model) => validateConfigurableComponentSettings(getSettings(model), model),
};

export default KanbanComponent;
