// models/service.js

import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  statusUpdates: [
    {
      status: { type: String, required: true },
      description: { type: String, default: '' },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

export default Service;
