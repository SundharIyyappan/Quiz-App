import './App.css';
import Login from './Pages/Login';
import Registration from './Pages/Registration';
import Home from './Components/Home';
import Score from './Components/Score';
import Account from './Components/Account';
import Feedback from './Components/Feedback';
import AddQuiz from './Admin/AddQuiz';
import Admin from './Admin/Admin';
import Profile from './Admin/Profile';

import { Switch, Route } from 'react-router-dom';
import Recharts from './Admin/Charts/Recharts';


function App() {
  return (
    <div className='app'>
      <Switch>
        <Route exact path='/'>
          <Login />
        </Route>
        <Route path='/registration'>
          <Registration />
        </Route>
        <Route path='/home'>
          <Home />
        </Route>
        <Route path='/score'>
          <Score />
        </Route>
        <Route path='/account'>
          <Account />
        </Route>
        <Route path='/feedback'>
          <Feedback />
        </Route>
        <Route path='/admin'>
          <Admin />
        </Route>
        <Route path='/profile'>
          <Profile />
        </Route>
        <Route path='/addQuiz'>
          <AddQuiz />
        </Route>
        <Route path='/chart'>
          <Recharts />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
