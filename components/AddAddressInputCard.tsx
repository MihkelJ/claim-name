'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useFollowAddress } from '@/hooks/useFollowAddress';
import { useState } from 'react';
import { isAddress } from 'viem';

const AddAddressInputCard = () => {
  const { followAddress } = useFollowAddress();
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (!isAddress(address)) {
        setError('Invalid Ethereum address');
        return;
      }

      followAddress(address);
      setAddress(''); // Clear input after successful submission
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to follow address');
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-6">
        <CardTitle className="text-base">Follow Address</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter an Ethereum address to add them as a member and track their transactions.
        </p>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2"
        >
          <div className="flex gap-2">
            <Input
              placeholder="Enter Ethereum address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            <Button type="submit">Follow</Button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
};

export default AddAddressInputCard;
