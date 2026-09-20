import '../styles/global.css';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { getSession, SessionProvider } from 'next-auth/react';
import type { AppType } from 'next/app';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { trpc } from '~/utils/trpc';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps,
}) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    /**
     * On the server use `getServerSession` rather than the client-side
     * `getSession`, which would make an internal HTTP request to
     * `/api/auth/session` on every page load.
     * @see https://github.com/trpc/trpc/issues/5602
     */
    session:
      ctx.req && ctx.res
        ? await getServerSession(
            ctx.req as NextApiRequest,
            ctx.res as NextApiResponse,
            authOptions,
          )
        : await getSession(),
  };
};

export default trpc.withTRPC(MyApp);
