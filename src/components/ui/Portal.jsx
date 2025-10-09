import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children, containerId = 'modal-root' }) => {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    // Create or get the portal container
    let portalContainer = document.getElementById(containerId);
    
    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.id = containerId;
      portalContainer.style.position = 'fixed';
      portalContainer.style.top = '0';
      portalContainer.style.left = '0';
      portalContainer.style.width = '100%';
      portalContainer.style.height = '100%';
      portalContainer.style.pointerEvents = 'none';
      portalContainer.style.zIndex = '9999';
      document.body.appendChild(portalContainer);
    }

    setContainer(portalContainer);

    // Cleanup function
    return () => {
      // Only remove if it's empty and we created it
      if (portalContainer && portalContainer.children.length === 0 && portalContainer.id === containerId) {
        document.body.removeChild(portalContainer);
      }
    };
  }, [containerId]);

  if (!container) return null;

  return createPortal(children, container);
};

export default Portal;
