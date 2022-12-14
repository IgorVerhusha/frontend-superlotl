import Button from '@components/shared/Button';
import btnStyles from '@components/shared/Button/Button.module.scss';
import InputWithLabel from '@components/shared/InputWithLabel';
import TextHelper from '@components/shared/TextHelper';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import styles from './ChangePassword.module.scss';
import { FIELD_LABELS } from '@components/Settings/validationSchema';
import useSettings from '../useSettings';
import { dateParse } from '@utils/date-utils';
import { useTypedSelector } from '@hooks/useNewTypedSelector';
import SecuritySettings from '../SecuritySettings';
import { useNoInitialEffect } from '@hooks/useNoInitialEffect';
import { toast } from 'react-toastify';
import {
  getConflictField,
  parseErrorMessage,
  parsePasswordErrorMessage,
} from '@utils/parse-utils';
import { PasswordErrorTypes } from '@type/general';

const ChangePassword = () => {
  const {
    register,
    errors,
    onChangePassword,
    onOpenChangePassword,
    setError,
    clearError,
    reset,
  } = useSettings();
  const [showPasswordSection, togglePasswordSection] = useState(false);
  const {
    user,
    pending,
    error: userError,
  } = useTypedSelector((state) => state.user);

  useNoInitialEffect(() => {
    if (!userError && !pending && showPasswordSection) {
      togglePasswordSection(false);
    }
  }, [pending]);

  useEffect(() => {
    if (!userError) {
      return;
    }
    if (getConflictField(userError) === 'password') {
      const parseResult = parsePasswordErrorMessage(userError);
      switch (parseResult.type) {
        case PasswordErrorTypes.WRONG_PASSWORD:
          setError('password.currentPassword', {
            type: 'serverError',
            message: parseResult.message,
          });
          break;
        case PasswordErrorTypes.TOO_WEAK:
          setError('password.password', {
            type: 'serverError',
            message: parseResult.message,
          });
          break;
        default:
          setError('password.password', {
            type: 'serverError',
            message: parseResult.message,
          });
      }
    }
  }, [userError]);

  const handleCloseSection = () => {
    togglePasswordSection(false);
    reset({
      password: {
        password: '',
        currentPassword: '',
        confirmPassword: '',
        validatePassword: false,
      },
    });
  };

  const openPasswordSection = (e) => {
    onOpenChangePassword(e);
    togglePasswordSection(true);
  };

  const lastChanged = dateParse(user?.updatedAt, 'MMM d, yyyy');

  const passwordSecurity = {
    title: 'Password',
    description: `Last changed ${lastChanged}`,
    options: (
      <>
        <Button color='blue' size='s' space='m-0' onClick={openPasswordSection}>
          Change password
        </Button>
      </>
    ),
  };

  const CardHeader = () => (
    <div className={styles.cardHeader}>
      <div className={styles.cardTitle}>Password</div>
      <div className={styles.btn_wrapper}>
        <Button
          className={classNames('mt-0', btnStyles['btn-cancel'])}
          onClick={handleCloseSection}
          size='s'
          color={'blue'}
          fillStyle
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  if (!showPasswordSection) {
    return <SecuritySettings security={passwordSecurity} />;
  }

  return (
    <>
      <div className={styles.changePassword}>
        <CardHeader />
        <div className={styles.settingsRow}>
          <div className={styles.settingsColumn}>
            <InputWithLabel
              className={styles.input}
              labelText='Current password'
              placeholder='Enter your password'
              id='password'
              size='m'
              customType='password'
              onFocus={() =>
                clearError(
                  errors?.password?.currentPassword,
                  'password.currentPassword'
                )
              }
              error={
                errors?.password?.currentPassword &&
                errors.password.currentPassword
              }
              {...register(FIELD_LABELS.PASSWORD.CURRENT_PASSWORD)}
            />
          </div>
        </div>
        <div className={styles.settingsRow}>
          <div className={styles.settingsColumn}>
            <InputWithLabel
              className={styles.input}
              labelText='New password'
              placeholder='Enter your password'
              id='newPassword'
              size='m'
              error={errors?.password?.password && errors.password.password}
              customType='password'
              onFocus={() =>
                clearError(errors?.password?.password, 'password.password')
              }
              {...register(FIELD_LABELS.PASSWORD.PASSWORD)}
            />
            <InputWithLabel
              className={styles.input}
              labelText='Repeat new password'
              placeholder='Enter your password'
              id='confirmPassword'
              customType='password'
              size='m'
              onFocus={() =>
                clearError(
                  errors?.password?.confirmPassword,
                  'password.confirmPassword'
                )
              }
              error={
                errors?.password?.confirmPassword &&
                errors.password.confirmPassword
              }
              {...register(FIELD_LABELS.PASSWORD.CONFIRM_PASSWORD)}
            />
          </div>
          <div className={classNames('mt-auto')}>
            <TextHelper className={styles.settingHelperText} title='Password strength:'>
              <p>{`Use at least 8 characters. Don't use a password from another site,
              or something too obvious like your pet's name. Your password can
              be any combination of letters, numbers, and symbols.`}</p>
            </TextHelper>
          </div>
        </div>
        <Button className={styles.saveButton} size='l' color='blue' onClick={onChangePassword}>
          Save new password
        </Button>
      </div>
    </>
  );
};

export default ChangePassword;
