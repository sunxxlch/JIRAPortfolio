import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { LuDelete } from "react-icons/lu";
import RefreshIcon from '@mui/icons-material/Refresh';
import api from "./apiRefresh";
import Switch from "react-switch";


const CATEGORY_COLORS = {
    Fail: "red",
    Pass: "green",
    Unexecuted: "grey",
    WIP: "yellow"
};

const Portfolio = () => {
    const navigate = useNavigate();
    const { ProjectName, portfolioID } = useParams();
    const [data, setProjects] = useState([]);
    const [pid, setPid] = useState("");
    const [exists, setExists] = useState(true);
    const [loading, setLoading] = useState(true);
    const [selectedChart, setSelectedChart] = useState(null);
    const [selecteddefectChart, setSelecteddefectChart] = useState(null);
    const [defectData, SetdefectData] = useState([]);
    const [reportsData, SetReportsData] = useState([]);
    const [bugData, SetbugData] = useState([]);
    const [defectType, setDefectType] = useState(null)
    const [newDefectKey, setNewDefectKey] = useState("");
    const [newDefectValue, setNewDefectValue] = useState("");
    const [newReportname, setNewReportname] = useState("");
    const [newReportUrl, setNewReportUrl] = useState("");
    const [refresh, setRefresh] = useState("");
    const [isBarGraph, setIsBarGraph] = useState(true);


    const openChartModal = (chartData) => {
        setSelectedChart(chartData);
    };

    const closeChartModal = () => {
        setSelectedChart(null);
    };

    const opendefectModal = (Data) => {
        setSelecteddefectChart(Data);
    };

    const closedefectModal = () => {
        setSelecteddefectChart(null);
    };

    const setdefectcategory = (type) => {
        setDefectType(type)
    }

    useEffect(() => {
        console.log("Hello")
    }, [])


    useEffect(() => {
        if (!ProjectName || !portfolioID) {
            console.error("Project name is missing from URL!");
            return;
        }
        const fetchPortfolioData = async () => {
            try {
                const apiUrl = `/uiportfoliodetails/${ProjectName}/${portfolioID}`;
                const response = await api.get(apiUrl);

                if (!response.data || response.data.length === 0) {
                    setExists(false);
                } else {
                    const formattedData = response.data.map(({ name, Pass, Fail, WIP, Unexecuted }) => ({
                        name,
                        Fail,
                        Unexecuted,
                        Pass,
                        WIP

                    }));
                    setProjects(formattedData);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching portfolios data:", error);
                setProjects([]);
                setExists(false);
                setLoading(false);
            }
        }
        fetchPortfolioData();

    }, [ProjectName, portfolioID]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/bugdetails/${ProjectName}/${portfolioID}`);
                SetbugData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            try {
                const response = await api.get(`/defectdetails/${ProjectName}/${portfolioID}`);
                SetdefectData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

    }, [ProjectName, portfolioID]);

    useEffect(() => {
        if (selectedChart) {
            fetchReportsData(selectedChart.name);
        }
    }, [selectedChart]);

    const fetchReportsData = async (name) => {
        try {
            const response = await api.get(`/executionReportdetails/${ProjectName}/${portfolioID}/${name}`);
            if (Array.isArray(response.data)) {
                SetReportsData(response.data);
            } else {
                SetReportsData([]);
                console.error("Unexpected response format:", data);
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
            SetReportsData([]);
        }
    };


    const Home = () => {
        navigate("/");
    }
    const redirectEditPortfolio = () => {
        navigate("/EditPortfolio/" + ProjectName + "/" + portfolioID);
    };

    const handleDelete = async (name) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this portfolio?");

        if (!isConfirmed) {
            return;
        }

        let response = null;

        if (defectType === "Release Defects") {
            response = await api.delete(`/defectdetailsDelete/${ProjectName}/${portfolioID}/${name}`);
        } else {
            response = await api.delete(`/bugdetailsDelete/${ProjectName}/${portfolioID}/${name}`);
        }


        if (response.status === 200) {
            console.log("Deleted defect successfully");
            window.location.reload();
        } else {
            alert("Failed to delete defect!");
        }
    }

    const handlereportDelete = async (chartname, namevalue, urlvalue) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this portfolio?");

        if (!isConfirmed) {
            console.log(chartname + "-" + namevalue + "-" + urlvalue);
            return;
        }
        const response = await api.delete(`/executionReportdetails/${ProjectName}/${portfolioID}/${chartname}`);

        if (response.status === 200) {
            window.location.reload();
        } else {
            alert("Failed to delete defect!");
        }
    }

    const handleAddDefect = async () => {
        if (!newDefectKey || !newDefectValue) {
            alert("Please enter both Defect Key and Value!");
            return;
        }
        let response = null;

        if (defectType === "Release Defects") {
            response = await api.post(`/defectdetailsAdd/${ProjectName}/${portfolioID}/${pid}`, {
                key: newDefectKey,
                value: newDefectValue
            });

        } else {
            response = await api.post(`http://localhost:8080/bugdetailsAdd/${ProjectName}/${portfolioID}/${pid}`, {
                key: newDefectKey,
                value: newDefectValue
            });
        }
        try {

            if (response.status === 200) {
                alert("Defect added successfully!");
                window.location.reload();

            } else {
                alert("Failed to add defect!");
            }
        } catch (error) {
            console.error("Error adding defect:", error);
            alert("Error adding defect!");
        }
    };

    const handleAddReport = async (name) => {
        if (!newReportname || !newReportUrl) {
            console.log(newReportname + " " + newDefectValue)
            alert("Please enter both Defect Key and Value!");
            return;
        }

        try {
            const response = await api.post(`/executionReportdetails/${ProjectName}/${portfolioID}/${name}`, {
                name: newReportname,
                url: newReportUrl
            });

            if (response.status === 200) {
                alert("Report added successfully!");
                window.location.reload();
            } else {
                alert("Failed to add Report!");
            }
        } catch (error) {
            console.error("Error adding Report:", error);
            alert("Error adding Report!");
        }
    };

    const refreshPortfolioDetails = async () => {
        setRefresh(true);
        const response = await api.get(`/RefreshData/${ProjectName}/${portfolioID}`);
        if (response.status === 200) {
            console.log("200");
            const formattedData = response.data.map(({ name, Pass, Fail, WIP, Unexecuted }) => ({
                name,
                Fail,
                Unexecuted,
                Pass,
                WIP

            }));
            setRefresh(false);
            setProjects(formattedData);
        }
    }

    return (
        <div className="portfolio">
            <div className='headerLogo'>
                <div onClick={Home}>
                    <h2>Release Dashboard</h2>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <a
                        title='Refresh Portfolio'
                    >
                        <RefreshIcon style={{
                            color: "white",
                            height: "30px",
                            width: "30px"
                        }}
                            onClick={refreshPortfolioDetails} />
                    </a>
                    {localStorage.getItem("role") === "ADMIN" && (
                        <button
                            id="createnewpostrfolio"
                            className="createbutton"
                            onClick={redirectEditPortfolio}
                        >
                            <h1>Edit Portfolio</h1>
                        </button>
                    )}
                </div>
            </div>
            {loading && (
                <div className="chart-container">
                    <h2 className="refresh" style={{
                        alignItems: "center",
                        marginLeft: "40%"
                    }}>Loading...</h2>
                </div>
            )}
            {!exists ? (
                <div className="not-found-container">
                    <h2 className="not-found">Portfolio Not Found...</h2>
                </div>
            ) : (
                <div className="portfolio-container">
                    <div className="table-container">
                        <table className="defect-table">
                            <thead>
                                <tr>
                                    <th>
                                        <a
                                            style={{
                                                width: "75%",
                                                textAlign: "left",
                                                paddingRight: "10px"
                                            }}

                                        >Release Defects</a>
                                        {localStorage.getItem("role") === "ADMIN" && (
                                            <a
                                                onClick={() => {
                                                    opendefectModal(defectData);
                                                    setdefectcategory("Release Defects");
                                                }}
                                            >&#9998;</a>
                                        )}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {defectData.map((defect, index) => (
                                    <tr key={index}>
                                        <td>
                                            <a href={defect.value} target="_blank">
                                                {defect.key}
                                            </a>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                        <table className="defect-table">
                            <thead>
                                <tr>
                                    <th>
                                        <a
                                            style={{
                                                width: "75%",
                                                textAlign: "left",
                                                paddingRight: "10px"
                                            }}

                                        >Defects Identified</a>
                                        {localStorage.getItem("role") === "ADMIN" && (
                                            <a
                                                onClick={() => {
                                                    opendefectModal(bugData);
                                                    setdefectcategory("Defects Identified");
                                                }}
                                                
                                            >&#9998;</a>
                                        )}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {bugData.map((defect) => (
                                    <tr>
                                        <td>
                                            <a href={defect.value} target="_blank" >
                                                {defect.key}
                                            </a>
                                        </td>
                                    </tr>
                                )
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div >
                            <label style={{
                                fontWeight:"bold",
                                paddingRight:"10px"
                            }}>
                                Pie Chart
                            </label>
                            <Switch
                                checked={isBarGraph}
                                onChange={checked => setIsBarGraph(checked)}
                                onColor="#86d3ff"
                                onHandleColor="#2693e6"
                                handleDiameter={25}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                height={20}
                                width={50}
                                placeholder='View Mode'
                            />
                            <label style={{
                                fontWeight:"bold",
                                paddingLeft:"10px"
                            }}>
                                Bar Graph
                            </label>
                        </div>
                        {refresh ? (
                            <div className="chart-container">
                                <h2 className="refresh" style={{
                                    alignItems: "center",
                                    marginLeft: "40%"
                                }}>Loading...</h2>
                            </div>
                        ) : (
                            <div className="chart-container">
                                {[...data]
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((chartData, index) => (
                                        <div key={index} className="chart" onClick={() => openChartModal(chartData)}>
                                            <ResponsiveContainer width={310} height={260} >
                                                {isBarGraph ? (
                                                    <BarChart data={[
                                                        { category: 'Fail-' + chartData.Fail, count: chartData.Fail / (chartData.Fail + chartData.Unexecuted + chartData.Pass + chartData.WIP) * 100 },
                                                        { category: 'Unex-' + chartData.Unexecuted, count: chartData.Unexecuted / (chartData.Fail + chartData.Unexecuted + chartData.Pass + chartData.WIP) * 100 },
                                                        { category: 'Pass-' + chartData.Pass, count: chartData.Pass / (chartData.Fail + chartData.Unexecuted + chartData.Pass + chartData.WIP) * 100 },
                                                        { category: 'WIP-' + chartData.WIP, count: chartData.WIP / (chartData.Fail + chartData.Unexecuted + chartData.Pass + chartData.WIP) * 100 },
                                                    ]}
                                                    margin={{
                                                        top: 0,
                                                        right: 0,
                                                        left: 0,
                                                        bottom: 14,  
                                                    }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis
                                                            dataKey="category"
                                                            tick={({ x, y, payload }) => {
                                                                const [category, count] = payload.value.split('-');
                                                                return (
                                                                    <g transform={`translate(${x},${y})`}>
                                                                        <text x={14} y={0} dy={16} textAnchor="end" fill="#666">
                                                                            {category}
                                                                        </text>
                                                                        <text x={10} y={0} dy={35} textAnchor="end" fill="#666">
                                                                            {count}
                                                                        </text>
                                                                    </g>
                                                                );
                                                            }}
                                                        />
                                                        <YAxis />
                                                        <Tooltip />
                                                        {/* <Legend /> */}
                                                        <Bar dataKey={'count'} fill='#8884D8' />
                                                    </BarChart>
                                                ) : (
                                                    <PieChart>
                                                        <Pie
                                                            data={Object.entries(chartData)
                                                                .filter(([key]) => key !== "name")
                                                                .map(([name, value]) => {
                                                                    const totalCount = chartData.Fail + chartData.Unexecuted + chartData.Pass + chartData.WIP;
                                                                    const ratio = (value / totalCount) * 100;
                                                                    return {
                                                                        name,
                                                                        count: value,
                                                                        value: ratio
                                                                    }
                                                                })}
                                                            dataKey="value"
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={95}
                                                            fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                                                            label={(entry) => (entry.value ? `${entry.count}` : "")}
                                                        >
                                                            {Object.entries(chartData)
                                                                .filter(([key]) => key !== "name")
                                                                .map(([name]) => (
                                                                    <Cell key={name} fill={CATEGORY_COLORS[name] || "blue"} />
                                                                ))}
                                                        </Pie>
                                                    </PieChart>
                                                )}
                                            </ResponsiveContainer>
                                            <div className='chartname'>{chartData.name}</div>
                                        </div>
                                    ))}

                            </div>
                        )}
                        {/* reports data*/}
                        {selectedChart && (
                            <div className="modal-overlay" onClick={closeChartModal}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <h2>{selectedChart.name} Execution Details</h2>
                                    {localStorage.getItem("role") === "ADMIN" && (
                                        <div className="input-container" >
                                            <input
                                                type="text"
                                                placeholder="Enter report name"
                                                value={newReportname}
                                                onChange={(e) => setNewReportname(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Enter report URL"
                                                value={newReportUrl}
                                                onChange={(e) => setNewReportUrl(e.target.value)}
                                            />
                                            <button className="add-defect-btn" onClick={() => handleAddReport(selectedChart.name)}>
                                                ➕ Add Report to Portfolio
                                            </button>
                                        </div>
                                    )}
                                    <table className="modal-table">
                                        <tbody>
                                            {reportsData.length > 0 ? (
                                                reportsData.map((report, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <a href={report.url} target="_blank" rel="noopener noreferrer">
                                                                {report.name}
                                                            </a>
                                                            {localStorage.getItem("role") === "ADMIN" && (
                                                                <button
                                                                    className="delete-btn"
                                                                    onClick={() => handlereportDelete(selectedChart.name, report.name, report.url)}
                                                                >
                                                                    < LuDelete />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td className='empty Data' style={{ textAlign: "center", color: "grey" }}>
                                                        No reports found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {/* Defects or Bugs data*/}
                        {selecteddefectChart && (
                            <div className="modal-overlay" onClick={closedefectModal}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <h2>{defectType}</h2>
                                    <div className="input-container">
                                        <select
                                            id="projects"
                                            name="projects"
                                            required
                                            value={pid}
                                            onChange={(e) => setPid(e.target.value)}
                                        >
                                            <option disabled value="">
                                                Choose
                                            </option>
                                            {data.map((dt, index) => (
                                                <option key={index} value={dt.name}>
                                                    {dt.name}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            placeholder="Enter Defect Key"
                                            value={newDefectKey}
                                            onChange={(e) => setNewDefectKey(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Enter Defect Value (URL)"
                                            value={newDefectValue}
                                            onChange={(e) => setNewDefectValue(e.target.value)}
                                        />
                                        <button className="add-defect-btn" onClick={() => handleAddDefect()}>
                                            ➕ Add Defect to Portfolio
                                        </button>
                                    </div>
                                    <table className="modal-table">
                                        <tbody>
                                            {selecteddefectChart.map((dfctdata, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <a href={dfctdata.value} target="_blank" rel="noopener noreferrer">
                                                            {dfctdata.key}
                                                        </a>
                                                        <button className="delete-btn" onClick={() => handleDelete(dfctdata.key)}>< LuDelete /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>

    );
};

export default Portfolio;