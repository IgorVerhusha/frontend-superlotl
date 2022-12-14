import Button from '@components/shared/Button';

import React, { FC, useEffect, useState } from 'react';

import useSettings from '../useSettings';
import { useTypedSelector } from '@hooks/useNewTypedSelector';
import SecuritySettings from '../SecuritySettings';

import styles from './ChangeEmail.module.scss';

import { dateParse } from '@utils/date-utils';
import { parseErrorMessage } from '@utils/parse-utils';

import { Instructions } from './Instructions';
import { CardHeader } from './CardHeader';
import { Secret } from './Secret';
import { ChangeEmailForm } from './ChangeEmailForm';
import { useRouter } from 'next/router';
import { useNoInitialEffect } from '@hooks/useNoInitialEffect';
import classNames from "classnames";

export const ChangeEmail: FC = () => {
  const {
    register,
    errors,
    onChangeEmail,
    toggleNewEmailValidation,
    otpHandler,
    getNewEmail,
    clearError,
    setError,
    reset,
  } = useSettings();

  const router = useRouter();

  const { twoFactorAuthEnabled, error: authError } = useTypedSelector(
    (state) => state.auth
  );
  const { user, error: userError } = useTypedSelector((state) => state.user);
  const [open, setOpen] = useState(false);

  useNoInitialEffect(() => {
    if (user?.newEmail) {
      router.push('/email-change-confirmation-sent');
    }
  }, [user?.newEmail]);

  useEffect(() => {
    if (!userError) {
      return;
    }
    if (userError.includes('PASSWORD')) {
      setError('password.currentPassword', {
        type: 'serverError',
        message: parseErrorMessage(userError),
      });
    }
    if (userError.includes('EMAIL')) {
      setError('newEmail', {
        type: 'serverError',
        message: parseErrorMessage(userError),
      });
    }
  }, [userError]);

  const openEmailSection = (e) => {
    setOpen(true);
    toggleNewEmailValidation(e);
  };

  const handleCloseSection = () => {
    setOpen(false);
    reset({
      newEmail: '',
      password: {
        currentPassword: '',
        validatePassword: false,
      },
      validateNewEmail: false,
    });
  };

  const lastChanged = dateParse(user?.updatedAt, 'MMM d, yyyy');

  const emailSecurity = {
    title: 'Email',
    description: `Last changed ${lastChanged}`,
    options: (
      <>
        <Button color='blue' size='s' space='m-0' onClick={openEmailSection}>
          Change Email
        </Button>
      </>
    ),
  };

  if (!open) {
    return <SecuritySettings security={emailSecurity} />;
  }

  if (!twoFactorAuthEnabled) {
    return (
      <div className={classNames(styles.cardSettings, { [styles['cardSettings-open']]: open })}>
        <CardHeader handleCloseSection={handleCloseSection} />
        <Instructions />
        <ChangeEmailForm
          register={register}
          errors={errors}
          onChangeEmail={onChangeEmail}
          clearError={clearError}
        />
      </div>
    );
  }

  return (
    <div className={classNames(styles.cardSettings, { [styles['cardSettings-open']]: open })}>
      <CardHeader handleCloseSection={handleCloseSection} />
      <Instructions />
      <Secret otpHandler={otpHandler} clearError={clearError} />
      <ChangeEmailForm
        register={register}
        errors={errors}
        onChangeEmail={onChangeEmail}
        clearError={clearError}
      />
    </div>
  );
};
