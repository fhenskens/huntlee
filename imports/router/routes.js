import Home from '../ui/pages/Home.jsx';
import NotFound from '../ui/pages/NotFound.jsx';
import LotsView from '../ui/components/LotsView.jsx';

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/lots',
    component: LotsView
  },
  {
    path: '*',
    component: NotFound
  }
];

export default routes;
