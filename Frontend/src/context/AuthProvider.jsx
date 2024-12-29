import React, { createContext, useContext, useState } from 'react'

export const AuthContext = createContext()

export default function AuthProvider({children}) {
  const initialAuthUser = localStorage.getItem('Users');

  const [autoUser, setAuthUser] = useState(initialAuthUser ? JSON.parse(initialAuthUser) : undefined);


  return (
    <>
    <AuthContext.Provider value={[autoUser, setAuthUser]}>
        {children}
    </AuthContext.Provider>
    </>
  );
}


export const useAuth = ()=> useContext(AuthContext);