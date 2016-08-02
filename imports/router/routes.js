import Home from '../ui/pages/Home.jsx';
import NotFound from '../ui/pages/NotFound.jsx';
import Lots from '../ui/components/Lots.jsx';

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/lots',
    component: Lots
  },
  {
    path: '*',
    component: NotFound
  }
];

export default routes;
