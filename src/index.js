import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route} from 'react-router-dom';
import App from './components/App';

document.addEventListener('DOMContentLoaded', function() {
document.body.scrollTop = 0;

  ReactDOM.render(
    <BrowserRouter>
      <Route path="/" component={App} />
    </BrowserRouter>,
    document.getElementById('mount')
  );
});
