import React from 'react';
import TextInput from '../../../TextInput';
import Flex from '../../../layout/Flex';
import Button from '../../../Button';
import isEmailValid from '../../../../helpers/functions/isEmailValid';
import { UserCommunicationChannel } from 'global/types.generated';

type EditEmailProps = {
  value: string;
  onChange(value: string): void;
  handleSave: () => void;
  handleCancel: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  email?: UserCommunicationChannel;
  isConnected?: boolean;
};

const EditEmail = ({
  value,
  onChange,
  handleSave,
  handleCancel,
  isLoading,
  isDisabled,
  isConnected,
}: EditEmailProps) => (
  <Flex justifyContent={'center'} alignItems={'center'} direction={'column'} width={'100%'} gap={1}>
    <TextInput
      placeholder={'Enter your email...'}
      value={value}
      onValueChange={(value) => onChange(value)}
    />
    <Flex
      justifyContent={isConnected ? 'space-between' : 'end'}
      alignItems={'center'}
      width={'100%'}
    >
      {isConnected && (
        <Button variant="text" onClick={handleCancel} size={'md'}>
          Cancel
        </Button>
      )}
      <Button
        disabled={!isEmailValid(value) || isDisabled}
        isLoading={isLoading}
        onClick={handleSave}
      >
        Next
      </Button>
    </Flex>
  </Flex>
);

export default EditEmail;
