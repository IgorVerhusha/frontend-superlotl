// @ts-nocheck
import React from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import get from 'lodash/get'

import OpenSeaIcon from 'public/other/open-sea-icon.svg'

import { useTypedSelector } from '@hooks/useNewTypedSelector'
import { resetModal } from '@entities/modal/actions'
import useMoveToBuyOptions from '@hooks/modal/useMoveToBuyOptions'
import { AbilityToBuyValues } from '@type/restriction'

import Button from '@commonV2/Button'

function OpenSeaLink ({ className = '', openSeaLink }) {
  const navigateToOpenSea = React.useCallback(() => {
    window.open(openSeaLink, '_blank').focus();
  }, [])
  return (
    <StyledOpenSeaButton
      className={className}
      clickHandler={navigateToOpenSea}
    >
      BUY ON OPENSEA
    </StyledOpenSeaButton>
  )
}

const StyledOpenSeaButton = styled(Button)`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 12px 26px 14px;
`

function SoldOut ({ className }) {
  return (
    <Button
      className={className}
      disabled
    >
      Sold Out
    </Button>
  )
}

function BuyButton ({ className, distribution }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const isAbilityToBuy = useTypedSelector((state) => {
    return state.nftCollection.abilityToBuy === AbilityToBuyValues.SUCCESS
  })
	const moveToBuyOptions = useMoveToBuyOptions()

  const handleClick = React.useCallback((e) => {
    if (distribution !== 'PACKS') return moveToBuyOptions()
    e.stopPropagation()
    router.push('/packs')
    dispatch(resetModal())
  }, [distribution, router, dispatch])

  return (
    <Button
      className={className}
      disabled={!isAbilityToBuy}
      clickHandler={handleClick}
    >
      {distribution === 'PACKS' ? 'Buy in Packs' : 'Buy now'}
    </Button>
  )
}

export default React.memo(function ActionButton ({
  className = '', nft
}) {
  const openSeaLink = get(nft, 'openSeaLink')
  if (openSeaLink) {
    return (
      <OpenSeaLink
        className={className}
        openSeaLink={openSeaLink}
      />
    )
  }

  const availableSupply = get(nft, 'availableSupply')
  if (!availableSupply) return <SoldOut className={className} />

  const distribution = get(nft, 'collection.distribution')
  return (
    <BuyButton
      className={className}
      distribution={distribution}
    />
  )
})
