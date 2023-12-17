import React, {FC, useEffect, useState} from 'react'
import { ReactNode, ReactElement } from 'react';
import ReactDOM from 'react-dom';

type PortalProps = {
    children: ReactNode
}

export const Portal: FC<PortalProps> = ({children}) => {
    
    const [container, setContainer] = useState<HTMLElement | null>(null);
  
    useEffect(() => {
      const portalContainer = document.createElement('div');
      portalContainer.className = 'portal-elem'
      document.body.appendChild(portalContainer);
      setContainer(portalContainer);
  
      return () => {
        document.body.removeChild(portalContainer);
      };
    }, []);
  
    return container ? ReactDOM.createPortal(children, container) : null;
};