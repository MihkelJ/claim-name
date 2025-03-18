import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function InfoCard({
  title,
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}) {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <p>{description}</p>
      </CardContent>

      {action && (
        <CardFooter>
          <Button onClick={action.onClick}>{action.label}</Button>
        </CardFooter>
      )}
    </Card>
  );
}
