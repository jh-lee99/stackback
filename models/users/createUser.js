

const schema = new Schema({
    email: { type: String, required: true },
    nickname: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    id: { type: String, required: true }
})