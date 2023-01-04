import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import styles from './styles.module.scss';
import { PayPalButtons } from '@paypal/react-paypal-js';
// AdHHDtiXl4f9q8j0Ghzo5baTq-ohaPSrxN91MG1pQF-zGY_JvDJ7qKRmdQHVVtQIdgYlvoxI5PWDpUqN
{
  /* <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script> */
}
import firebase from '../../services/firebaseConnection';
import { useState } from 'react';

interface DonateProps {
  user: {
    nome: string;
    id: string;
    image: string;
  };
}

export default function Donate({ user }: DonateProps) {
  const [vip, setVip] = useState(false);

  async function handleSaveDonate() {
    await firebase
      .firestore()
      .collection('users')
      .doc(user.id)
      .set({
        donate: true,
        lastDonate: new Date(),
        image: user.image,
      })
      .then(() => {
        setVip(true);
      });
  }

  return (
    <>
      <Head>
        <title>Ajide a plataforma board ficar online!</title>
      </Head>
      <main className={styles.container}>
        <img src="/images/rocket.svg" alt="Seja Apoiador" />

        {vip && (
          <div className={styles.vip}>
            <img src={user.image} alt="Foto de perfil do usuário" />
            <span>Parabéns você é um novo apoiador!</span>
          </div>
        )}

        <h1>Seja um apoiador deste projeto 🏆</h1>
        <h3>
          Contribua com apenas <span>R$ 1,00</span>
        </h3>
        <strong>
          Apareça na nossa home, tenha funcionalidades exclusivas.
        </strong>

        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: '1',
                  },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order?.capture().then(function (details) {
              console.log('Compra aprovada: ' + details.payer.name?.given_name);
              handleSaveDonate();
            });
          }}
        />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  console.log(session);

  if (!session?.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const user = {
    nome: session.user?.name,
    id: session?.id,
    image: session.user?.image,
  };

  return {
    props: {
      user,
    },
  };
};
