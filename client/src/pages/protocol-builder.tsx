import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface Intervention {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  effects: {
    longevity: 'positive' | 'negative' | 'neutral';
    sleep: 'positive' | 'negative' | 'neutral';
  };
  metrics: {
    evidence: number;
    cost: number;
    difficulty: number;
    timeInvestment: number;
  };
}

// Sample interventions data
const interventionsList: Intervention[] = [
  {
    id: 1,
    name: "Meditation",
    description: "Regular practice of mindfulness meditation for mental clarity.",
    category: "Mind",
    icon: "🧘",
    effects: {
      longevity: "positive",
      sleep: "positive"
    },
    metrics: {
      evidence: 75,
      cost: 10,
      difficulty: 65,
      timeInvestment: 70
    }
  },
  {
    id: 2,
    name: "Cold exposure",
    description: "Brief exposure to cold temperatures for hormetic stress response.",
    category: "Body",
    icon: "❄️",
    effects: {
      longevity: "positive",
      sleep: "neutral"
    },
    metrics: {
      evidence: 60,
      cost: 20,
      difficulty: 80,
      timeInvestment: 30
    }
  },
  {
    id: 3,
    name: "Creating",
    description: "Engaging in creative activities for cognitive enhancement.",
    category: "Mind",
    icon: "🎨",
    effects: {
      longevity: "neutral",
      sleep: "positive"
    },
    metrics: {
      evidence: 40,
      cost: 30,
      difficulty: 20,
      timeInvestment: 60
    }
  },
  {
    id: 4,
    name: "Ashwagandha",
    description: "Ayurvedic root extract that can be consumed orally.",
    category: "Supplements",
    icon: "🌿",
    effects: {
      longevity: "positive",
      sleep: "negative"
    },
    metrics: {
      evidence: 65,
      cost: 40,
      difficulty: 65,
      timeInvestment: 85
    }
  },
  {
    id: 5,
    name: "Red light",
    description: "Red light therapy for cellular regeneration and inflammation reduction.",
    category: "Technology",
    icon: "🔴",
    effects: {
      longevity: "positive",
      sleep: "neutral"
    },
    metrics: {
      evidence: 55,
      cost: 70,
      difficulty: 30,
      timeInvestment: 40
    }
  },
  {
    id: 6,
    name: "Melatonin",
    description: "Hormone supplement that regulates sleep-wake cycles.",
    category: "Supplements",
    icon: "💊",
    effects: {
      longevity: "neutral",
      sleep: "positive"
    },
    metrics: {
      evidence: 85,
      cost: 25,
      difficulty: 15,
      timeInvestment: 10
    }
  },
  {
    id: 7,
    name: "Lions mane",
    description: "Medicinal mushroom that supports brain health and neural growth.",
    category: "Supplements",
    icon: "🍄",
    effects: {
      longevity: "positive",
      sleep: "neutral"
    },
    metrics: {
      evidence: 60,
      cost: 45,
      difficulty: 20,
      timeInvestment: 30
    }
  },
  {
    id: 8,
    name: "Blue light",
    description: "Blocking blue light in evenings to improve sleep quality.",
    category: "Technology",
    icon: "🔵",
    effects: {
      longevity: "neutral",
      sleep: "positive"
    },
    metrics: {
      evidence: 70,
      cost: 35,
      difficulty: 30,
      timeInvestment: 20
    }
  },
  {
    id: 9,
    name: "Semen retention",
    description: "Practice of abstaining from ejaculation for energy conservation.",
    category: "Body",
    icon: "⚡",
    effects: {
      longevity: "neutral",
      sleep: "neutral"
    },
    metrics: {
      evidence: 30,
      cost: 0,
      difficulty: 75,
      timeInvestment: 50
    }
  }
];

// Sample protocol data
const sampleProtocols = [
  { id: 1, name: "Protocol 1", isActive: true, interventions: [1, 4, 6, 8] },
  { id: 2, name: "Protocol 2", isActive: false, interventions: [2, 5, 7, 9] },
  { id: 3, name: "Protocol 3", isActive: false, interventions: [3, 4, 5, 7] }
];

const ProtocolBuilder = () => {
  // State for managing the UI
  const [selectedCategory, setSelectedCategory] = useState("Category 1");
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention>(interventionsList[3]); // Default to Ashwagandha
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProtocol, setSelectedProtocol] = useState(sampleProtocols[0]);
  const [newProtocolInterventions, setNewProtocolInterventions] = useState<number[]>([]);
  const [newProtocolName, setNewProtocolName] = useState("My New Protocol");
  const [activeBoxIndex, setActiveBoxIndex] = useState(0);

  // Filter interventions based on search query
  const filteredInterventions = interventionsList.filter(intervention => 
    intervention.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to add an intervention to a specific box
  const addInterventionToBox = (interventionId: number) => {
    if (activeBoxIndex < 3) {
      const newInterventions = [...newProtocolInterventions];
      newInterventions[activeBoxIndex] = interventionId;
      setNewProtocolInterventions(newInterventions);
      
      // Activate the next box if available
      if (activeBoxIndex < 2) {
        setActiveBoxIndex(activeBoxIndex + 1);
      }
    }
  };
  
  // Function to save the new protocol
  const saveProtocol = () => {
    if (newProtocolInterventions.filter(id => id !== undefined).length > 0) {
      // Here you would normally save to a database
      alert(`Protocol "${newProtocolName}" saved successfully!`);
    } else {
      alert("Please add at least one intervention to save the protocol.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-dark">Protocol Builder</h1>
      </div>

      {/* Protocol Selection Area */}
      <div className="flex justify-center mb-8 space-x-4">
        {sampleProtocols.map(protocol => (
          <button
            key={protocol.id}
            className={`rounded-full py-4 px-6 flex items-center ${
              protocol.isActive ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => setSelectedProtocol(protocol)}
          >
            <div className="mr-3 font-semibold">{protocol.name}</div>
            <div className="grid grid-cols-2 gap-1">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${protocol.isActive ? "bg-black bg-opacity-20" : "bg-black bg-opacity-30"}`}></div>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Protocol Building Area */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-dark-medium">Build your next protocol</h2>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={newProtocolName}
              onChange={(e) => setNewProtocolName(e.target.value)}
              className="w-64"
              placeholder="Protocol name"
            />
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={saveProtocol}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save
            </Button>
          </div>
        </div>
        <div className="flex justify-center space-x-4 mb-6">
          {Array(3).fill(0).map((_, index) => {
            // Get the intervention for this box if it exists
            const interventionId = newProtocolInterventions[index];
            const intervention = interventionId !== undefined ? 
              interventionsList.find(i => i.id === interventionId) : undefined;
            
            // Determine if this box is active (should be blue)
            const isActive = index === activeBoxIndex;
            
            return (
              <div 
                key={index} 
                className={`w-32 h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center
                  ${intervention ? 'border-green-500 bg-green-50' : 
                    isActive ? 'border-blue-500 bg-blue-50 cursor-pointer' : 
                    'border-gray-300 bg-gray-50 opacity-70'}`}
                onClick={() => {
                  // Only allow clicking the active box
                  if (isActive) {
                    // Logic for when a box is clicked will be handled in the intervention selection
                  }
                }}
              >
                {intervention ? (
                  <>
                    <span className="text-2xl mb-1">{intervention.icon}</span>
                    <span className="text-sm text-center px-1">{intervention.name}</span>
                  </>
                ) : (
                  <span className="text-gray-500 text-sm font-medium">Add below</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Search for interventions..." 
            className="pl-10 rounded-full h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Selection */}
      <div className="flex justify-center mb-8">
        {["Category 1", "Category 2", "Category 3"].map(category => (
          <Button 
            key={category} 
            variant={selectedCategory === category ? "default" : "outline"}
            className={`mx-2 rounded-full ${
              selectedCategory === category ? "bg-blue-500" : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Main Content Area with Interventions and Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interventions List */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <ul className="space-y-3">
            {filteredInterventions.map((intervention) => (
              <li 
                key={intervention.id} 
                className={`flex items-center justify-between cursor-pointer py-2 hover:bg-blue-50 pl-2 rounded transition-colors duration-150
                  ${intervention.id === selectedIntervention.id ? "bg-gray-50" : ""}`}
                onClick={() => setSelectedIntervention(intervention)}
              >
                <div className="flex items-center">
                  {intervention.id === selectedIntervention.id && (
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  )}
                  <span className={`${intervention.id === selectedIntervention.id ? "ml-0" : "ml-6"} text-lg`}>
                    {intervention.name}
                  </span>
                </div>
                <button
                  className="text-gray-400 hover:text-blue-500 hover:bg-blue-100 p-1 rounded-full focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the li onClick
                    addInterventionToBox(intervention.id);
                  }}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Intervention Details */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            {/* Title and Icon */}
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">{selectedIntervention.icon}</span>
              <h3 className="text-xl font-semibold">{selectedIntervention.name}</h3>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6">
              {selectedIntervention.description}
            </p>

            {/* Impact Indicators */}
            <div className="flex justify-between mb-6">
              <div className="flex items-center">
                <span className="font-medium mr-2">Longevity</span>
                {selectedIntervention.effects.longevity === "positive" && (
                  <span className="text-green-500 text-xl">↑</span>
                )}
                {selectedIntervention.effects.longevity === "negative" && (
                  <span className="text-red-500 text-xl">↓</span>
                )}
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Sleep</span>
                {selectedIntervention.effects.sleep === "positive" && (
                  <span className="text-green-500 text-xl">↑</span>
                )}
                {selectedIntervention.effects.sleep === "negative" && (
                  <span className="text-red-500 text-xl">↓↓</span>
                )}
              </div>
            </div>

            {/* Metrics Bars */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Evidence</span>
                </div>
                <Progress value={selectedIntervention.metrics.evidence} className="h-2 bg-gray-100" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Cost</span>
                </div>
                <Progress value={selectedIntervention.metrics.cost} className="h-2 bg-gray-100" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Difficulty</span>
                </div>
                <Progress value={selectedIntervention.metrics.difficulty} className="h-2 bg-gray-100" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Time investment</span>
                </div>
                <Progress value={selectedIntervention.metrics.timeInvestment} className="h-2 bg-gray-100" />
              </div>
            </div>

            {/* Add to Protocol Button */}
            <div className="mt-6">
              <Button 
                className="w-full"
                onClick={() => addInterventionToBox(selectedIntervention.id)}
              >
                {newProtocolInterventions.indexOf(selectedIntervention.id) !== -1 
                  ? "Already in Protocol" 
                  : "Add to Protocol"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProtocolBuilder;