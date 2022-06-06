import Head from 'next/head';
import Link from 'next/link';
import { Layout, Date } from '@/components';
import { siteTitle } from '@/components/layout';
import { getSortedPostsData } from '@/lib/posts';
import utilStyles from '@/styles/utils.module.css';


interface PostsProps {
  allPostsData: [
    {
      id: string,
      date: string,
      title: string,
    }
  ]
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    }
  }
}

export default function Home({ allPostsData }: PostsProps) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
              <h1 className="text-xl">바보</h1>
            </li>          ))}
        </ul>
      </section>
    </Layout>
  );
}