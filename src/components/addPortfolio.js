import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Addport() {
  const [selectedValue, setSelectedValue] = useState("");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const navigate = useNavigate();
  let portfolioID = 0;

  const projects = ["API", "CRM", "FrontEnd"];

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      projectName: event.target.projects.value,
      name: event.target.name.value,
      cycles: selectedValue,
      additionalFields: Array.from({ length: selectedValue }, (_, index) => ({
        cycleNumber: index + 1,
        projectID: event.target[`additionalText1-${index}`].value,
        versionID: event.target[`additionalText2-${index}`].value,
        cycleID: event.target[`additionalText3-${index}`].value,
      })),
    };
    console.log(formData);
    portfolioID += 1;
    console.log(portfolioID);
    navigate("/"+event.target.projects.value +"/"+ portfolioID, { state: formData });
  };


  const handleCloseform = () => {
    navigate("/");
  }


  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
    setShowAdditionalFields(true);
  };

  return (
    <div className="formPopup">
      <div className="formContainer">
        <div className='headercontainer'>
          <h3 >Create New Portfolio</h3>
          <h3 id='closeform' onClick={handleCloseform}>&times;</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="project">Project:</label>
          <select id="projects" required onChange={handleSelectChange}>
            <option selected disabled value={""}>
              Choose
            </option>
            {projects.map((project, index) => (
              <option key={index} value={project}>
                {project}
              </option>
            ))}
          </select>
          <label htmlFor="name">Release Name:</label>
          <input type="text" id="name" name="name" placeholder="Ex: DBSFE-28012025" required />
          <label htmlFor="description">Select Cycles:</label>
          <select id="cycles" required onChange={handleSelectChange}>
            <option selected disabled value={""}>
              Choose
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
          {showAdditionalFields && (
            <div className="additionalFieldsContainer1">
              {Array.from({ length: selectedValue }, (_, index) => (
                <div className="additionalFieldsContainer" key={index}>
                  <label>Store:{index + 1}</label>
                  <div className="additionalField">
                    <p>Project ID:</p>
                    <input type="number" id={`additionalText1-${index}`} name={`additionalText1-${index}`} required />
                  </div>
                  <div className="additionalField">
                    <p>Version ID:</p>
                    <input type="number" id={`additionalText2-${index}`} name={`additionalText2-${index}`} required />
                  </div>
                  <div className="additionalField">
                    <p>Cycle ID:</p>
                    <input type="number" id={`additionalText3-${index}`} name={`additionalText3-${index}`} required />
                  </div>
                </div>
              ))}
            </div>
          )}
          <button type="submit" >Submit</button>

        </form>
      </div>
    </div>
  );
}

export default Addport;