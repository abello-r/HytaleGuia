import { useState, useEffect } from 'react';

export const useServerTime = () => {
  const [serverTime, setServerTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const madridTime = new Intl.DateTimeFormat('es-ES', {
        timeZone: 'Europe/Madrid',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(new Date());
      
      setServerTime(madridTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return serverTime;
};
