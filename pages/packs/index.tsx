// @ts-nocheck
import { wrapper } from 'src/storage/configureStore'

import { getPacksRequest } from '@entities/pack/redux/actions'

import { MainLayout } from '@components/MainLayout'
import Packs from '@containers/Packs'

import { authorize } from '@utils/server'

export default function PacksPage () {
  return (
    <MainLayout>
      <Packs />
    </MainLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  authorize(async (ctx, store) => {
    await store.dispatch(getPacksRequest({ take: 1000, skip: 0, sort: 'name' }))
    return {
      props: {},
    }
  })
)
