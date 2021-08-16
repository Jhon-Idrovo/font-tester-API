import { model, Schema } from "mongoose";
import { IFont } from "./interfaces/fonts";


const fontSchema = new Schema<IFont>({
	family:String, category:String
})

export default model<IFont>('Font', fontSchema)