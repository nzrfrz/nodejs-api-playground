import mongoose, { Document, Model } from "mongoose";

export interface FnBProps extends Document {
  name: string,
  description: string,
  image: {
    url: string,
    thumbnailUrl: string,
    fileName: string
  },
  price: number,
  status: string,
  category: {
    id: string,
    title: string,
    slug: string,
  },
  updatedAt: string,
  createdAt: string,
};

const FnbSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: {
      url: String,
      thumbnailUrl: String,
      fileName: String
    },
    price: Number,
    status: String,
    category: {
      id: String,
      title: String,
      slug: String,
    },
    updatedAt: String,
    createdAt: String,
  },
  {
    timestamps: true,
  }
);

FnbSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

FnbSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

export const FNB: Model<FnBProps> = mongoose.model<FnBProps>("fnbs", FnbSchema);