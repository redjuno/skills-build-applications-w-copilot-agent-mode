import { useEffect, useState } from 'react';
import { getEndpointUrl } from '../apiBaseUrl';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchActivities() {
      try {
        const response = await fetch(getEndpointUrl('/activities/'));
        if (!response.ok) {
          throw new Error(`Failed to load activities (${response.status})`);
        }

        const data = await response.json();
        if (isMounted) {
          setActivities(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load activities');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchActivities();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Activities</h2>

        {loading && <p className="text-secondary mb-0">Loading activities...</p>}

        {!loading && error && <p className="text-danger mb-0">{error}</p>}

        {!loading && !error && activities.length === 0 && (
          <p className="text-secondary mb-0">No activities found.</p>
        )}

        {!loading && !error && activities.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Type</th>
                  <th>Duration (min)</th>
                  <th>Calories</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id || `${activity.user}-${activity.activity_type}`}>
                    <td>{activity.user}</td>
                    <td>{activity.activity_type}</td>
                    <td>{activity.duration_minutes}</td>
                    <td>{activity.calories_burned}</td>
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

export default Activities;
