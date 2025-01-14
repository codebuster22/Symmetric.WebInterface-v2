import { balancerSubgraphClient } from './balancer-subgraph.client';
import { rpcProviderService as _rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import Pools from './entities/pools';
import Tokens from './entities/tokens';
import PoolShares from './entities/poolShares';
import PoolActivities from './entities/poolActivities';
import PoolSwaps from './entities/poolSwaps';
import PoolSnapshots from './entities/poolSnapshots';
import TradePairSnapshots from './entities/tradePairs';

import { Network, networkId } from '@/composables/useNetwork';

export default class BalancerSubgraphService {
  pools: Pools;
  poolShares: PoolShares;
  poolActivities: PoolActivities;
  poolSwaps: PoolSwaps;
  poolSnapshots: PoolSnapshots;
  tradePairSnapshots: TradePairSnapshots;
  tokens: Tokens;

  constructor(
    readonly client = balancerSubgraphClient,
    readonly rpcProviderService = _rpcProviderService
  ) {
    // Init entities
    this.pools = new Pools(this);
    this.poolShares = new PoolShares(this);
    this.poolActivities = new PoolActivities(this);
    this.poolSwaps = new PoolSwaps(this);
    this.poolSnapshots = new PoolSnapshots(this);
    this.tradePairSnapshots = new TradePairSnapshots(this);
    this.tokens = new Tokens(this);
  }

  public get blockTime(): number {
    switch (networkId.value) {
      case Network.MAINNET:
        return 13;
      case Network.POLYGON:
        return 2;
      case Network.ARBITRUM:
        return 3;
      case Network.KOVAN:
        // Should be ~4s but this causes subgraph to return with unindexed block error.
        return 1;
      case Network.CELO:
        return 5;
      case Network.GNOSIS:
        return 5;
      default:
        return 13;
    }
  }
}

export const balancerSubgraphService = new BalancerSubgraphService();
