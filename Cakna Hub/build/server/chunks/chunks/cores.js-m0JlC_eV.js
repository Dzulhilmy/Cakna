const cores = [
  { id: "assist", name: "Assist", tagline: "Welfare & aid", programs: ["Sejuta Senyuman"], pic: ["Cakna"], icon: "HeartHandshake" },
  { id: "biz", name: "Biz", tagline: "Business & governance", programs: ["MKT Blast", "HSC"], pic: ["Finance", "MKTG"], icon: "Briefcase" },
  { id: "circle", name: "Circle", tagline: "Health & care", programs: ["BMI", "See-Heart"], pic: ["MI", "BOD", "FO", "Cakna"], icon: "HeartPulse" },
  { id: "digital", name: "Digital", tagline: "Digital innovation & community apps", programs: ["Cakna App", "Edu App", "Biz App"], pic: ["IT", "MKTG", "QCXIS"], icon: "Smartphone" },
  { id: "edu", name: "Edu", tagline: "Education & human development", programs: ["Edu Maths", "Edu Care", "Edu Lab"], pic: ["RBE", "Training", "Cakna"], icon: "GraduationCap" },
  { id: "future", name: "Future", tagline: "Leadership & new-generation motivation", programs: ["Program Kepimpinan", "Seminar SPM"], pic: ["Training"], icon: "Rocket" },
  { id: "green", name: "Green", tagline: "Environmental sustainability & green community", programs: ["Go Green", "Green Cycle", "Green Light"], pic: ["Logistik", "MI", "IT"], icon: "Leaf" }
];
function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function getCore(id) {
  return cores.find((c) => c.id === id);
}

export { cores as c, getCore as g, slugify as s };
//# sourceMappingURL=cores.js-m0JlC_eV.js.map
