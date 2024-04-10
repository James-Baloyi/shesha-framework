import React, { ReactNode } from 'react';

const ConfigurableHeader:React.FC = (children: ReactNode) => {

    return(
    <div style={{width: "100%", height: "70px", backgroundColor: "#F2F2F2", border: "2px solid #3311ee"}}>
        {children}
    </div>
    );

}

export default ConfigurableHeader;