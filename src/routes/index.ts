import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { PlanPackageRoutes } from '../app/modules/package/package.route';
import { FolderRoutes } from '../app/modules/folder/folder.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/plan-package',
    route: PlanPackageRoutes,
  },
  {
    path: '/folder',
    route: FolderRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
