import { Document, Model, model, PopulatedDoc, Schema, Types } from "mongoose";
import Media, { IMedia } from "./media.model";

export interface IPlaylistItem {
  title: string;
  start: number;
  end: number;
  duration: number;
  media: PopulatedDoc<Document<Types.ObjectId> & IMedia>;
}

export interface IPlaylist {
  title: string;
  description?: string;
  thumbnail?: string;
  items: IPlaylistItem[];
  owner: Types.ObjectId;
}

const itemSchema = new Schema<IPlaylistItem>(
  {
    title: {
      type: String,
      required: true,
    },
    start: { type: Number, required: true, default: 0 },
    end: { type: Number, required: true },
    media: {
      type: Schema.Types.ObjectId,
      ref: "Media",
      required: true,
    },
  },
  {
    virtuals: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

itemSchema.virtual("duration").get(function () {
  return this.end - this.start;
});

export interface PlaylistModel extends Model<IPlaylist> {
  createItem(
    item: Partial<IPlaylistItem> & { media: Types.ObjectId | string }
  ): Promise<Partial<IPlaylistItem>>;
}

const playlistSchema = new Schema<IPlaylist, PlaylistModel>(
  {
    title: { type: String, required: true },
    description: { type: String },
    thumbnail: { type: String },
    items: { type: [itemSchema], required: true, default: () => [] },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    virtuals: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

playlistSchema.static(
  "createItem",
  async function (
    item: Partial<IPlaylistItem> & { media: Types.ObjectId | string }
  ): Promise<Partial<IPlaylistItem>> {
    const media = await Media.findById(item.media).orFail();
    return {
      end: media.duration,
      title: media.title,
      ...item,
      media,
    };
  }
);

const Playlist = model<IPlaylist, PlaylistModel>(
  "Playlist",
  playlistSchema,
  "playlist"
);

export default Playlist;
