const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  isCompleted: {
    type: Boolean,
    default: false,
  },
  dueDate: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// makes sure that the task title is unique per user
taskSchema.index({ title: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Task', taskSchema);
