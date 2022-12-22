import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user',
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({ session, token, user }) {
      try {
        return {
          ...session,
          id: token.sub,
        };
      } catch (error) {
        return {
          ...session,
          id: null,
        };
      }
    },
    async signIn(user, account, profile) {
      const { email } = user;

      try {
        return true;
      } catch (error) {
        console.log('DEU ERRO: ', error);
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);
