import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import App from './components/App';

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    <BrowserRouter>
      <Route path="/" component={App} />
    </BrowserRouter>,
    document.getElementById('mount')
  );
});
