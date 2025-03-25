import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "./apiRefresh";

function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    if (!localStorage.getItem("accessToken") || !localStorage.getItem("refreshToken")) {
      console.error("No token found. Redirecting to login...");
      window.location.href = "/login";
      return;
  }
    const fetchData = async () => {
      try {
        const response = await api.get("/allProject");

        setProjects(response.data);
        setLoading(false);


      } catch (error) {
        console.error("Error fetching project data:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const redirectAddPortfolio = () => {
    navigate("/addPortfolio")
  };

  const redirectprojectPortfolio = (ProjectName) => {
    navigate(`/AllPortfolios/${ProjectName}`);
  };

  const Home = () => {
    navigate("/");
  }

  const logoutbtn = () =>{
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    window.location.reload(); 
  };

  if (loading) return <p  style={{
    alignContent:"center"
}}>Loading...</p>;

  return (
    <div className="portfolio">
      <div className="headerLogo" >
        <div onClick={Home}>
          <h2>Release Dashboard</h2>
        </div>
          <button id='createnewpostrfolio' className='createbutton' onClick={logoutbtn}
          style={{
            width:"7%"
          }}>
            <h1>Logout</h1>
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
            {projects.map((project, index) => (
              <tr key={index}>
                <td>
                  <a onClick={() => redirectprojectPortfolio(project)}>
                    {project}
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