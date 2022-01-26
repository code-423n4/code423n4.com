---
sponsor: "Fei Protocol"
slug: "2021-11-fei"
date: "2022-01-25" 
title: "Fei Protocol contest"
findings: "https://github.com/code-423n4/2021-11-fei-findings/issues"
contest: 63
---

# Overview

## About C4

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 code contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the code contest outlined in this document, C4 conducted an analysis of Fei Protocol contest smart contract system written in Solidity. The code contest took place between November 30—December 2 2021.

## Wardens

22 Wardens contributed reports to the Fei Protocol contest:

 1. WatchPug ([jtp](https://github.com/jack-the-pug) and [ming](https://github.com/mingwatch)) <!-- $6,967.17 USDC » WatchPug -->
 2. [danb](https://twitter.com/Hu9bGLp8jKo6HoY) <!-- $6,557.61 USDC » danb -->
 3. [cmichel](https://twitter.com/cmichelio) <!-- $4,747.40 USDC » cmichel -->
 4. [Meta0xNull](https://twitter.com/Meta0xNull) <!-- $4,241.66 USDC » Meta0xNull -->
 5. [loop](https://twitter.com/loop_225) <!-- $3,310.08 USDC » loop -->
 6. 0x0x0x <!-- $1,550.16 USDC » 0x0x0x -->
 7. [defsec](https://twitter.com/defsec_) <!-- $1,079.26 USDC » defsec -->
 8. [gzeon](https://twitter.com/gzeon) <!-- $957.09 USDC » gzeon -->
 9. [hickuphh3](https://twitter.com/HickupH) <!-- $86.99 USDC » hickuphh3 -->
 10. [TomFrenchBlockchain](https://github.com/TomAFrench) <!-- $80.82 USDC » TomFrench -->
 11. Czar102 <!-- $78.50 USDC » Czar102 -->
 12. [tqts](https://tqts.ar/) <!-- $76.43 USDC » tqts -->
 13. jayjonah8 <!-- $76.43 USDC » jayjonah8 -->
 14. robee <!-- $70.31 USDC » robee -->
 15. GeekyLumberjack <!-- $29.96 USDC » GeekyLumberjack -->
 16. [ye0lde](https://twitter.com/_ye0lde) <!-- $28.96 USDC » ye0lde -->
 17. [jierlich](https://twitter.com/Jierlich) <!-- $26.82 USDC » jierlich -->
 18. egjlmn1 <!-- $19.87 USDC » egjlmn1 -->
 19. 0x1f8b <!-- $7.24 USDC » 0x1f8b -->
 20. [sabtikw](https://twitter.com/sabtikw) <!-- $7.24 USDC » sabtikw -->
 21. hagrid <!-- $0.00 USDC » hagrid -->

This contest was judged by [pauliax](https://twitter.com/SolidityDev).

Final report assembled by [moneylegobatman](https://twitter.com/money_lego) and [CloudEllie](https://twitter.com/CloudEllie1).

# Summary

The C4 analysis yielded an aggregated total of 9 unique vulnerabilities and 48 total findings. All of the issues presented here are linked back to their original finding.

Of these vulnerabilities, 0 received a risk rating in the category of HIGH severity, 0 received a risk rating in the category of MEDIUM severity, and 9 received a risk rating in the category of LOW severity.

C4 analysis also identified 14 non-critical recommendations and 25 gas optimizations.

# Scope

The code under review can be found within the [C4 Fei Protocol contest repository](https://github.com/code-423n4/2021-11-fei), and is composed of 4 smart contracts written in the Solidity programming language and includes 342 lines of Solidity code.

# Severity Criteria

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

- Malicious Input Handling
- Escalation of privileges
- Arithmetic
- Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code423n4.com).

# Low Risk Findings (9)
- [[L-01] unsafe cast](https://github.com/code-423n4/2021-11-fei-findings/issues/151) _Submitted by danb_.
- [[L-02] denial of service](https://github.com/code-423n4/2021-11-fei-findings/issues/150) _Submitted by danb_.
- [[L-03] PegExchanger expiry block must be set to at least `MIN_EXPIRY_WINDOW + 1` into the future](https://github.com/code-423n4/2021-11-fei-findings/issues/149) _Submitted by loop_.
- [[L-04] Wrong `preMergeCirculatingTribe` value](https://github.com/code-423n4/2021-11-fei-findings/issues/112) _Submitted by cmichel_.
- [[L-05]  `TribeRagequit.sol` minter role to FEI is unnecessary](https://github.com/code-423n4/2021-11-fei-findings/issues/94) _Submitted by WatchPug_.
- [[L-06] `PegExchanger.sol` unused tribe tokens can be frozen in the contract](https://github.com/code-423n4/2021-11-fei-findings/issues/87) _Submitted by WatchPug_.
- [[L-07] In TRIBERagequit.sol, users can get frontrunned ](https://github.com/code-423n4/2021-11-fei-findings/issues/131) _Submitted by 0x0x0x, also found by cmichel_.
- [[L-08] Value of token1OutBase might became stale in TRIBERagequit.sol](https://github.com/code-423n4/2021-11-fei-findings/issues/126) _Submitted by gzeon, also found by Meta0xNull and defsec_.
- [[L-09] Ragequit function ngmi() Will Fail Even If Follow All Steps in Simulations](https://github.com/code-423n4/2021-11-fei-findings/issues/47) _Submitted by Meta0xNull_.

# Non-Critical Findings (14)
- [[N-01] Open TODOs](https://github.com/code-423n4/2021-11-fei-findings/issues/31) _Submitted by robee, also found by Meta0xNull and hagrid_.
- [[N-02] Require with not comprehensive message](https://github.com/code-423n4/2021-11-fei-findings/issues/29) _Submitted by robee_.
- [[N-03] Outdated compiler version](https://github.com/code-423n4/2021-11-fei-findings/issues/66) _Submitted by WatchPug_.
- [[N-04] Inaccurate revert reason in TRIBERagequit.sol](https://github.com/code-423n4/2021-11-fei-findings/issues/122) _Submitted by gzeon_.
- [[N-05] False information given to the user](https://github.com/code-423n4/2021-11-fei-findings/issues/64) _Submitted by Czar102_.
- [[N-06] Missing events for critical operations](https://github.com/code-423n4/2021-11-fei-findings/issues/68) _Submitted by WatchPug, also found by 0x0x0x_.
- [[N-07] Wrong comments about key in TRIBERagequit](https://github.com/code-423n4/2021-11-fei-findings/issues/135) _Submitted by 0x0x0x_.
- [[N-08] Expiration time shift](https://github.com/code-423n4/2021-11-fei-findings/issues/61) _Submitted by Czar102, also found by cmichel_.
- [[N-09] Code Style: constants should be named in all caps](https://github.com/code-423n4/2021-11-fei-findings/issues/79) _Submitted by WatchPug_.
- [[N-10] Improve readability of constants](https://github.com/code-423n4/2021-11-fei-findings/issues/84) _Submitted by WatchPug_.
- [[N-11] Consider change some constants into immutable variables for settings that can be configured at deploy time](https://github.com/code-423n4/2021-11-fei-findings/issues/83) _Submitted by WatchPug, also found by 0x1f8b_.
- [[N-12] Unnatural interface](https://github.com/code-423n4/2021-11-fei-findings/issues/57) _Submitted by Czar102_.
- [[N-13] TRIBERagequit: Make verifyClaim() public](https://github.com/code-423n4/2021-11-fei-findings/issues/107) _Submitted by hickuphh3_.
- [[N-14] No restriction for expiration block in TRIBERagequit.sol](https://github.com/code-423n4/2021-11-fei-findings/issues/144) _Submitted by 0x0x0x, also found by Czar102_.

# Gas Optimizations (25)
- [[G-01] `PegExchanger.sol#exchange()` Redundant code](https://github.com/code-423n4/2021-11-fei-findings/issues/71) _Submitted by WatchPug, also found by Czar102, defsec, and jierlich_.
- [[G-02] PegExchanger#giveTo(): Use transfer() method instead of transferFrom()](https://github.com/code-423n4/2021-11-fei-findings/issues/104) _Submitted by hickuphh3, also found by Czar102, WatchPug, and danb_.
- [[G-03] Gas saving in ngmi(uint256,uint256,bytes32[])](https://github.com/code-423n4/2021-11-fei-findings/issues/13) _Submitted by tqts_.
- [[G-04] Use short reason strings can save gas](https://github.com/code-423n4/2021-11-fei-findings/issues/78) _Submitted by WatchPug, also found by Meta0xNull_.
- [[G-05] Don't cache bool `check`](https://github.com/code-423n4/2021-11-fei-findings/issues/143) _Submitted by 0x0x0x, also found by gzeon, jierlich, and loop_.
- [[G-06] Use else if can save gas](https://github.com/code-423n4/2021-11-fei-findings/issues/74) _Submitted by WatchPug_.
- [[G-07] Loops can be implemented more efficiently](https://github.com/code-423n4/2021-11-fei-findings/issues/134) _Submitted by 0x0x0x, also found by Meta0xNull and WatchPug_.
- [[G-08] `preMergeCirculatingTribe` can be constant](https://github.com/code-423n4/2021-11-fei-findings/issues/147) _Submitted by loop, also found by 0x0x0x, Czar102, WatchPug, robee, and ye0lde_.
- [[G-09] Unused local variables in requery (TRIBERagequit.sol)](https://github.com/code-423n4/2021-11-fei-findings/issues/159) _Submitted by ye0lde, also found by Czar102, GeekyLumberjack, gzeon, loop, and robee_.
- [[G-10] Comparison with literal boolean values](https://github.com/code-423n4/2021-11-fei-findings/issues/160) _Submitted by ye0lde, also found by Czar102, 0x0x0x, 0x1f8b, WatchPug, and loop_.
- [[G-11] constructor should be removed if not used](https://github.com/code-423n4/2021-11-fei-findings/issues/12) _Submitted by jayjonah8_.
- [[G-12] TRIBERageQuit: Redundant oracleAddress variable](https://github.com/code-423n4/2021-11-fei-findings/issues/108) _Submitted by hickuphh3_.
- [[G-13] Use `calldata` instead of `memory` for function parameters](https://github.com/code-423n4/2021-11-fei-findings/issues/102) _Submitted by defsec_.
- [[G-14] Testing for initial condition on oracle query last saves gas.](https://github.com/code-423n4/2021-11-fei-findings/issues/3) _Submitted by TomFrenchBlockchain_.
- [[G-15] Gas Optimization: Unchecked safe logic in TRIBERagequit.sol](https://github.com/code-423n4/2021-11-fei-findings/issues/124) _Submitted by gzeon, also found by WatchPug and defsec_.
- [[G-16] Assignment Of State Variables To Default ](https://github.com/code-423n4/2021-11-fei-findings/issues/157) _Submitted by ye0lde, also found by 0x0x0x, Czar102, TomFrenchBlockchain, WatchPug, and sabtikw_.
- [[G-17] Public functions to external](https://github.com/code-423n4/2021-11-fei-findings/issues/27) _Submitted by robee, also found by cmichel, jayjonah8, 0x0x0x, Czar102, GeekyLumberjack, WatchPug, defsec, loop, and tqts_.
- [[G-18] Internal functions to private](https://github.com/code-423n4/2021-11-fei-findings/issues/26) _Submitted by robee, also found by WatchPug_.
- [[G-19] `++i` is more efficient than `i++`](https://github.com/code-423n4/2021-11-fei-findings/issues/98) _Submitted by WatchPug, also found by defsec_.
- [[G-20] Avoid On Chain Computation That Have Known Answer to Save Gas](https://github.com/code-423n4/2021-11-fei-findings/issues/45) _Submitted by Meta0xNull, also found by WatchPug_.
- [[G-21] Gas Optimization On The 2^256-1](https://github.com/code-423n4/2021-11-fei-findings/issues/100) _Submitted by defsec, also found by WatchPug_.
- [[G-22] Remove unnecessary variables can make the code simpler and save some gas](https://github.com/code-423n4/2021-11-fei-findings/issues/99) _Submitted by WatchPug, also found by Czar102 and defsec_.
- [[G-23] Storage double reading. Could save SLOAD](https://github.com/code-423n4/2021-11-fei-findings/issues/25) _Submitted by robee, also found by WatchPug and egjlmn1_.
- [[G-24] Not used return value at recalculate and requery in TRIBERagequit.sol](https://github.com/code-423n4/2021-11-fei-findings/issues/138) _Submitted by 0x0x0x, also found by GeekyLumberjack and WatchPug_.
- [[G-25] Remove unnecessary function can make the code simpler and save some gas](https://github.com/code-423n4/2021-11-fei-findings/issues/88) _Submitted by WatchPug, also found by gzeon_.

# Disclosures

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.
