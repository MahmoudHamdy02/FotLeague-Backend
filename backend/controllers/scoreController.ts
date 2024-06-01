import { Request, Response } from "express";
import * as matchService from "../services/matchService";
import * as predictionService from "../services/predictionService";
import { Score } from "../types/Score";
import { scoreService } from "../services/scoreService";
import { MatchStatus } from "../enums/MatchStatus";

const calculateScore = (trueHomeScore: number, trueAwayScore: number, predictedHomeScore: number, predictedAwayScore: number): 0 | 1 | 3 => {
    // Exact prediction
    if (trueHomeScore === predictedHomeScore && trueAwayScore === predictedAwayScore)
        return 3;

    // Correct result but wrong goal count
    if (
        // Draw
        (trueHomeScore === trueAwayScore && predictedHomeScore === predictedAwayScore)
        ||
        // Home win
        (trueHomeScore > trueAwayScore && predictedHomeScore > predictedAwayScore)
        ||
        // Away win
        (trueHomeScore < trueAwayScore && predictedHomeScore < predictedAwayScore)
    )
        return 1;

    // Wrong result
    return 0;
};

export const getUserScoresBySeason = async (req: Request, res: Response) => {
    const userId = req.authUser.id;
    const {season} = req.params;

    try {
        const scores = await scoreService.getUserScoresBySeason(userId, parseInt(season));

        return res.status(200).json(scores);
    } catch (error) {
        return res.status(400).json({error: "Error getting user scores"});
    }
};

// TODO: Validate request parameters and body
export const calculateScoresForMatch = async (req: Request, res: Response) => {
    const { matchId } = req.body;

    try {
        const match = await matchService.getMatchDetails(matchId);
        if (match.match_status !== MatchStatus.Played)
            return res.status(400).json({error: "Match must be played"});

        await matchService.updateMatchStatus(matchId, MatchStatus.Calculated);

        const matchPredictions = await predictionService.getMatchPredictions(matchId);

        const scores: Omit<Score, "id">[] = [];

        matchPredictions.forEach(prediction => {
            scores.push({
                user_id: prediction.user_id,
                match_id: prediction.match_id,
                score: calculateScore(match.home_score, match.away_score, prediction.home, prediction.away)
            });
        });

        await scoreService.addScores(scores);

        return res.status(200).json({message: "OK"});
    } catch (error) {
        return res.status(400).json({error: "Error calculating scores"});
    }
};