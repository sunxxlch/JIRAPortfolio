import React, { useState, useEffect } from 'react';
import { useNavigate ,useParams} from "react-router-dom";
import { MdDelete } from "react-icons/md";
import api from './apiRefresh';

function Allportfolios() {
    const navigate = useNavigate();
    const { ProjectName } = useParams(); 
    console.log(ProjectName);
    const [portfoliosData, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPortfolios =async () => {
        if (!localStorage.getItem("accessToken") || !localStorage.getItem("refreshToken")) {
            console.error("No token found. Redirecting to login...");
            window.location.href = "/login";
            return;
        }
        try {
            const response = await api.get(`/browse/${ProjectName}`);
            
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching portfolios data:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (index) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this portfolio?");

        if (!isConfirmed) {
            return; 
        }
         const updatedDataSets = [...portfoliosData];
         updatedDataSets[index].isDeleted = true; 

          console.log("Deleted ID: "+updatedDataSets[index].id);

         const response = await api.delete(`/deletePortfolio/${updatedDataSets[index].id}`);

          if (response.status === 200) {
            console.log("Deleted portfolio successfully");
            const newPortfolios = updatedDataSets.filter((_, i) => i !== index);
            setProjects(newPortfolios);

            fetchPortfolios(); 
        }
      };

    useEffect(() => {
        if (!ProjectName) {
            console.error("Project name is missing from URL!");
            return;
        }

        fetchPortfolios();
        
    }, [ProjectName]); 

    const Home = () => {
        navigate("/");
    }

    const redirectAddPortfolio = () => {
        navigate("/addPortfolio");
    }

    const redirecttoPID = (pnumber,psource) =>{
        console.log(psource);
        navigate("/"+psource+"/"+pnumber);
    }

    return (
        <div>
            <div className='headerLogo'>
                <div onClick={Home}>
                    <h2>Cengage DBSFE</h2>
                </div>
                {localStorage.getItem("role") === "ADMIN" && (
                    <button id='createnewpostrfolio' className='createbutton' onClick={redirectAddPortfolio}>
                        <h1>Create New Portfolio</h1>
                    </button>
                )}
            </div>
            <div className="portfolio-container">
                <table className="portfolio-table">
                    <thead>
                        <tr>
                        <th>{portfoliosData[0]?.projectName || "Portfolio"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {portfoliosData.map((pdata,index) => (
                            <tr>
                                <td>
                                    <a onClick={() => redirecttoPID(pdata.portfolioKey,pdata.projectName)} >
                                        {pdata.portfolioKey}
                                    </a>
                                    {localStorage.getItem("role") === "ADMIN" && (
                                        <button className="delete-btn" 
                                        onClick={() => handleDelete(index)}><MdDelete/></button>
                                    )}
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

export default Allportfolios;