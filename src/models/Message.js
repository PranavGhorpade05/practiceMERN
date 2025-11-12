import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  conversationId: { type: String }, // or generate sorted combination of user ids
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  media: String,
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

export default mongoose.model('Message', MessageSchema);
