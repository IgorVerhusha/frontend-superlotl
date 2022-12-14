// @ts-nocheck
import { wrapper } from 'src/storage/configureStore';

import { filtersUpdate } from '@entities/filters/actions';
import { getBuyNFTsRequest } from '@entities/nft/redux/actions';

import { MainLayout } from '@components/MainLayout';
import Buy from '@containers/Buy';

import { authorize } from '@utils/server';
import sanitizeBuyNFTsRequest from '@utils/filters/sanitizeBuyNFTsRequest';
import parseFilters from '@utils/filters/parseFilters';

export default function BuyPage() {
  return (
    <MainLayout>
      <Buy />
    </MainLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  authorize(async (ctx, store) => {
    const data = sanitizeBuyNFTsRequest(parseFilters(ctx.query));
    await store.dispatch(filtersUpdate(parseFilters(ctx.query)));
    await store.dispatch(getBuyNFTsRequest(data));
    return {
      props: {},
    };
  })
);
