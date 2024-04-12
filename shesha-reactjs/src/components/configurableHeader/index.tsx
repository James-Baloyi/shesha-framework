import React from 'react';
import { ComponentsContainer } from '..';
import { ConfigurableComponent, CustomErrorBoundary, IConfigurableFormComponent } from '@/index';
// import ParentProvider from '@/providers/parentProvider';
// import { FormProvider } from '@/index';
// import { useFormDesigner } from '@/providers/formDesigner';


export interface IConfigurableHeaderProps {
    style?: string,
    containerId: string,
    isDynamic: boolean,
    components: IConfigurableFormComponent[],
}

const ConfigurableHeader:React.FC = ({containerId, isDynamic, components }:IConfigurableHeaderProps) => {
    return( 
        <ConfigurableComponent>
        {(componentState, BlockOverlay) => (
            <CustomErrorBoundary>
                <BlockOverlay>
                    <ComponentsContainer
                        className={componentState.wrapperClassName}
                        containerId={containerId}
                        dynamicComponents={isDynamic ? components : []}
                        direction='horizontal'
                        display='flex'
                        flexDirection='row'
                        alignSelf='center'
                        justifyContent={components?.length > 2 ? 'space-evenly' : 'space-between'}
                        style={{ backgroundColor: '#ffffff', padding: '10px', }}
                />
            </BlockOverlay>
            </CustomErrorBoundary>

        )}
        </ConfigurableComponent>
                   

    );

}

export default ConfigurableHeader;