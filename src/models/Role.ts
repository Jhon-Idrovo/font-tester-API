import { model, Schema } from "mongoose";
import { RoleItfc } from "./interfaces/roles";

const roleSchema = new Schema<RoleItfc>({
  name: String,
});

export default model<RoleItfc>("Role", roleSchema);
