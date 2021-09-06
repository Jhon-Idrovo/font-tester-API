import { model, Schema } from "mongoose";
import { RecoveryCodeItfc } from "../interfaces/recovery_code";

const schema = new Schema<RecoveryCodeItfc>({
  code: Number,
  userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
  iat: Number,
});

export default model<RecoveryCodeItfc>("RecoveryCode", schema);
