import React from 'react';
import api from './utils/api'
import logo from './logo.svg';
import './App.css';

function App() {
  async function fetchNews() {
    const result = await api.fetchApi();
    console.log(result);
  }
  fetchNews();
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
