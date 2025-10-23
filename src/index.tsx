import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import './styles/global.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element with id "root" not found');
}

const root = ReactDOM.createRoot(container);
root.render(<App />);
