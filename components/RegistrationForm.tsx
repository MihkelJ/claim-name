import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CONSTANTS from '@/constants';
import { useRegistrationForm } from '@/hooks/useRegistrationForm';

export function RegistrationForm() {
  const {
    handleSubmit: handleSubnameRegistration,
    isSubnameAvailable,
    form: subnameRegistrationForm,
    isSubmitting: isRegistrationSubmitting,
    error: registrationError,
    debouncedUsername,
  } = useRegistrationForm();

  const hasInput = debouncedUsername?.length > 0;
  const isCheckingAvailability = isSubnameAvailable.isSubnameAvailableFetching;
  const isAvailable = isSubnameAvailable.isSubnameAvailable?.isAvailable;
  const isLoading = isRegistrationSubmitting || isCheckingAvailability;
  const isDisabled = isLoading || !isAvailable || !hasInput;

  const errorMessage =
    hasInput &&
    (registrationError ||
      (!isAvailable && !isCheckingAvailability ? 'Subdomain is not available' : null));

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Claim Your Subdomain</CardTitle>
        <CardDescription>Choose your unique identifier</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubnameRegistration}>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="name">Subdomain Name</Label>
            <div className="relative">
              <Input
                id="name"
                placeholder="Enter your subdomain"
                {...subnameRegistrationForm.register('username')}
                className="pr-[120px]"
                autoComplete="off"
              />
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-muted-foreground">
                .{CONSTANTS.ENS_DOMAIN}
              </div>
            </div>
            {errorMessage && <p className="text-sm text-red-500 mt-1">{errorMessage}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isDisabled}
          >
            {isRegistrationSubmitting ? 'Claiming...' : 'Claim Subdomain'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
