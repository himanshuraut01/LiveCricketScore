import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ScoreCard.css';

const ScoreCard = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const scoreRef = useRef(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(
          'https://api.cricapi.com/v1/currentMatches?apikey=2100fcb2-301d-4ce8-9da6-6b31c55cc5fc&offset=0',
        );
        console.log(response.data); // Log the API response
        setMatches(response.data.data || []); // Set matches or empty array if undefined
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  const handleMatchClick = (match) => {
    setSelectedMatch(selectedMatch === match ? null : match);
    // Scroll to the selected score card
    if (scoreRef.current && selectedMatch !== match) {
      scoreRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="container">
      <div className="score-card">
        {matches?.length > 0 ? (
          matches.map((match, index) => (
            <div
              key={index}
              className={`match-item ${selectedMatch === match ? 'selected' : ''}`}
              onClick={() => handleMatchClick(match)}
            >
              <span>Name: {match.name}</span>
              <span>Match Type: {match.type}</span>
              <span>Status: {match.status}</span>
              <span>Venue: {match.venue}</span>
              <span>Date: {match.date}</span>
            </div>
          ))
        ) : (
          <p>No live scores available</p>
        )}
      </div>
      {selectedMatch && (
        <div className="selected-match-details" ref={scoreRef}>
          <h2>{selectedMatch.name}</h2>
          <p>Match Type: {selectedMatch.type}</p>
          <p>Status: {selectedMatch.status}</p>
          <p>Venue: {selectedMatch.venue}</p>
          <p>Date: {selectedMatch.date}</p>
          {renderScore(selectedMatch.score)}
        </div>
      )}
    </div>
  );
};

const renderScore = (score) => {
  if (score && Array.isArray(score) && score.length > 0) {
    return score.map((inning, index) => (
      <div key={index} className="inning-score">
        <p>Runs: {inning.r}</p>
        <p>Wickets: {inning.w}</p>
        <p>Overs: {inning.o}</p>
        <p>Inning: {inning.inning}</p>
      </div>
    ));
  } else if (score && !Array.isArray(score)) {
    // Handle case where score is not an array but a single object
    return (
      <div className="inning-score">
        <p>Runs: {score.r}</p>
        <p>Wickets: {score.w}</p>
        <p>Overs: {score.o}</p>
        <p>Inning: {score.inning}</p>
      </div>
    );
  }
  return <p>Score Details: N/A</p>; // If score is not available or not in expected format
};

export default ScoreCard;
