import { Schema, model} from "mongoose"

const productSchema = new Schema(
    {
        name: { type: String, required: true},
        description: { type: String, required: true},
        price: {type: Number, required: true},
        image: {type: String, required: true}
    },
    {
        timestamps: true
    }
)

export const productModel= model("product", productSchema)