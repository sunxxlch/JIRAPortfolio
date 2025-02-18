import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';


const COLORS = ['#da3c18', '#37b227', '#afcdd5', '#dfdf29'];

const data = [
    {
        name: 'EMEA',
        Pass: 10,
        Fail: 80,
        Unexecuted: 5,
        WIP: 5,
    },
    {
        name: 'US',
        Pass: 70,
        Fail: 20,
        Unexecuted: 5,
        WIP: 5,
    },
    {
        name: 'AU',
        Pass: 70,
        Fail: 10,
        Unexecuted: 10,
        WIP: 10,
    },
    {
        name: 'CA',
        Pass: 85,
        Fail: 10,
        Unexecuted: 5,
        WIP: 0,
    },
    {
        name: 'NZ',
        Pass: 90,
        Fail: 0,
        Unexecuted: 5,
        WIP: 5,
    },
];


const defectData = [
    { key: 'GDC-12356', value: 'https://jira.cengage.com/browse/GDC-2883' },
    { key: 'GDC-34567', value: 'https://jira.cengage.com/browse/GDC-2883' },
    { key: 'GDC-56789', value: 'https://jira.cengage.com/browse/GDC-2883' },
];

const Portfolio = () => {
    const navigate = useNavigate();

    const Home = () => {
        navigate("/");
    }
    const redirectAddPortfolio = () => {
        navigate("/addPortfolio")
    };

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
            <div className="portfolio-container">
                <div className="table-container">
                    <table className="defect-table">
                        <thead>
                            <tr>
                                <th>Release Defects</th>
                            </tr>
                        </thead>
                        <tbody>
                            {defectData.map((defect) => (
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
                    <table className="defect-table">
                        <thead>
                            <tr>
                                <th>Defects Identified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {defectData.map((defect) => (
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
                <div className="chart-container">
                    {data.map((chartData, index) => (
                        <div key={index} className="chart">
                            <ResponsiveContainer width={300} height={300}>
                                <PieChart>
                                    <Pie
                                        data={Object.entries(chartData).map(([name, value]) => ({
                                            name,
                                            value,
                                        }))}
                                        dataKey="value"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill={COLORS[index % COLORS.length]}

                                        label={(entry) => {
                                            if (typeof entry.value === 'number') {
                                                return `${entry.value}%`;
                                            }
                                            return null;
                                        }}
                                    >
                                        {Object.entries(chartData).map(([name], index) => (
                                            <Cell key={name} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                                <div className='chartname'>{chartData.name}</div>
                            </ResponsiveContainer>

                        </div>
                    ))}
                </div>

            </div>

        </div>
    );
};

export default Portfolio;