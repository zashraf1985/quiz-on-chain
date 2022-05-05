import { expect } from "chai";
import { ethers } from "hardhat";
import { QuizManager } from "../../src/typechain";

describe.skip("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

describe("QuizManager", function () {
  it("should", async () => {
    const accounts =  await ethers.getSigners();

    const QuizManager = await ethers.getContractFactory("QuizManager");
    let quizManager = await QuizManager.deploy() as QuizManager;
    await quizManager.deployed();

    quizManager.on('ChallengeCreated', (id) => {
      console.log(`Event: ChallengeCreated, id = ${id}`);
    });

    const challengeAcceptedPromise = new Promise((resolve) => {
      quizManager.on('ChallengeAccepted', (challenge) => {
        console.log(`Event: ChallengeAccepted`);
        console.log(challenge);
        resolve(null);
      });
    });

    const resultReportedPromise = new Promise((resolve) => {
      quizManager.on('ResultReported', (challengeId, winner) => {
        console.log(`Event: ResultReported`);
        console.log(challengeId, winner);
        resolve(null);
      });
    });

    await quizManager.createChallenge("60#55-52-48-46-43-41-40-34-26-25-20-17-8-5#58-36-22-11");
    await quizManager.createChallenge("test2");
    await quizManager.createChallenge("test3");

    console.log(await quizManager.getTotalChallenges());

    //console.log((await quizManager.getChallengesById([0,1,2])));

    quizManager =  await quizManager.connect(accounts[1]);

    await quizManager.findAndAcceptChallenge();

    await challengeAcceptedPromise;

    console.log(await quizManager.getChallenges());

    await quizManager.reportResults(0, accounts[0].address);

    await resultReportedPromise;

    console.log(await quizManager.getChallenges());
  })
});
