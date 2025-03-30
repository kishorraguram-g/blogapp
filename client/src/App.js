import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContextProvider } from "./UserContext";
import IndexPage from "./pages/IndexPage";
import RegisterPage from "./pages/RegistrationPage";
import Mypost from "./components/Myposts";
import CreatePosts from "./components/CreatePosts";
import LoginPage from "./pages/LoginPage";
import HomePage from "./components/HomePage";
import Profile from "./components/Profile";

const App = () => {
  const [posts,setPosts]=useState([])
  const [profilename,setProfilename]=useState("")
  const [userId,setUserId]=useState("")
  const [portfoliolink,setPortfoliolink]=useState("")
  useEffect(()=>{
    console.log(posts) 
    console.log("Current profilename:", profilename);
    console.log("Curret UserId:",userId)
  },[posts,profilename,userId])
  return (
    <UserContextProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage setProfilename={setProfilename}
              setUserId={setUserId}
            />}/>
            <Route path="/myposts" element={<Mypost
                  username={profilename}
            />} />
            <Route path="/createposts" element={<CreatePosts
                setPosts={setPosts}
                profilename={profilename}
                userId={userId}
            />}/>
            <Route path="/profile" element={<Profile
              username={profilename}
              setPortfoliolink={setPortfoliolink}
              portfoliolink={portfoliolink}
            />}/>
            <Route path="/home" element={<HomePage
              posts={posts}
              username={profilename}
            />}/>
          </Routes>
        </div>
      </Router>
    </UserContextProvider>
  );
};

export default App;