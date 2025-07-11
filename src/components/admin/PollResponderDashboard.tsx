'use client';

import { useResponderStats } from '@/hooks/useAdminData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBigInt, formatAddress } from '@/lib/utils';
import { TrendingUp, Users, DollarSign, Award, Clock, Vote } from 'lucide-react';

export function PollResponderDashboard() {
  const { stats, loading, error } = useResponderStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          <span>Loading responder dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Dashboard</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
          <CardDescription>Connect your wallet to view participation statistics</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const averageReward = stats.totalParticipated > 0 
    ? stats.totalRewardsEarned / BigInt(stats.totalParticipated)
    : BigInt(0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Poll Responder Dashboard</h2>
        <p className="text-muted-foreground">Your participation history and rewards earned</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Polls Participated</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParticipated}</div>
            <p className="text-xs text-muted-foreground">
              Total polls you've voted in
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBigInt(stats.totalRewardsEarned)} cBTC</div>
            <p className="text-xs text-muted-foreground">
              Cumulative rewards earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Reward</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBigInt(averageReward)} cBTC</div>
            <p className="text-xs text-muted-foreground">
              Per poll participation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Participation Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Participation Timeline
          </CardTitle>
          <CardDescription>
            Your recent poll participation activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Vote className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Poll #{activity.pollId.toString()}</div>
                      <div className="text-sm text-muted-foreground">Response: {activity.response}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">+{formatBigInt(activity.reward)} cBTC</div>
                    <div className="text-xs text-muted-foreground">Reward</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No participation history yet</p>
              <p className="text-sm">Start voting in polls to see your activity here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Participation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reward Distribution</CardTitle>
            <CardDescription>How your rewards are distributed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Highest Single Reward</span>
                <span className="font-bold">
                  {stats.recentActivity.length > 0 
                    ? formatBigInt(BigInt(Math.max(...stats.recentActivity.map(a => Number(a.reward)))))
                    : '0'
                  } cBTC
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Lowest Single Reward</span>
                <span className="font-bold">
                  {stats.recentActivity.length > 0 
                    ? formatBigInt(BigInt(Math.min(...stats.recentActivity.map(a => Number(a.reward)))))
                    : '0'
                  } cBTC
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Reward</span>
                <span className="font-bold">{formatBigInt(averageReward)} cBTC</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participation Insights</CardTitle>
            <CardDescription>Your voting patterns and engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Votes Cast</span>
                <span className="font-bold">{stats.totalParticipated}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Success Rate</span>
                <span className="font-bold">100%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Engagement Level</span>
                <span className="font-bold">
                  {stats.totalParticipated >= 10 ? 'High' : stats.totalParticipated >= 5 ? 'Medium' : 'Starting'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}