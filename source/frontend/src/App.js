
import Header from './components/Header'
import VisualizeMainScreen from './screens/VisualizeMainScreen'
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Visualize from './components/Visualize'

function App() {
  return (
    <Router >
      <Header/>
        <main className="py-3">
              <Route path='/' component={VisualizeMainScreen} exact/>
              <Route path='/akarsu' component={Visualize} exact/>
              <Route path='/deniz' component={Visualize} exact/>
              <Route path='/aritma' component={Visualize} exact/>
              <Route path='/gol' component={Visualize} exact/>
        </main>
      
    </Router>
  );
}

export default App;
