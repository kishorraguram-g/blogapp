import React, { useState, useEffect } from 'react';
import { CgProfile } from "react-icons/cg";
import { FaEdit, FaTrash } from "react-icons/fa";
import './Profile.css';
import Header from '../Header';
import { Link } from 'react-router-dom';

const Profile = ({ username, setPortfoliolink, porfoliolink }) => {
    const [localportfoliolink, localsetPortfoliolink] = useState('');
    const [isPortfolioSet, setIsPortfolioSet] = useState(false);
    const [editingPortfolio, setEditingPortfolio] = useState(false);

    // Check if the prop 'porfoliolink' is empty (not set)
    useEffect(() => {
        if (porfoliolink && porfoliolink !== "") {
            localsetPortfoliolink(porfoliolink);
            setIsPortfolioSet(true);
        } else {
            const fetchPortfolioLink = async () => {
                try {
                    const response = await fetch(`http://localhost:4000/getPortfolio/${username}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.portfolioLink) {
                            localsetPortfoliolink(data.portfolioLink);
                            setIsPortfolioSet(true);
                        }
                    } else {
                        console.error("Failed to fetch portfolio link");
                    }
                } catch (error) {
                    console.error("Error fetching portfolio link:", error);
                }
            };

            if (username) {
                fetchPortfolioLink();
            }
        }
    }, [username, porfoliolink]); // Depend on both username and prop portfolio link

    // Handle portfolio link save (update)
    const handleSavePortfolioLink = async () => {
        const updatedPortfolio = {
            username,
            portfolioLink: localportfoliolink
        };
        try {
            const response = await fetch('http://localhost:4000/updatePortfolio', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPortfolio)
            });

            if (response.ok) {
                setIsPortfolioSet(true);
                setPortfoliolink(localportfoliolink);  // Optionally, update parent component state
                setEditingPortfolio(false); // Stop editing
            } else {
                console.error("Failed to save portfolio link");
            }
        } catch (error) {
            console.error("Error saving portfolio link:", error);
        }
    };

    // Handle portfolio link delete
    const handleDeletePortfolioLink = async () => {
        try {
            const response = await fetch('http://localhost:4000/deletePortfolio', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });

            if (response.ok) {
                setIsPortfolioSet(false);
                localsetPortfoliolink(''); // Clear the portfolio link
                setPortfoliolink(''); // Optionally, update parent component state
            } else {
                console.error("Failed to delete portfolio link");
            }
        } catch (error) {
            console.error("Error deleting portfolio link:", error);
        }
    };

    return (
        <div>
            <Header />
            
            <div className='profile-container'>
                <div className='profileicon'>
                    <CgProfile size={150} />
                </div>
                <h1 className='profilename'>{username}</h1>
                <p>Welcome to the profile page of {username}!</p>
                <Link  to='/'>Sign Out</Link>
                
                {!isPortfolioSet ? (
                    <>
                        <p>Please enter your portfolio link:</p>
                        <input
                            type="text"
                            value={localportfoliolink}
                            onChange={(e) => localsetPortfoliolink(e.target.value)}
                            className="portfolio-input"
                        />
                        <button onClick={handleSavePortfolioLink} className="save-portfolio-btn">
                            Save Portfolio Link
                        </button>
                    </>
                ) : (
                    <>
                        <h3>
                            <a href={localportfoliolink} target='_blank' rel="noopener noreferrer">
                                My Portfolio Link
                            </a>
                        </h3>
                        <div className="portfolio-actions">
                            {editingPortfolio ? (
                                <div>
                                    <input
                                        type="text"
                                        value={localportfoliolink}
                                        onChange={(e) => localsetPortfoliolink(e.target.value)}
                                        className="edit-input"
                                    />
                                    <button onClick={handleSavePortfolioLink} className="save-btn">
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <FaEdit className="edit-icon" onClick={() => setEditingPortfolio(true)} />
                                    <FaTrash className="delete-icon" onClick={handleDeletePortfolioLink} />
                                </div>
                            )}
                        </div>
                        
                    </>
                )}
            </div>
            
        </div>
    );
};

export default Profile;
