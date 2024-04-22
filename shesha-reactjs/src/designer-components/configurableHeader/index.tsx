import React from 'react';
import { ComponentsContainer, ICommonContainerProps, IContainerComponentProps, IToolboxComponent, getLayoutStyle, validateConfigurableComponentSettings } from '@/index';
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
       
        const { styles } = useStyles();
        const { formData } = model;

        if(model.hidden){
            return null;
        }
        
        const headerProps: ICommonContainerProps = {
            display: model?.display,
            flexDirection: model?.flexDirection,
            direction: model?.direction,
            justifyContent: model?.justifyContent,
            alignItems: model?.alignItems,
            alignSelf: model?.alignSelf,
            justifyItems: model?.justifyItems,
            textJustify: model?.textJustify,
            justifySelf: model?.justifySelf,
            noDefaultStyling: model?.noDefaultStyling,
            gridColumnsCount: model?.gridColumnsCount,
            flexWrap: model?.flexWrap,
            gap: model?.gap,
        };

        return (
            <ParentProvider model={model}>
                <ComponentsContainer
                    containerId={model?.id}
                    className={styles.shaLayoutHeading}
                    wrapperStyle={getLayoutStyle({ ...model, style: model?.wrapperStyle }, { data: formData, globalState })}
                    dynamicComponents={model?.isDynamic ? model?.components : []}
                    {...headerProps}                    />
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
};

export default HeaderConfig;