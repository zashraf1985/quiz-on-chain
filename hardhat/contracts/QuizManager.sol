//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

enum ChallengeStatus {
    OPEN,
    IN_PROGRESS,
    COMPLETED
}

struct Challenge {
    uint256 id;
    address owner;
    string challengeInfo;
    ChallengeStatus status;
    uint256 lastUpdateTime;
    address opponent;
    address winner;
}

contract QuizManager {
    event ChallengeCreated(uint256 challengeId);
    event ChallengeAccepted(Challenge challenge);
    event ResultReported(uint256 challengeId, address winner);

    uint256 private nextChallengeId = 0;

    Challenge[] private challenges;

    function createChallenge(string memory challengeInfo) public {
        challenges.push(
            Challenge({
                id: nextChallengeId,
                owner: msg.sender,
                challengeInfo: challengeInfo,
                lastUpdateTime: block.timestamp,
                status: ChallengeStatus.OPEN,
                opponent: address(0),
                winner: address(0)
            })
        );
        emit ChallengeCreated(nextChallengeId++);
    }

    function findAndAcceptChallenge() public {
        uint256 i;
        for (i = 0; i < challenges.length; i++) {
            if (challenges[i].status == ChallengeStatus.OPEN) {
                break;
            }
        }
        challenges[i].status = ChallengeStatus.IN_PROGRESS;
        challenges[i].lastUpdateTime = block.timestamp;
        challenges[i].opponent = msg.sender;
        emit ChallengeAccepted(challenges[i]);
    }

    function getTotalChallenges() public view returns (uint256) {
        return challenges.length;
    }

    function getChallengesById(uint256[] memory ids)
        public
        view
        returns (Challenge[] memory)
    {
        Challenge[] memory challengesFound = new Challenge[](ids.length);
        uint256 challengeIndex = 0;

        //TODO: Replace this with binary search since array is always sorted by challenge ids.
        for (uint256 i = 0; i < challenges.length; i++) {
            for (uint256 j = 0; j < ids.length; j++) {
                if (
                    challenges[i].id == ids[j] &&
                    msg.sender == challenges[i].owner
                ) {
                    challengesFound[challengeIndex] = challenges[i];
                    challengeIndex++;
                }
            }
        }

        // cleaning up the redundant blank items from the end of the previous array
        Challenge[] memory challengesCleaned = new Challenge[](challengeIndex);
        for (uint256 i = 0; i < challengeIndex; i++) {
            challengesCleaned[i] = challengesFound[i];
        }
        return challengesCleaned;
    }

    function reportResults(uint256 challengeId, address winner) public {
        for (uint256 i = 0; i < challenges.length; i++) {
            if (
                challenges[i].id == challengeId &&
                challenges[i].status == ChallengeStatus.IN_PROGRESS &&
                msg.sender == challenges[i].opponent &&
                (winner == challenges[i].opponent ||
                    winner == challenges[i].owner)
            ) {
                challenges[i].winner = winner;
                challenges[i].status = ChallengeStatus.COMPLETED;
                emit ResultReported(challenges[i].id, winner);
            }
        }
    }

    // For debug purpose only, Remove Later
    function getChallenges() public view returns (Challenge[] memory) {
        return challenges;
    }
}
