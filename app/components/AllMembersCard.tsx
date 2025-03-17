import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const AllMembersCard = () => {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Add New Member</CardTitle>
        </div>
      </CardHeader>
    </Card>
  );
};

export default AllMembersCard;
