import React, { useReducer, useEffect } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_PROFILE":
      return {
        profile: action.payload.profile,
        error: action.payload.err
      };
    default:
      return state;
  }
}

const initialState = {
  profile: null,
  error: ""
};

const Profile = ({ auth }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { profile, error } = state;

  useEffect(() => {
    auth.getProfile((userProfile, err) => {
      dispatch({
        type: "UPDATE_PROFILE",
        payload: {
          err,
          profile: userProfile
        }
      });
    });
  }, [auth]);  

  return (
    <div>
      <h1>Profile</h1>
      {profile && !error && (
        <>
          <img
            style={{ maxWidth: "50px", maxHeight: "50px" }}
            src={profile.picture}
            alt="profile pic."
          />
          <h2>{`${profile.given_name} ${profile.family_name}`}</h2>
          <h3>{profile.email}</h3>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </>
      )}
    </div>
  );
};

export default Profile;
