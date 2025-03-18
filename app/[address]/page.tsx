import SubnameViewPage from './view';
import { Address } from 'viem';

export default async function SubnameRegistrationPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const resolvedParams = await params;

  return <SubnameViewPage params={{ address: resolvedParams.address as Address }} />;
}
