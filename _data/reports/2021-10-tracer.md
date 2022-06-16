---
sponsor: "Tracer"
slug: "2021-10-tracer"
date: "2021-11-15"  
title: "Tracer contest"
findings: "https://github.com/code-423n4/2021-10-tracer-findings/issues"
contest: 40
---

# Overview

## About C4

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 code contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the code contest outlined in this document, C4 conducted an analysis of Tracer's smart contract system written in Solidity. The code contest took place between October 7—October 13 2021.

## Wardens

6 Wardens contributed reports to the Tracer contest code contest:

1. [cmichel](https://twitter.com/cmichelio)
1. [WatchPug](https://twitter.com/WatchPug_)
1. [loop](https://twitter.com/loop_225)
1. [pauliax](https://twitter.com/SolidityDev)
1. [ye0lde](https://twitter.com/_ye0lde)
1. [AC0611](https://twitter.com/artemcherba)

This contest was judged by [Alex the Entreprenerd](https://twitter.com/GalloDaSballo).

Final report assembled by [itsmetechjay](https://twitter.com/itsmetechjay) and [CloudEllie](https://twitter.com/CloudEllie1).

# Summary

The C4 analysis yielded an aggregated total of 7 unique vulnerabilities and 29 total findings. All of the issues presented here are linked back to their original finding.

Of these vulnerabilities, 0 received a risk rating in the category of HIGH severity, 3 received a risk rating in the category of MEDIUM severity, and 4 received a risk rating in the category of LOW severity.

C4 analysis also identified 11 non-critical recommendations and 11 gas optimizations.

# Scope

The code under review can be found within the [C4 Tracer contest repository](https://github.com/code-423n4/2021-10-tracer), and is composed of 22 smart contracts written in the Solidity programming language and includes 1,365 lines of Solidity code and 0 lines of JavaScript.

# Severity Criteria

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

- Malicious Input Handling
- Escalation of privileges
- Arithmetic
- Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code423n4.com).


# Medium Risk Findings (3)
## [[M-01] Wrong keeper reward computation](https://github.com/code-423n4/2021-10-tracer-findings/issues/23)
_Submitted by cmichel_.

The `PoolKeeper.keeperReward` computation mixes WADs and Quads which leads to issues.

1.  Note that `keeperTip` returns values where `1` = `1%`, and `100 = 100%`, the same way `BASE_TIP = 5 = 5%`. Thus `_tipPercent = ABDKMathQuad.fromUInt(keeperTip)` is a Quad value of this keeper tip, and not in "wad units" as the comment above it says.

```solidity
// @audit 👇 this comment is not correct, it's in Quad units
// tip percent in wad units
bytes16 _tipPercent = ABDKMathQuad.fromUInt(keeperTip(_savedPreviousUpdatedTimestamp, _poolInterval));
```

2.  Now the `wadRewardValue` interprets `_tipPercent` as a WAD + Quad value which ultimately leads to significantly fewer keeper rewards:

It tries to compute `_keeperGas + _keeperGas * _tipPercent` and to compute `_keeperGas * _tipPercent` it does a wrong division by `fixedPoint` (1e18 as a quad value) because it thinks the `_tipPercent` is a WAD value (100%=1e18) as a quad, when indeed `100%=100`. It seems like it should divide by `100` as a quad instead.
```solidity
ABDKMathQuad.add(
    ABDKMathQuad.fromUInt(_keeperGas),
    // @audit there's no need to divide by fixedPoint, he wants _keeperGas * _tipPercent and _tipPercent is a quad quad_99 / quad_100
    ABDKMathQuad.div((ABDKMathQuad.mul(ABDKMathQuad.fromUInt(_keeperGas), _tipPercent)), ABDKMathQuad.fromUInt(100))
)
```
#### Impact

The keeper rewards are off as the `_keeperGas * _tipPercent` is divided by 1e18 instead of 1e2.
Keeper will just receive their `_keeperGas` cost but the tip part will be close to zero every time.

#### Recommended Mitigation Steps

Generally, I'd say the contract mixes quad and WAD units where it doesn't have to do it. Usually, you either use WAD or Quad math but not both at the same time.
This complicates the code.
I'd make `keeperTip()`  return a `byte16` Quad value as a percentage where `100% = ABDKMathQuad.fromUInt(1)`. This temporary float result can then be used in a different `ABDKMathQuad` computation.

Alternatively, divide by 100 as a quad instead of 1e18 as a quad because `_tipPercent` is not a WAD value, but simply a percentage where `1 = 1%`.

```solidity
ABDKMathQuad.add(
    ABDKMathQuad.fromUInt(_keeperGas),
    // @audit there's no need to divide by fixedPoint, he wants _keeperGas * _tipPercent and _tipPercent is a quad quad_99 / quad_100
    ABDKMathQuad.div((ABDKMathQuad.mul(ABDKMathQuad.fromUInt(_keeperGas), _tipPercent)), ABDKMathQuad.fromUInt(100))
)
```

**[mynameuhh (Tracer) confirmed](https://github.com/code-423n4/2021-10-tracer-findings/issues/23)**

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-10-tracer-findings/issues/23#issuecomment-955087515):**
 > Agree with the finding and its severity, great find.



## [[M-02] Deposits don't work with fee-on transfer tokens](https://github.com/code-423n4/2021-10-tracer-findings/issues/17)
_Submitted by cmichel_.

There are ERC20 tokens that may make certain customizations to their ERC20 contracts.
One type of these tokens is deflationary tokens that charge a certain fee for every `transfer()` or `transferFrom()`.
Others are rebasing tokens that increase in value over time like Aave's aTokens (`balanceOf` changes over time).

#### Impact

The `PoolCommiter.commit()` function will store the entire `amount` in the commitment but with fee-on-transfer tokens, fewer tokens will be transferred which leads to inconsistencies with the `pool.longBalance()` and in `uncommit`.

#### Recommended Mitigation Steps

One possible mitigation is to measure the asset change right before and after the asset-transferring routines


**[rogue developer (Tracer) disputed](https://github.com/code-423n4/2021-10-tracer-findings/issues/17#issuecomment-944009136):**
 > Only governance (a multisig) can deploy markets, and has complete say over what markets can be deployed (see the `onlyGov` modifier in `PoolFactory.sol#deployPool`). Because new markets being deployed would be done via proposal to the DAO, which include the collateral token being used in a proposed market, markets with fee-on transfer tokens like Aave's aTokens just won't be deployed. I think this is a fairly safe assumption to make and thus we're making it out of scope. In any case, the chances of this happening and slipping past everyone who votes in the proposals _and_ not being noticed extremely soon after a market is deployed are extremely low.

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-10-tracer-findings/issues/17#issuecomment-955088716):**
 > I think this is a valid finding, the warden has shown a way to tamper with the protocol, extracting value (as such medium severity)
> 
> In terms of mitigation, not using `feeOnTransfer` or `rebasing` tokens is completely legitimate.



## [[M-03] `uncommit` sends tokens to the wrong user](https://github.com/code-423n4/2021-10-tracer-findings/issues/19)
_Submitted by cmichel, also found by WatchPug_.

The `PoolCommitter._uncommit` function calls the `ILeveragedPool(leveragedPool).quoteTokenTransfer/mintTokens` function with `msg.sender`.
But in `_uncommit`'s case that's the **pool, not the commit owner**, see `onlyPool` modifier on `executeAllCommitments` which calls `_uncommit`.

#### Impact

Users lose all tokens from their commitments as they are sent / minted to the pool instead.

#### Recommended Mitigation Steps

Instead of `msg.sender`, use `_commit.owner`:

```solidity
// minting: return quote tokens to the commit owner
// @audit msg.sender is pool, should be _commit.owner
ILeveragedPool(leveragedPool).quoteTokenTransfer(msg.sender, _commit.amount);
// same with mint cases
```

**[rogue developer (Tracer) disagreed with severity](https://github.com/code-423n4/2021-10-tracer-findings/issues/19#issuecomment-945331001):**
 > This is a valid issue. However, it requires there to be an underlying bug in the contracts which would make the `executeCommitment` call in `executeAllCommitments` revert (as `_uncommit` is only called in that case). If the warden can find a way for `executeCommitment` to revert, we would consider this to be an issue of this severity but otherwise we disagree with the severity as it requires/needs to be paired with another bug in the contracts.
> 
> It's also worth noting that governance can rescue any funds (rather, quote/collateral tokens) from the `LeveragedPool` contract. So if there were to be a case where there was a bug in the contracts that led to `executeCommitment` reverting and the users having their mints (quote tokens sent back to the `LeveragedPool`), governance could pause the contracts, drain out the equivalent worth and set up another contract where users can burn their tokens/claim them; if they burned the tokens which later uncommitted, then governance could send them an equal amount in collateral tokens. On the same note, if a critical vulnerability in `executeCommitment` were to be happening whereby commits were being uncommitted, then governance could also pause the contracts, rescue the funds and do some combination of the efforts above to ensure users get the funds back securely.

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-10-tracer-findings/issues/19#issuecomment-955094840):**
 > Would setting up a commit such that this line will underflow
> https://github.com/tracer-protocol/perpetual-pools-contracts/blob/646360b0549962352fe0c3f5b214ff8b5f73ba51/contracts/implementation/PoolCommitter.sol#L305
> , causing a revert, be a way to cause the function to call `_uncommit` ?

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-10-tracer-findings/issues/19#issuecomment-955095206):**
 > Also, to clarify, you're saying you believe the code will never call `_uncommit` as it won't ever revert, right?

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-10-tracer-findings/issues/19#issuecomment-955097577):**
 > At this time I believe that if a user mistakenly commits more than the value in `shadowPools[_commitType]` they can cause a silent revert which will trigger the bug
> 
> I think only their own funds are at risk, and either passing along the original committer or storing it in the commitData would allow to safely return them their funds.
> 
> With the information I have this issue sits between medium and high severity, high severity because user funds are at risk, medium because:
> ```
> 2 — Med: Assets not at direct risk, but the function of the protocol or its availability could be impacted, or leak value with a hypothetical attack path with stated assumptions, but external requirements.
> ```
> 
> As of now I'll mark as medium and valid.
> 
> Will think it over the weekend
> 
> If the sponsor can let me know their take and reply to the questions above, that can help clarify the severity and validity

**[rogue developer (Tracer) commented](https://github.com/code-423n4/2021-10-tracer-findings/issues/19#issuecomment-955099303):**
 > > Would setting up a commit such that this line will underflow https://github.com/tracer-protocol/perpetual-pools-contracts/blob/646360b0549962352fe0c3f5b214ff8b5f73ba51/contracts/implementation/PoolCommitter.sol#L305 , causing a revert, be a way to cause the function to call _uncommit ?
> 
> @Alex the Entreprenerd No. `shadowPools` is a mapping of commit types to the sum of pool tokens to be burned (rather, to be executed because they've already been burned), or sum of collateral tokens to be used in minting that haven't been used for minting yet. `executeCommitment` can only be called on `Commit`'s, which are in the `commits` mapping, which can only be added to via the `commit` function where users have to commit to putting up collateral/burning their pool tokens, which is the function that increments `shadowPools`. I realise that sounds a bit convoluted, but basically `executeCommitment` and its `_commit` parameter has a direct dependency on users committing via the `commit` function, which increments `shadowPools` by the value of their commit (which they can't game -- their collateral tokens get sent to the `LeveragedPool` contract instantly and their tokens get burned instantly and they don't have access to those funds anymore). 
> 
> > Also, to clarify, you're saying you believe the code will never call `_uncommit` as it won't ever revert, right?
> 
> Yes, that's right. It is there as a fail-safe (so that if there was some bug in a commit that stopped a commit in the queue from being executed, it wouldn't stop the markets). We are refactoring this code nonetheless though.

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-10-tracer-findings/issues/19#issuecomment-955101993):**
 > Alright from this information I understand that the underflow idea can't happen (gas optimization there would be to use `unsafe` operations I guess)
> 
> I think given the system a refactoring to send the funds back is warranted
> 
> That said the fact that there seems to be no way to get a revert excludes the high severity.
> 
> That leaves us with the finding either being med or low risk
> 
> Low risk would be acceptable as the code doesn't work as it suggests (`_uncommit` is never executed, and if it did it wouldn't reimburse the user)
> 
> The alternative take is Medium: if `_uncommit` where executed it would cause in a loss of funds / funds stuck
> 
> As of now I'll leave it as med, while we don't have a way to trigger `_uncommit` we can still make the claim that if `_uncommit` where to run, it wouldn't reimburse the user

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-10-tracer-findings/issues/19#issuecomment-955108907):**
 > Going a little deeper for the sake of clarity:
> 
> The math library is programmed to never revert:
> https://github.com/tracer-protocol/perpetual-pools-contracts/blob/646360b0549962352fe0c3f5b214ff8b5f73ba51/contracts/implementation/PoolSwapLibrary.sol#L256
> 
> The amounts in commit are always greater than 0 so no revert there
> 
> 
> The pool.setter is innocuous
> 
> The only thing I found is the `pool.quoteTokenTransfer(_commit.owner, amountOut);`
> 
> If for an unfortunate reason the pool is drained from the quoteToken and the safeTransfer fail, then the function would revert
> 
> 
> On that note the way to perform this would be to use
> `    function setKeeper(address _keeper) external override onlyGov onlyUnpaused {`
> To change the keeper to a EOA / Malicious account
> 
> And then run
> `function payKeeperFromBalances(address to, uint256 amount)`
> with the full amount (or close to it) of `amount <= shortBalance + longBalance`
> 
> This seems to be a permissioned way (admin privilege) to rug funds from the LeveragedPool as well as enabling the `_uncommit` to be triggered
> 
> Given these findings (which I may misunderstand, so feel free to correct me) I highly recommend the sponsor to ensure there's a timelock for changing keeper
> Additionally (and I may be missing something) allowing `payKeeperFromBalances` to take an indiscriminate amount of funds may prove to be a rug vector the sponsor should consider eliminating.
> 
> I'm fairly confident the [math library](https://github.com/abdk-consulting/abdk-libraries-solidity/blob/master/ABDKMathQuad.sol) will never revert, even if you input a high fee, which means that while the end state may be unexpected, the function can be used to rug.
> 
> Highly recommend the sponsor to consider having caps on the `amount` parameter for [`payKeeperFromBalances`](https://github.com/tracer-protocol/perpetual-pools-contracts/blob/646360b0549962352fe0c3f5b214ff8b5f73ba51/contracts/implementation/LeveragedPool.sol#L111) as this function seems to be the way to break the protocol (and the trust of the users)
> 

**[rogue developer (Tracer) commented](https://github.com/code-423n4/2021-10-tracer-findings/issues/19#issuecomment-955112942):**
 > @Alex the Entreprenerd Yep, that's completely right. However (and this is something we should have made clear in an assumptions section), all markets will be deployed by the DAO/DAO multisig. You can see that the `payKeeperFromBalances` function has a modifier called `onlyGov` -- meaning only governance (the DAO/DAO multisig) can change this and that's something that's immutable and can't be changed. Governance also has the ability to take quote tokens out of the `LeveragedPool` contract (with `withdrawQuote`) unlike the hack with changing the keeper (more directly this way) but we've been going under the assumption that the only reason we'd do this is in the rescue of user funds in the case of some hack. 
> 
> If the governance multisig is compromised, they have the ability to do a lot of damage but we've been going under the assumption this just won't be the case, which I think is a safe one to make. So you're right in that `uncommit` can send tokens to the wrong user in case the function reverts because of governance draining funds directly or via setting a malicious keeper, but I think that `uncommit` sending tokens to the wrong user is the least of problems if that happens because governance would only ever drain funds in the case of a major hack. If we're going under the assumption that the multisig _can_ easily be compromised, then the "centralisation" point around the DAO would be a much bigger point. 
> 
> I still think this should be a low/information by virtue of the fact that unless there is an underlying bug in the contracts, `uncommit` can't be called (it may as well be dead code) -- if it gets called because governance has rugged, that is then relatively a fairly small problem because all the funds would be at risk in a much more direct way in that case.

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-10-tracer-findings/issues/19#issuecomment-955115864):**
 > @rogue developer agree that if governance is malicious, the `_uncommit` path is the least problem
> 
> One thing to note is that the `keeper` has the ability of trying to claim a lot of fees, and the modifier seems to be `onlyKeeper` if the keeper were to be a bot, or a human operator they would have the ability of rugging, unless the parameter `amount` was under some check (let's say less than 1% AUM or something)
> 
> I agree that you can set to the `PoolKeeper` contract which seems safe, once potential rug vector, again from governance would be to inject a high `gasPrice` via `setGasPrice` which as a `onlyOwner` modifier
> 
> Contract for PoolKeeper:
> https://arbiscan.io/address/0x759E817F0C40B11C775d1071d466B5ff5c6ce28e#code
> 
> The owner is the Dev Multisig:
> https://arbiscan.io/address/0x0f79e82ae88e1318b8cfc8b4a205fe2f982b928a#readContract
> 
> This does give the Dev Multisig admin privileges and a potential for griefing at the very least if not rugging, as they could raise the gas price, and then run `performUpkeepSinglePool` which would eventually call `payKeeperFromBalances`
> 
> That said, this is something I'm flagging up right now and outside of the contest

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-10-tracer-findings/issues/19#issuecomment-955116449):**
 > As per the finding at this point I believe it's valid and at medium severity, it is not high severity due to need for existing preconditions that are not "usual", see definition from Gitbook:
> `
> 2 — Med: Assets not at direct risk, but the function of the protocol or its availability could be impacted, or leak value with a hypothetical attack path with stated assumptions, but external requirements.
> `
> 
> We can agree that the pre-condition here are drastic and this finding would be the last of the protocols problems
> 
> In terms of mitigation, ensuring that the funds are send back to the address that initiated the commit are more than sufficient

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-10-tracer-findings/issues/19#issuecomment-955116649):**
 > Per the "multisig privileges" above, I recommend you replace `owner` on the poolKeeper with a TimeLock as in it's current state, the gasPrice may be a way to rug funds from depositors

# Low Risk Findings (4)
- [[L-01] Contradiction in comment/require statement](https://github.com/code-423n4/2021-10-tracer-findings/issues/7) _Submitted by loop_.
- [[L-02] No ERC20 `safeApprove` versions called](https://github.com/code-423n4/2021-10-tracer-findings/issues/20) _Submitted by cmichel_.
- [[L-03] Revert in `poolUpkeep`](https://github.com/code-423n4/2021-10-tracer-findings/issues/13) _Submitted by cmichel_.
- [[L-04] `PoolKeeper.sol#performUpkeepSinglePool()` Wrong implementation allows attacker to interfere the upkeep of pools](https://github.com/code-423n4/2021-10-tracer-findings/issues/26) _Submitted by WatchPug_.

# Non-Critical Findings (11)
- [[N-01] Unused imports](https://github.com/code-423n4/2021-10-tracer-findings/issues/33) _Submitted by pauliax_.
- [[N-02] No constant for maximum tip (PoolKeeper.sol)](https://github.com/code-423n4/2021-10-tracer-findings/issues/5) _Submitted by ye0lde_.
- [[N-03] Unused modifer "onlyFeeReceiver" in LeveragedPool.sol](https://github.com/code-423n4/2021-10-tracer-findings/issues/4) _Submitted by ye0lde_.
- [[N-04] Unused local variable in  _latestRoundData (ChainlinkOracleWrapper.sol)](https://github.com/code-423n4/2021-10-tracer-findings/issues/2) _Submitted by ye0lde_.
- [[N-05] Style issues](https://github.com/code-423n4/2021-10-tracer-findings/issues/38) _Submitted by pauliax_.
- [[N-06] Inclusive check of frontRunning > updateInterval](https://github.com/code-423n4/2021-10-tracer-findings/issues/29) _Submitted by pauliax_.
- [[N-07] PoolKeeper _gasPrice description says in ETH, but is calculated in wei](https://github.com/code-423n4/2021-10-tracer-findings/issues/9) _Submitted by loop_.
- [[N-08] BLOCK_TIME of Arbitrum is less than 13 seconds](https://github.com/code-423n4/2021-10-tracer-findings/issues/30) _Submitted by pauliax_.
- [[N-09] Validate max fee](https://github.com/code-423n4/2021-10-tracer-findings/issues/21) _Submitted by cmichel_.
- [[N-10] Unsafe `int256` casts in `executePriceChange`](https://github.com/code-423n4/2021-10-tracer-findings/issues/14) _Submitted by cmichel_.
- [[N-11] Missing parameter validation](https://github.com/code-423n4/2021-10-tracer-findings/issues/11) _Submitted by cmichel, also found by loop_.

# Gas Optimizations (12)
- [[G-01] Unused Named Returns Can Be Removed](https://github.com/code-423n4/2021-10-tracer-findings/issues/6) _Submitted by ye0lde_.
- [[G-02] Minimize Storage Slots (LeveragedPool.sol)](https://github.com/code-423n4/2021-10-tracer-findings/issues/3) _Submitted by ye0lde_.
- [[G-03] token out of range check can be simplified](https://github.com/code-423n4/2021-10-tracer-findings/issues/37) _Submitted by pauliax_.
- [[G-04] Useless multiplication by 1](https://github.com/code-423n4/2021-10-tracer-findings/issues/36) _Submitted by pauliax_.
- [[G-05] Adding unchecked directive can save gas](https://github.com/code-423n4/2021-10-tracer-findings/issues/27) _Submitted by WatchPug, also found by pauliax_.
- [[G-06] Immutable state variables](https://github.com/code-423n4/2021-10-tracer-findings/issues/32) _Submitted by pauliax_.
- [[G-07] Unused state variables](https://github.com/code-423n4/2021-10-tracer-findings/issues/31) _Submitted by pauliax_.
- [[G-08] LeveragedPool has require statements which are also checked in library](https://github.com/code-423n4/2021-10-tracer-findings/issues/10) _Submitted by loop_.
- [[G-09] Gas: Inefficient modulo computation](https://github.com/code-423n4/2021-10-tracer-findings/issues/22) _Submitted by cmichel_.
- [[G-10] Gas: `transferGovernance` can save an sload](https://github.com/code-423n4/2021-10-tracer-findings/issues/16) _Submitted by cmichel_.
- [[G-11] Gas: shadow pools are only required for burn types](https://github.com/code-423n4/2021-10-tracer-findings/issues/12) _Submitted by cmichel_.

# Disclosures

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.
