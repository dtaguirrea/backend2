import { Schema, model} from "mongoose"

const cartSchema = new Schema(
    {
        products: [
            {
                product: { type:Schema.Types.ObjectId, ref: "product"},
                quantity: { type: Number, required: true}
            }
        ]
    },
    {
        timestamps: true
    }
)

export const cartModel= model("cart", cartSchema)