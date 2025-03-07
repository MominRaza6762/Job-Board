import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { BackEndApiProvider } from './Contexts/BackEndApi.jsx';
import { JobsProvider } from './Contexts/Jobs.jsx';
import { UserDataProvider } from './Contexts/UserData.jsx';
import { ThemeProvider } from './Contexts/Theme.jsx';
import './assets/index.css';
import App from './App.jsx'
createRoot(document.getElementById('root')).render(
    <BrowserRouter>


          <ThemeProvider>
        <JobsProvider>
        <BackEndApiProvider>
        <UserDataProvider>
          <App />
        </UserDataProvider>
        </BackEndApiProvider>
        </JobsProvider>
        </ThemeProvider>
    
    </BrowserRouter>
)
