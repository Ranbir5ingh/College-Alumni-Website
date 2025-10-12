// config/donationCategories.js
import {
  Building,
  GraduationCap,
  Users,
  Trophy,
  Book,
  Microscope,
  Heart,
  Calendar,
  DollarSign,
  Home,
  Music,
  Briefcase,
  Lightbulb,
  Leaf
} from "lucide-react";

export const DONATION_CATEGORIES = [
  {
    value: "infrastructure_development",
    title: "Infrastructure Development",
    description: "Support campus infrastructure, buildings, and facilities development",
    icon: Building,
    color: "blue"
  },
  {
    value: "student_scholarship",
    title: "Student Scholarship",
    description: "Help deserving students with financial assistance for their education",
    icon: GraduationCap,
    color: "green"
  },
  {
    value: "faculty_development",
    title: "Faculty Development",
    description: "Support professional development and training programs for faculty",
    icon: Users,
    color: "purple"
  },
  {
    value: "research_grants",
    title: "Research Grants",
    description: "Fund innovative research projects and academic excellence",
    icon: Users,
    color: "indigo"
  },
  {
    value: "sports_facilities",
    title: "Sports Facilities",
    description: "Enhance sports infrastructure and support athletic programs",
    icon: Trophy,
    color: "yellow"
  },
  {
    value: "library_resources",
    title: "Library Resources",
    description: "Expand library collections, digital resources, and learning materials",
    icon: Book,
    color: "orange"
  },
  {
    value: "laboratory_equipment",
    title: "Laboratory Equipment",
    description: "Upgrade lab facilities with modern equipment and technology",
    icon: Microscope,
    color: "teal"
  },
  {
    value: "emergency_relief_fund",
    title: "Emergency Relief Fund",
    description: "Support students and staff during emergencies and crises",
    icon: Heart,
    color: "red"
  },
  {
    value: "alumni_activities",
    title: "Alumni Activities",
    description: "Fund alumni events, reunions, and networking programs",
    icon: Calendar,
    color: "pink"
  },
  {
    value: "general_fund",
    title: "General Fund",
    description: "Flexible fund for various institutional needs and priorities",
    icon: DollarSign,
    color: "gray"
  },
  {
    value: "hostel_facilities",
    title: "Hostel Facilities",
    description: "Improve student accommodation and hostel amenities",
    icon: Home,
    color: "cyan"
  },
  {
    value: "cultural_activities",
    title: "Cultural Activities",
    description: "Support cultural events, festivals, and student activities",
    icon: Music,
    color: "violet"
  },
  {
    value: "placement_cell",
    title: "Placement Cell",
    description: "Enhance career services and placement opportunities for students",
    icon: Briefcase,
    color: "emerald"
  },
  {
    value: "innovation_hub",
    title: "Innovation Hub",
    description: "Support entrepreneurship, startups, and innovation initiatives",
    icon: Lightbulb,
    color: "amber"
  },
  {
    value: "green_campus_initiative",
    title: "Green Campus Initiative",
    description: "Promote sustainability and environmental conservation on campus",
    icon: Leaf,
    color: "lime"
  }
];

// Helper function to get category by value
export const getCategoryByValue = (value) => {
  return DONATION_CATEGORIES.find(cat => cat.value === value);
};

// Helper function to get all category values
export const getCategoryValues = () => {
  return DONATION_CATEGORIES.map(cat => cat.value);
};

// Helper function to get color classes for Tailwind
export const getCategoryColorClasses = (color) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      hover: "hover:bg-blue-200"
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      hover: "hover:bg-green-200"
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      hover: "hover:bg-purple-200"
    },
    indigo: {
      bg: "bg-indigo-100",
      text: "text-indigo-600",
      hover: "hover:bg-indigo-200"
    },
    yellow: {
      bg: "bg-yellow-100",
      text: "text-yellow-600",
      hover: "hover:bg-yellow-200"
    },
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      hover: "hover:bg-orange-200"
    },
    teal: {
      bg: "bg-teal-100",
      text: "text-teal-600",
      hover: "hover:bg-teal-200"
    },
    red: {
      bg: "bg-red-100",
      text: "text-red-600",
      hover: "hover:bg-red-200"
    },
    pink: {
      bg: "bg-pink-100",
      text: "text-pink-600",
      hover: "hover:bg-pink-200"
    },
    gray: {
      bg: "bg-gray-100",
      text: "text-gray-600",
      hover: "hover:bg-gray-200"
    },
    cyan: {
      bg: "bg-cyan-100",
      text: "text-cyan-600",
      hover: "hover:bg-cyan-200"
    },
    violet: {
      bg: "bg-violet-100",
      text: "text-violet-600",
      hover: "hover:bg-violet-200"
    },
    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      hover: "hover:bg-emerald-200"
    },
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-600",
      hover: "hover:bg-amber-200"
    },
    lime: {
      bg: "bg-lime-100",
      text: "text-lime-600",
      hover: "hover:bg-lime-200"
    }
  };

  return colorMap[color] || colorMap.gray;
};