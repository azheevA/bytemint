function getExternalUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function getAdsenseClient(value: string | undefined): string | null {
  const client = value?.trim() ?? "";
  return /^ca-pub-\d{8,20}$/.test(client) ? client : null;
}

function getAdSlot(value: string | undefined): string | null {
  const slot = value?.trim() ?? "";
  return /^\d{5,20}$/.test(slot) ? slot : null;
}

export const monetization = {
  adsenseClient: getAdsenseClient(process.env.NEXT_PUBLIC_ADSENSE_CLIENT),
  topAdSlot: getAdSlot(process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP),
  hostingAffiliateUrl: getExternalUrl(
    process.env.NEXT_PUBLIC_AFFILIATE_HOSTING_URL,
  ),
  aiAffiliateUrl: getExternalUrl(process.env.NEXT_PUBLIC_AFFILIATE_AI_URL),
  premiumProductUrl: getExternalUrl(
    process.env.NEXT_PUBLIC_PREMIUM_PRODUCT_URL,
  ),
};

export const hasAffiliateLinks = Boolean(
  monetization.hostingAffiliateUrl || monetization.aiAffiliateUrl,
);
