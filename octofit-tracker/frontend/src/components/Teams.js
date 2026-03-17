import { useEffect, useState } from 'react';
import { getEndpointUrl } from '../apiBaseUrl';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchTeams() {
      try {
        const response = await fetch(getEndpointUrl('/teams/'));
        if (!response.ok) {
          throw new Error(`Failed to load teams (${response.status})`);
        }

        const data = await response.json();
        if (isMounted) {
          setTeams(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load teams');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTeams();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Teams</h2>

        {loading && <p className="text-secondary mb-0">Loading teams...</p>}

        {!loading && error && <p className="text-danger mb-0">{error}</p>}

        {!loading && !error && teams.length === 0 && (
          <p className="text-secondary mb-0">No teams found.</p>
        )}

        {!loading && !error && teams.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Universe</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team.id || team.name}>
                    <td>{team.name}</td>
                    <td>{team.universe}</td>
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

export default Teams;
