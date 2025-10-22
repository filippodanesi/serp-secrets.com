import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ clientAddress }) => {
  const excludedIPsV4 = import.meta.env.ANALYTICS_EXCLUDED_IPS_V4 || '45.80.136.164';
  const excludedIPsV6 = import.meta.env.ANALYTICS_EXCLUDED_IPS_V6 || '2001:4860:7:142f::fa';

  const ipV4List = excludedIPsV4.split(',').map((ip: string) => ip.trim()).filter(Boolean);
  const ipV6List = excludedIPsV6.split(',').map((ip: string) => ip.trim()).filter(Boolean);
  const excludedIPs = [...ipV4List, ...ipV6List];

  const isExcluded = excludedIPs.includes(clientAddress);

  return new Response(
    JSON.stringify({
      ip: clientAddress,
      shouldTrack: !isExcluded,
      excluded: isExcluded
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    }
  );
};

