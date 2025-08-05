import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

interface Ctx {
  initialized: boolean;
  exists: boolean;
  set: (code: string) => Promise<void>;
  reset: () => Promise<void>;
  check: (code: string) => Promise<boolean>;
  change: (oldCode: string, newCode: string) => Promise<boolean>;
}

const KEY = 'app_pin_code';
const PasscodeContext = createContext<Ctx | undefined>(undefined);

export const PasscodeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hash, setHash] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync(KEY);
      setHash(stored ?? null);
      setInitialized(true);
    })();
  }, []);

  const exists = hash !== null;

  const setCode = async (code: string) => {
    await SecureStore.setItemAsync(KEY, code, { keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY });
    setHash(code);
  };

  const reset = async () => {
    await SecureStore.deleteItemAsync(KEY);
    setHash(null);
  };

  const check = async (code: string) => {
    if (!hash) return false;
    return code === hash;
  };

  const change = async (oldCode: string, newCode: string) => {
    const ok = await check(oldCode);
    if (!ok) return false;
    await setCode(newCode);
    return true;
  };

  return (
    <PasscodeContext.Provider value={{ initialized, exists, set: setCode, reset, check, change }}>
      {children}
    </PasscodeContext.Provider>
  );
};

export const usePasscode = () => {
  const ctx = useContext(PasscodeContext);
  if (!ctx) throw new Error('usePasscode must be inside PasscodeProvider');
  return ctx;
}; 