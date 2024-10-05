import { Model, Document, Types } from "mongoose";

export interface AnyDocument extends Document { };
type Collection<T extends AnyDocument> = Model<T>;

export interface PaginatedQueryProps<T> {
  meta: {
    page: number;
    limit: number;
    totalPage: number;
  };
  dataList: T[];
};

export const insertNewDocument = async (data: Record<string, any>) => {
  return await data.save();
};

export const bulkInsertDocument = async <T extends AnyDocument>(
  collection: Collection<T>,
  data: Record<string, any> | Record<string, any>[],
) => {
  return await collection.create(data);
};

export const readDocument = async <T extends AnyDocument>(
  collection: Collection<T>,
  args: {}
): Promise<T[]> => {
  return await collection.find(args);
};

export const findOneDocument = async <T extends AnyDocument>(
  collection: Collection<T>,
  args: {}
) => {
  const query = collection.where(args);
  return await query.findOne();
};

export const updateByID = async  <T extends AnyDocument>(
  collection: Collection<T>, 
  id: string, 
  data: Record<string, any>
) => {
  return await collection.findByIdAndUpdate(id, data, {new: true});
};

export const deleteByID = async <T extends AnyDocument>(
  collection: Collection<T>, 
  id: string
) => {
  return await collection.findByIdAndDelete(id);
};

export const deleteAll = async <T extends AnyDocument>(
  collection: Collection<T>, 
) => {
  return await collection.deleteMany();
};