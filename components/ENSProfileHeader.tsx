import { Card } from '@/components/ui/card';
import CONSTANTS from '@/constants';
import { useRecords } from '@justaname.id/react';

const ENSProfileHeader: React.FC = () => {
  const { records: ensRecords } = useRecords({
    ens: CONSTANTS.ENS_DOMAIN,
  });

  const profileAvatar = ensRecords?.sanitizedRecords.avatar;
  const profileBanner = ensRecords?.sanitizedRecords.header;

  return (
    <Card className="animate-fade-in overflow-hidden">
      {/* Banner Background */}
      <div className="relative">
        <div className="h-64">
          {profileBanner && (
            <img
              src={profileBanner}
              alt={`${CONSTANTS.ENS_DOMAIN} profile banner`}
              className="w-full h-full object-cover"
            />
          )}
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
          {/* Avatar Image */}
          <div className="size-48 rounded-full overflow-hidden border-8 border-white bg-gray-100 shadow-xl">
            {profileAvatar && (
              <img
                src={profileAvatar}
                alt={`${CONSTANTS.ENS_DOMAIN} profile avatar`}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* ENS Domain */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">{CONSTANTS.ENS_DOMAIN}</h2>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ENSProfileHeader;
