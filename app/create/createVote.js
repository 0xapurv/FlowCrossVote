import React, { useState } from 'react';

const CreateVote = () => {
  const [duration, setDuration] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [isVoteCreated, setIsVoteCreated] = useState(false);
  const [winner, setWinner] = useState('');
  const [voteTable, setVoteTable] = useState([]);

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleCandidateChange = (index, e) => {
    const updatedCandidates = [...candidates];
    updatedCandidates[index] = e.target.value;
    setCandidates(updatedCandidates);
  };

  const handleAddCandidate = () => {
    setCandidates([...candidates, '']);
  };

  const handleRemoveCandidate = (index) => {
    const updatedCandidates = [...candidates];
    updatedCandidates.splice(index, 1);
    setCandidates(updatedCandidates);
  };

  const handleCreateVote = () => {
    setIsVoteCreated(true);
    const voteResults = candidates.map((candidate) => ({
      name: candidate,
      votes: Math.floor(Math.random() * 100), // Generate random vote count for each candidate
    }));
    const winner = voteResults.reduce(
      (prevWinner, currentCandidate) =>
        currentCandidate.votes > prevWinner.votes ? currentCandidate : prevWinner,
      { votes: -1 }
    );
    setWinner(winner.name);
  };

  // Update the vote table whenever candidates or duration changes
  React.useEffect(() => {
    const updatedVoteTable = candidates.map((candidate, index) => ({
      candidate: candidate,
      votes: 0,
    }));
    setVoteTable(updatedVoteTable);
  }, [candidates]);

  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        <h2 className="text-xl my-10">Create a Vote</h2>
        <div className="center gap-6">
          <label htmlFor="duration" className="text-lg">
            Duration (in hours):
          </label>
          <input
            className="text-black border-secondary p-5 outline-none"
            type="number"
            id="duration"
            value={duration}
            onChange={handleDurationChange}
          />
        </div>

        <h4>Candidates:</h4>
        {candidates.map((candidate, index) => (
          <div key={index} className="flex flex-col gap-4">
            <input
              className="text-black border-secondary p-5 outline-none"
              type="text"
              value={candidate}
              onChange={(e) => handleCandidateChange(index, e)}
            />
            <button onClick={() => handleRemoveCandidate(index)}>Remove</button>
          </div>
        ))}
        <button onClick={handleAddCandidate}>Add Candidate</button>

        <button onClick={handleCreateVote}>Create Vote</button>

        {isVoteCreated && (
          <div>
            <h3>Time's up!</h3>
            <p>The winner is: {winner}</p>
          </div>
        )}
      </div>

      <div className="ml-8">
        <h4>Vote Table:</h4>
        <table className="border-collapse border border-gray-500">
          <thead>
            <tr>
              <th className="border border-gray-500 p-2">Candidate</th>
              <th className="border border-gray-500 p-2">Votes</th>
            </tr>
          </thead>
          <tbody>
            {voteTable.map((vote, index) => (
              <tr key={index}>
                <td className="border border-gray-500 p-2">{vote.candidate}</td>
                <td className="border border-gray-500 p-2">{vote.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateVote;
