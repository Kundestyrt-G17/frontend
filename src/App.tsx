import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './App.css';
import Header from './components/Header/Header';
import About from './routes/About';
import WelcomePage from './routes/WelcomePage';
import VoteNowPage from './routes/VoteNowPage';
import Login from './routes/Login';
import NoLongerOwn from './routes/NoLongerOwn';
import { UserFetch } from './components/LoginForm/LoginForm';
import Submitted from './routes/Submitted';
import { submittedPageType } from './utils/types';
import './App.css';

const App = () => {
  const [userData, setUserData] = useState<UserFetch | undefined>();
  const [submitted, setSubmitted] = useState<submittedPageType>(''); // TODO - Dårlig navn

  const pageToShow = () => {
    if (!userData?.user) {
      return <Login setUserData={setUserData} />;
    }
    return <WelcomePage />;
  };

  return (
    <BrowserRouter>
      <Header userData={userData} setUserData={setUserData} />
      <div className={'main-app'}>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/login">
            <Login setUserData={setUserData} />
          </Route>
          <Route path="/vote">
            <VoteNowPage setSubmitted={setSubmitted} />
          </Route>
          <Route path="/noLongerOwn">
            <NoLongerOwn setSubmitted={setSubmitted} />
          </Route>
          <Route path="/submitted">
            <Submitted submitted={submitted} />
          </Route>
          <Route path="/">{pageToShow}</Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
