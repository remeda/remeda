import { NavLink } from 'react-router-dom';

export function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <NavLink className="navbar-brand" to="/">
        Remeda
      </NavLink>
      <ul className="navbar-nav mr-auto">
        <li className="nav-item ">
          <NavLink className="nav-link" to="/">
            Home
          </NavLink>
        </li>
        <li className="nav-item  ">
          <NavLink
            className={({ isActive }) => `${isActive ? 'active' : ''} nav-link`}
            to="/docs"
          >
            Documentation
          </NavLink>
        </li>
      </ul>
      <ul className="navbar-nav ">
        <li className="nav-item ">
          <a className="nav-link" href="https://github.com/remeda/remeda">
            GitHub
          </a>
        </li>
      </ul>
    </nav>
  );
}
