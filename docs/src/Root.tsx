import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Root(): JSX.Element {
  return (
    <div className="wrapper">
      <Header />
      <Outlet />
    </div>
  );
}
