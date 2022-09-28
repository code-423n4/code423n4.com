---
sponsor: "bunker.finance"
slug: "2022-05-bunker"
date: "2022-07-25"
title: "bunker.finance contest"
findings: "https://github.com/code-423n4/2022-05-bunker-findings/issues"
contest: 117
---

# Overview

## About C4

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the bunker.finance smart contract system written in Solidity. The audit contest took place between May 3—May 7 2022.

## Wardens

54 Wardens contributed reports to the bunker.finance contest:

  1. [leastwood](https://twitter.com/liam_eastwood13)
  1. hubble (ksk2345 and shri4net)
  1. BowTiedWardens (BowTiedHeron, BowTiedPickle, [m4rio_eth](BowTiedETHernal), [Dravee](https://twitter.com/JustDravee), and BowTiedFirefox)
  1. sorrynotsorry
  1. IllIllI
  1. 0xDjango
  1. GimelSec ([rayn](https://twitter.com/rayn731) and sces60107)
  1. oyc_109
  1. 0x1f8b
  1. [throttle](https://twitter.com/Throt7le)
  1. robee
  1. kebabsec (okkothejawa and [FlameHorizon](https://twitter.com/FlameHorizon1))
  1. [0xNazgul](https://twitter.com/0xNazgul)
  1. [ellahi](https://twitter.com/ellahinator)
  1. hake
  1. [Ruhum](https://twitter.com/0xruhum)
  1. tintin
  1. cccz
  1. [joestakey](https://twitter.com/JoeStakey)
  1. [Picodes](https://twitter.com/thePicodes)
  1. TerrierLover
  1. delfin454000
  1. samruna
  1. 0x4non
  1. [fatherOfBlocks](https://twitter.com/father0fBl0cks)
  1. simon135
  1. [Funen](https://instagram.com/vanensurya)
  1. ilan
  1. 0x1337
  1. dirk_y
  1. hyh
  1. [bobi](https://twitter.com/VladToie/)
  1. [David_](https://twitter.com/davidpius10)
  1. [WatchPug](https://twitter.com/WatchPug_) ([jtp](https://github.com/jack-the-pug) and [ming](https://github.com/mingwatch))
  1. cryptphi
  1. [csanuragjain](https://twitter.com/csanuragjain)
  1. jayjonah8
  1. slywaters
  1. [0v3rf10w](https://twitter.com/_0v3rf10w)
  1. 0xkatana
  1. Cityscape
  1. [hansfriese](https://twitter.com/hansfriese)
  1. [rfa](https://www.instagram.com/riyan_rfa/)
  1. [Tomio](https://twitter.com/meidhiwirara)
  1. [MaratCerby](https://twitter.com/MaratCerby)
  1. [Fitraldys](https://twitter.com/fitraldys)

This contest was judged by [gzeon](https://twitter.com/gzeon).

Final report assembled by [liveactionllama](https://twitter.com/liveactionllama).

# Summary

The C4 analysis yielded an aggregated total of 4 unique vulnerabilities. Of these vulnerabilities, 0 received a risk rating in the category of HIGH severity and 4 received a risk rating in the category of MEDIUM severity.

Additionally, C4 analysis included 30 reports detailing issues with a risk rating of LOW severity or non-critical. There were also 29 reports recommending gas optimizations.

All of the issues presented here are linked back to their original finding.

# Scope

The code under review can be found within the [C4 bunker.finance contest repository](https://github.com/code-423n4/2022-05-bunker), and is composed of 9 smart contracts written in the Solidity programming language and includes 3,214 lines of Solidity code.

# Severity Criteria

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low/non-critical.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

- Malicious Input Handling
- Escalation of privileges
- Arithmetic
- Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code4rena.com).

# Medium Risk Findings (4)
## [[M-01] `CNft.sol` - revert inside `safeTransferFrom` will break composability & standard behaviour](https://github.com/code-423n4/2022-05-bunker-findings/issues/93)
_Submitted by hubble_

[CNft.sol#L204](https://github.com/bunkerfinance/bunker-protocol/blob/752126094691e7457d08fc62a6a5006df59bd2fe/contracts/CNft.sol#L204)<br>

The function safeTransferFrom is a standard interface in ERC1155, and its expected to succeed if all the parametes are valid, and revert on error, which is not the case here so its a deviation.

Refer to the EIP-1155 safeTransferFrom rules:

> MUST revert if \_to is the zero address.<br>
> MUST revert if balance of holder for token \_id is lower than the \_value sent to the recipient.<br>
> MUST revert on any other error.<br>

There is no loss of assets, but the assets or tokens and CNft contract can be unusable by other protocols, and likelihood & impact of this issue is high.

### Impact

If other protocols want to integrate CNft, then in that case just for CNft Contract / tokens, they have to take exception and use safeBatchTransferFrom, instead of safeTransferFrom. If they dont take care of this exception, then their protocol functions will fail while using CNft, even if valid values are given.

### Proof of Concept

Contract : CNft.sol<br>
Function : safeTransferFrom

> Line 204   revert("CNFT: Use safeBatchTransferFrom instead");

### Recommended Mitigation Steps

Instead of revert, call function safeBatchTransferFrom with 1 item in the array, e.g.,

> safeBatchTransferFrom(from, to, \[id], \[amount], data)

**[bunkerfinance-dev (bunker.finance) confirmed, but disagreed with High severity and commented](https://github.com/code-423n4/2022-05-bunker-findings/issues/93#issuecomment-1129622001):**
 > We can fix this, but we do not feel like this is high severity at all.

**[gzeon (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-05-bunker-findings/issues/93#issuecomment-1140430665):**
 > I think this is a Med Risk issue as it impacts the function of the protocol.



***

## [[M-02] Chainlink pricer is using a deprecated API](https://github.com/code-423n4/2022-05-bunker-findings/issues/1)
*Submitted by cccz, also found by 0x1f8b, 0xDjango, 0xNazgul, GimelSec, hake, IllIllI, kebabsec, oyc_109, Ruhum, sorrynotsorry, throttle, and tintin*

According to Chainlink's documentation, the latestAnswer function is deprecated. This function might suddenly stop working if Chainlink stop supporting deprecated APIs. And the old API can return stale data.

### Proof of Concept

[PriceOracleImplementation.sol#L29-L30](https://github.com/bunkerfinance/bunker-protocol/blob/752126094691e7457d08fc62a6a5006df59bd2fe/contracts/PriceOracleImplementation.sol#L29-L30)<br>

### Recommended Mitigation Steps

Use the latestRoundData function to get the price instead. Add checks on the return data with proper revert messages if the price is stale or the round is uncomplete
<https://docs.chain.link/docs/price-feeds-api-reference/>

**[bunkerfinance-dev (bunker.finance) confirmed](https://github.com/code-423n4/2022-05-bunker-findings/issues/1)**



***

## [[M-03] `call()` should be used instead of `transfer()` on an `address payable`](https://github.com/code-423n4/2022-05-bunker-findings/issues/116)
_Submitted by BowTiedWardens, also found by leastwood and sorrynotsorry_

This is a classic Code4rena issue:

*   <https://github.com/code-423n4/2021-04-meebits-findings/issues/2>
*   <https://github.com/code-423n4/2021-10-tally-findings/issues/20>
*   <https://github.com/code-423n4/2022-01-openleverage-findings/issues/75>

### Impact

The use of the deprecated `transfer()` function for an address will inevitably make the transaction fail when:

1.  The claimer smart contract does not implement a payable function.
2.  The claimer smart contract does implement a payable fallback which uses more than 2300 gas unit.
3.  The claimer smart contract implements a payable fallback function that needs less than 2300 gas units but is called through proxy, raising the call's gas usage above 2300.

Additionally, using higher than 2300 gas might be mandatory for some multisig wallets.

### Impacted lines

```solidity
CEther.sol:167:        to.transfer(amount);
```

### Recommended Mitigation Steps

Use `call()` instead of `transfer()`, but be sure to implement CEI patterns in CEther and add a global state lock on the comptroller as per Rari.

THIS HAS REKT COMPOUND FORKS BEFORE!!!

Relevant links:<br>
<https://twitter.com/hacxyk/status/1520715516490379264?s=21&t=fnhDkcC3KpE_kJE8eLiE2A><br>
<https://twitter.com/hacxyk/status/1520715536325218304?s=21&t=fnhDkcC3KpE_kJE8eLiE2A><br>
<https://twitter.com/hacxyk/status/1520370441705037824?s=21&t=fnhDkcC3KpE_kJE8eLiE2A><br>
<https://twitter.com/Hacxyk/status/1521949933380595712><br>

**[bunkerfinance-dev (bunker.finance) acknowledged and commented](https://github.com/code-423n4/2022-05-bunker-findings/issues/116#issuecomment-1129628697):**
 > We agree that this can make the protocol hard to use if the claimer is a smart contract. This bug needs to be fixed with great care, so we will hold off on fixing this for now.



***

## [[M-04] `COMP` Distributions Can Be Manipulated And Duplicated Across Any Number Of Accounts](https://github.com/code-423n4/2022-05-bunker-findings/issues/105)
_Submitted by leastwood_

[Comptroller.sol#L240-L242](https://github.com/bunkerfinance/bunker-protocol/blob/752126094691e7457d08fc62a6a5006df59bd2fe/contracts/Comptroller.sol#L240-L242)<br>
[Comptroller.sol#L260-L262](https://github.com/bunkerfinance/bunker-protocol/blob/752126094691e7457d08fc62a6a5006df59bd2fe/contracts/Comptroller.sol#L260-L262)<br>
[Comptroller.sol#L469-L472](https://github.com/bunkerfinance/bunker-protocol/blob/752126094691e7457d08fc62a6a5006df59bd2fe/contracts/Comptroller.sol#L469-L472)<br>
[Comptroller.sol#L496-L499](https://github.com/bunkerfinance/bunker-protocol/blob/752126094691e7457d08fc62a6a5006df59bd2fe/contracts/Comptroller.sol#L496-L499)<br>
[Comptroller.sol#L1139-L1155](https://github.com/bunkerfinance/bunker-protocol/blob/752126094691e7457d08fc62a6a5006df59bd2fe/contracts/Comptroller.sol#L1139-L1155)<br>
[Comptroller.sol#L1222-L1243](https://github.com/bunkerfinance/bunker-protocol/blob/752126094691e7457d08fc62a6a5006df59bd2fe/contracts/Comptroller.sol#L1222-L1243)<br>

The `updateCompSupplyIndex()` and `distributeSupplierComp()` functions are used by Compound to track distributions owed to users for supplying funds to the protocol. Bunker protocol is a fork of compound with NFT integration, however, part of the original functionality appears to have been mistakenly commented out. As a result, whenever users enter or exit the protocol, `COMP` distributions will not be correctly calculated for suppliers. At first glance, its possible that this was intended, however, there is nothing stated in the docs that seems to indicate such. Additionally, the `COMP` distribution functionality has not been commented out for borrowers. Therefore, tokens will still be distributed for borrowers.

Both the `updateCompSupplyIndex()` and `updateCompBorrowIndex()` functions operate on the same `compSpeeds` value which dictates how many tokens are distributed on each block. Therefore, you cannot directly disable the functionality of supplier distributions without altering how distributions are calculated for borrowers. Because of this, suppliers can manipulate their yield by supplying tokens, calling `updateCompSupplyIndex()` and `distributeSupplierComp()`, removing their tokens and repeating the same process on other accounts. This completely breaks all yield distributions and there is currently no way to upgrade the contracts to alter the contract's behaviour. Tokens can be claimed by redepositing in a previously "checkpointed" account, calling `claimComp()` and removing tokens before re-supplying on another account.

### Recommended Mitigation Steps

Consider commenting all behaviour associated with token distributions if token distributions are not meant to be supported. Otherwise, it is worthwhile uncommenting all occurrences of the `updateCompSupplyIndex()` and `distributeSupplierComp()` functions.

**[bunkerfinance-dev (bunker.finance) acknowledged, but disagreed with High severity and commented](https://github.com/code-423n4/2022-05-bunker-findings/issues/105#issuecomment-1129626056):**
 > We are not going to use the COMP code. We could fix documentation or comment more code to make this clearer though.

**[gzeon (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-05-bunker-findings/issues/105#issuecomment-1140432093):**
 > Comptroller.sol is [in scope](https://github.com/code-423n4/2022-05-bunker) of this contest, and there are no indication that token distribution will be disabled despite the sponsor claim they are not going to use the $COMP code. However, it is also true the deployment setup within contest repo lack the deployment of $COMP and its distribution. I believe this is a valid Med Risk issue given fund(reward token) can be lost in certain assumptions.



***

# Low Risk and Non-Critical Issues

For this contest, 30 reports were submitted by wardens detailing low risk and non-critical issues. The [report highlighted below](https://github.com/code-423n4/2022-05-bunker-findings/issues/120) by **BowTiedWardens** received the top score from the judge.

*The following wardens also submitted reports: [IllIllI](https://github.com/code-423n4/2022-05-bunker-findings/issues/26), [sorrynotsorry](https://github.com/code-423n4/2022-05-bunker-findings/issues/94), [robee](https://github.com/code-423n4/2022-05-bunker-findings/issues/103), [ellahi](https://github.com/code-423n4/2022-05-bunker-findings/issues/90), [0xDjango](https://github.com/code-423n4/2022-05-bunker-findings/issues/77), [GimelSec](https://github.com/code-423n4/2022-05-bunker-findings/issues/82), [Picodes](https://github.com/code-423n4/2022-05-bunker-findings/issues/68), [0x1337](https://github.com/code-423n4/2022-05-bunker-findings/issues/53), [dirk_y](https://github.com/code-423n4/2022-05-bunker-findings/issues/72), [hyh](https://github.com/code-423n4/2022-05-bunker-findings/issues/70), [leastwood](https://github.com/code-423n4/2022-05-bunker-findings/issues/111), [samruna](https://github.com/code-423n4/2022-05-bunker-findings/issues/4), [TerrierLover](https://github.com/code-423n4/2022-05-bunker-findings/issues/64), [0x4non](https://github.com/code-423n4/2022-05-bunker-findings/issues/62), [bobi](https://github.com/code-423n4/2022-05-bunker-findings/issues/84), [David_](https://github.com/code-423n4/2022-05-bunker-findings/issues/50), [fatherOfBlocks](https://github.com/code-423n4/2022-05-bunker-findings/issues/57), [WatchPug](https://github.com/code-423n4/2022-05-bunker-findings/issues/79), [0x1f8b](https://github.com/code-423n4/2022-05-bunker-findings/issues/18), [cryptphi](https://github.com/code-423n4/2022-05-bunker-findings/issues/112), [csanuragjain](https://github.com/code-423n4/2022-05-bunker-findings/issues/37), [delfin454000](https://github.com/code-423n4/2022-05-bunker-findings/issues/121), [Funen](https://github.com/code-423n4/2022-05-bunker-findings/issues/97), [ilan](https://github.com/code-423n4/2022-05-bunker-findings/issues/123), [jayjonah8](https://github.com/code-423n4/2022-05-bunker-findings/issues/42), [kebabsec](https://github.com/code-423n4/2022-05-bunker-findings/issues/108), [oyc_109](https://github.com/code-423n4/2022-05-bunker-findings/issues/29), [simon135](https://github.com/code-423n4/2022-05-bunker-findings/issues/34), and [throttle](https://github.com/code-423n4/2022-05-bunker-findings/issues/87).*

## Table of Contents

See [original submission](https://github.com/code-423n4/2022-05-bunker-findings/issues/120).

## \[L-01] Add constructor initializers

As per [OpenZeppelin’s (OZ) recommendation](https://forum.openzeppelin.com/t/uupsupgradeable-vulnerability-post-mortem/15680/6), “The guidelines are now to make it impossible for *anyone* to run `initialize` on an implementation contract, by adding an empty constructor with the `initializer` modifier. So the implementation contract gets initialized automatically upon deployment.”

Note that this behaviour is also incorporated the [OZ Wizard](https://wizard.openzeppelin.com/) since the UUPS vulnerability discovery: “Additionally, we modified the code generated by the [Wizard 19](https://wizard.openzeppelin.com/) to include a constructor that automatically initializes the implementation when deployed.”

Furthermore, this thwarts any attempts to frontrun the initialization tx of these contracts:

```solidity
contracts/CErc20.sol:
  25:     function initialize(address underlying_,
  
contracts/CNft.sol:
  17:     function initialize (
```

## \[L-02] Missing address(0) checks

Consider adding an `address(0)` check here:

```solidity
  - underlying = underlying_ (contracts/CErc20.sol#36)
  - pendingAdmin = newPendingAdmin (contracts/CToken.sol#1216)
  - admin = admin_ (contracts/CEther.sol#34)
  - admin = newAdmin (contracts/Comptroller.sol#733)
  - borrowCapGuardian = newBorrowCapGuardian (contracts/Comptroller.sol#966)
  - pauseGuardian = newPauseGuardian (contracts/Comptroller.sol#986)
  - admin = _admin (contracts/Oracles/CNftPriceOracle.sol#48)
  - uniswapV2Factory = _uniswapV2Factory (contracts/Oracles/CNftPriceOracle.sol#50)
  - baseToken = _baseToken (contracts/Oracles/CNftPriceOracle.sol#51)
  - admin = newAdmin (contracts/Oracles/CNftPriceOracle.sol#55)
```

## \[L-03] `Comptroller.sol#allMarkets`: an unbounded loop on array can lead to DoS

`CToken[] public allMarkets;` in `contract ComptrollerV3Storage` is an array where there are just pushes. No upper bound, no pop.

As this array can grow quite large, the transaction's gas cost could exceed the block gas limit and make it impossible to call this function at all here:

```solidity
File: Comptroller.sol
927:     function _addMarketInternal(address cToken) internal {
928:         for (uint i = 0; i < allMarkets.length; i ++) { //@audit low: unbounded loop
929:             require(allMarkets[i] != CToken(cToken), "market already added");
930:         }
931:         allMarkets.push(CToken(cToken));
932:     }
```

Consider introducing a reasonable upper limit based on block gas limits and adding a method to remove elements in the array.

## \[L-04] `CNft.sol` should implement a 2-step ownership transfer pattern

This contract inherits from OpenZeppelin's library and the `transferOwnership()` function is the default one (a one-step process). It's possible that the `onlyOwner` role mistakenly transfers ownership to a wrong address, resulting in a loss of the `onlyOwner` role (which is quite powerful given the power from `L274:function call`). Consider overriding the default `transferOwnership()` function to first nominate an address as the pending owner and implementing an `acceptOwnership()` function which is called by the pending owner to confirm the transfer.

## \[N-01] Comment says "public" instead of "external"

```solidity
File: CErc20.sol
131:     /**
132:      * @notice A public function to sweep accidental ERC-20 transfers to this contract. Tokens are sent to admin (timelock) //@audit should say external
133:      * @param token The address of the ERC-20 token to sweep
134:      */
135:     function sweepToken(EIP20NonStandardInterface token) external {
136:      require(address(token) != underlying, "CErc20::sweepToken: can not sweep underlying token");
137:      uint256 balance = token.balanceOf(address(this));
138:      token.transfer(admin, balance);
139:     }
```

## \[N-02] Prevent accidentally burning tokens

Transferring tokens to the zero address is usually prohibited to accidentally avoid "burning" tokens by sending them to an unrecoverable zero address.

Consider adding a check to prevent accidentally burning tokens here:

```solidity
File: CErc20.sol
207:     function doTransferOut(address payable to, uint amount) internal {
208:         EIP20NonStandardInterface token = EIP20NonStandardInterface(underlying);
209:         token.transfer(to, amount); //@audit low: avoid burning token
```

## \[N-03] `require()` should be used for checking error conditions on inputs and return values while `assert()` should be used for invariant checking

Properly functioning code should **never** reach a failing assert statement, unless there is a bug in your contract you should fix. Here, I believe the assert should be a require or a revert:

```solidity
contracts/Comptroller.sol:
  207:         assert(assetIndex < len);
  333:             assert(markets[cToken].accountMembership[borrower]); 
```

As the Solidity version is < 0.8.\* the remaining gas would not be refunded in case of failure.

## \[N-04] Avoid floating pragmas: the version should be locked

```solidity
contracts/CErc20.sol:
  1: pragma solidity ^0.5.16;

contracts/CEther.sol:
  1: pragma solidity ^0.5.16;

contracts/CNft.sol:
  2: pragma solidity ^0.8.0;

contracts/Comptroller.sol:
  1: pragma solidity ^0.5.16;

contracts/CToken.sol:
  1: pragma solidity ^0.5.16;

contracts/ERC1155Enumerable.sol:
  2: pragma solidity ^0.8.0;

contracts/PriceOracleImplementation.sol:
  1: pragma solidity ^0.5.16;

contracts/Oracles/CNftPriceOracle.sol:
  2: pragma solidity ^0.8.0;

contracts/Oracles/UniswapV2PriceOracle.sol:
  2: pragma solidity ^0.8.0;
```



***

# Gas Optimizations

For this contest, 29 reports were submitted by wardens detailing gas optimizations. The [report highlighted below](https://github.com/code-423n4/2022-05-bunker-findings/issues/118) by **BowTiedWardens** received the top score from the judge.

*The following wardens also submitted reports: [joestakey](https://github.com/code-423n4/2022-05-bunker-findings/issues/65), [IllIllI](https://github.com/code-423n4/2022-05-bunker-findings/issues/27), [robee](https://github.com/code-423n4/2022-05-bunker-findings/issues/104), [0xNazgul](https://github.com/code-423n4/2022-05-bunker-findings/issues/20), [delfin454000](https://github.com/code-423n4/2022-05-bunker-findings/issues/124), [ellahi](https://github.com/code-423n4/2022-05-bunker-findings/issues/89), [slywaters](https://github.com/code-423n4/2022-05-bunker-findings/issues/3), [TerrierLover](https://github.com/code-423n4/2022-05-bunker-findings/issues/63), [0v3rf10w](https://github.com/code-423n4/2022-05-bunker-findings/issues/117), [0x4non](https://github.com/code-423n4/2022-05-bunker-findings/issues/61), [0xkatana](https://github.com/code-423n4/2022-05-bunker-findings/issues/126), [Cityscape](https://github.com/code-423n4/2022-05-bunker-findings/issues/88), [fatherOfBlocks](https://github.com/code-423n4/2022-05-bunker-findings/issues/56), [hansfriese](https://github.com/code-423n4/2022-05-bunker-findings/issues/73), [oyc_109](https://github.com/code-423n4/2022-05-bunker-findings/issues/28), [rfa](https://github.com/code-423n4/2022-05-bunker-findings/issues/100), [samruna](https://github.com/code-423n4/2022-05-bunker-findings/issues/5), [simon135](https://github.com/code-423n4/2022-05-bunker-findings/issues/35), [Tomio](https://github.com/code-423n4/2022-05-bunker-findings/issues/99), [MaratCerby](https://github.com/code-423n4/2022-05-bunker-findings/issues/31), [0x1f8b](https://github.com/code-423n4/2022-05-bunker-findings/issues/17), [0xDjango](https://github.com/code-423n4/2022-05-bunker-findings/issues/78), [Fitraldys](https://github.com/code-423n4/2022-05-bunker-findings/issues/128), [Funen](https://github.com/code-423n4/2022-05-bunker-findings/issues/98), [GimelSec](https://github.com/code-423n4/2022-05-bunker-findings/issues/83), [ilan](https://github.com/code-423n4/2022-05-bunker-findings/issues/122), [Picodes](https://github.com/code-423n4/2022-05-bunker-findings/issues/67), and [throttle](https://github.com/code-423n4/2022-05-bunker-findings/issues/86).*

## Table of Contents

See [original submission](https://github.com/code-423n4/2022-05-bunker-findings/issues/118).

## [G-01] Copying a full array from storage to memory isn't optimal

Here, what's happening is a full copy of a storage array in memory, and then a second copy of each memory element in a CToken struct:

```solidity
File: Comptroller.sol
590:         CToken[] memory assets = accountAssets[account]; //@audit this here is a VERY expensive copy of a whole storage array in memory (as many SLOADs as there are elements)
591:         for (uint i = 0; i < assets.length; i++) {
592:             CToken asset = assets[i]; //@audit here is a copy of a memory value in a memory variable
```

The code should be optimized that way:

```solidity
        CToken[] storage assets = accountAssets[account]; //@audit using storage keyword vs memory
```

This way, the amount of MSTOREs gets divided by 2 and no MLOADs are then necessary

## [G-02] Help the optimizer by saving a storage variable's reference instead of repeatedly fetching it

To help the optimizer, declare a `storage` type variable and use it instead of repeatedly fetching the reference in a map or an array.

The effect can be quite significant.

As an example, instead of repeatedly calling `someMap[someIndex]`, save its reference like this: `SomeStruct storage someStruct = someMap[someIndex]` and use it.

Instances include (check the `@audit` tags):

```solidity
contracts/Comptroller.sol:
   268:         if (!markets[cToken].isListed) { //@audit gas: Should declare "Market storage _ctoken = markets[cToken]" and use it
   273:         if (cToken != address(nftMarket) && !markets[cToken].accountMembership[redeemer]) { //@audit gas: Should use suggested storage var _ctoken
   318:         if (!markets[cToken].isListed) { //@audit gas: Should declare "Market storage _ctoken = markets[cToken]" and use it
   322:         if (!markets[cToken].accountMembership[borrower]) { //@audit gas: Should use suggested storage var _ctoken
   333:             assert(markets[cToken].accountMembership[borrower]); //@audit gas: Should use suggested storage var _ctoken
  1067:             if (compSupplyState[address(cToken)].index == 0 && compSupplyState[address(cToken)].block == 0) { //@audit gas: should declare CompMarketState storage _compMarketState = compSupplyState[address(cToken)]; and use it
  1068:                 compSupplyState[address(cToken)] = CompMarketState({  //@audit gas: should write with suggested _compMarketState.index = compInitialIndex and _compMarketState.block = safe32(getBlockNumber(), "block number exceeds 32 bits")
  1074:             if (compBorrowState[address(cToken)].index == 0 && compBorrowState[address(cToken)].block == 0) {//@audit gas: should use suggested _compMarketState
  1075:                 compBorrowState[address(cToken)] = CompMarketState({//@audit gas: should use suggested _compMarketState
  1345:         if (markets[address(cNft)].isListed) { //@audit should declare Market storage _market = markets[address(cNft)]; and use it
  1355:         markets[address(cNft)] = Market({isListed: true, isComped: false, collateralFactorMantissa: _collateralFactorMantissa}); // @audit should use suggested _market

```

## [G-03] Caching storage values in memory

The code can be optimized by minimising the number of SLOADs. SLOADs are expensive (100 gas) compared to MLOADs/MSTOREs (3 gas). Here, storage values should get cached in memory (see the `@audit` tags for further details):

```solidity
contracts/CErc20.sol:
   37:         EIP20Interface(underlying).totalSupply(); //@audit gas: should use underlying_ to avoid an SLOAD
  172:         EIP20NonStandardInterface token = EIP20NonStandardInterface(underlying); //@audit gas: should cache underlying
  173:         uint balanceBefore = EIP20Interface(underlying).balanceOf(address(this)); //@audit gas: should use cached underlying
  193:         uint balanceAfter = EIP20Interface(underlying).balanceOf(address(this)); //@audit gas: should use cached underlying

contracts/CNft.sol:
   64:                     (bool checkSuccess, bytes memory result) = underlying.staticcall(punkIndexToAddress); //@audit this is a SLOAD in a loop. Should cache underlying before if/else statement and use cached value here
   68:                     (bool buyPunkSuccess, ) = underlying.call(data); //@audit this is a SLOAD in a loop. Should cache underlying before if/else statement and use cached value here
   73:                     IERC721(underlying).safeTransferFrom(msg.sender, address(this), tokenIds[i], ""); //@audit this is a SLOAD in a loop. Should cache underlying before if/else statement and use cached value here
  147:                     (bool transferPunkSuccess, ) = underlying.call(data); //@audit this is a SLOAD in a loop. Should cache underlying before if/else statement and use cached value here
  152:                     IERC721(underlying).safeTransferFrom(address(this), msg.sender, tokenIds[i], ""); //@audit this is a SLOAD in a loop. Should cache underlying before if/else statement and use cached value here

contracts/Comptroller.sol:
   328:             if (err != Error.NO_ERROR) { //@audit gas: Error.NO_ERROR SLOAD 1
   350:         if (err != Error.NO_ERROR) {  //@audit gas: Error.NO_ERROR SLOAD 2
   362:         return uint(Error.NO_ERROR); //@audit gas: Error.NO_ERROR SLOAD 3
   603:             vars.oraclePriceMantissa = oracle.getUnderlyingPrice(asset); //@audit gas: oracle SLOAD in for-loop. Cache it before the loop
   630:         uint256 nftBalance = nftMarket.totalBalance(account);//@audit gas: nftMarket SLOAD 1
   633:             vars.nftOraclePriceMantissa =  nftOracle.getUnderlyingPrice(nftMarket); //@audit gas: nftMarket SLOAD 2
   638:             vars.nftCollateralFactor = Exp({mantissa: markets[address(nftMarket)].collateralFactorMantissa});  //@audit gas: markets[address(nftMarket)].collateralFactorMantissa SLOAD 1, nftMarket SLOAD 3
   641:             vars.sumCollateral = mul_ScalarTruncateAddUInt(mul_(vars.nftOraclePrice, markets[address(nftMarket)].collateralFactorMantissa), nftBalance, vars.sumCollateral);  //@audit gas: markets[address(nftMarket)].collateralFactorMantissa SLOAD 2, nftMarket SLOAD 4
   642:             if (cAssetModify == address(nftMarket)) {  //@audit gas: nftMarket SLOAD 5
   645:                 vars.sumBorrowPlusEffects = mul_ScalarTruncateAddUInt(mul_(vars.nftOraclePrice, markets[address(nftMarket)].collateralFactorMantissa), redeemTokens, vars.sumBorrowPlusEffects);  //@audit gas: markets[address(nftMarket)].collateralFactorMantissa SLOAD 3, nftMarket SLOAD 6
   667:         uint priceBorrowedMantissa = oracle.getUnderlyingPrice(CToken(cTokenBorrowed)); //@audit gas: oracle SLOAD 1
   668:         uint priceCollateralMantissa = oracle.getUnderlyingPrice(CToken(cTokenCollateral)); //@audit gas: oracle SLOAD 2
   702:         require(cNftCollateral == address(nftMarket), "cNFT is from the wrong comptroller");  //@audit gas: nftMarket SLOAD 1
   706:         uint priceCollateralMantissa = nftOracle.getUnderlyingPrice(nftMarket); //@audit gas: nftMarket SLOAD 2
   788:         emit NewCloseFactor(oldCloseFactorMantissa, closeFactorMantissa); //@audit gas: SLOAD, should emit newCloseFactorMantissa instead of closeFactorMantissa

contracts/CToken.sol:
   976:         if (repayBorrowError != uint(Error.NO_ERROR)) { //@audit gas: uint(Error.NO_ERROR) SLOAD 1
   986:         require(amountSeizeError == uint(Error.NO_ERROR), "LIQUIDATE_COMPTROLLER_CALCULATE_AMOUNT_SEIZE_FAILED");//@audit gas: uint(Error.NO_ERROR) SLOAD 2
  1000:         require(seizeError == uint(Error.NO_ERROR), "token seizure failed"); //@audit gas: uint(Error.NO_ERROR) SLOAD 3
  1005:         return (uint(Error.NO_ERROR), actualRepayAmount);//@audit gas: uint(Error.NO_ERROR) SLOAD 4
  1073:         if (repayBorrowError != uint(Error.NO_ERROR)) {//@audit gas: uint(Error.NO_ERROR) SLOAD 1
  1083:         require(amountSeizeError == uint(Error.NO_ERROR), "LIQUIDATE_COMPTROLLER_CALCULATE_AMOUNT_SEIZE_FAILED");//@audit gas: uint(Error.NO_ERROR) SLOAD 2
  1101:         return (uint(Error.NO_ERROR), actualRepayAmount);//@audit gas: uint(Error.NO_ERROR) SLOAD 3

contracts/Oracles/UniswapV2PriceOracle.sol:
   26:             numPairObservations[pair] > 0 && //@audit should cache numPairObservations[pair]
   27:             (block.timestamp - pairObservations[pair][(numPairObservations[pair] - 1) % OBSERVATION_BUFFER_SIZE].timestamp) <= MIN_TWAP_TIME //@audit should cache pairObservations[pair]
   32:         pairObservations[pair][numPairObservations[pair]++ % OBSERVATION_BUFFER_SIZE] = Observation( //@audit should use cached pairObservations[pair] and cached numPairObservations[pair]++. THEN it should SSTORE in [numPairObservations[pair] the cached value instead of doing [numPairObservations[pair]++
  130:         if (lastObservation.timestamp > block.timestamp - MIN_TWAP_TIME) {  //@audit should cache lastObservation.timestamp
  136:             block.timestamp - lastObservation.timestamp >= MIN_TWAP_TIME,  //@audit should use cached lastObservation.timestamp
  142:             return (px0Cumulative - lastObservation.price0Cumulative) / (block.timestamp - lastObservation.timestamp);  //@audit should use cached lastObservation.timestamp
  151:         if (lastObservation.timestamp > block.timestamp - MIN_TWAP_TIME) { //@audit should use cached lastObservation.timestamp
  157:             block.timestamp - lastObservation.timestamp >= MIN_TWAP_TIME, //@audit should use cached lastObservation.timestamp
  163:             return (px1Cumulative - lastObservation.price1Cumulative) / (block.timestamp - lastObservation.timestamp); //@audit should use cached lastObservation.timestamp
```

## [G-04] Unchecking arithmetics operations that can't underflow/overflow

Solidity version 0.8+ comes with implicit overflow and underflow checks on unsigned integers. When an overflow or an underflow isn't possible (as an example, when a comparison is made before the arithmetic operation), some gas can be saved by using an `unchecked` block: <https://docs.soliditylang.org/en/v0.8.10/control-structures.html#checked-or-unchecked-arithmetic>

I suggest wrapping with an `unchecked` block here (see `@audit` tags for more details):

```solidity
contracts/Oracles/UniswapV2PriceOracle.sol:
  129:         Observation storage lastObservation = pairObservations[pair][(length - 1) % OBSERVATION_BUFFER_SIZE]; //@audit gas: should be unchecked due to L128
  132:             lastObservation = pairObservations[pair][(length - 2) % OBSERVATION_BUFFER_SIZE];//@audit gas: should be unchecked due to L131
  150:         Observation storage lastObservation = pairObservations[pair][(length - 1) % OBSERVATION_BUFFER_SIZE];//@audit gas: should be unchecked due to L149
  153:             lastObservation = pairObservations[pair][(length - 2) % OBSERVATION_BUFFER_SIZE];//@audit gas: should be unchecked due to L152
```

## [G-05] Boolean comparisons

Comparing to a constant (`true` or `false`) is a bit more expensive than directly checking the returned boolean value.
I suggest using `if(directValue)` instead of `if(directValue == true)` here (same for require statements):

```solidity
Comptroller.sol:142:        if (marketToJoin.accountMembership[borrower] == true) {
Comptroller.sol:997:        require(msg.sender == admin || state == true, "only admin can unpause");
Comptroller.sol:1011:        require(msg.sender == admin || state == true, "only admin can unpause");
Comptroller.sol:1020:        require(msg.sender == admin || state == true, "only admin can unpause");
Comptroller.sol:1029:        require(msg.sender == admin || state == true, "only admin can unpause");
Comptroller.sol:1065:            require(market.isListed == true, "comp market is not listed");
Comptroller.sol:1226:            if (borrowers == true) {
Comptroller.sol:1233:            if (suppliers == true) {
Comptroller.sol:1325:            borrowGuardianPaused[address(cToken)] == true &&
```

## [G-06] `> 0` is less efficient than `!= 0` for unsigned integers (with proof)

`!= 0` costs less gas compared to `> 0` for unsigned integers in `require` statements with the optimizer enabled (6 gas)

Proof: While it may seem that `> 0` is cheaper than `!=`, this is only true without the optimizer enabled and outside a require statement. If you enable the optimizer at 10k AND you're in a `require` statement, this will save gas. You can see this tweet for more proofs: <https://twitter.com/gzeon/status/1485428085885640706>

I suggest changing `> 0` with `!= 0` here:

```solidity
Oracles/CNftPriceOracle.sol:63:            cNfts.length > 0 && cNfts.length == nftxTokens.length,
Oracles/UniswapV2PriceOracle.sol:67:                    reserve0 > 0 && reserve1 > 0,
Oracles/UniswapV2PriceOracle.sol:91:                    reserve0 > 0,
Oracles/UniswapV2PriceOracle.sol:115:                    reserve1 > 0,
Oracles/UniswapV2PriceOracle.sol:128:        require(length > 0, "UniswapV2PriceOracle: No observations.");
Oracles/UniswapV2PriceOracle.sol:149:        require(length > 0, "UniswapV2PriceOracle: No observations.");
CToken.sol:37:        require(initialExchangeRateMantissa > 0, "initial exchange rate must be greater than zero.");
```

Also, please enable the Optimizer.

## [G-07] Splitting `require()` statements that use `&&` saves gas

If you're using the Optimizer at 200, instead of using the `&&` operator in a single require statement to check multiple conditions, I suggest using multiple require statements with 1 condition per require statement:

```solidity
contracts/CNft.sol:
  66:                     require(checkSuccess && nftOwner == msg.sender, "Not the NFT owner");

contracts/Comptroller.sol:
  947:         require(numMarkets != 0 && numMarkets == numBorrowCaps, "invalid input");

contracts/CToken.sol:
  33:         require(accrualBlockNumber == 0 && borrowIndex == 0, "market may only be initialized once");

contracts/Oracles/CNftPriceOracle.sol:
  63:             cNfts.length > 0 && cNfts.length == nftxTokens.length,

contracts/Oracles/UniswapV2PriceOracle.sol:
  67:                     reserve0 > 0 && reserve1 > 0,
```

## [G-08] Usage of assert() instead of require()

Between solc 0.4.10 and 0.8.0, `require()` used `REVERT` (0xfd) opcode which refunded remaining gas on failure while `assert()` used `INVALID` (0xfe) opcode which consumed all the supplied gas. (see <https://docs.soliditylang.org/en/v0.8.1/control-structures.html#error-handling-assert-require-revert-and-exceptions>).\
`require()` should be used for checking error conditions on inputs and return values while `assert()` should be used for invariant checking (**properly functioning code should never reach a failing assert statement, unless there is a bug in your contract you should fix**).<br>
From the current usage of `assert`, my guess is that they can be replaced with `require`, unless a `Panic` really is intended.

Here are the `assert` locations:

```solidity
Comptroller.sol:207:        assert(assetIndex < len);
Comptroller.sol:333:            assert(markets[cToken].accountMembership[borrower]);
```

## [G-09] Amounts should be checked for 0 before calling a transfer

Checking non-zero transfer values can avoid an expensive external call and save gas.

I suggest adding a non-zero-value check here:

```solidity
File: CErc20.sol
135:     function sweepToken(EIP20NonStandardInterface token) external {
136:      require(address(token) != underlying, "CErc20::sweepToken: can not sweep underlying token");
137:      uint256 balance = token.balanceOf(address(this));
138:      token.transfer(admin, balance); //@audit gas: should check for balance == 0 before transfer
139:     }
```

## [G-10] An array's length should be cached to save gas in for-loops

Reading array length at each iteration of the loop takes 6 gas (3 for mload and 3 to place memory_offset) in the stack.

Caching the array length in the stack saves around 3 gas per iteration.

Here, I suggest storing the array's length in a variable before the for-loop, and use it instead:

```solidity
Oracles/CNftPriceOracle.sol:66:        for (uint256 i = 0; i < cNfts.length; ++i) {
Oracles/UniswapV2PriceOracle.sol:42:        for (uint256 i = 0; i < pairs.length; ++i) {
CEther.sol:178:        for (i = 0; i < bytes(message).length; i++) {
CNft.sol:176:        for (uint256 i; i < vars.length; ++i) {
Comptroller.sol:591:        for (uint i = 0; i < assets.length; i++) {
Comptroller.sol:928:        for (uint i = 0; i < allMarkets.length; i ++) {
Comptroller.sol:1223:        for (uint i = 0; i < cTokens.length; i++) {
Comptroller.sol:1229:                for (uint j = 0; j < holders.length; j++) {
Comptroller.sol:1235:                for (uint j = 0; j < holders.length; j++) {
Comptroller.sol:1240:        for (uint j = 0; j < holders.length; j++) {
ERC1155Enumerable.sol:51:        for (uint256 i; i < ids.length; ++i) {
```

## [G-11] `++i` costs less gas compared to `i++` or `i += 1`

`++i` costs less gas compared to `i++` or `i += 1` for unsigned integer, as pre-increment is cheaper (about 5 gas per iteration). This statement is true even with the optimizer enabled.

The same is also true for `i--`.

`i++` increments `i` and returns the initial value of `i`. Which means:

```solidity
uint i = 1;  
i++; // == 1 but i == 2  
```

But `++i` returns the actual incremented value:

```solidity
uint i = 1;  
++i; // == 2 and i == 2 too, so no need for a temporary variable  
```

In the first case, the compiler has to create a temporary variable (when used) for returning `1` instead of `2`

Instances include:

```solidity
CEther.sol:178:        for (i = 0; i < bytes(message).length; i++) {
Comptroller.sol:119:        for (uint i = 0; i < len; i++) {
Comptroller.sol:199:        for (uint i = 0; i < len; i++) {
Comptroller.sol:212:        storedList.length--; //@audit use --storedList.length
Comptroller.sol:591:        for (uint i = 0; i < assets.length; i++) {
Comptroller.sol:928:        for (uint i = 0; i < allMarkets.length; i ++) {
Comptroller.sol:949:        for(uint i = 0; i < numMarkets; i++) {
Comptroller.sol:1223:        for (uint i = 0; i < cTokens.length; i++) {
Comptroller.sol:1229:                for (uint j = 0; j < holders.length; j++) {
Comptroller.sol:1235:                for (uint j = 0; j < holders.length; j++) {
Comptroller.sol:1240:        for (uint j = 0; j < holders.length; j++) {
```

I suggest using `++i` instead of `i++` to increment the value of an uint variable.

## [G-12] Do not pre-declare variable with default values

One of the practices in the project is to pre-declare variables before assigning a value to them. This is not necessary and actually costs some gas (MSTOREs and MLOADs).

As an example, consider going from:

```solidity
File: Comptroller.sol
715:         uint seizeTokens;
716:         Exp memory numerator;
717:         Exp memory denominator;
718:         Exp memory ratio;
719: 
720:         numerator = mul_(Exp({mantissa: liquidationIncentiveMantissa}), Exp({mantissa: priceBorrowedMantissa}));
721:         denominator = Exp({mantissa: priceCollateralMantissa});
722:         ratio = div_(numerator, denominator);
723: 
724:         seizeTokens = truncate(mul_(ratio, Exp({mantissa: actualRepayAmount})));
```

to:

```solidity
        Exp memory numerator = mul_(Exp({mantissa: liquidationIncentiveMantissa}), Exp({mantissa: priceBorrowedMantissa}));
        Exp memory denominator = Exp({mantissa: priceCollateralMantissa});
        Exp memory ratio = div_(numerator, denominator);

        uint seizeTokens = truncate(mul_(ratio, Exp({mantissa: actualRepayAmount})));
```

Same for the following code:

```solidity
File: Comptroller.sol
680:         uint seizeTokens;
681:         Exp memory numerator;
682:         Exp memory denominator;
683:         Exp memory ratio;
684: 
685:         numerator = mul_(Exp({mantissa: liquidationIncentiveMantissa}), Exp({mantissa: priceBorrowedMantissa}));
686:         denominator = mul_(Exp({mantissa: priceCollateralMantissa}), Exp({mantissa: exchangeRateMantissa}));
687:         ratio = div_(numerator, denominator);
688: 
689:         seizeTokens = mul_ScalarTruncate(ratio, actualRepayAmount);
```

## [G-13] Increments can be unchecked

In Solidity 0.8+, there's a default overflow check on unsigned integers. It's possible to uncheck this in for-loops and save some gas at each iteration, but at the cost of some code readability, as this uncheck cannot be made inline.

[ethereum/solidity#10695](https://github.com/ethereum/solidity/issues/10695)

Instances include:

```solidity
Oracles/CNftPriceOracle.sol:66:        for (uint256 i = 0; i < cNfts.length; ++i) {
Oracles/UniswapV2PriceOracle.sol:42:        for (uint256 i = 0; i < pairs.length; ++i) {
CNft.sol:50:        for (uint256 i; i < length; ++i) {
CNft.sol:62:                for (uint256 i; i < length; ++i) {
CNft.sol:72:                for (uint256 i; i < length; ++i) {
CNft.sol:98:        for (uint256 i; i < length; ++i) {
CNft.sol:122:        for (uint256 i; i < length; ++i) {
CNft.sol:145:                for (uint256 i; i < length; ++i) {
CNft.sol:151:                for (uint256 i; i < length; ++i) {
CNft.sol:176:        for (uint256 i; i < vars.length; ++i) {
ERC1155Enumerable.sol:51:        for (uint256 i; i < ids.length; ++i) {
```

The code would go from:

```solidity
for (uint256 i; i < numIterations; i++) {  
 // ...  
}  
```

to:

```solidity
for (uint256 i; i < numIterations;) {  
 // ...  
 unchecked { ++i; }  
}  
```

The risk of overflow is inexistant for `uint256` here.

## [G-14] Public functions to external

The following functions could be set external to save gas and improve code quality.<br>
External call cost is less expensive than of public functions.

```solidity
_setInterestRateModel(InterestRateModel) should be declared external:
	- CToken._setInterestRateModel(InterestRateModel) (contracts/CToken.sol#1452-1460)

enterMarkets(address[]) should be declared external:
	- Comptroller.enterMarkets(address[]) (contracts/Comptroller.sol#115-126)
getAccountLiquidity(address) should be declared external:
	- Comptroller.getAccountLiquidity(address) (contracts/Comptroller.sol#533-537)
getHypotheticalAccountLiquidity(address,address,uint256,uint256) should be declared external:
	- Comptroller.getHypotheticalAccountLiquidity(address,address,uint256,uint256) (contracts/Comptroller.sol#559-566)
_setPriceOracle(PriceOracle) should be declared external:
	- Comptroller._setPriceOracle(PriceOracle) (contracts/Comptroller.sol#741-757)
_setNftPriceOracle(NftPriceOracle) should be declared external:
	- Comptroller._setNftPriceOracle(NftPriceOracle) (contracts/Comptroller.sol#764-774)
_setPauseGuardian(address) should be declared external:
	- Comptroller._setPauseGuardian(address) (contracts/Comptroller.sol#977-992)
_setMintPaused(address,bool) should be declared external:
	- Comptroller._setMintPaused(address,bool) (contracts/Comptroller.sol#994-1006)
_setBorrowPaused(CToken,bool) should be declared external:
	- Comptroller._setBorrowPaused(CToken,bool) (contracts/Comptroller.sol#1008-1016)
_setTransferPaused(bool) should be declared external:
	- Comptroller._setTransferPaused(bool) (contracts/Comptroller.sol#1018-1025)
_setSeizePaused(bool) should be declared external:
	- Comptroller._setSeizePaused(bool) (contracts/Comptroller.sol#1027-1034)
_become(Unitroller) should be declared external:
	- Comptroller._become(Unitroller) (contracts/Comptroller.sol#1036-1039)
claimComp(address) should be declared external:
	- Comptroller.claimComp(address) (contracts/Comptroller.sol#1200-1202)
_grantComp(address,uint256) should be declared external:
	- Comptroller._grantComp(address,uint256) (contracts/Comptroller.sol#1270-1275)
_setCompSpeed(CToken,uint256) should be declared external:
	- Comptroller._setCompSpeed(CToken,uint256) (contracts/Comptroller.sol#1282-1285)
_setContributorCompSpeed(address,uint256) should be declared external:
	- Comptroller._setContributorCompSpeed(address,uint256) (contracts/Comptroller.sol#1292-1306)
getAllMarkets() should be declared external:
	- Comptroller.getAllMarkets() (contracts/Comptroller.sol#1313-1315)
```

## [G-15] No need to explicitly initialize variables with default values

If a variable is not set/initialized, it is assumed to have the default value (`0` for `uint`, `false` for `bool`, `address(0)` for address...). Explicitly initializing it with its default value is an anti-pattern and wastes gas.

As an example: `for (uint256 i = 0; i < numIterations; ++i) {` should be replaced with `for (uint256 i; i < numIterations; ++i) {`

Instances include:

```solidity
Oracles/CNftPriceOracle.sol:66:        for (uint256 i = 0; i < cNfts.length; ++i) {
Oracles/UniswapV2PriceOracle.sol:41:        uint256 numberUpdated = 0;
Oracles/UniswapV2PriceOracle.sol:42:        for (uint256 i = 0; i < pairs.length; ++i) {
CEther.sol:178:        for (i = 0; i < bytes(message).length; i++) { //@audit declared "uint i" just above, which already defaults to 0
CNft.sol:49:        uint256 totalAmount = 0;
CNft.sol:97:        uint256 totalAmount = 0;
CNft.sol:119:        uint256 totalAmount = 0;
Comptroller.sol:119:        for (uint i = 0; i < len; i++) {
Comptroller.sol:199:        for (uint i = 0; i < len; i++) {
Comptroller.sol:591:        for (uint i = 0; i < assets.length; i++) {
Comptroller.sol:928:        for (uint i = 0; i < allMarkets.length; i ++) {
Comptroller.sol:949:        for(uint i = 0; i < numMarkets; i++) {
Comptroller.sol:1223:        for (uint i = 0; i < cTokens.length; i++) {
Comptroller.sol:1229:                for (uint j = 0; j < holders.length; j++) {
Comptroller.sol:1235:                for (uint j = 0; j < holders.length; j++) {
Comptroller.sol:1240:        for (uint j = 0; j < holders.length; j++) {
CToken.sol:81:        uint startingAllowance = 0;
```

I suggest removing explicit initializations for default values.

## [G-16] Upgrade pragma to at least 0.8.4

Using newer compiler versions and the optimizer give gas optimizations. Also, additional safety checks are available for free.

The advantages here are:

*   **Low level inliner** (>= 0.8.2): Cheaper runtime gas (especially relevant when the contract has small functions).
*   **Optimizer improvements in packed structs** (>= 0.8.3)
*   **Custom errors** (>= 0.8.4): cheaper deployment cost and runtime cost. *Note*: the runtime cost is only relevant when the revert condition is met. In short, replace revert strings by custom errors.

Consider upgrading pragma to at least 0.8.4:

```solidity
Oracles/CNftPriceOracle.sol:2:pragma solidity ^0.8.0;
Oracles/UniswapV2PriceOracle.sol:2:pragma solidity ^0.8.0;
CNft.sol:2:pragma solidity ^0.8.0;
ERC1155Enumerable.sol:2:pragma solidity ^0.8.0;
```

## [G-17] `PriceOracleImplementation.cEtherAddress` variable should be immutable

This variable is only set in the constructor and is never edited after that:

```solidity
File: PriceOracleImplementation.sol
10:     address public cEtherAddress; //@audit gas: should be immutable as it's only set in the constructor
```

Consider marking it as immutable.

## [G-18] Reduce the size of error messages (Long revert Strings)

Shortening revert strings to fit in 32 bytes will decrease deployment time gas and will decrease runtime gas when the revert condition is met.

Revert strings that are longer than 32 bytes require at least one additional mstore, along with additional overhead for computing memory offset, etc.

Revert strings > 32 bytes:

```solidity
Oracles/CNftPriceOracle.sol:64:            "CNftPriceOracle: `cNfts` and `nftxTokens` must have nonzero, equal lengths."
Oracles/CNftPriceOracle.sol:70:                "CNftPriceOracle: Cannot overwrite existing address mappings."
Oracles/CNftPriceOracle.sol:90:            "CNftPriceOracle: No NFTX token for cNFT."
Oracles/UniswapV2PriceOracle.sol:68:                    "UniswapV2PriceOracle: Division by zero."
Oracles/UniswapV2PriceOracle.sol:92:                    "UniswapV2PriceOracle: Division by zero."
Oracles/UniswapV2PriceOracle.sol:116:                    "UniswapV2PriceOracle: Division by zero."
Oracles/UniswapV2PriceOracle.sol:128:        require(length > 0, "UniswapV2PriceOracle: No observations.");
Oracles/UniswapV2PriceOracle.sol:131:            require(length > 1, "UniswapV2PriceOracle: Only one observation.");
Oracles/UniswapV2PriceOracle.sol:137:            "UniswapV2PriceOracle: Bad TWAP time."
Oracles/UniswapV2PriceOracle.sol:149:        require(length > 0, "UniswapV2PriceOracle: No observations.");
Oracles/UniswapV2PriceOracle.sol:152:            require(length > 1, "UniswapV2PriceOracle: Only one observation.");
Oracles/UniswapV2PriceOracle.sol:158:            "UniswapV2PriceOracle: Bad TWAP time."
CErc20.sol:136:     require(address(token) != underlying, "CErc20::sweepToken: can not sweep underlying token");
CErc20.sol:234:        require(msg.sender == admin, "only the admin may set the comp-like delegate");
CNft.sol:24:        require(_underlying != address(0), "CNFT: Asset should not be address(0)");
CNft.sol:25:        require(ComptrollerInterface(_comptroller).isComptroller(), "_comptroller is not a Comptroller contract");
CNft.sol:52:                require(amounts[i] == 1, "CNFT: Amounts must be all 1s for non-ERC1155s.");
CNft.sol:69:                    require(buyPunkSuccess, "CNFT: Calling buyPunk was unsuccessful");
CNft.sol:93:        require(borrower != liquidator, "CNFT: Liquidator cannot be borrower");
CNft.sol:100:                require(seizeAmounts[i] == 1, "CNFT: Amounts must be all 1s for non-ERC1155s.");
CNft.sol:124:                require(amounts[i] == 1, "CNFT: Amounts must be all 1s for non-ERC1155s.");
CNft.sol:148:                    require(transferPunkSuccess, "CNFT: Calling transferPunk was unsuccessful");
CNft.sol:204:            revert("CNFT: Use safeBatchTransferFrom instead");
CNft.sol:208:        require(msg.sender == underlying, "CNFT: This contract can only receive the underlying NFT");
CNft.sol:209:        require(operator == address(this), "CNFT: Only the CNFT contract can be the operator");
CNft.sol:279:        require(to != underlying, "CNFT: Cannot make an arbitrary call to underlying NFT");
Comptroller.sol:171:        require(oErr == 0, "exitMarket: getAccountSnapshot failed"); // semi-opaque error code
Comptroller.sol:420:            require(borrowBalance >= repayAmount, "Can not repay more than the total borrow");
Comptroller.sol:702:        require(cNftCollateral == address(nftMarket), "cNFT is from the wrong comptroller");
Comptroller.sol:942:     require(msg.sender == admin || msg.sender == borrowCapGuardian, "only admin or borrow cap guardian can set borrow caps");
Comptroller.sol:960:        require(msg.sender == admin, "only admin can set borrow cap guardian");
Comptroller.sol:995:        require(markets[cAsset].isListed, "cannot pause a market that is not listed");
Comptroller.sol:996:        require(msg.sender == pauseGuardian || msg.sender == admin, "only pause guardian and admin can pause");
Comptroller.sol:1009:        require(markets[address(cToken)].isListed, "cannot pause a market that is not listed");
Comptroller.sol:1010:        require(msg.sender == pauseGuardian || msg.sender == admin, "only pause guardian and admin can pause");
Comptroller.sol:1019:        require(msg.sender == pauseGuardian || msg.sender == admin, "only pause guardian and admin can pause");
Comptroller.sol:1028:        require(msg.sender == pauseGuardian || msg.sender == admin, "only pause guardian and admin can pause");
Comptroller.sol:1037:        require(msg.sender == unitroller.admin(), "only unitroller admin can change brains");
Comptroller.sol:1338:        require(address(nftMarket) == address(0), "nft collateral already initialized");
Comptroller.sol:1339:        require(address(cNft) != address(0), "cannot initialize nft market to the 0 address");
CToken.sol:32:        require(msg.sender == admin, "only admin may initialize the market");
CToken.sol:33:        require(accrualBlockNumber == 0 && borrowIndex == 0, "market may only be initialized once");
CToken.sol:37:        require(initialExchangeRateMantissa > 0, "initial exchange rate must be greater than zero.");
CToken.sol:49:        require(err == uint(Error.NO_ERROR), "setting interest rate model failed");
CToken.sol:271:        require(err == MathError.NO_ERROR, "borrowBalanceStored: borrowBalanceStoredInternal failed");
CToken.sol:328:        require(err == MathError.NO_ERROR, "exchangeRateStored: exchangeRateStoredInternal failed");
CToken.sol:542:        require(vars.mathErr == MathError.NO_ERROR, "MINT_NEW_TOTAL_SUPPLY_CALCULATION_FAILED");
CToken.sol:545:        require(vars.mathErr == MathError.NO_ERROR, "MINT_NEW_ACCOUNT_BALANCE_CALCULATION_FAILED");
CToken.sol:609:        require(redeemTokensIn == 0 || redeemAmountIn == 0, "one of redeemTokensIn or redeemAmountIn must be zero");
CToken.sol:891:        require(vars.mathErr == MathError.NO_ERROR, "REPAY_BORROW_NEW_ACCOUNT_BORROW_BALANCE_CALCULATION_FAILED");
CToken.sol:894:        require(vars.mathErr == MathError.NO_ERROR, "REPAY_BORROW_NEW_TOTAL_BALANCE_CALCULATION_FAILED");
CToken.sol:986:        require(amountSeizeError == uint(Error.NO_ERROR), "LIQUIDATE_COMPTROLLER_CALCULATE_AMOUNT_SEIZE_FAILED");
CToken.sol:1083:        require(amountSeizeError == uint(Error.NO_ERROR), "LIQUIDATE_COMPTROLLER_CALCULATE_AMOUNT_SEIZE_FAILED");
CToken.sol:1093:        require(seizeTokens == 0, "LIQUIDATE_SEIZE_INCORRECT_NUM_NFTS");
CToken.sol:1433:        require(totalReservesNew <= totalReserves, "reduce reserves unexpected underflow"); 
```

I suggest shortening the revert strings to fit in 32 bytes, or using custom errors as described next.

## [G-19] Use Custom Errors instead of Revert Strings to save Gas

Custom errors from Solidity 0.8.4 are cheaper than revert strings (cheaper deployment cost and runtime cost when the revert condition is met)

Source: <https://blog.soliditylang.org/2021/04/21/custom-errors/>:

> Starting from [Solidity v0.8.4](https://github.com/ethereum/solidity/releases/tag/v0.8.4), there is a convenient and gas-efficient way to explain to users why an operation failed through the use of custom errors. Until now, you could already use strings to give more information about failures (e.g., `revert("Insufficient funds.");`), but they are rather expensive, especially when it comes to deploy cost, and it is difficult to use dynamic information in them.

Custom errors are defined using the `error` statement, which can be used inside and outside of contracts (including interfaces and libraries).

Instances include:

```solidity
Oracles/CNftPriceOracle.sol:31:        require(msg.sender == admin, "Sender must be the admin.");
Oracles/CNftPriceOracle.sol:62:        require(
Oracles/CNftPriceOracle.sol:68:            require(
Oracles/CNftPriceOracle.sol:88:        require(
Oracles/UniswapV2PriceOracle.sol:66:                require(
Oracles/UniswapV2PriceOracle.sol:90:                require(
Oracles/UniswapV2PriceOracle.sol:114:                require(
Oracles/UniswapV2PriceOracle.sol:128:        require(length > 0, "UniswapV2PriceOracle: No observations.");
Oracles/UniswapV2PriceOracle.sol:131:            require(length > 1, "UniswapV2PriceOracle: Only one observation.");
Oracles/UniswapV2PriceOracle.sol:135:        require(
Oracles/UniswapV2PriceOracle.sol:149:        require(length > 0, "UniswapV2PriceOracle: No observations.");
Oracles/UniswapV2PriceOracle.sol:152:            require(length > 1, "UniswapV2PriceOracle: Only one observation.");
Oracles/UniswapV2PriceOracle.sol:156:        require(
CNft.sol:24:        require(_underlying != address(0), "CNFT: Asset should not be address(0)");
CNft.sol:25:        require(ComptrollerInterface(_comptroller).isComptroller(), "_comptroller is not a Comptroller contract");
CNft.sol:40:        require(tokenIds.length == amounts.length, "CNFT: id/amounts length mismatch");
CNft.sol:45:        require(mintAllowedResult == 0, "CNFT: Mint is not allowed");
CNft.sol:52:                require(amounts[i] == 1, "CNFT: Amounts must be all 1s for non-ERC1155s.");
CNft.sol:66:                    require(checkSuccess && nftOwner == msg.sender, "Not the NFT owner");
CNft.sol:69:                    require(buyPunkSuccess, "CNFT: Calling buyPunk was unsuccessful");
CNft.sol:85:        require(seizeIds.length == seizeAmounts.length, "CNFT: id/amounts length mismatch");
CNft.sol:90:        require(siezeAllowedResult == 0, "CNFT: Seize is not allowed");
CNft.sol:93:        require(borrower != liquidator, "CNFT: Liquidator cannot be borrower");
CNft.sol:100:                require(seizeAmounts[i] == 1, "CNFT: Amounts must be all 1s for non-ERC1155s.");
CNft.sol:116:        require(tokenIds.length == amounts.length, "CNFT: id/amounts length mismatch");
CNft.sol:124:                require(amounts[i] == 1, "CNFT: Amounts must be all 1s for non-ERC1155s.");
CNft.sol:127:            require(balanceOf(msg.sender, tokenIds[i]) >= amounts[i], "CNFT: Not enough NFTs to redeem");
CNft.sol:132:        require(redeemAllowedResult == 0, "CNFT: Redeem is not allowed");
CNft.sol:148:                    require(transferPunkSuccess, "CNFT: Calling transferPunk was unsuccessful");
CNft.sol:182:        require(transferAllowedResult == 0, "CNFT: Redeem is not allowed");
CNft.sol:208:        require(msg.sender == underlying, "CNFT: This contract can only receive the underlying NFT");
CNft.sol:209:        require(operator == address(this), "CNFT: Only the CNFT contract can be the operator");
CNft.sol:279:        require(to != underlying, "CNFT: Cannot make an arbitrary call to underlying NFT");
```

I suggest replacing revert strings with custom errors.



***

# Disclosures

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.
