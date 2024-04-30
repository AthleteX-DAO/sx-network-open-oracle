export interface AthleteXConfig {
    source: string
    endpoint: string
    api_key_id: string
}

export async function readAthleteXPayload(config: AthleteXConfig, fetchfn) {}