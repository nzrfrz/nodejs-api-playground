"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fnbPaginatedQuery = void 0;
const models_1 = require("../../models");
;
const fnbPaginatedQuery = (page, limit, availability, searchValue, priceFilter, dateFilter, category) => __awaiter(void 0, void 0, void 0, function* () {
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
    // Add a filter for category ID if provided
    const categoryFilter = category ? {
        "category.id": category
    } : {};
    // Combine both filters into the `$match` stage
    const matchStage = {
        $match: Object.assign(Object.assign(Object.assign({}, availabilityFilter), searchFilter), categoryFilter)
    };
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
    // Determine the sort order based on the inputs
    let sortStage = { _id: -1 }; // Default to sorting by `_id` in descending order
    // Initialize an empty sort object
    sortStage = {};
    // Apply price filter if specified
    if (priceFilter === "high-to-low") {
        sortStage.price = -1;
    }
    else if (priceFilter === "low-to-high") {
        sortStage.price = 1;
    }
    // Apply date filter if specified
    if (dateFilter === "newest") {
        sortStage.createdAt = -1;
    }
    else if (dateFilter === "oldest") {
        sortStage.createdAt = 1;
    }
    // If neither filter is specified, fallback to default
    if (Object.keys(sortStage).length === 0) {
        sortStage = { _id: -1 };
    }
    const totalCountResult = yield models_1.FNB.aggregate(totalCountPipeline).exec();
    const totalCount = totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;
    const paginatedPipeline = [
        ...commonStages,
        { $sort: sortStage },
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
    const paginatedResult = yield models_1.FNB.aggregate(paginatedPipeline).exec();
    return {
        meta: {
            page: Number(page) + 1,
            limit: Number(limit),
            totalPage: totalCount,
        },
        itemList: paginatedResult
    };
});
exports.fnbPaginatedQuery = fnbPaginatedQuery;
//# sourceMappingURL=_fnbPaginatedQuery.js.map