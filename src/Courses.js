import React, { useState, useEffect, useContext } from "react";
import AuthContext from "./Auth/AuthContext";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [adminMessage, setAdminMessage] = useState('');
  const { getAccessToken } = useContext(AuthContext)

  useEffect(() => {
    async function getInitialData() {
      try {
        const res = await fetch(`/courses`, {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`
          }
        });
        const parsedResponse = await res.json();        
        setCourses(parsedResponse.courses);
      } catch (e) {
        setCourses("error loading", e.message);
      }
    }

    getInitialData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    async function getInitialData() {
      try {
        const res = await fetch(`/admin`, {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`
          }
        });
        const parsedResponse = await res.json();        
        setAdminMessage(parsedResponse.message);
      } catch (e) {
        setAdminMessage("error loading", e.message);
      }
    }

    getInitialData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <h1>{adminMessage}</h1>
      <h2>Courses</h2>
      <ul>
        {courses.map(course => (
          <li key={course.id}>{course.name}</li>
        ))}
      </ul>
    </>
  );
}

export default Courses;
