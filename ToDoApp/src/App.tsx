import './App.css'
import 'primereact/resources/themes/md-dark-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import TodosPage from './components/pages/TodosPage/TodosPage';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <ToastProvider>
      <TodosPage />
    </ToastProvider>
  )
}

export default App
