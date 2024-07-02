import ComponentPropertiesTitle from '../componentPropertiesTitle';
import ParentProvider from '@/providers/parentProvider';
import React, { FC, useMemo, useState } from 'react';
import Toolbox from '../toolbox';
import { ConfigurableFormRenderer, SidebarContainer } from '@/components';
import { DebugPanel } from '../debugPanel';
import { useCanvasConfig, useForm } from '@/providers';
import { useFormDesigner } from '@/providers/formDesigner';
import { useStyles } from '../styles/styles';
import { ComponentPropertiesPanel } from '../componentPropertiesPanel';
import './style.css';
import { useFormPersister } from '@/providers/formPersisterProvider';
import { getFormFullName } from '@/utils/form';
import { LinkOutlined } from '@ant-design/icons';
import { useAppConfigurator } from '@/providers';

export interface IDesignerMainAreaProps {

}

export const DesignerMainArea: FC<IDesignerMainAreaProps> = () => {
    const { isDebug } = useFormDesigner();
    const { form, formMode } = useForm();
    const { width, zoom } = useCanvasConfig();
    const { styles } = useStyles();
    const { formProps } = useFormPersister();
    const fullName = formProps ? getFormFullName(formProps?.module, formProps?.name) : null;
    const title = formProps?.label ? `${formProps.label}` : fullName;
    const { switchConfigurationItemMode } = useAppConfigurator();

    const magnifiedWidth = useMemo(() => width * (zoom / 100), [width, zoom]);

    const [currentIndex, setCurrentIndex] = useState(0);

    const components = [
        <div style={{ width: '310px' }} key="componentPropertiesPanel">
            <ComponentPropertiesPanel />
        </div>,
        <div style={{ width: '310px' }} key="toolbox">
            <Toolbox />
        </div>
    ];

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + components.length) % components.length);
    };

    return (
        <div className={styles.mainArea}>
            <div className="carousel-container" style={{ width: '340px', minWidth: '340px', maxWidth: '340px' }}>
                <div
                    className="carousel-inner"
                    style={{
                        display: 'flex',
                        transform: `translateX(-${currentIndex * 340}px)`,
                        transition: 'transform 0.3s ease'
                    }}
                >
                    {components}
                </div>
            </div>
            <div className="carousel-buttons">
                    <button className="carousel-button prev" onClick={goToPrevious}>
                        Toggle View
                    </button>
                </div>

                <p style={{position: "fixed", bottom: "5px", width: "340px", left:"70px", backgroundColor: "#fff", padding: "5px", borderRadius: "5px", cursor: "pointer", overflow: "hidden", whiteSpace: "wrap", textOverflow: "ellipsis"}} onClick={()=>{ switchConfigurationItemMode("latest"); window.open(`/dynamic/${fullName}?mode=edit`)}} title={`${title} v${formProps.versionNo}`}><LinkOutlined/> {title} v{formProps.versionNo} </p>

            <div style={{width: "calc(100% - 370px)", marginLeft: "360px", marginTop: "10px", border: "1px #999 solid", borderRadius: "10px", backgroundColor: "#fff", height: "calc(100vh - 140px)", overflowY: "scroll", padding: '15px'}}>
            <div style={{ width: `${magnifiedWidth}%`, zoom: `${zoom}%`, overflow: 'auto', margin: '0 auto' }}>
                <ParentProvider model={{}} formMode='designer'>
                    <ConfigurableFormRenderer form={form} skipFetchData={true} className={formMode === 'designer' ? styles.designerWorkArea : undefined}  >
                        {isDebug && (
                            <DebugPanel formData={form.getFieldsValue()} />
                        )}
                    </ConfigurableFormRenderer>
                </ParentProvider>
            </div>
            </div>
        </div>
    );
};
