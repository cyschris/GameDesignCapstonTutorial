import logo from './logo.svg';
import './App.css';
import { signInWithGoogle } from './Firebase'
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={signInWithGoogle}>Sign In With Google</button>
        <h1>{localStorage.getItem("name")}</h1>
        <h1>{localStorage.getItem("email")}</h1>
        <img src={localStorage.getItem("profilePic")}/>
      </header>

    </div>

  );
}

export default App;
