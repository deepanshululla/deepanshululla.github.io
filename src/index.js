import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {App} from './Components/App';
import registerServiceWorker from './registerServiceWorker';
import Modal from 'react-modal';


Modal.setAppElement('#react-container')


ReactDOM.render(<App />, document.getElementById('react-container'));
registerServiceWorker();
