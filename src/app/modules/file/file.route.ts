import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { FileController } from './file.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN,USER_ROLES.USER),
  fileUploadHandler(),
  FileController.create
);

// router.get(
//   '/',
//   auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN,USER_ROLES.USER),
//   FileController.getAll
// );


export const FileRoutes = router;
