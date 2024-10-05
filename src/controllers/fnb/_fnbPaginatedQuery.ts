import { AnyDocument } from "../../_utils";
import { FNB } from "../../models";

export interface FNBPaginatedProps<T> {
  meta: {
    page: number;
    limit: number;
    totalPage: number;
  };
  fnbList: T[];
};

export const fnbPaginatedQuery = async <T extends AnyDocument>(
  page: number,
  limit: number,
  availability: string,
  searchValue: string,
): Promise<FNBPaginatedProps<T>> => {
  limit = Math.max(0, limit || 0);
  page = Math.max(0, page || 0);

  const skip = page * limit;
  const isNumeric = !isNaN(Number(searchValue));
  
  /**
   * First, query based on `availability` (status).
   * Availability filter logic:
   - If availability is "available", match only "AVAILABLE"
   - If availability is "unavailable", match only "UNAVAILABLE"
   - If no availability is provided, don't filter by status
   */
  const availabilityFilter = availability ? {
    status: availability.toLowerCase() === 'available'
      ? 'AVAILABLE' // Only match "AVAILABLE"
      : availability.toLowerCase() === 'unavailable'
        ? 'UNAVAILABLE' // Only match "UNAVAILABLE"
        : { $regex: availability.toUpperCase(), $options: "i" }
  } : {};

  // Then, add other search conditions based on `searchValue`
  const searchFilter = searchValue ? {
    $or: [
      { name: { $regex: searchValue, $options: "i" } },
      isNumeric ? { price: Number(searchValue) } : null,
      { "category.slug": { $regex: searchValue, $options: "i" } }
    ].filter(Boolean)
  } : {};

  // Combine both filters into the `$match` stage
  const matchStage = {
    $match: {
      ...availabilityFilter, // Add availability filter first
      ...searchFilter // Then add search filters
    }
  }

  const commonStages = [
    ...[matchStage].filter(stage => Object.keys(stage).length > 0)
  ];

  // Get the total count of documents that match the criteria
  const totalCountPipeline = [
    ...commonStages,
    {
      $count: "totalCount"
    }
  ];

  const totalCountResult = await FNB.aggregate(totalCountPipeline as any).exec();
  const totalCount = totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;

  const paginatedPipeline = [
    ...commonStages,
    { $sort: { _id: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        id: { $toString: "$_id" },
        name: 1,
        description: 1,
        image: 1,
        price: 1,
        category: 1,
        status: 1,
        _id: 0,
      }
    }
  ];

  const paginatedResult = await FNB.aggregate(paginatedPipeline as any).exec();
  
  return {
    meta: {
      page: Number(page) + 1,
      limit: Number(limit),
      totalPage: totalCount,
    },
    fnbList: paginatedResult
  };
};