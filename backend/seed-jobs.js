require("dotenv").config();
const mongoose = require("mongoose");
const Job = require("./models/jobModel");
const Corporate = require("./models/corporateModel");

const jobsData = [
  // Software Development (26 jobs)
  { positionName: "Junior Software Engineer", category: "Software Development", jobType: "Full-time", requiredExperience: "0-2 years", salary: 500000, vacancyNumber: 5, cgpaRequirement: 6.5, jobLocation: "Bangalore" },
  { positionName: "Senior Software Engineer", category: "Software Development", jobType: "Full-time", requiredExperience: "5+ years", salary: 1500000, vacancyNumber: 3, cgpaRequirement: 7.0, jobLocation: "Bangalore" },
  { positionName: "Full Stack Developer", category: "Software Development", jobType: "Full-time", requiredExperience: "2-4 years", salary: 850000, vacancyNumber: 4, cgpaRequirement: 6.8, jobLocation: "Hyderabad" },
  { positionName: "Frontend Developer", category: "Software Development", jobType: "Full-time", requiredExperience: "1-3 years", salary: 750000, vacancyNumber: 3, cgpaRequirement: 6.5, jobLocation: "Bangalore" },
  { positionName: "Backend Developer", category: "Software Development", jobType: "Full-time", requiredExperience: "2-5 years", salary: 1000000, vacancyNumber: 4, cgpaRequirement: 6.8, jobLocation: "Pune" },
  { positionName: "DevOps Engineer", category: "Software Development", jobType: "Full-time", requiredExperience: "3-6 years", salary: 1150000, vacancyNumber: 2, cgpaRequirement: 7.0, jobLocation: "Bangalore" },
  { positionName: "Cloud Engineer", category: "Software Development", jobType: "Full-time", requiredExperience: "2-4 years", salary: 1000000, vacancyNumber: 3, cgpaRequirement: 6.8, jobLocation: "Delhi" },
  { positionName: "Machine Learning Engineer", category: "Software Development", jobType: "Full-time", requiredExperience: "2-5 years", salary: 1300000, vacancyNumber: 3, cgpaRequirement: 7.2, jobLocation: "Bangalore" },
  { positionName: "Data Engineer", category: "Software Development", jobType: "Full-time", requiredExperience: "2-4 years", salary: 1000000, vacancyNumber: 3, cgpaRequirement: 6.8, jobLocation: "Mumbai" },
  { positionName: "QA Engineer", category: "Software Development", jobType: "Full-time", requiredExperience: "1-3 years", salary: 650000, vacancyNumber: 5, cgpaRequirement: 6.5, jobLocation: "Bangalore" },
  { positionName: "Automation Engineer", category: "Software Development", jobType: "Full-time", requiredExperience: "2-4 years", salary: 900000, vacancyNumber: 3, cgpaRequirement: 6.8, jobLocation: "Pune" },
  { positionName: "Mobile Developer (iOS)", category: "Software Development", jobType: "Full-time", requiredExperience: "2-4 years", salary: 1000000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Bangalore" },
  { positionName: "Mobile Developer (Android)", category: "Software Development", jobType: "Full-time", requiredExperience: "2-4 years", salary: 1000000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Hyderabad" },
  { positionName: "React Developer", category: "Software Development", jobType: "Full-time", requiredExperience: "1-3 years", salary: 800000, vacancyNumber: 4, cgpaRequirement: 6.5, jobLocation: "Bangalore" },
  { positionName: "Node.js Developer", category: "Software Development", jobType: "Full-time", requiredExperience: "2-4 years", salary: 900000, vacancyNumber: 3, cgpaRequirement: 6.8, jobLocation: "Mumbai" },
  { positionName: "Python Developer", category: "Software Development", jobType: "Full-time", requiredExperience: "1-3 years", salary: 750000, vacancyNumber: 4, cgpaRequirement: 6.5, jobLocation: "Pune" },
  { positionName: "Java Developer", category: "Software Development", jobType: "Full-time", requiredExperience: "2-4 years", salary: 900000, vacancyNumber: 3, cgpaRequirement: 6.8, jobLocation: "Delhi" },
  { positionName: "C++ Developer", category: "Software Development", jobType: "Full-time", requiredExperience: "2-5 years", salary: 1050000, vacancyNumber: 2, cgpaRequirement: 7.0, jobLocation: "Bangalore" },
  { positionName: "Go Developer", category: "Software Development", jobType: "Full-time", requiredExperience: "2-4 years", salary: 1000000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Hyderabad" },
  { positionName: "Database Administrator", category: "Software Development", jobType: "Full-time", requiredExperience: "3-6 years", salary: 1150000, vacancyNumber: 2, cgpaRequirement: 7.0, jobLocation: "Mumbai" },
  { positionName: "Software Architect", category: "Software Development", jobType: "Full-time", requiredExperience: "7+ years", salary: 1800000, vacancyNumber: 1, cgpaRequirement: 7.5, jobLocation: "Bangalore" },
  { positionName: "Technical Lead", category: "Software Development", jobType: "Full-time", requiredExperience: "5-7 years", salary: 1450000, vacancyNumber: 2, cgpaRequirement: 7.2, jobLocation: "Pune" },
  { positionName: "Security Engineer", category: "Software Development", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1250000, vacancyNumber: 2, cgpaRequirement: 7.2, jobLocation: "Delhi" },
  { positionName: "Systems Engineer", category: "Software Development", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1100000, vacancyNumber: 3, cgpaRequirement: 6.8, jobLocation: "Bangalore" },
  { positionName: "Solutions Architect", category: "Software Development", jobType: "Full-time", requiredExperience: "5+ years", salary: 1600000, vacancyNumber: 2, cgpaRequirement: 7.2, jobLocation: "Mumbai" },
  { positionName: "Web Developer", category: "Software Development", jobType: "Full-time", requiredExperience: "2-4 years", salary: 850000, vacancyNumber: 4, cgpaRequirement: 6.5, jobLocation: "Hyderabad" },

  // Data Science & Analytics (20 jobs)
  { positionName: "Data Scientist", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "2-4 years", salary: 1150000, vacancyNumber: 3, cgpaRequirement: 7.0, jobLocation: "Bangalore" },
  { positionName: "Senior Data Scientist", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "5+ years", salary: 1700000, vacancyNumber: 2, cgpaRequirement: 7.5, jobLocation: "Bangalore" },
  { positionName: "Analytics Engineer", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "2-4 years", salary: 1000000, vacancyNumber: 3, cgpaRequirement: 6.8, jobLocation: "Hyderabad" },
  { positionName: "Business Analyst", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "1-3 years", salary: 650000, vacancyNumber: 5, cgpaRequirement: 6.5, jobLocation: "Pune" },
  { positionName: "Data Analyst", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "1-3 years", salary: 750000, vacancyNumber: 5, cgpaRequirement: 6.5, jobLocation: "Mumbai" },
  { positionName: "Big Data Engineer", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1250000, vacancyNumber: 2, cgpaRequirement: 7.2, jobLocation: "Bangalore" },
  { positionName: "BI Developer", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "2-4 years", salary: 900000, vacancyNumber: 3, cgpaRequirement: 6.8, jobLocation: "Delhi" },
  { positionName: "Analytics Manager", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "5-7 years", salary: 1350000, vacancyNumber: 1, cgpaRequirement: 7.2, jobLocation: "Bangalore" },
  { positionName: "Statistician", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "2-4 years", salary: 900000, vacancyNumber: 2, cgpaRequirement: 7.0, jobLocation: "Hyderabad" },
  { positionName: "Research Analyst", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "1-3 years", salary: 750000, vacancyNumber: 4, cgpaRequirement: 6.8, jobLocation: "Pune" },
  { positionName: "Predictive Analytics Specialist", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1150000, vacancyNumber: 2, cgpaRequirement: 7.0, jobLocation: "Mumbai" },
  { positionName: "Data Mining Specialist", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "2-4 years", salary: 1000000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Bangalore" },
  { positionName: "Analytics Consultant", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "4-6 years", salary: 1250000, vacancyNumber: 2, cgpaRequirement: 7.2, jobLocation: "Delhi" },
  { positionName: "Data Visualization Specialist", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "2-4 years", salary: 900000, vacancyNumber: 3, cgpaRequirement: 6.8, jobLocation: "Hyderabad" },
  { positionName: "Report Developer", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "1-3 years", salary: 750000, vacancyNumber: 4, cgpaRequirement: 6.5, jobLocation: "Pune" },
  { positionName: "ETL Developer", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "2-4 years", salary: 1000000, vacancyNumber: 3, cgpaRequirement: 6.8, jobLocation: "Mumbai" },
  { positionName: "Data Warehouse Specialist", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1150000, vacancyNumber: 2, cgpaRequirement: 7.0, jobLocation: "Bangalore" },
  { positionName: "AI/ML Specialist", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "3-6 years", salary: 1350000, vacancyNumber: 2, cgpaRequirement: 7.2, jobLocation: "Bangalore" },
  { positionName: "Geospatial Analyst", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "2-4 years", salary: 1000000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Delhi" },
  { positionName: "Risk Analyst", category: "Data Science & Analytics", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1100000, vacancyNumber: 2, cgpaRequirement: 7.0, jobLocation: "Mumbai" },

  // Product & Design (18 jobs)
  { positionName: "Product Manager", category: "Product & Design", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1250000, vacancyNumber: 2, cgpaRequirement: 7.0, jobLocation: "Bangalore" },
  { positionName: "Senior Product Manager", category: "Product & Design", jobType: "Full-time", requiredExperience: "6+ years", salary: 1800000, vacancyNumber: 1, cgpaRequirement: 7.5, jobLocation: "Bangalore" },
  { positionName: "UI/UX Designer", category: "Product & Design", jobType: "Full-time", requiredExperience: "2-4 years", salary: 900000, vacancyNumber: 3, cgpaRequirement: 6.8, jobLocation: "Hyderabad" },
  { positionName: "UX Researcher", category: "Product & Design", jobType: "Full-time", requiredExperience: "2-4 years", salary: 1000000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Pune" },
  { positionName: "Graphic Designer", category: "Product & Design", jobType: "Full-time", requiredExperience: "1-3 years", salary: 650000, vacancyNumber: 4, cgpaRequirement: 6.5, jobLocation: "Mumbai" },
  { positionName: "Web Designer", category: "Product & Design", jobType: "Full-time", requiredExperience: "2-4 years", salary: 800000, vacancyNumber: 3, cgpaRequirement: 6.5, jobLocation: "Bangalore" },
  { positionName: "Interaction Designer", category: "Product & Design", jobType: "Full-time", requiredExperience: "2-4 years", salary: 850000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Delhi" },
  { positionName: "Design Lead", category: "Product & Design", jobType: "Full-time", requiredExperience: "5-7 years", salary: 1350000, vacancyNumber: 1, cgpaRequirement: 7.2, jobLocation: "Bangalore" },
  { positionName: "Creative Director", category: "Product & Design", jobType: "Full-time", requiredExperience: "6+ years", salary: 1600000, vacancyNumber: 1, cgpaRequirement: 7.5, jobLocation: "Mumbai" },
  { positionName: "Brand Designer", category: "Product & Design", jobType: "Full-time", requiredExperience: "2-4 years", salary: 850000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Hyderabad" },
  { positionName: "Motion Designer", category: "Product & Design", jobType: "Full-time", requiredExperience: "2-4 years", salary: 900000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Pune" },
  { positionName: "Design Systems Manager", category: "Product & Design", jobType: "Full-time", requiredExperience: "4-6 years", salary: 1250000, vacancyNumber: 1, cgpaRequirement: 7.0, jobLocation: "Bangalore" },
  { positionName: "Product Operations Manager", category: "Product & Design", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1100000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Delhi" },
  { positionName: "User Researcher", category: "Product & Design", jobType: "Full-time", requiredExperience: "2-4 years", salary: 1000000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Bangalore" },
  { positionName: "Product Analyst", category: "Product & Design", jobType: "Full-time", requiredExperience: "2-4 years", salary: 1000000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Mumbai" },
  { positionName: "Design Thinking Coach", category: "Product & Design", jobType: "Full-time", requiredExperience: "5+ years", salary: 1350000, vacancyNumber: 1, cgpaRequirement: 7.2, jobLocation: "Hyderabad" },
  { positionName: "Prototyping Specialist", category: "Product & Design", jobType: "Full-time", requiredExperience: "2-4 years", salary: 850000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Pune" },
  { positionName: "Accessibility Specialist", category: "Product & Design", jobType: "Full-time", requiredExperience: "2-4 years", salary: 1000000, vacancyNumber: 1, cgpaRequirement: 6.8, jobLocation: "Delhi" },

  // Marketing & Growth (18 jobs)
  { positionName: "Marketing Manager", category: "Marketing & Growth", jobType: "Full-time", requiredExperience: "2-4 years", salary: 900000, vacancyNumber: 3, cgpaRequirement: 6.5, jobLocation: "Bangalore" },
  { positionName: "Senior Marketing Manager", category: "Marketing & Growth", jobType: "Full-time", requiredExperience: "5-7 years", salary: 1450000, vacancyNumber: 2, cgpaRequirement: 7.0, jobLocation: "Mumbai" },
  { positionName: "Growth Hacker", category: "Marketing & Growth", jobType: "Full-time", requiredExperience: "2-4 years", salary: 1000000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Bangalore" },
  { positionName: "SEO Specialist", category: "Marketing & Growth", jobType: "Full-time", requiredExperience: "2-4 years", salary: 800000, vacancyNumber: 3, cgpaRequirement: 6.5, jobLocation: "Hyderabad" },
  { positionName: "Content Marketing Manager", category: "Marketing & Growth", jobType: "Full-time", requiredExperience: "2-4 years", salary: 850000, vacancyNumber: 3, cgpaRequirement: 6.5, jobLocation: "Pune" },
  { positionName: "Social Media Manager", category: "Marketing & Growth", jobType: "Full-time", requiredExperience: "1-3 years", salary: 650000, vacancyNumber: 4, cgpaRequirement: 6.0, jobLocation: "Delhi" },
  { positionName: "Digital Marketing Specialist", category: "Marketing & Growth", jobType: "Full-time", requiredExperience: "2-4 years", salary: 850000, vacancyNumber: 3, cgpaRequirement: 6.5, jobLocation: "Mumbai" },
  { positionName: "Email Marketing Specialist", category: "Marketing & Growth", jobType: "Full-time", requiredExperience: "1-3 years", salary: 750000, vacancyNumber: 3, cgpaRequirement: 6.0, jobLocation: "Bangalore" },
  { positionName: "Performance Marketing Manager", category: "Marketing & Growth", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1100000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Hyderabad" },
  { positionName: "Brand Manager", category: "Marketing & Growth", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1100000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Pune" },
  { positionName: "Marketing Communications Manager", category: "Marketing & Growth", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1050000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Delhi" },
  { positionName: "PR Manager", category: "Marketing & Growth", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1000000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Mumbai" },
  { positionName: "Marketing Analyst", category: "Marketing & Growth", jobType: "Full-time", requiredExperience: "2-4 years", salary: 900000, vacancyNumber: 3, cgpaRequirement: 6.5, jobLocation: "Bangalore" },
  { positionName: "Product Marketing Manager", category: "Marketing & Growth", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1150000, vacancyNumber: 2, cgpaRequirement: 7.0, jobLocation: "Hyderabad" },
  { positionName: "Community Manager", category: "Marketing & Growth", jobType: "Full-time", requiredExperience: "1-3 years", salary: 750000, vacancyNumber: 3, cgpaRequirement: 6.0, jobLocation: "Pune" },
  { positionName: "Marketing Operations Manager", category: "Marketing & Growth", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1100000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Delhi" },
  { positionName: "Demand Generation Manager", category: "Marketing & Growth", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1100000, vacancyNumber: 1, cgpaRequirement: 6.8, jobLocation: "Mumbai" },
  { positionName: "Marketing Coordinator", category: "Marketing & Growth", jobType: "Full-time", requiredExperience: "0-2 years", salary: 500000, vacancyNumber: 5, cgpaRequirement: 6.0, jobLocation: "Bangalore" },

  // Sales & Business Development (15 jobs)
  { positionName: "Sales Executive", category: "Sales & Business Development", jobType: "Full-time", requiredExperience: "1-3 years", salary: 800000, vacancyNumber: 5, cgpaRequirement: 6.0, jobLocation: "Mumbai" },
  { positionName: "Senior Sales Manager", category: "Sales & Business Development", jobType: "Full-time", requiredExperience: "5-7 years", salary: 1600000, vacancyNumber: 2, cgpaRequirement: 7.0, jobLocation: "Bangalore" },
  { positionName: "Account Executive", category: "Sales & Business Development", jobType: "Full-time", requiredExperience: "2-4 years", salary: 950000, vacancyNumber: 3, cgpaRequirement: 6.5, jobLocation: "Delhi" },
  { positionName: "Business Development Manager", category: "Sales & Business Development", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1250000, vacancyNumber: 2, cgpaRequirement: 7.0, jobLocation: "Hyderabad" },
  { positionName: "Sales Development Representative", category: "Sales & Business Development", jobType: "Full-time", requiredExperience: "0-2 years", salary: 600000, vacancyNumber: 5, cgpaRequirement: 6.0, jobLocation: "Pune" },
  { positionName: "Account Manager", category: "Sales & Business Development", jobType: "Full-time", requiredExperience: "2-4 years", salary: 1000000, vacancyNumber: 3, cgpaRequirement: 6.5, jobLocation: "Mumbai" },
  { positionName: "Enterprise Sales Manager", category: "Sales & Business Development", jobType: "Full-time", requiredExperience: "4-6 years", salary: 1500000, vacancyNumber: 1, cgpaRequirement: 7.2, jobLocation: "Bangalore" },
  { positionName: "Inside Sales Representative", category: "Sales & Business Development", jobType: "Full-time", requiredExperience: "1-3 years", salary: 700000, vacancyNumber: 4, cgpaRequirement: 6.0, jobLocation: "Delhi" },
  { positionName: "Sales Operations Manager", category: "Sales & Business Development", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1100000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Hyderabad" },
  { positionName: "Channel Manager", category: "Sales & Business Development", jobType: "Full-time", requiredExperience: "4-6 years", salary: 1350000, vacancyNumber: 1, cgpaRequirement: 7.0, jobLocation: "Pune" },
  { positionName: "Partnership Manager", category: "Sales & Business Development", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1150000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Mumbai" },
  { positionName: "Sales Consultant", category: "Sales & Business Development", jobType: "Full-time", requiredExperience: "2-4 years", salary: 1000000, vacancyNumber: 2, cgpaRequirement: 6.5, jobLocation: "Bangalore" },
  { positionName: "Territory Manager", category: "Sales & Business Development", jobType: "Full-time", requiredExperience: "2-4 years", salary: 1050000, vacancyNumber: 3, cgpaRequirement: 6.5, jobLocation: "Delhi" },
  { positionName: "Sales Analyst", category: "Sales & Business Development", jobType: "Full-time", requiredExperience: "1-3 years", salary: 750000, vacancyNumber: 3, cgpaRequirement: 6.0, jobLocation: "Mumbai" },
  { positionName: "Customer Success Manager", category: "Sales & Business Development", jobType: "Full-time", requiredExperience: "2-4 years", salary: 900000, vacancyNumber: 3, cgpaRequirement: 6.5, jobLocation: "Hyderabad" },

  // Finance & Operations (11 jobs)
  { positionName: "Financial Analyst", category: "Finance & Operations", jobType: "Full-time", requiredExperience: "1-3 years", salary: 800000, vacancyNumber: 3, cgpaRequirement: 6.5, jobLocation: "Mumbai" },
  { positionName: "Senior Financial Analyst", category: "Finance & Operations", jobType: "Full-time", requiredExperience: "4-6 years", salary: 1350000, vacancyNumber: 2, cgpaRequirement: 7.0, jobLocation: "Bangalore" },
  { positionName: "Accountant", category: "Finance & Operations", jobType: "Full-time", requiredExperience: "1-3 years", salary: 700000, vacancyNumber: 3, cgpaRequirement: 6.0, jobLocation: "Delhi" },
  { positionName: "Operations Manager", category: "Finance & Operations", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1100000, vacancyNumber: 2, cgpaRequirement: 6.8, jobLocation: "Hyderabad" },
  { positionName: "Finance Manager", category: "Finance & Operations", jobType: "Full-time", requiredExperience: "4-6 years", salary: 1350000, vacancyNumber: 1, cgpaRequirement: 7.0, jobLocation: "Pune" },
  { positionName: "Budget Analyst", category: "Finance & Operations", jobType: "Full-time", requiredExperience: "2-4 years", salary: 900000, vacancyNumber: 2, cgpaRequirement: 6.5, jobLocation: "Mumbai" },
  { positionName: "Controller", category: "Finance & Operations", jobType: "Full-time", requiredExperience: "7+ years", salary: 1900000, vacancyNumber: 1, cgpaRequirement: 7.5, jobLocation: "Bangalore" },
  { positionName: "Procurement Manager", category: "Finance & Operations", jobType: "Full-time", requiredExperience: "4-6 years", salary: 1250000, vacancyNumber: 1, cgpaRequirement: 7.0, jobLocation: "Delhi" },
  { positionName: "Audit Manager", category: "Finance & Operations", jobType: "Full-time", requiredExperience: "5-7 years", salary: 1450000, vacancyNumber: 1, cgpaRequirement: 7.2, jobLocation: "Mumbai" },
  { positionName: "Tax Specialist", category: "Finance & Operations", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1150000, vacancyNumber: 1, cgpaRequirement: 6.8, jobLocation: "Hyderabad" },
  { positionName: "HR Manager", category: "Finance & Operations", jobType: "Full-time", requiredExperience: "3-5 years", salary: 1100000, vacancyNumber: 2, cgpaRequirement: 6.5, jobLocation: "Pune" },
];

(async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ MongoDB connected");

    // Get first corporate
    console.log("🔍 Looking for corporate...");
    let corporate = await Corporate.findOne();
    
    if (!corporate) {
      console.error("❌ No corporate found. Create one first:\nnode create-corporate.js hr@acmecorp.com SecurePass123! \"Acme Corp\"");
      process.exit(1);
    }

    console.log("✓ Found corporate:", corporate.companyName);

    // Set deadline (30 days from now)
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30);

    // Prepare jobs
    const jobs = jobsData.map((job) => ({
      ...job,
      corporate: corporate._id,
      companyName: corporate.companyName,
      description: `${job.positionName} position at ${corporate.companyName}. Experience required: ${job.requiredExperience}. Salary: ₹${job.salary.toLocaleString('en-IN')}`,
      postedDate: new Date(),
      deadline,
      status: "active",
      applicants: [],
    }));

    console.log(`📝 Inserting ${jobs.length} jobs...`);
    const createdJobs = await Job.insertMany(jobs);
    
    console.log(`✅ Successfully created ${createdJobs.length} jobs!`);
    console.log("\nJobs by category:");
    const categories = {};
    createdJobs.forEach(job => {
      categories[job.category] = (categories[job.category] || 0) + 1;
    });
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`  • ${cat}: ${count} jobs`);
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();