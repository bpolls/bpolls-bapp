'use client';

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, PieChart as PieChartIcon, ImageIcon, Users, Trophy, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePollResults } from '@/hooks/usePollResults';
import { formatBigInt } from '@/lib/utils';

interface PieChartProps {
  results: Array<{
    option: string;
    votes: number;
    percentage: number;
    color: string;
  }>;
  totalVotes: number;
}

function PieChart({ results, totalVotes }: PieChartProps) {
  if (totalVotes === 0) {
    return (
      <div className="w-64 h-64 rounded-full border-4 border-gray-200 flex items-center justify-center mx-auto">
        <div className="text-center">
          <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">No votes yet</p>
        </div>
      </div>
    );
  }

  let currentAngle = 0;
  const radius = 120;
  const centerX = 128;
  const centerY = 128;

  return (
    <div className="flex flex-col items-center space-y-4">
      <svg width="256" height="256" className="mx-auto">
        {results.map((result, index) => {
          const sliceAngle = (result.percentage / 100) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + sliceAngle;

          const startRadians = (startAngle * Math.PI) / 180;
          const endRadians = (endAngle * Math.PI) / 180;

          const startX = centerX + radius * Math.cos(startRadians);
          const startY = centerY + radius * Math.sin(startRadians);
          const endX = centerX + radius * Math.cos(endRadians);
          const endY = centerY + radius * Math.sin(endRadians);

          const largeArcFlag = sliceAngle > 180 ? 1 : 0;

          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${startX} ${startY}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            'Z'
          ].join(' ');

          currentAngle += sliceAngle;

          return (
            <path
              key={index}
              d={pathData}
              fill={result.color}
              stroke="white"
              strokeWidth="2"
              className="hover:opacity-80 transition-opacity"
            />
          );
        })}
        <circle
          cx={centerX}
          cy={centerY}
          r="40"
          fill="white"
          stroke="#e5e7eb"
          strokeWidth="2"
        />
        <text
          x={centerX}
          y={centerY - 5}
          textAnchor="middle"
          className="text-lg font-bold fill-gray-900"
        >
          {totalVotes}
        </text>
        <text
          x={centerX}
          y={centerY + 15}
          textAnchor="middle"
          className="text-sm fill-gray-500"
        >
          votes
        </text>
      </svg>
      
      <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
        {results.map((result, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: result.color }}
            />
            <span className="text-sm font-medium flex-1">{result.option}</span>
            <span className="text-sm text-gray-600">
              {result.votes} ({result.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({ results, totalVotes }: PieChartProps) {
  if (totalVotes === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">No votes to display</p>
        </div>
      </div>
    );
  }

  const maxVotes = Math.max(...results.map(r => r.votes));
  const barHeight = 200;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-center space-x-4 h-64">
        {results.map((result, index) => {
          const height = maxVotes > 0 ? (result.votes / maxVotes) * barHeight : 0;
          
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="text-sm font-medium text-center">
                {result.votes}
              </div>
              <div
                className="w-16 transition-all duration-500 rounded-t-md relative group"
                style={{
                  height: `${height}px`,
                  backgroundColor: result.color,
                  minHeight: result.votes > 0 ? '8px' : '0px'
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {result.percentage.toFixed(1)}%
                </div>
              </div>
              <div className="text-xs text-center max-w-16 break-words">
                {result.option}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="space-y-2">
        {results.map((result, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: result.color }}
              />
              <span className="text-sm font-medium">{result.option}</span>
            </div>
            <div className="text-sm text-gray-600">
              {result.votes} votes ({result.percentage.toFixed(1)}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Infographic({ results, totalVotes, poll }: PieChartProps & { poll: any }) {
  const winner = results[0];
  const secondPlace = results[1];
  
  return (
    <div className="space-y-6">
      {/* Winner Section */}
      {winner && (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
              <Trophy className="h-8 w-8 text-yellow-800" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-yellow-800">Winning Option</h3>
              <p className="text-2xl font-bold text-yellow-900">{winner.option}</p>
              <p className="text-yellow-700">
                {winner.votes} votes • {winner.percentage.toFixed(1)}% of total
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-800">{winner.percentage.toFixed(0)}%</div>
              <div className="text-sm text-yellow-600">of votes</div>
            </div>
          </div>
        </div>
      )}

      {/* Vote Distribution */}
      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Vote Distribution
        </h3>
        
        {results.map((result, index) => (
          <div key={index} className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{result.option}</span>
              <span className="text-sm text-gray-600">
                {result.votes} votes ({result.percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
              <div
                className="h-4 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${result.percentage}%`,
                  backgroundColor: result.color
                }}
              />
              {index === 0 && (
                <div className="absolute top-0 right-1 h-4 flex items-center">
                  <Trophy className="h-3 w-3 text-yellow-600" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalVotes}</div>
          <div className="text-sm text-blue-500">Total Votes</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {results.length}
          </div>
          <div className="text-sm text-green-500">Options</div>
        </div>
      </div>

      {/* Comparison */}
      {winner && secondPlace && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Lead Margin</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm">
              <span className="font-medium">{winner.option}</span> leads{' '}
              <span className="font-medium">{secondPlace.option}</span> by
            </span>
            <span className="font-bold text-lg">
              {(winner.percentage - secondPlace.percentage).toFixed(1)}%
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ({winner.votes - secondPlace.votes} votes difference)
          </div>
        </div>
      )}
    </div>
  );
}

export function PollResultsPage() {
  const navigate = useNavigate();
  const { pollId } = useParams<{ pollId: string }>();
  const { results, loading, error } = usePollResults(pollId ? BigInt(pollId) : undefined);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          <span>Loading poll results...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Results</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Poll Not Found</CardTitle>
            <CardDescription>The requested poll could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={() => navigate('/')} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center flex-1 mx-4">
          <h1 className="text-2xl font-bold">{results.poll.subject}</h1>
          <p className="text-muted-foreground">Poll Results</p>
        </div>
        <div className="w-20" /> {/* Spacer for centering */}
      </div>

      {/* Poll Info */}
      <Card>
        <CardHeader>
          <CardTitle>Poll Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{results.totalVotes}</div>
              <div className="text-sm text-muted-foreground">Total Votes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {results.participationRate.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Participation Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{results.topChoice}</div>
              <div className="text-sm text-muted-foreground">Leading Option</div>
            </div>
          </div>
          
          {results.poll.description && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm">{results.poll.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chart Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Pie Chart
            </CardTitle>
            <CardDescription>Visual breakdown of vote distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart results={results.results} totalVotes={results.totalVotes} />
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Bar Chart
            </CardTitle>
            <CardDescription>Compare options side by side</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart results={results.results} totalVotes={results.totalVotes} />
          </CardContent>
        </Card>

        {/* Infographic */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Infographic
            </CardTitle>
            <CardDescription>Detailed results breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <Infographic 
              results={results.results} 
              totalVotes={results.totalVotes}
              poll={results.poll}
            />
          </CardContent>
        </Card>
      </div>

      {/* Poll Status */}
      <Card>
        <CardHeader>
          <CardTitle>Poll Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">
                Status: <span className={results.isEnded ? "text-red-600" : "text-green-600"}>
                  {results.isEnded ? "Ended" : "Active"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Total fund: {formatBigInt(results.poll.funds)} cBTC
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Poll ID</div>
              <div className="font-mono text-lg">#{results.pollId.toString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}