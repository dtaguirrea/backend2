import { Schema, model} from "mongoose"

const ticketSchema = new Schema(
    {
        code: { type: String, required: true},
        purchase_datetime: { type: Date, required: true, default: Date.now},
        amount: {type: Number, required: true},
        purchaser: {type: String, required: true}
    }
)

export const ticketModel= model("ticket", ticketSchema)