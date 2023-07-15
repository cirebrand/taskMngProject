import React, { createContext, useContext, useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import {
  HomeScreen,
  LoginScreen,
  MakeAccount,
  ForgotPassword,
} from "./screens/index"
import "./App.css"
import "./auth-context"
import { useAuth, ProvideAuth } from "./auth-context"

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const auth = useAuth()

  if (!auth?.isLoggedIn) {
    return <Navigate to="/" />
  }

  return children
}

export const App = () => {
  return (
    <ProvideAuth>
      <Router>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/MakeAccount" element={<MakeAccount />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route
            path="/HomeScreen"
            element={
              <ProtectedRoute>
                <HomeScreen />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ProvideAuth>
  )
}

/* OLD WORKING CODE WITH NO AUTH */
// export const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginScreen />} />
//         <Route path="/HomeScreen" element={<HomeScreen />} />
//         <Route path="/ForgotPassword" element={<ForgotPassword />} />
//         <Route path="/MakeAccount" element={<MakeAccount />} />
//       </Routes>
//     </Router>
//   )
// }

/* DO NOT KNOW IF I NEED BUT CODE BELOW IS FOR NESTING ROUTES*/
//Routing info
/*
 <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/Home" element={<HomeScreen />}>
          //Nested Routes
          <Route path="/Home/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/Home/MakeAccount" element={<MakeAccount />} />
        </Route>
        //Redirect if the user tries to access nested routes directly
        <Route
          path="/Home/*"
          element={<Navigate to="/Home" replace />}
        />
      </Routes>
    </Router>
*/
