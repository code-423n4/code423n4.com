---
sponsor: "Forgotten Runes"
slug: "2022-05-runes"
date: "2022-08-04"
title: "Forgotten Runes Warrior Guild contest"
findings: "https://github.com/code-423n4/2022-05-runes-findings/issues"
contest: 118
---

# Overview

## About C4

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the Forgotten Runes Warrior Guild smart contract system written in Solidity. The audit contest took place between May 3—May 5 2022.

## Wardens

102 Wardens contributed reports to the Forgotten Runes Warrior Guild contest:

  1. AuditsAreUS
  1. BowTiedWardens (BowTiedHeron, BowTiedPickle, [m4rio_eth](BowTiedETHernal), [Dravee](https://twitter.com/JustDravee), and BowTiedFirefox)
  1. IllIllI
  1. [pedroais](https://twitter.com/Pedroais2/)
  1. [defsec](https://twitter.com/defsec_)
  1. [Ruhum](https://twitter.com/0xruhum)
  1. sorrynotsorry
  1. [rfa](https://www.instagram.com/riyan_rfa/)
  1. VAD37
  1. [MaratCerby](https://twitter.com/MaratCerby)
  1. [shenwilly](https://twitter.com/shenwilly_)
  1. [WatchPug](https://twitter.com/WatchPug_) ([jtp](https://github.com/jack-the-pug) and [ming](https://github.com/mingwatch))
  1. [teddav](https://twitter.com/0xteddav)
  1. [leastwood](https://twitter.com/0xleastwood)
  1. GimelSec ([rayn](https://twitter.com/rayn731) and sces60107)
  1. [throttle](https://twitter.com/Throt7le)
  1. 0xDjango
  1. unforgiven
  1. reassor
  1. hake
  1. [shung](https://twitter.com/shunduquar)
  1. [fatherOfBlocks](https://twitter.com/father0fBl0cks)
  1. dipp
  1. 0x1f8b
  1. dirk_y
  1. [rajatbeladiya](https://twitter.com/rajat_beladiya)
  1. [Kulk0](https://twitter.com/DavidKulman3)
  1. [hyh](https://twitter.com/0xhyh)
  1. [broccolirob](https://twitter.com/0xbroccolirob)
  1. Dinddle
  1. [joestakey](https://twitter.com/JoeStakey)
  1. horsefacts
  1. [hickuphh3](https://twitter.com/HickupH)
  1. robee
  1. [0xliumin](https://twitter.com/0xliumin)
  1. ilan
  1. p4st13r4 ([0x69e8](https://github.com/0x69e8) and 0xb4bb4)
  1. TrungOre
  1. [z3s](https://github.com/z3s/)
  1. rotcivegaf
  1. hubble (ksk2345 and shri4net)
  1. [berndartmueller](https://twitter.com/berndartmueller)
  1. tintin
  1. cccz
  1. m9800
  1. peritoflores
  1. 0xkatana
  1. FSchmoede
  1. [Czar102](https://twitter.com/_Czar102)
  1. [kenzo](https://twitter.com/KenzoAgada)
  1. TerrierLover
  1. [catchup](https://twitter.com/catchup22)
  1. kenta
  1. 0x4non
  1. marximimus
  1. [pauliax](https://twitter.com/SolidityDev)
  1. delfin454000
  1. kebabsec (okkothejawa and [FlameHorizon](https://twitter.com/FlameHorizon1))
  1. 0xf15ers (remora and twojoy)
  1. [0v3rf10w](https://twitter.com/_0v3rf10w)
  1. [CertoraInc](https://twitter.com/CertoraInc) (egjlmn1, [OriDabush](https://twitter.com/ori_dabush), ItayG, and shakedwinder)
  1. [ellahi](https://twitter.com/ellahinator)
  1. minhquanym
  1. oyc_109
  1. [Picodes](https://twitter.com/thePicodes)
  1. eccentricexit
  1. [Funen](https://instagram.com/vanensurya)
  1. [hansfriese](https://twitter.com/hansfriese)
  1. Hawkeye (0xwags and 0xmint)
  1. M0ndoHEHE
  1. samruna
  1. simon135
  1. Cr4ckM3
  1. [sseefried](http://seanseefried.org/blog)
  1. 0x52
  1. [csanuragjain](https://twitter.com/csanuragjain)
  1. cryptphi
  1. [plotchy](https://twitter.com/plotchy)
  1. saian
  1. 0xc0ffEE
  1. [0xNazgul](https://twitter.com/0xNazgul)
  1. [antonttc](https://github.com/antoncoding)
  1. Cityscape
  1. DavidGialdi
  1. [MiloTruck](https://milotruck.github.io/)
  1. slywaters
  1. [Tadashi](https://github.com/htadashi)
  1. [0xProf](https://twitter.com/praiseprof)
  1. ACai
  1. AlleyCat
  1. noobie
  1. RoiEvenHaim

This contest was judged by [gzeon](https://twitter.com/gzeon). The judge also competed in the contest as a warden, but forfeited their winnings.

Final report assembled by [liveactionllama](https://twitter.com/liveactionllama).

# Summary

The C4 analysis yielded an aggregated total of 6 unique vulnerabilities. Of these vulnerabilities, 0 received a risk rating in the category of HIGH severity and 6 received a risk rating in the category of MEDIUM severity.

Additionally, C4 analysis included 75 reports detailing issues with a risk rating of LOW severity or non-critical. There were also 73 reports recommending gas optimizations.

All of the issues presented here are linked back to their original finding.

# Scope

The code under review can be found within the [C4 Forgotten Runes Warrior Guild contest repository](https://github.com/code-423n4/2022-05-runes), and is composed of 5 smart contracts written in the Solidity programming language and includes 712 lines of Solidity code.

# Severity Criteria

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low/non-critical.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

- Malicious Input Handling
- Escalation of privileges
- Arithmetic
- Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code4rena.com).

# Medium Risk Findings (6)
## [[M-01] IERC20.transfer does not support all ERC20 token](https://github.com/code-423n4/2022-05-runes-findings/issues/70)
_Submitted by VAD37, also found by AuditsAreUS, IllIllI, MaratCerby, rfa, and sorrynotsorry_

[ForgottenRunesWarriorsGuild.sol#L173-L176](https://github.com/code-423n4/2022-05-runes/blob/060b4f82b79c8308fe65674a39a07c44fa586cd3/contracts/ForgottenRunesWarriorsGuild.sol#L173-L176)<br>
[ForgottenRunesWarriorsMinter.sol#L627-L630](https://github.com/code-423n4/2022-05-runes/blob/060b4f82b79c8308fe65674a39a07c44fa586cd3/contracts/ForgottenRunesWarriorsMinter.sol#L627-L630)<br>

Token like [USDT](https://etherscan.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7#contracts) known for using non-standard ERC20. ([Missing return boolean on transfer](https://forum.openzeppelin.com/t/can-not-call-the-function-approve-of-the-usdt-contract/2130/4)).

Contract function [forwardERC20](https://github.com/code-423n4/2022-05-runes/blob/060b4f82b79c8308fe65674a39a07c44fa586cd3/contracts/ForgottenRunesWarriorsGuild.sol#L173-L176) will always revert when try to transfer this kind of tokens.

### Impact

Cannot withdraw some special ERC20 token through contract call. Unexpected contract functionality = Medium severity

### Recommended Mitigation Steps

Use [SafeTransferLib.safeTransfer](https://github.com/Rari-Capital/solmate/blob/4197b521ef3eb81f675d35e64b7b597b24d33500/src/utils/SafeTransferLib.sol#L65-L94) instead of IERC20 transfer. This accepts ERC20 token with no boolean return like USDT.

**[cryppadotta (Forgotten Runes) confirmed and commented](https://github.com/code-423n4/2022-05-runes-findings/issues/70#issuecomment-1118097813):**
 > Ah nice. You learn something new every day. Thanks!

**[KenzoAgada (warden) commented](https://github.com/code-423n4/2022-05-runes-findings/issues/70#issuecomment-1147126705):**
 > Description is pretty much invalid as "[forwardERC20](https://github.com/code-423n4/2022-05-runes/blob/060b4f82b79c8308fe65674a39a07c44fa586cd3/contracts/ForgottenRunesWarriorsGuild.sol#L173-L176) will always revert when try to transfer this kind of tokens" is simply not true. Same with impact - "Cannot withdraw some special ERC20 token through contract call" - that's not the impact, using SafeERC20's transfer will not help to transfer tokens. It will just revert on failure.
> But generally the issue of not using SafeERC20 is kinda-correct. Duplicate of [#2](https://github.com/code-423n4/2022-05-runes-findings/issues/2).

**[gzeon (judge) commented](https://github.com/code-423n4/2022-05-runes-findings/issues/70#issuecomment-1159516016):**
 > This is not a duplicate of [#2](https://github.com/code-423n4/2022-05-runes-findings/issues/2). #2 describes the silent failure of ERC20 transfer, while this describes a ERC20 that return void instead of bool. The call will revert even if the transfer is successful because Solidity expected a return value. Judging as Med Risk because unlike #2, here you can actually do something to fix the function.

**[KenzoAgada (warden) commented](https://github.com/code-423n4/2022-05-runes-findings/issues/70#issuecomment-1159630893):**
 > I apologize, my mistake.



***

## [[M-02] Contract may not have enough fund to cover refund](https://github.com/code-423n4/2022-05-runes-findings/issues/187)
_Submitted by gzeon, also found by AuditsAreUS, BowTiedWardens, pedroais, Ruhum, shenwilly, and teddav_

Owner of the contract can call `withdrawAll` before the refund process is done to send all ETH to the vault. Since there are no payable receive function in `ForgottenRunesWarriorsMinter`, the owner won't be able to replenish the contract for the refund process.

### Proof of Concept

[ForgottenRunesWarriorsMinter.sol#L616-L619](https://github.com/code-423n4/2022-05-runes/blob/060b4f82b79c8308fe65674a39a07c44fa586cd3/contracts/ForgottenRunesWarriorsMinter.sol#L616-L619)<br>

```solidity
    function withdrawAll() public payable onlyOwner {
        require(address(vault) != address(0), 'no vault');
        require(payable(vault).send(address(this).balance));
    }
```

### Recommended Mitigation Steps

Only allow owner to call `withdrawAll` after refund period.

**[cryppadotta (Forgotten Runes) confirmed and commented](https://github.com/code-423n4/2022-05-runes-findings/issues/187#issuecomment-1119768097):**
 > This is a great point. It would be annoying to accidentally do this and have to make a new contract for refunds.

**[gzeon (judge) commented](https://github.com/code-423n4/2022-05-runes-findings/issues/187#issuecomment-1159518087):**
 > Sponsor confirmed, submitted by contest judge.



***

## [[M-03] Critical variables shouldn't be changed after they are set](https://github.com/code-423n4/2022-05-runes-findings/issues/38)
_Submitted by pedroais, also found by AuditsAreUS, BowTiedWardens, defsec, GimelSec, gzeon, IllIllI, leastwood, and WatchPug_

[ForgottenRunesWarriorsMinter.sol#L564](https://github.com/code-423n4/2022-05-runes/blob/060b4f82b79c8308fe65674a39a07c44fa586cd3/contracts/ForgottenRunesWarriorsMinter.sol#L564)<br>
[ForgottenRunesWarriorsMinter.sol#L571](https://github.com/code-423n4/2022-05-runes/blob/060b4f82b79c8308fe65674a39a07c44fa586cd3/contracts/ForgottenRunesWarriorsMinter.sol#L571)<br>
[ForgottenRunesWarriorsMinter.sol#L557](https://github.com/code-423n4/2022-05-runes/blob/060b4f82b79c8308fe65674a39a07c44fa586cd3/contracts/ForgottenRunesWarriorsMinter.sol#L557)<br>
[ForgottenRunesWarriorsMinter.sol#L571](https://github.com/code-423n4/2022-05-runes/blob/060b4f82b79c8308fe65674a39a07c44fa586cd3/contracts/ForgottenRunesWarriorsMinter.sol#L571)<br>

The price for the dutch auction could be altered.

### Proof of Concept

I previously sent an issue about start time being settable more than once. This also happens for many other variables. Since they are many I will send them all in a single issue.

The following functions should only be called once to ensure trustlessness and integrity of the dutch auction:<br>
setDaPriceCurveLength<br>
setStartPrice<br>
setLowestPrice<br>
setDaDropInterval<br>

The price in the dutch auction is computed by this formula:<br>
uint256 dropPerStep = (startPrice - lowestPrice) /<br>
(daPriceCurveLength / daDropInterval);<br>

By making dapriceCurveLength or daDropInterval equal to 0 the owner could stop the auction. This could benefit the owner since the price lowers with time and everyone pays the final lower price. If the auction does well at the beginning the owner could stop the auction to stop the price from being lower. This works against the integrity of the dutch auction.

Also changing the Start Price or the Lowest price in the middle of the auction could allow the owner to manipulate the price.

### Recommended Mitigation Steps

To each of these setter functions add require (variable == 0) to ensure they are set once in a permanent way. Also, the Lowest price < startPrice should be required.

**[gzeon (judge) commented](https://github.com/code-423n4/2022-05-runes-findings/issues/38#issuecomment-1159524932):**
 > While centralization risk is acknowledged by the team, I agree that these variable should not be able to be changed during sale since it may lead to loss of functionality. Consolidating all similar issue for different variables here. 



***

## [[M-04] Many unbounded and under-constrained variables in the system can lead to unfair price or DoS](https://github.com/code-423n4/2022-05-runes-findings/issues/27)
_Submitted by throttle, also found by 0xDjango, BowTiedWardens, defsec, dipp, fatherOfBlocks, gzeon, hake, reassor, shung, unforgiven, and WatchPug_

Unbounded and under-constrained variables.

#### Proof of Concept

1.  `dsStartTime` | `daPriceCurveLength` | `daDropInterval`

The team can change the above variables during sale. It will either increase or decrease the price of an NFT. Or it can make `currentDaPrice()` revert.

```javascript
uint256 dropPerStep = (startPrice - lowestPrice) / (daPriceCurveLength / daDropInterval);

uint256 elapsed = block.timestamp - daStartTime;
uint256 steps = elapsed / daDropInterval;
uint256 stepDeduction = steps * dropPerStep;

// don't go negative in the next step
if (stepDeduction > startPrice) {
    return lowestPrice;
}
uint256 currentPrice = startPrice - stepDeduction;
```

[ForgottenRunesWarriorsMinter.sol#L275-L297](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L275-L297)<br>

2.  `dsStartTime` | `mintlistStartTime` | `publicStartTime` | `claimsStartTime`  `selfRefundsStartTime`

The team can change the above variables. It can result in the wrong sale phases order. For example, the public sale can end up being before every other phase due to accidentally setting it to 0.

### Recommended Mitigation Steps

Possible mitigation:

1.  Bound and constrain variables.<br>
For example, daDropInterval should be less than daPriceCurveLength<br>
Another example: The total sum of each supply phase should not be bigger than `MAX_SUPPLY` in the NFT smart contract.

**[wagmiwiz (Forgotten Runes) commented](https://github.com/code-423n4/2022-05-runes-findings/issues/27#issuecomment-1118375680):**
 > This is true but is a low operational risk and can be undone.

**[gzeon (judge) commented](https://github.com/code-423n4/2022-05-runes-findings/issues/27#issuecomment-1159534380):**
 > Decided to consolidate all issues regarding missing validation of the listed variables here (M-04).



***

## [[M-05] Use of `.send()` May Revert if The Recipient's Fallback Function Consumes More Than 2300 Gas](https://github.com/code-423n4/2022-05-runes-findings/issues/254)
_Submitted by leastwood, also found by 0xliumin, berndartmueller, cccz, Czar102, gzeon, hickuphh3, horsefacts, ilan, IllIllI, joestakey, m9800, p4st13r4, peritoflores, reassor, rfa, robee, sorrynotsorry, tintin, TrungOre, VAD37, WatchPug, and z3s_

[ForgottenRunesWarriorsMinter.sol#L610](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L610)<br>
[ForgottenRunesWarriorsMinter.sol#L618](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L618)<br>
[ForgottenRunesWarriorsGuild.sol#L164](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsGuild.sol#L164)<br>

The `.send()` function intends to transfer an ETH amount with a fixed amount of 2300 gas. This function is not equipped to handle changes in the underlying `.send()` and `.transfer()` functions which may supply different amounts of gas in the future. Additionally, if the recipient implements a fallback function containing some sort of logic, this may inevitably revert, meaning the vault and owner of the contract will never be able to call certain sensitive functions.

### Recommended Mitigation Steps

Consider using `.call()` instead with the checks-effects-interactions pattern implemented correctly. Careful consideration needs to be made to prevent reentrancy.

**[gzeon (judge) commented](https://github.com/code-423n4/2022-05-runes-findings/issues/254#issuecomment-1159542053):**
 > Determined the stake is high here and therefore Medium Risk.



***

## [[M-06] The owner can mint all of the NFTs.](https://github.com/code-423n4/2022-05-runes-findings/issues/104)
*Submitted by Kulk0, also found by 0x1f8b, 0xDjango, BowTiedWardens, broccolirob, defsec, Dinddle, dirk_y, hyh, rajatbeladiya, Ruhum, throttle, and unforgiven*

[ForgottenRunesWarriorsMinter.sol#L257](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L257)<br>

In ForgottenRunesWarriorsMinter.teamSummon() the owner can mint unrestricted amount of NFTs. This is more of a design issue than an actual bug in my opinion.

### Proof of Concept

If the private keys were compromised during the launch the attacker could mint almost all of the NFTs. Normally I wouldn't say this is an issue but from your documentation, I understand that you are not planning to use a multi-sig wallet for the owner of the contracts. I definitely don't want to say that you are incompetent and you can't store your private keys safely but private keys are getting compromised very often in this space.

### Recommended Mitigation Steps

Limit how many NFTs can the owner mint. So even if the private keys were compromised the attacker couldn't destroy the entire set by minting thousands of the NFTs to himself making the entire set worth nothing.

I also think this will help with the trust of the protocol since the buyers will know exactly how many NFTs can the Dev Team mint for themselves.

**[cryppadotta (Forgotten Runes) acknowledged and commented](https://github.com/code-423n4/2022-05-runes-findings/issues/104#issuecomment-1118089191):**
 > This is true, but by design. It's a risk for minters, but it would be obvious, so we're economically disincentivized to do this. Acknowledged, but not changing it.

**[gzeon (judge) marked as Invalid and commented](https://github.com/code-423n4/2022-05-runes-findings/issues/104#issuecomment-1159522220):**
 > Sponsor acknowledged centralization risk in README.

**[dmitriia (warden) commented](https://github.com/code-423n4/2022-05-runes-findings/issues/104#issuecomment-1159581039):**
 > Centralization risk in general is one thing, the ability for unlimited mint, which is easily fixable, is another.
> 
> A kind of a boundary state here in my opinion, having 'acknowledged' and 'invalid' flags in the same time poses some contradiction.

**[gzeon (judge) reassessed as Medium severity and commented](https://github.com/code-423n4/2022-05-runes-findings/issues/104#issuecomment-1159762761):**
 > Judging this as Med Risk since there are specified amounts of teamSummon in the doc
> > Forgotten Council DAO Creators Fund (teamSummon): ~333<br>
> Team & Partners (teamSummon): ~325<br>
> Community Honoraries and Contests (teamSummon): ~50<br>
> 
> which is not enforced in the `teamSummon` function.



***

# Low Risk and Non-Critical Issues

For this contest, 75 reports were submitted by wardens detailing low risk and non-critical issues. The [report highlighted below](https://github.com/code-423n4/2022-05-runes-findings/issues/225) by **defsec** received the top score from the judge.

*The following wardens also submitted reports: [reassor](https://github.com/code-423n4/2022-05-runes-findings/issues/44), [IllIllI](https://github.com/code-423n4/2022-05-runes-findings/issues/47), [hubble](https://github.com/code-423n4/2022-05-runes-findings/issues/174), [rotcivegaf](https://github.com/code-423n4/2022-05-runes-findings/issues/142), [hake](https://github.com/code-423n4/2022-05-runes-findings/issues/90), [horsefacts](https://github.com/code-423n4/2022-05-runes-findings/issues/270), [throttle](https://github.com/code-423n4/2022-05-runes-findings/issues/28), [AuditsAreUS](https://github.com/code-423n4/2022-05-runes-findings/issues/64), [berndartmueller](https://github.com/code-423n4/2022-05-runes-findings/issues/229), [BowTiedWardens](https://github.com/code-423n4/2022-05-runes-findings/issues/179), [hickuphh3](https://github.com/code-423n4/2022-05-runes-findings/issues/119), [hyh](https://github.com/code-423n4/2022-05-runes-findings/issues/257), [joestakey](https://github.com/code-423n4/2022-05-runes-findings/issues/249), [robee](https://github.com/code-423n4/2022-05-runes-findings/issues/155), [Ruhum](https://github.com/code-423n4/2022-05-runes-findings/issues/36), [shung](https://github.com/code-423n4/2022-05-runes-findings/issues/202), [sorrynotsorry](https://github.com/code-423n4/2022-05-runes-findings/issues/205), [sseefried](https://github.com/code-423n4/2022-05-runes-findings/issues/215), [leastwood](https://github.com/code-423n4/2022-05-runes-findings/issues/258), [pedroais](https://github.com/code-423n4/2022-05-runes-findings/issues/238), [TerrierLover](https://github.com/code-423n4/2022-05-runes-findings/issues/50), [VAD37](https://github.com/code-423n4/2022-05-runes-findings/issues/72), [WatchPug](https://github.com/code-423n4/2022-05-runes-findings/issues/135), [0xDjango](https://github.com/code-423n4/2022-05-runes-findings/issues/209), [catchup](https://github.com/code-423n4/2022-05-runes-findings/issues/54), [delfin454000](https://github.com/code-423n4/2022-05-runes-findings/issues/248), [ilan](https://github.com/code-423n4/2022-05-runes-findings/issues/153), [kebabsec](https://github.com/code-423n4/2022-05-runes-findings/issues/216), [kenta](https://github.com/code-423n4/2022-05-runes-findings/issues/137), [MaratCerby](https://github.com/code-423n4/2022-05-runes-findings/issues/9), [p4st13r4](https://github.com/code-423n4/2022-05-runes-findings/issues/143), [pauliax](https://github.com/code-423n4/2022-05-runes-findings/issues/234), [rfa](https://github.com/code-423n4/2022-05-runes-findings/issues/243), [shenwilly](https://github.com/code-423n4/2022-05-runes-findings/issues/74), [tintin](https://github.com/code-423n4/2022-05-runes-findings/issues/97), [0x1f8b](https://github.com/code-423n4/2022-05-runes-findings/issues/12), [0x52](https://github.com/code-423n4/2022-05-runes-findings/issues/120), [0xf15ers](https://github.com/code-423n4/2022-05-runes-findings/issues/114), [0xkatana](https://github.com/code-423n4/2022-05-runes-findings/issues/127), [0xliumin](https://github.com/code-423n4/2022-05-runes-findings/issues/117), [cccz](https://github.com/code-423n4/2022-05-runes-findings/issues/7), [csanuragjain](https://github.com/code-423n4/2022-05-runes-findings/issues/69), [dirk_y](https://github.com/code-423n4/2022-05-runes-findings/issues/149), [eccentricexit](https://github.com/code-423n4/2022-05-runes-findings/issues/95), [fatherOfBlocks](https://github.com/code-423n4/2022-05-runes-findings/issues/268), [Funen](https://github.com/code-423n4/2022-05-runes-findings/issues/280), [GimelSec](https://github.com/code-423n4/2022-05-runes-findings/issues/145), [hansfriese](https://github.com/code-423n4/2022-05-runes-findings/issues/52), [Hawkeye](https://github.com/code-423n4/2022-05-runes-findings/issues/173), [kenzo](https://github.com/code-423n4/2022-05-runes-findings/issues/84), [rajatbeladiya](https://github.com/code-423n4/2022-05-runes-findings/issues/60), [teddav](https://github.com/code-423n4/2022-05-runes-findings/issues/219), [TrungOre](https://github.com/code-423n4/2022-05-runes-findings/issues/91), [unforgiven](https://github.com/code-423n4/2022-05-runes-findings/issues/154), [z3s](https://github.com/code-423n4/2022-05-runes-findings/issues/102), [0v3rf10w](https://github.com/code-423n4/2022-05-runes-findings/issues/171), [0x4non](https://github.com/code-423n4/2022-05-runes-findings/issues/82), [broccolirob](https://github.com/code-423n4/2022-05-runes-findings/issues/279), [CertoraInc](https://github.com/code-423n4/2022-05-runes-findings/issues/224), [Cr4ckM3](https://github.com/code-423n4/2022-05-runes-findings/issues/77), [cryptphi](https://github.com/code-423n4/2022-05-runes-findings/issues/123), [ellahi](https://github.com/code-423n4/2022-05-runes-findings/issues/263), [Kulk0](https://github.com/code-423n4/2022-05-runes-findings/issues/101), [M0ndoHEHE](https://github.com/code-423n4/2022-05-runes-findings/issues/220), [m9800](https://github.com/code-423n4/2022-05-runes-findings/issues/189), [marximimus](https://github.com/code-423n4/2022-05-runes-findings/issues/278), [minhquanym](https://github.com/code-423n4/2022-05-runes-findings/issues/110), [oyc_109](https://github.com/code-423n4/2022-05-runes-findings/issues/4), [peritoflores](https://github.com/code-423n4/2022-05-runes-findings/issues/276), [Picodes](https://github.com/code-423n4/2022-05-runes-findings/issues/159), [plotchy](https://github.com/code-423n4/2022-05-runes-findings/issues/42), [samruna](https://github.com/code-423n4/2022-05-runes-findings/issues/20), [simon135](https://github.com/code-423n4/2022-05-runes-findings/issues/160), and [gzeon](https://github.com/code-423n4/2022-05-runes-findings/issues/180).*

## ISSUE LIST

**[01]: Missing events for only functions that change critical parameters - Non Critical**<br>
**[02] : Critical changes should use two-step procedure - Non Critical**<br>
**[03] : Pragma Version - Non Critical**<br>
**[04] : Missing zero-address check in the setter functions and initializers - Low**<br>
**[05] :  transferOwnership should be two step - Non critical**<br>
**[06] :  Bump OZ packages to ^4.5.0. - Non critical**<br>
**[07] :  Use safeTransfer/safeTransferFrom consistently instead of transfer/transferFrom - Non critical**<br>
**[08] :  Front-running is possible over the bidding mechanism - Low**<br>

## [01] Missing events for only functions that change critical parameters

The afunctions that change critical parameters should emit events. Events allow capturing the changed parameters so that off-chain tools/interfaces can register such changes with timelocks that allow users to evaluate them and consider if they would like to engage/exit based on how they perceive the changes as affecting the trustworthiness of the protocol or profitability of the implemented financial services. The alternative of directly querying on-chain contract state for such changes is not considered practical for most users/usages.

Missing events and timelocks do not promote transparency and if such changes immediately affect users’ perception of fairness or trustworthiness, they could exit the protocol causing a reduction in liquidity which could negatively impact protocol TVL and reputation.

### Proof of Concept

Navigate to the following contracts.

[ForgottenRunesWarriorsMinter.sol#L441](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L441)<br>
[ForgottenRunesWarriorsMinter.sol#L448](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L448)<br>
[ForgottenRunesWarriorsMinter.sol#L455](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L455)<br>
[ForgottenRunesWarriorsMinter.sol#L462](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L462)<br>
[ForgottenRunesWarriorsMinter.sol#L469](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L469)<br>
[ForgottenRunesWarriorsMinter.sol#L480](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L480)<br>

See similar High-severity H03 finding OpenZeppelin’s Audit of Audius (https://blog.openzeppelin.com/audius-contracts-audit/#high) and Medium-severity M01 finding OpenZeppelin’s Audit of UMA Phase 4 (https://blog.openzeppelin.com/uma-audit-phase-4/)

### Recommended Mitigation Steps

Add events to all functions that change critical parameters.

## [02] Critical changes should use two-step procedure

The critical procedures should be two step process.

### Proof of Concept

Navigate to the following contracts.

[ForgottenRunesWarriorsMinter.sol#L441](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L441)<br>
[ForgottenRunesWarriorsMinter.sol#L448](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L448)<br>
[ForgottenRunesWarriorsMinter.sol#L455](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L455)<br>
[ForgottenRunesWarriorsMinter.sol#L462](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L462)<br>
[ForgottenRunesWarriorsMinter.sol#L469](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L469)<br>
[ForgottenRunesWarriorsMinter.sol#L480](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L480)<br>

### Recommended Mitigation Steps

Lack of two-step procedure for critical operations leaves them error-prone. Consider adding two step procedure on the critical functions.

## [03] Pragma Version

In the contracts, floating pragmas should not be used. Contracts should be deployed with the same compiler version and flags that they have been tested with thoroughly. Locking the pragma helps to ensure that contracts do not accidentally get deployed using, for example, an outdated compiler version that might introduce bugs that affect the contract system negatively.

### Proof of Concept

https://swcregistry.io/docs/SWC-103

```
All Contracts
```

### Recommended Mitigation Steps
Lock the pragma version: delete pragma solidity 0.8.10 in favor of pragma solidity 0.8.10.

## [04] Missing zero-address check in the setter functions and initializers

Missing checks for zero-addresses may lead to infunctional protocol, if the variable addresses are updated incorrectly.

### Proof of Concept

Navigate to the following contracts.

[ForgottenRunesWarriorsMinter.sol#L544](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L544)<br>
[ForgottenRunesWarriorsMinter.sol#L528](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L528)<br>

### Recommended Mitigation Steps

Consider adding zero-address checks in the discussed constructors:
require(newAddr != address(0));.

## [05] transferOwnership should be two step

The owner is the authorized user in the solidity contracts. Usually, an owner can be updated with transferOwnership function. However, the process is only completed with single transaction. If the address is updated incorrectly, an owner functionality will be lost forever.

### Proof of Concept

Navigate to the following contracts.

[ForgottenRunesWarriorsMinter.sol#L15](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L15)<br>
[ForgottenRunesWarriorsGuild.sol#L14](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsGuild.sol#L14)<br>

### Recommended Mitigation Steps

Lack of two-step procedure for critical operations leaves them error-prone. Consider adding two step procedure on the critical functions.

## [06] Bump OZ packages to ^4.5.0.

Line Reference: [package.json#L68](https://github.com/code-423n4/2022-05-runes/blob/main/package.json#L68)

### Description

I can verify that the installed version is 4.2.0 by executing the following commands:

```
yarn install
yarn list @openzeppelin/contracts

```

### Recommended Mitigation Steps

Update the versions of @openzeppelin/contracts and @openzeppelin/contracts-upgradeable to be the latest in package.json. I also recommend double checking the versions of other dependencies as a precaution, as they may include important bug fixes.

## [07] Use safeTransfer/safeTransferFrom consistently instead of transfer/transferFrom

It is good to add a require() statement that checks the return value of token transfers or to use something like OpenZeppelin’s safeTransfer/safeTransferFrom unless one is sure the given token reverts in case of a failure. Failure to do so will cause silent failures of transfers and affect token accounting in contract.

Reference: This similar medium-severity finding from Consensys Diligence Audit of Fei Protocol: https://consensys.net/diligence/audits/2021/01/fei-protocol/#unchecked-return-value-for-iweth-transfer-call

### Proof of Concept

1. Navigate to the following contract.

2. transfer/transferFrom functions are used instead of safe transfer/transferFrom on the following contracts.

[ForgottenRunesWarriorsGuild.sol#L175](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsGuild.sol#L175)<br>

### Recommended Mitigation Steps

Consider using safeTransfer/safeTransferFrom or require() consistently.

## [08] Front-running is possible over the minting process

During the code review, it has been noticed that to bidding mechanism is vulnerable to front-running. The bidding mechanism can have EOA check on the contract. 

### Proof of Concept

1. Navigate to the following contract.

2. The contract does not check for the External Owned Accounts. Without the check, any contract can interact with the function. 

[ForgottenRunesWarriorsMinter.sol#L120](https://github.com/code-423n4/2022-05-runes/blob/main/contracts/ForgottenRunesWarriorsMinter.sol#L120)<br>

### Recommended Mitigation Steps

Consider to check EOA at the beginning of the function.

```
msg.sender == tx.origin && !isContract(msg.sender)
```



***

# Gas Optimizations

For this contest, 73 reports were submitted by wardens detailing gas optimizations. The [report highlighted below](https://github.com/code-423n4/2022-05-runes-findings/issues/177) by **BowTiedWardens** received the top score from the judge.

*The following wardens also submitted reports: [joestakey](https://github.com/code-423n4/2022-05-runes-findings/issues/233), [FSchmoede](https://github.com/code-423n4/2022-05-runes-findings/issues/100), [defsec](https://github.com/code-423n4/2022-05-runes-findings/issues/105), [0xkatana](https://github.com/code-423n4/2022-05-runes-findings/issues/126), [horsefacts](https://github.com/code-423n4/2022-05-runes-findings/issues/240), [hickuphh3](https://github.com/code-423n4/2022-05-runes-findings/issues/118), [WatchPug](https://github.com/code-423n4/2022-05-runes-findings/issues/134), [reassor](https://github.com/code-423n4/2022-05-runes-findings/issues/45), [IllIllI](https://github.com/code-423n4/2022-05-runes-findings/issues/46), [rotcivegaf](https://github.com/code-423n4/2022-05-runes-findings/issues/138), [kenzo](https://github.com/code-423n4/2022-05-runes-findings/issues/93), [0x4non](https://github.com/code-423n4/2022-05-runes-findings/issues/81), [0xliumin](https://github.com/code-423n4/2022-05-runes-findings/issues/116), [catchup](https://github.com/code-423n4/2022-05-runes-findings/issues/55), [kenta](https://github.com/code-423n4/2022-05-runes-findings/issues/136), [marximimus](https://github.com/code-423n4/2022-05-runes-findings/issues/277), [rfa](https://github.com/code-423n4/2022-05-runes-findings/issues/245), [robee](https://github.com/code-423n4/2022-05-runes-findings/issues/156), [shung](https://github.com/code-423n4/2022-05-runes-findings/issues/203), [TerrierLover](https://github.com/code-423n4/2022-05-runes-findings/issues/51), [saian](https://github.com/code-423n4/2022-05-runes-findings/issues/128), [sorrynotsorry](https://github.com/code-423n4/2022-05-runes-findings/issues/204), [0v3rf10w](https://github.com/code-423n4/2022-05-runes-findings/issues/170), [0x1f8b](https://github.com/code-423n4/2022-05-runes-findings/issues/13), [0xc0ffEE](https://github.com/code-423n4/2022-05-runes-findings/issues/21), [0xDjango](https://github.com/code-423n4/2022-05-runes-findings/issues/242), [0xf15ers](https://github.com/code-423n4/2022-05-runes-findings/issues/115), [0xNazgul](https://github.com/code-423n4/2022-05-runes-findings/issues/16), [antonttc](https://github.com/code-423n4/2022-05-runes-findings/issues/75), [CertoraInc](https://github.com/code-423n4/2022-05-runes-findings/issues/222), [Cityscape](https://github.com/code-423n4/2022-05-runes-findings/issues/207), [DavidGialdi](https://github.com/code-423n4/2022-05-runes-findings/issues/108), [ellahi](https://github.com/code-423n4/2022-05-runes-findings/issues/262), [GimelSec](https://github.com/code-423n4/2022-05-runes-findings/issues/146), [hake](https://github.com/code-423n4/2022-05-runes-findings/issues/92), [ilan](https://github.com/code-423n4/2022-05-runes-findings/issues/152), [MiloTruck](https://github.com/code-423n4/2022-05-runes-findings/issues/144), [minhquanym](https://github.com/code-423n4/2022-05-runes-findings/issues/111), [oyc_109](https://github.com/code-423n4/2022-05-runes-findings/issues/3), [Picodes](https://github.com/code-423n4/2022-05-runes-findings/issues/158), [slywaters](https://github.com/code-423n4/2022-05-runes-findings/issues/106), [throttle](https://github.com/code-423n4/2022-05-runes-findings/issues/29), [TrungOre](https://github.com/code-423n4/2022-05-runes-findings/issues/83), [VAD37](https://github.com/code-423n4/2022-05-runes-findings/issues/71), [Kulk0](https://github.com/code-423n4/2022-05-runes-findings/issues/107), [M0ndoHEHE](https://github.com/code-423n4/2022-05-runes-findings/issues/214), [p4st13r4](https://github.com/code-423n4/2022-05-runes-findings/issues/141), [pauliax](https://github.com/code-423n4/2022-05-runes-findings/issues/235), [samruna](https://github.com/code-423n4/2022-05-runes-findings/issues/17), [simon135](https://github.com/code-423n4/2022-05-runes-findings/issues/161), [Tadashi](https://github.com/code-423n4/2022-05-runes-findings/issues/237), [0xProf](https://github.com/code-423n4/2022-05-runes-findings/issues/124), [ACai](https://github.com/code-423n4/2022-05-runes-findings/issues/18), [AlleyCat](https://github.com/code-423n4/2022-05-runes-findings/issues/1), [Cr4ckM3](https://github.com/code-423n4/2022-05-runes-findings/issues/76), [delfin454000](https://github.com/code-423n4/2022-05-runes-findings/issues/247), [Dinddle](https://github.com/code-423n4/2022-05-runes-findings/issues/260), [dirk_y](https://github.com/code-423n4/2022-05-runes-findings/issues/151), [eccentricexit](https://github.com/code-423n4/2022-05-runes-findings/issues/94), [fatherOfBlocks](https://github.com/code-423n4/2022-05-runes-findings/issues/253), [Funen](https://github.com/code-423n4/2022-05-runes-findings/issues/198), [hansfriese](https://github.com/code-423n4/2022-05-runes-findings/issues/35), [Hawkeye](https://github.com/code-423n4/2022-05-runes-findings/issues/175), [kebabsec](https://github.com/code-423n4/2022-05-runes-findings/issues/217), [MaratCerby](https://github.com/code-423n4/2022-05-runes-findings/issues/113), [noobie](https://github.com/code-423n4/2022-05-runes-findings/issues/169), [rajatbeladiya](https://github.com/code-423n4/2022-05-runes-findings/issues/62), [RoiEvenHaim](https://github.com/code-423n4/2022-05-runes-findings/issues/150), [shenwilly](https://github.com/code-423n4/2022-05-runes-findings/issues/73), [unforgiven](https://github.com/code-423n4/2022-05-runes-findings/issues/157), [z3s](https://github.com/code-423n4/2022-05-runes-findings/issues/103), and [gzeon](https://github.com/code-423n4/2022-05-runes-findings/issues/181).*

## Table of Contents

*   Caching storage values in memory
*   Unchecking arithmetics operations that can't underflow/overflow
*   Unnecessary `initialize()` function
*   `ForgottenRunesWarriorsGuild.forwardERC20s()` and `ForgottenRunesWarriorsMinter.forwardERC20s()`: Unnecessary require statements
*   `ForgottenRunesWarriorsMinter`: `bidSummon()`and `publicSummon()`: Unnecessary require statement
*   Boolean comparisons
*   `> 0` is less efficient than `!= 0` for unsigned integers (with proof)
*   `ForgottenRunesWarriorsMinter.currentDaPrice()`: `>` should be `>=`
*   Splitting `require()` statements that use `&&` saves gas
*   `++i` costs less gas compared to `i++` or `i += 1`
*   Increments can be unchecked
*   Public functions to external
*   No need to explicitly initialize variables with default values
*   Upgrade pragma to at least 0.8.4
*   Use `msg.sender` instead of OpenZeppelin's `_msgSender()` when meta-transactions capabilities aren't used
*   Use Custom Errors instead of Revert Strings to save Gas

## [G-01] Caching storage values in memory

The code can be optimized by minimising the number of SLOADs. SLOADs are expensive (100 gas) compared to MLOADs/MSTOREs (3 gas). Here, storage values should get cached in memory (see the `@audit` tags for further details):

```solidity
contracts/ForgottenRunesWarriorsGuild.sol:
  100:         require(numMinted < MAX_WARRIORS, 'All warriors have been summoned');  //@audit gas: numMinted SLOAD 1 (should declare tokenId earlier and use it instead)
  102:         uint256 tokenId = numMinted; //@audit gas: numMinted SLOAD 2 (should be declared earlier)
  104:         numMinted += 1;  //@audit gas: numMinted SLOAD 3 (should be numMinted = tokenId + 1)

contracts/ForgottenRunesWarriorsMinter.sol:
  136:         require(numSold < maxDaSupply, 'Auction sold out'); //@audit gas: numSold SLOAD 1, maxDaSupply SLOAD 1
  137:         require(numSold + numWarriors <= maxDaSupply, 'Not enough remaining'); //@audit gas: numSold SLOAD 2, maxDaSupply SLOAD 2
  154:         numSold += numWarriors; //@audit gas: numSold SLOAD 3 (equivalent to numSold = numSold + numWarriors)
  156:         if (numSold == maxDaSupply) { //@audit gas: numSold SLOAD 4, maxDaSupply SLOAD 3
  177:         require(numSold < maxForSale, 'Sold out'); //@audit gas: numSold SLOAD 1
  193:         numSold += 1; //@audit gas: numSold SLOAD 2 (equivalent to numSold = numSold + 1)
  207:         require(numSold < maxForSale, 'Sold out'); //@audit gas: numSold SLOAD 1, maxDaSupply SLOAD 1
  208:         require(numSold + numWarriors <= maxForSale, 'Not enough remaining'); //@audit gas: numSold SLOAD 2, maxDaSupply SLOAD 2
  219:         numSold += numWarriors; //@audit gas: numSold SLOAD 3 (equivalent to numSold = numSold + numWarriors)
  234:         require(numClaimed < maxForClaim, 'No more claims'); //@audit gas: numSold SLOAD 1
  248:         numClaimed += 1; //@audit gas: numSold SLOAD 2 (equivalent to numSold = numSold + 1)
  279:         if (block.timestamp >= daStartTime + daPriceCurveLength) {//@audit gas: daStartTime SLOAD 1, daPriceCurveLength SLOAD 1
  284:         uint256 dropPerStep = (startPrice - lowestPrice) / //@audit gas: startPrice SLOAD 1, lowestPrice SLOAD 1
  285:             (daPriceCurveLength / daDropInterval); //@audit gas: daPriceCurveLength SLOAD 2, daDropInterval SLOAD 1
  287:         uint256 elapsed = block.timestamp - daStartTime;//@audit gas: daStartTime SLOAD 2
  288:         uint256 steps = elapsed / daDropInterval; //@audit gas: daDropInterval SLOAD 2
  292:         if (stepDeduction > startPrice) { //@audit gas: startPrice SLOAD 2
  293:             return lowestPrice; //@audit gas: lowestPrice SLOAD 2
  295:         uint256 currentPrice = startPrice - stepDeduction; //@audit gas: startPrice SLOAD 3
  296:         return currentPrice > lowestPrice ? currentPrice : lowestPrice;  //@audit gas: lowestPrice SLOAD 2 & 3
  401:             IWETH(weth).deposit{value: amount}(); //@audit gas: weth SLOAD 1
  402:             IERC20(weth).transfer(to, amount); //@audit gas: weth SLOAD 2
  609:         require(address(vault) != address(0), 'no vault'); //@audit gas: vault SLOAD 1
  610:         require(payable(vault).send(_amount)); //@audit gas: vault SLOAD 2
  617:         require(address(vault) != address(0), 'no vault'); //@audit gas: vault SLOAD 1
  618:         require(payable(vault).send(address(this).balance)); //@audit gas: vault SLOAD 2
```

## [G-02] Unchecking arithmetics operations that can't underflow/overflow

Solidity version 0.8+ comes with implicit overflow and underflow checks on unsigned integers. When an overflow or an underflow isn't possible (as an example, when a comparison is made before the arithmetic operation), some gas can be saved by using an `unchecked` block: <https://docs.soliditylang.org/en/v0.8.10/control-structures.html#checked-or-unchecked-arithmetic>

I suggest wrapping L295 with an `unchecked` block (see `@audit`):

```solidity
File: ForgottenRunesWarriorsMinter.sol
291:         // don't go negative in the next step
292:         if (stepDeduction > startPrice) {
293:             return lowestPrice;
294:         }
295:         uint256 currentPrice = startPrice - stepDeduction; //@audit gas: should be unchecked due to L292-L293
```

## [G-03] Unnecessary `initialize()` function

The `initialize()` function isn't an initializer. It just calls `setMinter()`, which has the same visibility and authorization level as `initialize()`:

```solidity
File: ForgottenRunesWarriorsGuild.sol
52:     function initialize(address newMinter) public onlyOwner { 
53:         setMinter(newMinter);
54:     }
...
137:     function setMinter(address newMinter) public onlyOwner {
138:         minter = newMinter;
139:     }
```

It could even be called repeatedly.

As the `initialize()` function is not needed, I suggest deleting it and directly calling `setMinter()` to "Conveniently initialize the contract".

## [G-04] `ForgottenRunesWarriorsGuild.forwardERC20s()` and `ForgottenRunesWarriorsMinter.forwardERC20s()`: Unnecessary require statements

Here, as the `onlyOwner` modifier is applied, the `address(0)` checks are not needed here:

```solidity
contracts/ForgottenRunesWarriorsGuild.sol:
  173      function forwardERC20s(IERC20 token, uint256 amount) public onlyOwner {
  174:         require(address(msg.sender) != address(0)); //@audit gas: there's the onlyOwner modifier: msg.sender can't be address(0)
  175          token.transfer(msg.sender, amount);
  176      }

contracts/ForgottenRunesWarriorsMinter.sol:
  627      function forwardERC20s(IERC20 token, uint256 amount) public onlyOwner {
  628:         require(address(msg.sender) != address(0)); //@audit gas: there's the onlyOwner modifier: msg.sender can't be address(0)
  629          token.transfer(msg.sender, amount);
  630      }
```

I suggest removing these checks.

## [G-05] `ForgottenRunesWarriorsMinter`: `bidSummon()`and `publicSummon()`: Unnecessary require statement

The code is as such:

```solidity
File: ForgottenRunesWarriorsMinter.sol
130:     function bidSummon(uint256 numWarriors)
131:         external
132:         payable
133:         nonReentrant
134:         whenNotPaused
135:     {
136:         require(numSold < maxDaSupply, 'Auction sold out');
137:         require(numSold + numWarriors <= maxDaSupply, 'Not enough remaining');
138:         require(daStarted(), 'Auction not started');
139:         require(!mintlistStarted(), 'Auction phase over');
140:         require(
141:             numWarriors > 0 && numWarriors <= 20,
142:             'You can summon no more than 20 Warriors at a time'
143:         );
...
201:     function publicSummon(uint256 numWarriors)
202:         external
203:         payable
204:         nonReentrant
205:         whenNotPaused
206:     {
207:         require(numSold < maxForSale, 'Sold out');
208:         require(numSold + numWarriors <= maxForSale, 'Not enough remaining');
209:         require(publicStarted(), 'Public sale not started');
210:         require(
211:             numWarriors > 0 && numWarriors <= 20,
212:             'You can summon no more than 20 Warriors at a time'
213:         );
```

Logically speaking, `numSold + numWarriors <= maxForSale` could only reach the edge-case if `numWarriors == 0`, but that's prevented with the condition that follows in both functions: `numWarriors > 0 && numWarriors <= 20`.
Meaning that, with `numSold + numWarriors <= maxForSale` and `numWarriors > 0`, we don't need to check if `numSold < maxForSale` as it just can't happen.

I suggest removing the 2 `require(numSold < maxDaSupply)` checks L136 and L207.

Furthermore, notice that `'Not enough remaining'` and `'Sold out'` kinda mean the same thing, so the additionnal require statement might not be justified.

## [G-06] Boolean comparisons

Comparing to a constant (`true` or `false`) is a bit more expensive than directly checking the returned boolean value.
I suggest using `if(!directValue)` instead of `if(directValue == false)` here:

```solidity
ForgottenRunesWarriorsMinter.sol:182:        require(mintlistMinted[msg.sender] == false, 'Already minted');
ForgottenRunesWarriorsMinter.sol:238:        require(claimlistMinted[msg.sender] == false, 'Already claimed');
```

## [G-07] `> 0` is less efficient than `!= 0` for unsigned integers (with proof)

`!= 0` costs less gas compared to `> 0` for unsigned integers in `require` statements with the optimizer enabled (6 gas)

Proof: While it may seem that `> 0` is cheaper than `!=`, this is only true without the optimizer enabled and outside a require statement. If you enable the optimizer at 10k AND you're in a `require` statement, this will save gas. You can see this tweet for more proofs: <https://twitter.com/gzeon/status/1485428085885640706>

I suggest changing `> 0` with `!= 0` here:

```solidity
ForgottenRunesWarriorsMinter.sol:141:            numWarriors > 0 && numWarriors <= 20,
ForgottenRunesWarriorsMinter.sol:211:            numWarriors > 0 && numWarriors <= 20,
```

Also, please enable the Optimizer.

## [G-08] `ForgottenRunesWarriorsMinter.currentDaPrice()`: `>` should be `>=`

The return statement is as follows:

```solidity
ForgottenRunesWarriorsMinter.sol:296:        return currentPrice > lowestPrice ? currentPrice : lowestPrice;
```

Strict inequalities (`>`) are more expensive than non-strict ones (`>=`). This is due to some supplementary checks (ISZERO, 3 gas)\
Furthermore, `lowestPrice` is read from storage while `currentPrice` is read from memory.

Therefore, it's possible to always save 3 gas and sometimes further save 1 SLOAD (when `currentPrice == lowestPrice`) by replacing the code to:

```solidity
ForgottenRunesWarriorsMinter.sol:296:        return currentPrice >= lowestPrice ? currentPrice : lowestPrice;
```

## [G-09] Splitting `require()` statements that use `&&` saves gas

If you're using the Optimizer at 200, instead of using the `&&` operator in a single require statement to check multiple conditions, I suggest using multiple require statements with 1 condition per require statement:

```solidity
contracts/ForgottenRunesWarriorsMinter.sol:
  140          require(
  141:             numWarriors > 0 && numWarriors <= 20,
  142              'You can summon no more than 20 Warriors at a time'
  143          );

  210          require(
  211:             numWarriors > 0 && numWarriors <= 20,
  212              'You can summon no more than 20 Warriors at a time'
  213          );
```

## [G-10] `++i` costs less gas compared to `i++` or `i += 1`

`++i` costs less gas compared to `i++` or `i += 1` for unsigned integer, as pre-increment is cheaper (about 5 gas per iteration). This statement is true even with the optimizer enabled.

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
ForgottenRunesWarriorsGuild.sol:104:        numMinted += 1;
ForgottenRunesWarriorsMinter.sol:162:        for (uint256 i = 0; i < numWarriors; i++) {
ForgottenRunesWarriorsMinter.sol:193:        numSold += 1;
ForgottenRunesWarriorsMinter.sol:220:        for (uint256 i = 0; i < numWarriors; i++) {
ForgottenRunesWarriorsMinter.sol:248:        numClaimed += 1;
ForgottenRunesWarriorsMinter.sol:259:        for (uint256 i = 0; i < count; i++) {
ForgottenRunesWarriorsMinter.sol:355:        for (uint256 i = startIdx; i < endIdx + 1; i++) {
```

I suggest using `++i` instead of `i++` to increment the value of an uint variable.

## [G-11] Increments can be unchecked

In Solidity 0.8+, there's a default overflow check on unsigned integers. It's possible to uncheck this in for-loops and save some gas at each iteration, but at the cost of some code readability, as this uncheck cannot be made inline.

[ethereum/solidity#10695](https://github.com/ethereum/solidity/issues/10695)

Instances include:

```solidity
ForgottenRunesWarriorsMinter.sol:162:        for (uint256 i = 0; i < numWarriors; i++) {
ForgottenRunesWarriorsMinter.sol:220:        for (uint256 i = 0; i < numWarriors; i++) {
ForgottenRunesWarriorsMinter.sol:259:        for (uint256 i = 0; i < count; i++) {
ForgottenRunesWarriorsMinter.sol:355:        for (uint256 i = startIdx; i < endIdx + 1; i++) {
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

The risk of overflow is inexistant for a `uint256` here.

## [G-12] Public functions to external

The following functions could be set external to save gas and improve code quality.
External call cost is less expensive than of public functions.

```solidity
initialize(address) should be declared external:
 - ForgottenRunesWarriorsGuild.initialize(address) (contracts/ForgottenRunesWarriorsGuild.sol#52-54)
exists(uint256) should be declared external:
 - ForgottenRunesWarriorsGuild.exists(uint256) (contracts/ForgottenRunesWarriorsGuild.sol#85-87)
setProvenanceHash(string) should be declared external:
 - ForgottenRunesWarriorsGuild.setProvenanceHash(string) (contracts/ForgottenRunesWarriorsGuild.sol#145-147)
withdrawAll() should be declared external:
 - ForgottenRunesWarriorsGuild.withdrawAll() (contracts/ForgottenRunesWarriorsGuild.sol#163-165)
forwardERC20s(IERC20,uint256) should be declared external:
 - ForgottenRunesWarriorsGuild.forwardERC20s(IERC20,uint256) (contracts/ForgottenRunesWarriorsGuild.sol#173-176)
numDaMinters() should be declared external:
 - ForgottenRunesWarriorsMinter.numDaMinters() (contracts/ForgottenRunesWarriorsMinter.sol#337-339)
issueRefunds(uint256,uint256) should be declared external:
 - ForgottenRunesWarriorsMinter.issueRefunds(uint256,uint256) (contracts/ForgottenRunesWarriorsMinter.sol#350-358)
refundAddress(address) should be declared external:
 - ForgottenRunesWarriorsMinter.refundAddress(address) (contracts/ForgottenRunesWarriorsMinter.sol#364-366)
selfRefund() should be declared external:
 - ForgottenRunesWarriorsMinter.selfRefund() (contracts/ForgottenRunesWarriorsMinter.sol#371-374)
pause() should be declared external:
 - ForgottenRunesWarriorsMinter.pause() (contracts/ForgottenRunesWarriorsMinter.sol#427-429)
unpause() should be declared external:
 - ForgottenRunesWarriorsMinter.unpause() (contracts/ForgottenRunesWarriorsMinter.sol#434-436)
setSelfRefundsStartTime(uint256) should be declared external:
 - ForgottenRunesWarriorsMinter.setSelfRefundsStartTime(uint256) (contracts/ForgottenRunesWarriorsMinter.sol#469-471)
setPhaseTimes(uint256,uint256,uint256,uint256) should be declared external:
 - ForgottenRunesWarriorsMinter.setPhaseTimes(uint256,uint256,uint256,uint256) (contracts/ForgottenRunesWarriorsMinter.sol#480-500)
setMintlist1MerkleRoot(bytes32) should be declared external:
 - ForgottenRunesWarriorsMinter.setMintlist1MerkleRoot(bytes32) (contracts/ForgottenRunesWarriorsMinter.sol#505-507)
setMintlist2MerkleRoot(bytes32) should be declared external:
 - ForgottenRunesWarriorsMinter.setMintlist2MerkleRoot(bytes32) (contracts/ForgottenRunesWarriorsMinter.sol#513-515)
setClaimlistMerkleRoot(bytes32) should be declared external:
 - ForgottenRunesWarriorsMinter.setClaimlistMerkleRoot(bytes32) (contracts/ForgottenRunesWarriorsMinter.sol#520-522)
setStartPrice(uint256) should be declared external:
 - ForgottenRunesWarriorsMinter.setStartPrice(uint256) (contracts/ForgottenRunesWarriorsMinter.sol#550-552)
setLowestPrice(uint256) should be declared external:
 - ForgottenRunesWarriorsMinter.setLowestPrice(uint256) (contracts/ForgottenRunesWarriorsMinter.sol#557-559)
setDaPriceCurveLength(uint256) should be declared external:
 - ForgottenRunesWarriorsMinter.setDaPriceCurveLength(uint256) (contracts/ForgottenRunesWarriorsMinter.sol#564-566)
setDaDropInterval(uint256) should be declared external:
 - ForgottenRunesWarriorsMinter.setDaDropInterval(uint256) (contracts/ForgottenRunesWarriorsMinter.sol#571-573)
setFinalPrice(uint256) should be declared external:
 - ForgottenRunesWarriorsMinter.setFinalPrice(uint256) (contracts/ForgottenRunesWarriorsMinter.sol#579-581)
setMaxDaSupply(uint256) should be declared external:
 - ForgottenRunesWarriorsMinter.setMaxDaSupply(uint256) (contracts/ForgottenRunesWarriorsMinter.sol#586-588)
setMaxForSale(uint256) should be declared external:
 - ForgottenRunesWarriorsMinter.setMaxForSale(uint256) (contracts/ForgottenRunesWarriorsMinter.sol#593-595)
setMaxForClaim(uint256) should be declared external:
 - ForgottenRunesWarriorsMinter.setMaxForClaim(uint256) (contracts/ForgottenRunesWarriorsMinter.sol#600-602)
withdraw(uint256) should be declared external:
 - ForgottenRunesWarriorsMinter.withdraw(uint256) (contracts/ForgottenRunesWarriorsMinter.sol#608-611)
withdrawAll() should be declared external:
 - ForgottenRunesWarriorsMinter.withdrawAll() (contracts/ForgottenRunesWarriorsMinter.sol#616-619)
forwardERC20s(IERC20,uint256) should be declared external:
 - ForgottenRunesWarriorsMinter.forwardERC20s(IERC20,uint256) (contracts/ForgottenRunesWarriorsMinter.sol#627-630)
```

## [G-13] No need to explicitly initialize variables with default values

If a variable is not set/initialized, it is assumed to have the default value (`0` for `uint`, `false` for `bool`, `address(0)` for address...). Explicitly initializing it with its default value is an anti-pattern and wastes gas.

As an example: `for (uint256 i = 0; i < numIterations; ++i) {` should be replaced with `for (uint256 i; i < numIterations; ++i) {`

Instances include:

```solidity
ForgottenRunesWarriorsGuild.sol:24:    uint256 public numMinted = 0;
ForgottenRunesWarriorsMinter.sol:162:        for (uint256 i = 0; i < numWarriors; i++) {
ForgottenRunesWarriorsMinter.sol:220:        for (uint256 i = 0; i < numWarriors; i++) {
ForgottenRunesWarriorsMinter.sol:259:        for (uint256 i = 0; i < count; i++) {
```

I suggest removing explicit initializations for default values.

## [G-14] Upgrade pragma to at least 0.8.4

Using newer compiler versions and the optimizer give gas optimizations. Also, additional safety checks are available for free.

The advantages here are:

*   **Low level inliner** (>= 0.8.2): Cheaper runtime gas (especially relevant when the contract has small functions).
*   **Optimizer improvements in packed structs** (>= 0.8.3)
*   **Custom errors** (>= 0.8.4): cheaper deployment cost and runtime cost. *Note*: the runtime cost is only relevant when the revert condition is met. In short, replace revert strings by custom errors.

Consider upgrading pragma to at least 0.8.4:

```jsx
ForgottenRunesWarriorsGuild.sol:1:pragma solidity ^0.8.0;
ForgottenRunesWarriorsMinter.sol:1:pragma solidity ^0.8.0;
```

## [G-15] Use `msg.sender` instead of OpenZeppelin's `_msgSender()` when meta-transactions capabilities aren't used

`msg.sender` costs 2 gas (CALLER opcode).
`_msgSender()` represents the following:

```solidity
function _msgSender() internal view virtual returns (address payable) {
  return msg.sender;
}
```

When no meta-transactions capabilities are used: `msg.sender` is enough.

See <https://docs.openzeppelin.com/contracts/2.x/gsn> for more information about GSN capabilities.

Consider replacing `_msgSender()` with `msg.sender` here:

```solidity
ForgottenRunesWarriorsGuild.sol:101:        require(_msgSender() == minter, 'Not a minter');
ForgottenRunesWarriorsGuild.sol:115:            _isApprovedOrOwner(_msgSender(), tokenId),
```

In the solution, `msg.sender` is used everywhere else:

```solidity
ForgottenRunesWarriorsGuild.sol:164:        require(payable(msg.sender).send(address(this).balance));
ForgottenRunesWarriorsGuild.sol:174:        require(address(msg.sender) != address(0));
ForgottenRunesWarriorsGuild.sol:175:        token.transfer(msg.sender, amount);
ForgottenRunesWarriorsMinter.sol:113:        setVaultAddress(msg.sender);
ForgottenRunesWarriorsMinter.sol:151:        daMinters.push(msg.sender);
ForgottenRunesWarriorsMinter.sol:152:        daAmountPaid[msg.sender] += msg.value;
ForgottenRunesWarriorsMinter.sol:153:        daNumMinted[msg.sender] += numWarriors;
ForgottenRunesWarriorsMinter.sol:163:            _mint(msg.sender);
ForgottenRunesWarriorsMinter.sol:182:        require(mintlistMinted[msg.sender] == false, 'Already minted');
ForgottenRunesWarriorsMinter.sol:183:        mintlistMinted[msg.sender] = true;
ForgottenRunesWarriorsMinter.sol:186:        bytes32 node = keccak256(abi.encodePacked(msg.sender));
ForgottenRunesWarriorsMinter.sol:194:        _mint(msg.sender);
ForgottenRunesWarriorsMinter.sol:221:            _mint(msg.sender);
ForgottenRunesWarriorsMinter.sol:238:        require(claimlistMinted[msg.sender] == false, 'Already claimed');
ForgottenRunesWarriorsMinter.sol:239:        claimlistMinted[msg.sender] = true;
ForgottenRunesWarriorsMinter.sol:242:        bytes32 node = keccak256(abi.encodePacked(msg.sender));
ForgottenRunesWarriorsMinter.sol:249:        _mint(msg.sender);
ForgottenRunesWarriorsMinter.sol:373:        _refundAddress(msg.sender);
ForgottenRunesWarriorsMinter.sol:628:        require(address(msg.sender) != address(0));
ForgottenRunesWarriorsMinter.sol:629:        token.transfer(msg.sender, amount);
```

## [G-16] Use Custom Errors instead of Revert Strings to save Gas

Custom errors from Solidity 0.8.4 are cheaper than revert strings (cheaper deployment cost and runtime cost when the revert condition is met)

Source: <https://blog.soliditylang.org/2021/04/21/custom-errors/>:

> Starting from [Solidity v0.8.4](https://github.com/ethereum/solidity/releases/tag/v0.8.4), there is a convenient and gas-efficient way to explain to users why an operation failed through the use of custom errors. Until now, you could already use strings to give more information about failures (e.g., `revert("Insufficient funds.");`), but they are rather expensive, especially when it comes to deploy cost, and it is difficult to use dynamic information in them.

Custom errors are defined using the `error` statement, which can be used inside and outside of contracts (including interfaces and libraries).

Instances include:

```solidity
ForgottenRunesWarriorsGuild.sol:68:        require(
ForgottenRunesWarriorsGuild.sol:100:        require(numMinted < MAX_WARRIORS, 'All warriors have been summoned');
ForgottenRunesWarriorsGuild.sol:101:        require(_msgSender() == minter, 'Not a minter');
ForgottenRunesWarriorsGuild.sol:114:        require(
ForgottenRunesWarriorsGuild.sol:164:        require(payable(msg.sender).send(address(this).balance));
ForgottenRunesWarriorsGuild.sol:174:        require(address(msg.sender) != address(0));
ForgottenRunesWarriorsMinter.sol:136:        require(numSold < maxDaSupply, 'Auction sold out');
ForgottenRunesWarriorsMinter.sol:137:        require(numSold + numWarriors <= maxDaSupply, 'Not enough remaining');
ForgottenRunesWarriorsMinter.sol:138:        require(daStarted(), 'Auction not started');
ForgottenRunesWarriorsMinter.sol:139:        require(!mintlistStarted(), 'Auction phase over');
ForgottenRunesWarriorsMinter.sol:140:        require(
ForgottenRunesWarriorsMinter.sol:146:        require(
ForgottenRunesWarriorsMinter.sol:177:        require(numSold < maxForSale, 'Sold out');
ForgottenRunesWarriorsMinter.sol:178:        require(mintlistStarted(), 'Mintlist phase not started');
ForgottenRunesWarriorsMinter.sol:179:        require(msg.value == finalPrice, 'Ether value incorrect');
ForgottenRunesWarriorsMinter.sol:182:        require(mintlistMinted[msg.sender] == false, 'Already minted');
ForgottenRunesWarriorsMinter.sol:187:        require(
ForgottenRunesWarriorsMinter.sol:207:        require(numSold < maxForSale, 'Sold out');
ForgottenRunesWarriorsMinter.sol:208:        require(numSold + numWarriors <= maxForSale, 'Not enough remaining');
ForgottenRunesWarriorsMinter.sol:209:        require(publicStarted(), 'Public sale not started');
ForgottenRunesWarriorsMinter.sol:210:        require(
ForgottenRunesWarriorsMinter.sol:214:        require(
ForgottenRunesWarriorsMinter.sol:234:        require(numClaimed < maxForClaim, 'No more claims');
ForgottenRunesWarriorsMinter.sol:235:        require(claimsStarted(), 'Claim phase not started');
ForgottenRunesWarriorsMinter.sol:238:        require(claimlistMinted[msg.sender] == false, 'Already claimed');
ForgottenRunesWarriorsMinter.sol:243:        require(
ForgottenRunesWarriorsMinter.sol:258:        require(address(recipient) != address(0), 'address req');
ForgottenRunesWarriorsMinter.sol:372:        require(selfRefundsStarted(), 'Self refund period not started');
ForgottenRunesWarriorsMinter.sol:488:        require(
ForgottenRunesWarriorsMinter.sol:492:        require(
ForgottenRunesWarriorsMinter.sol:609:        require(address(vault) != address(0), 'no vault');
ForgottenRunesWarriorsMinter.sol:610:        require(payable(vault).send(_amount));
ForgottenRunesWarriorsMinter.sol:617:        require(address(vault) != address(0), 'no vault');
ForgottenRunesWarriorsMinter.sol:618:        require(payable(vault).send(address(this).balance));
ForgottenRunesWarriorsMinter.sol:628:        require(address(msg.sender) != address(0));
```

I suggest replacing revert strings with custom errors.

**[gzeon (judge) commented](https://github.com/code-423n4/2022-05-runes-findings/issues/177#issuecomment-1160705332):**
 > Most are valid, except:
> > **ForgottenRunesWarriorsMinter.currentDaPrice(): > should be >=**
> 
> Strict is cheaper since there is no opcode for non-strict comparison in evm.
> 
> > **No need to explicitly initialize variables with default values**
> 
> Yes, but I don't think it saves gas in for loop with optimizer enabled.



***

# Disclosures

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.
