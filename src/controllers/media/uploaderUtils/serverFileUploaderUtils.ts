import { fileTypeList } from "./fileTypeList";

export const setDestinationPath = (file: Express.Multer.File) => {
  const fileTargetPath = fileTypeList.find((item) => item.mimeType === file.mimetype)?.alias + 's';
  const destinationPath = `./uploads/${fileTargetPath}/`;
  return destinationPath;
};

export const getDestPathByFilename = (fileName: string) => {
  const splitFilename = fileName.split('.');
  const fileUID = splitFilename[0];
  const fileFormat = splitFilename[1];
  // console.log(splitFilename, fileUID, fileFormat);
  
  const getTargetPath = fileTypeList.find((item) => item.fileType === fileFormat).alias + 's';

  const completeFilePath = {
    fileUID,
    targetPath: getTargetPath,
    originalFilePath: '',
    thumbnailPath: '',
  };

  if (getTargetPath === 'images') {
    completeFilePath.originalFilePath = `./uploads/${getTargetPath}`;
    completeFilePath.thumbnailPath = `./uploads/${getTargetPath}/thumbnails`
  }
  else completeFilePath.originalFilePath = `./uploads/${getTargetPath}`;

  return completeFilePath;
};

export const isFileFormatAllowed = (file: Express.Multer.File) => {
  const fileTargetPath = fileTypeList.find((item) => item.mimeType === file.mimetype).isAllowed;
  return fileTargetPath;
};