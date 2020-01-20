import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Link} from 'react-router-dom';
import OtherPage from './OtherPage';
import Kalkuliatorius from './Kalkuliatorius';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Link to="/">Home</Link>
        <Link to="/otherpage">Other Page</Link>
        <Route exact path="/" component={Kalkuliatorius} />
        <Route path="/otherpage" component={OtherPage} />
      </header>
    </div>
    </BrowserRouter>
  );
}

export default App;
