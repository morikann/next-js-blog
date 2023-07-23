import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import Layout, { siteTitle } from "../components/Layout";
import utilStyle from "../styles/utils.module.css";
import { getPostsData } from "@/lib/post";

// SSGの場合
// Next.js側で定義されている関数名なので、この関数名に合わせる
export async function getStaticProps() {
  const allPostsData = getPostsData(); // id, title, date, thumbnail
  console.log(allPostsData);

  // Next.jsのgetStaticPropsの特有の書き方。覚えるしかない
  return {
    props: {
      allPostsData,
    },
  };
}

// SSRの場合
// こんな感じでSSRにすることも可能。ページごとに、SSG or SSR を選択できる
// export async function getServerSideProps(context) {
//   return {
//     props: {
//       // コンポーネントに渡すためのprops
//     }
//   }
// }

const inter = Inter({ subsets: ["latin"] });

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyle.headingMd}>
        <p>Flutter/iOSエンジニアです。</p>
      </section>

      <section>
        <h2 className={styles.title}>📝エンジニアのブログ</h2>
        <div className={styles.grid}>
          {allPostsData.map(({ id, title, date, thumbnail }) => (
            <article key={id}>
              <Link href={`/posts/${id}`}>
                <img
                  src={`${thumbnail}`}
                  className={styles.thumbnailImage}
                />
              </Link>
              <Link legacyBehavior href={`/posts/${id}`} >
                <a className={utilStyle.boldText}>
                  {title}
                </a>
              </Link>
              <br />
              <small className={utilStyle.lightText}>{date}</small>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
