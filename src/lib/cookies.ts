export const cookies = {
    set: (name: string, value: string, days: number = 7): void => {
      if (typeof window === 'undefined') return;
      
      const maxAge = days * 24 * 60 * 60;
      document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict`;
    },
  
    get: (name: string): string | null => {
      if (typeof window === 'undefined') return null;
      
      const nameEQ = `${name}=`;
      const ca = document.cookie.split(';');
      
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },
  
    remove: (name: string): void => {
      if (typeof window === 'undefined') return;
      
      document.cookie = `${name}=; path=/; max-age=0`;
    },
  
    clear: (): void => {
      if (typeof window === 'undefined') return;
      
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=; path=/; max-age=0`;
      }
    }
  };
  
  export const getServerCookie = (cookieString: string | undefined, name: string): string | null => {
    if (!cookieString) return null;
    
    const nameEQ = `${name}=`;
    const ca = cookieString.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };