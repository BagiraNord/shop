import './bootstrap.css';
import './App.scss';

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";
import Front from "./Components/Front/Front";
import Back from "./Components/Back/Back";
import { login, logout, authConfig } from './Functions/auth';
import axios from 'axios';
import { useState, useEffect } from "react";
import {apikey} from './Functions/key';

function App() {
    useEffect(() => {
        axios.get('https://api.currencyapi.com/v3/latest?apikey=' + apikey)
        .then(res => {
          console.log(res.data)
          axios.post('http://localhost:3003/admin/cur', res.data, authConfig())
          .then(r => console.log(r))
    
        })
    
      }, [])

    return (
        <BrowserRouter>
        
        <Routes>
                <Route path="/" element={<Front/>} /> 
                <Route path="/login" element={<LoginPage />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/admin" element={<RequireAuth role="admin"><Back show="admin" /></RequireAuth>} />
                <Route path="/admin" element={<Back show="admin"/>} />
                <Route path="/admin/cats" element={<Back show="cats"/>} />
                <Route path="/admin/products" element={<Back show="products"/>} /> 
        </Routes>
      
        </BrowserRouter>
    )
}

function RequireAuth({ children, role }) {
    const [view, setView] = useState(<h2>Please wait...</h2>);
  
    useEffect(() => {
      axios.get('http://localhost:3003/login-check?role=' + role, authConfig())
        .then(res => {
          if ('ok' === res.data.msg) {
            setView(children);
          } else {
            setView(<Navigate to="/login" replace />);
          }
        })
  
    }, [children, role]);
  
    return view;
  }

  
  
  function LoginPage() {
    const navigate = useNavigate();
  
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
  
    const doLogin = () => {
      axios.post('http://localhost:3003/login', { user, pass })
        .then(res => {
          console.log(res.data);
          if ('ok' === res.data.msg) {
            login(res.data.key);
            navigate('/', { replace: true });
          }
        })
    }
    return (
      <div>
        <div>name: <input type="text" value={user} onChange={e => setUser(e.target.value)}></input></div>
        <div>password: <input type="password" value={pass} onChange={e => setPass(e.target.value)}></input></div>
        <button onClick={doLogin}>Login</button>
      </div>
    );
  }
  
  function LogoutPage() {
    useEffect(() => logout(), []);
    return (
      <Navigate to="/login" replace />
    )
  }

export default App;