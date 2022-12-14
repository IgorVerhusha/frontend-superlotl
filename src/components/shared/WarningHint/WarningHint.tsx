import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import InfoIcon from 'public/other/info-icon.svg';

import { useTypedSelector } from '@hooks/useNewTypedSelector';
import {
  checkAbilityToBuyRequest,
  resetAbilityToBuy,
} from '@entities/nft_collection/redux/actions';
import { AbilityToBuyValues } from '@type/restriction';
import styles from './WarningHint.module.scss';
import classNames from 'classnames';

interface IWarningHintProps {
  collectionId?: number;
  className?: string;
}

const WarningHint: FC<IWarningHintProps> = ({ collectionId, className }) => {
  const dispatch = useDispatch();
  const abilityToBuy = useTypedSelector(
    (state) => state.nftCollection.abilityToBuy
  );

  React.useEffect(() => {
    if (collectionId) {
      dispatch(checkAbilityToBuyRequest({ id: collectionId }));
    }
  }, [collectionId]);

  React.useEffect(() => {
    return () => {
      dispatch(resetAbilityToBuy());
    };
  }, []);

  if (!abilityToBuy) return null;
  if (abilityToBuy === AbilityToBuyValues.SUCCESS) return null;

  return (
    <div>
      <div className={classNames(styles['warning-wrapper'], className)}>
        <InfoIcon className={styles.icon} />
        {abilityToBuy}
      </div>
    </div>
  );
};

export default WarningHint;
