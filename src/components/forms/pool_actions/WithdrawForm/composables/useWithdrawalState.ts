import { Ref, computed, reactive, toRefs } from 'vue';
import { FullPool } from '@/services/balancer/subgraph/types';
import useTokens from '@/composables/useTokens';
import { isStablePhantom } from '@/composables/usePool';
import useRelayerApproval, {
  Relayer
} from '@/composables/trade/useRelayerApproval';

/**
 * STATE
 */
const state = reactive({
  isProportional: true,
  tokenOut: '',
  validInput: true,
  highPriceImpactAccepted: false,
  submitting: false,
  sorReady: false,
  slider: {
    val: 1000,
    max: 1000,
    min: 0,
    interval: 1
  }
});

export default function useWithdrawalState(pool: Ref<FullPool | undefined>) {
  /**
   * COMPOSABLES
   */
  const { nativeAsset, wrappedNativeAsset } = useTokens();
  const batchRelayerApproval = useRelayerApproval(Relayer.BATCH);

  /**
   * COMPUTED
   */
  const tokensOut = computed(() => {
    if (!pool.value) return [];
    const poolTokens = isStablePhantom(pool.value.poolType)
      ? pool.value.mainTokens || []
      : pool.value.tokenAddresses;

    if (!state.isProportional && state.tokenOut === nativeAsset.address)
      // replace WETH with ETH
      return poolTokens.map(address => {
        if (
          wrappedNativeAsset.value != undefined &&
          address === wrappedNativeAsset.value.address
        ) {
          return nativeAsset.address;
        }
        return address;
      });

    return poolTokens;
  });

  const tokenOutIndex = computed(() => {
    return tokensOut.value.indexOf(state.tokenOut);
  });

  /**
   * METHODS
   */
  function maxSlider(): void {
    state.slider.val = state.slider.max;
  }

  return {
    ...toRefs(state),
    tokensOut,
    tokenOutIndex,
    batchRelayerApproval,
    // methods
    maxSlider
  };
}
