import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
if(module.hot){
    module.hot.accept()
}