import React, { FC, useCallback } from 'react';
import Navigation from '../navigation';
import Navbar from '@components/shared/Navbar';
import { useDispatch } from 'react-redux';
import NavButton from '@shared/NavButton';
import { useTypedSelector } from '@hooks/useNewTypedSelector';
import { logOut } from '@entities/auth/redux/actions';
import DropDownUser from '@components/DropDownUser';
import Avatar from '@components/shared/Avatar';
import { getMenuHeader } from 'configure';
import ButtonClose from '/public/assets/img/icon-close.svg';
import UserIcon from '/public/assets/img/jungle/icon_user.svg';

import styles from './headerNavigation.module.scss';
import useHeader from './useHeader';
import classNames from 'classnames';
import { useMetamask } from '@hooks/useMetamask';
import Link from 'next/link';
import DropDownNotification from '@components/DropDownNotification';
import { toast } from 'react-toastify';
import { isServer } from '@utils/common';
import formatAddress from '@utils/metamask/formatAddress';
import HeaderLogo from '@components/header/header.logo';
import classnames from 'classnames';

type Props = {
  isHomePage?: boolean
}

const HeaderNavigation: FC<Props> = ({ isHomePage }) => {
  const { getMetamaskAddress, metamaskAccountChange } = useMetamask();
  const { userType, twoFactorAuthEnabled, twoFactorPassed } = useTypedSelector(
    (state) => state.auth
  );
  const { navigationConfig, error: navError } = useTypedSelector(
    (state) => state.configuration
  );
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    dispatch(logOut());
  };

  const getOptions = (options) =>
    options.map((item, index) => ({
      id: index,
      linkTo: item.linkTo,
      name: (
        <>
          <item.icon width="18" height="18"/>
          {item.name}
        </>
      ),
      submenu: item.submenu,
      restrictId: item.restrictId,
    }));

  const _checkUserLoggedIn = () => {
    if (userType == 'authorized' && !twoFactorAuthEnabled) {
      return true;
    }
    if (twoFactorAuthEnabled && twoFactorPassed) {
      return true;
    }
    return false;
  };

  const needHideHeaderInfo = (): boolean => {
    if (isServer) return true;
    if (navError) return false;
    if (!navigationConfig) return true;
    return false;
  };

  const imgSrc = '/other/user.svg';

  const user = ({ isOpen }) => (
    <div
      className={classnames(styles['user-icon'], {
        [styles['user-icon--open']]: isOpen
      })}
    >
      <UserIcon/>
    </div>
  );

  const { ref, switchShow, show } = useHeader();

  const handleToggle = () => switchShow(!show);

  const wConnected = getMetamaskAddress() ?? false;
  const menuHeader = getMenuHeader(wConnected, (address) => {
    metamaskAccountChange(address).then((res: any) => {
      if (res.type === 'user/metaMaskSend/rejected') {
        toast.error('This metamask address is already is being used');
        return false;
      }
      if (!address) {
        toast.error(
          'Something went wrong. Please try again or contact  support'
        );
        console.error('Metamask address in empty!');
        return false;
      }
      toast.success(
        `Your Metamask wallet ${formatAddress(
          address
        )} is connected. Please open the Metamask wallet extension if you want to see the details`
      );
    });
  });
  if (needHideHeaderInfo()) {
    return null;
  }

  return (
    <div className={classnames(styles.container, { [styles.homeContainer]: isHomePage })}>
      <div onClick={handleToggle}>
        <Navbar isHomePage />
      </div>
      <div className={classnames(styles.login, { [styles.homeLogin]: isHomePage })}>
        <HeaderLogo/>
        <Link href="/">
          <a>Superlotl</a>
        </Link>
      </div>
      <div
        className={classNames(
          styles['header-navigation-overlay'],
          show ? styles.isActive : ''
        )}
      ></div>
      <div
        className={classNames(
          styles['header-navigation'],
          show ? styles.isActive : '',
          { [styles['home-header-navigation']]: isHomePage }
        )}
        ref={ref}
      >
        <div className={styles.header}>
          <button className={styles['navbar-close']} onClick={handleToggle}>
            <ButtonClose className={styles['navbar-close-icon']}/>
          </button>
        </div>
        <div className={styles['navigation-wrapper']}>
          <Navigation onClickNavigation={handleToggle} isHomePage/>
        </div>
      </div>
      {(userType === 'prospect' ||
        userType === 'visitor' ||
        (userType === 'authorized' &&
          twoFactorAuthEnabled &&
          !twoFactorPassed)) && (
        <div className={classNames(styles.navButtonContainer, { [styles.homeNavButtonContainer]: isHomePage })}>
          <div className={styles.navButtonLineContainer}>
            <div className={styles.navButtonLine}/>
            <div className={styles.navButtonLine}/>
            <div className={styles.navButtonLine}/>
          </div>
          <NavButton
            className={classNames(styles.navButton)}
            size="m"
            color="blue"
            fillStyle={false}
            fullWidth={false}
            to="/signin"
          >
            Sign In
          </NavButton>
          <div className={styles.navButtonLineContainer}>
            <div className={styles.navButtonLine}/>
            <div className={styles.navButtonLine}/>
            <div className={styles.navButtonLine}/>
          </div>
        </div>
      )}

      {_checkUserLoggedIn() && (
        <div className={styles.userDropdownWrapper}>
          <DropDownNotification/>
          <DropDownUser
            right={true}
            UserText={user}
            showSearch={true}
            options={getOptions(menuHeader)}
            logoutHandler={logoutHandler}
          />
        </div>
      )}
    </div>
  );
};

export default HeaderNavigation;
