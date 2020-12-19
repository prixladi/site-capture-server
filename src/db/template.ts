import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';

type Size = {
  width: number;
  height: number;
};

type TemplateDoc = mongoose.Document & {
  _id: ObjectID;
  userId: ObjectID;
  name: string;
  sizes: Size[];
  quality: number;
};

const collectionName = 'templates';

const templateSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    userId: { type: mongoose.Types.ObjectId, index: 1 },
    name: String,
    sizes: [
      {
        width: Number,
        height: Number,
      },
    ],
    quality: Number,
  },
  { collection: collectionName, versionKey: false },
);

export default mongoose.model<TemplateDoc>(collectionName, templateSchema, collectionName);
export { TemplateDoc };
