import { useEffect, useState } from 'react';
import { getEndpointUrl } from '../apiBaseUrl';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchWorkouts() {
      try {
        const response = await fetch(getEndpointUrl('/workouts/'));
        if (!response.ok) {
          throw new Error(`Failed to load workouts (${response.status})`);
        }

        const data = await response.json();
        if (isMounted) {
          setWorkouts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load workouts');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchWorkouts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Workouts</h2>

        {loading && <p className="text-secondary mb-0">Loading workouts...</p>}

        {!loading && error && <p className="text-danger mb-0">{error}</p>}

        {!loading && !error && workouts.length === 0 && (
          <p className="text-secondary mb-0">No workouts found.</p>
        )}

        {!loading && !error && workouts.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Workout</th>
                  <th>Intensity</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout) => (
                  <tr key={workout.id || `${workout.user}-${workout.workout_name}`}>
                    <td>{workout.user}</td>
                    <td>{workout.workout_name}</td>
                    <td>{workout.intensity}</td>
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

export default Workouts;
