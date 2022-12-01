import { model, Schema } from "mongoose";

export interface IMediaMetadata {
  views: number;
  likes: number;
  dislikes: number;
}

export interface IMedia {
  source: string;
  title: string;
  uri: string;
  duration: number;
  metadata: IMediaMetadata;
}

const metadataSchema = new Schema<IMediaMetadata>(
  {
    views: { type: Number, required: true, default: 0 },
    likes: { type: Number, required: true, default: 0 },
    dislikes: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const mediaSchema = new Schema<IMedia>({
  source: { type: String, required: true },
  title: { type: String, required: true },
  uri: { type: String, required: true },
  duration: { type: Number, required: true },
  metadata: { type: metadataSchema, required: true, default: () => ({}) },
});

mediaSchema.index({ source: 1, uri: 1 }, { unique: true });

const Media = model<IMedia>("Media", mediaSchema, "media");

export default Media;
