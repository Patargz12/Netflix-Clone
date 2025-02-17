import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AccountsPage } from './pages/Accounts.page';
import { HomePage } from './pages/Home.page';
import { LoginPage } from './pages/Login.page';
import { MenuPage } from './pages/Menu.page';
import { TrailerPage } from './pages/Trailer.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/accounts',
    element: <AccountsPage />,
  },
  {
    path: '/menu',
    element: <MenuPage />,
  },
  {
    path: '/watch/:movieId',
    element: <TrailerPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
