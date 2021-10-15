import Head from 'next/head'

const Home = () => {
  return (
    <>
      <Head>
        <title>Website Audit</title>
        <meta name="description" content="Audit, store, and display website data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          Display data here
        </div>
        <div>
          Audit here
        </div>
      </main>
    </>
  )
}

export default Home
