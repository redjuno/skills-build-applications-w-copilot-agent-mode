import { useEffect, useState } from 'react';
import { getEndpointUrl } from '../apiBaseUrl';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchUsers() {
      try {
        const response = await fetch(getEndpointUrl('/users/'));
        if (!response.ok) {
          throw new Error(`Failed to load users (${response.status})`);
        }

        const data = await response.json();
        if (isMounted) {
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load users');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Users</h2>

        {loading && <p className="text-secondary mb-0">Loading users...</p>}

        {!loading && error && <p className="text-danger mb-0">{error}</p>}

        {!loading && !error && users.length === 0 && (
          <p className="text-secondary mb-0">No users found.</p>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Hero Alias</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id || user.email}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.hero_alias}</td>
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

export default Users;
