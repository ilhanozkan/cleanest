import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Cleanest | Live lesson platform</title>
        <meta name="description" content="The cleanest live lesson platform." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          CLEAN<span className={styles.titleSuffix}>EST</span>
        </h1>
        <div className={styles.auth}>
          <Link href="/login">
            <button className={styles.logIn}>Log in</button>
          </Link>
          <span className={styles.authSeperator}> | </span>
          <Link href="/register">
            <button className={styles.signUp}>Sign up</button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
