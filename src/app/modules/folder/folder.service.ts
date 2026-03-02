import { ListDateTimeFieldRefInput } from './../../../generated/prisma/internal/prismaNamespace';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import db from '../../../shared/prisma';
import { IFolder } from './folder.interface';
import { connect } from 'mongoose';

// Create a new folder
const createFolderToDB = async (payload: IFolder): Promise<IFolder> => {
  const { name, user_id, parent_folder_id } = payload;

  if (!name) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Name is required');
  }

  const parentFolder = parent_folder_id
    ? await db.folder.findUnique({
        where: { id: parent_folder_id },
        select: {
          nesting_level: true,
          user: {
            select: {
              package: {
                select: {
                  max_nesting_folder: true,
                  total_max_folder: true,
                },
              },
            },
          },
        },
      })
    : null;

  const nesting_level = await db.folder.count({
    where:{
      parent_folder_id
    }
  })

  const packageInfo = parentFolder?.user?.package;

  // Check nesting level restriction
  const nextNestingLevel = parentFolder ? nesting_level + 1 : 0;
  if (
    packageInfo?.max_nesting_folder !== undefined &&
    nextNestingLevel >= packageInfo.max_nesting_folder
  ) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Maximum ${packageInfo.max_nesting_folder} nesting levels allowed.`
    );
  }

  // Check total folder limit
  const folderCount = await db.folder.count({
    where: { user_id },
  });

  if (
    packageInfo?.total_max_folder !== undefined &&
    folderCount >= packageInfo.total_max_folder
  ) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Oops! You can only create ${packageInfo.total_max_folder} folders.`
    );
  }

  // Create folder
  const createdFolder = await db.folder.create({
    data: {
      name,
      user_id,
      parent_folder_id: parent_folder_id ?? null,
      nesting_level: nextNestingLevel,
    },
  });

  return createdFolder;
};

// Update folder by ID
const updateFolderToDB = async (
  folderId: number,
  payload: Partial<IFolder>
): Promise<IFolder> => {
  const existing = await db.folder.findUnique({ where: { id: folderId } });
  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Folder not found');
  }

  const updatedFolder = await db.folder.update({
    where: { id: folderId },
    data: {
      name: payload.name ?? existing.name,
      parent_folder_id: payload.parent_folder_id ?? existing.parent_folder_id,
      nesting_level: payload.nesting_level ?? existing.nesting_level,
      total_files: payload.total_files ?? existing.total_files,
    },
  });

  return updatedFolder;
};

// Delete folder by ID
const deleteFolderFromDB = async (
  folderId: number
): Promise<{ message: string }> => {
  const existing = await db.folder.findUnique({ where: { id: folderId } });
  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Folder not found');
  }

  await db.folder.delete({ where: { id: folderId } });
  return { message: 'Folder deleted successfully' };
};

// Get all folders (optional: can filter by user_id)
const getAllFoldersFromDB = async (userId?: number, parent_folder_id?: number) => {
  const folders = await db.folder.findMany({
    where: userId ? { user_id: userId, parent_folder_id: parent_folder_id ?? undefined } : undefined,
    orderBy: { id: 'asc' },
  });
  return folders;
};

export const FolderService = {
  createFolderToDB,
  updateFolderToDB,
  deleteFolderFromDB,
  getAllFoldersFromDB,
};
