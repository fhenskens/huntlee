import Home from '../ui/pages/Home.jsx';
import NotFound from '../ui/pages/NotFound.jsx';
import LotsViewContainer from '../ui/components/LotsView.jsx';
import LotViewContainer from '../ui/components/LotView.jsx';

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/lots',
    component: LotsViewContainer
  },
  {
    path: '/lot',
    component: LotViewContainer
  },
  {
    path: '/lot/:id',
    component: LotViewContainer
  },
  {
    path: '*',
    component: NotFound
  }
];

export default routes;
