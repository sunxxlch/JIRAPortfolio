import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const ProjectData = [
    { key: 'API', value: 'API' },
    { key: 'CRM', value: 'CRM' },
    { key: 'FrontEnd', value: 'FrontEnd' },
  ];

  
  const redirectAddPortfolio = () => {
    navigate("/addPortfolio")
  };


  const redirectprojectPortfolio = (ProjectName) => {
    navigate(`/AllPortfolios/${ProjectName}`);
  };

  const Home = () => {
    navigate("/");
  }

  return (
    <div className="portfolio">
      <div className="headerLogo" >
        <div onClick={Home}>
          <h2>Cengage DBSFE</h2>
        </div>
        <button id="createnewpostrfolio" className="createbutton" onClick={redirectAddPortfolio}>
          <h1>Create New Portfolio</h1>
        </button>
      </div>
      <div className='projectsheader'>
        <table className="project-table">
          <thead>
            <tr>
              <th>Projects</th>
            </tr>
          </thead>
          <tbody>
            {ProjectData.map((pdata) => (
              <tr>
                <td>
                  <a onClick={() => redirectprojectPortfolio(pdata.value)}>
                    {pdata.key}
                  </a>
                </td>
              </tr>
            )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;