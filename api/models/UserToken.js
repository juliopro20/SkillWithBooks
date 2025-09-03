import mongoose , {Schema} from 'mongoose'

const TokenSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    token: {
        type: String,
        required: true
    },
    CreatedAt: {
        type: Date,
        default: Date.now,
        expires: 300 //5mins
    }
})

export default mongoose.model("Token", TokenSchema)