import { dividerClasses } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DeleteProject from './DeleteProject';
import Navbar from './Navbar';
import ProjectsGrid from './ProjectsGrid';

const ProjectsPage = (props) => {
  const [projects, updateProjects] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const {
    currentUserId,
    setTreeData,
    dbSchemaDataOnChange,
    setResolverData,
    projectId,
    setProjectId,
    setProjectName,
  } = props;
  const [getData, setGetData] = useState(true);

  const fetchData = async () => {
    if (!getData) return;
    console.log('id:', currentUserId);
    const data = await fetch(`/projects/${currentUserId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    const projectList = await data.json();
    updateProjects(projectList);
    setGetData(false);
  };

  fetchData();
  // setProjectId(null); //reset projectid and projectname each time the projects page is loaded
  // setProjectName(null);

  return (
    <div id='project-page'>
      <div id='projectTable'>
        <ProjectsGrid
          projects={projects}
          setTreeData={setTreeData}
          dbSchemaDataOnChange={dbSchemaDataOnChange}
          setResolverData={setResolverData}
          projectId={projectId}
          setProjectId={setProjectId}
          setProjectName={setProjectName}
          deletePopup={deletePopup}
          setDeletePopup={setDeletePopup}
          setGetData={setGetData}
        />
      </div>
    </div>
  );
};

export default ProjectsPage;
