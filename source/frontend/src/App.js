import Header from './components/Header'
import HeaderData from './components/HeaderData'
import React, { useState, useEffect } from 'react'
import VisualizeMainScreen from './screens/VisualizeMainScreen'
import DataEntryMainScreen from './screens/DataEntryMainScreen'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Visualize from './components/Visualize'
import Referans from './components/Referans'
import Login from './components/login'
import Logout from './components/logout'
import DataEntry from './components/DataEntry'

function App() {
  const [usergroup, setUserGroup] = useState()

  useEffect(() => {
    let grp = localStorage.getItem('group')
    setUserGroup(grp)
  }, [])

  useEffect(() => {}, [localStorage.getItem('group')])

  return (
    <Router>
      <main>
        {usergroup === 'veriGorsellestirici' ? (
          <>
            <Header />
            <Route path="/" component={VisualizeMainScreen} exact />
            <Route path="/akarsu" component={Visualize} exact />
            <Route path="/deniz" component={Visualize} exact />
            <Route path="/aritma" component={Visualize} exact />
            <Route path="/gol" component={Visualize} exact />
            <Route path="/referans" component={Referans} exact />
            <Route path="/logout" component={Logout} exact />
          </>
        ) : usergroup === 'veriGirisci' ? (
          <>
            <HeaderData />
            <Route path="/" component={DataEntryMainScreen} exact />
            <Route path="/akarsu" component={DataEntry} exact />
            <Route path="/deniz" component={DataEntry} exact />
            <Route path="/aritma" component={DataEntry} exact />
            <Route path="/gol" component={DataEntry} exact />
            <Route path="/logout" component={Logout} exact />
          </>
        ) : (
          <>
            <Login />
          </>
        )}
      </main>
    </Router>
  )
}

export default App
