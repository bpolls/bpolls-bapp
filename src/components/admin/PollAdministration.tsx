'use client';

import { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { useAdminPolls, PollAdminData } from '@/hooks/useAdminData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatAddress, formatBigInt } from '@/lib/utils';
import { Search, Filter, Settings, Users, DollarSign, Clock, RefreshCw } from 'lucide-react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '@/constants/contracts';
import { POLLS_DAPP_ABI } from '@/constants/abi';
import { showToast } from '@/lib/toast';

export function PollAdministration() {
  const { polls, loading, error, refetch } = useAdminPolls();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.content.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poll.content.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || poll.content.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (pollId: bigint, newStatus: string) => {
    if (!address || !walletClient) {
      showToast.error('Wallet not connected', 'Please connect your wallet to manage polls');
      return;
    }

    try {
      setUpdatingStatus(pollId.toString());
      
      const provider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner();
      const contractWithSigner = new ethers.Contract(
        CONTRACT_ADDRESSES.POLLS_DAPP,
        POLLS_DAPP_ABI,
        signer
      );

      let tx;
      switch (newStatus) {
        case 'open':
          tx = await contractWithSigner.openPoll(pollId);
          break;
        case 'funding':
          tx = await contractWithSigner.forFunding(pollId);
          break;
        case 'claiming':
          tx = await contractWithSigner.forClaiming(pollId);
          break;
        case 'closed':
          tx = await contractWithSigner.closePoll(pollId);
          break;
        default:
          throw new Error(`Unknown status: ${newStatus}`);
      }

      showToast.success('Transaction submitted', 'Waiting for confirmation...');
      await tx.wait();
      
      showToast.success('Status updated successfully', `Poll ${pollId} is now ${newStatus}`);
      refetch();
    } catch (error) {
      console.error('Error updating poll status:', error);
      showToast.error('Failed to update status', 'Please check your wallet and try again');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string, isOpen: boolean) => {
    if (!isOpen) return 'bg-gray-100 text-gray-800';
    
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'funding': return 'bg-yellow-100 text-yellow-800';
      case 'claiming': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeRemaining = (endTime: bigint) => {
    const now = BigInt(Math.floor(Date.now() / 1000));
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Ended';
    
    const days = remaining / BigInt(86400);
    const hours = (remaining % BigInt(86400)) / BigInt(3600);
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else {
      return `${hours}h`;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          <span>Loading poll administration...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Polls</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refetch} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Poll Administration</h2>
        <p className="text-muted-foreground">Manage polls and their status across the platform</p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search polls by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="funding">Funding</SelectItem>
                  <SelectItem value="claiming">Claiming</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={refetch} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Polls List */}
      <div className="space-y-4">
        {filteredPolls.length > 0 ? (
          filteredPolls.map((poll) => (
            <Card key={poll.pollId.toString()}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{poll.content.subject}</CardTitle>
                    <CardDescription className="mt-1">
                      Created by {formatAddress(poll.content.creator)}
                      {poll.canManage && (
                        <Badge variant="outline" className="ml-2">You can manage</Badge>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(poll.content.status, poll.content.isOpen)}>
                      {poll.content.isOpen ? poll.content.status : 'Closed'}
                    </Badge>
                    <Badge variant="outline">
                      {poll.content.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {poll.content.description && (
                    <p className="text-sm text-muted-foreground">{poll.content.description}</p>
                  )}
                  
                  {/* Poll Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{poll.settings.totalResponses.toString()}/{poll.settings.maxResponses.toString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>{formatBigInt(poll.settings.funds)} cBTC</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{formatTimeRemaining(poll.settings.endTime)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      <span>Poll #{poll.pollId.toString()}</span>
                    </div>
                  </div>

                  {/* Status Management */}
                  {poll.canManage && (
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Manage Status:</span>
                        <div className="flex gap-2">
                          {['open', 'funding', 'claiming', 'closed'].map((status) => (
                            <Button
                              key={status}
                              size="sm"
                              variant={poll.content.status === status ? 'default' : 'outline'}
                              disabled={updatingStatus === poll.pollId.toString() || poll.content.status === status}
                              onClick={() => handleStatusChange(poll.pollId, status)}
                              className="capitalize"
                            >
                              {updatingStatus === poll.pollId.toString() ? (
                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                              ) : (
                                status
                              )}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No polls match your current filters' 
                  : 'No polls available for administration'
                }
              </p>
              {(searchTerm || statusFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}