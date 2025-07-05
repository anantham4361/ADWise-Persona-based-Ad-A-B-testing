import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Trophy, Target, TrendingUp, Image, Video, FileText } from 'lucide-react';
import { EvaluationResult } from '../App';

interface ResultsDisplayProps {
  result: EvaluationResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const { ad_a_scores, ad_b_scores, winner, explanation, criteria_names, ad_type } = result;

  // Prepare data for charts
  const barChartData = criteria_names.map((name, index) => {
    const key = Object.keys(ad_a_scores)[index];
    return {
      criterion: name.length > 20 ? name.substring(0, 20) + '...' : name,
      fullName: name,
      'Ad A': ad_a_scores[key as keyof typeof ad_a_scores],
      'Ad B': ad_b_scores[key as keyof typeof ad_b_scores],
    };
  });

  const radarData = criteria_names.map((name, index) => {
    const key = Object.keys(ad_a_scores)[index];
    return {
      criterion: name.length > 15 ? name.substring(0, 15) + '...' : name,
      'Ad A': ad_a_scores[key as keyof typeof ad_a_scores],
      'Ad B': ad_b_scores[key as keyof typeof ad_b_scores],
    };
  });

  const winnerIsA = winner === 'Ad A';

  const getAdTypeIcon = () => {
    switch (ad_type) {
      case 'image':
        return <Image className="w-6 h-6" />;
      case 'video':
        return <Video className="w-6 h-6" />;
      case 'text':
        return <FileText className="w-6 h-6" />;
      default:
        return <Image className="w-6 h-6" />;
    }
  };

  const getAdTypeLabel = () => {
    switch (ad_type) {
      case 'image':
        return 'Image Ads';
      case 'video':
        return 'Video Ads';
      case 'text':
        return 'Text Ads';
      default:
        return 'Ads';
    }
  };

  const getAdTypeColor = () => {
    switch (ad_type) {
      case 'image':
        return 'text-blue-600';
      case 'video':
        return 'text-purple-600';
      case 'text':
        return 'text-green-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Ad Type Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-center">
          <div className={`${getAdTypeColor()} mr-3`}>
            {getAdTypeIcon()}
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {getAdTypeLabel()} Analysis Results
          </h2>
        </div>
      </div>

      {/* Winner Announcement */}
      <div className={`rounded-xl shadow-lg p-6 border-2 ${winnerIsA ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'}`}>
        <div className="flex items-center mb-4">
          <Trophy className={`w-8 h-8 mr-3 ${winnerIsA ? 'text-blue-600' : 'text-purple-600'}`} />
          <h2 className="text-3xl font-bold text-gray-800">
            🏆 {winner} Wins!
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className={`text-4xl font-bold ${winnerIsA ? 'text-blue-600' : 'text-gray-400'}`}>
              {ad_a_scores.total}
            </div>
            <div className="text-lg font-semibold text-gray-700">Ad A Score</div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="text-6xl">⚡</div>
          </div>
          
          <div className="text-center">
            <div className={`text-4xl font-bold ${!winnerIsA ? 'text-purple-600' : 'text-gray-400'}`}>
              {ad_b_scores.total}
            </div>
            <div className="text-lg font-semibold text-gray-700">Ad B Score</div>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${winnerIsA ? 'bg-blue-100' : 'bg-purple-100'}`}>
          <div className="flex items-start">
            <Target className={`w-5 h-5 mt-1 mr-2 ${winnerIsA ? 'text-blue-600' : 'text-purple-600'}`} />
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Why {winner} Won:</h3>
              <p className="text-gray-700">{explanation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-6 h-6 text-indigo-600 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-800">Detailed Score Breakdown</h2>
        </div>

        {/* Score Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Criterion</th>
                <th className="text-center py-3 px-4 font-semibold text-blue-600">Ad A</th>
                <th className="text-center py-3 px-4 font-semibold text-purple-600">Ad B</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Difference</th>
              </tr>
            </thead>
            <tbody>
              {criteria_names.map((name, index) => {
                const key = Object.keys(ad_a_scores)[index];
                const scoreA = ad_a_scores[key as keyof typeof ad_a_scores];
                const scoreB = ad_b_scores[key as keyof typeof ad_b_scores];
                const diff = scoreA - scoreB;
                
                return (
                  <tr key={name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{name}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block w-8 h-8 rounded-full text-white font-bold leading-8 ${scoreA >= scoreB ? 'bg-blue-500' : 'bg-gray-400'}`}>
                        {scoreA}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block w-8 h-8 rounded-full text-white font-bold leading-8 ${scoreB > scoreA ? 'bg-purple-500' : 'bg-gray-400'}`}>
                        {scoreB}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-semibold ${diff > 0 ? 'text-blue-600' : diff < 0 ? 'text-purple-600' : 'text-gray-500'}`}>
                        {diff > 0 ? '+' : ''}{diff}
                      </span>
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td className="py-3 px-4 font-bold text-gray-800">Total Score</td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-white font-bold ${ad_a_scores.total >= ad_b_scores.total ? 'bg-blue-600' : 'bg-gray-500'}`}>
                    {ad_a_scores.total}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-white font-bold ${ad_b_scores.total > ad_a_scores.total ? 'bg-purple-600' : 'bg-gray-500'}`}>
                    {ad_b_scores.total}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`font-bold text-lg ${ad_a_scores.total > ad_b_scores.total ? 'text-blue-600' : ad_b_scores.total > ad_a_scores.total ? 'text-purple-600' : 'text-gray-500'}`}>
                    {ad_a_scores.total > ad_b_scores.total ? '+' : ''}{ad_a_scores.total - ad_b_scores.total}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Score Comparison</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="criterion" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    fontSize={12}
                  />
                  <YAxis domain={[0, 10]} />
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => {
                      const item = barChartData.find(d => d.criterion === label);
                      return item ? item.fullName : label;
                    }}
                  />
                  <Bar dataKey="Ad A" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Ad B" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Chart */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Radar</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="criterion" fontSize={11} />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} fontSize={10} />
                  <Radar name="Ad A" dataKey="Ad A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} strokeWidth={2} />
                  <Radar name="Ad B" dataKey="Ad B" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;