
export const portfoliosData = [
    { project: "API", key: "DBSFE-20250112", value: "1" },
    { project: "API", key: "DBSFE-20250113", value: "2" },
    { project: "API", key: "DBSFE-20250114", value: "3" },
    { project: "CRM", key: "DBSFE-20250112", value: "1" },
    { project: "CRM", key: "DBSFE-20250113", value: "2" },
    { project: "CRM", key: "DBSFE-20250114", value: "3" },
    { project: "FrontEnd", key: "DBSFE-20250112", value: "1" },
    { project: "FrontEnd", key: "DBSFE-20250113", value: "2" },
    { project: "FrontEnd", key: "DBSFE-20250114", value: "3" },
];

export const allproject = Array.from(new Set(portfoliosData.map((pdata) => pdata.project)));


const uniqueProjects = new Set(portfoliosData.map((pdata) => `${pdata.project}:${pdata.key}`));


export const checkIfExists = (searchProject, searchKey) => uniqueProjects.has(`${searchProject}:${searchKey}`);




// const data = [
//     {
//         name: 'EMEA',
//         Pass: 10,
//         Fail: 80,
//         Unexecuted: 5,
//         WIP: 5,
//     },
//     {
//         name: 'US',
//         Pass: 70,
//         Fail: 20,
//         Unexecuted: 5,
//         WIP: 5,
//     },
//     {
//         name: 'AU',
//         Pass: 70,
//         Fail: 10,
//         Unexecuted: 10,
//         WIP: 10,
//     },
//     {
//         name: 'CA',
//         Pass: 85,
//         Fail: 10,
//         Unexecuted: 5,
//         WIP: 0,
//     },
//     {
//         name: 'NZ',
//         Pass: 90,
//         Fail: 0,
//         Unexecuted: 5,
//         WIP: 5,
//     },
// ];
