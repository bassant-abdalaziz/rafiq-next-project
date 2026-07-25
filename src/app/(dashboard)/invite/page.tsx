import InvitePageClient from "./invite-page-client";

type InvitePageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function InvitePage({ searchParams }: InvitePageProps) {
  const { token } = await searchParams;

  return <InvitePageClient token={token ?? null} />;
}
