// note on "_day" fields:
// These are numbers as counted from patient.on_study_date

Schemas.treatment = new SimpleSchema({
  "drug_name": { type: String }, // better name?
  // if day 3, they started 3 days after starting the trial
  "start_day": { type: Number },
  // if null --> still on treatment
  "end_day": { type: Number, optional: true },
  "reason_for_stop": { type: String, optional: true },
});

Schemas.psaLevel = new SimpleSchema({
  "day": { type: Number },
  "value": { type: Number }
});

// this has to be defined (samples.js has to be down a level)
// console.log(schemas.samplesSchema);

Schemas.topLevel.patients = new SimpleSchema({
  "created_at": { type: Date },
  "viewed": { type: Boolean }, // should it be kept forever? dun dun dunn
  "patient_label": { type: String }, // Patient_ID, ex. DTB-056
  "study_id": { type: String },
  "study_label": { type: String },
  "study_site": { type: String, optional: true },
  "on_study_date": { type: Date, optional: true },
  "off_study_day": { type: Number, optional: true },
  "age": { type: Number, optional: true },
  "gender": { type: String, optional: true },
  "race" : { type: String, optional: true },
  "ethnicity" : { type: String, optional: true },
  "last_known_survival_status" : { type: String, optional: true },
  "neoplasm_disease_stage" : { type: String, optional: true },
  "pathology_T_stage" : { type: String, optional: true },
  "pathology_N_stage" : { type: String, optional: true },
  "pathology_M_stage" : { type: String, optional: true },
  "radiation_therapy" : { type: String, optional: true },
  "radiation_regimen_indication" : { type: String, optional: true },
  "completeness_of_resection" : { type: String, optional: true },
  "number_of_lymph_nodes" : { type: Number, optional: true },
  "gleason_grade" : { type: String, optional: true },
  "baseline_psa" : { type: Number, optional: true },
  "psa_nadir" : { type: Number, optional: true },
  "psa_nadir_days" : { type: Number, optional: true },
  // for timeline
  "psa_trend": { type: [Schemas.psaLevelSchema], optional: true },
  "treatments": {
    type: [Schemas.treatment],
    optional: true
  },
  "samples": {
    type: [Schemas.samples],
    optional: true
  }
});
