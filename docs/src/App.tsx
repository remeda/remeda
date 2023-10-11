import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Docs } from './Docs';
import { Home } from './Home';
import { Root } from './Root';

const ROUTER = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: 'docs', element: <Docs /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={ROUTER} />;
}
