import './App.css';
import './styles/styles.css'

import MainPage from './pages/main';
import Header from './layout/header';
import Footer from './layout/footer';
import { Helmet } from 'react-helmet';
import { APP_NAME } from './config/global';

function App() {
  return (
    <>
      <Helmet>
        <title>{APP_NAME}</title>
      </Helmet>
      <Header />
      <MainPage />
      <Footer />
    </>
  );
}

export default App;
