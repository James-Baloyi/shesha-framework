import React from 'react';
import { ComponentsContainer, IContainerComponentProps, IToolboxComponent, getLayoutStyle, validateConfigurableComponentSettings } from '@/index';
import { CheckSquareOutlined } from '@ant-design/icons';
import ParentProvider from '@/providers/parentProvider';
import globalState from '@/providers/globalState';
import { useStyles } from './styles/header-styles';
import { migratePropertyName, migrateCustomFunctions } from '../_common-migrations/migrateSettings';
import { migrateVisibility } from '../_common-migrations/migrateVisibility';
import { getSettings } from './settings';

const HeaderConfig: IToolboxComponent = {
    type: 'layout',
    canBeJsSetting: false,
    name: 'Configurable Header',
    icon: <CheckSquareOutlined />,
    Factory: ({ model }) => {     
        
        if(model.hidden){
            return null;
        }
        
        const { styles } = useStyles();
        const { formData } = model;
        const headerProps = {
            containerId: model?.id,
            direction: model?.direction,
            display: model?.display,
            flexDirection: model?.flexDirection,
            alignSelf: model?.alignSelf,
            justifyContent: model?.justifyContent,
        }

        return (
            <ParentProvider model={model}>
                <ComponentsContainer
                    className={styles.shaLayoutHeading}
                    wrapperStyle={getLayoutStyle({ ...model, style: model?.wrapperStyle }, { data: formData, globalState })}
                    dynamicComponents={model?.isDynamic ? model?.components : []}
                    {...headerProps}
                    //move below to layout class in styles file
                    style={{ backgroundColor: '#ffffff', padding: '10px', borderBottom: '1px lightgrey solid'}} />
            </ParentProvider>
        );
    },
  settingsFormMarkup: (data) => getSettings(data),
  validateSettings: (model) => validateConfigurableComponentSettings(getSettings(model), model),
  migrator: (m) =>
    m
      .add<IContainerComponentProps>(0, (prev) => ({
        ...prev,
        direction: prev['direction'] ?? 'vertical',
        justifyContent: prev['justifyContent'] ?? 'left',
        display: prev['display'],
        flexWrap: prev['flexWrap'] ?? 'wrap',
        components: prev['components'] ?? [],
      }))
      .add<IContainerComponentProps>(1, (prev) => migratePropertyName(migrateCustomFunctions(prev)))
      .add<IContainerComponentProps>(2, (prev) => migrateVisibility(prev)),
}

export default HeaderConfig;