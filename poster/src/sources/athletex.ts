export interface AthleteXConfig {
    source: string
    endpoint: string
    api_key_id: string
}
// TODO: Long-term use AthleteX DEX (https gateway) for accurate pricing
export async function readAthleteXPayload(config: AthleteXConfig, fetchfn) {}