import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';

type Size = {
  width: number;
  height: number;
};

type SiteDoc = mongoose.Document & {
  _id: ObjectID;
  userId: ObjectID;
  name: string;
  url: string;
  sizes: Size[];
  quality: number;
  isPublic: boolean;
};

const collectionName = 'sites';

const siteSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    userId: { type: mongoose.Types.ObjectId, index: 1 },
    name: String,
    url: String,
    sizes: [
      {
        width: Number,
        height: Number,
      },
    ],
    quality: Number,
    isPublic: Boolean,
  },
  { collection: collectionName, versionKey: false },
);

export default mongoose.model<SiteDoc>(collectionName, siteSchema, collectionName);
export { SiteDoc };
