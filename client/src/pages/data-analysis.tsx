import { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useBiometrics } from "@/hooks/use-biometrics";
import { Progress } from "@/components/ui/progress";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';

// Sample data for the charts
const generateSampleSleepData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate some random sleep data between 50 and 90
    const sleepValue = Math.floor(Math.random() * 40) + 50;
    
    const dataPoint: any = {
      date: date.toISOString().split('T')[0],
      sleep: sleepValue,
    };
    
    data.push(dataPoint);
  }
  
  // Add some event markers
  data[5].event = 'P1S';
  data[12].event = 'P2S';
  data[20].event = 'P2S';
  
  return data;
};

const communityPercentile = 75; // Your position in the community (0-100)

// Radar chart data for biomarker comparison
const radarData = [
  { subject: 'Sleep', 'Date 1': 70, 'Date 2': 85, fullMark: 100 },
  { subject: 'Stress', 'Date 1': 65, 'Date 2': 45, fullMark: 100 }, // Lower stress is better
  { subject: 'ABZ', 'Date 1': 40, 'Date 2': 60, fullMark: 100 },
  { subject: 'XYZ', 'Date 1': 55, 'Date 2': 75, fullMark: 100 },
];

// Blood test sample data
const bloodTestData = [
  { date: '23/04/25', metric1: 45, metric2: 65, metric3: 55 },
  { date: '30/04/25', metric1: 40, metric2: 70, metric3: 60 },
];

const DataAnalysis = () => {
  const { metrics } = useBiometrics();
  const [metricType, setMetricType] = useState("sleep");
  const [timeRange, setTimeRange] = useState("30 days");
  const [compareDate1, setCompareDate1] = useState("23/04/25");
  const [compareDate2, setCompareDate2] = useState("30/04/25");
  
  // Sample sleep data with markers
  const sleepData = generateSampleSleepData();
  
  // Event markers for the timeline below the chart
  const eventMarkers = sleepData
    .filter(item => item.event)
    .map(item => ({
      date: item.date,
      event: item.event,
    }));
  
  // Custom dot colors for the timeline
  const getEventColor = (event) => {
    if (event === 'P1S') return 'blue';
    if (event === 'P2S') return 'green';
    return 'yellow';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Progress Tracker Section */}
      <section className="mb-12">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">
            Progress <span className="underline">Tracker</span>
          </h1>
        </div>
        
        <div className="mb-8">
          <div className="text-center mb-4">
            <p className="text-lg">
              Progress chart of{" "}
              <Select value={metricType} onValueChange={setMetricType}>
                <SelectTrigger className="w-[100px] inline-block mx-1 bg-gray-200">
                  <SelectValue placeholder="sleep" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sleep">sleep</SelectItem>
                  <SelectItem value="energy">energy</SelectItem>
                  <SelectItem value="stress">stress</SelectItem>
                </SelectContent>
              </Select>
              {" "}over the last{" "}
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[100px] inline-block mx-1 bg-gray-200">
                  <SelectValue placeholder="30 days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7 days">7 days</SelectItem>
                  <SelectItem value="30 days">30 days</SelectItem>
                  <SelectItem value="90 days">90 days</SelectItem>
                </SelectContent>
              </Select>
            </p>
          </div>
          
          <Card className="p-4">
            {/* Line Chart */}
            <div className="h-64 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={sleepData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={false} 
                    axisLine={{ stroke: '#ccc' }}
                    label={{ value: 'time', position: 'right', offset: 0 }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    label={{ value: 'sleep', angle: -90, position: 'insideLeft' }}
                  />
                  <ReferenceLine x={sleepData[5].date} stroke="blue" label={{ value: "P1S", position: 'top' }} />
                  <ReferenceLine x={sleepData[12].date} stroke="green" label={{ value: "P2S", position: 'top' }} />
                  <ReferenceLine x={sleepData[20].date} stroke="yellow" label={{ value: "P2S", position: 'top' }} />
                  <Line 
                    type="monotone" 
                    dataKey="sleep" 
                    stroke="#000" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Event markers below the chart */}
              <div className="mt-1 flex items-center px-10">
                {sleepData.map((item, index) => (
                  <div key={index} className="flex-1 flex justify-center">
                    {item.event && (
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getEventColor(item.event) }}
                      ></div>
                    )}
                    {!item.event && index % 4 === 0 && (
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'red' }}></div>
                    )}
                    {!item.event && index % 5 === 0 && (
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'blue' }}></div>
                    )}
                    {!item.event && index % 6 === 0 && (
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'green' }}></div>
                    )}
                    {!item.event && index % 7 === 0 && (
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'yellow' }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Community Position Bar */}
            <div className="mt-8">
              <p className="text-center mb-3">
                Your <span className="underline">position</span> vs the community
              </p>
              <div className="relative">
                <div className="flex h-10 mb-1">
                  <div className="w-1/3 bg-red-500"></div>
                  <div className="w-1/3 bg-yellow-500"></div>
                  <div className="w-1/3 bg-green-500"></div>
                </div>
                <div 
                  className="absolute top-0 h-14 w-0.5 bg-blue-600" 
                  style={{ left: `${communityPercentile}%`, marginTop: '-8px' }}
                ></div>
                <div 
                  className="absolute text-xs"
                  style={{ left: `${communityPercentile - 2}%`, top: '-20px' }}
                >
                  you
                </div>
                <div className="text-center text-sm mt-1">community</div>
              </div>
            </div>
          </Card>
        </div>
      </section>
      
      {/* Biomarker Comparison Section */}
      <section className="mb-12">
        <div className="text-center mb-6">
          <p className="text-lg">
            Compare <span className="underline">biomarkers</span> between{" "}
            <Select value={compareDate1} onValueChange={setCompareDate1}>
              <SelectTrigger className="w-[100px] inline-block mx-1 bg-gray-200">
                <SelectValue placeholder="23/04/25" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="23/04/25">23/04/25</SelectItem>
                <SelectItem value="16/04/25">16/04/25</SelectItem>
              </SelectContent>
            </Select>
            {" "}and{" "}
            <Select value={compareDate2} onValueChange={setCompareDate2}>
              <SelectTrigger className="w-[100px] inline-block mx-1 bg-gray-200">
                <SelectValue placeholder="30/04/25" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30/04/25">30/04/25</SelectItem>
                <SelectItem value="07/05/25">07/05/25</SelectItem>
              </SelectContent>
            </Select>
          </p>
        </div>
        
        <Card className="p-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Date 1"
                  dataKey="Date 1"
                  stroke="#D63939"
                  fill="#D63939"
                  fillOpacity={0.5}
                />
                <Radar
                  name="Date 2"
                  dataKey="Date 2"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.5}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>
      
      {/* Blood Test Comparison Section */}
      <section>
        <div className="text-center mb-6">
          <p className="text-lg">
            Compare <span className="underline">blood tests</span> between{" "}
            <Select value={compareDate1} onValueChange={setCompareDate1}>
              <SelectTrigger className="w-[100px] inline-block mx-1 bg-gray-200">
                <SelectValue placeholder="23/04/25" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="23/04/25">23/04/25</SelectItem>
                <SelectItem value="16/04/25">16/04/25</SelectItem>
              </SelectContent>
            </Select>
            {" "}and{" "}
            <Select value={compareDate2} onValueChange={setCompareDate2}>
              <SelectTrigger className="w-[100px] inline-block mx-1 bg-gray-200">
                <SelectValue placeholder="30/04/25" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30/04/25">30/04/25</SelectItem>
                <SelectItem value="07/05/25">07/05/25</SelectItem>
              </SelectContent>
            </Select>
          </p>
        </div>
        
        <Card className="p-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Metric 1', [bloodTestData[0].date]: bloodTestData[0].metric1, [bloodTestData[1].date]: bloodTestData[1].metric1 },
                  { name: 'Metric 2', [bloodTestData[0].date]: bloodTestData[0].metric2, [bloodTestData[1].date]: bloodTestData[1].metric2 },
                  { name: 'Metric 3', [bloodTestData[0].date]: bloodTestData[0].metric3, [bloodTestData[1].date]: bloodTestData[1].metric3 },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey={bloodTestData[0].date} fill="#36A2EB" name={bloodTestData[0].date} />
                <Bar dataKey={bloodTestData[1].date} fill="#FFCE56" name={bloodTestData[1].date} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default DataAnalysis;