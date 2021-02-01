import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LandingPage from './pages/Home/LandingPage';
import ProfilePage from './pages/Home/ProfilePage';
import SearchPage from './pages/Home/SearchPage';
import SignUp from './pages/Home/SignUp';
import LogIn from './pages/Home/LogIn';
import Navbar from './components/Navbar';
import Home from './pages/Home/Home';
import Playground from './pages/Home/Playground';
import Auth0ProviderWithHistory from "./auth/Auth0ProviderWithHistory";

const AppRouter = () => (
  <Router>
    <Auth0ProviderWithHistory>
      <Route
        path='/'
        component={Navbar}
      />
      <Switch>
        <Route
          exact
          path='/'
          component={LandingPage}
        />

        <Route
          exact
          path='/mapPage/:id'
          component={Home}
        />
        <Route
          exact
          path='/profilePage'
          component={ProfilePage}
        />
        <Route
          exact
          path='/searchPage/:value'
          component={SearchPage}
        />
        <Route
          exact
          path='/signUp'
          component={SignUp}
        />
        <Route
          exact
          path='/logIn'
          component={LogIn}
        />
        <Route
          exact
          path='/playground'
          component={Playground}
        />
      </Switch>
    </Auth0ProviderWithHistory>
  </Router>
);

export default AppRouter;
