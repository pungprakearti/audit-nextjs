import Head from 'next/head'
import Audits from '../components/Audits'
import AuditForm from '../components/AuditForm'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get audits from database
export async function getServerSideProps() {
  const auditData = await prisma.audit.findMany();
  return {
    props: {
      audits: auditData
    }
  }
}

const Home = (audits) => {
  console.log(audits)
  return (
    <>
      <Head>
        <title>Website Audit</title>
        <meta name="description" content="Audit, store, and display website data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <Audits audits={audits.audits} />
        </div>
        <div>
          <AuditForm />
        </div>
      </main>
    </>
  )
}

export default Home
