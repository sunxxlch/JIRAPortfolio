import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import api from './apiRefresh';

function Addport() {
  const { ProjectName, portfolioID } = useParams();
  const isEditMode = Boolean(portfolioID);
  const [selectedValue, setSelectedValue] = useState(0);
  const [pname, setpname] = useState("");
  const [pkey, setpkey] = useState("");
  const [dataSets, setDataSets] = useState([]);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSet, setNewSet] = useState({
    setName: "",
    cycleId: "",
    projectId: "",
    versionId: "",
});


  const handleModalChange = (field, value) => {
    setNewSet((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (ProjectName) setpname(ProjectName);
    if (portfolioID) setpkey(portfolioID);
  }, [ProjectName, portfolioID]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get(`/allProject`);
        if (response.status === 200) {
          setProjects(response.data); 
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjects();
  }, []);

  const fetchportfolioDetails = async () => {
    try {
      const response = await api.get(`/portfoliodetails/${pname}/${pkey}`);

      if (response.status == 200) {
        setSelectedValue(response.data.length);
        setDataSets(response.data);
      }
    } catch (error) {
      console.error("Error fetching portfolio details:", error);
    }
  }

  useEffect(() => {
    console.log("Params from URL:", { pname, pkey });

    if (isEditMode) {
      fetchportfolioDetails();
    }
  }, [isEditMode, pname, pkey]);



  // Logging selectedValue of sets
  useEffect(() => {
    console.log("Updated selectedValue:", selectedValue);
  }, [selectedValue]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const finalData = {
      portfolioKey: pkey,
      projectName: pname,
      dataSets,
    };

    console.log("Submitting Data:", JSON.stringify(finalData));


    try {
      if (isEditMode) {
        if (!window.confirm("Are you sure you want to update this portfolio?")) {
          return;
        }
        const response = await api.put(`/updateportfolioDetails/${ProjectName}/${portfolioID}`, finalData);
        if(response.status==200){
          await api.get(`/RefreshData/${ProjectName}/${portfolioID}`);
        }


      } else {
        const response = await api.post("/addPortfolio", finalData);
        if(response.status==200){
          await api.get(`/RefreshData/${ProjectName}/${portfolioID}`);
        }
      }

      navigate(`/${pname}/${pkey}`);
    } catch (error) {
      console.error("Error saving portfolio:", error);
      alert("Failed to save portfolio. Please try again.");
    }
  };

  const handleAddNewSet = async () => {
    if (!newSet.setName || !newSet.cycleId || !newSet.projectId || !newSet.versionId) {
      alert("All fields are required!");
      return;
    }
    const newsetData = {
      portfolioKey: pkey,
      projectName: pname,
      dataSets: [newSet]
    };

    try {
      console.log(newsetData);
      const response = await api.post(`/addNewSet`, newsetData);

      if (response.status === 200) {
        await api.get(`/RefreshData/${ProjectName}/${portfolioID}`);
        //setup loading
        alert("Set added successfully!");
        window.location.reload(); 
      } else {
        alert("Failed to add set!");
      }
    } catch (error) {
      console.error("Error adding set:", error);
      alert("Error adding set!");
    }
  };

  // Handle Input Change
  const handleChange = (index, field, value) => {
    const updatedDataSets = [...dataSets];
    updatedDataSets[index] = { ...updatedDataSets[index], [field]: value };
    setDataSets(updatedDataSets);
  };

  // Handle Delete (Blur Effect)
  const handleDelete = async (index) => {

    const updatedDataSets = [...dataSets];
    updatedDataSets[index].isDeleted = true; // Mark as deleted
    if (isEditMode) {
      const isConfirmed = window.confirm("Are you sure you want to delete this Set?");

      if (!isConfirmed) {
        updatedDataSets[index].isDeleted = false;
        return; // Stop if user cancels
      }
      console.log("Deleted ID: " + updatedDataSets[index].id);

      const response = await api.delete(`/deletePortfolioSet/${updatedDataSets[index].id}`);

      if (response.status === 200) {
        console.log("Deleted portfolio successfully");
        const newPortfolios = updatedDataSets.filter((_, i) => i !== index);
        setDataSets(newPortfolios);
        setSelectedValue(selectedValue - 1); 
        fetchportfolioDetails();
      }

    } else {
      const newPortfolios = updatedDataSets.filter((_, i) => i !== index);
      setDataSets(newPortfolios);
      setSelectedValue(selectedValue - 1);

    }
  };

  // Handle Add New Set
  const handleAddSet = () => {
    setDataSets([...dataSets, { setName: "", cycleId: "", projectId: "", versionId: "", isDeleted: false }]);
    setSelectedValue(selectedValue + 1);
  };



  const isFormValid = pname && pkey && dataSets.length > 0 && dataSets.every(data =>
    data.setName && data.cycleId && data.projectId && data.versionId
  );

  return (
    <div className="addport-container">
      <div className="headerLogo">
        <h2 onClick={() => navigate("/")}>Release Dashboard</h2>
      </div>

      <div className="left-section">
        <h3>{isEditMode ? "Update Portfolio Details" : "Create New Portfolio"}</h3>
        <form onSubmit={handleSubmit}>
          {/* Project Dropdown */}
          <label>Project:</label>
          <select
            id="projects"
            name="projects"
            required
            value={isEditMode ? ProjectName : pname}
            onChange={(e) => setpname(e.target.value)}
            disabled={isEditMode}
          >
            <option disabled value="">
              Choose
            </option>
            {projects.map((project, index) => (
              <option key={index} value={project}>
                {project}
              </option>
            ))}
          </select>

          {/* Release Name */}
          <label>Release Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={isEditMode ? portfolioID : pkey}
            onChange={(e) => setpkey(e.target.value)}
            disabled={isEditMode}
          />


          {/* Cycle Selection */}
          <label>Select Cycles:</label>
          <select
            name="cycles"
            id="cycles"
            required
            value={selectedValue || ""}
            onChange={(e) => {
              const value = Number(e.target.value);
              console.log("Selected Value:", value);
              setSelectedValue(value);
              setDataSets(Array.from({ length: value }, () => ({ setName: "", projectId: "", versionId: "", cycleId: "" })));
            }}
            disabled={isEditMode}
          >
            <option value="" disabled>
              Choose
            </option>
            {[...Array(6)].map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!isFormValid}
            style={{
              backgroundColor: isFormValid ? (isEditMode ? "rgb(91, 53, 149)" : "green") : "grey",
              width: "100%",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: isFormValid ? "pointer" : "not-allowed"
            }}
          >
            {isEditMode ? "Update" : "Submit"}
          </button>
        </form>
      </div>

      {selectedValue > 0 && (
        <div className="right-section">
          <h3>Set Details</h3>
          <div className="additionalFieldsContainer">
            {dataSets.map((data, index) => (
              <div key={index} className={`input-set ${data.isDeleted ? "blur" : ""}`}>
                <div>
                  <input
                    type="text"
                    placeholder="Application Name"
                    className="application-name"
                    value={data.setName || ""}
                    onChange={(e) => handleChange(index, "setName", e.target.value)}
                    required
                    disabled={data.isDeleted}
                  />

                  {!data.isDeleted && (
                    <button className="delete-btn" onClick={() => handleDelete(index)}><MdDelete/></button>
                  )}
                </div>

                <div className="input-row">
                  <input
                    type="text"
                    placeholder="Cycle ID"
                    value={data.cycleId || ""}
                    onChange={(e) => handleChange(index, "cycleId", e.target.value)}
                    required
                    disabled={data.isDeleted}
                  />

                  <input
                    type="text"
                    placeholder="Project ID"
                    value={data.projectId || ""}
                    onChange={(e) => handleChange(index, "projectId", e.target.value)}
                    required
                    disabled={data.isDeleted}
                  />

                  <input
                    type="text"
                    placeholder="Version ID"
                    value={data.versionId || ""}
                    onChange={(e) => handleChange(index, "versionId", e.target.value)}
                    required
                    disabled={data.isDeleted}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                if (!isEditMode) {
                  handleAddSet();
                } else {
                  setShowModal(true);
                }
              }}
            >
              ➕ Add New Set
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Enter Set Details</h3>
            <input
              type="text"
              placeholder="Application Name"
              value={newSet.setName}
              onChange={(e) => handleModalChange("setName", e.target.value)}
            />
            <input
              type="text"
              placeholder="Cycle ID"
              value={newSet.cycleId}
              onChange={(e) => handleModalChange("cycleId", e.target.value)}
            />
            <input
              type="text"
              placeholder="Project ID"
              value={newSet.projectId}
              onChange={(e) => handleModalChange("projectId", e.target.value)}
            />
            <input
              type="text"
              placeholder="Version ID"
              value={newSet.versionId}
              onChange={(e) => handleModalChange("versionId", e.target.value)}
            />

            <div className="modal-buttons">
              <button onClick={handleAddNewSet}>Add</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Addport;
