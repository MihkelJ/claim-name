import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSubnameKeysForm } from '@/hooks/useSubnameKeysForm';
import type { Subname } from '@/types/subname';
import { FiLoader, FiSave } from 'react-icons/fi';

interface SubnameManagementFormProps {
  existingSubname: Subname;
}

export function SubnameManagementForm({ existingSubname }: SubnameManagementFormProps) {
  const {
    form: subnameKeysForm,
    handleSubmit: handleSubnameKeysUpdate,
    isSubmitting: isUpdatingSubnameKeys,
    error: subnameKeysError,
    isRecordsFetching: isLoadingSubnameRecords,
  } = useSubnameKeysForm({ ens: existingSubname?.ens || '' });

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Your Subname</CardTitle>
        <CardDescription>
          You already have a subname registered: {existingSubname?.ens}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubnameKeysUpdate}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="avatarKey">Avatar URL</Label>
              <Input
                id="avatarKey"
                placeholder="Enter Avatar URL"
                {...subnameKeysForm.register('avatarKey')}
              />
            </div>
            <div>
              <Label htmlFor="displayKey">Display Name</Label>
              <Input
                id="displayKey"
                placeholder="Enter Display Name"
                {...subnameKeysForm.register('displayKey')}
              />
            </div>
            {subnameKeysError && <p className="text-sm text-red-500">{subnameKeysError}</p>}
            <Button
              type="submit"
              className="w-full"
              disabled={isUpdatingSubnameKeys || isLoadingSubnameRecords}
            >
              {isUpdatingSubnameKeys || isLoadingSubnameRecords ? (
                <FiLoader className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <FiSave className="w-4 h-4 mr-2" />
              )}
              {isUpdatingSubnameKeys ? 'Submitting...' : 'Submit Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
