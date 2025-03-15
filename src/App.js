import './App.css';
import {BrowserRouter,Routes,useParams,Route,useNavigate} from 'react-router-dom';
import React, { useEffect } from 'react';
import Home from './components/HomePage';
import login from './components/login';
import Portfolio from './components/Portfolio';
import Addport from './components/addPortfolio';
import allportfolios from './components/allportfolios';
import { checkIfExists } from './components/utils';

function App() {
  useEffect(() => {
    document.title = "Release Portfolio";
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={Home}></Route>
        <Route path='/login' Component={login}></Route>
        <Route path='/addPortfolio' Component={Addport}></Route>
        <Route path='/AllPortfolios/:ProjectName' Component={allportfolios}></Route>
        <Route path='/:ProjectName/:portfolioID' Component={Portfolio}></Route>
        <Route path='/EditPortfolio/:ProjectName/:portfolioID' Component={Addport}></Route>
        {/* dummy page */}
        <Route path='/Portfolio' Component={ProtectedPortfolio}></Route>
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedPortfolio() {
  const navigate = useNavigate();
  const { ProjectName, portfolioID } = useParams();
  
  console.log("Checking portfolio existence:", ProjectName, portfolioID);

  if (!checkIfExists(ProjectName, portfolioID)) {
    const Home = () => {
      navigate("/");
  }

  const redirectAddPortfolio = () => {
      navigate("/addPortfolio");
  }
    return (
      <div className="portfolio">
            <div className='headerLogo'>
                <div onClick={Home}>
                    <h2>Cengage DBSFE</h2>
                </div>
                <button id='createnewpostrfolio' className='createbutton' onClick={redirectAddPortfolio}>
                    <h1>Create New Portfolio</h1>
                </button>
            </div>
      <div className="not-found-container">
        <h2 className="not-found">Portfolio Not Found</h2>
        <h2 className="not-found">The portfolio you are looking for does not exist.</h2>
      </div>
      </div>
      
    );
  }

  return <Portfolio />;
}
export default App;
