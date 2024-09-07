const { ethers } = require("hardhat");

async function main() {
    const subscriptionConsumerAddress = "0xB79f2BACD52187702Bd8519fC662Af8a0f9779FF"; // Replace with your contract address

    // Get accounts
    const [owner] = await ethers.getSigners();

    // Get contract instances
    const SubscriptionConsumer = await ethers.getContractFactory("FootballFantasy");
    const subscriptionConsumer = SubscriptionConsumer.attach(subscriptionConsumerAddress);

    // Request random words with native payment
    console.log("Requesting random words...");
    const tx = await subscriptionConsumer.requestRandomWords(true); // true means pay with native tokens
    console.log("Transaction Hash:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction Receipt:", receipt);

    // Poll for the RequestSent event
    console.log("Polling for RequestSent event...");
    let requestId = null;
    const eventPollingInterval = 10000; // 10 seconds

    while (!requestId) {
        const events = await subscriptionConsumer.queryFilter('RequestSent');
        for (const event of events) {
            if (event.args) {
                requestId = event.args.requestId;
                console.log("Request ID found:", requestId.toString());
                break;
            }
        }
        if (!requestId) {
            console.log("RequestSent event not found yet, polling again...");
            await new Promise(resolve => setTimeout(resolve, eventPollingInterval)); // Wait before polling again
        }
    }

    // Wait for the VRF callback to fulfill the request
    console.log("Waiting for random values...");
    let fulfilled = false;
    let randomNumbersInRange = [];

    while (!fulfilled) {
        const status = await subscriptionConsumer.getRequestStatus(requestId);
        fulfilled = status.fulfilled;
        if (fulfilled) {
            // Query the new function to get numbers in the range of 1 to 20
            randomNumbersInRange = await subscriptionConsumer.getRandomNumbersInRange(requestId);
            console.log("Random Numbers in Range (1-20):", randomNumbersInRange);
        } else {
            console.log("Request not yet fulfilled, waiting...");
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds before checking again
        }
    }

    console.log("Final Random Numbers in Range (1-20):", randomNumbersInRange);

    // Create a new card with the generated random numbers
    const playerName = "PlayerName"; // Replace with the actual player name
    console.log("Creating new player card...");
    const createCardTx = await subscriptionConsumer.finalizePlayerCard(playerName);
    console.log("Transaction Hash:", createCardTx.hash);

    const createCardReceipt = await createCardTx.wait();
    console.log("Transaction Receipt:", createCardReceipt);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
