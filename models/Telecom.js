const mongoose = require('mongoose');

const telecomSchema = new mongoose.Schema({
  ciID: { type: String, required: true, unique: true },
  providerName: { type: String, required: true },
  serviceType: { type: String, required: true },
  bandwidth: { type: String },
  startPoint: { type: String, required: true },
  endPoint: { type: String, required: true },
  ipRange: { type: String },
  vlanID: { type: String },
  technologyUsed: { type: String },
  routerSwitchEndpoint: { type: String },
  linkStatus: { type: String, enum: ['Active', 'Inactive', 'Degraded'], required: true },
  commissionedDate: { type: Date, required: true },
  contractExpiry: { type: Date },
  supportContact: { type: String },
  monitoringTool: { type: String },
  slaAgreement: { type: String },
  downstreamDependencies: { type: String },
  upstreamDependencies: { type: String },
  responsibleTeam: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Telecom', telecomSchema);