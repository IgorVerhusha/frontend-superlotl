import React, { FC, useEffect } from 'react';
import classNames from 'classnames';
import styles from './DropDownNotification.module.scss';
import useDropDown from '@shared/DropDown/useDropDown';
import Button from '@components/shared/Button';
import {
  getUserNotificationsRequest,
  updateNotificationRequest,
} from '@entities/notification/redux/actions';
import { DEFAULT_NOTIFICATION_LIMIT } from '@utils/pagination';
import NotificationBell from '/public/assets/img/jungle/icon_notificationBell.svg';

import { useTypedSelector } from '@hooks/useNewTypedSelector';
import { useDispatch } from 'react-redux';
import { dateParse, dateParseToMinutesAgo } from '@utils/date-utils';
import { INotificationData } from 'src/common/models/notification';

import Avatar from '@components/shared/Avatar';
import { useRouter } from 'next/router';

const DropDownNotification: FC = () => {
  const { ref, switchShow, show } = useDropDown();
  const router = useRouter();
  const dispatch = useDispatch();

  const notification = useTypedSelector(
    (state) => state.notification?.notificationList
  );
  const isUnreadNotification = useTypedSelector(
    (state) => state.notification?.isUnreadNotification
  );
  const todayNotifications: INotificationData[] = [];
  const olderNotifications: INotificationData[] = [];

  useEffect(() => {
    return () => {
      switchShow(false);
    };
  }, [router]);

  useEffect(() => {
    if (show && !notification?.length) {
      dispatch(
        getUserNotificationsRequest({
          skip: Number(0),
          take: Number(DEFAULT_NOTIFICATION_LIMIT),
          sort: String('createdAt'),
          order: String('DESC'),
        })
      );
    }
  }, [show]);

  notification?.filter((item) => {
    if (dateParse(item.createdAt) === dateParse(new Date())) {
      todayNotifications.push(item);
    } else {
      olderNotifications.push(item);
    }
  });

  const unReadIds = notification
    ?.filter((item) => item.isRead === false)
    .map((item) => item.id);

  useEffect(() => {
    unReadIds &&
      show &&
      unReadIds.length > 0 &&
      setTimeout(() => {
        dispatch(updateNotificationRequest({ notificationIds: unReadIds }));
      }, 2000);
  }, [notification, unReadIds]);

  const handleToggle = () => switchShow(!show);

  const notificationRender = (
    data: INotificationData[],
    isToday: boolean = false
  ) => {
    return (
      <div className={styles.notificationGroup__item}>
        <div className={styles.notificationGroup__item__day}>
          {isToday ? 'Today' : 'Older'}
        </div>
        {data?.map((item) => (
          <div className={styles.notificationItem} key={item.id}>
            <h2 className={styles.notificationItem__title}>{item?.message}</h2>
            <div className={styles.notificationItem__date}>
              {dateParseToMinutesAgo(item.createdAt)}
              {!item.isRead && (
                <span className={styles.notificationItem__date__unread} />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.dropDownWrapper}>
      <div
        className={classNames([styles.dropDownHeader, show && styles.show])}
        onClick={handleToggle}
      >
        <div className={classNames(styles['user-icon'], show && styles['user-icon--open']) }>
          <div className={classNames(styles.notificationBell,
            isUnreadNotification && show && styles['unReadNotification--show'],
            isUnreadNotification && !show && styles['unReadNotification--close'],
            show && styles['notificationBell--open'],
          )}>
            <NotificationBell />
          </div>
        </div>
      </div>
      <div
        className={classNames([
          styles.dropDownList,
          styles.scrollingWrapper,
          show && styles.show,
          styles['dropDown-right'],
        ])}
        ref={ref}
      >
        <div className={styles.dropDownGroup__header}>
          <div className={styles.dropDownGroup__header__text}>
            Your notifications
          </div>
          <Button
            size='s'
            color='blue'
            url='/settings?tab=notification'
            fullWidth={false}
            className={styles.dropDownGroup__header__button}
          >
            See all
          </Button>
        </div>
        <div className={styles.notificationGroup}>
          {!!todayNotifications.length &&
            notificationRender(todayNotifications, true)}
          {!!olderNotifications.length &&
            notificationRender(olderNotifications)}
        </div>
      </div>
    </div>
  );
};

export default DropDownNotification;
