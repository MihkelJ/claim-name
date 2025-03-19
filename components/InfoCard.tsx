import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/utils';

export function InfoCard({
  title,
  description,
  action,
  color = 'default',
}: {
  title?: string;
  description?: string;
  color?: 'default' | 'success' | 'warning' | 'error' | 'info';
  action?: {
    label: string;
    onClick: () => void;
  };
}) {
  return (
    <Card
      className={cn(
        'animate-fade-in',
        color === 'success' && 'bg-green-100',
        color === 'warning' && 'bg-yellow-100',
        color === 'error' && 'bg-red-100',
        color === 'info' && 'bg-blue-100',
      )}
    >
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
