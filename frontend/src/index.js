import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

document.title = "Weather App";


root.render(<React.StrictMode>
              <App />
            </React.StrictMode>);

