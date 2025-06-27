'use client';

import { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePollsContract } from '@/hooks/useContract';
import { parseBigInt } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '@/constants/contracts';
import { POLLS_DAPP_ABI } from '@/constants/abi';

interface CreatePollForm {
  subject: string;
  description: string;
  category: string;
  viewType: string;
  options: string[];
  rewardPerResponse: string;
  durationDays: string;
  maxResponses: string;
  minContribution: string;
  fundingType: string;
  targetFund: string;
  rewardToken: string;
  rewardDistribution: string;
  isOpenImmediately: boolean;
}

export function CreatePoll() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const contract = usePollsContract();
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<CreatePollForm>({
    subject: '',
    description: '',
    category: 'General',
    viewType: 'public',
    options: ['', ''],
    rewardPerResponse: '0',
    durationDays: '7',
    maxResponses: '100',
    minContribution: '0',
    fundingType: 'community',
    targetFund: '0',
    rewardToken: '0x0000000000000000000000000000000000000000',
    rewardDistribution: 'equal',
    isOpenImmediately: true,
  });

  const addOption = () => {
    setForm(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index: number) => {
    if (form.options.length > 2) {
      setForm(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !address || !walletClient) return;

    try {
      setIsCreating(true);
      
      const pollParams = {
        creator: address,
        subject: form.subject,
        description: form.description,
        category: form.category,
        viewType: form.viewType,
        options: form.options.filter(option => option.trim() !== ''),
        rewardPerResponse: parseBigInt(form.rewardPerResponse),
        durationDays: BigInt(form.durationDays),
        maxResponses: BigInt(form.maxResponses),
        minContribution: parseBigInt(form.minContribution),
        fundingType: form.fundingType,
        isOpenImmediately: form.isOpenImmediately,
        targetFund: parseBigInt(form.targetFund),
        rewardToken: form.rewardToken as `0x${string}`,
        rewardDistribution: form.rewardDistribution,
      };

      const value = form.isOpenImmediately ? parseBigInt(form.targetFund) : BigInt(0);
      
      // Create a signer and contract for write operations
      const provider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner();
      const contractWithSigner = new ethers.Contract(
        CONTRACT_ADDRESSES.POLLS_DAPP,
        POLLS_DAPP_ABI,
        signer
      );
      
      // Use ethers.js syntax for contract interaction
      const tx = await contractWithSigner.createPoll(pollParams, { value });
      
      // Wait for transaction confirmation
      await tx.wait();
      
      // Reset form
      setForm({
        subject: '',
        description: '',
        category: 'General',
        viewType: 'public',
        options: ['', ''],
        rewardPerResponse: '0',
        durationDays: '7',
        maxResponses: '100',
        minContribution: '0',
        fundingType: 'community',
        targetFund: '0',
        rewardToken: '0x0000000000000000000000000000000000000000',
        rewardDistribution: 'equal',
        isOpenImmediately: true,
      });
      
      alert('Poll created successfully!');
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Failed to create poll. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  if (!address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Poll</CardTitle>
          <CardDescription>Please connect your wallet to create a poll</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
        <CardDescription>
          Create a decentralized poll on Citrea blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject *</label>
            <Input
              value={form.subject}
              onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Enter poll subject"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your poll in detail"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="General">General</option>
                <option value="Technology">Technology</option>
                <option value="Politics">Politics</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Sports">Sports</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">View Type</label>
              <select
                value={form.viewType}
                onChange={(e) => setForm(prev => ({ ...prev, viewType: e.target.value }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Options *</label>
            {form.options.map((option, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                {form.options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addOption}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Option
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Duration (Days)</label>
              <Input
                type="number"
                value={form.durationDays}
                onChange={(e) => setForm(prev => ({ ...prev, durationDays: e.target.value }))}
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Max Responses</label>
              <Input
                type="number"
                value={form.maxResponses}
                onChange={(e) => setForm(prev => ({ ...prev, maxResponses: e.target.value }))}
                min="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Reward Per Response (BTC)</label>
              <Input
                type="number"
                step="0.000000000000000001"
                value={form.rewardPerResponse}
                onChange={(e) => setForm(prev => ({ ...prev, rewardPerResponse: e.target.value }))}
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Target Fund (BTC)</label>
              <Input
                type="number"
                step="0.000000000000000001"
                value={form.targetFund}
                onChange={(e) => setForm(prev => ({ ...prev, targetFund: e.target.value }))}
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isOpenImmediately}
                onChange={(e) => setForm(prev => ({ ...prev, isOpenImmediately: e.target.checked }))}
              />
              <span className="text-sm font-medium">Open immediately (requires funding)</span>
            </label>
          </div>

          <Button
            type="submit"
            disabled={isCreating || !form.subject || form.options.filter(o => o.trim()).length < 2}
            className="w-full"
          >
            {isCreating ? 'Creating Poll...' : 'Create Poll'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}