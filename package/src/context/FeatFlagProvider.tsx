import React, { ReactNode, SetStateAction, createContext, useState } from 'react'

type TFlag = {
    id: number,
    current_state: boolean
}

type TFlags = {
    [key: string]: TFlag
}

type TAuthContext = {
    flags: TFlags,
    setFlags: React.Dispatch<SetStateAction<TFlags>>
}


export const FeatFlagContext = createContext<TAuthContext>({
  flags: {},
  setFlags: () => {},
});

const FeatFlagProvider = ({ children }: { children: ReactNode }) => {
  const [flags, setFlags] = useState<TFlags>({});

  return (
    <FeatFlagContext.Provider value={{ flags, setFlags }}>
      {children}
    </FeatFlagContext.Provider>
  );
};

export default FeatFlagProvider;
