import Home from '../ui/pages/Home.jsx';
import NotFound from '../ui/pages/NotFound.jsx';
import AdminView from '../ui/components/AdminView.jsx';
import LotListViewContainer from '../ui/components/LotListView.jsx';
import LotViewContainer from '../ui/components/LotView.jsx';
import LabourListViewContainer from '../ui/components/LabourListView.jsx';
import LabourViewContainer from '../ui/components/LabourView.jsx';
import MaterialListViewContainer from '../ui/components/MaterialListView.jsx';
import MaterialViewContainer from '../ui/components/MaterialView.jsx';
import LotBillViewContainer from '../ui/components/LotBillView.jsx';

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/lotList',
    component: LotListViewContainer
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
    path: '/labourList',
    component: LabourListViewContainer
  },
  {
    path: '/labour',
    component: LabourViewContainer
  },
  {
    path: '/labour/:id',
    component: LabourViewContainer
  },
  {
    path: '/materialList',
    component: MaterialListViewContainer
  },
  {
    path: '/material',
    component: MaterialViewContainer
  },
  {
    path: '/material/:id',
    component: MaterialViewContainer
  },
  {
    path: '/lotBill/:type/:lotId',
    component: LotBillViewContainer
  },
  {
    path: '/lotBill/:type/:lotId/:lotBillId',
    component: LotBillViewContainer
  },
  {
    path: '/admin',
    component: AdminView
  },
  {
    path: '*',
    component: NotFound
  }
];

export default routes;
