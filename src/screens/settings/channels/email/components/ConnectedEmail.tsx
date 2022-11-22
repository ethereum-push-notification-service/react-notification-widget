import React from 'react';
import Spinner from 'components/Spinner';
import Flex from 'components/layout/Flex';
import Button from 'components/Button';
import Text from 'components/Text';

type ConnectedEmailProps = {
  hint: string;
  handleRemove: () => void;
  handleEdit: () => void;
  isLoading: boolean;
  isDisabled: boolean;
};

const ConnectedEmail = ({
  hint,
  handleRemove,
  handleEdit,
  isLoading,
  isDisabled,
}: ConnectedEmailProps) => (
  <Flex direction={'column'} gap={2} width={'100%'}>
    <Text>You are receiving alerts to {hint}</Text>
    <Flex gap={2}>
      <Button width={'100%'} onClick={handleEdit} variant={'semitransparent'}>
        Change
      </Button>
      <Button
        width={'100%'}
        onClick={handleRemove}
        disabled={isDisabled}
        variant={'semitransparent'}
      >
        {isLoading ? <Spinner size={4} /> : 'Remove'}
      </Button>
    </Flex>
  </Flex>
);

export default ConnectedEmail;
