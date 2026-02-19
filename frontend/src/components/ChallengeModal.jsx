import React, { useState } from 'react';
import './ChallengeModal.css';


const ChallengeModal = ({ challenge, onClose, onSubmit }) => {
  const artifactUrl = challenge?.artifact_url || '';
  const isRenderLink = artifactUrl.toLowerCase().includes('render.com');

  const [flag, setFlag] = useState('');
  const [showHints, setShowHints] = useState({
    hint1: false,
    hint2: false,
    hint3: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(challenge.id, flag);
  };

  const toggleHint = (hintNumber) => {
    setShowHints(prev => ({
      ...prev,
      [`hint${hintNumber}`]: !prev[`hint${hintNumber}`]
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>{challenge.title}</h2>
        </div>

        <div className="modal-body">
          {challenge.prompt && (
            <div className="challenge-prompt">
              <h3>Prompt</h3>
              <p>{challenge.prompt}</p>
            </div>
          )}

          {/* Download Button */}
          {challenge.artifact_url && (
            <div className="download-section">
              <a
                href={challenge.artifact_url}
                className={`download-button ${isRenderLink ? 'visit-site-button' : ''}`}
                target="_blank"
                rel="noopener noreferrer"
                {...(!isRenderLink ? { download: true } : {})}
              >
                {isRenderLink ? 'Visit Site' : 'Download Challenge File'}
              </a>
            </div>
          )}

          {/* Hints Section */}
          <div className="hints-section">
            {challenge.hint_1 && (
              <div className="hint-item">
                <button 
                  className="hint-toggle"
                  onClick={() => toggleHint(1)}
                >
                  ▶ View Hint: Hint 1
                </button>
                {showHints.hint1 && (
                  <div className="hint-content">
                    {challenge.hint_1}
                  </div>
                )}
              </div>
            )}

            {challenge.hint_2 && (
              <div className="hint-item">
                <button 
                  className="hint-toggle"
                  onClick={() => toggleHint(2)}
                >
                  ▶ View Hint: Hint 2
                </button>
                {showHints.hint2 && (
                  <div className="hint-content">
                    {challenge.hint_2}
                  </div>
                )}
              </div>
            )}

            {challenge.hint_3 && (
              <div className="hint-item">
                <button 
                  className="hint-toggle"
                  onClick={() => toggleHint(3)}
                >
                  ▶ View Hint: Hint 3
                </button>
                {showHints.hint3 && (
                  <div className="hint-content">
                    {challenge.hint_3}
                  </div>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flag-form">
            <input
              type="text"
              placeholder="Flag"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              className="flag-input"
            />
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;