import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import styles from './styles.module.scss';
import {
  FiCalendar,
  FiClock,
  FiEdit2,
  FiPlus,
  FiTrash,
  FiX,
} from 'react-icons/fi';
import SupportButton from '../../components/SupportButton';
import { FormEvent, useState } from 'react';
import firebase from '../../services/firebaseConnection';
import Link from 'next/link';
import { format } from 'date-fns';

type TaskList = {
  id: string;
  created: string | Date;
  createdFormated: string;
  tarefa: string;
  userId: string;
  nome: string;
};

interface BoardProps {
  user: {
    id: string;
    nome: string;
  };
  data: string;
}

export default function Board({ user, data }: BoardProps) {
  const [input, setInput] = useState('');
  const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data));
  const [taskEdit, setTaskEdit] = useState<TaskList | null>(null);

  async function handleAddTask(event: FormEvent) {
    event.preventDefault();

    if (input === '') {
      alert('Preencha alguma tarefa!');
      return;
    }

    if (taskEdit) {
      await firebase
        .firestore()
        .collection('tarefas')
        .doc(taskEdit.id)
        .update({
          tarefa: input,
        })
        .then(() => {
          let data = taskList;
          let taskIndex = taskList.findIndex((item) => item.id === taskEdit.id);
          data[taskIndex].tarefa = input;

          setTaskList(data);
          setTaskEdit(null);
          setInput('');
        })
        .catch(() => {});

      return;
    }

    await firebase
      .firestore()
      .collection('tarefas')
      .add({
        created: new Date(),
        tarefa: input,
        userId: user.id,
        nome: user.nome,
      })
      .then((doc) => {
        console.log('Cadastrado com sucesso!');
        let data = {
          id: doc.id,
          created: new Date(),
          createdFormated: format(new Date(), 'dd MMMM yyyy'),
          tarefa: input,
          userId: user.id,
          nome: user.nome,
        };

        setTaskList([...taskList, data]);
        setInput('');
      })
      .catch((err) => {
        console.log('Erro: ', err);
      });
  }

  async function handleDelete(id: string) {
    await firebase
      .firestore()
      .collection('tarefas')
      .doc(id)
      .delete()
      .then(() => {
        console.log('DELETADO COM SUCESSO!');
        let taskDeleted = taskList.filter((item) => {
          return item.id !== id;
        });
        setTaskList(taskDeleted);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function handleEditTask(task: TaskList) {
    setTaskEdit(task);
    setInput(task.tarefa);
  }

  function handleCancelEdit() {
    setInput('');
    setTaskEdit(null);
  }

  return (
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>
      <main className={styles.container}>
        {taskEdit && (
          <span className={styles.warnText}>
            <button onClick={handleCancelEdit}>
              <FiX size={30} color="#FF3636" />
            </button>
            Você está editando uma tarefa!
          </span>
        )}

        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Digite sua tarefa..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">
            <FiPlus size={25} color="#17181F" />
          </button>
        </form>

        <h1>
          Voce tem {taskList.length}{' '}
          {taskList.length === 1 ? 'tarefa' : 'tarefas'}!
        </h1>

        <section>
          {taskList.map((task) => (
            <article className={styles.taskList} key={task.id}>
              <Link href={`/board/${task.id}`}>
                <p>{task.tarefa}</p>
              </Link>

              <div className={styles.actions}>
                <div>
                  <div>
                    <FiCalendar size={20} color="#FFB800" />
                    <time>{task.createdFormated}</time>
                  </div>

                  <button onClick={() => handleEditTask(task)}>
                    <FiEdit2 size={20} color="#FFF" />
                    <span>Editar</span>
                  </button>
                </div>

                <button onClick={() => handleDelete(task.id)}>
                  <FiTrash size={20} color="#FF3636" />
                  <span>Excluir</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      <div className={styles.vipContainer}>
        <h3>Obrigado por apoiar esse projeto.</h3>
        <div>
          <FiClock size={28} color="#FFF" />
          <time>Última doação cerca de 2 horas</time>
        </div>
      </div>

      <SupportButton />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  console.log(session);

  if (!session?.id) {
    // Se o user não estiver logado redireciona
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const tasks = await firebase
    .firestore()
    .collection('tarefas')
    .where('userId', '==', session?.id)
    .orderBy('created', 'asc')
    .get();

  const data = JSON.stringify(
    tasks.docs.map((u) => {
      return {
        id: u.id,
        createdFormated: format(u.data().created.toDate(), 'dd MMMM yyyy'),
        ...u.data(),
      };
    })
  );

  // console.log(data);

  const user = {
    nome: session.user?.name,
    id: session?.id,
  };

  // console.log(session.user);

  return {
    props: {
      user,
      data,
    },
  };
};
