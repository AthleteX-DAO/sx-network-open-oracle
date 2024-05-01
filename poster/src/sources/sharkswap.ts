export interface SharkswapConfig {
    source: string
    endpoint: string
    api_key_id: string
}
// TODO: use sharkswap DEX (https gateway) for accurate prices on SX Network
export async function readSharkswapPayload(config: SharkswapConfig, fetchfn) {}