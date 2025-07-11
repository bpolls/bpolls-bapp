'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { showToast } from '@/lib/toast';

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
  const navigate = useNavigate();
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
    rewardPerResponse: '0.00001',
    durationDays: '7',
    maxResponses: '100',
    minContribution: '0.00001',
    fundingType: 'self-funded',
    targetFund: '0',
    rewardToken: '0x0000000000000000000000000000000000000000',
    rewardDistribution: 'equal',
    isOpenImmediately: true,
  });

  // Calculate target fund automatically
  const calculateTargetFund = () => {
    const rewardPerResponse = parseFloat(form.rewardPerResponse) || 0;
    const maxResponses = parseInt(form.maxResponses) || 0;
    return (rewardPerResponse * maxResponses).toString();
  };

  // Update target fund whenever reward per response or max responses change
  const calculatedTargetFund = calculateTargetFund();

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

    // Validate minimum contribution
    const minContribValue = parseFloat(form.minContribution);
    if (minContribValue <= 0) {
      showToast.error('Invalid minimum contribution', 'Minimum contribution must be greater than 0');
      return;
    }

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
        targetFund: parseBigInt(calculatedTargetFund),
        rewardToken: form.rewardToken as `0x${string}`,
        rewardDistribution: form.rewardDistribution,
      };

      const value = form.isOpenImmediately ? parseBigInt(calculatedTargetFund) : BigInt(0);
      
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
      
      // Wait for transaction confirmation and get receipt
      const receipt = await tx.wait();
      
      // Extract poll ID from transaction logs/events
      let pollId: string | null = null;
      if (receipt && receipt.logs) {
        // Look for PollCreated event in the logs
        for (const log of receipt.logs) {
          try {
            // Parse the log using the contract interface
            const parsedLog = contractWithSigner.interface.parseLog(log);
            if (parsedLog && parsedLog.name === 'PollCreated') {
              pollId = parsedLog.args.pollId.toString();
              break;
            }
          } catch (e) {
            // Skip logs that can't be parsed
            continue;
          }
        }
      }
      
      // Reset form
      setForm({
        subject: '',
        description: '',
        category: 'General',
        viewType: 'public',
        options: ['', ''],
        rewardPerResponse: '0.00001',
        durationDays: '7',
        maxResponses: '100',
        minContribution: '0.00001', // Set minimum to 0.001 cBTC
        fundingType: 'self-funded',
        targetFund: '0.00001',
        rewardToken: '0x0000000000000000000000000000000000000000',
        rewardDistribution: 'equal',
        isOpenImmediately: true,
      });
      
      showToast.success('Poll created successfully!', 'Your poll has been deployed to the blockchain.');
      
      // Navigate to the poll detail page if we got the poll ID
      if (pollId) {
        setTimeout(() => {
          navigate(`/poll/${pollId}`);
        }, 1500); // Short delay to show the success message
      }
    } catch (error) {
      console.error('Error creating poll:', error);
      showToast.error('Failed to create poll', 'Please check your wallet and try again.');
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
              <label className="block text-sm font-medium mb-1">Reward Per Response (cBTC)</label>
              <Input
                type="number"
                step="0.000000000000000001"
                value={form.rewardPerResponse}
                onChange={(e) => setForm(prev => ({ ...prev, rewardPerResponse: e.target.value }))}
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Target Fund (cBTC)
                <span className="text-xs text-muted-foreground ml-1">Auto-calculated</span>
              </label>
              <Input
                type="number"
                step="0.000000000000000001"
                value={calculatedTargetFund}
                readOnly
                className="bg-gray-50 text-gray-700 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Automatically calculated as: Max Responses × Reward Per Response
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Minimum Contribution (cBTC) *
              <span className="text-xs text-muted-foreground ml-1">Required by voters to participate</span>
            </label>
            <Input
              type="number"
              step="0.00001"
              value={form.minContribution}
              onChange={(e) => setForm(prev => ({ ...prev, minContribution: e.target.value }))}
              min="0.00001"
              required
              placeholder="0.00001"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum amount voters must contribute to participate (must be greater than 0)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Funding Type *
              <span className="text-xs text-muted-foreground ml-1">How will this poll be funded?</span>
            </label>
            <select
              value={form.fundingType}
              onChange={(e) => setForm(prev => ({ ...prev, fundingType: e.target.value }))}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              required
            >
              <option value="self-funded">Self-funded (You provide all rewards)</option>
              <option value="crowdfunded">Crowdfunded (Community contributes to rewards)</option>
              <option value="unfunded">Unfunded (No rewards provided)</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              {form.fundingType === 'self-funded' && 'You will fund the entire reward pool from your wallet'}
              {form.fundingType === 'crowdfunded' && 'Community members can contribute to the reward pool'}
              {form.fundingType === 'unfunded' && 'No rewards will be distributed for participation'}
            </p>
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