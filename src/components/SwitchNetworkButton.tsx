'use client';

import { Button } from '@/components/ui/button';
import { Network } from 'lucide-react';
import { requestNetworkSwitch } from '@/lib/networkUtils';

interface SwitchNetworkButtonProps {
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

export function SwitchNetworkButton({ 
  variant = 'outline', 
  size = 'sm', 
  className = '',
  children
}: SwitchNetworkButtonProps) {
  const handleClick = async () => {
    await requestNetworkSwitch();
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`gap-2 ${className}`}
    >
      <Network className="w-4 h-4" />
      {children || 'Switch to Citrea'}
    </Button>
  );
}