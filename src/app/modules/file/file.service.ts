import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import db from '../../../shared/prisma';
import { IFile } from './file.interface';




// Create a new file
const createFileToDB = async (payload: IFile): Promise<IFile> => {
  const { name, user_id, folder_id } = payload;

  if (!name) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Name is required');
  }

  // Check if folder exists
  const folder = folder_id
    ? await db.folder.findUnique({
        where: { id: folder_id },
        select: {
          user_id: true,
        },
      })
    : null;

  if (!folder || folder.user_id !== user_id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid folder ID');
  }

  // Create file
  const createdFile = await db.file.create({
    data: {
      name,
      user_id,
      folder_id: folder_id ?? null,
    },
  });

  return createdFile;
};

export const FileService = {
  createFileToDB,
};
