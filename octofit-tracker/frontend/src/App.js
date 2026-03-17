import { NavLink, Navigate, Route, Routes } from 'react-router-dom';

import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import './App.css';

function App() {
  return (
    <div className="container py-4 app-shell">
      <header className="app-header mb-4">
        <div className="brand-row">
          <img
            src={`${process.env.PUBLIC_URL}/octofitapp-small.png`}
            alt="OctoFit logo"
            className="app-brand-logo"
          />
          <div>
            <h1 className="h2 mb-2 app-title">OctoFit Tracker</h1>
            <p className="app-subtitle mb-3">Frontend connected to Django REST API endpoints.</p>
          </div>
        </div>

        <nav className="nav nav-pills gap-2 flex-wrap app-nav">
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `nav-link octofit-nav-link ${isActive ? 'active' : ''}`
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/teams"
            className={({ isActive }) =>
              `nav-link octofit-nav-link ${isActive ? 'active' : ''}`
            }
          >
            Teams
          </NavLink>
          <NavLink
            to="/activities"
            className={({ isActive }) =>
              `nav-link octofit-nav-link ${isActive ? 'active' : ''}`
            }
          >
            Activities
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              `nav-link octofit-nav-link ${isActive ? 'active' : ''}`
            }
          >
            Leaderboard
          </NavLink>
          <NavLink
            to="/workouts"
            className={({ isActive }) =>
              `nav-link octofit-nav-link ${isActive ? 'active' : ''}`
            }
          >
            Workouts
          </NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
