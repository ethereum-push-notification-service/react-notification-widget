import React, { useState } from 'react';
import Text from '../../../Text';
import TextInput from '../../../TextInput';
import Flex from '../../../layout/Flex';
import Button from '../../../Button';

type VerifyEmailProps = {
  email: string;
  handleVerify: (code: string) => void;
  handleEdit: () => void;
  isLoading: boolean;
  isDisabled: boolean;
};

const MAX_EMAIL_LENGTH = 16;
const CODE_REGEX = '^[0-9]*$';

const VerifyEmail = ({
  email,
  handleVerify,
  handleEdit,
  isLoading,
  isDisabled,
}: VerifyEmailProps) => {
  const [code, setCode] = useState('');

  const onSubmit = () => {
    if (code.length === 6) {
      handleVerify(code);
    }
  };

  const onCodeChange = (value: string) => {
    if (value.match(CODE_REGEX)) {
      setCode(value);
    }
  };

  return (
    <Flex
      justifyContent={'center'}
      alignItems={'center'}
      direction={'column'}
      width={'100%'}
      gap={1}
    >
      <TextInput
        placeholder={'Enter verification code'}
        value={code}
        onValueChange={onCodeChange}
      />
      <Flex justifyContent={'space-between'} width={'100%'}>
        <Flex direction={'column'} height={'100%'} justifyContent={'center'}>
          <Text>
            Sent to {email.slice(0, MAX_EMAIL_LENGTH)}
            {email.length >= MAX_EMAIL_LENGTH ? '...' : ''}
          </Text>
          <Button variant="text" onClick={handleEdit} size={'md'}>
            Change
          </Button>
        </Flex>
        <Button disabled={code.length !== 6 || isDisabled} onClick={onSubmit} isLoading={isLoading}>
          Submit
        </Button>
      </Flex>
    </Flex>
  );
};

export default VerifyEmail;
