import { NextPage } from 'next';

import Layout from '@/components/layout/Layout';
import SelectStacks from '@/components/SelectStacks';
import { ShowAssessmentFloors } from '@/components/ShowAssessmentFloors';
import Wizard from '@/components/wizard/wizard';

const Assessments: NextPage = () => {
  return (
    <Layout>
      <main className='flex h-screen flex-col items-center justify-center font-bold'>
        <Wizard>
          <SelectStacks />
          <ShowAssessmentFloors title='Select Assessment' />
        </Wizard>
      </main>
    </Layout>
  );
};

export default Assessments;
