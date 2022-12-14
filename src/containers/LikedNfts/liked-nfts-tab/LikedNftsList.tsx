// @ts-nocheck
import React from 'react'
import { useDispatch } from 'react-redux'

import { LIKED_NFT_DETAILS, NFT_BUY_OPTIONS } from '@constants/modals'
import { NFT } from '@constants/payments'

import { useTypedSelector } from '@hooks/useNewTypedSelector'
import { setModal } from '@entities/modal/actions'

import PlateGrid from '@commonV2/grids/PlateGrid'
import EmptyView from '@components/shared/EmptyView'
import LikedNftCard from '@commonV2/cards/liked-nft-card'
import {GRID_SMALL, LIKED_NFT_PAGE} from "@constants/view-types";

export default function LikedNftsList () {
	const dispatch = useDispatch()
  const nfts = useTypedSelector((state) => state.likedNfts.nfts)

	const openNftDetails = React.useCallback((nft) => {
		dispatch(setModal({
			isOpen: true,
			viewType: LIKED_NFT_DETAILS,
			options: {
				type: NFT,
        initialPoint: LIKED_NFT_DETAILS,
        actionPoint: NFT_BUY_OPTIONS
			},
			data: nft
		}))
	}, [dispatch])

	if (!nfts) return null

	if (nfts.length === 0) {
		return (
			<EmptyView
				emoji='💔'
				btnUrl='/buy'
				btnText='See all NFTs'
				text={`You haven't favorited any items yet`}
			/>
		)
	}

	return (
		<PlateGrid page={LIKED_NFT_PAGE} viewType={GRID_SMALL}>
			{nfts.map((nft) => {
				return (
					<LikedNftCard
						key={nft.id}
            nft={nft}
						clickHandler={() => openNftDetails(nft)}
					/>
				)
			})}
		</PlateGrid>
	)
}
