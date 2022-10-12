---
sponsor: "Juicebox"
slug: "2022-07-juicebox"
date: "2022-10-11" 
title: "Juicebox V2 contest"
findings: "https://github.com/code-423n4/2022-07-juicebox-findings/issues"
contest: 143
---

# Overview

## About C4

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the Juicebox V2 smart contract system written in Solidity. The audit contest took place between July 1—July 8 2022.

Following the C4 audit contest, warden berndartmueller reviewed the mitigations for all identified issues; the mitigation review report is appended below the audit contest report.

## Wardens

111 Wardens contributed reports to the Juicebox V2 contest:

  1. [berndartmueller](https://twitter.com/berndartmueller)
  1. cccz
  1. zzzitron
  1. IllIllI
  1. Lambda
  1. [philogy](https://twitter.com/real_philogy)
  1. 0x52
  1. hake
  1. DimitarDimitrov
  1. 0x29A (0x4non and rotcivegaf)
  1. hubble (ksk2345 and shri4net)
  1. AlleyCat
  1. [ylv](ylv.io)
  1. [dirk_y](https://twitter.com/iamdirky)
  1. [oyc&#95;109](https://twitter.com/andyfeili)
  1. horsefacts
  1. pashov
  1. [hyh](https://twitter.com/0xhyh)
  1. [Ruhum](https://twitter.com/0xruhum)
  1. codexploder
  1. Meera
  1. bardamu
  1. [Alex the Entreprenerd](https://twitter.com/gallodasballo)
  1. rbserver
  1. robee
  1. &#95;141345&#95;
  1. 0xA5DF
  1. 0x1f8b
  1. [defsec](https://twitter.com/defsec_)
  1. [Picodes](https://twitter.com/thePicodes)
  1. [joestakey](https://twitter.com/JoeStakey)
  1. [fatherOfBlocks](https://twitter.com/father0fBl0cks)
  1. simon135
  1. [jonatascm](https://twitter.com/jonataspvt)
  1. 0xDjango
  1. [0xNazgul](https://twitter.com/0xNazgul)
  1. 0xf15ers (remora and twojoy)
  1. [Chom](https://chom.dev)
  1. GimelSec ([rayn](https://twitter.com/rayn731) and sces60107)
  1. [0xdanial](https://twitter.com/danialmomtahani)
  1. [TomJ](https://mobile.twitter.com/tomj_bb)
  1. [Funen](https://instagram.com/vanensurya)
  1. [Sm4rty](https://twitter.com/Sm4rty_)
  1. [Ch&#95;301](https://twitter.com/0xch301)
  1. delfin454000
  1. [durianSausage](https://github.com/lyciumlee)
  1. [m&#95;Rassska](https://t.me/Road220)
  1. Kaiziron
  1. [rajatbeladiya](https://twitter.com/rajat_beladiya)
  1. asutorufos
  1. Hawkeye (0xwags and 0xmint)
  1. sach1r0
  1. ReyAdmirado
  1. [MiloTruck](https://milotruck.github.io/)
  1. Bnke0x0
  1. brgltd
  1. Waze
  1. [JC](https://twitter.com/sm4rtcontr4ct)
  1. [0v3rf10w](https://twitter.com/_0v3rf10w)
  1. _Adam
  1. [Rohan16](https://twitter.com/ROHANJH56009256)
  1. Noah3o6
  1. jayfromthe13th
  1. djxploit
  1. 0xNineDec
  1. sahar
  1. [svskaushik](https://twitter.com/svs_kaushik)
  1. TerrierLover
  1. samruna
  1. [Chandr](https://www.linkedin.com/in/evgeniy-shaldin-21898712a/)
  1. aysha
  1. [0xKitsune](https://github.com/0xKitsune)
  1. [Cheeezzyyyy](https://twitter.com/SOL_Cheeezzyyyy)
  1. kebabsec (okkothejawa and [FlameHorizon](https://twitter.com/FlameHorizon1))
  1. Limbooo
  1. Saintcode&#95;
  1. RedOneN
  1. [c3phas](https://twitter.com/c3ph_)
  1. apostle0x01
  1. UnusualTurtle
  1. sashik&#95;eth
  1. JohnSmith
  1. cRat1st0s
  1. ajtra
  1. [Tutturu](https://twitter.com/TuturuTech)
  1. [Tomio](https://twitter.com/meidhiwirara)
  1. [rfa](https://www.instagram.com/riyan_rfa/)
  1. Metatron
  1. [kaden](https://twitter.com/0xKaden)
  1. [ignacio](https://twitter.com/0xheynacho)
  1. [Aymen0909](https://github.com/Aymen1001)
  1. [Randyyy](https://twitter.com/randyyramadhan)
  1. [mrpathfindr](https://veranos.io)
  1. ElKu
  1. [mektigboy](https://twitter.com/mektigboy)
  1. [exd0tpy](https://github.com/exd0tpy)
  1. 0x09GTO
  1. [Franfran](https://franfran.dev/)
  1. [hansfriese](https://twitter.com/hansfriese)
  1. Green
  1. [tabish](https://twitter.com/tabishjshaikh)
  1. tintin
  1. cloudjunky
  1. cryptphi
  1. peritoflores

This contest was judged by [Jack the Pug](https://github.com/jack-the-pug).

Mitigations reviewed by [berndartmueller](https://twitter.com/berndartmueller).

Final report assembled by [itsmetechjay](https://twitter.com/itsmetechjay).

# Summary

The C4 analysis yielded an aggregated total of 17 unique vulnerabilities. Of these vulnerabilities, 2 received a risk rating in the category of HIGH severity and 15 received a risk rating in the category of MEDIUM severity.

Additionally, C4 analysis included 60 reports detailing issues with a risk rating of LOW severity or non-critical. There were also 74 reports recommending gas optimizations.

All of the issues presented here are linked back to their original finding.

# Scope

The code under review can be found within the [C4 Juicebox V2 contest repository](https://github.com/code-423n4/2022-07-juicebox), and is composed of 10 smart contracts written in the Solidity programming language and includes 2,088 lines of Solidity code.

# Severity Criteria

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low/non-critical.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

- Malicious Input Handling
- Escalation of privileges
- Arithmetic
- Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code4rena.com).

# High Risk Findings (2)
## [[H-01] Oracle data feed can be outdated yet used anyways which will impact payment logic](https://github.com/code-423n4/2022-07-juicebox-findings/issues/138)
_Submitted by 0xNineDec, also found by 0x1f8b, 0x29A, 0x52, 0xdanial, 0xDjango, 0xf15ers, bardamu, cccz, Cheeezzyyyy, Chom, codexploder, defsec, Franfran, Alex the Entreprenerd, Green, hake, hansfriese, horsefacts, hubble, hyh, IllIllI, jonatascm, kebabsec, Meera, oyc&#95;109, pashov, rbserver, Ruhum, simon135, tabish, tintin, and zzzitron_

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBChainlinkV3PriceFeed.sol#L44>

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBPrices.sol#L57>

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSingleTokenPaymentTerminalStore.sol#L387>

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSingleTokenPaymentTerminalStore.sol#L585>

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSingleTokenPaymentTerminalStore.sol#L661>

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSingleTokenPaymentTerminalStore.sol#L830>

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSingleTokenPaymentTerminalStore.sol#L868>

### Impact

The current implementation of `JBChainlinkV3PriceFeed` is used by the protocol to showcase how the feed will be retrieved via Chainlink Data Feeds. The feed is used to retrieve the `currentPrice`, which is also used afterwards by `JBPrices.priceFor()`, then by `JBSingleTokenPaymentTerminalStore.recordPaymentFrom()`, `JBSingleTokenPaymentTerminalStore.recordDistributionFor`, `JBSingleTokenPaymentTerminalStore.recordUsedAllowanceOf`, `JBSingleTokenPaymentTerminalStore._overflowDuring` and `JBSingleTokenPaymentTerminalStore._currentTotalOverflowOf`.
Although the current feeds are calculated by a non implemented IJBPriceFeed, if the implementation of the price feed is the same as the showcased in`JBChainlinkV3PriceFeed`, the retrieved data can be outdated or out of bounds.

It is important to remember that the sponsor said on the dedicated Discord Channel that also oracle pricing and data retrieval is inside the scope.

### Proof of Concept

Chainlink classifies their data feeds into four different groups regarding how reliable is each source thus, how risky they are. The groups are *Verified Feeds, Monitored Feeds, Custom Feeds and Specialized Feeds* (they can be seen [here](https://docs.chain.link/docs/selecting-data-feeds/#data-feed-categories)). The risk is the lowest on the first one and highest on the last one.

A strong reliance on the price feeds has to be also monitored as recommended on the [Risk Mitigation section](https://docs.chain.link/docs/selecting-data-feeds/#risk-mitigation). There are several reasons why a data feed may fail such as unforeseen market events, volatile market conditions, degraded performance of infrastructure, chains, or networks, upstream data providers outage, malicious activities from third parties among others.

Chainlink recommends using their data feeds along with some controls to prevent mismatches with the retrieved data. Along some recommendations, the feed can include circuit breakers (for extreme price events), contract update delays (to ensure that the injected data into the protocol is fresh enough), manual kill-switches (to cease connection in case of found bug or vulnerability in an upstream contract), monitoring (control the deviation of the data) and soak testing (of the price feeds).

The `feed.lastRoundData()` interface parameters [according to Chainlink](https://docs.chain.link/docs/price-feeds-api-reference/) are the following:

    function latestRoundData() external view
        returns (
            uint80 roundId,             //  The round ID.
            int256 answer,              //  The price.
            uint256 startedAt,          //  Timestamp of when the round started.
            uint256 updatedAt,          //  Timestamp of when the round was updated.
            uint80 answeredInRound      //  The round ID of the round in which the answer was computed.
        )

Regarding Juicebox itself, only the `answer` is used on the `JBChainlinkV3PriceFeed.currentPrice()` implementation. The retrieved price of the `priceFeed` can be outdated and used anyways as a valid data because no timestamp tolerance of the update source time is checked while storing the return parameters of `feed.latestRoundData()` inside `JBChainlinkV3PriceFeed.currentPrice()` as recommended by Chainlink in [here](https://docs.chain.link/docs/using-chainlink-reference-contracts/#check-the-timestamp-of-the-latest-answer). The usage of outdated data can impact on how the Payment terminals work regarding pricing calculation and value measurement.

Precisely the following protocol logic within `JBSingleTokenPaymentTerminalStore​‌` will work unexpectedly regarding value management.

*   `recordPaymentFrom()`:

    This function handles the minting of a project tokens according to a data source if one is given. If the retrieved value of the oracle is outdated, the `_weightRatio` at [Line 387](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSingleTokenPaymentTerminalStore.sol#L387) will return an incorrect value and then the `tokenCount` calculated amount will suffer from this mismatch, impacting in the amount of tokens minted.

*   `recordDistributionFor()`:

    Performs the recording of recently distributed funds for a project. On [line 580](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSingleTokenPaymentTerminalStore.sol#L580) the `distributedAmount` is computed and if the boolean check is false, then the call will perform a call to `priceFor` at [line 585](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSingleTokenPaymentTerminalStore.sol#L585). If the returned oracle value is not adjusted with current market prices, the `distributedAmount` will also drag that error computing an incorrect `distributedAmount`. Afterwards, because the `distributedAmount` is also used to update the token balances of the `msg.sender` ([line 598](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSingleTokenPaymentTerminalStore.sol#L598)) it means that the mismatch impacts on the modified balance.

*   `recordUsedAllowanceOf()`:

    Keeps record of used allowances of a project. It returns are analogue to the ones shown at `recordDistributionFor` where the `usedAmount` resembles the `distributedAmount`. The `usedAmount` is also used to update the project's balance. If the data of the oracle is outdated, the `usedAmount` will be calculated dragging that error.

*   `_overflowDuring()`:

    Used to get the amount that is overflowing relative to a specified cycle. The data retrieved from the oracle is used to calculate the value of `_distributionLimitRemaining` on [line 827](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSingleTokenPaymentTerminalStore.sol#L827) which is used later to calculate the return value if the boolean check performed at line 834 is true. Because the return of this function is the current balance of a project minus the amount that can be still distributed, if the amount that can still be distributed is wrong so will be the subtraction thus the return value.

*   `_currentTotalOverflowOf()`:

    Similar to the latter but used to get the overflow of all the terminals of a project. If the retrieved data has a mismatch with the market, the `_totalOverflow18Decimal` calculated on [line 866](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSingleTokenPaymentTerminalStore.sol#L827) if the boolean check is false will drag this mismatch which will also be dragged into the final return of the function.

The issues of those miscalculations impact on every project currently minted, which also affects subsequently on each user that has tokens of a project resulting in a high reach impact.

### Recommended Mitigation Steps

As Chainlink [recommends](https://docs.chain.link/docs/using-chainlink-reference-contracts/#check-the-timestamp-of-the-latest-answer):

> Your application should track the `latestTimestamp` variable or use the `updatedAt` value from the `latestRoundData()` function to make sure that the latest answer is recent enough for your application to use it. If your application detects that the reported answer is not updated within the heartbeat or within time limits that you determine are acceptable for your application, pause operation or switch to an alternate operation mode while identifying the cause of the delay.
>
> During periods of low volatility, the heartbeat triggers updates to the latest answer. Some heartbeats are configured to last several hours, so your application should check the timestamp and verify that the latest answer is recent enough for your application.

It is recommended to add a tolerance that compares the `updatedAt` return timestamp from `latestRoundData()` with the current block timestamp and ensure that the `priceFeed` is being updated with the required frequency.

If the `ETH/USD` is the only one that is needed to retrieve, because it is the most popular and available pair. It can also be useful to add other oracle to get the price feed (such as Uniswap's). This can be used as a redundancy in the case of having one oracle that returns outdated values (what is outdated and what is up to date can be determined by a tolerance as mentioned).

**[mejango (Juicebox) confirmed, but disagreed with severity and commented](https://github.com/code-423n4/2022-07-juicebox-findings/issues/138#issuecomment-1182192760):**
 > There is also a good description in this duplicate #[78](https://github.com/code-423n4/2022-07-juicebox-findings/issues/78)

**mejango (Juicebox) resolved:**
> PR with fix: [PR #1](https://github.com/jbx-protocol/juice-contracts-v3/pull/1)

**berndartmueller (warden) reviewed mitigation:**
> Appropriate validations to prevent price staleness, round incompleteness and a negative price is put in place now.

***

## [[H-02] Token Change Can Be Frontrun, Blocking Token](https://github.com/code-423n4/2022-07-juicebox-findings/issues/104)
_Submitted by philogy, also found by berndartmueller and Lambda_

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBTokenStore.sol#L246>

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBTokenStore.sol#L266>

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBController.sol#L605>

### Impact

This vulnerability allows malicious actors to block other users from changing tokens of their projects. Furthermore if ownership over the token contract is transferred to the `JBTokenStore` contract prior to the change, as suggested in the [recourse section of Juicebox's 24.05.2022 post-mortem update](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/main/security/postmortem/5.24.2022.md#Recourse), this vulnerability would allow an attacker to become the owner of tokens being transferred. For `JBToken` based tokens this would allow an attacker to begin issuing arbitrary amounts the token that was meant to be transferred.

### Proof of Concept

**Exploit scenario:**

1.  Wanting to assign their token to their JB project an unsuspecting owner / admin transfers ownership to a `JBTokenStore` contract, either directly by calling `transferOwnership` on the token or indirectly by calling the `changeFor` method on an older `JBTokenStore` contract with `_newOwner` set as the new `JBTokenStore` contract. (For the newer Juicebox contracts the `JBController` contract's `changeTokenOf` method would be called)
2.  Seeing this change an attacker submits a `changeTokenFor` calling transaction to the new `JBController` contract, triggering the `JBTokenStore` contract's `changeFor` method, linking it to one of the attacker's projects (this could be created in advance or as part of the same transaction via an attack contract)
3.  The attacker can then gain ownership over the token by calling `changeTokenFor` again with the `_newOwner` set to the attacker's address
4.  Assuming the token has an owner restricted `mint` method like `JBToken` based tokens the attacker can now mint an arbitrary amount of the token

### Recommended Mitigation Steps

Before allowing a caller to change to a specific token ensure that they have control over it. This can be achieved by storing a list of trusted older JB directories and projects which are then queried. Alternatively the contract could require the caller to actually be the `.owner()`  address of the token to migrate, this would require admins to:

1.  Call `changeTokenOf` with themselves as the new owner
2.  Call the new change token method on the newer contract, since they are the owner they'd pass the check
3.  Independently transfer the ownership to the new token store to ensure that it can issue tokens

Future migrations can be made more seamless by having older contracts directly call new contracts via a sub-call, removing a necessary transaction for the admin. The newer contracts needs to verify that the older contract is the owner address of the token that's being set and also has approval of the project owner which is being configured.

**[mejango (Juicebox) confirmed and commented](https://github.com/code-423n4/2022-07-juicebox-findings/issues/104#issuecomment-1179367197):**
 > Nice. The project should first `changeToken` and then transfer ownership.

**mejango (Juicebox) resolved:**
> PR with fix: [PR #1](https://github.com/jbx-protocol/juice-contracts-v3/pull/1)

**berndartmueller (warden) reviewed mitigation:**
> Changing an already set project token is not possible anymore.

***

 
# Medium Risk Findings (15)
## [[M-01] Duplicated locked splits can be discarded](https://github.com/code-423n4/2022-07-juicebox-findings/issues/219)
_Submitted by zzzitron_


The function of the protocol could be impacted.  This [proof of concept](https://gist.github.com/zzzitron/a8c6067923a87af8e001c05442258370#file-2022-07-juiceboxv2-t-sol-L117-L163) demonstrates the discarding of one of the duplicated locked splits. In the beginning it launches a project with two identical locked splits. As the owner of the project, it updates splits to only one of the two splits. Since all of original splits are locked both of them should still in the split after the update, but only one of them exists in the updated splits.

It happens because [the check of the locked split](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSplitsStore.sol#L211-L221) is not suitable for duplicated cases.

*Please see warden's [original report](https://github.com/code-423n4/2022-07-juicebox-findings/issues/219) for full details.*

### Recommended Mitigation Steps

Either prevent duplicates in the splits or track the matches while checking the locked splits.

**[mejango (Juicebox) acknowledged, but disagreed with severity](https://github.com/code-423n4/2022-07-juicebox-findings/issues/219)** 

***

## [[M-02] Lack of check on `mustStartAtOrAfter`](https://github.com/code-423n4/2022-07-juicebox-findings/issues/220)
_Submitted by zzzitron, also found by IllIllI_

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBFundingCycleStore.sol#L306-L312>

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBFundingCycleStore.sol#L518-L522>

### Impact

By setting huge `mustStartAtOrAfter`, the owner can set start time in the past. It might open up possibility to bypass the ballot waiting time depending on the ballot's implementation.

### Proof of Concept

The [proof of concept](https://gist.github.com/zzzitron/a8c6067923a87af8e001c05442258370#file-2022-07-juiceboxv2-t-sol-L77-L115) is almost the same as [`TestReconfigure::testReconfigureProject`](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/system_tests/TestReconfigure.sol#L77-L114). In the original test, the owner of the project is reconfiguring funding cycle, but it is not in effect immediately because ballot is set. Only after 3 days the newly set funding cycle will be the current one.

In the above proof of concept, only one parameter of the funding cycle is modified: `mustStartAtOrAfter` is set to `type(uint56).max`. As the result, the newly set funding cycle is considered as the current one without waiting for the ballot.

The cause of this is missing check on `mustStartAtOrAfter` upon setting [here](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBFundingCycleStore.sol#L306-L312). If the given `_mustStartAtOrAfter` is huge, it will be passed eventually to the `_initFor`, `_packAndStoreIntrinsicPropertiesOf`. Then it will 'overflow' by shifting and set to the funding cycle, which [essentially can be set to any value including the past](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBFundingCycleStore.sol#L518-L522). Also, it seems like the number will be also effected because the bigger digit will carry over.

```solidity
// in JBFundingCycleStore::_packAndStoreIntrinsicPropertiesOf
// where the `_start` is derived from `_mustStartAtOrAfter`

./JBFundingCycleStore.sol-518-    // start in bits 144-199.
./JBFundingCycleStore.sol:519:    packed |= _start << 144;
./JBFundingCycleStore.sol-520-
./JBFundingCycleStore.sol-521-    // number in bits 200-255.
./JBFundingCycleStore.sol-522-    packed |= _number << 200;
```

### Tools Used

Foundry

### Recommended Mitigation Steps

Add a check for the `_mustStartAtOrAfter`:

```solidity
// example check for _mustSTartAtOrAfter
// in JBFundingCycleStore::configureFor

if (_mustStartAtOrAfter > type(uint56).max) revert INVALID_START();
```

**[drgorillamd (Juicebox) confirmed and commented](https://github.com/code-423n4/2022-07-juicebox-findings/issues/220#issuecomment-1182519751):**
 > We've seen the POC, now assessing how to best mitigate (at what level).

**[jack-the-pug (judge) commented](https://github.com/code-423n4/2022-07-juicebox-findings/issues/220#issuecomment-1200425695):**
 > Good catch!

**drgorillamd (Juicebox) resolved:**
> PR with fix: [PR #1](https://github.com/jbx-protocol/juice-contracts-v3/pull/1)

**berndartmueller (warden) reviewed mitigation:**
> `mustStartAtOrAfter` and the start date of an upcoming funding cycle are now validated to fit in `uint56`.



***

## [[M-03] Use a safe transfer helper library for ERC20 transfers](https://github.com/code-423n4/2022-07-juicebox-findings/issues/242)
_Submitted by horsefacts, also found by 0x1f8b, 0x29A, 0x52, 0xf15ers, AlleyCat, apostle0x01, berndartmueller, cccz, Ch&#95;301, Chom, cloudjunky, codexploder, cryptphi, delfin454000, durianSausage, fatherOfBlocks, Franfran, hake, hansfriese, hyh, IllIllI, jonatascm, Kaiziron, Limbooo, m&#95;Rassska, Meera, oyc&#95;109, peritoflores, rajatbeladiya, rbserver, Ruhum, Sm4rty, svskaushik, and zzzitron_

`JBERC20PaymentTerminal#_transferFrom` calls `IERC20#transfer` and `transferFrom` directly. There are two issues with using this interface directly:

1.  `JBERC20PaymentTerminal#_transferFrom` function does not check the return value of these calls. Tokens that return `false` rather than revert to indicate failed transfers may silently fail rather than reverting as expected.

2.  Since the IERC20 interface requires a boolean return value, attempting to transfer ERC20s with [missing return values](https://github.com/d-xo/weird-erc20#missing-return-values) will revert. This means Juicebox payment terminals cannot support a number of popular ERC20s, including USDT and BNB.

[`JBERC20PaymentTerminal#_transferFrom`](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBERC20PaymentTerminal.sol#L81-L89):

```solidity
  function _transferFrom(
    address _from,
    address payable _to,
    uint256 _amount
  ) internal override {
    _from == address(this)
      ? IERC20(token).transfer(_to, _amount)
      : IERC20(token).transferFrom(_from, _to, _amount);
  }
```

### Impact

Juicebox payment terminals may issue project tokens to users even though their incoming token transfer failed. Juicebox payment terminals cannot support USDT, BNB, and other popular (but nonstandard) ERC20s.

### Recommended Mitigation Steps

Use a safe transfer library like OpenZeppelin [SafeERC20](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#SafeERC20) to ensure consistent handling of ERC20 return values and abstract over [inconsistent ERC20](https://github.com/d-xo/weird-erc20) implementations.

Additionally, since payment terminals are meant to support a variety of ERC20s, consider writing simulation tests that make token transfers using payment terminals for the most popular and most unusual ERC20s.

(Note also that the out of scope `JBETHERC20ProjectPayer` and `JBETHERC20SplitsPayer` contracts also call `IERC20#transfer` and `transferFrom` without a helper!)

See the following Forge test, which simulates an attempted USDT transfer. (Run this in fork mode using the `--fork-url` flag).

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import './helpers/TestBaseWorkflow.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

address constant USDT_ADDRESS = address(0xdAC17F958D2ee523a2206206994597C13D831ec7);

contract TestWeirdERC20 is TestBaseWorkflow {
  using SafeERC20 for IERC20Metadata;

  JBController controller;
  JBProjectMetadata _projectMetadata;
  JBFundingCycleData _data;
  JBFundingCycleMetadata _metadata;
  JBGroupedSplits[] _groupedSplits;
  JBFundAccessConstraints[] _fundAccessConstraints;
  IJBPaymentTerminal[] _terminals;
  JBTokenStore _tokenStore;
  JBERC20PaymentTerminal _tetherTerminal;

  IERC20Metadata usdt = IERC20Metadata(USDT_ADDRESS);
  address _projectOwner;

  uint256 WEIGHT = 1000 * 10**18;

  function setUp() public override {
    super.setUp();

    _projectOwner = multisig();

    _tokenStore = jbTokenStore();

    controller = jbController();

    _projectMetadata = JBProjectMetadata({content: 'myIPFSHash', domain: 1});

    _data = JBFundingCycleData({
      duration: 14,
      weight: WEIGHT,
      discountRate: 450000000,
      ballot: IJBFundingCycleBallot(address(0))
    });

    _metadata = JBFundingCycleMetadata({
      global: JBGlobalFundingCycleMetadata({allowSetTerminals: false, allowSetController: false}),
      reservedRate: 5000, //50%
      redemptionRate: 5000, //50%
      ballotRedemptionRate: 0,
      pausePay: false,
      pauseDistributions: false,
      pauseRedeem: false,
      pauseBurn: false,
      allowMinting: false,
      allowChangeToken: false,
      allowTerminalMigration: false,
      allowControllerMigration: false,
      holdFees: false,
      useTotalOverflowForRedemptions: false,
      useDataSourceForPay: false,
      useDataSourceForRedeem: false,
      dataSource: address(0)
    });

    _tetherTerminal = new JBERC20PaymentTerminal(
      usdt,
      jbLibraries().ETH(), // currency
      jbLibraries().ETH(), // base weight currency
      1, // JBSplitsGroupe
      jbOperatorStore(),
      jbProjects(),
      jbDirectory(),
      jbSplitsStore(),
      jbPrices(),
      jbPaymentTerminalStore(),
      multisig()
    );
    evm.label(address(_tetherTerminal), 'TetherTerminal');

    _terminals.push(_tetherTerminal);
  }

  function testTetherPaymentsRevert() public {
    JBERC20PaymentTerminal terminal = _tetherTerminal;

    _fundAccessConstraints.push(
      JBFundAccessConstraints({
        terminal: terminal,
        token: address(USDT_ADDRESS),
        distributionLimit: 10 * 10**18,
        overflowAllowance: 5 * 10**18,
        distributionLimitCurrency: jbLibraries().ETH(),
        overflowAllowanceCurrency: jbLibraries().ETH()
      })
    );

    uint256 projectId = controller.launchProjectFor(
      _projectOwner,
      _projectMetadata,
      _data,
      _metadata,
      block.timestamp,
      _groupedSplits,
      _fundAccessConstraints,
      _terminals,
      ''
    );

    address caller = msg.sender;
    evm.label(caller, 'caller');
    deal(address(usdt), caller, 20 * 10**18);

    evm.prank(caller);
    usdt.safeApprove(address(terminal), 20 * 10**18);
    evm.prank(caller);
    terminal.pay(
      projectId,
      20 * 10**18,
      address(usdt),
      msg.sender,
      0,
      false,
      'Forge test',
      new bytes(0)
    );
  }
}
```
**[mejango (Juicebox) confirmed](https://github.com/code-423n4/2022-07-juicebox-findings/issues/281)**

**mejango (Juicebox) resolved:**
> PR with fix: [PR #1](https://github.com/jbx-protocol/juice-contracts-v3/pull/1)

**berndartmueller (warden) reviewed mitigation:**
> OpenZeppelins&#39; `SafeERC20` library is now used to ensure consistent handling of ERC20 token transfers.


***

## [[M-04] Juicebox project owner can create a honeypot to cause grief](https://github.com/code-423n4/2022-07-juicebox-findings/issues/170)
_Submitted by dirk&#95;y, also found by IllIllI, and ylv_

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBController.sol#L760>

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSplitsStore.sol#L147>

### Impact

In a Juicebox project the project owner (or anyone that they approve) can set splits. These splits are details of the token distributions to other addresses in response to contributions to the project.

At the moment the `SPLITS_TOTAL_PERCENT = 1_000_000_000`. This means that the project owner could theoretically add 1 billion different splits, each with a percent value of 1. Of course, this would require too much gas, but the idea stands. A project owner could honeypot users by creating a project with the `MAX_RESERVED_RATE` reserved rate, and setting a large percentage split for the `msg.sender` who calls `distributeReservedTokensOf` in `JBController.sol`. The project owner could then fund the project with a series of large payments to ensure that the reserved amount was sufficiently large to entice a user to call `distributeReservedTokensOf` in the belief that they will be obtaining a large percentage of the reserve.

However, when a user calls this method they will hit the block gas limit and will have spent a large amount of ETH on gas, without receiving any of their expected split.

I consider this to be of high severity since user assets (in the form of gas) can be permanently lost without any loss to the project owner/griefer.

### Proof of Concept

The key behaviour we need to prove is that it's possible to set more splits before hitting the block gas limit than it is to distribute reward tokens over the same number of splits. If this is true, the project owner will be able to set a number of splits that will always make the `distributeReservedTokensOf` hit the block gas limit, and hence grief the caller.

This can be demonstrated by modifying the existing test cases. From some basic testing I have found that calling `distributeReservedTokensOf` hits the block gas limit when there are at least 389 splits, but for the same split count the project owner can successfully call `set` without hitting the block gas limit.

    diff --git a/test/jb_controller/distribute_reserved_token_of.test.js b/test/jb_controller/distribute_reserved
    _token_of.test.js
    index 2f964d8..6cfd645 100644
    --- a/test/jb_controller/distribute_reserved_token_of.test.js
    +++ b/test/jb_controller/distribute_reserved_token_of.test.js
    @@ -119,10 +119,15 @@ describe('JBController::distributeReservedTokensOf(...)', function () {
         const { addrs, projectOwner, jbController, mockJbTokenStore, mockSplitsStore, timestamp } =
           await setup();
         const caller = addrs[0];
    -    const splitsBeneficiariesAddresses = [addrs[1], addrs[2]].map((signer) => signer.address);
    +    let addressList = [addrs[1], addrs[2]];
    +    for (let i = 1; i < 389; i++) {
    +      addressList.push(addrs[1]);
    +    }
    +
    +    const splitsBeneficiariesAddresses = addressList.map((signer) => signer.address);

         const splits = makeSplits({
    -      count: 2,
    +      count: 389,
           beneficiary: splitsBeneficiariesAddresses,
           preferClaimed: true,
         });
    diff --git a/test/jb_splits_store/set.test.js b/test/jb_splits_store/set.test.js
    index 3dd0331..5992957 100644
    --- a/test/jb_splits_store/set.test.js
    +++ b/test/jb_splits_store/set.test.js
    @@ -54,7 +54,7 @@ describe('JBSplitsStore::set(...)', function () {
         };
       }

    -  function makeSplits(beneficiaryAddress, count = 4) {
    +  function makeSplits(beneficiaryAddress, count = 389) {
         let splits = [];
         for (let i = 0; i < count; i++) {
           splits.push({

### Tools Used

VSCode & Hardhat

### Recommended Mitigation Steps

For `JBSplit` objects there should be a minimum percentage for each split when calling `set`. Furthermore, it would probably be wise to prevent duplicate beneficiaries, but I have omitted that in the below recommendation for clarity. Below is a suggested diff. I've arbitrarily set a minimum percentage of 10,000 but given the PoC the min percentage should be conservatively set to ensure no more than 389 splits can be created (I would probably suggest a cap of max 100 splits per group).

    diff --git a/contracts/JBSplitsStore.sol b/contracts/JBSplitsStore.sol
    index d61cca2..429d78a 100644
    --- a/contracts/JBSplitsStore.sol
    +++ b/contracts/JBSplitsStore.sol
    @@ -227,8 +227,8 @@ contract JBSplitsStore is IJBSplitsStore, JBOperatable {
         uint256 _percentTotal = 0;

         for (uint256 _i = 0; _i < _splits.length; _i++) {
    -      // The percent should be greater than 0.
    -      if (_splits[_i].percent == 0) revert INVALID_SPLIT_PERCENT();
    +      // The percent should be greater than or equal to 10000.
    +      if (_splits[_i].percent < JBConstants.MIN_SPLIT_PERCENT) revert INVALID_SPLIT_PERCENT();

           // ProjectId should be within a uint56
           if (_splits[_i].projectId > type(uint56).max) revert INVALID_PROJECT_ID();
    diff --git a/contracts/libraries/JBConstants.sol b/contracts/libraries/JBConstants.sol
    index 9a418f2..afb5f23 100644
    --- a/contracts/libraries/JBConstants.sol
    +++ b/contracts/libraries/JBConstants.sol
    @@ -10,6 +10,7 @@ library JBConstants {
       uint256 public constant MAX_REDEMPTION_RATE = 10000;
       uint256 public constant MAX_DISCOUNT_RATE = 1000000000;
       uint256 public constant SPLITS_TOTAL_PERCENT = 1000000000;
    +  uint256 public constant MIN_SPLIT_PERCENT = 10000;
       uint256 public constant MAX_FEE = 1000000000;
       uint256 public constant MAX_FEE_DISCOUNT = 1000000000;
     }

An alternative to setting a minimum percentage would be to have a check on the length of the splits array and capping that at a sensible value. In this instance a project owner could still set low percentages per split, however I don't personally see the value in being able to set a value of 1 (to receive 1 billionth of the reserve).

**[mejango (Juicebox) acknowledged, but disagreed with severity and commented](https://github.com/code-423n4/2022-07-juicebox-findings/issues/170#issuecomment-1179397247):**
 > Damn. Word. This is deep. Thank you.

 > Not sure about "high" severity. But surely should be noted among the protocol's risks.

**[jack-the-pug (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-07-juicebox-findings/issues/170#issuecomment-1193226758):**
 > Not bad, but also not a High. This is similar to the unbounded loop and other out-of-gas issues, the honeypot probably wont work if the wallet UI is better (alerts about the out-of-gas error).
> 
> Will downgrade to Medium.



***

## [[M-05] Discounted fee calculation is imprecise and calculates less fees than anticipated](https://github.com/code-423n4/2022-07-juicebox-findings/issues/275)
_Submitted by berndartmueller, also found by 0x52, hyh, and Ruhum_

The `JBPayoutRedemptionPaymentTerminal._feeAmount` function is used to calculate the fee based on a given `_amount`, a fee rate `_fee` and an optional discount `_feeDiscount`.

However, the current implementation calculates the fee in a way that leads to inaccuracy and to fewer fees being paid than anticipated by the protocol.

### Proof of Concept

[JBPayoutRedemptionPaymentTerminal.\_feeAmount](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L1446-L1451)

```solidity
function _feeAmount(
    uint256 _amount,
    uint256 _fee,
    uint256 _feeDiscount
  ) internal pure returns (uint256) {
    // Calculate the discounted fee.
    uint256 _discountedFee = _fee -
      PRBMath.mulDiv(_fee, _feeDiscount, JBConstants.MAX_FEE_DISCOUNT);

    // The amount of tokens from the `_amount` to pay as a fee.
    return
      _amount - PRBMath.mulDiv(_amount, JBConstants.MAX_FEE, _discountedFee + JBConstants.MAX_FEE);
  }
```

**Example:**

Given the following (don't mind the floating point arithmetic, this is only for simplicity. The issues still applies with integer arithmetic and higher decimal precision):

*   `amount` - 1000
*   `fee` - 5 (5%)
*   `feeDiscount` - 10 (10%)
*   `MAX_FEE_DISCOUNT` - 100
*   `MAX_FEE` - 100

$discountedFee = fee - {{fee \ast feeDiscount} \over MAX_FEE_DISCOUNT}$\
$discountedFee = 5 - {{5 \ast 10} \over 100}$\
$discountedFee = 4.5$

Calculating the fee amount based on the discounted fee of $4.5$:

$fee\_{Amount} = amount - {{amount \ast MAX_FEE} \over {discountedFee + MAX_FEE}}$\
$fee\_{Amount} = 1000 - {{1000 \ast 100} \over {4.5 + 100}}$\
$fee\_{Amount} = 1000 - 956.93779904$\
$fee\_{Amount} = 43.06220096$

The calculated and wrong fee amount is `~43`, instead, it should be `45`. The issue comes from dividing by `_discountedFee + JBConstants.MAX_FEE`.

**Now the correct way:**

I omitted the `discountedFee` calculation as this formula is correct.

$fee\_{Amount} = {{amount \ast discountedFee} \over {MAX_FEE}}$\
$fee\_{Amount} = {{1000 \ast 4.5} \over {100}}$\
$fee\_{Amount} = 45$

### Recommended Mitigation Steps

Fix the discounted fee calculation by adjusting the formula to:

$fee\_{Amount} = amount \ast {fee - fee \ast {discount \over MAX\_{FEE_DISCOUNT}} \over MAX\_{FEE}}$

In Solidity:

```solidity
function _feeAmount(
    uint256 _amount,
    uint256 _fee,
    uint256 _feeDiscount
) internal pure returns (uint256) {
    // Calculate the discounted fee.
    uint256 _discountedFee = _fee -
      PRBMath.mulDiv(_fee, _feeDiscount, JBConstants.MAX_FEE_DISCOUNT);

    // The amount of tokens from the `_amount` to pay as a fee.
    return PRBMath.mulDiv(_amount, _discountedFee, JBConstants.MAX_FEE);
}
```

**[mejango (Juicebox) acknowledged](https://github.com/code-423n4/2022-07-juicebox-findings/issues/275)** 

**[jack-the-pug (judge) commented](https://github.com/code-423n4/2022-07-juicebox-findings/issues/275#issuecomment-1193219669):**
 > Great job! One of the best write-ups I have ever seen, simple and clean.
 >
 > Here is a trophy for you: 🏆



***

## [[M-06] Code credits fee-on-transfer tokens for amount stated, not amount transferred](https://github.com/code-423n4/2022-07-juicebox-findings/issues/304)
_Submitted by IllIllI, also found by cccz, hake, Meera, rbserver, and robee_

Some ERC20 tokens, such as USDT, allow for charging a fee any time `transfer()` or `transferFrom()` is called. If a contract does not allow for amounts to change after transfers, subsequent transfer operations based on the original amount will `revert()` due to the contract having an insufficient balance.

### Impact

If there is only one user that has use a payment terminal with a fee-on-transfer token to pay a project for its token, that project will be unable to withdraw their funds, because the amount available will be less than the amount stated during deposit, and therefore the token's `transfer()` call will revert during withdrawal. For more users, consider what happens if the token has a 10% fee-on-transfer fee - deposits will be underfunded by 10%, and the projects trying to withdraw the last 10% of deposits/rewards will have their calls revert due to the contract not holding enough tokens. If a whale does a large withdrawal, the extra 10% that that whale gets will mean that *many* projects will not be able to withdraw anything at all.

### Proof of Concept

Because the terminals rely on terminal stores, which only store the initial value provided during the payment, and provide it during distributions, the terminals are unable to use the decreased value when they later are told to distribute funds to a project.

`JBSingleTokenPaymentTerminalStore.recordPaymentFrom()` stores the value passed in:

```solidity
File: contracts/JBSingleTokenPaymentTerminalStore.sol   #1

372       // Add the amount to the token balance of the project.
373       balanceOf[IJBSingleTokenPaymentTerminal(msg.sender)][_projectId] =
374         balanceOf[IJBSingleTokenPaymentTerminal(msg.sender)][_projectId] +
375         _amount.value;
```

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSingleTokenPaymentTerminalStore.sol#L372-L375>

And provide that same value when recording a dispersion:

```solidity
File: contracts/JBSingleTokenPaymentTerminalStore.sol   #2

597       // Removed the distributed funds from the project's token balance.
598       balanceOf[IJBSingleTokenPaymentTerminal(msg.sender)][_projectId] =
599         balanceOf[IJBSingleTokenPaymentTerminal(msg.sender)][_projectId] -
600         distributedAmount;
```

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSingleTokenPaymentTerminalStore.sol#L597-L600>

The terminals themselves use the values directly, and don't consult their balances to look for changes (lines 817 and 850 below):

```solidity
File: contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol   #3

817       (JBFundingCycle memory _fundingCycle, uint256 _distributedAmount) = store.recordDistributionFor(
818         _projectId,
819         _amount,
820         _currency
821       );
822   
823       // The amount being distributed must be at least as much as was expected.
824       if (_distributedAmount < _minReturnedTokens) revert INADEQUATE_DISTRIBUTION_AMOUNT();
825   
826       // Get a reference to the project owner, which will receive tokens from paying the platform fee
827       // and receive any extra distributable funds not allocated to payout splits.
828       address payable _projectOwner = payable(projects.ownerOf(_projectId));
829   
830       // Define variables that will be needed outside the scoped section below.
831       // Keep a reference to the fee amount that was paid.
832       uint256 _fee;
833   
834       // Scoped section prevents stack too deep. `_feeDiscount`, `_feeEligibleDistributionAmount`, and `_leftoverDistributionAmount` only used within scope.
835       {
836         // Get the amount of discount that should be applied to any fees taken.
837         // If the fee is zero or if the fee is being used by an address that doesn't incur fees, set the discount to 100% for convinience.
838         uint256 _feeDiscount = fee == 0 || isFeelessAddress[msg.sender]
839           ? JBConstants.MAX_FEE_DISCOUNT
840           : _currentFeeDiscount(_projectId);
841   
842         // The amount distributed that is eligible for incurring fees.
843         uint256 _feeEligibleDistributionAmount;
844   
845         // The amount leftover after distributing to the splits.
846         uint256 _leftoverDistributionAmount;
847   
848         // Payout to splits and get a reference to the leftover transfer amount after all splits have been paid.
849         // Also get a reference to the amount that was distributed to splits from which fees should be taken.
850         (_leftoverDistributionAmount, _feeEligibleDistributionAmount) = _distributeToPayoutSplitsOf(
851           _projectId,
852           _fundingCycle.configuration,
853           payoutSplitsGroup,
854           _distributedAmount,
855           _feeDiscount
856         );
```

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L817-L856>

The terminals used the amounts stated, rather than transferred in (lines 349 and 356):

```solidity
File: contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol   #4

332     function pay(
333       uint256 _projectId,
334       uint256 _amount,
335       address _token,
336       address _beneficiary,
337       uint256 _minReturnedTokens,
338       bool _preferClaimedTokens,
339       string calldata _memo,
340       bytes calldata _metadata
341     ) external payable virtual override isTerminalOf(_projectId) returns (uint256) {
342       _token; // Prevents unused var compiler and natspec complaints.
343   
344       // ETH shouldn't be sent if this terminal's token isn't ETH.
345       if (token != JBTokens.ETH) {
346         if (msg.value > 0) revert NO_MSG_VALUE_ALLOWED();
347   
348         // Transfer tokens to this terminal from the msg sender.
349         _transferFrom(msg.sender, payable(address(this)), _amount);
350       }
351       // If this terminal's token is ETH, override _amount with msg.value.
352       else _amount = msg.value;
353   
354       return
355         _pay(
356           _amount,
357           msg.sender,
358           _projectId,
359           _beneficiary,
360           _minReturnedTokens,
361           _preferClaimedTokens,
362           _memo,
363           _metadata
364         );
365     }
```

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L332-L365>

Same here (lines 555 and 561):

```solidity
File: contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol   #5

540     function addToBalanceOf(
541       uint256 _projectId,
542       uint256 _amount,
543       address _token,
544       string calldata _memo,
545       bytes calldata _metadata
546     ) external payable virtual override isTerminalOf(_projectId) {
547       _token; // Prevents unused var compiler and natspec complaints.
548   
549       // If this terminal's token isn't ETH, make sure no msg.value was sent, then transfer the tokens in from msg.sender.
550       if (token != JBTokens.ETH) {
551         // Amount must be greater than 0.
552         if (msg.value > 0) revert NO_MSG_VALUE_ALLOWED();
553   
554         // Transfer tokens to this terminal from the msg sender.
555         _transferFrom(msg.sender, payable(address(this)), _amount);
556       }
557       // If the terminal's token is ETH, override `_amount` with msg.value.
558       else _amount = msg.value;
559   
560       // Add to balance while only refunding held fees if the funds aren't originating from a feeless terminal.
561       _addToBalanceOf(_projectId, _amount, !isFeelessAddress[msg.sender], _memo, _metadata);
562     }
```

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L540-L562>

The transfer of fees and reserves have the same issue.

### Recommended Mitigation Steps

Measure the contract balance before and after the call to `transfer()`/`transferFrom()` in `JBERC20PaymentTerminal._transferFrom()`, and use the difference between the two as the amount, rather than the amount stated

**[drgorillamd (Juicebox) acknowledged](https://github.com/code-423n4/2022-07-juicebox-findings/issues/304)**

**drgorillamd (Juicebox) resolved:**
> PR with fix: [PR #1](https://github.com/jbx-protocol/juice-contracts-v3/pull/1)

**berndartmueller (warden) reviewed mitigation:**
> The delta of the token balance before and after a transfer is used instead of the amount stated to handle fee-on-transfer tokens appropriately.


***

## [[M-07] processFees() may fail due to exceed gas limit](https://github.com/code-423n4/2022-07-juicebox-findings/issues/8)
_Submitted by oyc&#95;109, also found by 0x52, IllIllI, and pashov_

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L594>

### Impact

The function `processFees()` in `JBPayoutRedemptionPaymentTerminal.sol` may fail due to unbounded loop over `_heldFeesOf[_projectId]`

`_heldFeesOf[_projectId]` can get very large due to the function `_takeFeeFrom()` where it pushes fees that should be paid to a specific beneficiary onto the array

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L1199>

`_heldFeesOf[_projectId]` could get large and cause a DOS condition where no fees can be distributed due to exceed of gas limit

### Proof of Concept

        for (uint256 _i = 0; _i < _heldFeeLength; ) {
          // Get the fee amount.
          uint256 _amount = _feeAmount(
            _heldFees[_i].amount,
            _heldFees[_i].fee,
            _heldFees[_i].feeDiscount
          );

**[mejango (Juicebox) acknowledged](https://github.com/code-423n4/2022-07-juicebox-findings/issues/8)** 


***

## [[M-08] Reentrancy issues on function `distributePayoutsOf`](https://github.com/code-423n4/2022-07-juicebox-findings/issues/329)
_Submitted by 0x29A, also found by AlleyCat and hubble_

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L415-L448>

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L788-L900>

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L981-L1174>

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBETHPaymentTerminal.sol#L63-L79>

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBERC20PaymentTerminal.sol#L73-L89>

### Impact

In the contract `JBPayoutRedemptionPaymentTerminal`, the function [`distributePayoutsOf`](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L415-L448) calls the internal function [`_distributePayoutsOf`](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L788-L900) and this internal function perfoms a loop where is using the function [`_distributeToPayoutSplitsOf`](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L981-L1174)
In these functions there are a [`_transferFrom`](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L1148) what:

*   `JBETHPaymentTerminal` using a [`Address.sendValue(_to, _amount)`](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBETHPaymentTerminal.sol#L78)
*   `JBERC20PaymentTerminal` using a [`IERC20(token).transfer(_to, _amount)`](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBERC20PaymentTerminal.sol#L87) with a `ERC777` as token

Both give back the control to the `msg.sender` (`_to` variable) creating a reentrancy attack vector.

Also could end with a lot of bad calculation because is using uncheckeds statements and function `_distributePayoutsOf` its no respecting the `checks, effects, interactions` pattern.

### Proof of Concept

Craft a contract to call function [`distributePayoutsOf`](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L437), on receive ether reentrant to function `distributePayoutsOf` or use a `ERC777` callback.

### Recommended Mitigation Steps

Add a reentrancyGuard as you do on `JBSingleTokenPaymentTerminalStore.sol`;
You have already imported the ReentrancyGuard on [JBPayoutRedemptionPaymentTerminal.sol#L5](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L5) but you are not using it.

My recommendation is to add `nonReentrant` modifier on function `distributePayoutsOf`.

**[drgorillamd (Juicebox) acknowledged](https://github.com/code-423n4/2022-07-juicebox-findings/issues/35)**

**[jack-the-pug (judge) commented](https://github.com/code-423n4/2022-07-juicebox-findings/issues/329#issuecomment-1193225553):**
 > Lack of clear path to exploit it, but it does seem like `_distributeToPayoutSplitsOf` can be used to reenter `distributePayoutsOf`; it requires the attacker to be one of the project's splits beneficiaries, though.
> 
> https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L1148-L1153
> 
> ```solidity
>           _transferFrom(
>             address(this),
>             _split.beneficiary != address(0) ? _split.beneficiary : payable(msg.sender),
>             _netPayoutAmount
>           );
> 
> ```

***

## [[M-09] Unhandled chainlink revert would lock all price oracle access](https://github.com/code-423n4/2022-07-juicebox-findings/issues/59)
_Submitted by bardamu, also found by berndartmueller, codexploder, Alex the Entreprenerd, and horsefacts_

Call to `latestRoundData` could potentially revert and make it impossible to query any prices. Feeds cannot be changed after they are configured (<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBPrices.sol#L115>) so this would result in a permanent denial of service.

### Proof of Concept

Chainlink's multisigs can immediately block access to price feeds at will. Therefore, to prevent denial of service scenarios, it is recommended to query Chainlink price feeds using a defensive approach with Solidity’s try/catch structure. In this way, if the call to the price feed fails, the caller contract is still in control and can handle any errors safely and explicitly.

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBPrices.sol#L69>

    if (_feed != IJBPriceFeed(address(0))) return _feed.currentPrice(_decimals);

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBChainlinkV3PriceFeed.sol#L42-L44>

    function currentPrice(uint256 _decimals) external view override returns (uint256) {
      // Get the latest round information. Only need the price is needed.
      (, int256 _price, , , ) = feed.latestRoundData();

Refer to <https://blog.openzeppelin.com/secure-smart-contract-guidelines-the-dangers-of-price-oracles/> for more information regarding potential risks to account for when relying on external price feed providers.

### Tools Used

VIM

### Recommended Mitigation Steps

Surround the call to `latestRoundData()` with `try/catch` instead of calling it directly. In a scenario where the call reverts, the catch block can be used to call a fallback oracle or handle the error in any other suitable way.

**[mejango (Juicebox) acknowledged](https://github.com/code-423n4/2022-07-juicebox-findings/issues/59)**

**[jack-the-pug (judge) commented](https://github.com/code-423n4/2022-07-juicebox-findings/issues/59#issuecomment-1200414043):**
 > Good catch! Seems like we should update this function to allow changing the feed contract:
> 
> https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBPrices.sol#L109-L121



***

## [[M-10] Grieffer beneficiary can cause DOS](https://github.com/code-423n4/2022-07-juicebox-findings/issues/229)
_Submitted by hake, also found by cccz_

Payouts won't be able to be distributed if one of multiple beneficiaries decides to revert the transaction on receival.

### Proof of Concept

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L1147-L1152>

```solidity
// If there's a beneficiary, send the funds directly to the beneficiary. Otherwise, send to the msg.sender.
          _transferFrom(
            address(this),
            _split.beneficiary != address(0) ? _split.beneficiary : payable(msg.sender),
            _netPayoutAmount
          );
```

If token used is native ETH or ERC777 a beneficiary can revert the transaction on the callback and DOS `_distributeToPayoutSplitsOf()` for all the other beneficiaries.

### Recommended Mitigation Steps

Have beneficiaries withdraw their benefit instead of sending it to them.

**[mejango (Juicebox) acknowledged and commented](https://github.com/code-423n4/2022-07-juicebox-findings/issues/229#issuecomment-1182422038):**
 > By design. Project owners bring their own risks and opportunities when setting payout splits. Made clear [here](https://info.juicebox.money/dev/learn/risks#setting-a-distribution-limit-and-payout-splits).

**[hake (warden) commented](https://github.com/code-423n4/2022-07-juicebox-findings/issues/229#issuecomment-1183603378):**
 > A malicious or compromised beneficiary is not exactly under a project owner's control. Implementing the recommended mitigation step would prevent the possibility of DOS while maintaining all privileges of project owner. No risks outlined in link below would be mitigated by the recommended mitigation, thus project owner would still have access to same range of functionalities. 
>  https://info.juicebox.money/dev/learn/risks/#setting-a-distribution-limit-and-payout-splits


***

## [[M-11] addFeedFor should check if inverse feed already exists](https://github.com/code-423n4/2022-07-juicebox-findings/issues/79)
_Submitted by 0x52, also found by DimitarDimitrov_

Potentially inconsistent currency conversions.

### Proof of Concept

`addFeedFor` requires that a price feed for the \_currency \_base doesn't exist when adding a new price feed but doesn't check if the inverse already exists. This means that two different oracles (potentially with different prices) could be used for \_currency -> \_base vs. \_base -> \_currency. Different prices would lead to inconsistent between conversion ratios depending on the direction of the conversion.

### Recommended Mitigation Steps

Change L115 to:
`if (feedFor\[\_currency]\[\_base] != IJBPriceFeed(address(0)) || feedFor\[\_base]\[\_currency] != IJBPriceFeed(address(0))) revert PRICE_FEED_ALREADY_EXISTS()`

**[mejango (Juicebox) confirmed](https://github.com/code-423n4/2022-07-juicebox-findings/issues/79)** 

**mejango (Juicebox) resolved:**
> PR with fix: [PR #1](https://github.com/jbx-protocol/juice-contracts-v3/pull/1)

**berndartmueller (warden) reviewed mitigation:**
> An additional check has been added to prevent adding a price feed for the inverse pair.

***

## [[M-12] changeTokenOf makes it impossible for holders of oldToken to redeem the overflowed assets.](https://github.com/code-423n4/2022-07-juicebox-findings/issues/83)
_Submitted by cccz_

When the owner calls the changeTokenOf function of the JBController contract, the token corresponding to the current project will be changed, which will make the oldToken holder unable to redeem the overflowing assets.

### Proof of Concept

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena//blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBController.sol#L588-L606>

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena//blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBTokenStore.sol#L236-L269>

### Recommended Mitigation Steps

Consider adding a delay to `changeTokenOf`, or adding a function to convert `oldToken` to `newToken`.

**[mejango (Juicebox) confirmed](https://github.com/code-423n4/2022-07-juicebox-findings/issues/83)**

**mejango (Juicebox) resolved:**
> PR with fix: [PR #1](https://github.com/jbx-protocol/juice-contracts-v3/pull/1)

**berndartmueller (warden) reviewed mitigation:**
> Once a token is set for a project, it can not be changed anymore.

***

## [[M-13] JBToken: mint function could mint arbitrary amount of tokens](https://github.com/code-423n4/2022-07-juicebox-findings/issues/84)
_Submitted by cccz_

The owner of the JBToken contract can mint arbitrary amount of tokens.

In general, the owner of the JBToken contract is the JBTokenStore contract, and the minting of the tokens is controlled by the JBController contract, but when the changeTokenOf function of the JBController contract is called, the owner will be transferred to any address, which can mint arbitrary amount of tokens.

      function mint(
        uint256 _projectId,
        address _account,
        uint256 _amount
      ) external override onlyOwner {
        _projectId; // Prevents unused var compiler and natspec complaints.

        return _mint(_account, _amount);
      }

### Proof of Concept

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena//blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBToken.sol#L106-L114>

### Recommended Mitigation Steps

Consider setting minter as the JBTokenStore contract and adding the onlyminter modifier to the mint function.

**[mejango (Juicebox) acknowledged](https://github.com/code-423n4/2022-07-juicebox-findings/issues/84)** 



***

## [[M-14] More outstanding reserved tokens are distributed than anticipated leading to less redeemable assets and therefore loss of user funds](https://github.com/code-423n4/2022-07-juicebox-findings/issues/285)
_Submitted by berndartmueller_

The `JBController.distributeReservedTokensOf` function is used to distribute all outstanding reserved tokens for a project. Internally, the `JBController._distributeReservedTokensOf` function calculates the distributable amount of tokens `tokenCount` with the function `JBController._reservedTokenAmountFrom`.

However, the current implementation of `JBController._reservedTokenAmountFrom` calculates the amount of reserved tokens currently tracked in a way that leads to inaccuracy and to more tokens distributed than anticipated.

### Impact

More tokens than publicly defined via the funding cycle `reservedRate` are distributed (minted) to the splits and the owner increasing the total supply and therefore reducing the amount of terminal assets redeemable by a user. The increased supply takes effect in `JBSingleTokenPaymentTerminStore.recordRedemptionFor` on [L784](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSingleTokenPaymentTerminalStore.sol#L784). The higher the token supply, the less terminal assets redeemable.

### Proof of Concept

[JBController.\_reservedTokenAmountFrom](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBController.sol#L1086-L1090)

```solidity
function _reservedTokenAmountFrom(
    int256 _processedTokenTracker,
    uint256 _reservedRate,
    uint256 _totalEligibleTokens
  ) internal pure returns (uint256) {
    // Get a reference to the amount of tokens that are unprocessed.
    uint256 _unprocessedTokenBalanceOf = _processedTokenTracker >= 0
      ? _totalEligibleTokens - uint256(_processedTokenTracker)
      : _totalEligibleTokens + uint256(-_processedTokenTracker);

    // If there are no unprocessed tokens, return.
    if (_unprocessedTokenBalanceOf == 0) return 0;

    // If all tokens are reserved, return the full unprocessed amount.
    if (_reservedRate == JBConstants.MAX_RESERVED_RATE) return _unprocessedTokenBalanceOf;

    return
      PRBMath.mulDiv(
        _unprocessedTokenBalanceOf,
        JBConstants.MAX_RESERVED_RATE,
        JBConstants.MAX_RESERVED_RATE - _reservedRate
      ) - _unprocessedTokenBalanceOf;
  }
```

**Example:**

Given the following (don't mind the floating point arithmetic, this is only for simplicity. The issues still applies with integer arithmetic and higher decimal precision):

*   `processedTokenTracker` - `-1000`
*   `reservedRate` - 10 (10%)
*   `totalEligibleTokens` - 0
*   `MAX_RESERVED_RATE` - 100

$unprocessedTokenBalanceOf = 0 + (--1000)$\
$unprocessedTokenBalanceOf = 1000$

$reservedTokenAmount = {{unprocessedTokenBalanceOf \ast MAX_RESERVED_RATE} \over {MAX_RESERVED_RATE - reservedRate}} - unprocessedTokenBalanceOf$\
$reservedTokenAmount = {{1000 \ast 100} \over {100 - 10}} - 1000$\
$reservedTokenAmount = 1111.111 - 1000$\
$reservedTokenAmount = 111,111$

The calculated and wrong amount is `~111`, instead it should be `100` (10% of 1000). The issue comes from dividing by `JBConstants.MAX_RESERVED_RATE - _reservedRate`.

**Now the correct way:**

$reservedTokenAmount = {{unprocessedTokenBalanceOf \ast reservedRate} \over MAX_RESERVED_RATE}$\
$reservedTokenAmount = {{1000 \ast 10} \over 100}$\
$reservedTokenAmount = 100$

### Recommended Mitigation Steps

Fix the outstanding reserve token calculation by implementing the calculation as following:

```solidity
function _reservedTokenAmountFrom(
    int256 _processedTokenTracker,
    uint256 _reservedRate,
    uint256 _totalEligibleTokens
) internal pure returns (uint256) {
  // Get a reference to the amount of tokens that are unprocessed.
  uint256 _unprocessedTokenBalanceOf = _processedTokenTracker >= 0
    ? _totalEligibleTokens - uint256(_processedTokenTracker)
    : _totalEligibleTokens + uint256(-_processedTokenTracker);

  // If there are no unprocessed tokens, return.
  if (_unprocessedTokenBalanceOf == 0) return 0;

  return
    PRBMath.mulDiv(
      _unprocessedTokenBalanceOf,
      _reservedRate,
      JBConstants.MAX_RESERVED_RATE
    );
}
```

**[mejango (Juicebox) disputed and commented](https://github.com/code-423n4/2022-07-juicebox-findings/issues/285#issuecomment-1179405474):**
 > The only case where the tracker can be -1000 but the totalEligibleTokens is 0 is if reserved rate is 100%. https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBController.sol#L664
> <img width="911" alt="image" src="https://user-images.githubusercontent.com/77952627/178077733-af364733-bcfb-47b9-b673-80bcad0efb2e.png">
> 
 > Furthermore, reserved rate changes per fc is noted in the protocol's known risks exposed by design:https://info.juicebox.money/dev/learn/risks#undistributed-reserved-rate-risk.

**[jack-the-pug (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-07-juicebox-findings/issues/285#issuecomment-1207328114):**
 > I find this issue to be a valid Medium issue as it introduced an unexpected behavior that can cause a leak of value in certain circumstances.



***

## [[M-15] Locked splits can be updated](https://github.com/code-423n4/2022-07-juicebox-findings/issues/278)
_Submitted by berndartmueller_

The check if the newly provided project splits contain the currently locked splits does not check the `JBSplit` struct properties `preferClaimed` and `preferAddToBalance`.

According to the docs in `JBSplit.sol`, *"...if the split should be unchangeable until the specified time, with the exception of extending the locked period."*, locked sets are unchangeable.

However, locked sets with either `preferClaimed` or `preferAddToBalance` set to true can have their bool values overwritten by supplying the same split just with different bool values.

### Proof of Concept

[JBSplitsStore.sol#L213-L220](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSplitsStore.sol#L213-L220)

The check for sameness does not check the equality of the struct properties `preferClaimed` and `preferAddToBalance`.

*Please see warden's [original report](https://github.com/code-423n4/2022-07-juicebox-findings/issues/278) for full PoC and Mitigation details.*

### Recommended Mitigation Steps

Add two additional sameness checks for `preferClaimed` and `preferAddToBalance`:

**[mejango (Juicebox) confirmed](https://github.com/code-423n4/2022-07-juicebox-findings/issues/278)** 

**mejango (Juicebox) resolved:**
> PR with fix: [PR #1](https://github.com/jbx-protocol/juice-contracts-v3/pull/1)

**berndartmueller (warden) reviewed mitigation:**
> Two additional sameness checks for the split properties `preferClaimed` and `preferAddToBalance` have been added.

***



# Low Risk and Non-Critical Issues

For this contest, 60 reports were submitted by wardens detailing low risk and non-critical issues. The [report highlighted below](https://github.com/code-423n4/2022-07-juicebox-findings/issues/299) by **IllIllI** received the top score from the judge.

*The following wardens also submitted reports: [Lambda](https://github.com/code-423n4/2022-07-juicebox-findings/issues/21), [&#95;141345&#95;](https://github.com/code-423n4/2022-07-juicebox-findings/issues/205), [zzzitron](https://github.com/code-423n4/2022-07-juicebox-findings/issues/217), [berndartmueller](https://github.com/code-423n4/2022-07-juicebox-findings/issues/274), [Meera](https://github.com/code-423n4/2022-07-juicebox-findings/issues/286), [GimelSec](https://github.com/code-423n4/2022-07-juicebox-findings/issues/337), [Picodes](https://github.com/code-423n4/2022-07-juicebox-findings/issues/186), [horsefacts](https://github.com/code-423n4/2022-07-juicebox-findings/issues/244), [0xNazgul](https://github.com/code-423n4/2022-07-juicebox-findings/issues/123), [0x1f8b](https://github.com/code-423n4/2022-07-juicebox-findings/issues/43), [simon135](https://github.com/code-423n4/2022-07-juicebox-findings/issues/228), [cccz](https://github.com/code-423n4/2022-07-juicebox-findings/issues/47), [sahar](https://github.com/code-423n4/2022-07-juicebox-findings/issues/222), [robee](https://github.com/code-423n4/2022-07-juicebox-findings/issues/12), [jonatascm](https://github.com/code-423n4/2022-07-juicebox-findings/issues/143), [joestakey](https://github.com/code-423n4/2022-07-juicebox-findings/issues/358), [hubble](https://github.com/code-423n4/2022-07-juicebox-findings/issues/368), [Funen](https://github.com/code-423n4/2022-07-juicebox-findings/issues/268), [codexploder](https://github.com/code-423n4/2022-07-juicebox-findings/issues/125), [0xDjango](https://github.com/code-423n4/2022-07-juicebox-findings/issues/265), [Sm4rty](https://github.com/code-423n4/2022-07-juicebox-findings/issues/215), [Hawkeye](https://github.com/code-423n4/2022-07-juicebox-findings/issues/365), [delfin454000](https://github.com/code-423n4/2022-07-juicebox-findings/issues/197), [Ch&#95;301](https://github.com/code-423n4/2022-07-juicebox-findings/issues/261), [asutorufos](https://github.com/code-423n4/2022-07-juicebox-findings/issues/327), [hake](https://github.com/code-423n4/2022-07-juicebox-findings/issues/236), [Waze](https://github.com/code-423n4/2022-07-juicebox-findings/issues/191), [TomJ](https://github.com/code-423n4/2022-07-juicebox-findings/issues/351), [TerrierLover](https://github.com/code-423n4/2022-07-juicebox-findings/issues/325), [svskaushik](https://github.com/code-423n4/2022-07-juicebox-findings/issues/151), [samruna](https://github.com/code-423n4/2022-07-juicebox-findings/issues/60), [sach1r0](https://github.com/code-423n4/2022-07-juicebox-findings/issues/168), [Rohan16](https://github.com/code-423n4/2022-07-juicebox-findings/issues/254), [ReyAdmirado](https://github.com/code-423n4/2022-07-juicebox-findings/issues/182), [rbserver](https://github.com/code-423n4/2022-07-juicebox-findings/issues/183), [pashov](https://github.com/code-423n4/2022-07-juicebox-findings/issues/263), [oyc&#95;109](https://github.com/code-423n4/2022-07-juicebox-findings/issues/5), [MiloTruck](https://github.com/code-423n4/2022-07-juicebox-findings/issues/189), [m&#95;Rassska](https://github.com/code-423n4/2022-07-juicebox-findings/issues/94), [Kaiziron](https://github.com/code-423n4/2022-07-juicebox-findings/issues/344), [JC](https://github.com/code-423n4/2022-07-juicebox-findings/issues/366), [durianSausage](https://github.com/code-423n4/2022-07-juicebox-findings/issues/72), [defsec](https://github.com/code-423n4/2022-07-juicebox-findings/issues/357), [Chom](https://github.com/code-423n4/2022-07-juicebox-findings/issues/322), [Chandr](https://github.com/code-423n4/2022-07-juicebox-findings/issues/76), [Bnke0x0](https://github.com/code-423n4/2022-07-juicebox-findings/issues/112), [aysha](https://github.com/code-423n4/2022-07-juicebox-findings/issues/355), [0xNineDec](https://github.com/code-423n4/2022-07-juicebox-findings/issues/139), [0xf15ers](https://github.com/code-423n4/2022-07-juicebox-findings/issues/284), [0xdanial](https://github.com/code-423n4/2022-07-juicebox-findings/issues/290), [0x29A](https://github.com/code-423n4/2022-07-juicebox-findings/issues/293), [0v3rf10w](https://github.com/code-423n4/2022-07-juicebox-findings/issues/320), [&#95;Adam](https://github.com/code-423n4/2022-07-juicebox-findings/issues/154), [rajatbeladiya](https://github.com/code-423n4/2022-07-juicebox-findings/issues/208), [Noah3o6](https://github.com/code-423n4/2022-07-juicebox-findings/issues/115), [jayfromthe13th](https://github.com/code-423n4/2022-07-juicebox-findings/issues/347), [fatherOfBlocks](https://github.com/code-423n4/2022-07-juicebox-findings/issues/62), [djxploit](https://github.com/code-423n4/2022-07-juicebox-findings/issues/108), and [brgltd](https://github.com/code-423n4/2022-07-juicebox-findings/issues/136).*

## Low Risk Issues

|   | Issue                                                               | Instances |
| - | :------------------------------------------------------------------ | :-------: |
| L-01 | Weight of one being used as zero not documented                     |     1     |
| L-02 | Calls may run out of gas until arrays are reduced in size           |     2     |
| L-03 | Dust amounts not compensated, even if not using price oracle        |     1     |
| L-04 | Splits can't be locked once the timestamp passes `type(uint48).max` |     1     |
| L-05 | Unsafe use of `transfer()`/`transferFrom()` with `IERC20`           |     2     |

Total: 7 instances over 5 issues

## [L-01] Weight of one being used as zero not documented

The comments and code below say that a weight of one is being used as a weight of zero. If a project is mature, or eventually becomes mature, a weight of one may in fact be a useful weighting, and the project owners will become very confused when they are unable to receive funds with this weighting.

*There is 1 instance of this issue:*

```solidity
File: contracts/JBFundingCycleStore.sol   #1

467        // A weight of 1 is treated as a weight of 0.
468        // This is to allow a weight of 0 (default) to represent inheriting the discounted weight of the previous funding cycle.
469        _weight = _weight > 0
470          ? (_weight == 1 ? 0 : _weight)
471:         : _deriveWeightFrom(_baseFundingCycle, _start);
```

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBFundingCycleStore.sol#L467-L471>

## [L-02] Calls may run out of gas until arrays are reduced in size

The examples below are of functions that may revert due to the size of the data they're processing, but no funds are at risk because the arrays can be changed.

*There are 2 instances of this issue. (For in-depth details on this and all further gas optimizations with multiple instances, see the warden's [full report](https://github.com/code-423n4/2022-07-juicebox-findings/issues/299).)*


## [L-03] Dust amounts not compensated, even if not using price oracle

If there's a fixed weighting between what the user provides, and what is minted for them, there should be code that tracks partial token amounts, so that later payments are compensated for their prior partial amounts.

*There is 1 instance of this issue:*

```solidity
File: contracts/JBSingleTokenPaymentTerminalStore.sol   #1

385      uint256 _weightRatio = _amount.currency == _baseWeightCurrency
386        ? 10**_decimals
387        : prices.priceFor(_amount.currency, _baseWeightCurrency, _decimals);
388  
389      // Find the number of tokens to mint, as a fixed point number with as many decimals as `weight` has.
390:     tokenCount = PRBMath.mulDiv(_amount.value, _weight, _weightRatio);
```

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSingleTokenPaymentTerminalStore.sol#L385-L390>

## [L-04] Splits can't be locked once the timestamp passes `type(uint48).max`

This behavior isn't documented anywhere, and a project will be confused by this behavior when that time comes (the original developers will be unable to explain it because they'll be dead).

*There is 1 instance of this issue:*

```solidity
File: contracts/JBSplitsStore.sol   #1

261:         if (_splits[_i].lockedUntil > type(uint48).max) revert INVALID_LOCKED_UNTIL();
```

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSplitsStore.sol#L261>

## [L-05] Unsafe use of `transfer()`/`transferFrom()` with `IERC20`

Some tokens do not implement the ERC20 standard properly but are still accepted by most code that accepts ERC20 tokens.  For example Tether (USDT)'s `transfer()` and `transferFrom()` functions on L1 do not return booleans as the specification requires, and instead have no return value. When these sorts of tokens are cast to `IERC20`, their [function signatures](https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca) do not match and therefore the calls made, revert (see [this](https://gist.github.com/IllIllI000/2b00a32e8f0559e8f386ea4f1800abc5) link for a test case). Use OpenZeppelin’s `SafeERC20`'s `safeTransfer()`/`safeTransferFrom()` instead.

*There are 2 instances of this issue.*

## Non-Critical Issues

|    | Issue                                                                                       | Instances |
| -- | :------------------------------------------------------------------------------------------ | :-------: |
| N-01  | Confusing variable names                                                                    |     1     |
| N-02  | Return values of `approve()` not checked                                                    |     1     |
| N-03  | Adding a `return` statement when the function defines a named return variable, is redundant |     4     |
| N-04  | Non-assembly method available                                                               |     1     |
| N-05  | `constant`s should be defined rather than using magic numbers                               |     37    |
| N-06  | Use a more recent version of solidity                                                       |     1     |
| N-07  | Use a more recent version of solidity                                                       |     3     |
| N-08  | Use scientific notation (e.g. `1e18`) rather than exponentiation (e.g. `10**18`)            |     1     |
| N-09  | Constant redefined elsewhere                                                                |     11    |
| N-10 | Inconsistent spacing in comments                                                            |     1     |
| N-11 | Lines are too long                                                                          |     49    |
| N-12 | Typos                                                                                       |     17    |
| N-13 | File is missing NatSpec                                                                     |     29    |
| N-14 | NatSpec is incomplete                                                                       |     5     |
| N-15 | Event is missing `indexed` fields                                                           |     34    |
| N-16 | Not using the named return variables anywhere in the function is confusing                  |     6     |

Total: 201 instances over 16 issues

## [N-01] Confusing variable names

It was well into my review before I realized that 'configuration' means the timestamp at which the configuration is set, not the actual configuration details. It would be helpful to people reading the code to name it something like `configTimestamp` in all places. Below is one example of many.

*There is 1 instance of this issue:*

```solidity
File: contracts/JBFundingCycleStore.sol   #1

332:     uint256 _configuration = block.timestamp;
```

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBFundingCycleStore.sol#L332>

## [N-02] Return values of `approve()` not checked

Not all `IERC20` implementations `revert()` when there's a failure in `approve()`. The function signature has a `boolean` return value and they indicate errors that way instead. By not checking the return value, operations that should have marked as failed, may potentially go through without actually approving anything.

*There is 1 instance of this issue:*

```solidity
File: contracts/JBERC20PaymentTerminal.sol   #1

99:       IERC20(token).approve(_to, _amount);
```

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/tree/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBERC20PaymentTerminal.sol#L99>

## [N-03] Adding a `return` statement when the function defines a named return variable, is redundant

*There are 4 instances of this issue.*

## [N-04] Non-assembly method available

`assembly{ id := chainid() }` => `uint256 id = block.chainid`, `assembly { size := extcodesize() }` => `uint256 size = address().code.length`

*There is 1 instance of this issue:*

```solidity
File: contracts/JBFundingCycleStore.sol   #1

320:          _size := extcodesize(_ballot) // No contract at the address ?
```

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/tree/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBFundingCycleStore.sol#L320>

## [N-05] `constant`s should be defined rather than using magic numbers

Even [assembly](https://github.com/code-423n4/2022-05-opensea-seaport/blob/9d7ce4d08bf3c3010304a0476a785c70c0e90ae7/contracts/lib/TokenTransferrer.sol#L35-L39) can benefit from using readable constants instead of hex/numeric literals.

*There are 37 instances of this issue.*

## [N-06] Use a more recent version of solidity

Use a solidity version of at least 0.8.12 to get `string.concat()` to be used instead of `abi.encodePacked(<str>,<str>)`.

*There is 1 instance of this issue:*

```solidity
File: contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol   #1

2:    pragma solidity 0.8.6;
```

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/tree/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L2>

## [N-07] Use a more recent version of solidity

Use a solidity version of at least 0.8.13 to get the ability to use `using for` with a list of free functions.

*There are 3 instances of this issue.*

## [N-08] Use scientific notation (e.g. `1e18`) rather than exponentiation (e.g. `10**18`)

*There is 1 instance of this issue:*

```solidity
File: contracts/JBSingleTokenPaymentTerminalStore.sol   #1

868:        : PRBMath.mulDiv(_ethOverflow, 10**18, prices.priceFor(JBCurrencies.ETH, _currency, 18));
```

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/tree/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSingleTokenPaymentTerminalStore.sol#L868>

## [N-09] Constant redefined elsewhere

Consider defining in only one contract so that values cannot become out of sync when only one location is updated. A [cheap way](https://medium.com/coinmonks/gas-cost-of-solidity-library-functions-dbe0cedd4678) to store constants in a single location is to create an `internal constant` in a `library`. If the variable is a local cache of another contract's value, consider making the cache variable internal or private, which will require external users to query the contract with the source of truth, so that callers don't get out of sync.

*There are 11 instances of this issue.*

## [N-10] Inconsistent spacing in comments

Some lines use `// x` and some use `//x`. The instances below point out the usages that don't follow the majority, within each file.

*There is 1 instance of this issue:*

```solidity
File: contracts/JBController.sol   #1

912:      //Transfer between all splits.
```

<https://github.com/jbx-protocol/juice-contracts-v2-code4rena/tree/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBController.sol#L912>

## [N-11] Lines are too long

Usually lines in source code are limited to [80](https://softwareengineering.stackexchange.com/questions/148677/why-is-80-characters-the-standard-limit-for-code-width) characters. Today's screens are much larger so it's reasonable to stretch this in some cases. Since the files will most likely reside in GitHub, and GitHub starts using a scroll bar in all cases when the length is over [164](https://github.com/aizatto/character-length) characters, the lines below should be split when they reach that length.

*There are 49 instances of this issue.*

## [N-12] Typos

*There are 17 instances of this issue.*

## [N-13] File is missing NatSpec

*There are 29 instances of this issue.*

## [N-14] NatSpec is incomplete

*There are 5 instances of this issue.*

## [N-15] Event is missing `indexed` fields

Index event fields make the field more quickly accessible to off-chain tools that parse events. However, note that each index field costs extra gas during emission, so it's not necessarily best to index the maximum allowed per event (threefields). Each `event` should use three `indexed` fields if there are three or more fields, and gas usage is not particularly of concern for the events in question.

*There are 34 instances of this issue.*

## [N-16] Not using the named return variables anywhere in the function is confusing

Consider changing the variable to be an unnamed one.

*There are 6 instances of this issue.*

***

# Gas Optimizations

For this contest, 74 reports were submitted by wardens detailing gas optimizations. The [report highlighted below](https://github.com/code-423n4/2022-07-juicebox-findings/issues/161) by **0xA5DF** received the top score from the judge.

*The following wardens also submitted reports: [IllIllI](https://github.com/code-423n4/2022-07-juicebox-findings/issues/295), [horsefacts](https://github.com/code-423n4/2022-07-juicebox-findings/issues/245), [joestakey](https://github.com/code-423n4/2022-07-juicebox-findings/issues/256), [fatherOfBlocks](https://github.com/code-423n4/2022-07-juicebox-findings/issues/63), [defsec](https://github.com/code-423n4/2022-07-juicebox-findings/issues/349), [0xKitsune](https://github.com/code-423n4/2022-07-juicebox-findings/issues/69), [0x1f8b](https://github.com/code-423n4/2022-07-juicebox-findings/issues/36), [TomJ](https://github.com/code-423n4/2022-07-juicebox-findings/issues/323), [Saintcode&#95;](https://github.com/code-423n4/2022-07-juicebox-findings/issues/119), [RedOneN](https://github.com/code-423n4/2022-07-juicebox-findings/issues/163), [Meera](https://github.com/code-423n4/2022-07-juicebox-findings/issues/301), [Limbooo](https://github.com/code-423n4/2022-07-juicebox-findings/issues/367), [Lambda](https://github.com/code-423n4/2022-07-juicebox-findings/issues/20), [jonatascm](https://github.com/code-423n4/2022-07-juicebox-findings/issues/142), [c3phas](https://github.com/code-423n4/2022-07-juicebox-findings/issues/272), [UnusualTurtle](https://github.com/code-423n4/2022-07-juicebox-findings/issues/343), [Sm4rty](https://github.com/code-423n4/2022-07-juicebox-findings/issues/214), [simon135](https://github.com/code-423n4/2022-07-juicebox-findings/issues/328), [sashik&#95;eth](https://github.com/code-423n4/2022-07-juicebox-findings/issues/338), [sach1r0](https://github.com/code-423n4/2022-07-juicebox-findings/issues/167), [robee](https://github.com/code-423n4/2022-07-juicebox-findings/issues/11), [ReyAdmirado](https://github.com/code-423n4/2022-07-juicebox-findings/issues/181), [rbserver](https://github.com/code-423n4/2022-07-juicebox-findings/issues/211), [MiloTruck](https://github.com/code-423n4/2022-07-juicebox-findings/issues/188), [m_Rassska](https://github.com/code-423n4/2022-07-juicebox-findings/issues/93), [JohnSmith](https://github.com/code-423n4/2022-07-juicebox-findings/issues/121), [durianSausage](https://github.com/code-423n4/2022-07-juicebox-findings/issues/71), [cRat1st0s](https://github.com/code-423n4/2022-07-juicebox-findings/issues/162), [brgltd](https://github.com/code-423n4/2022-07-juicebox-findings/issues/135), [Bnke0x0](https://github.com/code-423n4/2022-07-juicebox-findings/issues/56), [ajtra](https://github.com/code-423n4/2022-07-juicebox-findings/issues/255), [0xf15ers](https://github.com/code-423n4/2022-07-juicebox-findings/issues/283), [&#95;141345&#95;](https://github.com/code-423n4/2022-07-juicebox-findings/issues/206), [Waze](https://github.com/code-423n4/2022-07-juicebox-findings/issues/173), [Tutturu](https://github.com/code-423n4/2022-07-juicebox-findings/issues/233), [Tomio](https://github.com/code-423n4/2022-07-juicebox-findings/issues/140), [rfa](https://github.com/code-423n4/2022-07-juicebox-findings/issues/164), [oyc&#95;109](https://github.com/code-423n4/2022-07-juicebox-findings/issues/4), [Noah3o6](https://github.com/code-423n4/2022-07-juicebox-findings/issues/114), [Metatron](https://github.com/code-423n4/2022-07-juicebox-findings/issues/287), [Kaiziron](https://github.com/code-423n4/2022-07-juicebox-findings/issues/172), [kaden](https://github.com/code-423n4/2022-07-juicebox-findings/issues/141), [JC](https://github.com/code-423n4/2022-07-juicebox-findings/issues/364), [jayfromthe13th](https://github.com/code-423n4/2022-07-juicebox-findings/issues/340), [ignacio](https://github.com/code-423n4/2022-07-juicebox-findings/issues/75), [djxploit](https://github.com/code-423n4/2022-07-juicebox-findings/issues/107), [delfin454000](https://github.com/code-423n4/2022-07-juicebox-findings/issues/192), [Ch&#95;301](https://github.com/code-423n4/2022-07-juicebox-findings/issues/262), [Aymen0909](https://github.com/code-423n4/2022-07-juicebox-findings/issues/247), [0xNazgul](https://github.com/code-423n4/2022-07-juicebox-findings/issues/122), [0v3rf10w](https://github.com/code-423n4/2022-07-juicebox-findings/issues/319), [&#95;Adam](https://github.com/code-423n4/2022-07-juicebox-findings/issues/153), [Randyyy](https://github.com/code-423n4/2022-07-juicebox-findings/issues/342), [mrpathfindr](https://github.com/code-423n4/2022-07-juicebox-findings/issues/77), [hake](https://github.com/code-423n4/2022-07-juicebox-findings/issues/237), [Funen](https://github.com/code-423n4/2022-07-juicebox-findings/issues/269), [ElKu](https://github.com/code-423n4/2022-07-juicebox-findings/issues/70), [asutorufos](https://github.com/code-423n4/2022-07-juicebox-findings/issues/273), [apostle0x01](https://github.com/code-423n4/2022-07-juicebox-findings/issues/3), [0xdanial](https://github.com/code-423n4/2022-07-juicebox-findings/issues/288), [0x29A](https://github.com/code-423n4/2022-07-juicebox-findings/issues/300), [Rohan16](https://github.com/code-423n4/2022-07-juicebox-findings/issues/267), [rajatbeladiya](https://github.com/code-423n4/2022-07-juicebox-findings/issues/209), [Picodes](https://github.com/code-423n4/2022-07-juicebox-findings/issues/185), [mektigboy](https://github.com/code-423n4/2022-07-juicebox-findings/issues/352), [kebabsec](https://github.com/code-423n4/2022-07-juicebox-findings/issues/134), [Hawkeye](https://github.com/code-423n4/2022-07-juicebox-findings/issues/359), [exd0tpy](https://github.com/code-423n4/2022-07-juicebox-findings/issues/116), [codexploder](https://github.com/code-423n4/2022-07-juicebox-findings/issues/126), [Chom](https://github.com/code-423n4/2022-07-juicebox-findings/issues/324), [Cheeezzyyyy](https://github.com/code-423n4/2022-07-juicebox-findings/issues/86), [0xDjango](https://github.com/code-423n4/2022-07-juicebox-findings/issues/266), and [0x09GTO](https://github.com/code-423n4/2022-07-juicebox-findings/issues/110).*

## [G-01] Run checks first

Running checks before doing other operations can save gas in case the checks don't pass (since less operations were done before the revert).

Lines: [JBDirectory.sol#L270-L278](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBDirectory.sol#L270-L278)

Gas saved: Not measured by tests, can be a few dozen of thousands in case of revert (tested with a contract mocking the same behavior and 3 terminals)

```diff
 
-    // Delete the stored terminals for the project.
-    _terminalsOf[_projectId] = _terminals;
-
     // Make sure duplicates were not added.
+    // @audit run checks before assigning, to save gas in case of revert
     if (_terminals.length > 1)
       for (uint256 _i; _i < _terminals.length; _i++)
         for (uint256 _j = _i + 1; _j < _terminals.length; _j++)
           if (_terminals[_i] == _terminals[_j]) revert DUPLICATE_TERMINALS();
 
+    // Delete the stored terminals for the project.
+    _terminalsOf[_projectId] = _terminals;
+
     emit SetTerminals(_projectId, _terminals, msg.sender);

```

## [G-02] Store elements that are used multiple times 

When the same array/mapping element is accessed more than once at the same block (without being modified) - it's cheaper to store the element as a var and access that var every time.

Gas saved: up to 2K units

*Please see warden's [original report](https://github.com/code-423n4/2022-07-juicebox-findings/issues/161) for full details.*

## [G-03] Make loop increment unchecked 

Overflowing loop index is virtually impossible, therefore it's cheaper to make the increment unchecked. It's also a bit cheaper to use ++i instead of i++.

Gas saved: up to 300 units

Lines:

*   [JBController.sol#L913](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBController.sol#L913)
*   [JBController.sol#L1014](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBController.sol#L1014)
*   [JBDirectory.sol#L139](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBDirectory.sol#L139)
*   [JBDirectory.sol#L167](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBDirectory.sol#L167)
*   [JBDirectory.sol#L275-L276](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBDirectory.sol#L275-L276)
*   [JBETHERC20SplitsPayer.sol#L466](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBETHERC20SplitsPayer.sol#L466)
*   [JBFundingCycleStore.sol#L724](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBFundingCycleStore.sol#L724)
*   [JBOperatorStore.sol#L85](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBOperatorStore.sol#L85)
*   [JBOperatorStore.sol#L138](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBOperatorStore.sol#L138)
*   [JBOperatorStore.sol#L171](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBOperatorStore.sol#L171)
*   [JBSingleTokenPaymentTerminalStore.sol#L862](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSingleTokenPaymentTerminalStore.sol#L862)
*   [JBSplitsStore.sol#L204](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSplitsStore.sol#L204)
*   [JBSplitsStore.sol#L211](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSplitsStore.sol#L211)
*   [JBSplitsStore.sol#L229](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSplitsStore.sol#L229)
*   [JBSplitsStore.sol#L304](https://github.com/jbx-protocol/juice-contracts-v2-code4rena/blob/828bf2f3e719873daa08081cfa0d0a6deaa5ace5/contracts/JBSplitsStore.sol#L304)

```diff
diff --git a/contracts/JBController.sol b/contracts/JBController.sol
index 26cd238..475a35a 100644
--- a/contracts/JBController.sol
+++ b/contracts/JBController.sol
@@ -910,7 +910,7 @@ contract JBController is IJBController, IJBMigratable, JBOperatable, ERC165 {
     JBSplit[] memory _splits = splitsStore.splitsOf(_projectId, _domain, _group);
 
     //Transfer between all splits.
-    for (uint256 _i = 0; _i < _splits.length; _i++) {
+    for (uint256 _i = 0; _i < _splits.length; ) {
       // Get a reference to the split being iterated on.
       JBSplit memory _split = _splits[_i];
 
@@ -964,6 +964,9 @@ contract JBController is IJBController, IJBMigratable, JBOperatable, ERC165 {
         _tokenCount,
         msg.sender
       );
+      unchecked {
+        ++_i;
+      }
     }
   }
 
@@ -1011,7 +1014,7 @@ contract JBController is IJBController, IJBMigratable, JBOperatable, ERC165 {
     splitsStore.set(_projectId, _fundingCycle.configuration, _groupedSplits);
 
     // Set distribution limits if there are any.
-    for (uint256 _i; _i < _fundAccessConstraints.length; _i++) {
+    for (uint256 _i; _i < _fundAccessConstraints.length; ) {
       JBFundAccessConstraints memory _constraints = _fundAccessConstraints[_i];
 
       // If distribution limit value is larger than 232 bits, revert.
@@ -1051,6 +1054,9 @@ contract JBController is IJBController, IJBMigratable, JBOperatable, ERC165 {
         _constraints,
         msg.sender
       );
+      unchecked {
+        ++_i;
+      }
     }
 
     return _fundingCycle.configuration;
diff --git a/contracts/JBDirectory.sol b/contracts/JBDirectory.sol
index 865c719..442e704 100644
--- a/contracts/JBDirectory.sol
+++ b/contracts/JBDirectory.sol
@@ -137,9 +137,12 @@ contract JBDirectory is IJBDirectory, JBOperatable, Ownable {
 
     IJBPaymentTerminal[] storage _terminalOf_projectId = _terminalsOf[_projectId];
     // Return the first terminal which accepts the specified token.
-    for (uint256 _i; _i < _terminalOf_projectId.length; _i++) {
+    for (uint256 _i; _i < _terminalOf_projectId.length; ) {
       IJBPaymentTerminal _terminal = _terminalOf_projectId[_i];
       if (_terminal.acceptsToken(_token, _projectId)) return _terminal;
+      unchecked {
+        ++_i;
+      }
     }
 
     // Not found.
@@ -165,8 +168,12 @@ contract JBDirectory is IJBDirectory, JBOperatable, Ownable {
     override
     returns (bool)
   {
-    for (uint256 _i; _i < _terminalsOf[_projectId].length; _i++)
+    for (uint256 _i; _i < _terminalsOf[_projectId].length; ) {
       if (_terminalsOf[_projectId][_i] == _terminal) return true;
+      unchecked {
+        ++_i;
+      }
+    }
     return false;
   }
 
@@ -272,9 +279,17 @@ contract JBDirectory is IJBDirectory, JBOperatable, Ownable {
     // Make sure duplicates were not added.
     // @audit run checks before assigning, to save gas in case of revert
     if (_terminals.length > 1)
-      for (uint256 _i; _i < _terminals.length; _i++)
-        for (uint256 _j = _i + 1; _j < _terminals.length; _j++)
+      for (uint256 _i; _i < _terminals.length; ) {
+        for (uint256 _j = _i + 1; _j < _terminals.length; ) {
           if (_terminals[_i] == _terminals[_j]) revert DUPLICATE_TERMINALS();
+          unchecked {
+            ++_j;
+          }
+        }
+        unchecked {
+          ++_i;
+        }
+      }
 
     // Delete the stored terminals for the project.
     _terminalsOf[_projectId] = _terminals;
diff --git a/contracts/JBETHERC20SplitsPayer.sol b/contracts/JBETHERC20SplitsPayer.sol
index 97a6517..6c344bd 100644
--- a/contracts/JBETHERC20SplitsPayer.sol
+++ b/contracts/JBETHERC20SplitsPayer.sol
@@ -463,7 +463,7 @@ contract JBETHERC20SplitsPayer is IJBSplitsPayer, JBETHERC20ProjectPayer, Reentr
     leftoverAmount = _amount;
 
     // Settle between all splits.
-    for (uint256 i = 0; i < _splits.length; i++) {
+    for (uint256 i = 0; i < _splits.length; ) {
       // Get a reference to the split being iterated on.
       JBSplit memory _split = _splits[i];
 
@@ -544,6 +544,9 @@ contract JBETHERC20SplitsPayer is IJBSplitsPayer, JBETHERC20ProjectPayer, Reentr
       }
 
       emit DistributeToSplit(_split, _splitAmount, _defaultBeneficiary, msg.sender);
+      unchecked {
+        ++i;
+      }
     }
   }
 }
diff --git a/contracts/JBFundingCycleStore.sol b/contracts/JBFundingCycleStore.sol
index 13fe9e6..79d16c3 100644
--- a/contracts/JBFundingCycleStore.sol
+++ b/contracts/JBFundingCycleStore.sol
@@ -312,8 +312,7 @@ contract JBFundingCycleStore is IJBFundingCycleStore, JBControllerUtility {
     if (_data.weight > type(uint88).max) revert INVALID_WEIGHT();
 
     // Ballot should be a valid contract, supporting the correct interface
-    if(_data.ballot != IJBFundingCycleBallot(address(0))) {
-
+    if (_data.ballot != IJBFundingCycleBallot(address(0))) {
       address _ballot = address(_data.ballot);
       uint32 _size;
       assembly {
@@ -721,7 +722,7 @@ contract JBFundingCycleStore is IJBFundingCycleStore, JBControllerUtility {
     // Apply the base funding cycle's discount rate for each cycle that has passed.
     uint256 _discountMultiple = _startDistance / _baseFundingCycle.duration;
 
-    for (uint256 i = 0; i < _discountMultiple; i++) {
+    for (uint256 i = 0; i < _discountMultiple; ) {
       // The number of times to apply the discount rate.
       // Base the new weight on the specified funding cycle's weight.
       weight = PRBMath.mulDiv(
@@ -731,6 +732,9 @@ contract JBFundingCycleStore is IJBFundingCycleStore, JBControllerUtility {
       );
       // The calculation doesn't need to continue if the weight is 0.
       if (weight == 0) break;
+      unchecked {
+        ++i;
+      }
     }
   }
 
diff --git a/contracts/JBOperatorStore.sol b/contracts/JBOperatorStore.sol
index e1e0241..e67f97d 100644
--- a/contracts/JBOperatorStore.sol
+++ b/contracts/JBOperatorStore.sol
@@ -82,13 +82,16 @@ contract JBOperatorStore is IJBOperatorStore {
     uint256 _domain,
     uint256[] calldata _permissionIndexes
   ) external view override returns (bool) {
-    for (uint256 _i = 0; _i < _permissionIndexes.length; _i++) {
+    for (uint256 _i = 0; _i < _permissionIndexes.length; ) {
       uint256 _permissionIndex = _permissionIndexes[_i];
 
       if (_permissionIndex > 255) revert PERMISSION_INDEX_OUT_OF_BOUNDS();
 
       if (((permissionsOf[_operator][_account][_domain] >> _permissionIndex) & 1) == 0)
         return false;
+      unchecked {
+        ++_i;
+      }
     }
     return true;
   }
@@ -132,7 +135,7 @@ contract JBOperatorStore is IJBOperatorStore {
     @param _operatorData The data that specify the params for each operator being set.
   */
   function setOperators(JBOperatorData[] calldata _operatorData) external override {
-    for (uint256 _i = 0; _i < _operatorData.length; _i++) {
+    for (uint256 _i = 0; _i < _operatorData.length; ) {
       // Pack the indexes into a uint256.
       uint256 _packed = _packedPermissions(_operatorData[_i].permissionIndexes);
 
@@ -146,6 +149,9 @@ contract JBOperatorStore is IJBOperatorStore {
         _operatorData[_i].permissionIndexes,
         _packed
       );
+      unchecked {
+        ++_i;
+      }
     }
   }
 
@@ -162,13 +168,16 @@ contract JBOperatorStore is IJBOperatorStore {
     @return packed The packed value.
   */
   function _packedPermissions(uint256[] calldata _indexes) private pure returns (uint256 packed) {
-    for (uint256 _i = 0; _i < _indexes.length; _i++) {
+    for (uint256 _i = 0; _i < _indexes.length; ) {
       uint256 _index = _indexes[_i];
 
       if (_index > 255) revert PERMISSION_INDEX_OUT_OF_BOUNDS();
 
       // Turn the bit at the index on.
       packed |= 1 << _index;
+      unchecked {
+        ++_i;
+      }
     }
   }
 }
diff --git a/contracts/JBSingleTokenPaymentTerminalStore.sol b/contracts/JBSingleTokenPaymentTerminalStore.sol
index 4fc5d46..21be5ff 100644
--- a/contracts/JBSingleTokenPaymentTerminalStore.sol
+++ b/contracts/JBSingleTokenPaymentTerminalStore.sol
@@ -859,8 +859,12 @@ contract JBSingleTokenPaymentTerminalStore is IJBSingleTokenPaymentTerminalStore
     uint256 _ethOverflow;
 
     // Add the current ETH overflow for each terminal.
-    for (uint256 _i = 0; _i < _terminals.length; _i++)
+    for (uint256 _i = 0; _i < _terminals.length; ) {
       _ethOverflow = _ethOverflow + _terminals[_i].currentEthOverflowOf(_projectId);
+      unchecked {
+        ++_i;
+      }
+    }
 
     // Convert the ETH overflow to the specified currency if needed, maintaining a fixed point number with 18 decimals.
     uint256 _totalOverflow18Decimal = _currency == JBCurrencies.ETH
diff --git a/contracts/JBSplitsStore.sol b/contracts/JBSplitsStore.sol
index be0d17b..2c9d371 100644
--- a/contracts/JBSplitsStore.sol
+++ b/contracts/JBSplitsStore.sol
@@ -201,7 +201,7 @@ contract JBSplitsStore is IJBSplitsStore, JBOperatable {
     JBSplit[] memory _currentSplits = _getStructsFor(_projectId, _domain, _group);
 
     // Check to see if all locked splits are included.
-    for (uint256 _i = 0; _i < _currentSplits.length; _i++) {
+    for (uint256 _i = 0; _i < _currentSplits.length; ) {
       JBSplit memory _currentSplit_i = _currentSplits[_i];
       // If not locked, continue.
       if (block.timestamp >= _currentSplit_i.lockedUntil) continue;
@@ -209,7 +209,7 @@ contract JBSplitsStore is IJBSplitsStore, JBOperatable {
       // Keep a reference to whether or not the locked split being iterated on is included.
       bool _includesLocked = false;
 
-      for (uint256 _j = 0; _j < _splits.length; _j++) {
+      for (uint256 _j = 0; _j < _splits.length; ) {
         // Check for sameness.
         JBSplit memory _split_j = _splits[_j];
         if (
@@ -220,15 +220,22 @@ contract JBSplitsStore is IJBSplitsStore, JBOperatable {
           // Allow lock extention.
           _split_j.lockedUntil >= _currentSplit_i.lockedUntil
         ) _includesLocked = true;
+        unchecked {
+          ++_j;
+        }
       }
 
       if (!_includesLocked) revert PREVIOUS_LOCKED_SPLITS_NOT_INCLUDED();
+
+      unchecked {
+        ++_i;
+      }
     }
 
     // Add up all the percents to make sure they cumulative are under 100%.
     uint256 _percentTotal = 0;
 
-    for (uint256 _i = 0; _i < _splits.length; _i++) {
+    for (uint256 _i = 0; _i < _splits.length; ) {
       JBSplit memory _splits_i = _splits[_i];
       // The percent should be greater than 0.
       if (_splits_i.percent == 0) revert INVALID_SPLIT_PERCENT();
@@ -276,6 +283,9 @@ contract JBSplitsStore is IJBSplitsStore, JBOperatable {
         delete _packedSplitParts2Of[_projectId][_domain][_group][_i];
 
       emit SetSplit(_projectId, _domain, _group, _splits_i, msg.sender);
+      unchecked {
+        ++_i;
+      }
     }
 
     // Set the new length of the splits.
@@ -304,7 +314,7 @@ contract JBSplitsStore is IJBSplitsStore, JBOperatable {
     JBSplit[] memory _splits = new JBSplit[](_splitCount);
 
     // Loop through each split and unpack the values into structs.
-    for (uint256 _i = 0; _i < _splitCount; _i++) {
+    for (uint256 _i = 0; _i < _splitCount; ) {
       // Get a reference to the fist packed data.
       uint256 _packedSplitPart1 = _packedSplitParts1Of[_projectId][_domain][_group][_i];
 
@@ -335,6 +345,9 @@ contract JBSplitsStore is IJBSplitsStore, JBOperatable {
 
       // Add the split to the value being returned.
       _splits[_i] = _split;
+      unchecked {
+        ++_i;
+      }
     }
 
     return _splits;
```

Gas diff:

```diff
╭──────────────────────────────────────────────────┬─────────────────┬─────────┬─────────┬─────────┬─────────╮
 │ contracts/JBController.sol:JBController contract ┆                 ┆         ┆         ┆         ┆         │
 ╞══════════════════════════════════════════════════╪═════════════════╪═════════╪═════════╪═════════╪═════════╡
 │ Deployment Cost                                  ┆ Deployment Size ┆         ┆         ┆         ┆         │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ 3979659                                          ┆ 20791           ┆         ┆         ┆         ┆         │
+│ 3970050                                          ┆ 20743           ┆         ┆         ┆         ┆         │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
 │ Function Name                                    ┆ min             ┆ avg     ┆ median  ┆ max     ┆ # calls │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ burnTokensOf                                     ┆ 30462           ┆ 33235   ┆ 30462   ┆ 38783   ┆ 3       │
+│ burnTokensOf                                     ┆ 30462           ┆ 33211   ┆ 30462   ┆ 38709   ┆ 3       │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
@@ -155,9 +155,9 @@ Test result: ok. 1 passed; 0 failed; finished in 14.33s
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ launchProjectFor                                 ┆ 287838          ┆ 365019  ┆ 363870  ┆ 523212  ┆ 14      │
+│ launchProjectFor                                 ┆ 287838          ┆ 364965  ┆ 363870  ┆ 522765  ┆ 14      │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ mintTokensOf                                     ┆ 20132           ┆ 55030   ┆ 42967   ┆ 102610  ┆ 13      │
+│ mintTokensOf                                     ┆ 20058           ┆ 55019   ┆ 42967   ┆ 102610  ┆ 13      │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
@@ -172,21 +172,21 @@ Test result: ok. 1 passed; 0 failed; finished in 14.33s
 ╞════════════════════════════════════════════════╪═════════════════╪═══════╪════════╪═══════╪═════════╡
 │ Deployment Cost                                ┆ Deployment Size ┆       ┆        ┆       ┆         │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ 1247680                                        ┆ 6698            ┆       ┆        ┆       ┆         │
+│ 1232666                                        ┆ 6623            ┆       ┆        ┆       ┆         │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
 │ Function Name                                  ┆ min             ┆ avg   ┆ median ┆ max   ┆ # calls │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ isTerminalOf                                   ┆ 633             ┆ 1508  ┆ 1065   ┆ 5065  ┆ 26      │
+│ isTerminalOf                                   ┆ 633             ┆ 1497  ┆ 1065   ┆ 5065  ┆ 26      │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ primaryTerminalOf                              ┆ 2295            ┆ 3221  ┆ 2295   ┆ 5853  ┆ 12      │
+│ primaryTerminalOf                              ┆ 2295            ┆ 3209  ┆ 2295   ┆ 5779  ┆ 12      │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ setTerminalsOf                                 ┆ 54817           ┆ 57189 ┆ 54817  ┆ 78546 ┆ 10      │
+│ setTerminalsOf                                 ┆ 54817           ┆ 57167 ┆ 54817  ┆ 78324 ┆ 10      │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
 │ terminalsOf                                    ┆ 1389            ┆ 1389  ┆ 1389   ┆ 1389  ┆ 2       │
 ╰────────────────────────────────────────────────┴─────────────────┴───────┴────────┴───────┴─────────╯
@@ -226,7 +226,7 @@ Test result: ok. 1 passed; 0 failed; finished in 14.33s
 ╞════════════════════════════════════════════════════════════════════╪═════════════════╪═════╪════════╪═════╪═════════╡
 │ Deployment Cost                                                    ┆ Deployment Size ┆     ┆        ┆     ┆         │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ 2292746                                                            ┆ 12218           ┆     ┆        ┆     ┆         │
+│ 2283531                                                            ┆ 12172           ┆     ┆        ┆     ┆         │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
 │ Function Name                                                      ┆ min             ┆ avg ┆ median ┆ max ┆ # calls │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
@@ -249,13 +249,13 @@ Test result: ok. 1 passed; 0 failed; finished in 14.33s
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ distributePayoutsOf                                              ┆ 102240          ┆ 128903 ┆ 128903 ┆ 155567 ┆ 2       │
+│ distributePayoutsOf                                              ┆ 102240          ┆ 128758 ┆ 128758 ┆ 155276 ┆ 2       │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ pay                                                              ┆ 89467           ┆ 105031 ┆ 105031 ┆ 120596 ┆ 2       │
+│ pay                                                              ┆ 89319           ┆ 104957 ┆ 104957 ┆ 120596 ┆ 2       │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ redeemTokensOf                                                   ┆ 68162           ┆ 87607  ┆ 87607  ┆ 107052 ┆ 2       │
+│ redeemTokensOf                                                   ┆ 68162           ┆ 87496  ┆ 87496  ┆ 106830 ┆ 2       │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
 │ supportsInterface                                                ┆ 503             ┆ 685    ┆ 655    ┆ 853    ┆ 9       │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
@@ -268,7 +268,7 @@ Test result: ok. 1 passed; 0 failed; finished in 14.33s
 ╞════════════════════════════════════════════════════════════════╪═════════════════╪═══════╪════════╪════════╪═════════╡
 │ Deployment Cost                                                ┆ Deployment Size ┆       ┆        ┆        ┆         │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ 1055746                                                        ┆ 5457            ┆       ┆        ┆        ┆         │
+│ 1048339                                                        ┆ 5420            ┆       ┆        ┆        ┆         │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
 │ Function Name                                                  ┆ min             ┆ avg   ┆ median ┆ max    ┆ # calls │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
@@ -330,7 +330,7 @@ Test result: ok. 1 passed; 0 failed; finished in 14.33s
 ╞════════════════════════════════════════════════════════════════════════════════════════════╪═════════════════╪═══════╪════════╪═══════╪═════════╡
 │ Deployment Cost                                                                            ┆ Deployment Size ┆       ┆        ┆       ┆         │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ 2551081                                                                                    ┆ 13119           ┆       ┆        ┆       ┆         │
+│ 2543674                                                                                    ┆ 13082           ┆       ┆        ┆       ┆         │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
 │ Function Name                                                                              ┆ min             ┆ avg   ┆ median ┆ max   ┆ # calls │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
@@ -338,13 +338,13 @@ Test result: ok. 1 passed; 0 failed; finished in 14.33s
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ currentTotalOverflowOf                                                                     ┆ 31426           ┆ 31426 ┆ 31426  ┆ 31426 ┆ 1       │
+│ currentTotalOverflowOf                                                                     ┆ 31278           ┆ 31278 ┆ 31278  ┆ 31278 ┆ 1       │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ recordRedemptionFor                                                                        ┆ 25847           ┆ 33828 ┆ 25847  ┆ 49791 ┆ 3       │
+│ recordRedemptionFor                                                                        ┆ 25847           ┆ 33779 ┆ 25847  ┆ 49643 ┆ 3       │
 ╰────────────────────────────────────────────────────────────────────────────────────────────┴─────────────────┴───────┴────────┴───────┴─────────╯
@@ -353,15 +353,15 @@ Test result: ok. 1 passed; 0 failed; finished in 14.33s
 ╞════════════════════════════════════════════════════╪═════════════════╪══════╪════════╪═══════╪═════════╡
 │ Deployment Cost                                    ┆ Deployment Size ┆      ┆        ┆       ┆         │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ 751811                                             ┆ 4116            ┆      ┆        ┆       ┆         │
+│ 736791                                             ┆ 4041            ┆      ┆        ┆       ┆         │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
 │ Function Name                                      ┆ min             ┆ avg  ┆ median ┆ max   ┆ # calls │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ set                                                ┆ 2998            ┆ 5840 ┆ 2998   ┆ 57007 ┆ 19      │
+│ set                                                ┆ 2998            ┆ 5836 ┆ 2998   ┆ 56930 ┆ 19      │
 ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
-│ splitsOf                                           ┆ 2941            ┆ 4853 ┆ 2941   ┆ 8679  ┆ 3       │
+│ splitsOf                                           ┆ 2941            ┆ 4830 ┆ 2941   ┆ 8610  ┆ 3       │
 

```

**[drgorillamd (Juicebox) commented](https://github.com/code-423n4/2022-07-juicebox-findings/issues/161#issuecomment-1183203750):**
 > Really nice PoC/gas analysis, thank you.

# Mitigation Review

*Mitigation review by [berndartmueller](https://twitter.com/berndartmueller)*

**Reviewed pull requests:** [PR#1](https://github.com/jbx-protocol/juice-contracts-v3/pull/1/) (`b8e2472ce750ad084440c8db6090143807e79893`), [PR#4](https://github.com/jbx-protocol/juice-contracts-v3/pull/4)

## Mitigation Overview

The following is a high-level overview of the core changes introduced as the mitigation, arranged per the report findings.

* [H-01] Resolved. Appropriate validations to prevent price staleness, round incompleteness and a negative price is put in place now.
* [H-02] Resolved. Changing an already set project token is not possible anymore.
* [M-01] Acknowledged. 
* [M-02] Resolved. `mustStartAtOrAfter` and the start date of an upcoming funding cycle are now validated to fit in `uint56`.
* [M-03] Resolved. OpenZeppelins&#39; `SafeERC20` library is now used to ensure consistent handling of ERC20 token transfers.
* [M-04] Acknowledged.
* [M-05] Acknowledged.
* [M-06] Resolved. The delta of the token balance before and after a transfer is used instead of the amount stated to handle fee-on-transfer tokens appropriately.
* [M-07] Acknowledged.
* [M-08] Acknowledged.
* [M-09] Acknowledged.
* [M-10] Acknowledged.
* [M-11] Resolved. An additional check has been added to prevent adding a price feed for the inverse pair.
* [M-12] Resolved. Once a token is set for a project, it can not be changed anymore.
* [M-13] Acknowledged.
* [M-14] Acknowledged.
* [M-15] Resolved. Two additional sameness checks for the split properties `preferClaimed` and `preferAddToBalance` have been added.

## Medium Risk Findings (1)

### [M.M-01] Migrating from V2 to V3 will cause issues with funding cycle metadata

**Context:** [libraries/JBFundingCycleMetadataResolver.sol#L150-L157](https://github.com/jbx-protocol/juice-contracts-v3/blob/b8e2472ce750ad084440c8db6090143807e79893/contracts/libraries/JBFundingCycleMetadataResolver.sol#L150-L157) 

**Status:** Acknowledged. Juicebox projects have to instantiate new V3 funding cycles if they wish to migrate from V2 to V3.

**Description:** In V3, the funding cycle metadata bitmask changes due to removing the parameter `allowChangeToken` and adding the new parameter `preferClaimedTokenOverride`. However, projects migrating from V2 to V3 with certain funding cycle metadata bits set will experience a possibly different funding cycle configuration than anticipated.

The following table shows a comparison of the occupied bits of affected funding cycle metadata parameters in V2 and V3:

| Metadata Param             | Bit Previously | Bit Now |
| -------------------------- | -------------- | ------- |
| allowChangeToken           | 77             | -       |
| allowTerminalMigration     | 78             | 77      |
| allowControllerMigration   | 79             | 78      |
| holdFees                   | 80             | 79      |
| preferClaimedTokenOverride | -              | 80      |

```solidity
function packFundingCycleMetadata(JBFundingCycleMetadata memory _metadata)
    internal
    pure
    returns (uint256 packed)
{
  [..]

  // allow terminal migration in bit 77.
  if (_metadata.allowTerminalMigration) packed |= 1 &lt;&lt; 77;
  // allow controller migration in bit 78.
  if (_metadata.allowControllerMigration) packed |= 1 &lt;&lt; 78;
  // hold fees in bit 79.
  if (_metadata.holdFees) packed |= 1 &lt;&lt; 79;
  // prefer claimed token override in bit 80.
  if (_metadata.preferClaimedTokenOverride) packed |= 1 &lt;&lt; 80;

  [..]
}
```

#### Recommendation

Consider not changing the existing bits and their representation. Instead, add new metadata parameters to available most significant bits.

For example, consider storing the newly added `_metadata.metadata` in bits **248-256** (instead of using bits 244-252) and use one of the 4 available bits **244-247** for `_metadata.preferClaimedTokenOverride`.

## Low Risk Findings (1)

### [M.L-01] `defaultBeneficiary` is not used consistently

**Context:** [JBETHERC20ProjectPayer.sol](https://github.com/jbx-protocol/juice-contracts-v3/blob/b8e2472ce750ad084440c8db6090143807e79893/contracts/JBETHERC20ProjectPayer.sol), [JBETHERC20SplitsPayer.sol](https://github.com/jbx-protocol/juice-contracts-v3/blob/b8e2472ce750ad084440c8db6090143807e79893/contracts/JBETHERC20SplitsPayer.sol) 

**Status:** Resolved in [PR#5](https://github.com/jbx-protocol/juice-contracts-v3/pull/5)

**Description:** When deploying a new instance of a `JBETHERC20ProjectPayer` or `JBETHERC20SplitsPayer` contract, the deployer can provide a default beneficiary address `defaultBeneficiary`. If the beneficiary is `address(0)`, this default beneficiary address will receive the project&#39;s tokens when the project payer receives payments.

However, `defaultBeneficiary` is only used within the `receive()` function. In the `pay(..)` function, the beneficiary, if set to `address(0)`, will immediately default to `tx.origin`.

#### Recommendation

Consider using `defaultBeneficiary` consistently and if `defaultBeneficiary` is set to `address(0)`, only then default to `tx.origin`.

## Non-Critical Findings (1)

### [M.N-01] `msg.sender` address is not checked if it is a feeless address

**Context:** [abstract/JBPayoutRedemptionPaymentTerminal.sol](https://github.dev/jbx-protocol/juice-contracts-v3/blob/b8e2472ce750ad084440c8db6090143807e79893/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol) 

**Status:** Acknowledged. Feeless sender for distributions is removed in V3. Comment adjusted in [PR#6](https://github.com/jbx-protocol/juice-contracts-v3/pull/6)

**Description:** According to the comment on [L897](https://github.dev/jbx-protocol/juice-contracts-v3/blob/b8e2472ce750ad084440c8db6090143807e79893/contracts/abstract/JBPayoutRedemptionPaymentTerminal.sol#L897):

&gt; _// If the fee is zero or if the fee is **being used by an address that doesn&#39;t incur fees**, set the discount to 100% for convenience._

If the caller is an address that doesn&#39;t incur fees, the discount should be set to 100%. However, in the latest version, `msg.sender` is no longer checked if it is considered a feeless address.

[See diff](https://github.com/jbx-protocol/juice-contracts-v3/commit/8152fe45f7942d902a09fb8bff8663ad82e68e1f#diff-8ec76bd6ac0d417026483831ccb26d6b6bd986bf09e0749db9c77c4df7edf286L838)

```diff
// If the fee is zero or if the fee is being used by an address that doesn&#39;t incur fees, set the discount to 100% for convenience.
- uint256 _feeDiscount = fee == 0 || isFeelessAddress[msg.sender]
+ uint256 _feeDiscount = fee == 0
  ? JBConstants.MAX_FEE_DISCOUNT
  : _currentFeeDiscount(_projectId);
```

#### Recommendation

Consider reverting the change and check if `msg.sender` is a feeless address.</div>

***

# Disclosures

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.
