/* eslint-disable no-restricted-globals */
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import App from './App';
import './custom.scss';

const history = createBrowserHistory();

const app = document.getElementById('root');
if (app) {
  // 1. Set up the browser history with the updated location
  // (minus the # sign)
  const path = (/#!(\/.*)/.exec(location.hash) || [])[1];
  if (path) {
    history.replace(`${path}`);
  }

  // 2. Render our app
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <BrowserRouter basename="projects/footystats">
      <App />
    </BrowserRouter>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
