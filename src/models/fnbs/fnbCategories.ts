import mongoose, { Document, Model } from "mongoose";

export interface FnBCategoryProps extends Document {
  title: string,
  slug: string,
  updatedAt: string,
  createdAt: string,
};

const FnbCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    updatedAt: String,
    createdAt: String,
  },
  {
    timestamps: true,
  }
);

FnbCategorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

FnbCategorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

export const FNB_CATEGORIES: Model<FnBCategoryProps> = mongoose.model<FnBCategoryProps>("fnbCategories", FnbCategorySchema);