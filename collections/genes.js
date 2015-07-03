
Genes = new Meteor.Collection("genes_in_cohort");

///////////////
// SimpleSchema
///////////////



Genes.attachSchema(new SimpleSchema({
  name: { type: String },
  status: { type: String },
  description: { type: String, optional: true },
  previous: { type: [String], optional: true },
  synonym: { type: [String], optional: true }
  // list of samples with high or low activity
  // links to genome browser, genecards
  // Interactions (max or interaction browser)
  // Lollipop (cbio or xena)
  // Gene-omics view (see next slide)
  // Circle map with first neighbors (next slide)
  // slide 2 of 2 of the keynote
}));
