'use client';

import { useCreatorStats } from '@/hooks/useAdminData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBigInt } from '@/lib/utils';
import { BarChart, TrendingUp, Users, DollarSign, Vote, Activity } from 'lucide-react';

export function PollCreatorDashboard() {
  const { stats, loading, error } = useCreatorStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          <span>Loading creator dashboard...</span>
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
          <CardDescription>Connect your wallet to view creator statistics</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const statusData = [
    { label: 'Open', count: stats.openPolls, color: 'bg-green-500' },
    { label: 'Funding', count: stats.fundingPolls, color: 'bg-yellow-500' },
    { label: 'Closed', count: stats.closedPolls, color: 'bg-gray-500' }
  ];

  const maxCount = Math.max(...statusData.map(d => d.count)) || 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Poll Creator Dashboard</h2>
        <p className="text-muted-foreground">Overview of your created polls and their performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPolls}</div>
            <p className="text-xs text-muted-foreground">
              Polls created by you
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResponses}</div>
            <p className="text-xs text-muted-foreground">
              Across all your polls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBigInt(stats.totalFunding)} cBTC</div>
            <p className="text-xs text-muted-foreground">
              Total rewards distributed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openPolls}</div>
            <p className="text-xs text-muted-foreground">
              Currently accepting responses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Poll Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Poll Status Distribution
          </CardTitle>
          <CardDescription>
            Breakdown of your polls by current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusData.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium">{item.label}</div>
                <div className="flex-1 relative">
                  <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-sm font-bold text-right">{item.count}</div>
              </div>
            ))}
          </div>
          
          {stats.totalPolls === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Vote className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No polls created yet</p>
              <p className="text-sm">Create your first poll to see statistics here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Funding Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Funding Overview
          </CardTitle>
          <CardDescription>
            Total funding provided across all your polls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Distributed</span>
              <span className="text-lg font-bold">{formatBigInt(stats.totalFunding)} cBTC</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Average per Poll</span>
              <span className="text-lg font-bold">
                {stats.totalPolls > 0 
                  ? formatBigInt(stats.totalFunding / BigInt(stats.totalPolls))
                  : '0'
                } cBTC
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Average per Response</span>
              <span className="text-lg font-bold">
                {stats.totalResponses > 0 
                  ? formatBigInt(stats.totalFunding / BigInt(stats.totalResponses))
                  : '0'
                } cBTC
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}