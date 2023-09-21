import React, { ReactNode, SetStateAction, createContext, useState } from 'react'
export type TUser = {
    id: number,
    email: string
}

type TAuthContext = {
    user: TUser | null,
    setUser: React.Dispatch<SetStateAction<TUser | null>>
}


export const AuthContext = createContext<TAuthContext>({
  user: null,
  setUser: () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
