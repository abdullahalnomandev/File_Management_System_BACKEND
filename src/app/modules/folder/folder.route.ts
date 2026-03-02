import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { FolderController } from './folder.controller';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN,USER_ROLES.USER),
  FolderController.create
);

router.get(
  '/',
  auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN,USER_ROLES.USER),
  FolderController.getAll
);


export const FolderRoutes = router;