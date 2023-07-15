import React, { createContext, useContext, useState, useEffect } from "react"
import { User } from "./server/models/userModel"

interface AuthContextInterface {
  isLoggedIn: boolean // true if the user is logged in, false otherwise
  account?: User // set when user logs in, empty otherwise
  onLogIn: (account: User) => void // function to call when the user logs in
  onLogOut: () => void // function to call when the user logs out
}

export const AuthContext = createContext<AuthContextInterface | undefined>(
  undefined
)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within a ProvideAuth")
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const ProvideAuth: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [account, setAccount] = useState<User>()

  const logIn = (account: User) => {
    setAccount(account)
    setIsLoggedIn(true)
  }

  const logOut = () => {
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, account, onLogIn: logIn, onLogOut: logOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}
