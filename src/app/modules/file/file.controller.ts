import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { FileService } from "./file.service";

// ✅ Create Folder
const create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const folderData = req.body;
  const user = req.user;
  folderData.user_id = user.id;
  const result = await FileService.createFileToDB(folderData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "File created successfully",
    data: result,
  });
});

// ✅ Get All Files
// const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//   const userId = req.user.id;
//   const parent_folder_id = Number(req.query.parent_folder_id);
//   const result = await FileService.getAllFilesFromDB(userId, parent_folder_id);

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "Files retrieved successfully",
//     data: result,
//   });
// });



export const FileController = {
  create,
//  getAll
};