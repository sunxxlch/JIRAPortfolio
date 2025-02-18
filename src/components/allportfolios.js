//import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Allportfolios() {
    const navigate = useNavigate();

    const portfoliosData = [
        { project:'API',key: 'DBSFE-20250112', value: '1' },
        { project:'API',key: 'DBSFE-20250113', value: '2' },
        { project:'API',key: 'DBSFE-20250114', value: '3' },
    ];

    const uniqueProjects = [...new Set(portfoliosData.map((pdata) => pdata.project))];

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
                <button id='createnewpostrfolio' className='createbutton' onClick={redirectAddPortfolio}>
                    <h1>Create New Portfolio</h1>
                </button>
            </div>
            <div className="portfolio-container">
                <table className="portfolio-table">
                    <thead>
                        <tr>
                            <th>{uniqueProjects[0]}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {portfoliosData.map((pdata) => (
                            <tr>
                                <td>
                                    <a onClick={() => redirecttoPID(pdata.value,pdata.project)} >
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

export default Allportfolios;