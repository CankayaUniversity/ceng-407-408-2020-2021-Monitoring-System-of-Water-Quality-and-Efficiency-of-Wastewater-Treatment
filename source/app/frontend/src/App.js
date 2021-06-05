
import Header from './components/Header'
import VisualizeMainScreen from './screens/VisualizeMainScreen'
import DataEntryMainScreen  from './screens/DataEntryMainScreen'
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Visualize from './components/Visualize'
import Login from './components/login'
import Logout from './components/logout'
import DataEntry from './components/DataEntry'

function App(props) {
  let user = props.data.group
  console.log(user)
  return (
    

    <Router >
      <main>
          {user === "veriGorsellestirici" ? (
            <>
            <Header/>
            <Route path='/' component={VisualizeMainScreen} exact/>
            <Route path='/akarsu' component={Visualize} exact/>
            <Route path='/deniz' component={Visualize} exact/>
            <Route path='/aritma' component={Visualize} exact/>
            <Route path='/gol' component={Visualize} exact/>
            </>
          ) : user === "veriGirisci" ? (
            <>
            <Header/>
            <Route path='/' component={DataEntryMainScreen} exact/>
            <Route path='/akarsu' component={DataEntry} exact/>
            <Route path='/deniz' component={DataEntry} exact/>
            <Route path='/aritma' component={DataEntry} exact/>
            <Route path='/gol' component={DataEntry} exact/>
            </>
          ) : (
            <>
            <Login />
            </>
          )}
          
              
        </main>
      
    </Router>
  );
}

export default App;
