import React, { useState } from 'react';
import Flex from 'components/layout/Flex';
import SettingsItem from 'screens/settings/components/SettingsItem';
import { Email as EmailIcon } from 'components/icons';
import useEmailActions from 'screens/settings/channels/email/useEmailActions';
import EditEmailView from 'screens/settings/channels/email/components/EditEmailView';
import VerifyEmailView from 'screens/settings/channels/email/components/VerifyEmailView';
import ConnectedEmailView from 'screens/settings/channels/email/components/ConnectedEmailView';
import { useAuthContext } from 'context/AuthContext';

export const EmailChannel = () => {
  const { isLoading } = useAuthContext();

  const {
    email,
    setEmail,
    isEditing,
    isVerify,
    handleSave,
    handleVerify,
    handleRemove,
    setIsEditing,
    saveLoading,
    verifyLoading,
    deleteLoading,
    exists,
    hint,
  } = useEmailActions();

  return (
    <SettingsItem title={'Email'} icon={<EmailIcon />} defaultOpen={true} connected={!!exists}>
      <Flex width={'100%'}>
        {isEditing && isVerify && (
          <VerifyEmailView
            email={email}
            handleVerify={handleVerify}
            handleEdit={() => setIsEditing(true)}
            isLoading={verifyLoading || isLoading}
          />
        )}
        {isEditing && !isVerify && (
          <EditEmailView
            value={email}
            onChange={setEmail}
            handleSave={handleSave}
            isLoading={saveLoading || isLoading}
          />
        )}
        {!isEditing && (
          <ConnectedEmailView
            hint={hint}
            handleRemove={handleRemove}
            handleEdit={() => setIsEditing(true)}
            isLoading={deleteLoading || isLoading}
          />
        )}
      </Flex>
    </SettingsItem>
  );
};