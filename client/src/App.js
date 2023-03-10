import {BrowserRouter as Router} from "react-router-dom"
import { AuthContext } from './context/AuthContext'
import { ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from './hooks/auth.hook'
import { useRoutes } from "./routes"

import { Footer } from "./components/footer"
import { Header } from "./components/header"
import { Loader } from "./components/loader"


function App() {

  const {login, logout, token, userId, userName, userEmail, ready} = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)

  if (!ready) {
    return <><Loader/></>
  }

  return (
    <AuthContext.Provider value={{
      login, logout, token, userId, userName, userEmail, isAuthenticated
    }}>
      <Router>
        <div className="container">
          <Header />
          {routes}
          <Footer />
          <ToastContainer
            limit={3}
            newestOnTop={false}
            rtl={false}
           />
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App;
