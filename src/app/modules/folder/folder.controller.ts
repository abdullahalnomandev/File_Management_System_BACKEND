import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { FolderService } from "./folder.service";

// ✅ Create Folder
const create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const folderData = req.body;
  const user = req.user;
  folderData.user_id = user.id;
  const result = await FolderService.createFolderToDB(folderData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Folder created successfully",
    data: result,
  });
});

// ✅ Get All Folders
const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.id;
  const parent_folder_id = Number(req.query.parent_folder_id);
  const result = await FolderService.getAllFoldersFromDB(userId, parent_folder_id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Folders retrieved successfully",
    data: result,
  });
});



export const FolderController = {
  create,
 getAll
};