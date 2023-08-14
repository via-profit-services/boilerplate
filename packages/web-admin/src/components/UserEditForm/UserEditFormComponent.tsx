import * as React from 'react';
import { UseFormHandleSubmit, UseFormReturn, FormProvider } from 'react-hook-form';

import Button from '@via-profit/ui-kit/Button';
import { Tab, Tabs } from '~/components/Tabs';
import TabCommon from './TabCommon';
import { FormSchema } from './useFormSchema';

export interface UserEditFormComponentProps {
  readonly formMethods: UseFormReturn<FormSchema>;
  readonly onSubmit: ReturnType<UseFormHandleSubmit<FormSchema>>;
}

const UserEditFormComponent: React.FC<UserEditFormComponentProps> = props => {
  const { onSubmit, formMethods } = props;
  const [activeTab, setActiveTab] = React.useState<string>('common');

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit}>
        <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
          <Tab active={activeTab === 'common'} onClick={() => setActiveTab('common')}>
            Common
          </Tab>
          <Tab active={activeTab === 'files'} onClick={() => setActiveTab('files')}>
            Files
          </Tab>
        </Tabs>

        <div hidden={activeTab !== 'common'}>
          <TabCommon />
        </div>

        <div hidden={activeTab !== 'files'}>Files tab here</div>

        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
};

export default UserEditFormComponent;
