---
sponsor: "Marginswap"
slug: "2021-04-marginswap"
date: "2021-05-03"
title: "Marginswap"
date: "2021-05-03"
title: "Maple Finance"
findings: "https://github.com/code-423n4/2021-04-marginswap-findings"
contest: 3
---

![Marginswap](/images/orgs/marginswap.png)

# Marginswap Contest<br/>Findings & Analysis Report

# Overview

## About C4

Code 432n4 (C4) is an open organization that consists of security researchers, auditors, developers, and individuals with domain expertise in the area of smart contracts.

A C4 code contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the code contest outlined in this document, C4 conducted an analysis of Marginswap’s smart contract system written in Solidity. The code contest took place between XXXXXXX, 2021 and XXXXXXX, 2021.

## Wardens

11 Wardens contributed reports to the ElasticDAO code contest:

- [0xRajeev]()
- [0xsomeone]()
- [cmichel]()
- [jmukesh]()
- [a_delamo]()
- [gpersoon]()
- [janbro]()
- [jvaqa]()
- [paulius]()
- [s1mo]()
- [shw]()

This contest was judged by [Zak Cole]().

Final report assembled by [Adam Avenir]().

# Summary

The C4 analysis yielded an aggregated total of XXXXX unique vulnerabilities. All of the issues presented here are linked back to their original finding.

Of these vulnerabilities, XXX received a risk rating in the category of HIGH severity, XXX received a risk rating in the category of MEDIUM severity, and XXX received a risk rating in the category of LOW severity.

C4 analysis also identified an aggregate total of XXX non-critical recommendations and XXX gas optimizations.

The Maple Finance team responded to the issues identified as result of this code contest and provided information regarding any changes to the codebase with a pull request. Links to the aforementioned PRs are appended to the issue descriptions outlined within the corresponding details described. A small set of vulnerabilities and submissions were disputed by the Maple Finance team. We have selected many of the comments.

Scope

## Code

The code under review can be found within the [C4 code contest repository](XXXXXX) and comprises XXXX lines of code across a total of XXX smart contracts written in the Solidity programming language.

This code, including tests and tooling, is also available at the following URL:
XXXXXXXX

# Severity Criteria

C4 assesses severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into 3 primary risk categories: high, medium, and low.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

- Malicious Input Handling
- Escalation of privileges
- Arithmetic
- Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code423n4.com).

# High Risk Findings

## [[H-01] Re-entrancy bug in `MarginRouter.crossSwapTokensForExactTokens` allows inflating balance](https://github.com/code-423n4/marginswap-findings/issues/19)

One can call the `MarginRouter.crossSwapExactTokensForTokens` function first with a fake contract disguised as a token pair:
`crossSwapExactTokensForTokens(0.0001 WETH, 0, [ATTACKER_CONTRACT], [WETH, WBTC])`. When the amounts are computed by the `amounts = UniswapStyleLib.getAmountsOut(amountIn - fees, pairs, tokens);` call, the attacker contract returns fake reserves that yield 1 WBTC for the tiny input.
The resulting amount is credited through `registerTrade`.
Afterwards, `_swapExactT4T([0.0001 WETH, 1 WBTC], 0, [ATTACKER_CONTRACT], [WETH, WBTC])` is called with the fake pair and token amounts.
At some point `_swap` is called, the starting balance is stored in `startingBalance`, and the attacker contract call allows a re-entrancy:

```solidity
pair.swap(0.0001 WETH, 1 WBTC, FUND, new bytes(0)); // can re-enter here
```

From the ATTACKER_CONTRACT we re-enter the `MarginRouter.crossSwapExactTokensForTokens(30 WETH, 0, WETH_WBTC_PAIR, [WETH, WBTC])` function with the actual WETH <> WBTC pair contract.
All checks pass, the FUND receives the actual amount, the outer `_swap` continues execution after the re-entrancy and the `endingBalance >= startingBalance + amounts[amounts.length - 1]` check passes as well because the inner swap successfully deposited these funds.
We end up doing 1 real trade but being credited twice the output amount.

### Impact

This allows someone to be credited multiples of the actual swap result. This can be repeated many times and finally, all tokens can be stolen.

###### Mitigation

Add re-entrancy guards (from OpenZeppelin) to all external functions of `MarginRouter`.

There might be several attack vectors of this function as the attacker controls many parameters.
The idea of first doing an estimation with `UniswapStyleLib.getAmountsOut(amountIn - fees, pairs, tokens)` and updating the user with these estimated amounts, before doing the actual trade, feels quite vulnerable to me.
Consider removing the estimation and only doing the actual trade first, then calling `registerTrade` with the actual trade amounts returned.

## [[H-02] Missing `fromToken != toToken` check in `MarginRouter.crossSwapExactTokensForTokens`/`MarginRouter.crossSwapTokensForExactTokens`](https://github.com/code-423n4/marginswap-findings/issues/20)

Attacker calls `MarginRouter.crossSwapExactTokensForTokens` with a fake pair and the same token[0] == tokne[1].
`crossSwapExactTokensForTokens(1000 WETH, 0, [ATTACKER_CONTRACT], [WETH, WETH])`. When the amounts are computed by the `amounts = UniswapStyleLib.getAmountsOut(amountIn - fees, pairs, tokens);` call, the attacker contract returns fake reserves that yield 0 output
When `_swapExactT4T` is called, the funds are sent to the fake contract and doing nothing passes all checks in `_swap` call that follows because the `startingBalance` is stored _after_ the initial Fund withdraw to the pair.

```solidity
function _swapExactT4T() {
  // withdraw happens here
    Fund(fund()).withdraw(tokens[0], pairs[0], amounts[0]);
    _swap(amounts, pairs, tokens, fund());
}

function _swap() {
  uint256 startingBalance = IERC20(outToken).balanceOf(_to);
  uint256 endingBalance = IERC20(outToken).balanceOf(_to);
  // passes as startingBalance == endingBalance + 0
  require(
      endingBalance >= startingBalance + amounts[amounts.length - 1],
      "Defective AMM route; balances don't match"
  );
}
```

The full impact is not yet known as `registerTrade` could still fail when subtracting the `inAmount` and adding 0 `outAmount`.
At least, this attack is similar to a withdrawal which is supposed to only occur after a certain `coolingOffPeriod` has passed, but this time-lock is circumvented with this attack.

#### Mitigation

Move the fund withdrawal to the first pair **after** the `startingBalance` assignment.
Check `fromToken != toToken` as cyclical trades (arbitrages) are likely not what margin traders are after.
Consider if the same check is required for `registerTradeAndBorrow` / `adjustAmounts` functions.

## [[H-03] Price feed can be manipulated](https://github.com/code-423n4/marginswap-findings/issues/21)

Anyone can trigger an update to the price feed by calling `PriceAware.getCurrentPriceInPeg(token, inAmount, forceCurBlock=true)`.
If the update window has passed, the price will be computed by simulating a Uniswap-like trade with the amounts.
This simulation uses the reserves of the Uniswap pairs which can be changed drastically using flash loans to yield almost arbitrary output amounts, and thus prices.

Wrong prices break the core functionality of the contracts such as borrowing on margin, liquidations, etc.

#### Mitigation

Do not use the Uniswap spot price as the real price.
Uniswaps itself warns against this and instead recommends implementing a [TWAP price oracle](https://uniswap.org/docs/v2/smart-contract-integration/building-an-oracle/) using the `price*CumulativeLast` variables.

mail@cmichel.io

@cmichelio

0x6823636c2462cfdcD8d33fE53fBCD0EdbE2752ad

## [[H-04] Inconsistent usage of applyInterest](https://github.com/code-423n4/marginswap-findings/issues/64)

It is unclear if the function applyInterest is supposed to return a new balance with the interest applied or only the accrued interest? There are various usages of it, some calls add the return value to the old amount:
return
bond.amount +
applyInterest(bond.amount, cumulativeYield, yieldQuotientFP);
and some not:

balanceWithInterest = applyInterest(
balance,
yA.accumulatorFP,
yieldQuotientFP
);

This makes the code misbehave and return the wrong values for the balance and accrued interest.

#### Mitigation

Make it consistent in all cases when calling this function.

### Comments:

**[werg commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/64#issuecomment-816215092):**

> This is correct and has been fixed in the core repo

## [[H-05] Wrong liquidation logic](https://github.com/code-423n4/marginswap-findings/issues/23)

The `belowMaintenanceThreshold` function decides if a trader can be liquidated:

```solidity
function belowMaintenanceThreshold(CrossMarginAccount storage account)
    internal
    returns (bool)
{
    uint256 loan = loanInPeg(account, true);
    uint256 holdings = holdingsInPeg(account, true);
    // The following should hold:
    // holdings / loan >= 1.1
    // =>
    return 100 * holdings >= liquidationThresholdPercent * loan;
}
```

The inequality in the last equation is wrong because it says the higher the holdings (margin + loan) compared to the loan, the higher the chance of being liquidated.
The inverse equality was probably intended `return 100 * holdings <= liquidationThresholdPercent * loan;`.

Users that shouldn't be liquidated can be liquidated, and users that should be liquidated cannot get liquidated.

#### Mitigation

Fix the equation.

mail@cmichel.io

@cmichelio

## [[H-06] Users are credited more tokens when paying back debt with `registerTradeAndBorrow`](https://github.com/code-423n4/marginswap-findings/issues/24)

The `registerTradeAndBorrow` is called with the results of a trade (`inAmount`, `outAmount`). It first tries to pay back any debt with the `outAmount`.
However, the **full** `outAmount` is credited to the user again as a deposit in the `adjustAmounts(account, tokenFrom, tokenTo, sellAmount, outAmount);` call.

As the user pays back their debt and is credited the same amount again, they are essentially credited twice the `outAmount`, making a profit of one `outAmount`.
This can be withdrawn and the process can be repeated until the funds are empty.

#### Mitigation

In the `adjustAmounts` call, it should only credit `outAmount - extinguishableDebt` as a deposit like in `registerDeposit`.
The `registerDeposit` function correctly handles this case.

## [[H-07] `account.holdsToken` is never set](https://github.com/code-423n4/marginswap-findings/issues/25)

The `addHolding` function does not update the `account.holdsToken` map.

```solidity
function addHolding(
    CrossMarginAccount storage account,
    address token,
    uint256 depositAmount
) internal {
    if (!hasHoldingToken(account, token)) {
        // SHOULD SET account.holdsToken here
        account.holdingTokens.push(token);
    }

    account.holdings[token] += depositAmount;
}
```

This leads to a critical vulnerability where deposits of the same token keep being pushed to the `account.holdingTokens` array but the sum is correctly updated in `account.holdings[token]`.

However, because of the duplicate token in the `holdingTokens` array the same token is counted several times in the `getHoldingAmounts` function:

```solidity
function getHoldingAmounts(address trader)
    external
    view
    override
    returns (
        address[] memory holdingTokens,
        uint256[] memory holdingAmounts
    )
{
    CrossMarginAccount storage account = marginAccounts[trader];
    holdingTokens = account.holdingTokens;

    holdingAmounts = new uint256[](account.holdingTokens.length);
    for (uint256 idx = 0; holdingTokens.length > idx; idx++) {
        address tokenAddress = holdingTokens[idx];
        // RETURNS SUM OF THE BALANCE FOR EACH TOKEN ENTRY
        holdingAmounts[idx] = account.holdings[tokenAddress];
    }
}
```

The `MarginRouter.crossCloseAccount` function uses these wrong amounts to withdraw all tokens:

```solidity
function crossCloseAccount() external {
    (address[] memory holdingTokens, uint256[] memory holdingAmounts) =
        IMarginTrading(marginTrading()).getHoldingAmounts(msg.sender);

    // requires all debts paid off
    IMarginTrading(marginTrading()).registerLiquidation(msg.sender);

    for (uint256 i; holdingTokens.length > i; i++) {
        Fund(fund()).withdraw(
            holdingTokens[i],
            msg.sender,
            holdingAmounts[i]
        );
    }
}
```

An attacker can just deposit the same token X times which increases their balance by X times the actual value.
This inflated balance can then be withdrawn to steal all tokens.

#### Mitigation

Correctly set the `account.holdsToken` map in `addHolding`.

## [[H-08] Rewards cannot be withdrawn](https://github.com/code-423n4/marginswap-findings/issues/26)

The rewards for a recipient in `IncentiveDistribution.sol` are stored in the storage mapping indexed by recipient `accruedReward[recipient]` and the recipient is the actual margin trader account, see `updateAccruedReward`.

These rewards are supposed to be withdrawn through the `withdrawReward` function but `msg.sender` is used here instead of a `recipient` (`withdrawer`) parameter.
However, `msg.sender` is enforced to be the incentive reporter and can therefore not be the margin trader.

Nobody can withdraw the rewards.

#### Mitigation

Remove the ` isIncentiveReporter(msg.sender)` check from `withdrawReward` function.

## [[H-09] lastUpdatedDay not initialized](https://github.com/code-423n4/marginswap-findings/issues/14)

The variable lastUpdatedDay in IncentiveDistribution.sol is not (properly) initialized.
This means the function updateDayTotals will end up in a very large loop which will lead to an out of gas error.
Even if the loop would end, the variable currentDailyDistribution would be updated very often.
Thus updateDayTotals cannot be performed

The entire IncentiveDistribution does not work.
If the loop would stop, the variable currentDailyDistribution is not accurate, resulting in a far lower incentive distribution than expected.

#### Mitigation

Initialize lastUpdatedDay with something like block.timestamp / (1 days)

uint256 lastUpdatedDay; # ==> lastUpdatedDay = 0

#When the function updateDayTotals is called:
uint256 public nowDay = block.timestamp / (1 days); #==> ~ 18721
uint256 dayDiff = nowDay - lastUpdatedDay; #==> 18721-0 = 18721

for (uint256 i = 0; i < dayDiff; i++) { # very long loop (18721)
currentDailyDistribution = ....
}
#will result in an out of gas error

## [[H-10] function buyBond charges msg.sender twice](https://github.com/code-423n4/marginswap-findings/issues/38)

function buyBond transfers amount from msg.sender twice:
Fund(fund()).depositFor(msg.sender, issuer, amount);
...
collectToken(issuer, msg.sender, amount);

This makes the msg.sender pay twice for the same bond.

#### Mitigation

Charge poor man only once.

## [[H-11] Impossible to call withdrawReward fails due to run out of gas](https://github.com/code-423n4/marginswap-findings/issues/65)

#The withdrawReward (https://github.com/code-423n4/marginswap/blob/main/contracts/IncentiveDistribution.sol#L224) fails due to the loop at https://github.com/code-423n4/marginswap/blob/main/contracts/IncentiveDistribution.sol#L269.
From my testing the dayDiff would be 18724 and with a gasLimit of 9500000 it stops at iteration 270 due to the fact that lastUpdatedDay is not initialized so is 0.
Other than that it could run out of gas also for the loop of allTranches (https://github.com/code-423n4/marginswap/blob/main/contracts/IncentiveDistribution.sol#L281) because it's an unbounded array.

This is a test with hardhat.

const { ethers } = require("hardhat");

describe("MarginSwap", function() {
let IncentiveDistribution, incentiveDistribution;
let owner;

    before(async function() {
        [owner] = await ethers.getSigners();
        IncentiveDistribution = await ethers.getContractFactory("IncentiveDistribution");
        incentiveDistribution = await IncentiveDistribution.deploy(ethers.constants.AddressZero, 2);
    });

    it("withdrawReward", async function() {
        await incentiveDistribution.initTranche(1, 23);
        await incentiveDistribution.addToClaimAmount(1, owner.address, 324234);
        await incentiveDistribution.withdrawReward([1], {gasLimit: 9500000});
    });

});

Note: from the IncentiveDistribution contract i removed the inheritance of RoleAware and Ownable for convenience of testing and added some print with console.log() to check where it stops.

Manual analysis

I'm not sure of the logic behind the shrinking of the daily distribution but i think that maybe you just missed to initialize the lastUpdatedDay to the day of deployment?
If that's the case it resolves partially the problem because allTranches is theoretically unbounded even though only the owner can add element to it and you should do deeply testing to understand how many elements it can have until it run out of gas.
I read the comment that says you tried to shift the gas to the withdrawal people maybe you went too further and is it worth rethinking the design?

### Comments:

**[werg commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/65#issuecomment-816212433):**

> Exactly. we need to initialize lastUdpatedDay. Thanks for the report!

# Medium Risk Findings

## [[M-01] No default `liquidationThresholdPercent`](https://github.com/code-423n4/marginswap-findings/issues/28)

The `IsolatedMarginTrading` contract does not define a default `liquidationThresholdPercent` which means it is set to 0.

The `belowMaintenanceThreshold` function uses this value and anyone could be liquidated due to `100 * holdings >= liquidationThresholdPercent * loan = 0` being always true.

Anyone can be liquidated immediately.
If the faulty `belowMaintenanceThreshold` function is fixed (see other issue), then nobody could be liquidated which is bad as well.

#### Mitigation

Set a default liquidation threshold like in `CrossMarginTrading` contracts.

## [[M-02] Missing checks if pairs equal tokens](https://github.com/code-423n4/marginswap-findings/issues/29)

The `UniswapStyleLib.getAmountsOut`, `PriceAware.setLiquidationPath` (and others) don't check that `path.length + 1 == tokens.length` which should always hold true.
Also, it does not check that the tokens actually match the pair.

It's easy to set faulty liquidation paths which then end up reverting the liquidation transactions.

#### Mitigation

Add the missing checks.

## [[M-03] No entry checks in crossSwap[Exact]TokensFor[Exact]Tokens](https://github.com/code-423n4/marginswap-findings/issues/4)

The functions crossSwapTokensForExactTokens and crossSwapExactTokensForTokens of MarginRouter.sol do not check who is calling the function.
They also do not check the contents of pairs and tokens
They also do not check if the size of pairs and tokens is the same

registerTradeAndBorrow within registerTrade does seem to do an entry check
(require(isMarginTrader(msg.sender)...)
however as this is an external function msg.sender is the address of MarginRouter.sol, which will verify ok.

Calling these functions allow the caller to trade on behalf of marginswap, which could result in losing funds.
It's possible to construct all parameters to circumvent the checks.
Also the "pairs" can be fully specified; they are contract addresses that are called from getAmountsIn / getAmountsOut and from pair.swap.
This way you can call arbitrary (self constructed) code, which can reentrantly call the marginswap code.

Based on source code review.
A real attack requires the deployed code to be able to construct the right values.

remix

#### Mitigation

Limit who can call the functions
Perhaps whitelist contents of pairs and tokens
Check the size of pairs and tokens is the same

### Comments:

**[werg commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/4#issuecomment-813047489):**

> This has merit: particularly the part about self-constructed pairs. We either need much more rigorous checks or a a process for vetting & approving pairs. The latter is likely more gas efficient.

## [[M-04] maintainer can be pushed out](https://github.com/code-423n4/marginswap-findings/issues/5)

The function liquidate (in both CrossMarginLiquidation.sol and IsolatedMarginLiquidation.sol) can be called by everyone.
If an attacker calls this repeatedly then the maintainer will be punished and eventually be reported as maintainerIsFailing
And then the attacker can take the payouts

When a non authorized address repeatedly calls liquidate then the following happens:
isAuthorized = false
which means maintenanceFailures[currentMaintainer] increases
after sufficient calls it will be higher than the threshold and then
maintainerIsFailing() will be true
This results in canTakeNow being true
which finally means the following will be executed:
Fund(fund()).withdraw(PriceAware.peg, msg.sender, maintainerCut);

An attacker can push out a maintainer and take over the liquidation revenues

remix

#### Mitigation

put authorization on who can call the liquidate function
review the maintainer punishment scheme

### Comments:

**[werg commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/5#issuecomment-813044805):**

> I believe this issue is not a vulnerability, due to the checks in lines 326-335. Even if someone comes in first and claims the maintainer is failing they can do their job in the same or next block and get all / most of their failure record extinguished.

**[zscole commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/5#issuecomment-824102934):**

> Acknowledging feedback from @werg, but maintaining the reported risk level of `medium` since this has implications on token logic.

## [[M-05] Several function have no entry check](https://github.com/code-423n4/marginswap-findings/issues/9)

The following functions have no entry check or a trivial entry check:
withdrawHourlyBond Lending.sol
closeHourlyBondAccount Lending.sol
haircut Lending.sol
addDelegate(own adress...) Admin.sol
removeDelegate(own adress...) Admin.sol
depositStake Admin.sol
disburseLiqStakeAttacks CrossMarginLiquidation.sol
disburseLiqStakeAttacks IsolatedMarginLiquidation.sol
getCurrentPriceInPeg PriceAware.sol

By manipulating the input values (for example extremely large values)
you might be able to disturb the internal administration of the contract, thus perhaps locking function or giving wrong rates.

note: function haircut is trivial so hardly any risk

#### Mitigation

Check the functions to see if they are completely risk free and add entry checks if they are not.
Add a comment to notify the function is meant to be called by everyone.

Based on source code review.
A real attack requires the deployed code to be able to construct the right values.

### Comments:

**[werg commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/9#issuecomment-813043345):**

> - `withdrawHourlyBond`: could not find vulnerability, since solidity 0.8.x fails on underflow in HourlyBondSubscriptionLending.sol:115 in case of unauthorized access.
> - `closeHourlyBondAccount`: same story since both call into `_withdrawHourlyBond`
> - `haircut`: trivially guarded in one way, though this actually has merit in another way -- if at some point down the road an attacker were able to establish a token, make it popular enough for us to add it to cross margin, but include in that token contract a malicious function that calls haircut, they could then void everybody's bonds in their token. I don't see how it would be profitable, it's definitely an expensive long con, but... we should add an extra guard to make sure it's an isolated margin trading contract.
> - `addDelegate` has a guard.
> - `removeDelegate` has a guard as well, or am I missing something here?
> - `depositStake` fails for unfunded requests in the safe transfer in `Fund.depositFor`
> - `disburseLiqStakeAttacks` should be universally accessible by design
> - `getCurrentPriceInPeg` only updates state in a rate limited way, hence fine for it to be public
>
> I will add comments to the effect. Thanks again

## [[M-06] Users Can Drain Funds From MarginSwap By Making Undercollateralized Borrows If The Price Of A Token Has Moved More Than 10% Since The Last MarginSwap Borrow/Liquidation Involving Accounts Holding That Token.](https://github.com/code-423n4/marginswap-findings/issues/67)

Users Can Drain Funds From MarginSwap By Making Undercollateralized Borrows If The Price Of A Token Has Moved More Than 10% Since The Last MarginSwap Borrow/Liquidation Involving Accounts Holding That Token.

MarginSwap's internal price oracle is only updated for a particular token if a borrow or liquidation is attempted for an account that is lending/borrowing that particular token.
For a less popular token, the price could move quite a bit without any borrow or liquidation being called on any account lending/borrowing that token, especially if MarginSwap does not end up being wildly popular, or if it supports lesser known assets.
If the Uniswap price has moved more than 10% (liquidationThresholdPercent - 100) without a borrow or liquidation on an account lending/borrowing that particular token occurring on MarginSwap, then Alice can make undercollateralized loans, leaving behind her collateral and draining funds from the contract.

(1) Alice waits for the Uniswap price for any token to move more than 10% (liquidationThresholdPercent - 100) without a borrow or liquidation occurring for any account lending/borrowing that token occurring on MarginSwap.
(2) When this condition is satisfied, Alice can loop the following actions:
(2.1) If the price has fallen, Alice can use the token as collateral (making sure to use more than UPDATE_MAX_PEG_AMOUNT worth of the token in ETH), borrow ether from MarginSwap, sell the ether for the token on Uniswap, and repeat, leaving coolingOffPeriod blocks between each lend and borrow.
(2.2) If the price has risen, Alice can use ether as collateral, borrow the token from MarginSwap (making sure to use more than UPDATE_MAX_PEG_AMOUNT worth of the token in ETH), sell the token for ether on Uniswap, and repeat, leaving coolingOffPeriod blocks between each lend and borrow.

Because the MarginSwap price is now stale, Alice can borrow more than 100% of the actual value of her collateral, since MarginSwap believes the borrowed funds to only be worth 90% or less than their actual current market value.

The various defenses that MarginSwap has employed against undercollateralized loans are all bypassed:
(a) The exponential moving price average stored within MarginSwap is not updated, because Alice borrows at least UPDATE_MAX_PEG_AMOUNT worth of the token in ETH, so MarginSwap.PriceAware.getPriceFromAMM skips the price update due to the "outAmount < UPDATE_MAX_PEG_AMOUNT" condition failing.
(b) CoolingOffPeriod can be bypassed by Alice splitting her deposits and borrows up by 20 blocks (the current value of CoolingOffPeriod). Since deposits do not trigger a price oracle update, Alice can even deposit ahead of time as the price is nearing 10% off of peg, allowing her to perform the borrow right when 10% is passed.
(c) MarginSwap.Lending.registerBorrow check is bypassed. The check is "meta.totalLending >= meta.totalBorrowed", but this is a global check that only ensures that the contract as a whole has sufficient tokens to fund Alice's borrow. Alice simply needs to ensure that she only borrows up to the amount of tokens that the contract currently owns.

Even if the issue of the price oracle stalling were to be fixed by using a large enough UPDATE_MAX_PEG_AMOUNT, since the moving average updates so slowly (MarginSwap is currently set at moving 8/1000th towards new price every 8 blocks) and only when actions are taken on MarginSwap (which may not be frequent on lesser known tokens or if MarginSwap is not too popular), Alice can still take out undercollateralized loans for a period of time before the price oracle catches up.
The real solution here is to use UniswapV2/SushiSwap/UniswapV3's built in TWAP price oracle, especially since MarginSwap is built on top of Uniswap/Sushiswap.

### Comments:

**[werg commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/67#issuecomment-816204245):**

> I believe the issue above is referring to the "overcollateralized borrow" functionality, because there is talk of withdrawing. In any case of withdrawal (whether immediately or not) it is not the `liquidationThresholdPercent` which governs how much a user may withdraw. Rather, we check whether the account has positive balance (i.e. the value of assets exceeds the loan).
>
> In the current system, at 3x possible leverage level, users can withdraw maximally 66% of the face value (to the system) they deposited. If a user deposited collateral that had dropped in price by 10% it would allow them to withdraw around 73% of the real value. -- Not undercollateralized.
> The price of an asset would have to have dropped by 33%, without the system catching on, for Alice to break even (without considering gas cost).
>
> Cross margin trading will only be available for a select set of tokens with high enough trading volume. Anyone will be able to update the price if our exponential weighted average is out of date.
> Nevertheless, risk remains as in any lending system.
>
> - We will consider adding an additional buffer around immediate withdrawals
> - If staleness becomes an issue the protocol can institute rewards for updating the price

**[werg commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/67#issuecomment-816223030):**

> also of course there are liquidators waiting in the wings to make their cut on underwater accounts and liquidators can update the price

## [[M-07] diffMaxMinRuntime gets default value of 0](https://github.com/code-423n4/marginswap-findings/issues/37)

uint256 public diffMaxMinRuntime;
This variable is never set nor updated so it gets a default value of 0.

diffMaxMinRuntime with 0 value is making the calculations that use it either always return 0 (when multiplying) or fail (when dividing) when calculating bucket indexes or sizes.

#### Mitigation

Set the appropriate value for diffMaxMinRuntime and update it whenever min or max runtime variables change.

## [[M-08] PriceAware uses prices from getAmountsOut](https://github.com/code-423n4/marginswap-findings/issues/39)

getPriceFromAMM relies on values returned from getAmountsOut which can be manipulated (e.g. with the large capital or the help of flash loans). The impact is reduced with UPDATE_MIN_PEG_AMOUNT and UPDATE_MAX_PEG_AMOUNT, however, it is not entirely eliminated.

pauliax6@gmail.com

paulius.eth

0x523B5b2Cc58A818667C22c862930B141f85d49DD

#### Mitigation

Uniswap v2 recommends using their TWAP oracle: https://uniswap.org/docs/v2/core-concepts/oracles/

## [[M-09] Isolated margin contracts declare but do not set the value of liquidationThresholdPercent](https://github.com/code-423n4/marginswap-findings/issues/40)

CrossMarginTrading sets value of liquidationThresholdPercent in the constructor:
liquidationThresholdPercent = 110;
Isolated margin contracts declare but do not set the value of liquidationThresholdPercent.

#### Mitigation

Set the initial value for the liquidationThresholdPercent in Isolated margin contracts.

This makes function belowMaintenanceThreshold to always return true unless a value is set via function setLiquidationThresholdPercent. Comments indicate that the value should also be set to 110:

// The following should hold:
// holdings / loan >= 1.1
// => holdings >= loan \* 1.1

## [[M-10] Add a timelock to functions that set key variables](https://github.com/code-423n4/marginswap-findings/issues/70)

Functions like setLeveragePercent and setLiquidationThresholdPercent for both IsolatedMarginTrading (https://github.com/code-423n4/marginswap/blob/main/contracts/IsolatedMarginTrading.sol) and CrossMarginTrading (https://github.com/code-423n4/marginswap/blob/main/contracts/CrossMarginTrading.sol) should be put behind a timelock because they would give more trust to users.
Now the owner could call them whenever he wants and a position could become liquidable from a block to the other.

-

Manual analysis.

Add a timelock to setter functions of critical variables.

### Comments:

**[werg commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/70#issuecomment-816168032):**

> Timelock will be handled by governance

**[zscole commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/70#issuecomment-824944141):**

> Maintaining submission rating of `2 (Med Risk)` because this presents a vulnerability at the time of review.

# Low Risk Findings

## [[L-01] Events not indexed](https://github.com/code-423n4/marginswap-findings/issues/27)

The `CrossDeposit`, `CrossTrade`, `CrossWithdraw`, `CrossBorrow`, `CrossOvercollateralizedBorrow` events in `MarginRouter` are not indexed.

Off-chain scripts cannot efficiently filter these events.

#### Mitigation

Add an index on important arguments like `trader`.

## [[L-02] `getReserves` does not check if tokens match](https://github.com/code-423n4/marginswap-findings/issues/30)

The `UniswapStyleLib.getReserves` function does not check if the tokens are the pair's underlying tokens.
It blindly assumes that the tokens are in the wrong order if the first one does not match but they could also be completely different tokens.

It could be the case that output amounts are computed for completely different tokens because a wrong pair was provided.

## [[L-03] Role 9 in Roles.sol](https://github.com/code-423n4/marginswap-findings/issues/10)

This is a minor suggestion.

Roles.sol contains the following:
roles[msg.sender][9] = true;
It's not clear what the number 9 means.
In RoleAware.sol there is a constant with the value 9:
uint256 constant TOKEN_ACTIVATOR = 9;

The code is more difficult to read without an explanation for the number 9.
In case the code would be refactored in the future and the constants in RoleAware.sol are renumbered, the value in Roles.sol would no longer correspond to the right value.

#### Mitigation

Move the constants from Roles.sol to RoleAware.sol and replace 9 with the appropriate constant.

### Comments:

**[werg commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/10#issuecomment-813037820):**

> Yes! I recently saw this as well and already fixed it in our code base 😉

## [[L-04] Multisig wallets can't be used for liquidate](https://github.com/code-423n4/marginswap-findings/issues/13)

The function liquidate, which is defined in both
CrossMarginLiquidation.sol and IsolatedMarginLiquidation.sol, includes the modifier noIntermediary.
This modifier prevents the use of Multisig wallets.

If the maintainer happens to use a multisig wallet he might not experience any issues until he tries to call the function liquidate. At that moment he can't successfully call the function.

#### Mitigation

Verify if the prevention to use multisig wallets is intentional. In that case add a comment to the liquidate functions.
If it is not intentional update the code so multisigs wallets can be supported.

## [[L-05] Different solidity version in UniswapStyleLib.sol](https://github.com/code-423n4/marginswap-findings/issues/6)

The solidity version in UniswapStyleLib.sol (>=0.5.0) is different than the solidity version in the other contracts (e.g. ^0.8.0)
Also math actions are present in the functions getAmountOut and getAmountIn that could easily lead to an underflow or division by 0; (note safemath is not used).
Note: In solidity 0.8.0 safemath like protections are default.

The impact is low because UniswapStyleLib is a library and the solidity version of the contract that uses the library is used (e.g. ^0.8.0), which has safemath like protections.
It is cleaner to have the same solidity version everywhere.

getAmountIn(3,1,1000) would give division by 0
getAmountIn(1,1,1) will underflow denominator

#### Mitigation

Use the same solidity version everywhere

## [[L-06] sortTokens can be simplified](https://github.com/code-423n4/marginswap-findings/issues/7)

this is a minor suggestion:

The function sortTokens UniswapStyleLib.sol returns 2 values, but only the first return value is used:
MarginRouter.sol: (address token0, ) = UniswapStyleLib.sortTokens...
UniswapStyleLib.sol: (address token0, ) = sortTokens..
In both cases the used return value is compared to the first parameter of the function call.
Conclusion: the function is only used to determine the smaller of the two tokens, not really to sort tokens.

gpersoon

mail@gpersoon.com

gpersoon.eth

The code is somewhat more difficult to read and a bit longer than neccesary.

#### Mitigation

simplify the code:
function ASmallerThanB(address tokenA, address tokenB)
internal
pure
returns (bool)
{
require(tokenA != tokenB, "Identical address!");
require(tokenA != address(0), "Zero address!");
require(tokenB != address(0), "Zero address!");
return tokenA < tokenB;
}

## [[L-07] Duplicated Code In Admin.viewCurrentMaintenanceStaker()](https://github.com/code-423n4/marginswap-findings/issues/69)

Duplicated Code In Admin.viewCurrentMaintenanceStaker()

There are four lines of code that are duplicated in viewCurrentMaintenanceStaker

Change this:

if (maintenanceStakePerBlock > currentStake) {
// skip
staker = nextMaintenanceStaker[staker];
currentStake = getMaintenanceStakerStake(staker);
} else {
startBlock += currentStake / maintenanceStakePerBlock;
staker = nextMaintenanceStaker[staker];
currentStake = getMaintenanceStakerStake(staker);
}

To this:

if (maintenanceStakePerBlock <= currentStake) {
startBlock += currentStake / maintenanceStakePerBlock;
}
staker = nextMaintenanceStaker[staker];
currentStake = getMaintenanceStakerStake(staker);

## [[L-08] Magic Numbers used in Admin.\_stake() When Constant Defined Above Can Be Used Instead](https://github.com/code-423n4/marginswap-findings/issues/71)

Magic Numbers are used in Admin.\_stake(), which both obscure the purpose of the function and unnecessarily lead to potential error if the constants are changed during development. Since they are used to refer to a constant defined in RoleAware, and Admin inherits from RoleAware, then Admin can simply call that constant.

In Admin.\_stake(), change this:

IncentiveDistribution(incentiveDistributor()).addToClaimAmount(
1,
holder,
amount
);

to this:

IncentiveDistribution(incentiveDistributor()).addToClaimAmount(
FUND_TRANSFERER,
holder,
amount
);

## [[L-09] function initTranche should check that the share parameter is > 0](https://github.com/code-423n4/marginswap-findings/issues/35)

function initTranche should check that the "share" parameter is > 0, otherwise, it may be possible to initialize the same tranche again.

## [[L-10] runtime > 1 hours error message discrepancy](https://github.com/code-423n4/marginswap-findings/issues/36)

Here, the revert message says that the value needs to be at least 1 hour, however, the code allows value only above the 1 hour (> instead of >=):
require(runtime > 1 hours, "Min runtime needs to be at least 1 hour");

no impact on security, just a discrepancy between the check and message.

#### Mitigation

Replace > with >= or update the error message to reflect that.

## [[L-11] setLeveragePercent should check that new \_leveragePercent >= 100](https://github.com/code-423n4/marginswap-findings/issues/41)

function setLeveragePercent should check that the \_leveragePercent >= 100 so that this calculation will not fail later:
(leveragePercent - 100)

This variable can only be set by admin so as long as he sets the appropriate value it should be fine.

#### Mitigation

It is always nice to enforce such things via code. Code is law they say.

### Comments:

**[werg commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/41#issuecomment-816349665):**

> thanks, but in this case that would be governance's job to check

## [[L-12] An erroneous constructor's argument could block the withdrawReward](https://github.com/code-423n4/marginswap-findings/issues/33)

The constructor of IncentiveDistribution https://github.com/code-423n4/marginswap/blob/main/contracts/IncentiveDistribution.sol#L32
take as argument the address of MFI token but it doesn't check that is != address(0).
Not worth an issue alone but IncentiveDistribution imports IERC20.sol and it never use it.

In case the address(0) is passed as arguement the withdrawReward woul fail https://github.com/code-423n4/marginswap/blob/main/contracts/IncentiveDistribution.sol#L261 and due to the fact that
MFI is immutable the only solution would be to redeploy the contract meanwhile losing trust from the users.

Deploy IncentiveDistribution with 0 as \_MFI argument and then call withdrawReward.

Manual analysis

#### Mitigation

Check \_MFI != address(0)

## [[L-13] Not emitting event for important state changes](https://github.com/code-423n4/marginswap-findings/issues/61)

When changing state variables events are not emitted.
PriceAware (https://github.com/code-423n4/marginswap/blob/main/contracts/PriceAware.sol):

- setPriceUpdateWindow
- setUpdateRate
- setUpdateMaxPegAmount
- setUpdateMinPegAmount
  Lending (https://github.com/code-423n4/marginswap/blob/main/contracts/Lending.sol):
- activateIssuer
- deactivateIssuer
- setLendingCap
- setLendingBuffer
- setHourlyYieldAPR
- setRuntimeWeights
  IncentiveDistribution (https://github.com/code-423n4/marginswap/blob/main/contracts/IncentiveDistribution.sol#L261):
- setTrancheShare
- initTranche
  IsolatedMarginTrading and CrossMarginTrading (https://github.com/code-423n4/marginswap/blob/main/contracts/IsolatedMarginTrading.sol - https://github.com/code-423n4/marginswap/blob/main/contracts/CrossMarginTrading.sol):
- setCoolingOffPeriod
- setLeveragePercent
- setLiquidationThresholdPercent

The events emitted by MarginRouter (https://github.com/code-423n4/marginswap/blob/main/contracts/MarginRouter.sol) don't have indexed parameter.

-

Manual analysis

The system doesn't record historical state changes.

#### Mitigation

For set... function emit events with old and new value.
For initTranche, event InitTranche(uint256 tranche, uint256 share)
For activateIssuer, event ActivateIssuer(address issuer, address token)
For deactivateIssuer, event DeactivateIssuer(address issuer)
For events emitted by MarginRouter i would index the trader address to make it filterable.

### Log:

- [zscole labeled](https://github.com/code-423n4/2021-04-marginswap-findings/issues/61) 1 (Low Risk)

### Comments:

**[werg commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/61#issuecomment-816218019):**

> We may sprinkle in a few more events before launch, but in the interest of gas savings we try not to emit events for state that can be queried using view functions.

**[zscole commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/61#issuecomment-824941755):**

> Reducing this from submitted rating of `2 (Med Risk)` to `1 (Low Risk)` since it presents no immediate risk to the security of the system, but could have implications on overall functionality.

# Non-Critical Findings

## [[N-01] Liquidations can be sandwich attacked](https://github.com/code-423n4/marginswap-findings/issues/22)

The liquidation functions `liquidateToPeg/liquidateFromPeg` uses a `minReturn` value of zero which allows infinite slippage.
An attacker can frontrun a liquidation trade by buying up the same asset, driving the price higher and resulting in the liquidator receiving fewer tokens. The attacker then backruns the trade by selling the tokens received by their first trade again for a profit. ([sandwich attack](https://cmichel.io/de-fi-sandwich-attacks/))

Liquidators earn less profit

#### Mitigation

Let liquidators define `minReturn` amounts.

### Comments:

**[werg commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/22#issuecomment-816366160):**

> This is a cost of doing business on AMMs and underscores the importance of choosing pairs with high liquidity

**[zscole commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/22#issuecomment-821156108):**

> Sandwich attacks are inherent to AMMs, so this isn’t a unique issue presented by the MarginSwap implementation. With this in mind, I’m downgrading the risk from a proposed medium severity to no severity.

## [[N-02] Unlocked Pragma](https://github.com/code-423n4/marginswap-findings/issues/31)

Every Solidity file specifies in the header a version number of the format `pragma solidity ^0.8.0`. The caret (`^`) before the version number implies an unlocked pragma, meaning that the compiler will use the specified version _or above_.

It’s usually a good idea to pin a specific version to know what compiler bug fixes and optimizations were enabled at the time of compiling the contract.

#### Mitigation

Pin the compiler versions.

### Log:

- [adamavenir labeled](https://github.com/code-423n4/2021-04-marginswap-findings/issues/31) 0 (Non-critical)

### Comments:

**[zscole commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/31#issuecomment-824077900):**

> This was submitted with a risk rating of `1` for `low severity`. This is non-critical, as it does not apply to the functionality of the contract.

## [[N-03] No function for TOKEN_ADMIN in RoleAware.sol](https://github.com/code-423n4/marginswap-findings/issues/11)

This is a minor suggestion.

RoleAware.sol contains functions for most of the constants. However the one exception is TOKEN_ADMIN.

The code is slightly longer than necessary.

#### Mitigation

Remove the constant TOKEN_ADMIN, or provide a comment why it isn't used.

### Log:

- [adamavenir labeled](https://github.com/code-423n4/2021-04-marginswap-findings/issues/11) 0 (Non-critical)

### Comments:

**[zscole commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/11#issuecomment-824079704):**

> This submission has been judged as `non-critical` since this has no impact on the security or functionality of the contract.

## [[N-04] isStakePenalizer differtent than other functions in RoleAware.sol](https://github.com/code-423n4/marginswap-findings/issues/12)

This is a minor suggestion.

The function isStakePenalizer in RoleAware.sol uses roles.getRole...
However all other function use roleCache...

It's not clear why this difference exists.

If roleCache could also be used a tiny amount of gas could be safed.

#### Mitigation

Check if isStakePenalizer can use roleCache, in that case update the source.
Otherwise provide a comment why roles.getRole is neccesary

### Log:

- [adamavenir labeled](https://github.com/code-423n4/2021-04-marginswap-findings/issues/12) 0 (Non-critical)

### Comments:

**[zscole commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/12#issuecomment-824084735):**

> This submission has been judged as `non-critical` as it has no impact on the security or function of the contract.

## [[N-05] Natspec comments not used in a consistent way](https://github.com/code-423n4/marginswap-findings/issues/15)

This is a minor suggestion.

The comments do not comply perfectly to the natspec specification.
Too many or too few /'s

Here are a few examples:
MarginRouter.sol: // @dev internal helper swapping ...
MarginRouter.sol: //// @dev external function ...
MarginRouter.sol: /// about a trade

There should be exactly three /'s before an @.. keyword
If there is no @.. keyword then there should be two /'s

grep " // @" _
grep "//// @" _
grep "/// [^@]" \*

#### Mitigation

Check and update the comments to comply with the natspec comment
Note in the latest solidity version you can also use
@custom:...
everywhere within the source

The documentation generated using the natspec lines might not be accurate.

### Log:

- [adamavenir labeled](https://github.com/code-423n4/2021-04-marginswap-findings/issues/15) 0 (Non-critical)

### Comments:

**[zscole commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/15#issuecomment-824086533):**

> This submission has been judged as `non-critical` since this has no impact on the security or functionality of the contract.

## [[N-06] Function parameter named timestamp](https://github.com/code-423n4/marginswap-findings/issues/16)

This is a minor suggestion.

The function viewCumulativeYieldFP in HourlyBondSubscrptionLending.sol has a parameter named timestamp.

As there is also an inbuilt variable block.timestamp this could be confusing.

#### Mitigation

Rename the parameter timestamp to a slightly different name.

### Log:

- [adamavenir labeled](https://github.com/code-423n4/2021-04-marginswap-findings/issues/16) 0 (Non-critical)

### Comments:

**[zscole commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/16#issuecomment-824088021):**

> This submission has been judged as `non-critical` since this has no impact on the security or functionality of the contract.

## [[N-07] Naming convention for internal functions not used consistently](https://github.com/code-423n4/marginswap-findings/issues/17)

This is a minor suggestion.

Most internal function names start with an underscore (\_)
However quite a lot of internal function names don't follow this convention.

One example is: updateHourlyBondAmount in HourlyBondSubscriptionLending.sol
Also all the functions in RoleAware.sol don't comply to the standard.

The code is more difficult to read if a naming convention is not used consistently.

#### Mitigation

Add an underscore (\_) prefix to all internal functions.

### Log:

- [adamavenir labeled](https://github.com/code-423n4/2021-04-marginswap-findings/issues/17) 0 (Non-critical)

### Comments:

**[zscole commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/17#issuecomment-824088532):**

> This submission has been judged as `non-critical` since this has no impact on the security or functionality of the contract.

## [[N-08] Todo's left in code](https://github.com/code-423n4/marginswap-findings/issues/8)

This is a minor suggestion.

Several TODO's are left in the code:
IsolatedMarginAccounts.sol: // TODO check if underflow?
IsolatedMarginAccounts.sol: // TODO TELL LENDING
IsolatedMarginLiquidation.sol: // TODO pay off / extinguish that loan
Lending.sol:// TODO activate bonds for lending
Lending.sol:// TODO disburse token if isolated bond issuer
MarginRouter.sol: // TODO minimum trade?

TODO usually mean something still have to be checked of done. This could lead to vulnerabilities if not verified.

grep

#### Mitigation

Check the TODO's and fix if necessary. Remove them afterwards

## [[N-09] The First User To Borrow a Particular Token Can Drain Funds In MarginSwap by Making An Undercollateralized Borrow Using Flash Loans](https://github.com/code-423n4/marginswap-findings/issues/66)

The First User To Borrow a Particular Token Can Drain Funds In MarginSwap by Making An Undercollateralized Borrow Using Flash Loans

This attack can be performed with any two ERC20 tokens, where one of them has not yet been borrowed on MarginSwap.
Since any newly added token must first be loaned before it can be borrowed, there will always be a window of time where this attack is possible for any newly added asset.
The magnitude of the attack will be limited by the size of MarginSwap.CrossMarginAccounts.tokenCaps[borrowToken], but could potentially allow an attacker to drain one particular token from MarginSwap if it has been lent but not yet borrowed.

For the sake of argument, let's assume two ERC20 tokens called Token0 and Token1, who have a current market price of 1:1.

Expected Behavior:
Alice can only borrow 900 Token1 if she puts up 1,000 Token0 as collateral.

Actual Behavior:
Using this attack, Alice can borrow 9,000 Token1 when using 1,000 Token0 as collateral. She can leave her 1,000 Token0 behind in MarginSwap, and sell the 9,000 Token1 for an 8,000 token profit.
It should be noted that this attack can be larger than what is shown here: we demonstrate a 10x attack for simplicity, but it only depends on how much liquidity is in the Uniswap pool, determining how much it will cost to skew the price.

(0) Alice begins with 1,000 Token0 and 1,000 Token1
(1) Alice calls AliceAttackerContract.functionOneOfTwo(), which performs the following calls:
(1.1) Calls Token0.approve(MarginSwap, UINT256MAX) to allow MarginSwap to spend her Token0
(1.2) Calls MarginSwap.MarginRouter.crossDeposit(Token0Address, 1000 _ 1e18)
(2) Alice waits for n + 1 blocks to pass, where n is specified in MarginSwap.CrossMarginTrading.coolingOffPeriod (currently set at 20 blocks)
(3) Alice calls AliceAttackerContract.functionTwoOfTwo(), which performs the following calls:
(3.1) Flashloan Token1
(3.2) Trade Token1 for Token0 on Uniswap to make Token1's price on Uniswap appear cheaper. For argument's sake let's skew the price to 10:1
(3.3) Calls Token1.approve(MarginSwap, UINT256MAX) to allow MarginSwap to spend her Token1
(3.3) Call MarginRouter.crossBorrow(Token1Address, 9000 _ 1e18);
(3.4) Call MarginRouter.crossWithdraw(Token1Address, 9000 \* 1e18);
(3.5) Trade Token0 for Token1 on Uniswap to return the Uniswap price to market price, minus fees
(3.6) Repay the Flashloan of Token1
(4) Alice ends with 10,000 Token1 (minus Uniswap fees). Since we assumed Token0 and Token1 had the same market price for the sake of argument, Alice has a profit of 8,000 Token1 minus Uniswap fees, and MarginSwap has lost 8,000 Token1.

The various defenses that MarginSwap has employed against flashLoans are all bypassed:
(a) MarginSwap employed noIntermediary() on MarginSwap.CrossMarginLiquidation.liquidate() in order to prevent the liquidation function from being called by a contract. However, this defense does not prevent crossDeposit() or crossBorrow() from being called by a contract.
(b) The coolingOffPeriod is bypassed, since the flashLoan price manipulation can occur at the moment of withdrawal, and the coolingOffPeriod is only triggered upon deposit, so you can split the deposit and withdrawal into two transactions that are separated by at least coolingOffPeriod number of blocks.
(c) UPDATE_MIN_PEG_AMOUNT and UPDATE_MAX_PEG_AMOUNT are bypassed, since if this is the first borrow for Token1, then MarginSwap.PriceAware.getCurrentPriceInPeg() simply returns the current price from Uniswap, not an exponential moving average, and does not consult UPDATE_MIN_PEG_AMOUNT and UPDATE_MAX_PEG_AMOUNT at all.
(d) MarginSwap.Lending.registerBorrow check is bypassed. The check is "meta.totalLending >= meta.totalBorrowed", but this is a global check that only ensures that the contract as a whole has sufficient Token1 to fund Alice's borrow. If users have lent Token1 to MarginSwap but no one has borrowed it yet, then Alice simply needs to ensure that she does not borrow more than those users have lent.
(e) MarginSwap.CrossMarginTrading.\_registerBorrow check is bypassed. The check is "tokenCaps[borrowToken] >= totalShort[borrowToken]". Since Alice does not need to make a huge borrow for her attack to succeed, even a conservative initial borrowCap can be bypassed for at least some profit.

The best solution is to use Uniswap's built in TWAP, and to take your first measurement from it when you add a new token, rather than at the time of the first borrow of that token.
Using a price oracle that is internal to MarginSwap leads to less accurate prices, which is especially problematic for an application that features lending/borrowing. If MarginSwap is not widely used or if it features a lesser used token, the price oracle will be innacurate and will lead to attacks.
Since Uniswap already has TWAPs built in, there is no reason not to utilize them, since they will be far more accurate.

### Comments:

**[werg commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/66#issuecomment-816210972):**

> The token price gets initialized upon token activation. I do not see how a flash loan can influence the price in any particular way for a first time borrow.

**[zscole commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/66#issuecomment-824922228):**

> I believe this is a valid concern. What is being described is similar to a sandwich attack that leverages flash loan logic to exploit race conditions.
>
> Regarding the proposed mitigation steps, relying on the Uniswap TWAP (and TWAPs in general) presents inherent risk, so I don't think that is an ideal solution (granted it's the most practical and the ideal solution is impossible to achieve by today's standards).
>
> In consideration of the sponsor's response (@werg) and the fact that the presented exploit is fairly novel and lacks a secure mitigation strategy, I'm downgrading this submission from `3 (High Risk)` to `2 (Medium Risk)`.
>
> It would be interesting to see how this plays out in prod.

## [[N-10] function crossWithdrawETH does not emit withdraw event](https://github.com/code-423n4/marginswap-findings/issues/34)

contract MarginRouter, function crossWithdrawETH does not emit withdraw event:
emit CrossWithdraw(msg.sender, WETH, withdrawAmount);

no impact on security.

#### Mitigation

emit the expected event

### Log:

- [zscole labeled](https://github.com/code-423n4/2021-04-marginswap-findings/issues/34) 0 (Non-critical)

### Comments:

**[zscole commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/34#issuecomment-824928398):**

> Downgrading this from proposed severity of `1 (Low Risk)` to `0 Non-critical` as it has no effect on the performance of the system and presents no security risk.

## [[N-11] [INFO] All caps indicates that the value should be constant](https://github.com/code-423n4/marginswap-findings/issues/42)

This is FYI, not a real issue as you have expressed your interest in minor improvement suggestions (not security or gas related):

All caps indicates that the value should be constant:
uint256 public MAINTAINER_CUT_PERCENT = 5;
However, it can be changed with function setMaintainerCutPercent. Then, this comment may become innacurate: // 5% of value borrowed Same with UPDATE_RATE_PERMIL, UPDATE_MAX_PEG_AMOUNT, UPDATE_MIN_PEG_AMOUNT.

#### Mitigation

## [[N-12] [INFO] TODOs](https://github.com/code-423n4/marginswap-findings/issues/43)

This is FYI, not a real issue as you have expressed your interest in minor improvement suggestions (not security or gas related):

There are 6 TODOs left. It makes it confusing to audit such code.

### Comments:

**[werg commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/43#issuecomment-816348875):**

> Sorry about that -- a few were extraneous -- in some other parts it points to work that still needed to and now has been done

## [[N-13] [INFO] Consistent function names](https://github.com/code-423n4/marginswap-findings/issues/44)

This is FYI, not a real issue as you have expressed your interest in minor improvement suggestions (not security or gas related):

In contract IsolatedMarginTrading the function to set leverage is named "setLeveragePercent" and in CrossMarginTrading function that does the same is named "setLeverage". It would be better to unify them and give the same names to make it more consistent.

## [[N-14] [INFO] Useless overflow comments](https://github.com/code-423n4/marginswap-findings/issues/45)

This is FYI, not a real issue as you have expressed your interest in minor improvement suggestions (not security or gas related):

I think this comment is useless when Solidity 0.8 is used (protection from overflow by default):

// no overflow because depositAmount >= extinguishableDebt
uint256 addedHolding = depositAmount - extinguishableDebt;

there are more such comments, for example:
/// won't overflow
borrowAmount = inAmount - sellAmount;

## [[N-15] [INFO] Variable is declared and initialized with different values](https://github.com/code-423n4/marginswap-findings/issues/46)

This is FYI, not a real issue as you have expressed your interest in minor improvement suggestions (not security or gas related):

It is strange to see a variable assigned a value in the declaration but immediadetely overriden in the constructor:
uint256 public maintenanceStakePerBlock = 10 ether;
constructor(
...
maintenanceStakePerBlock = 1 ether;

## [[N-16] [INFO] Code duplication in viewCurrentMaintenanceStaker](https://github.com/code-423n4/marginswap-findings/issues/47)

This is FYI, not a real issue as you have expressed your interest in minor improvement suggestions (not security or gas related):

This code has too much duplication:
if (maintenanceStakePerBlock > currentStake) {
// skip
staker = nextMaintenanceStaker[staker];
currentStake = getMaintenanceStakerStake(staker);
} else {
startBlock += currentStake / maintenanceStakePerBlock;
staker = nextMaintenanceStaker[staker];
currentStake = getMaintenanceStakerStake(staker);
}
and can be refactored to:

if (maintenanceStakePerBlock <= currentStake) {
startBlock += currentStake / maintenanceStakePerBlock;
}
staker = nextMaintenanceStaker[staker];
currentStake = getMaintenanceStakerStake(staker);

## [[N-17] [INFO] Misleading revert messages](https://github.com/code-423n4/marginswap-findings/issues/48)

This is FYI, not a real issue as you have expressed your interest in minor improvement suggestions (not security or gas related):

There are misleading revert messages, for example: "Calling contract not authorized to deposit" on functions like registerUnwind or registerCloseAccount.

0x523B5b2Cc58A818667C22c862930B141f85d49DD

paulius.eth

pauliax6@gmail.com

## [[N-18] [INFO] setUpdateMaxPegAmount and setUpdateMinPegAmount do not check boundaries](https://github.com/code-423n4/marginswap-findings/issues/49)

This is FYI, not a real issue as you have expressed your interest in minor improvement suggestions (not security or gas related):

setUpdateMaxPegAmount should check that amount >= UPDATE_MIN_PEG_AMOUNT and setUpdateMinPegAmount should check that amount <= UPDATE_MAX_PEG_AMOUNT. But only owner can change these values so no real issue.

## [[N-19] [INFO] Optimize the inheritance tree](https://github.com/code-423n4/marginswap-findings/issues/50)

This is FYI, not a real issue as you have expressed your interest in minor improvement suggestions (not security or gas related):

Optimize the inheritance tree. For example:
contract Lending is
BaseLending,
HourlyBondSubscriptionLending,
BondLending,
...

abstract contract BondLending is BaseLending

abstract contract HourlyBondSubscriptionLending is BaseLending
so Lending already inherits BaseLending from BondLending and HourlyBondSubscriptionLending.

## [[N-20] [INFO] Inaccurate revert message in function deactivateIssuer](https://github.com/code-423n4/marginswap-findings/issues/51)

This is FYI, not a real issue as you have expressed your interest in minor improvement suggestions (not security or gas related):

Inaccurate revert message in function deactivateIssuer: "Address not authorized to activate issuers". Should be "deactivate".

## [[N-21] [INFO] allTranches array is unbounded](https://github.com/code-423n4/marginswap-findings/issues/52)

This is FYI, not a real issue as you have expressed your interest in minor improvement suggestions (not security or gas related):

Theoretically, allTranches array is unbounded so if it grows too large it would become impossible to iterate over it cuz of the block gas limit and function withdrawReward will fail. Make sure this does not happen.

### Comments:

**[werg commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/52#issuecomment-816345483):**

> Thanks, it won't

## [[N-22] [INFO] liquidators may be a subject of front-running attacks](https://github.com/code-423n4/marginswap-findings/issues/53)

This is FYI, not a real issue as you have expressed your interest in minor improvement suggestions (not security or gas related):

/// 3) Liquidators may not call from a contract address, to prevent extreme forms of
/// of front-running and other price manipulation.
Doesn't this mean that liquidators are a subject of front-running attacks? Bots can monitor the liquidation txs and replicate them by sending the same tx data from their EOA.

pauliax6@gmail.com

paulius.eth

0x523B5b2Cc58A818667C22c862930B141f85d49DD

### Comments:

**[werg commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/53#issuecomment-816345217):**

> Yes, this is an unfortunate cost of using the current stock of AMMs. Hence we can only use well-capitalized pairs. Future versions will deal with this more cleanly.

# Gas Optimizations

## [[G-01] [Gas] Error codes](https://github.com/code-423n4/marginswap-findings/issues/54)

Gas optimization suggestion:

If you want to reduce the deployment costs, consider using error codes as error messages. Now on revert, it returns long messages like "Contract not authorized to deposit for user". Longer messages need more space so a possible optimization is to store error codes (e.g. "F1") and map them with messages on the UI part.

pauliax6@gmail.com

paulius.eth

0x523B5b2Cc58A818667C22c862930B141f85d49DD

## [[G-02] [Gas] same calculations are done twice](https://github.com/code-423n4/marginswap-findings/issues/55)

Gas optimization suggestion:

contract CrossMarginLiquidation, here the same calculations are done twice:
(peg2targetCost \* (100 + MAINTAINER_CUT_PERCENT)) / 100
it would be better to extract it into a variable and use it instead. Same here:
emit LiquidationShortfall(liquidationTarget - liquidationReturns);
Lending(lending()).haircut(liquidationTarget - liquidationReturns);

pauliax6@gmail.com

paulius.eth

0x523B5b2Cc58A818667C22c862930B141f85d49DD

## [[G-03] [Gas] unused variables](https://github.com/code-423n4/marginswap-findings/issues/56)

Gas optimization suggestion:

Contract RoleAware has a role that is not used anywhere:
uint256 constant TOKEN_ADMIN = 109;
contract IsolatedMarginTrading has variables that are not used anywhere:

/// update window in blocks
uint16 public priceUpdateWindow = 8;
uint256 public UPDATE_RATE_PERMIL = 80;
Variables with the same name are declared and used in contract PriceAware.

Contract IsolatedMarginAccounts has a variable that is not used anywhere: coolingOffPeriod. Variable with the same name is used in CrossMarginTrading.

Another not used variable:
uint256 public borrowingMarkupFP;

### Comments:

**[werg commented](https://github.com/code-423n4/2021-04-marginswap-findings/issues/56#issuecomment-816328966):**

> TOKEN_ADMIN is used in other parts of the codebase related to initialization, not presented here.

## [[G-04] [Gas] only process value if amount is greater than 0](https://github.com/code-423n4/marginswap-findings/issues/57)

Gas optimization suggestion:

There are places that do not check if the amount is greater than 0. If the amount is 0 it still performs useless calculations (e.g. adding 0 to the total balance, etc). An example where checking against 0 could save some gas (calls \_registerDeposit even when addedHolding is 0):
// no overflow because depositAmount >= extinguishableDebt
uint256 addedHolding = depositAmount - extinguishableDebt;
\_registerDeposit(account, token, addedHolding);
or here function \_withdrawBond may return 0 when there is a liquidity issue:

uint256 withdrawAmount = super.\_withdrawBond(bondId, bond);
disburse(bond.issuer, msg.sender, withdrawAmount);

0x523B5b2Cc58A818667C22c862930B141f85d49DD

paulius.eth

pauliax6@gmail.com

## [[G-05] [Gas] Not used imports](https://github.com/code-423n4/marginswap-findings/issues/58)

Gas optimization suggestion:

Not used imports: Contracts CrossMarginAccounts and CrossMarginTrading import "./MarginRouter.sol"; but do not use it. Contract Admin import "./CrossMarginTrading.sol"; Also unused imports in several contracts:
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

0x523B5b2Cc58A818667C22c862930B141f85d49DD

paulius.eth

pauliax6@gmail.com

## [[G-06] [Gas] Extract storage variable to a memory variable](https://github.com/code-423n4/marginswap-findings/issues/59)

Gas optimization suggestion:

Storage access is expensive. holdingTokens length can be extracted into a variable and used where necessary to reduce the number of storage read. change this:
holdingTokens = account.holdingTokens;
holdingAmounts = new uint256[](account.holdingTokens.length);
for (uint256 idx = 0; holdingTokens.length > idx; idx++)
to this:
holdingTokens = account.holdingTokens;
uint holdingTokensLength = holdingTokens.length;
holdingAmounts = new uint256[](holdingTokensLength);
for (uint256 idx = 0; holdingTokensLength > idx; idx++)

## [[G-07] [Gas] Do not send value if holdingsValue is 0](https://github.com/code-423n4/marginswap-findings/issues/60)

Gas optimization suggestion:

Here it is better to replace ">=" with ">" as sending 0 is a waste of gas (similar code is also used in CrossMarginLiquidation):
// send back trader money
if (holdingsValue >= maintainerCut4Account + account.borrowed) {
// send remaining funds back to trader
Fund(fund()).withdraw(
borrowToken,
traderAddress,
holdingsValue - account.borrowed - maintainerCut4Account
);
}

0x523B5b2Cc58A818667C22c862930B141f85d49DD

paulius.eth

pauliax6@gmail.com

## [[G-08] [Gas] Useless addition of 0](https://github.com/code-423n4/marginswap-findings/issues/62)

Gas optimization suggestion:

Useless addition of 0 here:
return bond.amount + 0;

0x523B5b2Cc58A818667C22c862930B141f85d49DD

paulius.eth

pauliax6@gmail.com
