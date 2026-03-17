import { useEffect, useState } from 'react';
import { getEndpointUrl } from '../apiBaseUrl';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchLeaderboard() {
      try {
        const response = await fetch(getEndpointUrl('/leaderboard/'));
        if (!response.ok) {
          throw new Error(`Failed to load leaderboard (${response.status})`);
        }

        const data = await response.json();
        if (isMounted) {
          setEntries(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load leaderboard');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchLeaderboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Leaderboard</h2>

        {loading && <p className="text-secondary mb-0">Loading leaderboard...</p>}

        {!loading && error && <p className="text-danger mb-0">{error}</p>}

        {!loading && !error && entries.length === 0 && (
          <p className="text-secondary mb-0">No leaderboard entries found.</p>
        )}

        {!loading && !error && entries.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User ID</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id || `${entry.user}-${entry.rank}`}>
                    <td>{entry.rank}</td>
                    <td>{entry.user}</td>
                    <td>{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Leaderboard;
