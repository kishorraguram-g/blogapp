import React from "react";
import { CgProfile } from "react-icons/cg";
import "./Profile.css";
import Header from "../Header";
import { Link } from "react-router-dom";

const Profile = ({ username }) => {
  return (
    <div>
      <Header />
      <div className="profile-container">
        <div className="profileicon">
          <CgProfile size={150} />
        </div>
        <h1 className="profilename">{username}</h1>
        <Link to="/">Sign Out</Link>
      </div>
    </div>
  );
};

export default Profile;
