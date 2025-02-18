import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './components/HomePage';
import Portfolio from './components/Portfolio';
import Addport from './components/addPortfolio';
import allportfolios from './components/allportfolios';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={Home}></Route>
        <Route path='/addPortfolio' Component={Addport}></Route>
        <Route path='/AllPortfolios/:ProjectName' Component={allportfolios}></Route>
        <Route path='/:ProjectName/:portfolioID' Component={Portfolio}></Route>
        {/* dummy page */}
        <Route path='/Portfolio' Component={Portfolio}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
