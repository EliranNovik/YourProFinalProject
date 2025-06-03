import React, { useState, useEffect } from 'react';
import './Freelancers.css';
import { Link, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';

export interface ServicePackage {
  id: string;
  name: 'Basic' | 'Pro' | 'Premium';
  description: string;
  price: number;
  timeline: string;
  features: string[];
}

export interface Freelancer {
  id: string;
  name: string;
  avatar: string;
  title: string;
  skills: string[];
  hourlyRate: string;
  location: string;
  email: string;
  portfolio?: string;
  about?: string;
  languages?: string[];
  education?: { degree: string; school: string; year: string }[];
  certifications?: { name: string; issuer: string; year: string }[];
  recentProjects?: { name: string; description: string; technologies: string[]; year: string }[];
  portfolioImages?: { url: string; title: string; description: string; link?: string }[];
  coverImage?: string;
  yearsExperience: number;
  availableHours: number;
  rating?: number;
  reviewCount?: number;
  packages: ServicePackage[];
}

// Updated FREELANCERS array with complete profile data
export const FREELANCERS: Freelancer[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    title: "Full Stack Developer",
    skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB", "GraphQL"],
    yearsExperience: 8,
    hourlyRate: "$85",
    location: "San Francisco, CA",
    email: "sarah.chen@email.com",
    portfolio: "www.sarahchen.dev",
    availableHours: 30,
    about: `Passionate Full Stack Developer with 8 years of experience building scalable web and mobile applications. 
    Specialized in creating robust e-commerce platforms and cloud-native solutions. Strong focus on clean code and 
    performance optimization. Always eager to take on challenging projects and learn new technologies.`,
    languages: ["English (Native)", "Mandarin (Fluent)", "Spanish (Conversational)"],
    education: [
      {
        degree: "Master of Computer Science",
        school: "Stanford University",
        year: "2015"
      },
      {
        degree: "Bachelor of Software Engineering",
        school: "UC Berkeley",
        year: "2013"
      }
    ],
    certifications: [
      {
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        year: "2021"
      },
      {
        name: "MongoDB Certified Developer",
        issuer: "MongoDB",
        year: "2020"
      }
    ],
    recentProjects: [
      {
        name: "E-commerce Platform Redesign",
        description: "Led the complete redesign and development of a high-traffic e-commerce platform serving 100k+ daily users.",
        technologies: ["React", "Node.js", "AWS", "MongoDB"],
        year: "2022"
      },
      {
        name: "Mobile Banking App",
        description: "Developed a secure mobile banking application with real-time transaction processing and biometric authentication.",
        technologies: ["React Native", "TypeScript", "GraphQL", "Firebase"],
        year: "2021"
      },
      {
        name: "Cloud Migration Project",
        description: "Successfully migrated a legacy system to a modern cloud architecture, improving performance by 40%.",
        technologies: ["AWS", "Docker", "Kubernetes", "Node.js"],
        year: "2021"
      }
    ],
    portfolioImages: [
      {
        url: "https://picsum.photos/800/600?random=1",
        title: "E-commerce Platform Dashboard",
        description: "Custom analytics dashboard showing real-time sales data",
        link: ''
      },
      {
        url: "https://picsum.photos/800/600?random=2",
        title: "Mobile Banking App UI",
        description: "Clean and secure mobile banking interface",
        link: ''
      },
      {
        url: "https://picsum.photos/800/600?random=3",
        title: "Cloud Architecture Diagram",
        description: "System architecture for high-availability deployment",
        link: ''
      }
    ],
    coverImage: "https://picsum.photos/1200/300?random=1",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    title: "UI/UX Designer",
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research", "Design Systems"],
    yearsExperience: 6,
    hourlyRate: "$75",
    location: "New York, NY",
    email: "marcus.r@email.com",
    portfolio: "www.marcusdesigns.com",
    availableHours: 40,
    about: `Creative UI/UX Designer with a passion for crafting beautiful and intuitive digital experiences. 
    Combining aesthetic excellence with user-centered design principles to create engaging and functional interfaces. 
    Experienced in leading design teams and collaborating with developers to ensure pixel-perfect implementation.`,
    languages: ["English (Native)", "Portuguese (Fluent)"],
    education: [
      {
        degree: "BFA in Digital Design",
        school: "Parsons School of Design",
        year: "2017"
      }
    ],
    certifications: [
      {
        name: "Google UX Design Professional Certificate",
        issuer: "Google",
        year: "2022"
      }
    ],
    recentProjects: [
      {
        name: "Healthcare App Redesign",
        description: "Complete redesign of a healthcare provider's patient management application, improving user satisfaction by 45%.",
        technologies: ["Figma", "Prototyping", "User Research"],
        year: "2023"
      },
      {
        name: "E-learning Platform UI",
        description: "Designed an intuitive and engaging interface for an online learning platform, supporting over 50,000 students.",
        technologies: ["Adobe XD", "Design System", "User Testing"],
        year: "2022"
      }
    ],
    portfolioImages: [
      {
        url: "https://picsum.photos/800/600?random=4",
        title: "Healthcare App Interface",
        description: "Modern and accessible healthcare management interface",
        link: ''
      },
      {
        url: "https://picsum.photos/800/600?random=5",
        title: "E-learning Platform Design",
        description: "Engaging and intuitive learning experience design",
        link: ''
      },
      {
        url: "https://picsum.photos/800/600?random=6",
        title: "Design System Components",
        description: "Comprehensive UI component library",
        link: ''
      }
    ],
    coverImage: "https://picsum.photos/1200/300?random=2",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "3",
    name: "Emily Watson",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    title: "Data Scientist",
    skills: ["Python", "TensorFlow", "scikit-learn", "SQL", "Data Visualization", "Statistical Analysis"],
    yearsExperience: 5,
    hourlyRate: "$95",
    location: "Boston, MA",
    email: "emily.w@email.com",
    portfolio: "www.emilywatson.ai",
    availableHours: 15,
    about: `Data Scientist with 5 years of experience in machine learning and predictive analytics. 
    Specialized in developing and deploying ML models for business intelligence applications. 
    Strong background in statistical analysis and data visualization.`,
    languages: ["English (Native)", "Python", "R", "SQL"],
    education: [
      {
        degree: "Ph.D. in Data Science",
        school: "MIT",
        year: "2018"
      },
      {
        degree: "M.S. in Applied Mathematics",
        school: "Harvard University",
        year: "2015"
      }
    ],
    certifications: [
      {
        name: "TensorFlow Developer Certificate",
        issuer: "Google",
        year: "2022"
      },
      {
        name: "AWS Machine Learning Specialty",
        issuer: "Amazon Web Services",
        year: "2021"
      }
    ],
    recentProjects: [
      {
        name: "Customer Churn Prediction",
        description: "Developed a machine learning model to predict customer churn with 92% accuracy, helping reduce churn rate by 25%.",
        technologies: ["Python", "TensorFlow", "SQL", "Tableau"],
        year: "2023"
      },
      {
        name: "Sales Forecasting System",
        description: "Created an advanced forecasting system using time series analysis, improving inventory management efficiency by 30%.",
        technologies: ["Python", "Prophet", "Pandas", "AWS"],
        year: "2022"
      }
    ],
    portfolioImages: [
      {
        url: "https://picsum.photos/800/600?random=7",
        title: "Predictive Analytics Dashboard",
        description: "Interactive dashboard showing real-time predictions and model performance metrics",
        link: ''
      },
      {
        url: "https://picsum.photos/800/600?random=8",
        title: "Data Visualization Project",
        description: "Complex data patterns visualized through interactive charts and graphs",
        link: ''
      },
      {
        url: "https://picsum.photos/800/600?random=9",
        title: "ML Model Architecture",
        description: "Architecture diagram of a deployed machine learning system",
        link: ''
      }
    ],
    coverImage: "https://picsum.photos/1200/300?random=3",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "4",
    name: "Alex Kim",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    title: "DevOps Engineer",
    skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "Linux"],
    yearsExperience: 7,
    hourlyRate: "$90",
    location: "Seattle, WA",
    email: "alex.kim@email.com",
    portfolio: "www.alexkimdevops.com",
    availableHours: 0,
    about: `Experienced DevOps Engineer with a strong background in cloud infrastructure and automation. 
    Specialized in implementing CI/CD pipelines and managing cloud-native applications. 
    Passionate about security best practices and infrastructure as code.`,
    languages: ["English (Native)", "Korean (Fluent)", "Japanese (Conversational)"],
    education: [
      {
        degree: "M.S. in Computer Science",
        school: "University of Washington",
        year: "2016"
      },
      {
        degree: "B.S. in Software Engineering",
        school: "Oregon State University",
        year: "2014"
      }
    ],
    certifications: [
      {
        name: "AWS Solutions Architect Professional",
        issuer: "Amazon Web Services",
        year: "2023"
      },
      {
        name: "Certified Kubernetes Administrator",
        issuer: "Cloud Native Computing Foundation",
        year: "2022"
      },
      {
        name: "HashiCorp Certified Terraform Associate",
        issuer: "HashiCorp",
        year: "2021"
      }
    ],
    recentProjects: [
      {
        name: "Enterprise Cloud Migration",
        description: "Led the migration of a large enterprise application to AWS, reducing infrastructure costs by 40% and improving reliability.",
        technologies: ["AWS", "Terraform", "Docker", "Kubernetes"],
        year: "2023"
      },
      {
        name: "CI/CD Pipeline Modernization",
        description: "Redesigned and implemented modern CI/CD pipelines using GitOps principles, reducing deployment time by 70%.",
        technologies: ["Jenkins", "ArgoCD", "Kubernetes", "GitHub Actions"],
        year: "2022"
      },
      {
        name: "Security Automation Framework",
        description: "Developed an automated security scanning and compliance checking system for cloud infrastructure.",
        technologies: ["Python", "AWS Security Hub", "Terraform", "Docker"],
        year: "2022"
      }
    ],
    portfolioImages: [
      {
        url: "https://picsum.photos/800/600?random=10",
        title: "Cloud Architecture Diagram",
        description: "High-level architecture of a scalable cloud infrastructure deployment",
        link: ''
      },
      {
        url: "https://picsum.photos/800/600?random=11",
        title: "CI/CD Pipeline Visualization",
        description: "Complex CI/CD pipeline with multiple stages and environments",
        link: ''
      },
      {
        url: "https://picsum.photos/800/600?random=12",
        title: "Security Dashboard",
        description: "Custom security monitoring and compliance dashboard",
        link: ''
      }
    ],
    coverImage: "https://picsum.photos/1200/300?random=4",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "5",
    name: "Lisa Thompson",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    title: "Digital Marketing Specialist",
    skills: ["Google Analytics", "SEO Tools", "Social Media Management", "Content Creation", "Email Marketing"],
    yearsExperience: 4,
    hourlyRate: "$65",
    location: "Austin, TX",
    email: "lisa.t@email.com",
    portfolio: "www.lisathompson.marketing",
    availableHours: 25,
    about: `Digital Marketing Specialist with expertise in SEO, content strategy, and social media marketing. 
    Proven track record of increasing organic traffic and engagement through data-driven marketing strategies. 
    Passionate about creating compelling content that drives results.`,
    languages: ["English (Native)", "Spanish (Professional)"],
    education: [
      {
        degree: "B.A. in Marketing",
        school: "University of Texas at Austin",
        year: "2019"
      }
    ],
    certifications: [
      {
        name: "Google Analytics Certification",
        issuer: "Google",
        year: "2023"
      },
      {
        name: "HubSpot Inbound Marketing",
        issuer: "HubSpot Academy",
        year: "2022"
      },
      {
        name: "Facebook Blueprint Certification",
        issuer: "Meta",
        year: "2021"
      }
    ],
    recentProjects: [
      {
        name: "E-commerce SEO Optimization",
        description: "Increased organic traffic by 150% and conversion rate by 25% through comprehensive SEO strategy.",
        technologies: ["SEMrush", "Google Analytics", "Ahrefs", "WordPress"],
        year: "2023"
      },
      {
        name: "Social Media Campaign",
        description: "Led a successful social media campaign that increased engagement by 200% and generated 5000+ leads.",
        technologies: ["Facebook Ads", "Instagram", "Hootsuite", "Canva"],
        year: "2022"
      }
    ],
    portfolioImages: [
      {
        url: "https://picsum.photos/800/600?random=13",
        title: "SEO Performance Dashboard",
        description: "Custom dashboard showing organic traffic growth and keyword rankings",
        link: ''
      },
      {
        url: "https://picsum.photos/800/600?random=14",
        title: "Social Media Campaign Results",
        description: "Visual representation of successful social media campaign metrics",
        link: ''
      },
      {
        url: "https://picsum.photos/800/600?random=15",
        title: "Content Strategy Framework",
        description: "Strategic content planning and distribution framework",
        link: ''
      }
    ],
    coverImage: "https://picsum.photos/1200/300?random=5",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "6",
    name: "James Wilson",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    title: "Blockchain Developer",
    skills: ["Solidity", "Web3.js", "Ethereum", "React", "Node.js", "Smart Contract Security"],
    yearsExperience: 4,
    hourlyRate: "$120",
    location: "Miami, FL",
    email: "james.w@email.com",
    portfolio: "www.jameswilson.dev",
    availableHours: 35,
    about: `Blockchain Developer specializing in DeFi applications and smart contract development. 
    Strong focus on security and optimization in blockchain applications. 
    Experienced in building decentralized applications and NFT platforms.`,
    languages: ["English (Native)", "Python", "Solidity", "JavaScript"],
    education: [
      {
        degree: "M.S. in Computer Science",
        school: "University of Miami",
        year: "2019"
      },
      {
        degree: "B.S. in Software Engineering",
        school: "Florida International University",
        year: "2017"
      }
    ],
    certifications: [
      {
        name: "Certified Blockchain Developer",
        issuer: "Blockchain Council",
        year: "2023"
      },
      {
        name: "Smart Contract Security Professional",
        issuer: "Consensys Academy",
        year: "2022"
      }
    ],
    recentProjects: [
      {
        name: "DeFi Lending Platform",
        description: "Developed a decentralized lending platform with automated interest rate adjustment and liquidation mechanisms.",
        technologies: ["Solidity", "Web3.js", "React", "Hardhat"],
        year: "2023"
      },
      {
        name: "NFT Marketplace",
        description: "Built a full-featured NFT marketplace with auction functionality and royalty distribution.",
        technologies: ["Solidity", "IPFS", "React", "Node.js"],
        year: "2022"
      }
    ],
    portfolioImages: [
      {
        url: "https://picsum.photos/800/600?random=16",
        title: "DeFi Platform Interface",
        description: "User interface of a decentralized lending platform",
        link: ''
      },
      {
        url: "https://picsum.photos/800/600?random=17",
        title: "Smart Contract Architecture",
        description: "Detailed architecture diagram of smart contract interactions",
        link: ''
      },
      {
        url: "https://picsum.photos/800/600?random=18",
        title: "NFT Marketplace",
        description: "Screenshots of a successful NFT marketplace implementation",
        link: ''
      }
    ],
    coverImage: "https://picsum.photos/1200/300?random=6",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "7",
    name: "Sofia Garcia",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
    title: "AI/ML Engineer",
    skills: ["Python", "TensorFlow", "PyTorch", "OpenCV", "BERT", "Scikit-learn"],
    yearsExperience: 6,
    hourlyRate: "$110",
    location: "Montreal, CA",
    email: "sofia.g@email.com",
    portfolio: "www.sofiagarcia.ai",
    availableHours: 20,
    about: `AI/ML Engineer with a passion for building intelligent systems. Experienced in computer vision, NLP, and deep learning for real-world applications.`,
    languages: ["English (Fluent)", "French (Native)", "Spanish (Conversational)"],
    education: [
      { degree: "M.S. in Artificial Intelligence", school: "McGill University", year: "2018" }
    ],
    certifications: [
      { name: "Deep Learning Specialization", issuer: "Coursera/Andrew Ng", year: "2020" }
    ],
    recentProjects: [
      { name: "Image Recognition System", description: "Developed a real-time image recognition system for retail analytics.", technologies: ["Python", "TensorFlow", "OpenCV"], year: "2023" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=19", title: "Object Detection Demo", description: "Live object detection in video streams.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=7",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "8",
    name: "David Park",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
    title: "Mobile Game Developer",
    skills: ["Unity", "C#", "Mobile Development", "3D Modeling", "Game Design", "AR/VR"],
    yearsExperience: 7,
    hourlyRate: "$95",
    location: "Los Angeles, CA",
    email: "david.p@email.com",
    portfolio: "www.davidpark.games",
    availableHours: 40,
    about: `Mobile Game Developer with 7 years of experience in Unity and AR/VR. Expert in 3D graphics and interactive gameplay mechanics.`,
    languages: ["English (Native)", "Korean (Fluent)"],
    education: [
      { degree: "B.S. in Computer Science", school: "UCLA", year: "2016" }
    ],
    certifications: [
      { name: "Unity Certified Developer", issuer: "Unity Technologies", year: "2021" }
    ],
    recentProjects: [
      { name: "AR Puzzle Game", description: "Designed and launched a top-rated AR puzzle game on iOS and Android.", technologies: ["Unity", "ARKit", "C#"], year: "2022" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=20", title: "AR Puzzle Game", description: "Screenshots from the AR puzzle game.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=8",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "9",
    name: "Rachel Chen",
    avatar: "https://randomuser.me/api/portraits/women/9.jpg",
    title: "Product Manager",
    skills: ["Product Development", "Agile", "Scrum", "User Stories", "Market Research", "Analytics"],
    yearsExperience: 8,
    hourlyRate: "$105",
    location: "Chicago, IL",
    email: "rachel.c@email.com",
    portfolio: "www.rachelchen.pm",
    availableHours: 0,
    about: `Product Manager with 8 years of experience leading cross-functional teams and launching successful products.`,
    languages: ["English (Native)", "Mandarin (Fluent)"],
    education: [
      { degree: "MBA", school: "University of Chicago Booth", year: "2015" }
    ],
    certifications: [
      { name: "Certified Scrum Product Owner", issuer: "Scrum Alliance", year: "2019" }
    ],
    recentProjects: [
      { name: "SaaS Product Launch", description: "Managed the launch of a SaaS platform used by 10,000+ businesses.", technologies: ["Agile", "Jira", "Analytics"], year: "2022" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=21", title: "SaaS Dashboard", description: "Product dashboard for SaaS launch.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=9",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "10",
    name: "Thomas Schmidt",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    title: "Security Engineer",
    skills: ["Security Testing", "Network Security", "Ethical Hacking", "Security Auditing", "Compliance"],
    yearsExperience: 9,
    hourlyRate: "$115",
    location: "Berlin, DE",
    email: "thomas.s@email.com",
    portfolio: "www.thomasschmidt.security",
    availableHours: 30,
    about: `Security Engineer with deep expertise in penetration testing and compliance. Passionate about keeping systems secure.`,
    languages: ["German (Native)", "English (Fluent)"],
    education: [
      { degree: "M.Sc. in Information Security", school: "TU Berlin", year: "2013" }
    ],
    certifications: [
      { name: "Certified Ethical Hacker", issuer: "EC-Council", year: "2018" }
    ],
    recentProjects: [
      { name: "Enterprise Security Audit", description: "Conducted a full security audit for a multinational corporation.", technologies: ["Kali Linux", "Nessus", "Python"], year: "2023" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=22", title: "Security Audit Report", description: "Sample report from a security audit.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=10",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "11",
    name: "Nina Patel",
    avatar: "https://randomuser.me/api/portraits/women/11.jpg",
    title: "IoT Developer",
    skills: ["Arduino", "Raspberry Pi", "C++", "Python", "MQTT", "IoT Protocols"],
    yearsExperience: 6,
    hourlyRate: "$90",
    location: "Stockholm, SE",
    email: "nina.p@email.com",
    portfolio: "www.ninapatel.tech",
    availableHours: 35,
    about: `IoT Developer with a focus on smart home and sensor network solutions. Experienced in embedded systems and automation.`,
    languages: ["Swedish (Native)", "English (Fluent)"],
    education: [
      { degree: "M.Sc. in Embedded Systems", school: "KTH Royal Institute of Technology", year: "2017" }
    ],
    certifications: [
      { name: "Certified IoT Professional", issuer: "IoT Academy", year: "2021" }
    ],
    recentProjects: [
      { name: "Smart Home Hub", description: "Developed a central hub for smart home device integration.", technologies: ["Arduino", "Python", "MQTT"], year: "2022" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=23", title: "Smart Home Hub", description: "Central hub for smart home devices.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=11",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "12",
    name: "Carlos Martinez",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    title: "VR/AR Developer",
    skills: ["Unity", "Unreal Engine", "C#", "3D Modeling", "WebXR", "ARKit"],
    yearsExperience: 5,
    hourlyRate: "$100",
    location: "Barcelona, ES",
    email: "carlos.m@email.com",
    portfolio: "www.carlosvr.dev",
    availableHours: 20,
    about: `VR/AR Developer with a passion for immersive experiences. Skilled in Unity, Unreal Engine, and 3D modeling.`,
    languages: ["Spanish (Native)", "English (Fluent)"],
    education: [
      { degree: "B.S. in Computer Graphics", school: "Universitat Politècnica de Catalunya", year: "2018" }
    ],
    certifications: [
      { name: "Unity Certified Expert", issuer: "Unity Technologies", year: "2022" }
    ],
    recentProjects: [
      { name: "VR Training Simulator", description: "Built a VR simulator for industrial training.", technologies: ["Unity", "C#", "Oculus SDK"], year: "2023" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=24", title: "VR Training Simulator", description: "Industrial training in VR.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=12",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "13",
    name: "Dr. Emma Watson",
    avatar: "https://randomuser.me/api/portraits/women/13.jpg",
    title: "Bioinformatics Specialist",
    skills: ["Python", "R", "Machine Learning", "NGS Analysis", "Statistical Analysis", "Genomic Tools"],
    yearsExperience: 8,
    hourlyRate: "$120",
    location: "Cambridge, UK",
    email: "emma.w@email.com",
    portfolio: "www.emmawatson.bio",
    availableHours: 30,
    about: `Bioinformatics Specialist with a strong background in genomics and scientific computing. Experienced in NGS analysis and research software.`,
    languages: ["English (Native)", "French (Fluent)"],
    education: [
      { degree: "Ph.D. in Bioinformatics", school: "University of Cambridge", year: "2016" }
    ],
    certifications: [
      { name: "Certified Bioinformatics Professional", issuer: "Bioinformatics Institute", year: "2020" }
    ],
    recentProjects: [
      { name: "Genome Sequencing Pipeline", description: "Developed a scalable pipeline for genome sequencing data analysis.", technologies: ["Python", "R", "NGS Tools"], year: "2022" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=25", title: "Genome Pipeline", description: "Visualization of genome sequencing pipeline.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=13",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "14",
    name: "Yuki Tanaka",
    avatar: "https://randomuser.me/api/portraits/women/14.jpg",
    title: "Quantum Computing Engineer",
    skills: ["Qiskit", "Q#", "Python", "Linear Algebra", "Quantum Circuits", "Physics"],
    yearsExperience: 4,
    hourlyRate: "$150",
    location: "Tokyo, JP",
    email: "yuki.t@email.com",
    portfolio: "www.yukitanaka.quantum",
    availableHours: 40,
    about: `Quantum Computing Engineer with expertise in quantum algorithms and simulation. Passionate about advancing quantum technology.`,
    languages: ["Japanese (Native)", "English (Fluent)"],
    education: [
      { degree: "Ph.D. in Physics", school: "University of Tokyo", year: "2020" }
    ],
    certifications: [
      { name: "Qiskit Developer Certification", issuer: "IBM", year: "2021" }
    ],
    recentProjects: [
      { name: "Quantum Optimization", description: "Implemented quantum algorithms for optimization problems.", technologies: ["Qiskit", "Python", "Q#"], year: "2023" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=26", title: "Quantum Circuit", description: "Quantum circuit for optimization.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=14",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "15",
    name: "Klaus Weber",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    title: "Robotics Engineer",
    skills: ["ROS", "Python", "C++", "Computer Vision", "Motion Planning", "Control Systems"],
    yearsExperience: 10,
    hourlyRate: "$130",
    location: "Munich, DE",
    email: "klaus.w@email.com",
    portfolio: "www.klausweber.robotics",
    availableHours: 25,
    about: `Robotics Engineer with 10 years of experience in industrial automation and vision systems.`,
    languages: ["German (Native)", "English (Fluent)"],
    education: [
      { degree: "Dipl.-Ing. in Robotics", school: "TU Munich", year: "2012" }
    ],
    certifications: [
      { name: "Certified Robotics Professional", issuer: "Robotics Society", year: "2018" }
    ],
    recentProjects: [
      { name: "Automated Assembly Line", description: "Designed and implemented a robotic assembly line for automotive manufacturing.", technologies: ["ROS", "Python", "C++"], year: "2022" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=27", title: "Robotic Assembly Line", description: "Automated assembly line in action.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=15",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "16",
    name: "Sarah Chen",
    title: "UX/UI Designer",
    location: "San Francisco, CA",
    avatar: "https://randomuser.me/api/portraits/women/16.jpg",
    skills: ["UI Design", "UX Research", "Figma", "Adobe XD", "Prototyping"],
    yearsExperience: 6,
    hourlyRate: "$85",
    availableHours: 30,
    about: "Passionate UX/UI designer with a focus on creating intuitive and beautiful digital experiences.",
    languages: ["English", "Mandarin"],
    education: [
      { degree: "BFA in Graphic Design", school: "Academy of Art University", year: "2017" }
    ],
    email: "sarah.chen@example.com",
    portfolio: "www.sarahchen.design",
    rating: 4.7,
    reviewCount: 28,
    certifications: [
      { name: "Google UX Design Certificate", issuer: "Google", year: "2021" }
    ],
    recentProjects: [
      { name: "E-commerce Redesign", description: "Complete UX/UI overhaul for an e-commerce platform", technologies: ["Figma", "Adobe XD"], year: "2023" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=33", title: "E-commerce Design", description: "Recent e-commerce project", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=21",
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "17",
    name: "Marcus Johnson",
    title: "Full Stack Developer",
    location: "Austin, TX",
    avatar: "https://randomuser.me/api/portraits/men/17.jpg",
    hourlyRate: "$95",
    yearsExperience: 8,
    availableHours: 40,
    skills: ["React", "Node.js", "Python", "AWS", "MongoDB"],
    about: "Full stack developer specializing in scalable web applications and cloud architecture.",
    languages: ["English", "Spanish"],
    education: [
      { degree: "BS in Computer Science", school: "University of Texas", year: "2015" }
    ],
    email: "marcus.j@example.com",
    portfolio: "www.marcusjdev.com",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "18",
    name: "Emma Wilson",
    title: "Content Strategist",
    location: "Chicago, IL",
    avatar: "https://randomuser.me/api/portraits/women/18.jpg",
    hourlyRate: "$75",
    yearsExperience: 5,
    availableHours: 25,
    skills: ["Content Strategy", "SEO", "Social Media", "Copywriting", "Analytics"],
    about: "Strategic content creator helping brands tell their story and reach their audience.",
    languages: ["English"],
    education: [
      { degree: "BA in Communications", school: "Northwestern University", year: "2018" }
    ],
    email: "emma.w@example.com",
    portfolio: "www.emmawritescontent.com",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "19",
    name: "David Park",
    title: "Mobile App Developer",
    location: "Seattle, WA",
    avatar: "https://randomuser.me/api/portraits/men/19.jpg",
    hourlyRate: "$90",
    yearsExperience: 7,
    availableHours: 35,
    skills: ["iOS Development", "Swift", "React Native", "Firebase", "App Store Optimization"],
    about: "Mobile app developer with a track record of creating successful apps for startups and enterprises.",
    languages: ["English", "Korean"],
    education: [
      { degree: "MS in Software Engineering", school: "University of Washington", year: "2016" }
    ],
    email: "david.park@example.com",
    portfolio: "www.davidparkapps.dev",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "20",
    name: "Lisa Martinez",
    title: "Digital Marketing Specialist",
    location: "Miami, FL",
    avatar: "https://randomuser.me/api/portraits/women/20.jpg",
    hourlyRate: "$70",
    yearsExperience: 6,
    availableHours: 30,
    skills: ["PPC", "Social Media Marketing", "Email Marketing", "Google Analytics", "Facebook Ads"],
    about: "Results-driven digital marketer specializing in growth strategies and campaign optimization.",
    languages: ["English", "Spanish"],
    education: [
      { degree: "BBA in Marketing", school: "University of Miami", year: "2017" }
    ],
    email: "lisa.m@example.com",
    portfolio: "www.lisamarketing.com",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "21",
    name: "James Cooper",
    title: "DevOps Engineer",
    location: "Portland, OR",
    avatar: "https://randomuser.me/api/portraits/men/21.jpg",
    hourlyRate: "$100",
    yearsExperience: 9,
    availableHours: 40,
    skills: ["Docker", "Kubernetes", "Jenkins", "AWS", "CI/CD"],
    about: "DevOps engineer focused on automating and optimizing infrastructure and deployment processes.",
    languages: ["English"],
    education: [
      { degree: "BS in Systems Engineering", school: "Oregon State University", year: "2014" }
    ],
    email: "james.c@example.com",
    portfolio: "www.jamesdevops.net",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "22",
    name: "Nina Patel",
    title: "Data Scientist",
    location: "Boston, MA",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    hourlyRate: "$95",
    yearsExperience: 5,
    availableHours: 35,
    skills: ["Python", "Machine Learning", "R", "SQL", "Data Visualization"],
    about: "Data scientist passionate about turning complex data into actionable insights.",
    languages: ["English", "Hindi"],
    education: [
      { degree: "MS in Data Science", school: "MIT", year: "2018" }
    ],
    email: "nina.p@example.com",
    portfolio: "www.ninadatascience.com",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "23",
    name: "Alex Thompson",
    title: "Video Editor",
    location: "Los Angeles, CA",
    avatar: "https://randomuser.me/api/portraits/men/23.jpg",
    hourlyRate: "$80",
    yearsExperience: 7,
    availableHours: 30,
    skills: ["Adobe Premiere", "After Effects", "Color Grading", "Motion Graphics", "Sound Design"],
    about: "Creative video editor with experience in commercial and narrative content.",
    languages: ["English"],
    education: [
      { degree: "BA in Film Production", school: "USC", year: "2016" }
    ],
    email: "alex.t@example.com",
    portfolio: "www.alexthompsonedits.com",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "24",
    name: "Rachel Kim",
    title: "Product Manager",
    location: "New York, NY",
    avatar: "https://randomuser.me/api/portraits/women/24.jpg",
    hourlyRate: "$105",
    yearsExperience: 8,
    availableHours: 40,
    skills: ["Product Strategy", "Agile", "User Stories", "Roadmapping", "Analytics"],
    about: "Product manager helping teams build successful products through data-driven decisions.",
    languages: ["English", "Korean"],
    education: [
      { degree: "MBA", school: "Columbia Business School", year: "2015" }
    ],
    email: "rachel.k@example.com",
    portfolio: "www.rachelproduct.com",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "25",
    name: "Michael Brown",
    title: "Cybersecurity Specialist",
    location: "Washington, DC",
    avatar: "https://randomuser.me/api/portraits/men/25.jpg",
    hourlyRate: "$110",
    yearsExperience: 10,
    availableHours: 35,
    skills: ["Penetration Testing", "Security Auditing", "Network Security", "Incident Response"],
    about: "Cybersecurity expert specializing in protecting organizations from digital threats.",
    languages: ["English"],
    education: [
      { degree: "MS in Cybersecurity", school: "George Washington University", year: "2013" }
    ],
    email: "michael.b@example.com",
    portfolio: "www.michaelsecurity.net",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "26",
    name: "Sofia Rodriguez",
    title: "Graphic Designer",
    location: "Denver, CO",
    avatar: "https://randomuser.me/api/portraits/women/26.jpg",
    hourlyRate: "$75",
    yearsExperience: 6,
    availableHours: 30,
    skills: ["Adobe Creative Suite", "Brand Design", "Typography", "Illustration", "Print Design"],
    about: "Versatile graphic designer creating compelling visual solutions for diverse clients.",
    languages: ["English", "Spanish"],
    education: [
      { degree: "BFA in Graphic Design", school: "Rocky Mountain College of Art + Design", year: "2017" }
    ],
    email: "sofia.r@example.com",
    portfolio: "www.sofiarodriguezdesign.com",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "27",
    name: "William Taylor",
    title: "Technical Writer",
    location: "Remote",
    avatar: "https://randomuser.me/api/portraits/men/27.jpg",
    hourlyRate: "$65",
    yearsExperience: 5,
    availableHours: 40,
    skills: ["Technical Documentation", "API Documentation", "Content Management", "Information Architecture"],
    about: "Technical writer specializing in clear, user-friendly documentation for software products.",
    languages: ["English"],
    education: [
      { degree: "BA in Technical Communication", school: "Michigan State University", year: "2018" }
    ],
    email: "william.t@example.com",
    portfolio: "www.williamwrites.com",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "28",
    name: "Olivia Chen",
    title: "SEO Specialist",
    location: "Nashville, TN",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    hourlyRate: "$70",
    yearsExperience: 7,
    availableHours: 35,
    skills: ["SEO", "Content Strategy", "Keyword Research", "Analytics", "Link Building"],
    about: "SEO specialist helping businesses improve their online visibility and organic traffic.",
    languages: ["English"],
    education: [
      { degree: "BS in Digital Marketing", school: "Vanderbilt University", year: "2016" }
    ],
    email: "olivia.g@example.com",
    portfolio: "www.oliviaseo.com",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "29",
    name: "Daniel Lee",
    title: "3D Artist",
    location: "Vancouver, BC",
    avatar: "https://randomuser.me/api/portraits/men/29.jpg",
    hourlyRate: "$85",
    yearsExperience: 6,
    availableHours: 30,
    skills: ["Maya", "ZBrush", "Substance Painter", "Unity", "Unreal Engine"],
    about: "3D artist creating high-quality assets for games and interactive experiences.",
    languages: ["English", "Mandarin"],
    education: [
      { degree: "Diploma in 3D Animation", school: "Vancouver Film School", year: "2017" }
    ],
    email: "daniel.l@example.com",
    portfolio: "www.daniel3dart.com",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "30",
    name: "Isabella Martinez",
    title: "Business Analyst",
    location: "Phoenix, AZ",
    avatar: "https://randomuser.me/api/portraits/women/30.jpg",
    hourlyRate: "$90",
    yearsExperience: 8,
    availableHours: 40,
    skills: ["Business Analysis", "Process Improvement", "Requirements Gathering", "Stakeholder Management"],
    about: "Business analyst bridging the gap between business needs and technical solutions.",
    languages: ["English"],
    education: [
      { degree: "BBA in Business Analytics", school: "Arizona State University", year: "2015" }
    ],
    email: "hannah.a@example.com",
    portfolio: "www.hannahanalyst.com",
    rating: 4.7,
    reviewCount: 28,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "31",
    name: "Ethan Wilson",
    avatar: "https://randomuser.me/api/portraits/men/31.jpg",
    title: "Frontend Developer",
    skills: ["React", "Vue.js", "JavaScript", "CSS", "HTML"],
    yearsExperience: 5,
    hourlyRate: "$80",
    location: "Tel Aviv, Israel",
    email: "noa.levi@email.com",
    portfolio: "www.noalevi.dev",
    availableHours: 35,
    about: "Experienced frontend developer specializing in modern web applications and UI/UX design.",
    languages: ["Hebrew (Native)", "English (Fluent)"],
    education: [
      { degree: "B.Sc. in Computer Science", school: "Tel Aviv University", year: "2018" }
    ],
    certifications: [
      { name: "Certified Web Developer", issuer: "W3C", year: "2020" }
    ],
    recentProjects: [
      { name: "Startup Landing Page", description: "Developed a high-converting landing page for a fintech startup.", technologies: ["React", "CSS"], year: "2022" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=101", title: "Landing Page", description: "Fintech startup landing page.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=101",
    rating: 4.8,
    reviewCount: 19,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "32",
    name: "Sophia Kim",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    title: "Full Stack Engineer",
    skills: ["Node.js", "React", "MongoDB", "TypeScript", "AWS"],
    yearsExperience: 7,
    hourlyRate: "$95",
    location: "Haifa, Israel",
    email: "david.cohen@email.com",
    portfolio: "www.davidcohen.tech",
    availableHours: 30,
    about: "Full stack engineer with a passion for scalable backend systems and cloud infrastructure.",
    languages: ["Hebrew (Native)", "English (Fluent)", "Russian (Conversational)"],
    education: [
      { degree: "M.Sc. in Software Engineering", school: "Technion", year: "2016" }
    ],
    certifications: [
      { name: "AWS Certified Developer", issuer: "Amazon Web Services", year: "2021" }
    ],
    recentProjects: [
      { name: "E-commerce API", description: "Built a robust API for a large e-commerce platform.", technologies: ["Node.js", "MongoDB", "AWS"], year: "2023" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=102", title: "API Architecture", description: "E-commerce API system diagram.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=102",
    rating: 4.9,
    reviewCount: 25,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "33",
    name: "Noah Garcia",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    title: "UX/UI Designer",
    skills: ["Figma", "Sketch", "Adobe XD", "User Research", "Wireframing"],
    yearsExperience: 6,
    hourlyRate: "$85",
    location: "Jerusalem, Israel",
    email: "maya.shapira@email.com",
    portfolio: "www.mayashapira.design",
    availableHours: 20,
    about: "Creative UX/UI designer focused on intuitive and accessible digital experiences.",
    languages: ["Hebrew (Native)", "English (Fluent)"],
    education: [
      { degree: "B.Des. in Visual Communication", school: "Bezalel Academy", year: "2017" }
    ],
    certifications: [
      { name: "Google UX Design Certificate", issuer: "Google", year: "2022" }
    ],
    recentProjects: [
      { name: "Mobile App Redesign", description: "Led the redesign of a popular mobile app for accessibility.", technologies: ["Figma", "User Research"], year: "2022" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=103", title: "App Redesign", description: "Mobile app accessibility redesign.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=103",
    rating: 4.7,
    reviewCount: 17,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "34",
    name: "Ava Thompson",
    avatar: "https://randomuser.me/api/portraits/women/34.jpg",
    title: "DevOps Engineer",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
    yearsExperience: 8,
    hourlyRate: "$100",
    location: "Rishon LeZion, Israel",
    email: "eli.benami@email.com",
    portfolio: "www.elibenami.devops",
    availableHours: 40,
    about: "DevOps engineer with expertise in automation, cloud deployments, and infrastructure as code.",
    languages: ["Hebrew (Native)", "English (Fluent)"],
    education: [
      { degree: "B.Sc. in Information Systems", school: "Bar-Ilan University", year: "2014" }
    ],
    certifications: [
      { name: "Certified Kubernetes Administrator", issuer: "CNCF", year: "2021" }
    ],
    recentProjects: [
      { name: "Cloud Migration", description: "Migrated legacy systems to AWS cloud with zero downtime.", technologies: ["AWS", "Docker", "Terraform"], year: "2023" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=104", title: "Cloud Migration", description: "AWS migration project.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=104",
    rating: 4.8,
    reviewCount: 22,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "105",
    name: "Tamar Goldstein",
    avatar: "https://randomuser.me/api/portraits/women/35.jpg",
    title: "Data Scientist",
    skills: ["Python", "Pandas", "Machine Learning", "SQL", "Data Visualization"],
    yearsExperience: 4,
    hourlyRate: "$90",
    location: "Beer Sheva, Israel",
    email: "tamar.goldstein@email.com",
    portfolio: "www.tamargoldstein.ai",
    availableHours: 25,
    about: "Data scientist with a focus on predictive analytics and business intelligence.",
    languages: ["Hebrew (Native)", "English (Fluent)"],
    education: [
      { degree: "M.Sc. in Data Science", school: "Ben-Gurion University", year: "2020" }
    ],
    certifications: [
      { name: "Data Science Professional Certificate", issuer: "IBM", year: "2021" }
    ],
    recentProjects: [
      { name: "Sales Forecasting", description: "Developed a forecasting model for retail sales.", technologies: ["Python", "Pandas"], year: "2023" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=105", title: "Forecasting Model", description: "Retail sales prediction model.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=105",
    rating: 4.7,
    reviewCount: 15,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "106",
    name: "Lior Mizrahi",
    avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    title: "Personal Trainer",
    skills: ["Fitness Coaching", "Nutrition", "Strength Training", "HIIT", "Motivation"],
    yearsExperience: 8,
    hourlyRate: "$70",
    location: "Tel Aviv, Israel",
    email: "lior.mizrahi@email.com",
    portfolio: "www.liorfit.com",
    availableHours: 30,
    about: "Certified personal trainer helping clients achieve their fitness goals with personalized programs.",
    languages: ["Hebrew (Native)", "English (Fluent)"],
    education: [
      { degree: "Certified Personal Trainer", school: "Wingate Institute", year: "2015" }
    ],
    certifications: [
      { name: "ACE Certified Trainer", issuer: "ACE", year: "2016" }
    ],
    recentProjects: [
      { name: "Corporate Wellness Program", description: "Designed and led a wellness program for a tech company.", technologies: ["Fitness", "Nutrition"], year: "2022" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=106", title: "Group Training", description: "Outdoor group fitness session.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=106",
    rating: 4.9,
    reviewCount: 21,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "107",
    name: "Yossi Azulay",
    avatar: "https://randomuser.me/api/portraits/men/37.jpg",
    title: "Truck Driver",
    skills: ["Logistics", "Long Haul", "Safety", "Route Planning", "Heavy Vehicles"],
    yearsExperience: 12,
    hourlyRate: "$45",
    location: "Haifa, Israel",
    email: "yossi.azulay@email.com",
    portfolio: "www.yossitrucks.com",
    availableHours: 40,
    about: "Experienced truck driver specializing in long-haul and logistics across Israel and Europe.",
    languages: ["Hebrew (Native)", "English (Conversational)"],
    education: [
      { degree: "Professional Truck License", school: "Haifa Driving School", year: "2010" }
    ],
    certifications: [
      { name: "Hazardous Materials License", issuer: "Israel Ministry of Transport", year: "2015" }
    ],
    recentProjects: [
      { name: "International Delivery", description: "Completed a 3-country delivery for a major logistics company.", technologies: ["Logistics", "Safety"], year: "2023" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=107", title: "On the Road", description: "Truck at sunrise on a highway.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=107",
    rating: 4.8,
    reviewCount: 18,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "108",
    name: "Shira Bar-On",
    avatar: "https://randomuser.me/api/portraits/women/36.jpg",
    title: "Photographer",
    skills: ["Portrait Photography", "Event Photography", "Editing", "Lightroom", "Photoshop"],
    yearsExperience: 9,
    hourlyRate: "$85",
    location: "Jerusalem, Israel",
    email: "shira.baron@email.com",
    portfolio: "www.shiraphoto.com",
    availableHours: 20,
    about: "Professional photographer specializing in portraits and events, with a creative and personal touch.",
    languages: ["Hebrew (Native)", "English (Fluent)"],
    education: [
      { degree: "BFA in Photography", school: "Bezalel Academy", year: "2014" }
    ],
    certifications: [
      { name: "Adobe Certified Expert", issuer: "Adobe", year: "2018" }
    ],
    recentProjects: [
      { name: "Wedding Album", description: "Captured and edited a full wedding album for a client.", technologies: ["Photography", "Editing"], year: "2022" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=108", title: "Wedding Shoot", description: "Outdoor wedding photography.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=108",
    rating: 4.9,
    reviewCount: 24,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "109",
    name: "Rachel Green",
    avatar: "https://randomuser.me/api/portraits/women/37.jpg",
    title: "English Teacher",
    skills: ["ESL", "Lesson Planning", "Cambridge Exams", "Online Teaching", "Grammar"],
    yearsExperience: 11,
    hourlyRate: "$60",
    location: "Tel Aviv, Israel",
    email: "rachel.green@email.com",
    portfolio: "www.rachelteaches.com",
    availableHours: 25,
    about: "Certified English teacher with a passion for helping students achieve fluency and confidence.",
    languages: ["English (Native)", "Hebrew (Fluent)"],
    education: [
      { degree: "BA in English Literature", school: "Bar-Ilan University", year: "2012" }
    ],
    certifications: [
      { name: "CELTA", issuer: "Cambridge", year: "2013" }
    ],
    recentProjects: [
      { name: "IELTS Prep Course", description: "Developed and taught an intensive IELTS preparation course.", technologies: ["Teaching", "Exam Prep"], year: "2023" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=109", title: "Classroom", description: "Interactive English lesson.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=109",
    rating: 4.8,
    reviewCount: 20,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "110",
    name: "Avi Shalev",
    avatar: "https://randomuser.me/api/portraits/men/38.jpg",
    title: "Real Estate Agent",
    skills: ["Property Sales", "Negotiation", "Market Analysis", "Customer Service", "Contracts"],
    yearsExperience: 10,
    hourlyRate: "$100",
    location: "Rishon LeZion, Israel",
    email: "avi.shalev@email.com",
    portfolio: "www.avirealestate.com",
    availableHours: 40,
    about: "Experienced real estate agent helping clients buy and sell properties in Israel.",
    languages: ["Hebrew (Native)", "English (Fluent)"],
    education: [
      { degree: "Real Estate License", school: "Israel Real Estate School", year: "2013" }
    ],
    certifications: [
      { name: "Certified Realtor", issuer: "Israel Real Estate Association", year: "2014" }
    ],
    recentProjects: [
      { name: "Luxury Apartment Sale", description: "Closed a record sale for a luxury apartment in Tel Aviv.", technologies: ["Sales", "Negotiation"], year: "2022" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=110", title: "Luxury Apartment", description: "Sold luxury apartment in Tel Aviv.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=110",
    rating: 4.9,
    reviewCount: 23,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "111",
    name: "Dana Weiss",
    avatar: "https://randomuser.me/api/portraits/women/38.jpg",
    title: "Life Coach",
    skills: ["Coaching", "Motivation", "Goal Setting", "Mindfulness", "Workshops"],
    yearsExperience: 7,
    hourlyRate: "$120",
    location: "Jerusalem, Israel",
    email: "dana.weiss@email.com",
    portfolio: "www.danacoach.com",
    availableHours: 20,
    about: "Certified life coach empowering clients to achieve personal and professional growth.",
    languages: ["Hebrew (Native)", "English (Fluent)"],
    education: [
      { degree: "Certified Life Coach", school: "Coaching Academy Israel", year: "2016" }
    ],
    certifications: [
      { name: "ICF Certified Coach", issuer: "ICF", year: "2017" }
    ],
    recentProjects: [
      { name: "Mindfulness Workshop", description: "Led a mindfulness and motivation workshop for young professionals.", technologies: ["Coaching", "Mindfulness"], year: "2023" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=111", title: "Workshop", description: "Life coaching workshop.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=111",
    rating: 4.8,
    reviewCount: 19,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "112",
    name: "Erez Levi",
    avatar: "https://randomuser.me/api/portraits/men/39.jpg",
    title: "Tour Guide",
    skills: ["History", "Storytelling", "Customer Service", "Languages", "Logistics"],
    yearsExperience: 15,
    hourlyRate: "$80",
    location: "Jerusalem, Israel",
    email: "erez.levi@email.com",
    portfolio: "www.erezguides.com",
    availableHours: 30,
    about: "Licensed tour guide with deep knowledge of Israel's history and culture.",
    languages: ["Hebrew (Native)", "English (Fluent)", "French (Conversational)"],
    education: [
      { degree: "Tour Guide License", school: "Israel Ministry of Tourism", year: "2008" }
    ],
    certifications: [
      { name: "Certified Tour Guide", issuer: "Israel Ministry of Tourism", year: "2008" }
    ],
    recentProjects: [
      { name: "Jerusalem Old City Tour", description: "Guided over 100 groups through Jerusalem's Old City.", technologies: ["Guiding", "History"], year: "2023" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=112", title: "Old City Tour", description: "Guiding a group in Jerusalem.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=112",
    rating: 4.9,
    reviewCount: 30,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "113",
    name: "Tali Mor",
    avatar: "https://randomuser.me/api/portraits/women/39.jpg",
    title: "Architect",
    skills: ["Architecture", "AutoCAD", "3D Modeling", "Interior Design", "Project Management"],
    yearsExperience: 13,
    hourlyRate: "$130",
    location: "Tel Aviv, Israel",
    email: "tali.mor@email.com",
    portfolio: "www.talimorarch.com",
    availableHours: 25,
    about: "Award-winning architect specializing in modern residential and commercial projects.",
    languages: ["Hebrew (Native)", "English (Fluent)"],
    education: [
      { degree: "B.Arch.", school: "Technion", year: "2010" }
    ],
    certifications: [
      { name: "Registered Architect", issuer: "Israel Architects Association", year: "2011" }
    ],
    recentProjects: [
      { name: "Luxury Villa Design", description: "Designed a luxury villa in Herzliya.", technologies: ["Architecture", "3D Modeling"], year: "2022" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=113", title: "Villa Design", description: "Modern villa in Herzliya.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=113",
    rating: 4.9,
    reviewCount: 27,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "114",
    name: "Matan Cohen",
    avatar: "https://randomuser.me/api/portraits/men/40.jpg",
    title: "Chef",
    skills: ["Cooking", "Menu Design", "Catering", "Food Safety", "Pastry"],
    yearsExperience: 14,
    hourlyRate: "$110",
    location: "Haifa, Israel",
    email: "matan.cohen@email.com",
    portfolio: "www.matancooks.com",
    availableHours: 20,
    about: "Professional chef with experience in fine dining and catering events.",
    languages: ["Hebrew (Native)", "English (Fluent)"],
    education: [
      { degree: "Diploma in Culinary Arts", school: "Dan Gourmet", year: "2009" }
    ],
    certifications: [
      { name: "Certified Chef", issuer: "Israel Chefs Association", year: "2010" }
    ],
    recentProjects: [
      { name: "Wedding Catering", description: "Head chef for a 200-guest wedding.", technologies: ["Catering", "Menu Design"], year: "2023" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=114", title: "Wedding Banquet", description: "Catering a large wedding.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=114",
    rating: 4.8,
    reviewCount: 22,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  },
  {
    id: "115",
    name: "Ronit Levi",
    avatar: "https://randomuser.me/api/portraits/women/40.jpg",
    title: "Plumber",
    skills: ["Plumbing", "Pipe Repair", "Emergency Service", "Water Heaters", "Renovation"],
    yearsExperience: 16,
    hourlyRate: "$75",
    location: "Beer Sheva, Israel",
    email: "ronit.levi@email.com",
    portfolio: "www.ronitplumbing.com",
    availableHours: 40,
    about: "Licensed plumber providing fast and reliable service for homes and businesses.",
    languages: ["Hebrew (Native)", "English (Conversational)"],
    education: [
      { degree: "Certified Plumber", school: "ORT College", year: "2007" }
    ],
    certifications: [
      { name: "Licensed Plumber", issuer: "Israel Ministry of Labor", year: "2008" }
    ],
    recentProjects: [
      { name: "Office Renovation", description: "Handled all plumbing for a major office renovation.", technologies: ["Plumbing", "Renovation"], year: "2022" }
    ],
    portfolioImages: [
      { url: "https://picsum.photos/800/600?random=115", title: "Office Plumbing", description: "Renovation project in Beer Sheva.", link: '' }
    ],
    coverImage: "https://picsum.photos/1200/300?random=115",
    rating: 4.7,
    reviewCount: 18,
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "A basic package for small projects",
        price: 50,
        timeline: "1-2 weeks",
        features: ["Feature 1", "Feature 2"]
      },
      {
        id: "pro",
        name: "Pro",
        description: "A comprehensive package for medium-sized projects",
        price: 100,
        timeline: "2-4 weeks",
        features: ["Feature 3", "Feature 4"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "A premium package for large-scale projects",
        price: 150,
        timeline: "4-6 weeks",
        features: ["Feature 5", "Feature 6"]
      }
    ]
  }
];

const Freelancers: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFreelancers, setFilteredFreelancers] = useState(FREELANCERS);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [cityMode, setCityMode] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingTarget, setBookingTarget] = useState<null | Freelancer>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // Calendar helpers
  const today = new Date();
  const daysInMonth = (month: Date) => new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = (month: Date) => new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const isToday = (date: Date) => date.toDateString() === today.toDateString();
  const isSelected = (date: Date) => selectedDate && date.toDateString() === new Date(selectedDate).toDateString();
  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(calendarMonth);
    const startDay = firstDayOfWeek(calendarMonth);
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), d);
      const disabled = date < today;
      days.push(
        <button
          key={d}
          className={`calendar-day${isToday(date) ? ' today' : ''}${isSelected(date) ? ' selected' : ''}`}
          disabled={disabled}
          onClick={() => setSelectedDate(date.toISOString())}
        >
          {d}
        </button>
      );
    }
    return days;
  };
  // Time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 8; h <= 20; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`);
      slots.push(`${h.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };
  const TIME_SLOTS = generateTimeSlots();

  // Get unique locations from freelancers
  const allCities = Array.from(new Set(FREELANCERS.map(f => f.location)));

  // Function to get search suggestions based on current input
  const getSearchSuggestions = (input: string) => {
    if (!input) return [];

    const allTerms = FREELANCERS.flatMap(freelancer => [
      ...freelancer.skills,
      freelancer.title
    ]);

    const uniqueTerms = Array.from(new Set(allTerms));
    return uniqueTerms
      .filter(term => term.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5);
  };

  // Function to calculate relevance score for a freelancer based on search query
  const calculateRelevanceScore = (freelancer: Freelancer, query: string) => {
    const searchTerms = query.toLowerCase().split(' ');
    let score = 0;

    searchTerms.forEach(term => {
      // Check name and title
      if (freelancer.name.toLowerCase().includes(term)) score += 5;
      if (freelancer.title.toLowerCase().includes(term)) score += 5;
      if (freelancer.location.toLowerCase().includes(term)) score += 6;
      
      // Check skills
      freelancer.skills.forEach(skill => {
        if (skill.toLowerCase().includes(term)) score += 4;
      });
    });

    return score;
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredFreelancers(FREELANCERS);
      setCityMode(false);
      setSearchSuggestions([]);
      return;
    }
    // If cityMode is true, filter by exact city match
    if (cityMode && allCities.includes(searchQuery)) {
      setFilteredFreelancers(FREELANCERS.filter(f => f.location === searchQuery));
      setSearchSuggestions([]);
      return;
    }
    // Otherwise, general search
    const scored = FREELANCERS.map(freelancer => ({
      freelancer,
      score: calculateRelevanceScore(freelancer, searchQuery)
    }));
    const filtered = scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.freelancer);
    setFilteredFreelancers(filtered.length > 0 ? filtered : []);
    setCityMode(false);
    setSearchSuggestions([]);
  };

  // When user types, update suggestions
  useEffect(() => {
    const suggestions = getSearchSuggestions(searchQuery);
    setSearchSuggestions(suggestions);
  }, [searchQuery]);

  // Function to filter freelancers based on availability
  const filterByAvailability = (freelancers: Freelancer[]) => {
    return freelancers.filter(freelancer => freelancer.availableHours > 0);
  };

  // Helper to get availability class
  const getAvailabilityClass = (hours: number) => {
    if (hours >= 30) return 'available';
    if (hours > 0) return 'partially-available';
    return 'not-available';
  };

  // Handler for Book Me
  const handleBook = (freelancer: Freelancer) => {
    setBookingTarget(freelancer);
    setShowBooking(true);
  };

  // Handler for Message Me
  const handleMessage = (freelancerId: string) => {
    navigate(`/message/freelancer/${freelancerId}`);
  };

  return (
    <div className="with-navbar-padding">
      <div className="freelancers-container">
        <div style={{ marginBottom: '1rem' }}>
        </div>
        <div className="search-section">
          <h1>Find Freelancers</h1>
          <Paper elevation={4} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 4, maxWidth: 600, mx: 'auto', mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', position: 'relative' }}>
            <Box component="form" onSubmit={e => { e.preventDefault(); handleSearch(); }} sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by skills or expertise (e.g., 'web development', 'design'...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                  ),
                }}
                sx={{ background: '#fff', borderRadius: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ borderRadius: 2, px: 4, fontWeight: 600, boxShadow: 2, textTransform: 'none' }}
                endIcon={<SearchIcon />}
              >
                Search
              </Button>
            </Box>
            {searchSuggestions.length > 0 && searchQuery && (
              <Box sx={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e1e1e1', borderRadius: 2, mt: 1, boxShadow: 3, zIndex: 1000 }}>
                {searchSuggestions.map((suggestion, index) => (
                  <Box
                    key={index}
                    sx={{ p: 1.2, cursor: 'pointer', textAlign: 'left', '&:hover': { background: '#f5f7fa' } }}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      handleSearch();
                      setSearchSuggestions([]);
                      setSearchQuery('');
                    }}
                  >
                    {suggestion}
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </div>

        <div className="freelancers-grid">
          {filteredFreelancers.length > 0 ? (
            filteredFreelancers.map(freelancer => (
              <Link to={`/freelancer/${freelancer.id}`} key={freelancer.id} className="freelancer-card-link">
                <div className="freelancer-card">
                  <div className="freelancer-header">
                    <div className={`availability-badge ${getAvailabilityClass(freelancer.availableHours)}`}>
                      {freelancer.availableHours > 0
                        ? `Available for ${freelancer.availableHours}h/week`
                        : 'Not Available'}
                    </div>
                    <div className="freelancer-info-wrapper">
                      <img src={freelancer.avatar} alt={freelancer.name} className="freelancer-avatar" />
                      <div className="freelancer-basic-info">
                        <h2>{freelancer.name}</h2>
                        <div className="freelancer-review-stars">
                          <span className="stars">
                            {[1,2,3,4,5].map(n => (
                              <svg
                                key={n}
                                width="18"
                                height="18"
                                viewBox="0 0 20 20"
                                fill={n <= Math.round(freelancer.rating ?? 0) ? '#FBBF24' : '#E5E7EB'}
                                stroke="#FBBF24"
                                style={{ marginRight: 2 }}
                              >
                                <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
                              </svg>
                            ))}
                            <span className="rating-value">{(freelancer.rating ?? 0).toFixed(1)}</span>
                            <span className="review-count">({freelancer.reviewCount ?? 0})</span>
                          </span>
                        </div>
                        <p className="title">{freelancer.title}</p>
                        <p className="experience">{freelancer.yearsExperience} years of experience</p>
                      </div>
                    </div>
                  </div>

                  <div className="freelancer-details">
                    <div className="skills">
                      <h3>Skills</h3>
                      <div className="skills-list">
                        {freelancer.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div className="rate-section">
                      <span className="rate-label">Rate:</span> <span className="rate-value">{freelancer.hourlyRate}/hr</span>
                    </div>
                    <div className="package-section">
                      <span className="package-label">5-Hour Package:</span> <span className="package-value">${(parseInt(freelancer.hourlyRate.replace('$','')) * 5 * 0.9).toFixed(0)}</span> <span className="package-discount">(Save 10%)</span>
                    </div>

                    <div className="contact-info">
                      <div className="info-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{freelancer.location}</span>
                      </div>
                      <div className="info-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 2L11 13" />
                          <path d="M22 2L15 22l-4-9l-9-4l22-7z" />
                        </svg>
                        <span>{freelancer.email}</span>
                      </div>
                      <div className="info-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                        </svg>
                        <span>{freelancer.portfolio}</span>
                      </div>
                    </div>

                    <div className="action-buttons">
                      <button className="book-button" onClick={e => { e.preventDefault(); handleBook(freelancer); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                        </svg>
                        Book Me
                      </button>
                      <button className="message-button" onClick={e => { e.preventDefault(); handleMessage(freelancer.id); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                        </svg>
                        Message Me
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-results">
              <h3>No freelancers found matching your search criteria</h3>
              <p>Try different keywords or browse all freelancers</p>
            </div>
          )}
        </div>
        {/* Booking Modal */}
        {showBooking && bookingTarget && (
          <div className="booking-modal-overlay" onClick={() => setShowBooking(false)}>
            <div className="booking-modal" onClick={e => e.stopPropagation()}>
              <h3>Book {bookingTarget.name}</h3>
              <div className="calendar-container">
                <div className="calendar-header">
                  <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}>&lt;</button>
                  <span>{calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                  <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}>&gt;</button>
                </div>
                <div className="calendar-grid">
                  {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} className="calendar-day-label">{d}</div>)}
                  {renderCalendar()}
                </div>
              </div>
              <div className="time-picker-container">
                <label>Time:
                  <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)}>
                    <option value="">Select time</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </label>
              </div>
              <div style={{marginTop: '1rem'}}>
                <button onClick={() => {/* handle book for now */}}>Book for Now</button>
                <button onClick={() => {/* handle confirm booking */}}>Confirm Booking</button>
                <button onClick={() => setShowBooking(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Freelancers; 