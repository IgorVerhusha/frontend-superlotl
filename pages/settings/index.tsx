import SettingsComponent from '@components/Settings';
import React, { useEffect } from 'react';
import { useTypedSelector } from '@hooks/useNewTypedSelector';
import { userPhotoRequest } from '@entities/user/redux/actions';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { isServer } from '@utils/common';
import { MainLayout } from '@components/MainLayout';
import Butterfly from '@components/ParrotAndButterfly/Butterfly';

function Settings() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useTypedSelector((state) => state.user);
  const { userType } = useTypedSelector((state) => state.auth);

  useEffect(() => {
    if (!user?.photo && !isServer) {
      dispatch(userPhotoRequest({}));
    }
  }, [dispatch, user?.photo]);

  if (userType !== 'authorized' && !isServer) {
    //temporary solution for redirecting to login page if user is not logged in
    router.replace('/');
    return null;
  }

  return (
    <MainLayout>
      {user ? <SettingsComponent user={user} /> : null}
    </MainLayout>
  );
}

export default Settings;
