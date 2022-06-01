---
sponsor: "Kuiper"
slug: "2021-12-defiprotocol"
date: "2022-05-02"
title: "Kuiper contest"
findings: "https://github.com/code-423n4/2021-12-defiprotocol-findings/issues"
contest: 65
---

# Overview

## About C4

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the Kuiper smart contract system written in Solidity. The audit contest took place between December 8—December 10 2021.

_Note: this audit contest originally ran under the name `defiProtocol`._

## Wardens

27 Wardens contributed reports to the Kuiper contest:

  1. [kenzo](https://twitter.com/KenzoAgada)
  1. 0x0x0x
  1. WatchPug ([jtp](https://github.com/jack-the-pug) and [ming](https://github.com/mingwatch))
  1. [GiveMeTestEther](https://twitter.com/GiveMeTestEther)
  1. [gzeon](https://twitter.com/gzeon)
  1. [TomFrenchBlockchain](https://github.com/TomAFrench)
  1. [broccolirob](https://twitter.com/0xbroccolirob)
  1. [Ruhum](https://twitter.com/0xruhum)
  1. [0v3rf10w](https://twitter.com/_0v3rf10w)
  1. [gpersoon](https://twitter.com/gpersoon)
  1. robee
  1. Jujic
  1. [ye0lde](https://twitter.com/_ye0lde)
  1. rishabh
  1. [Meta0xNull](https://twitter.com/Meta0xNull)
  1. [cmichel](https://twitter.com/cmichelio)
  1. saian
  1. neslinesli93
  1. [danb](https://twitter.com/danbinnun)
  1. [pmerkleplant](https://twitter.com/merkleplant_eth)
  1. pedroais
  1. [bw](https://github.com/bernard-wagner)
  1. [sirhashalot](https://twitter.com/SirH4shalot)
  1. hagrid
  1. 0x1f8b
  1. [BouSalman](https://twitter.com/BouSalman)

This contest was judged by [0xleastwood](https://twitter.com/liam_eastwood13).

Final report assembled by [liveactionllama](https://twitter.com/liveactionllama).

# Summary

The C4 analysis yielded an aggregated total of 20 unique vulnerabilities and 89 total findings. All of the issues presented here are linked back to their original finding.

Of these vulnerabilities, 1 received a risk rating in the category of HIGH severity, 11 received a risk rating in the category of MEDIUM severity, and 8 received a risk rating in the category of LOW severity.

C4 analysis also identified 29 non-critical recommendations and 40 gas optimizations.

# Scope

The code under review can be found within the [C4 Kuiper contest repository](https://github.com/code-423n4/2021-12-defiProtocol), and is composed of 3 smart contracts written in the Solidity programming language and includes 588 lines of Solidity code.

# Severity Criteria

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

- Malicious Input Handling
- Escalation of privileges
- Arithmetic
- Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code423n4.com).

# High Risk Findings (1)
## [[H-01] Wrong fee calculation after `totalSupply` was 0](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/58)
_Submitted by kenzo_

`handleFees` does not update `lastFee` if `startSupply == 0`.
This means that wrongly, extra fee tokens would be minted once the basket is resupplied and `handleFees` is called again.

### Impact

Loss of user funds.
The extra minting of fee tokens comes on the expense of the regular basket token owners, which upon withdrawal would get less underlying than their true share, due to the dilution of their tokens' value.

### Proof of Concept

Scenario:

*   All basket token holders are burning their tokens. The last burn would set totalSupply to 0.
*   After 1 day, somebody mints basket tokens.

`handleFees` would be called upon mint, and would just return since totalSupply == 0. Note: It does not update `lastFee`.

    } else if (startSupply == 0) {
                return;

[Basket.sol#L136:#L137](https://github.com/code-423n4/2021-12-defiprotocol/blob/main/contracts/contracts/Basket.sol#L136:#L137)

*   The next block, somebody else mints a token. Now `handleFees` will be called and will calculate the fees according to the current supply and the time diff between now and `lastFee`:

<!---->

    uint256 timeDiff = (block.timestamp - lastFee);

[Basket.sol#L139](https://github.com/code-423n4/2021-12-defiprotocol/blob/main/contracts/contracts/Basket.sol#L139)<br>
But as we saw, `lastFee` wasn't updated in the previous step. `lastFee` is still the time of 1 day before - when the last person burned his tokens and the basket supply was 0.
So now the basket will mint fees as if a whole day has passed since the last calculation, but actually it only needs to calculate the fees for the last block, since only then we had tokens in the basket.

### Recommended Mitigation Steps

Set `lastFee = block.timestamp` if `startSupply == 0`.

**[frank-beard (Kuiper) confirmed](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/58)**

**[0xleastwood (judge) commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/58#issuecomment-1079627201):**
> The issue can be outlined as follows:
>  - A user interacts with the basket and mints some amount of tokens, which sets `lastFee = block.timestamp`.
>  - The same user decides to exit the basket and burn their tokens.
>  - Some amount of time passes and another user enters the basket, but `handleFees()` did not set `lastFee = block.timestamp`. As a result, fees are charged on the user's deposit for the entire time that the basket was inactive for.
> 
> It seems that the basket is severely flawed in calculating fees on partially inactive baskets. This puts users' funds at direct risk of being lost. Malicious publishers can setup baskets as a sort of honeypot to abuse this behaviour.
>
> This was an interesting find! Kudos to the warden.



***

 
# Medium Risk Findings (11)
## [[M-01] Missing cap on `LicenseFee`](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/154)
_Submitted by gzeon, also found by 0x0x0x and TomFrenchBlockchain_

There is no cap on `LicenseFee`. While change of `LicenseFee` is under 1 day timelock, introducing a\
`maxLicenseFee` can improve credibility by removing the "rug" vector. There is a `minLicenseFee` in the contracts, while imo make little sense to have `minLicenseFee` but not `maxLicenseFee`.

An incorrectly set `LicenseFee` can potentially lead to over/underflow in [Basket.sol#L140-141](https://github.com/code-423n4/2021-12-defiprotocol/blob/205d3766044171e325df6a8bf2e79b37856eece1/contracts/contracts/Basket.sol#L140-141) which is used in most of the function.

### Proof of Concept

[Basket.sol#L177](https://github.com/code-423n4/2021-12-defiprotocol/blob/205d3766044171e325df6a8bf2e79b37856eece1/contracts/contracts/Basket.sol#L177)<br>
[Factory.sol#L77](https://github.com/code-423n4/2021-12-defiprotocol/blob/205d3766044171e325df6a8bf2e79b37856eece1/contracts/contracts/Factory.sol#L77)<br>
[Basket.sol#L49](https://github.com/code-423n4/2021-12-defiprotocol/blob/205d3766044171e325df6a8bf2e79b37856eece1/contracts/contracts/Basket.sol#L49)

### Recommended Mitigation Steps

Define a `maxLicenseFee`

**[frank-beard (Kuiper) acknowledged, but disagreed with High severity and commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/154#issuecomment-1048121652):**
 > Generally it is intended for the publishers to act correctly and the timelock is intended to prevent incorrect values from making it all the way through, however there is validity in reducing how the fee can be modified, such as reducing how much any one fee change can change the fee. I would consider this a low risk issue.

**[0xleastwood (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/154#issuecomment-1079621078):**
 > It seems like changes to `licenseFee` could potentially brick the contract as `handleFees()` underflows, preventing users from minting/burning tokens. I'd deem this as `medium` severity due to compromised protocol availability.



***

## [[M-02] Publisher can lock all user funds in the `Basket` in order to force a user to have their bond burned](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/53)
_Submitted by TomFrenchBlockchain, also found by WatchPug_

All user funds in a basket being held hostage by the publisher

### Proof of Concept

The `Basket` publisher can propose an auction in order to set new tokens and weights with a 1 day timelock.

[Basket.sol#L216-L244](https://github.com/code-423n4/2021-12-defiprotocol/blob/205d3766044171e325df6a8bf2e79b37856eece1/contracts/contracts/Basket.sol#L216-L244)<br>

As part of this call they can set the `minIbRatio` variable which determines what the maximum slippage on the auction is allowed to be. If it's set to the current `IbRatio` then the Basket accepts no slippage.

The publisher can choose to set `minIbRatio = type(uint256).max` which will prevent any auction bids from being successful, locking the basket in the auction state.

It's not possible to enter or exit the basket while an auction is going on, so any users who hold any funds in the basket are forced to take the only option to kill the auction available to them.

[Basket.sol#L91-L119](https://github.com/code-423n4/2021-12-defiprotocol/blob/205d3766044171e325df6a8bf2e79b37856eece1/contracts/contracts/Basket.sol#L91-L119)<br>

If a user makes a bond and then waits a day to then call `Auction.bondBurn`, it will reset the auction and allow users to withdraw but it requires 0.25% of the supply of the basket token to be burned.

[Auction.sol#L121-L134](https://github.com/code-423n4/2021-12-defiprotocol/blob/205d3766044171e325df6a8bf2e79b37856eece1/contracts/contracts/Auction.sol#L121-L134)<br>

One of the basket's users is then forced to give up some of their assets to secure the release of the remaining assets in the basket (for a 24hr period until the publisher starts a new auction).

This attack can be launched at any time with only 24 hours warning. This is a very short amount of time which near guarantees that if other users hold funds in the basket that not all of them will successfully withdraw in that time and so will have funds locked.

### Recommended Mitigation Steps

Again this is tricky to mitigate as there are legitimate scenarios where we would expect the `ibRatio` to increase. e.g. a basket containing WBTC being changed to contain USDC as each basket token should be worth much more USDC than it was in terms of WBTC.

To be frank the entire auction mechanism is a bit shaky as it doesn't account for changes in the values of the tokens over time.

**[frank-beard (Kuiper) acknowledged, but disagreed with High severity and commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/53#issuecomment-1048140154):**
 > This is where community action and the timelock should mitigate attacks of these types. Users should be able to hold publishers accountable for their rebalances, whether that is through a dao or other means. We acknowledge there is some level of trust required between the user and the publisher however this is also intentional, for the types of products this protocol is for.

**[0xleastwood (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/53#issuecomment-1079625679):**
 > Because a timelock is used in this instance, exploiting this issue proves more difficult and requires that the `publisher` is malicious. As we are dealing with an abuse of privileges, I think this fits the criteria of a `medium` severity issue as the issue can only be exploited by a trusted account.

**[0xleastwood (judge) commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/53#issuecomment-1079816317):**
 > Actually I'm not sure if I understand the exploit:
>  - The publisher must wait a day to call `Basket.publishNewIndex()`, setting new values and starting an auction. In that time, users are free to exit the protocol as they wish.
>  - However, users who were not able to exit in time are obligated to call `Auction.bondForRebalance()` in order to unlock the basket's underlying assets. But because `Auction.settleAuction()` will always revert, this user forfeits their bond to unlock the rest of their tokens.
> 
> In this case, I see this as an abuse of the publisher's privileges and lack of oversight by the users. `medium` severity seems correct in this situation.



***

## [[M-03] `Basket.sol#auctionBurn` calculates `ibRatio` wrong](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/144)
_Submitted by 0x0x0x_

The function is implemented as follows:

    function auctionBurn(uint256 amount) onlyAuction nonReentrant external override {
            uint256 startSupply = totalSupply();
            handleFees(startSupply);
            _burn(msg.sender, amount);

            uint256 newIbRatio = ibRatio * startSupply / (startSupply - amount);
            ibRatio = newIbRatio;

            emit NewIBRatio(newIbRatio);
            emit Burned(msg.sender, amount);
        }

When `handleFees` is called, `totalSupply` and `ibRatio` changes accordingly, but for `newIbRatio` calculation tokens minted in `handleFees` is not included. Therefore, `ibRatio` is calculated higher than it should be. This is dangerous, since last withdrawing user(s) lose their funds with this operation. In case this miscalculation happens more than once, `newIbRatio` will increase the miscalculation even faster and can result in serious amount of funds missing. At each time `auctionBurn` is called, at least 1 day (auction duration) of fees result in this miscalculation. Furthermore, all critical logic of this contract is based on `ibRatio`, this behaviour can create serious miscalculations.

### Mitigation step

Rather than

`uint256 newIbRatio = ibRatio * startSupply / (startSupply - amount);`

A practical solution to this problem is calculating `newIbRatio` as follows:

    uint256 supply = totalSupply();
    uint256 newIbRatio = ibRatio * (supply + amount) / supply;

**[frank-beard (Kuiper) confirmed](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/144)**

**[0xleastwood (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/144#issuecomment-1079628195):**
 > The warden has identified an issue whereby `newIbRatio` uses an incorrect `startSupply` variable which is under-represented. As new tokens may be minted in `handleFees()`, this will lead to an incorrect `ibRatio` which is used in all other areas of the protocol. A lower `ibRatio` causes `pushUnderlying()` and `pullUnderlying()` to be improperly accounted for. As a result, burning basket tokens will redeem a smaller amount of underlying tokens and minting basket tokens will require a smaller amount of underlying tokens.
> 
> This causes the protocol to leak value from all basket token holders but it does not allow assets to be stolen. As such, I think this is better put as a `medium` severity issue.



***

## [[M-04] Reentrancy vulnerability in `Basket` contract's `initialize()` method.](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/176)
_Submitted by broccolirob_

A malicious "publisher" can create a basket proposal that mixes real ERC20 tokens with a malicious ERC20 token containing a reentrancy callback in it's `approve()` method. When the `initialize()` method is called on the newly cloned `Basket` contract, a method called `approveUnderlying(address(auction))` is called, which would trigger the reentrancy, call `initialize()` again, passing in altered critical values such as `auction` and `factory`, and then removes its self from `proposal.tokens` and `proposal.weights` so it doesn't appear in the token list to basket users.

[Basket.sol#L44-L61](https://github.com/code-423n4/2021-12-defiprotocol/blob/main/contracts/contracts/Basket.sol#L44-L61)

### Impact

`Auction` and `Factory` can be set to custom implementations that do malicious things. Since all baskets and auctions are clones with their own addresses, this fact would be difficult for users to detect. `Auction` controls ibRatio, which a malicious version could send back a manipulated value to `Basket`, allowing the malicious "publisher" to burn basket tokens till all users underlying tokens are drained.

### Tools Used

Manual review and Hardhat.

### Recommended Mitigation Steps

Since `Basket` inherits from `ERC20Upgradeable` the `initializer` modifier should be available and therefore used here. It has an `inititializing` variable that would prevent this kind of reentrancy attack.

**[frank-beard (Kuiper) confirmed](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/176)**

**[0xleastwood (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/176#issuecomment-1079636401):**
 > While the warden is correct, a malicious publisher could re-enter the `Basket.initialize()` function and overwrite `factory` and `auction` with their own addresses, this does not lead to a direct loss of funds for users. It would require that users interact with their malicious contracts which is entirely possible if baskets created via the factory are deemed as trusted. I think this fits the criteria of a `medium` severity issue.



***

## [[M-05] Change in `auctionMultiplier/auctionDecrement` change profitability of auctions and factory can steal all tokens from a basket abusing it](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/145)
_Submitted by 0x0x0x_

When factory changes `auctionMultiplier` or `auctionDecrement` profitability of bonded auctions change. There is no protection against this behaviour. Furthermore, factory owners can decide to get all tokens from baskets where they are bonded for the auction.

### Proof of concept

1- Factory owners call `bondForRebalance` for an auction.

2- Factory owners sets `auctionMultiplier` as 0 and `auctionDecrement` as maximum value

3- `settleAuction` is called. `newRatio = 0`, since `a = b = 0`. All tokens can be withdrawn with this call, since `tokensNeeded = 0`.

### Extra notes

Furthermore, even the factory owners does not try to scam users. In case `auctionMultiplier` or `auctionDecrement` is changed, all current `auctionBonder` from `Auctions` can only call `settleAuction` with different constraints. Because of different constraints, users/bonder will lose/gain funds.

### Mitigation step

Save `auctionDecrement` and `auctionMultiplier` to global variables in `Auction.sol`, when `startAuction` is called.

**[frank-beard (Kuiper) confirmed and commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/145#issuecomment-1049059976):**
 > Adding in protection from the global governance is definitely important.

**[0xleastwood (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/145#issuecomment-1079812584):**
 > The warden has identified an issue whereby the factory owner can rug-pull baskets through the re-balancing mechanism. Because `newRatio = 0`, the basket improperly checks the tokens needed in the contract. However, this assumes that the factory owner is malicious which satisfies `medium` severity due to assets not being at direct risk.
> 
> The sponsor has decided to add additional protections (potentially via timelock) to mitigate this issue.
>
 > This rug-pull is made even more difficult by the fact that `newRatio` must be `>= minIbRatio`. Because `minIbRatio` is behind timelock, I think this rug vector is unlikely or at least can only be used to steal a fixed amount of funds.



***

## [[M-06] Basket can be fully drained if the auction is settled within a specific block](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/74)
_Submitted by Ruhum_

The `settleAuction()` function allows someone to settle the auction by transferring funds in a way that the new pending index is fulfilled. As a reward, they are able to take out as many tokens as they want as long as the pending index is fulfilled after that. The function verifies that the basket has received everything it wanted using the following logic:

```solidity
  for (uint256 i = 0; i < pendingWeights.length; i++) {
      uint256 tokensNeeded = basketAsERC20.totalSupply() * pendingWeights[i] * newRatio / BASE / BASE;
      require(IERC20(pendingTokens[i]).balanceOf(address(basket)) >= tokensNeeded);
  }
```

The attack vector here is to manipulate `tokensNeeded` to be 0. That way we can drain the basket completely without the function reverting.

For that, we manipulate `newRatio` to be 0 then the whole thing will be 0.
`newRatio` is defined as:

```solidity
  uint256 a = factory.auctionMultiplier() * basket.ibRatio();
  uint256 b = (bondBlock - auctionStart) * BASE / factory.auctionDecrement();
  uint256 newRatio = a - b;
```

There's 1 value the attacker controls, `bondBlock`. That value is the block in which the `bondForRebalance()` function was triggered.
So the goal is to get `newRatio` to be 0. With the base settings of the contract:

*   auctionMultiplier == 2
*   ibRatio == 1e18
*   BASE == 1e18
*   auctionDecrement == 10000

`bondBlock` has to be `auctionStart + 20000`. Meaning, the `bondForRebalance()` function has to be triggered exactly 20000 blocks after the action was started. That would be around 3 1/2 days after auction start.

At that point, `newRatio` is 0, and thus `tokensNeeded` is 0. The only thing left to do is to call `settleAuction()` and pass the basket's tokens and balance as the output tokens and weight.

### Proof of Concept

Here's a test implementing the above scenario as a test. You can add it to `Auction.test.js`.:

```js
      it.only("should allow me to steal funds", async() => {
        // start an auction
        let NEW_UNI_WEIGHT = "2400000000000000000";
        let NEW_COMP_WEIGHT = "2000000000000000000";
        let NEW_AAVE_WEIGHT = "400000000000000000";

        await expect(basket.publishNewIndex([UNI.address, COMP.address, AAVE.address], 
            [NEW_UNI_WEIGHT, NEW_COMP_WEIGHT, NEW_AAVE_WEIGHT], 1)).to.be.ok;
        await increaseTime(60 * 60 * 24)
        await increaseTime(60 * 60 * 24)
        await expect(basket.publishNewIndex([UNI.address, COMP.address, AAVE.address], 
          [NEW_UNI_WEIGHT, NEW_COMP_WEIGHT, NEW_AAVE_WEIGHT], 1)).to.be.ok;

        let auctionAddr = await basket.auction();
        let auction = AuctionImpl.attach(auctionAddr);

        ethers.provider.getBlockNumber();
        // increase the block number for `bondBlock - auctionStart` to be 20000.
        // When that's the case, the result of `newRatio` in `settleAuction()` 
        // is `0`. And that means `tokensNeeded` is 0. Which means,
        // we can take out all the tokens we want using the `outputTokens` array
        // without having to worry about basket's balance at the end.
        // The math changes depending on the settings of the factory contract or the
        // Basket contract. But, the gist is that you try to get newRatio to be 0.
        // The only values you can control as a attacker is the bondBlock after the auction
        // was started.
        for (let i = 0; i < 20000; i++) {
          await hre.network.provider.send("evm_mine")
        }
        await basket.approve(auction.address, '5000000000000000');
        await expect(auction.bondForRebalance()).to.be.ok;
        await expect(auction.settleAuction([], [], [], [UNI.address, AAVE.address], ["200720000000000000", "200120000000000000"])).to.be.ok;
      });
```

Again, this test uses the base values. The math changes when the settings change. But, it should always be possible to trigger this attack. The gap between auction start and bonding just changes.

### Recommended Mitigation Steps

*   Verify that `newRatio != 0`

**[frank-beard (Kuiper) confirmed and commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/74#issuecomment-1048137500):**
 > This is the reasoning for the minIbRatio value that the publisher sets when rebalancing weights. However we do need a check to make sure that `minIbRatio` is above 0.

**[0xleastwood (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/74#issuecomment-1079813752):**
 > I don't think this deserves a `high` severity rating. There are a number of assumptions made:
>  - `minIbRatio` has not been set to an expected value.
>  - The bonded user must be able to wait a certain number of blocks, likely exceeding the maximum amount of time allowed to settle the auction. This is currently set to one day. However, I understand that there might be some time that passes before a user bonds tokens and when the auction started.
> 
> Because this issue is not directly exploitable, I think this behaviour fits the criteria of a `medium` severity issue.



***

## [[M-07] `Auction.sol#settleAuction()` Bonder may not be able to settle a bonded auction, leading to loss of funds](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/106)
_Submitted by WatchPug_

[Auction.sol#L97-L102](https://github.com/code-423n4/2021-12-defiprotocol/blob/205d3766044171e325df6a8bf2e79b37856eece1/contracts/contracts/Auction.sol#L97-L102)

```solidity
    uint256 a = factory.auctionMultiplier() * basket.ibRatio();
    uint256 b = (bondBlock - auctionStart) * BASE / factory.auctionDecrement();
    uint256 newRatio = a - b;

    (address[] memory pendingTokens, uint256[] memory pendingWeights, uint256 minIbRatio) = basket.getPendingWeights();
    require(newRatio >= minIbRatio);
```

In the current implementation, `newRatio` is calculated and compared with `minIbRatio` in `settleAuction()`.

However, if `newRatio` is less than `minIbRatio`, `settleAuction()` will always fail and there is no way for the bonder to cancel and get a refund.

### Proof of Concept

Given:

*   `bondPercentDiv` = 400
*   `basketToken.totalSupply` = 40,000
*   `factory.auctionMultiplier` = 2
*   `factory.auctionDecrement` = 10,000
*   `basket.ibRatio` = 1e18
*   p`endingWeights.minIbRatio` = 1.9 \* 1e18

1.  Alice called `bondForRebalance()` `2,000` blocks after the auction started, paid `100` basketToken for the bond;
2.  Alice tries to `settleAuction()`, it will always fail because `newRatio < minIbRatio`;

*   a = 2 \* 1e18
*   b = 0.2 \* 1e18
*   newRatio = 1.8 \* 1e18;

3.  Bob calls `bondBurn()` one day after, `100` basketToken from Alice will been burned.

### Recommended Mitigation Steps

Move the `minIbRatio` check to `bondForRebalance()`:

```solidity
function bondForRebalance() public override {
    require(auctionOngoing);
    require(!hasBonded);

    bondTimestamp = block.timestamp;
    bondBlock = block.number;

    uint256 a = factory.auctionMultiplier() * basket.ibRatio();
    uint256 b = (bondBlock - auctionStart) * BASE / factory.auctionDecrement();
    uint256 newRatio = a - b;

    (address[] memory pendingTokens, uint256[] memory pendingWeights, uint256 minIbRatio) = basket.getPendingWeights();
    require(newRatio >= minIbRatio);

    IERC20 basketToken = IERC20(address(basket));
    bondAmount = basketToken.totalSupply() / factory.bondPercentDiv();
    basketToken.safeTransferFrom(msg.sender, address(this), bondAmount);
    hasBonded = true;
    auctionBonder = msg.sender;

    emit Bonded(msg.sender, bondAmount);
}
```

**[frank-beard (Kuiper) confirmed](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/106)**

**[0xleastwood (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/106#issuecomment-1079817328):**
 > While this issue is correct and I think this is a safer way to handle the `require(newRatio >= minIbRatio)` check, there are a few assumptions that are made. For example, it is assumed that the user bonds their tokens without checking `minIbRatio` and a publisher is able to maliciously update `minIbRatio` which must first go through timelock. Based on this, I'm more inclined to downgrade this to `medium` severity as I think this more accurately reflects the threat model.



***

## [[M-08] Lost fees due to precision loss in fees calculation](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/60)
_Submitted by kenzo, also found by 0v3rf10w_

In fees calculation, division is being used in the midst of the calculation, not at the end of it.
This leads to lost precision in fee amount (as solidity doesn't save remainder of division).
Division should happen at the end to maintain precision.

### Impact

Lost fees.
The exact amount depends on the parameters set and being tested.
According to a few tests I ran, it seems that in normal usage, 1% of fees are lost.
In some cases even 7.5% of fees.

### Proof of Concept

Division in the midst of a calculation:
```solidity
uint256 feePct = timeDiff * licenseFee / ONE_YEAR;
uint256 fee = startSupply * feePct / (BASE - feePct);

_mint(publisher, fee * (BASE - factory.ownerSplit()) / BASE);
_mint(Ownable(address(factory)).owner(), fee * factory.ownerSplit() / BASE);
```

[Basket.sol#L140:#L145](https://github.com/code-423n4/2021-12-defiprotocol/blob/main/contracts/contracts/Basket.sol#L140:#L145)<br>
It's a little hard to share a POC script as it involves changing the .sol file so I tested it manually. But after moving the division to the end using the mitigation below, I saw 1%-7% increases in fees minted. Usually 1%.

### Recommended Mitigation Steps

We want to firstly do all multiplication and lastly do all the division.
So remove the usage of feePct and instead set fee to be:
```solidity
uint256 fee = startSupply * licenseFee * timeDiff / ONE_YEAR / (BASE - licenseFee);
```

**[frank-beard (Kuiper) confirmed](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/60)**

**[0xleastwood (judge) commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/60#issuecomment-1079826919):**
 > Nice find! I think this qualifies as `medium` risk due to the protocol regularly leaking value. This can be mitigated by performing division at the very end of the fee calculation.



***

## [[M-09] `Basket:handleFees` fee calculation is wrong](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/43)
_Submitted by GiveMeTestEther_

The fee calculation on L141 is wrong. It should only get divided by BASE and not (BASE - feePct)

### Proof of Concept

This shows dividing only by BASE is correct:<br>
Assumptions:

*   BASE is 1e18 accordign to the code
*   timeDiff is exactly ONE_YEAR (for easier calculations)
*   startSupply is 1e18 (exactly one basket token, also represents 100% in fee terms)
*   licenseFee is 1e15 (0.1%)

If we calculate the fee of one whole year and startSupply is one token (1e18, equal to 100%), the fee should be exactly the licenseFee  (1e15, 0.1%),

uint256 timeDiff = ONE_YEAR;<br>
uint256 feePct = timeDiff \* licenseFee / ONE_YEAR;<br>
\=> therefore we have: feePct = licenseFee which is 1e15 (0.1%) according to our assumptions<br>
uint256 fee = startSupply \* feePct / BASE; // only divide by BASE<br>
\=> insert values => fee = 1e18 \* licenseFee  / 1e18 = licenseFee

This shows the math is wrong:

Assumptions:

*   BASE is 1e18 according to the code
*   timeDiff is exactly ONE_YEAR (for easier calculations)
*   startSupply is 1e18 (exactly one basket token, also represents 100% in fee terms)
*   licenseFee is 1e15 (0.1%)

If we calculate the fee of one whole year and startSupply is one token (1e18, equal to 100%), the fee should be exactly the licenseFee  (1e15, 0.1%), but the fee is bigger than that.

uint256 timeDiff = ONE_YEAR;<br>
uint256 feePct = timeDiff \* licenseFee / ONE_YEAR;<br>
\=> therefore we have: feePct = licenseFee which is 1e15 (0.1%) according to our assumptions

uint256 fee = startSupply \* feePct / (BASE - feePct);<br>
insert the values => fee = 1e18 \* 1e15 / (1e18 - 1e15) => (factor out 1e15) => fee = 1e15 \* 1e18 / (1e15 \* ( 1e3 - 1) => (cancel 1e15) => 1e18 / ( 1e3 - 1)

math: if we increase the divisor but the dividend stays the same we get a smaller number e.g. (1 / (2-1)) is bigger than (1 / 2)<br>
apply this here => 1e18 / ( 1e3 - 1) > 1e18 / 1e3 => 1e18 / ( 1e3 - 1) > 1e15  this shows that the fee is higher than 1e15

[Basket.sol#L133](https://github.com/code-423n4/2021-12-defiprotocol/blob/205d3766044171e325df6a8bf2e79b37856eece1/contracts/contracts/Basket.sol#L133)<br>
[Basket.sol#L141](https://github.com/code-423n4/2021-12-defiprotocol/blob/205d3766044171e325df6a8bf2e79b37856eece1/contracts/contracts/Basket.sol#L141)

### Recommended Mitigation Steps

Only divide by BASE.

**[frank-beard (Kuiper) confirmed](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/43)**

**[0xleastwood (judge) commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/43#issuecomment-1079828004):**
 > I think this is valid. Calculating fees as `startSupply * feePct / (BASE - feePct)` leads to an overestimation of fees charged on users.



***

## [[M-10] Fee calculation is slightly off](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/152)
_Submitted by gzeon_

The fee calculation
```solidity
uint256 timeDiff = (block.timestamp - lastFee);
uint256 feePct = timeDiff * licenseFee / ONE_YEAR;
uint256 fee = startSupply * feePct / (BASE - feePct);
```
tries to calculate a fee such that fee/(supply+fee) = %fee using a simple interest formula (i.e. no compounding), this lead to slightly less fee collected when fee are collected more frequently (small timeDiff) vs less frequently (big timeDiff).

### Proof of Concept

[Basket.sol#L133](https://github.com/code-423n4/2021-12-defiprotocol/blob/205d3766044171e325df6a8bf2e79b37856eece1/contracts/contracts/Basket.sol#L133)

**[frank-beard (Kuiper) acknowledged, but disagreed with Medium severity and commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/152#issuecomment-1048146206):**
 > While this is technically true, the actual precision loss should be very negligible.

**[0xleastwood (judge) commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/152#issuecomment-1079829640):**
 > I think any precision loss or value leakage qualifies for a `medium` severity issue. This seems like it would lead to an inconsistent fee calculation and is probably worthwhile fixing long-term.



***

## [[M-11] `Basket:handleFees():` fees are overcharged](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/170)
_Submitted by GiveMeTestEther_

The fee calculation is based on the totalSupply of the basket token. But some amount of the totalSupply represents the fees paid to the publisher/ protocol owner. Therefore the fees are "overcharged":  because the fee amount is calculated on a part of already "paid" fees, should only take into account what is "owned"
by the users and not the publisher/protocol owner.

### Proof of Concept

L141: the fee percent is multiplied by startSupply (=basket token total supply)<br>
L144 & L145: publisher / protocol owner receive basket tokens as fees payment<br>
[Basket.sol#L141](https://github.com/code-423n4/2021-12-defiprotocol/blob/205d3766044171e325df6a8bf2e79b37856eece1/contracts/contracts/Basket.sol#L141)

### Recommended Mitigation Steps

*   account the fee amount in a storage variable: uint256 feeAmount;
*   subtract feeAmount from startSupply L141: uint256 fee = (startSupply - feeAmount) \* feePct / (BASE - feePct); // note the other bug about only dividing by BASE
*   add the fee to feeAmount after the calculation:  feeAmount += fee;
*   if publisher/protocol owner burn basket token, reduce the feeAmount etc.

**[frank-beard (Kuiper) acknowledged and commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/170#issuecomment-1049062352):**
 > Generally we think that the amount of overcharged fees from this matter will be very negligible in the long term. It is worth noting that the fix proposed would not really solve the problem as not all tokens owned by the publisher/owner may be fees as well as they could just transfer those fees to another account and burn from there.

**[0xleastwood (judge) commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/170#issuecomment-1079820186):**
 > I'm not sure if this is correct. `startSupply` is indeed equal to `totalSupply()` but it is queried before new tokens are minted to the factory owner and publisher. As such, the fees appear to be correctly charged. I'll have @frank-beard confirm this as I may have missed something.

**[0xleastwood (judge) commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/170#issuecomment-1087492580):**
 > Considering @frank-beard has not replied to this, I'm gonna make the final judgement and keep this open. I think it makes sense to track the fees paid out to the factory owner and publisher and have this amount excluded from the fee calculations. Upon either party burning tokens, this fee amount tracker must be updated accordingly. Due to the added complexity, it is understandable that this issue would be deemed a wontfix by the sponsor.

**[frank-beard (Kuiper) commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/170#issuecomment-1087614572):**
 > Yeah so I do agree that it does make sense generally to track the fees paid out and exclude, however in this case the impact is very low and yeah the complexity to deal with it doesn't seem worth it.



***

# Low Risk Findings (8)
- [[L-01] Extra payments for an auction gets stucks](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/137) _Submitted by 0x0x0x_
- [[L-02] `maxSupply` can be exceeded](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/146) _Submitted by 0x0x0x_
- [[L-03] Bonding doesn't seem to perform any meaningful role and leads to inefficient auctions](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/56) _Submitted by TomFrenchBlockchain_
- [[L-04] Factory can block auctions](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/150) _Submitted by 0x0x0x_
- [[L-05] `Basket.sol` Pending licenseFee may unable to be canceled when current licenseFee is `0`](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/103) _Submitted by WatchPug_
- [[L-06] `Basket.sol` should use the Upgradeable variant of OpenZeppelin Contracts](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/104) _Submitted by WatchPug_
- [[L-07] `Basket.sol#changeLicenseFee()` Unable to set `licenseFee` to 0](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/97) _Submitted by WatchPug_
- [[L-08] changeLicenseFee() and fees for previous period](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/33) _Submitted by gpersoon_

# Non-Critical Findings (29)
- [[N-01] TODO comments should be resolved ](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/135) _Submitted by Jujic, also found by hagrid, Meta0xNull, and robee_
- [[N-02] `Ownable` Contract Does Not Implement Two-Step Transfer Ownership Pattern](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/30) _Submitted by hagrid_
- [[N-03] Missing Revert Messages](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/31) _Submitted by hagrid, also found by robee_
- [[N-04] Use of deprecated `safeApprove()` function](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/177) _Submitted by broccolirob, also found by GiveMeTestEther, gzeon, Meta0xNull, robee, and sirhashalot_
- [[N-05] Not verified function inputs of public / external functions](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/27) _Submitted by robee_
- [[N-06] Incorrent visibility for "initialized" variable](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/50) _Submitted by neslinesli93_
- [[N-07] `BasketLicenseProposed` better emit proposal id](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/134) _Submitted by gzeon_
- [[N-08] setAuctionDecrement() Lack of Input Validation May Break Other Function](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/83) _Submitted by Meta0xNull, also found by gpersoon_
- [[N-09] setAuctionMultiplier() Lack of Input Validation May Break Other Function](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/82) _Submitted by Meta0xNull, also found by gpersoon_
- [[N-10] Broken unit tests due to incorrect values](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/88) _Submitted by bw_
- [[N-11] `NewIndexSubmitted` event is not emitted in some case](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/115) _Submitted by WatchPug_
- [[N-12] Factory:setOwnerSplit owner fee split can be set to exactly 20%](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/44) _Submitted by GiveMeTestEther_
- [[N-13] Emit for publishNewIndex / killAuction part](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/32) _Submitted by gpersoon_
- [[N-14] Use of Require statement without reason message](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/10) _Submitted by 0x1f8b_
- [[N-15] Remove override keyword from Auction](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/12) _Submitted by 0x1f8b_
- [[N-16] Remove override keyword from Basket](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/13) _Submitted by 0x1f8b_
- [[N-17] Lack of event indexing](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/15) _Submitted by 0x1f8b_
- [[N-18] Lack of input verification](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/8) _Submitted by 0x1f8b_
- [[N-19] Remove override keyword](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/9) _Submitted by 0x1f8b_
- [[N-20] Lack of message in require statments](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/6) _Submitted by BouSalman_
- [[N-21] Lack of revert reason strings](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/5) _Submitted by TomFrenchBlockchain_
- [[N-22] `Factory.sol` Lack of two-step procedure and/or input validation routines for critical operations leaves them error-prone](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/111) _Submitted by WatchPug_
- [[N-23] Critical operations should emit events](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/112) _Submitted by WatchPug_
- [[N-24] Outdated compiler version](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/90) _Submitted by WatchPug_
- [[N-25] Missing error messages in require statements](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/93) _Submitted by WatchPug_
- [[N-26] Wrong syntax in test leads to wrong test results](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/62) _Submitted by kenzo_
- [[N-27] Unnecessary variable initialization and TODO in code](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/76) _Submitted by neslinesli93_
- [[N-28] Possible division by zero in `settleAuction`](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/77) _Submitted by neslinesli93_
- [[N-29] Open TODOs](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/157) _Submitted by ye0lde_

# Gas Optimizations (40)
- [[G-01] Check for tokenAmount > 0 is missing in pushUnderlying function [basket.sol]](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/165) _Submitted by rishabh_
- [[G-02] For uint `> 0` can be replaced with ` != 0` for gas optimization](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/139) _Submitted by 0x0x0x, also found by Jujic, pmerkleplant, and ye0lde_
- [[G-03] Loops can be implemented more efficiently](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/140) _Submitted by 0x0x0x, also found by Jujic, Meta0xNull, pmerkleplant, rishabh, and WatchPug_
- [[G-04] Use negate(!) rather than `== false`](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/138) _Submitted by 0x0x0x, also found by ye0lde_
- [[G-05] `++i` is more efficient than `i++`](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/120) _Submitted by WatchPug, also found by Jujic and pedroais_
- [[G-06] `mintTo` has not an extra require statement](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/142) _Submitted by 0x0x0x, also found by danb and TomFrenchBlockchain_
- [[G-07] `Basket.sol#handleFees()` Check if `timeDiff > 0` can save gas](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/110) _Submitted by WatchPug, also found by 0x0x0x_
- [[G-08] Division with `BASE` twice can be optimized ](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/147) _Submitted by 0x0x0x_
- [[G-09] Auction:settleAuction() cache address(basket)](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/164) _Submitted by GiveMeTestEther_
- [[G-10] Auction:bondForRebalance() store calculation of bondAmount in local variable](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/166) _Submitted by GiveMeTestEther_
- [[G-11] Auction:bondBurn(): cache bondAmount](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/167) _Submitted by GiveMeTestEther_
- [[G-12] Cache external call results can save gas](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/122) _Submitted by WatchPug, also found by TomFrenchBlockchain_
- [[G-13] Factory:constructor don't need to zero initialize storage variable](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/45) _Submitted by GiveMeTestEther, also found by gzeon, Jujic, kenzo, sirhashalot, TomFrenchBlockchain, WatchPug, and ye0lde_
- [[G-14] Basket:initialize() reuse function argument instead of storage variable](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/46) _Submitted by GiveMeTestEther_
- [[G-15] Basket:handleFees() use unchecked to save gas](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/47) _Submitted by GiveMeTestEther_
- [[G-16] Function handleFees #L148-L151 and updateIBRatio (Basket.sol) can be refactored for efficiency and clarity](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/161) _Submitted by ye0lde, also found by GiveMeTestEther, kenzo, and WatchPug_
- [[G-17] Basket:pushUnderlying()/pullUnderlying() cache ibRatio to save gas](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/49) _Submitted by GiveMeTestEther, also found by WatchPug_
- [[G-18] `validateWeights()` Limit loop to a meaningful bound can save gas](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/118) _Submitted by WatchPug, also found by danb, GiveMeTestEther, kenzo, and TomFrenchBlockchain_
- [[G-19] Useless imports](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/113) _Submitted by Jujic_
- [[G-20] Avoid Initialization of Loop Index If It Is 0 to Save Gas](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/84) _Submitted by Meta0xNull_
- [[G-21] Extra ERC20 approvals/transfers on Basket deployment](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/2) _Submitted by TomFrenchBlockchain_
- [[G-22] Auction.auctionOngoing variable is unnecessary](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/36) _Submitted by TomFrenchBlockchain_
- [[G-23] Auction.hasBonded variable is unnecessary](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/37) _Submitted by TomFrenchBlockchain_
- [[G-24] Excessive checking of basket totalsupply](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/38) _Submitted by TomFrenchBlockchain, also found by kenzo_
- [[G-25] Minted and Burned events are unnecessary](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/4) _Submitted by TomFrenchBlockchain_
- [[G-26] Publisher switch logic can be simplified](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/41) _Submitted by TomFrenchBlockchain, also found by WatchPug_
- [[G-27] Gas Optimization: Reorder storage layout](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/129) _Submitted by gzeon, also found by saian_
- [[G-28] `auctionImpl` and `basketImpl` in factory can be made immutable for gas savings](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/57) _Submitted by TomFrenchBlockchain, also found by bw, gzeon, and robee_
- [[G-29] `Basket.sol#approveUnderlying()` Cache and read storage variables from the stack can save gas](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/100) _Submitted by WatchPug_
- [[G-30] `Auction.sol#auctionOngoing` Switching between 1, 2 instead of true, false is more gas efficient](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/107) _Submitted by WatchPug_
- [[G-31] Use free functions to replace external calls can save gas](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/117) _Submitted by WatchPug_
- [[G-32] Unnecessary checked arithmetic in for loops](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/121) _Submitted by WatchPug_
- [[G-33] Adding unchecked directive can save gas](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/123) _Submitted by WatchPug_
- [[G-34] `Auction.sol#initialize()` Use msg.sender rather than factory_ parameter can save gas](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/126) _Submitted by WatchPug_
- [[G-35] `Basket.sol#initialize()` Remove redundant assertion can save gas](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/92) _Submitted by WatchPug_
- [[G-36] Gas: Redundant check in `setNewMaxSupply`](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/7) _Submitted by cmichel_
- [[G-37] Unused imports](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/91) _Submitted by WatchPug, also found by robee_
- [[G-38] Gas Optimization: Use calldata instead of memory](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/130) _Submitted by gzeon_
- [[G-39] Function changePublisher, changeLicenseFee, and setNewMaxSupply  can be refactored for efficiency and clarity](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/162) _Submitted by ye0lde, also found by neslinesli93_
- [[G-40] Storage double reading. Could save SLOAD](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/18) _Submitted by robee_

# Disclosures

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.
