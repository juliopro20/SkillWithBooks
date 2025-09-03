import mongoose, {Schema} from 'mongoose';

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profileImage:{
        type: String,
        required: false,
        default: 'https://media.istockphoto.com/id/587805156/vector/profile-picture-vector-illustration.jpg?s=612x612&w=0&k=20&c=gkvLDCgsHH-8HeQe7JsjhlOY6vRBJk_sKW9lyaLgmLo='
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    //will add role
    role: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: 'Role',//refering to the Role model
    }
},
{
    timestamps: true
}

)

export default mongoose.model('users', UserSchema);