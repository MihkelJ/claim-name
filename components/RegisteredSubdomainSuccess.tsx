import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MdVerified } from 'react-icons/md';

export function RegisteredSubdomainSuccess() {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MdVerified className="w-8 h-8 text-green-500" />
          <CardTitle>Success! 🎉</CardTitle>
        </div>
        <CardDescription>
          Your subdomain has been successfully registered. You can now use it to receive payments
          and manage your preferences.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
