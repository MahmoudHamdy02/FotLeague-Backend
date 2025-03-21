export type Match = {
    id: number,
    home: string,
    away: string,
    home_score: number,
    away_score: number,
    match_status: number,
    datetime: string,
    season: number,
    gameweek: number
    live_time: string | null
}