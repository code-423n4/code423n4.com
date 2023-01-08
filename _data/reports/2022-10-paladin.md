---
sponsor: "Paladin"
slug: "2022-10-paladin"
date: "2023-01-06"
title: "Paladin - Warden Pledges contest"
findings: "https://github.com/code-423n4/2022-10-paladin-findings/issues"
contest: 176
---

# Overview

## About C4

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the Paladin - Warden Pledges smart contract system written in Solidity. The audit contest took place between October 27—October 30 2022.

## Wardens

97 Wardens contributed reports to the Paladin - Warden Pledges contest:

  1. 0x007
  2. 0x1f8b
  3. 0x52
  4. [0xDecorativePineapple](https://decorativepineapple.github.io/)
  5. 0xDjango
  6. [0xNazgul](https://twitter.com/0xNazgul)
  7. [0xRoxas](https://twitter.com/0xRoxas)
  8. [0xSmartContract](https://twitter.com/0xSmartContract)
  9. 0xbepresent
  10. 0xhunter
  11. [8olidity](https://twitter.com/8olidity)
  12. Amithuddar
  13. Awesome
  14. [Aymen0909](https://github.com/Aymen1001)
  15. B2
  16. Bnke0x0
  17. [Chom](https://chom.dev)
  18. Diana
  19. [Dravee](https://twitter.com/BowTiedDravee)
  20. JTJabba
  21. [Jeiwan](https://jeiwan.net)
  22. Josiah
  23. KingNFT
  24. KoKo
  25. Lambda
  26. Mathieu
  27. [Nyx](https://twitter.com/Nyksx__)
  28. [Picodes](https://twitter.com/thePicodes)
  29. RaoulSchaffranek
  30. RaymondFam
  31. RedOneN
  32. ReyAdmirado
  33. RockingMiles (robee and pants)
  34. Rolezn
  35. [Ruhum](https://twitter.com/0xruhum)
  36. SadBase
  37. [Sm4rty](https://twitter.com/Sm4rty_)
  38. SooYa
  39. Tricko
  40. [Trust](https://twitter.com/trust__90)
  41. Waze
  42. \_\_141345\_\_
  43. [a12jmx](https://twitter.com/a12jmx)
  44. [adriro](https://github.com/romeroadrian)
  45. ajtra
  46. ballx
  47. [bin2chen](https://twitter.com/bin2chen)
  48. brgltd
  49. [c3phas](https://twitter.com/c3ph_)
  50. [carlitox477](https://twitter.com/CAA1994)
  51. cccz
  52. ch0bu
  53. chaduke
  54. chrisdior4
  55. codexploder
  56. corerouter
  57. cryptonue
  58. [csanuragjain](https://twitter.com/csanuragjain)
  59. ctf\_sec
  60. [cylzxje](https://twitter.com/cylzxje)
  61. delfin454000
  62. dic0de
  63. djxploit
  64. [durianSausage](https://github.com/lyciumlee)
  65. emrekocak
  66. erictee
  67. [gogo](https://www.linkedin.com/in/georgi-nikolaev-georgiev-978253219)
  68. halden
  69. [hansfriese](https://twitter.com/hansfriese)
  70. horsefacts
  71. hxzy
  72. imare
  73. [indijanc](https://twitter.com/krenkmet)
  74. jayphbee
  75. jwood
  76. karanctf
  77. ktg
  78. ladboy233
  79. leosathya
  80. lukris02
  81. minhtrng
  82. neko\_nyaa
  83. [oyc\_109](https://twitter.com/andyfeili)
  84. pashov
  85. peiw
  86. peritoflores
  87. rbserver
  88. robee
  89. rvierdiiev
  90. sakman
  91. shark
  92. skyle
  93. subtle77
  94. tnevler
  95. wagmi
  96. yixxas

This contest was judged by [kirk-baird](https://github.com/kirk-baird).

Final report assembled by [itsmetechjay](https://twitter.com/itsmetechjay).

# Summary

The C4 analysis yielded an aggregated total of 8 unique vulnerabilities. Of these vulnerabilities, 0 received a risk rating in the category of HIGH severity and 8 received a risk rating in the category of MEDIUM severity.

Additionally, C4 analysis included 68 reports detailing issues with a risk rating of LOW severity or non-critical. There were also 49 reports recommending gas optimizations.

All of the issues presented here are linked back to their original finding.

# Scope

The code under review can be found within the [C4 Paladin - Warden Pledges contest repository](https://github.com/code-423n4/2022-10-paladin), and is composed of 1 smart contract written in the Solidity programming language and includes 317 lines of Solidity code.

# Severity Criteria

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low/non-critical.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

- Malicious Input Handling
- Escalation of privileges
- Arithmetic
- Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code4rena.com).

# Medium Risk Findings (8)
## [[M-01] Due to loss of precision, targetVotes may not reach](https://github.com/code-423n4/2022-10-paladin-findings/issues/59)
*Submitted by [cccz](https://github.com/code-423n4/2022-10-paladin-findings/issues/59)*

In the `\_pledge` function, require delegationBoost.adjusted_balance_of(pledgeParams.receiver) + amount <= pledgeParams.targetVotes.

In reality, when the user pledges the amount of votes, the actual votes received by the receiver are the bias in the following calculation. And the bias will be less than amount due to the loss of precision.

            uint256 slope = amount / boostDuration;
            uint256 bias = slope * boostDuration;

This means that the balance of receiver may not reach targetVotes

        point = self._checkpoint_read(_user, False)
        amount += (point.bias - point.slope * (block.timestamp - point.ts))
        return amount

### Proof of Concept

<https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L245-L246>

<https://github.com/curvefi/curve-veBoost/blob/master/contracts/BoostV2.vy#L192-L209>

<https://github.com/curvefi/curve-veBoost/blob/master/contracts/BoostV2.vy#L175>

### Recommended Mitigation Steps

Use bias instead of amount in the check below:

            uint256 slope = amount / boostDuration;
            uint256 bias = slope * boostDuration;
            if(delegationBoost.adjusted_balance_of(pledgeParams.receiver) + bias > pledgeParams.targetVotes) revert Errors.TargetVotesOverflow();
            delegationBoost.boost(
                pledgeParams.receiver,
                amount,
                endTimestamp,
                user
            );

**[Kogaroshi (Paladin) acknowledged and commented](https://github.com/code-423n4/2022-10-paladin-findings/issues/59#issuecomment-1296374082):**
 > The current check is made that way to prevent any unnecessary call to the BoostV2 contract (and save gas by not creating the Boost) in the case of a `targetVotes` overflow.

***

## [[M-02] Owner can transfer all ERC20 reward token out using function recoverERC20](https://github.com/code-423n4/2022-10-paladin-findings/issues/68)
*Submitted by [ladboy233](https://github.com/code-423n4/2022-10-paladin-findings/issues/68), also found by [yixxas](https://github.com/code-423n4/2022-10-paladin-findings/issues/283), [JTJabba](https://github.com/code-423n4/2022-10-paladin-findings/issues/274), [rbserver](https://github.com/code-423n4/2022-10-paladin-findings/issues/270), [Aymen0909](https://github.com/code-423n4/2022-10-paladin-findings/issues/259), [horsefacts](https://github.com/code-423n4/2022-10-paladin-findings/issues/249), [minhtrng](https://github.com/code-423n4/2022-10-paladin-findings/issues/247), [0xhunter](https://github.com/code-423n4/2022-10-paladin-findings/issues/242), [Trust](https://github.com/code-423n4/2022-10-paladin-findings/issues/236), [peritoflores](https://github.com/code-423n4/2022-10-paladin-findings/issues/219), [0xDecorativePineapple](https://github.com/code-423n4/2022-10-paladin-findings/issues/207), [Dravee](https://github.com/code-423n4/2022-10-paladin-findings/issues/206), [hansfriese](https://github.com/code-423n4/2022-10-paladin-findings/issues/196), [imare](https://github.com/code-423n4/2022-10-paladin-findings/issues/179), [Jeiwan](https://github.com/code-423n4/2022-10-paladin-findings/issues/162), [wagmi](https://github.com/code-423n4/2022-10-paladin-findings/issues/154), [0x52](https://github.com/code-423n4/2022-10-paladin-findings/issues/148), [Picodes](https://github.com/code-423n4/2022-10-paladin-findings/issues/130), [cryptonue](https://github.com/code-423n4/2022-10-paladin-findings/issues/116), [pashov](https://github.com/code-423n4/2022-10-paladin-findings/issues/106), [Bnke0x0](https://github.com/code-423n4/2022-10-paladin-findings/issues/84), [Lambda](https://github.com/code-423n4/2022-10-paladin-findings/issues/81), [Nyx](https://github.com/code-423n4/2022-10-paladin-findings/issues/60), [cccz](https://github.com/code-423n4/2022-10-paladin-findings/issues/54), [dic0de](https://github.com/code-423n4/2022-10-paladin-findings/issues/44), [csanuragjain](https://github.com/code-423n4/2022-10-paladin-findings/issues/29), and [rvierdiiev](https://github.com/code-423n4/2022-10-paladin-findings/issues/17)*

The function recoverERC20 is very privileged. It means to recover any token that is accidently sent to the contract.

```solidity
function recoverERC20(address token) external onlyOwner returns(bool) {
	if(minAmountRewardToken[token] != 0) revert Errors.CannotRecoverToken();

	uint256 amount = IERC20(token).balanceOf(address(this));
	if(amount == 0) revert Errors.NullValue();
	IERC20(token).safeTransfer(owner(), amount);

	return true;
}
```

However, admin / owner can use this function to transfer all the reserved reward tokens, which result in fund loss of the pledge creator and the loss of reward for users that want to delegate the veToken.

Also, the recovered token is sent to owner directly instead of sending to a recipient address.

The safeguard

```solidity
if(minAmountRewardToken[token] != 0)
```

cannot stop owner transferring funds because if the owner is compromised or misbehaves, he can adjust the whitelist easily.

### Proof of Concept

The admin can set minAmountRewardToken\[token] to 0 first by calling updateRewardToken:

```solidity
function updateRewardToken(address token, uint256 minRewardPerSecond) external onlyOwner {
```

By doing this the admin removes the token from the whitelist, then the token can call recoverERC20 to transfer all the token into the owner wallet.

```solidity
function recoverERC20(address token) external onlyOwner returns(bool) {
```

### Recommended Mitigation Steps

We recommend that the project uses a multisig wallet to safeguard the owner's wallet.

We can also keep track of the reserved amount for rewarding token and only transfer the remaining amount of token out.

```solidity
 pledgeAvailableRewardAmounts[pledgeId] += totalRewardAmount;
 reservedReward[token] += totalRewardAmount;
```

Then we can change the implementation to:

```solidity
function recoverERC20(address token, address recipient) external onlyOwner returns(bool) {

	uint256 amount = IERC20(token).balanceOf(address(this));
	if(amount == 0) revert Errors.NullValue();

	if(minAmountRewardToken[token] == 0) {
	 // if it is not whitelisted, we assume it is mistakenly sent, 
	   // we transfer the token to recipient
	 IERC20(token).safeTransfer(recipient, amount);
	} else {
	// revert if the owner over transfer
	if(amount >  reservedReward[token]) revert rewardReserved();
	  IERC20(token).safeTransfer(recipient, amount - reservedReward[token]);
	}

	return true;

}
```

**[Kogaroshi (Paladin) confirmed](https://github.com/code-423n4/2022-10-paladin-findings/issues/17)**

**[Kogaroshi (Paladin) commented](https://github.com/code-423n4/2022-10-paladin-findings/issues/68#issuecomment-1296375338):**
 > Interesting proposed Mitigation to be noted. 
***

## [[M-03] Pledge may be out of reward due to the decay in veCRV balance. targetVotes is never reached.](https://github.com/code-423n4/2022-10-paladin-findings/issues/91)
*Submitted by [Chom](https://github.com/code-423n4/2022-10-paladin-findings/issues/91), also found by [Jeiwan](https://github.com/code-423n4/2022-10-paladin-findings/issues/167), [Picodes](https://github.com/code-423n4/2022-10-paladin-findings/issues/131), and [KingNFT](https://github.com/code-423n4/2022-10-paladin-findings/issues/120)*

<https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L325-L335>

<https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L259-L268>

### Impact

Pledge may be out of reward due to the decay in veCRV balance. The receiver may lose his reward given to boosters but get nothing in return since her targetVotes is never reached.

### Proof of Concept

According to Curve documentation at <https://curve.readthedocs.io/dao-vecrv.html>

    A user’s veCRV balance decays linearly as the remaining time until the CRV unlock decreases. For example, a balance of 4000 CRV locked for one year provides the same amount of veCRV as 2000 CRV locked for two years, or 1000 CRV locked for four years.

On creation, targetVotes = 100, balance = 20 -> votesDifference = 80 -> reward is allocated for 80 votes

```solidity
        // Get the missing votes for the given receiver to reach the target votes
        // We ignore any delegated boost here because they might expire during the Pledge duration
        // (we can have a future version of this contract using adjusted_balance)
        vars.votesDifference = targetVotes - votingEscrow.balanceOf(receiver);

        vars.totalRewardAmount = (rewardPerVote * vars.votesDifference * vars.duration) / UNIT;
        vars.feeAmount = (vars.totalRewardAmount * protocalFeeRatio) / MAX_PCT ;
        if(vars.totalRewardAmount > maxTotalRewardAmount) revert Errors.IncorrectMaxTotalRewardAmount();
        if(vars.feeAmount > maxFeeAmount) revert Errors.IncorrectMaxFeeAmount();

        // Pull all the rewards in this contract
        IERC20(rewardToken).safeTransferFrom(creator, address(this), vars.totalRewardAmount);
        // And transfer the fees from the Pledge creator to the Chest contract
        IERC20(rewardToken).safeTransferFrom(creator, chestAddress, vars.feeAmount);
```

Then 1 week passed, receiver's balance decay to 10

On creation, targetVotes = 100, balance = 10 but votesDifference stays 80, and reward has only allocated for 80 votes.

```solidity
        // Rewards are set in the Pledge as reward/veToken/sec
        // To find the total amount of veToken delegated through the whole Boost duration
        // based on the Boost bias & the Boost duration, to take in account that the delegated amount decreases
        // each second of the Boost duration
        uint256 totalDelegatedAmount = ((bias * boostDuration) + bias) / 2;
        // Then we can calculate the total amount of rewards for this Boost
        uint256 rewardAmount = (totalDelegatedAmount * pledgeParams.rewardPerVote) / UNIT;

        if(rewardAmount > pledgeAvailableRewardAmounts[pledgeId]) revert Errors.RewardsBalanceTooLow();
        pledgeAvailableRewardAmounts[pledgeId] -= rewardAmount;
```

A booster boosts 80 votes and takes all rewards in the pool. However, only 80 (From booster) + 10 (From receiver) = 90 votes is active. Not 100 votes that receiver promise in the targetVotes.

Then, if another booster tries to boost 10 votes, it will be reverted with RewardsBalanceTooLow since the first booster has taken all reward that is allocated for only 80 votes.

### Recommended Mitigation Steps

You should provide a way for the creator to provide additional rewards after the pledge creation. Or provide some reward refreshment function that recalculates votesDifference and transfers the required additional reward.

**[Kogaroshi (Paladin) confirmed, resolved, and commented](https://github.com/code-423n4/2022-10-paladin-findings/issues/91#issuecomment-1301494542):**
 > Changed the logic in [PR 2](https://github.com/PaladinFinance/Warden-v2/pull/2), [commit](https://github.com/PaladinFinance/Warden-v2/pull/2/commits/edc9b0280bbb4144d3983642eeab9db17499e9f6)
> Now the whole amount of votes needed for each second of the Pledge duration is calculated, taking in account the receiver potential veCRV balance, and the veCRV decay.
> 
> This should allow to add only the exact amount of reward needed to the Pledge reward pool, and have always the correct amount of rewards to achieve the vote target of the Pledge at all times.

**[Kogaroshi (Paladin) commented](https://github.com/code-423n4/2022-10-paladin-findings/issues/91#issuecomment-1301495120):**
 > If possible, a feedback on the new calculation and logic would be appreciated.

***

## [[M-04] Pledges that contain delisted tokens can be extended to continue using delisted reward tokens](https://github.com/code-423n4/2022-10-paladin-findings/issues/145)
*Submitted by [0x52](https://github.com/code-423n4/2022-10-paladin-findings/issues/145), also found by [bin2chen](https://github.com/code-423n4/2022-10-paladin-findings/issues/159)*

Delisted reward tokens can continue to be used by extending current pledges that already use it.

### Proof of Concept

    if(pledgeId >= pledgesIndex()) revert Errors.InvalidPledgeID();
    address creator = pledgeOwner[pledgeId];
    if(msg.sender != creator) revert Errors.NotPledgeCreator();


    Pledge storage pledgeParams = pledges[pledgeId];
    if(pledgeParams.closed) revert Errors.PledgeClosed();
    if(pledgeParams.endTimestamp <= block.timestamp) revert Errors.ExpiredPledge();
    if(newEndTimestamp == 0) revert Errors.NullEndTimestamp();
    uint256 oldEndTimestamp = pledgeParams.endTimestamp;
    if(newEndTimestamp != _getRoundedTimestamp(newEndTimestamp) || newEndTimestamp < oldEndTimestamp) revert Errors.InvalidEndTimestamp();


    uint256 addedDuration = newEndTimestamp - oldEndTimestamp;
    if(addedDuration < minDelegationTime) revert Errors.DurationTooShort();
    uint256 totalRewardAmount = (pledgeParams.rewardPerVote * pledgeParams.votesDifference * addedDuration) / UNIT;
    uint256 feeAmount = (totalRewardAmount * protocalFeeRatio) / MAX_PCT ;
    if(totalRewardAmount > maxTotalRewardAmount) revert Errors.IncorrectMaxTotalRewardAmount();
    if(feeAmount > maxFeeAmount) revert Errors.IncorrectMaxFeeAmount();

During the input validation checks, it's never checked that reward token of the pledge being extended is still a valid reward token. This would allow creators using delisted tokens to continue using them as long as they wanted, by simply extending their currently active pledges.

### Recommended Mitigation Steps

Add the following check during the input validation block:

    +   if(minAmountRewardToken[rewardToken] == 0) revert Errors.TokenNotWhitelisted();

**[Kogaroshi (Paladin) confirmed, resolved, and commented](https://github.com/code-423n4/2022-10-paladin-findings/issues/145#issuecomment-1297680425):**
 > Fixed in [PR 2](https://github.com/PaladinFinance/Warden-v2/pull/2), [commit](https://github.com/PaladinFinance/Warden-v2/pull/2/commits/37ecb4f318bf60edcb75b49c41e56d44c72bd2c4).

**[kirk-baird (judge) commented](https://github.com/code-423n4/2022-10-paladin-findings/issues/145#issuecomment-1311337350):**
 > I consider this a valid Medium risk as pledges can be extended indefinitely. It bypasses the whitelisting which may be damaging if a token is found to be malicious and removed.



***

## [[M-05] WardenPledge accidentally inherits Ownable instead of Owner which removes an important safeguard without sponsor knowledge](https://github.com/code-423n4/2022-10-paladin-findings/issues/161)
*Submitted by [0x52](https://github.com/code-423n4/2022-10-paladin-findings/issues/161), also found by [pashov](https://github.com/code-423n4/2022-10-paladin-findings/issues/284) and [indijanc](https://github.com/code-423n4/2022-10-paladin-findings/issues/180)*

Owner may accidentally transfer ownership to inoperable address due to perceived safeguard that doesn't exist.

### Proof of Concept

    contract WardenPledge is Ownable, Pausable, ReentrancyGuard {

WardenPledge inherits from Ownable rather than Owner, which is the intended contract. Owner overwrites the critical Ownable#transferOwnership function to make the ownership transfer process a two step process. This adds important safeguards because in the event that the target is unable to accept for any reason (input typo, incompatible multisig/contract, etc.) the ownership transfer process will fail because the pending owner will not be able to accept the transfer. To make matters worse, since it only overwrites the transferOwnership function the WardenPledge contract will otherwise function as intended just without this safeguard. It is likely that the owner won't even realize until it's too late and the safeguard has failed. A perceived safeguard where there isn't one is more damaging than not having any safeguard at all.

### Recommended Mitigation Steps

    -   contract WardenPledge is Ownable, Pausable, ReentrancyGuard {
    +   contract WardenPledge is Owner, Pausable, ReentrancyGuard {

**[Kogaroshi (Paladin) confirmed](https://github.com/code-423n4/2022-10-paladin-findings/issues/180)**

***

## [[M-06] Reward can be over- or undercounted in `extendPledge` and `increasePledgeRewardPerVote`](https://github.com/code-423n4/2022-10-paladin-findings/issues/163)
*Submitted by [Jeiwan](https://github.com/code-423n4/2022-10-paladin-findings/issues/163), also found by [Aymen0909](https://github.com/code-423n4/2022-10-paladin-findings/issues/280), [Trust](https://github.com/code-423n4/2022-10-paladin-findings/issues/234), [0xDjango](https://github.com/code-423n4/2022-10-paladin-findings/issues/186), [Chom](https://github.com/code-423n4/2022-10-paladin-findings/issues/94), [Lambda](https://github.com/code-423n4/2022-10-paladin-findings/issues/83), and [Ruhum](https://github.com/code-423n4/2022-10-paladin-findings/issues/61)*

<https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L387>

<https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L432>

### Impact

Total reward amount in `extendPledge` and `increasePledgeRewardPerVote` can be calculated incorrectly due to cached `pledgeParams.votesDifference`, which can lead to two outcomes:

1.  total reward amount is higher, thus a portion of it won't be claimable;
2.  total reward amount is lower, thus the pledge target won't be reached.

### Proof of Concept

When a pledge is created, the creator chooses the target–the total amount of votes they want to reach with the pledge. Based on a target, the number of missing votes is calculated, which is then used to calculated the total reward amount ([WardenPledge.sol#L325-L327](https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L325-L327)):

```solidity
function createPledge(
    address receiver,
    address rewardToken,
    uint256 targetVotes,
    uint256 rewardPerVote, // reward/veToken/second
    uint256 endTimestamp,
    uint256 maxTotalRewardAmount,
    uint256 maxFeeAmount
) external whenNotPaused nonReentrant returns(uint256){
    ...
    // Get the missing votes for the given receiver to reach the target votes
    // We ignore any delegated boost here because they might expire during the Pledge duration
    // (we can have a future version of this contract using adjusted_balance)
    vars.votesDifference = targetVotes - votingEscrow.balanceOf(receiver);

    vars.totalRewardAmount = (rewardPerVote * vars.votesDifference * vars.duration) / UNIT;
    ...
  }
```

When extending a pledge or increasing a pledge reward per vote, current veToken balance of the pledge's receiver (`votingEscrow.balanceOf(receiver)`) can be different from the one it had when the pledge was created (e.g. the receiver managed to lock more CRV or some of locked tokens have expired). However `pledgeParams.votesDifference` is not recalculated ([WardenPledge.sol#L387](https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L387), [WardenPledge.sol#L432](https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L432)):

```solidity
function extendPledge(
    uint256 pledgeId,
    uint256 newEndTimestamp,
    uint256 maxTotalRewardAmount,
    uint256 maxFeeAmount
) external whenNotPaused nonReentrant {
    ...
    Pledge storage pledgeParams = pledges[pledgeId];
    ...
    uint256 totalRewardAmount = (pledgeParams.rewardPerVote * pledgeParams.votesDifference * addedDuration) / UNIT;
    ...
}

function increasePledgeRewardPerVote(
    uint256 pledgeId,
    uint256 newRewardPerVote,
    uint256 maxTotalRewardAmount,
    uint256 maxFeeAmount
) external whenNotPaused nonReentrant {
    ...
    Pledge storage pledgeParams = pledges[pledgeId];
    ...
    uint256 totalRewardAmount = (rewardPerVoteDiff * pledgeParams.votesDifference * remainingDuration) / UNIT;
    ...
}
```

This can lead to two consequences:

1.  When receiver's veToken balance has increased (i.e. `votesDifference` got in fact smaller), pledge creator will overpay for pledge extension and pledge reward per vote increase. This extra reward cannot be received by pledgers because a receiver cannot get more votes than `pledgeParams.targetVotes` (which is not updated when modifying a pledge):
    ```solidity
    function _pledge(uint256 pledgeId, address user, uint256 amount, uint256 endTimestamp) internal {
        ...
        // Check that this will not go over the Pledge target of votes
        if(delegationBoost.adjusted_balance_of(pledgeParams.receiver) + amount > pledgeParams.targetVotes) revert Errors.TargetVotesOverflow();
        ...
    }
    ```
2.  When receiver's veToken balance has decreased (i.e. `votesDifference` got in fact bigger), the pledge target cannot be reached because the reward amount was underpaid in `extendPledge`/`increasePledgeRewardPerVote`.

### Recommended Mitigation Steps

Consider updating `votesDifference` when extending a pledge or increasing a pledge reward per vote.

**[Kogaroshi (Paladin) confirmed and commented](https://github.com/code-423n4/2022-10-paladin-findings/issues/163#issuecomment-1301496158):**
 > As stated in [#91](https://github.com/code-423n4/2022-10-paladin-findings/issues/91), new method for needed votes & needed reward calculations is introduced in this [commit](https://github.com/PaladinFinance/Warden-v2/pull/2/commits/edc9b0280bbb4144d3983642eeab9db17499e9f6), allowing to get the exact amount of reward token the Pledge creator should pay when extending the Pledge or increasing the `rewardPerVote`.

***

## [[M-07]  Fees charged from entire theoretical pledge amount instead of actual pledge amount](https://github.com/code-423n4/2022-10-paladin-findings/issues/235)
*Submitted by [Trust](https://github.com/code-423n4/2022-10-paladin-findings/issues/235), also found by [0x52](https://github.com/code-423n4/2022-10-paladin-findings/issues/142)*

Paladin receives a 5% cut from Boost purchases, as documented on the [website](https://paladin.vote/#/):

"Warden takes a 5% fee on Boost purchases, and 5% on Quest incentives. However, there are various pricing tiers for Quest creators. Contact the Paladin team for more info."

Here's how fee calculation looks at  `createPledge` function:

    vars.totalRewardAmount = (rewardPerVote * vars.votesDifference * vars.duration) / UNIT;
    vars.feeAmount = (vars.totalRewardAmount * protocalFeeRatio) / MAX_PCT ;
    if(vars.totalRewardAmount > maxTotalRewardAmount) revert Errors.IncorrectMaxTotalRewardAmount();
    if(vars.feeAmount > maxFeeAmount) revert Errors.IncorrectMaxFeeAmount();
    // Pull all the rewards in this contract
    IERC20(rewardToken).safeTransferFrom(creator, address(this), vars.totalRewardAmount);
    // And transfer the fees from the Pledge creator to the Chest contract
    IERC20(rewardToken).safeTransferFrom(creator, chestAddress, vars.feeAmount);

The issue is that the fee is taken up front, assuming `totalRewardAmount` will actually be rewarded by the pledge. In practice, the rewards actually utilized can be anywhere from zero to `totalRewardAmount`. Indeed, reward will only be `totalRewardAmount` if, in the entire period from pledge creation to pledge expiry, the desired targetVotes will be fulfilled, which is extremly unlikely.

As a result, if pledge expires with no pledgers, protocol will still take 5%. This behavior is both unfair and against the docs, as it's not "Paladin receives a 5% cut from Boost purchases".

### Impact

Paladin fee collection assumes pledges will be matched immediately and fully, which is not realistic. Therefore far too many fees are collected at user's expense.

### Proof of Concept

1.  Bob creates a pledge, with target = 200, current balance = 100, rewardVotes = 10, remaining time = 1 week.
2.  Protocol collects (200 - 100) &ast; 10 &ast; WEEK_SECONDS &ast; 5% fees
3.  A week passed, rewards were not attractive enough to bring pledgers.
4.  After expiry, Bob calls `retrievePledgeRewards()` and gets 100 &ast; 10 &ast; WEEK_SECONDS back, but 5% of the fees still went to chestAddress.

### Recommended Mitigation Steps

Fee collection should be done after the pledge completes, in one of the close functions or in a newly created pull function for owner to collect fees. Otherwise, it is a completely unfair system.

**[Kogaroshi (Paladin) acknowledged and commented](https://github.com/code-423n4/2022-10-paladin-findings/issues/235#issuecomment-1298449433):**
 > The issue is acknowledged, and we do calculate fee on the basis of all rewards, and not only the one that are gonna be used to reward users.
 >
> The fee ratio is gonna be of 1% to start with (might change before deploy based on market estimations), and the Core team will be able to change the ratio quickly to adapt it to market and Pledge creators needs (with also considering the Paladin DAO revenues). The Paladin team will also considers Pledge creators that are in specific cases and overpay fees (because they already have delegated boost that will last through the whole Pledge and more), and will be able to refund a part of those fees to the creator if the DAO agrees.
>
> And if this system does not fit in the current market, and is a blocker to potential Pledge creators, we will be able to modify the way fees are handled, and deploy a new iteration of Pledge pretty fast to answer the issue.

***

## [[M-08] Pausing `WardenPledge` contract, which takes effect immediately, by its owner can unexpectedly block pledge creator from calling `closePledge` or `retrievePledgeRewards` function](https://github.com/code-423n4/2022-10-paladin-findings/issues/269)
*Submitted by [rbserver](https://github.com/code-423n4/2022-10-paladin-findings/issues/269), also found by [0x1f8b](https://github.com/code-423n4/2022-10-paladin-findings/issues/282), [0xSmartContract](https://github.com/code-423n4/2022-10-paladin-findings/issues/248), [Trust](https://github.com/code-423n4/2022-10-paladin-findings/issues/233), [hansfriese](https://github.com/code-423n4/2022-10-paladin-findings/issues/194), [ctf\_sec](https://github.com/code-423n4/2022-10-paladin-findings/issues/70), [cccz](https://github.com/code-423n4/2022-10-paladin-findings/issues/58), and [codexploder](https://github.com/code-423n4/2022-10-paladin-findings/issues/30)*

<https://github.com/code-423n4/2022-10-paladin/blob/main/contracts/WardenPledge.sol#L636-L638>

<https://github.com/code-423n4/2022-10-paladin/blob/main/contracts/WardenPledge.sol#L488-L515>

<https://github.com/code-423n4/2022-10-paladin/blob/main/contracts/WardenPledge.sol#L456-L480>

### Impact

The owner of the `WardenPledge` contract is able to call the `pause` function to pause this contract. When the `WardenPledge` contract is paused, calling the `closePledge` or `retrievePledgeRewards` function that uses the `whenNotPaused` modifier reverts, and the pledge creator is not able to get back any of the reward token amount, which was deposited by the creator previously. Because calling the `pause` function takes effect immediately, it can be unexpected to the creator for suddenly not being able to call the `closePledge` or `retrievePledgeRewards` function. For instance, when an emergency occurs that requires an increase of cash flow, the creator wants to close the pledge early so she or he can use the remaining deposited reward token amount. However, just before the creator's `closePledge` transaction is executed, the `pause` transaction has been sent by the owner of the `WardenPledge` contract for some reason and executed. Without knowing in advance that the `WardenPledge` contract would be paused, the creator anticipates receiving the remaining deposited reward token amount but this is not the case since calling the `closePledge` function reverts. Because the creator unexpectedly fails to receive such amount and might fail to deal with the emergency, disputes with the protocol can occur, and the user experience becomes degraded.

<https://github.com/code-423n4/2022-10-paladin/blob/main/contracts/WardenPledge.sol#L636-L638>

```solidity
    function pause() external onlyOwner {
        _pause();
    }
```

<https://github.com/code-423n4/2022-10-paladin/blob/main/contracts/WardenPledge.sol#L488-L515>

```solidity
    function closePledge(uint256 pledgeId, address receiver) external whenNotPaused nonReentrant {
        ...

        // Get the current remaining amount of rewards not distributed for the Pledge
        uint256 remainingAmount = pledgeAvailableRewardAmounts[pledgeId];

        if(remainingAmount > 0) {
            // Transfer the non used rewards and reset storage
            pledgeAvailableRewardAmounts[pledgeId] = 0;

            IERC20(pledgeParams.rewardToken).safeTransfer(receiver, remainingAmount);

            ...

        }

        ...
    }
```

<https://github.com/code-423n4/2022-10-paladin/blob/main/contracts/WardenPledge.sol#L456-L480>

```solidity
    function retrievePledgeRewards(uint256 pledgeId, address receiver) external whenNotPaused nonReentrant {
        ...

        // Get the current remaining amount of rewards not distributed for the Pledge
        uint256 remainingAmount = pledgeAvailableRewardAmounts[pledgeId];

        ...

        if(remainingAmount > 0) {
            // Transfer the non used rewards and reset storage
            pledgeAvailableRewardAmounts[pledgeId] = 0;

            IERC20(pledgeParams.rewardToken).safeTransfer(receiver, remainingAmount);

            ...

        }
    }
```

### Proof of Concept

Please append the following test in the `pause & unpause` `describe` block in `test\wardenPledge.test.ts`. This test will pass to demonstrate the described scenario.

```typescript
        it.only('Pausing WardenPledge contract, which takes effect immediately, by its owner can unexpectedly block pledge creator from calling closePledge function', async () => {
            // before calling the createPledge function, the wardenPledge contract owns no rewardToken1
            const rewardToken1BalanceWardenPledgeBefore = await rewardToken1.balanceOf(wardenPledge.address)
            expect(rewardToken1BalanceWardenPledgeBefore).to.be.eq(0)

            const rewardToken1BalanceCreatorBefore = await rewardToken1.balanceOf(creator.address)

            // creator calls the createPledge function
            await wardenPledge.connect(creator).createPledge(
                receiver.address,
                rewardToken1.address,
                target_votes,
                reward_per_vote,
                end_timestamp,
                max_total_reward_amount,
                max_fee_amount
            )

            // after one week, admin, who is the owner of the wardenPledge contract, calls the pause function, which takes effect immediately
            await advanceTime(WEEK.toNumber())
            await wardenPledge.connect(admin).pause()

            // Since an emergency that requires an increase of cash flow occurs, creator decides to close the pledge for getting back the deposited rewardToken1 amount.
            // Without knowing in advance that the wardenPledge contract would be paused,
            //   creator calls the closePledge function and anticipates to receive the deposited rewardToken1 amount.
            // Unfortunately, admin's pause transaction has been executed just before creator's closePledge transaction is executed, which causes creator's closePledge transaction to revert.
            await expect(
                wardenPledge.connect(creator).closePledge(pledge_id, creator.address)
            ).to.be.revertedWith("Pausable: paused")

            // after creator's closePledge transaction reverts, creator does not receive the deposited rewardToken1 amount, which is unexpected to her or him
            const rewardToken1BalanceCreatorAfter = await rewardToken1.balanceOf(creator.address)
            expect(rewardToken1BalanceCreatorAfter).to.be.lt(rewardToken1BalanceCreatorBefore)

            // meanwhile, the wardenPledge contract still holds the creator's deposited rewardToken1 amount
            const rewardToken1BalanceWardenPledgeAfter = await rewardToken1.balanceOf(wardenPledge.address)
            expect(rewardToken1BalanceWardenPledgeAfter).to.be.gt(0)
        });
```

### Tools Used

VSCode

### Recommended Mitigation Steps

The `pause` function can be updated to be time-delayed so the pledge creator can have more time to react. One way would be making this function only callable by a timelock governance contract.

**[Kogaroshi (Paladin) confirmed](https://github.com/code-423n4/2022-10-paladin-findings/issues/70)**

***

# Low Risk and Non-Critical Issues

For this contest, 67 reports were submitted by wardens detailing low risk and non-critical issues. The [report highlighted below](https://github.com/code-423n4/2022-10-paladin-findings/issues/212) by **robee** received the top score from the judge.

*The following wardens also submitted reports: [ajtra](https://github.com/code-423n4/2022-10-paladin-findings/issues/277), 
[rbserver](https://github.com/code-423n4/2022-10-paladin-findings/issues/272), 
[adriro](https://github.com/code-423n4/2022-10-paladin-findings/issues/267), 
[peritoflores](https://github.com/code-423n4/2022-10-paladin-findings/issues/266), 
[Josiah](https://github.com/code-423n4/2022-10-paladin-findings/issues/264), 
[tnevler](https://github.com/code-423n4/2022-10-paladin-findings/issues/262), 
[horsefacts](https://github.com/code-423n4/2022-10-paladin-findings/issues/251), 
[brgltd](https://github.com/code-423n4/2022-10-paladin-findings/issues/250), 
[djxploit](https://github.com/code-423n4/2022-10-paladin-findings/issues/246), 
[minhtrng](https://github.com/code-423n4/2022-10-paladin-findings/issues/244), 
[Dravee](https://github.com/code-423n4/2022-10-paladin-findings/issues/240), 
[B2](https://github.com/code-423n4/2022-10-paladin-findings/issues/239), 
[Trust](https://github.com/code-423n4/2022-10-paladin-findings/issues/237), 
[lukris02](https://github.com/code-423n4/2022-10-paladin-findings/issues/231), 
[delfin454000](https://github.com/code-423n4/2022-10-paladin-findings/issues/230), 
[c3phas](https://github.com/code-423n4/2022-10-paladin-findings/issues/224), 
[RaoulSchaffranek](https://github.com/code-423n4/2022-10-paladin-findings/issues/220), 
[Waze](https://github.com/code-423n4/2022-10-paladin-findings/issues/211), 
[Tricko](https://github.com/code-423n4/2022-10-paladin-findings/issues/209), 
[JTJabba](https://github.com/code-423n4/2022-10-paladin-findings/issues/204), 
[a12jmx](https://github.com/code-423n4/2022-10-paladin-findings/issues/192), 
[Sm4rty](https://github.com/code-423n4/2022-10-paladin-findings/issues/190), 
[0xSmartContract](https://github.com/code-423n4/2022-10-paladin-findings/issues/187), 
[imare](https://github.com/code-423n4/2022-10-paladin-findings/issues/178), 
[0xNazgul](https://github.com/code-423n4/2022-10-paladin-findings/issues/173), 
[Jeiwan](https://github.com/code-423n4/2022-10-paladin-findings/issues/168), 
[0x52](https://github.com/code-423n4/2022-10-paladin-findings/issues/156), 
[Diana](https://github.com/code-423n4/2022-10-paladin-findings/issues/151), 
[shark](https://github.com/code-423n4/2022-10-paladin-findings/issues/140), 
[\_\_141345\_\_](https://github.com/code-423n4/2022-10-paladin-findings/issues/138), 
[carlitox477](https://github.com/code-423n4/2022-10-paladin-findings/issues/136), 
[ktg](https://github.com/code-423n4/2022-10-paladin-findings/issues/134), 
[Awesome](https://github.com/code-423n4/2022-10-paladin-findings/issues/132), 
[Picodes](https://github.com/code-423n4/2022-10-paladin-findings/issues/129), 
[corerouter](https://github.com/code-423n4/2022-10-paladin-findings/issues/125), 
[0x007](https://github.com/code-423n4/2022-10-paladin-findings/issues/123), 
[RedOneN](https://github.com/code-423n4/2022-10-paladin-findings/issues/122), 
[cryptonue](https://github.com/code-423n4/2022-10-paladin-findings/issues/115), 
[jayphbee](https://github.com/code-423n4/2022-10-paladin-findings/issues/111), 
[0xDjango](https://github.com/code-423n4/2022-10-paladin-findings/issues/110), 
[Ruhum](https://github.com/code-423n4/2022-10-paladin-findings/issues/108), 
[pashov](https://github.com/code-423n4/2022-10-paladin-findings/issues/107), 
[cylzxje](https://github.com/code-423n4/2022-10-paladin-findings/issues/99), 
[Chom](https://github.com/code-423n4/2022-10-paladin-findings/issues/95), 
[ReyAdmirado](https://github.com/code-423n4/2022-10-paladin-findings/issues/88), 
[Rolezn](https://github.com/code-423n4/2022-10-paladin-findings/issues/85), 
[Lambda](https://github.com/code-423n4/2022-10-paladin-findings/issues/82), 
[ctf\_sec](https://github.com/code-423n4/2022-10-paladin-findings/issues/78), 
[ladboy233](https://github.com/code-423n4/2022-10-paladin-findings/issues/74), 
[8olidity](https://github.com/code-423n4/2022-10-paladin-findings/issues/72), 
[ch0bu](https://github.com/code-423n4/2022-10-paladin-findings/issues/71), 
[jwood](https://github.com/code-423n4/2022-10-paladin-findings/issues/62), 
[cccz](https://github.com/code-423n4/2022-10-paladin-findings/issues/57), 
[oyc\_109](https://github.com/code-423n4/2022-10-paladin-findings/issues/56), 
[yixxas](https://github.com/code-423n4/2022-10-paladin-findings/issues/43), 
[dic0de](https://github.com/code-423n4/2022-10-paladin-findings/issues/42), 
[chaduke](https://github.com/code-423n4/2022-10-paladin-findings/issues/35), 
[csanuragjain](https://github.com/code-423n4/2022-10-paladin-findings/issues/27), 
[chrisdior4](https://github.com/code-423n4/2022-10-paladin-findings/issues/26), 
[neko\_nyaa](https://github.com/code-423n4/2022-10-paladin-findings/issues/23), 
[Bnke0x0](https://github.com/code-423n4/2022-10-paladin-findings/issues/22), 
[0x1f8b](https://github.com/code-423n4/2022-10-paladin-findings/issues/20), 
[rvierdiiev](https://github.com/code-423n4/2022-10-paladin-findings/issues/18), 
[leosathya](https://github.com/code-423n4/2022-10-paladin-findings/issues/7), 
[RaymondFam](https://github.com/code-423n4/2022-10-paladin-findings/issues/3), and 
[Mathieu](https://github.com/code-423n4/2022-10-paladin-findings/issues/2).*

## [1] Missing fee parameter validation

Some fee parameters of functions are not checked for invalid values. Validate the parameters:

### Code instances:

        WardenPledge.increasePledgeRewardPerVote (maxFeeAmount)
        WardenPledge.extendPledge (maxFeeAmount)
        WardenPledge.createPledge (maxFeeAmount)
        WardenPledge.updatePlatformFee (newFee)

## [2] safeApprove of openZeppelin is deprecated

You use safeApprove of openZeppelin although it's deprecated.
(see [here](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/566a774222707e424896c0c390a84dc3c13bdcb2/contracts/token/ERC20/utils/SafeERC20.sol#L38>)).

You should change it to increase/decrease Allowance as OpenZeppilin says.

### Code instances:

        Deprecated safeApprove in SafeERC20.sol line 64: _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
        Deprecated safeApprove in SafeERC20.sol line 76: _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
        Deprecated safeApprove in SafeERC20.sol line 55: _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));

## [3] Not verified input

External / public functions parameters should be validated to make sure the address is not 0.

Otherwise if not given the right input it can mistakenly lead to loss of user funds.

### Code instance:

        WardenPledge.sol.recoverERC20 token

## [4] Solidity compiler versions mismatch

The project is compiled with different versions of Solidity, which is not recommended because it can lead to undefined behaviors.

## [5] Not verified owner

```
    owner param should be validated to make sure the owner address is not address(0).
    Otherwise if not given the right input all only owner accessible functions will be unaccessible.
    
    
```

### Code instance:

        Ownable.sol.transferOwnership newOwner

## [6] Two Steps Verification before Transferring Ownership

The following contracts have a function that allows them an admin to change it to a different address. If the admin accidentally uses an invalid address for which they do not have the private key, then the system gets locked.

It is important to have two steps admin change where the first is announcing a pending new admin and the new address should then claim its ownership.

A similar issue was reported in a previous contest and was assigned a severity of Medium: [code-423n4/2021-06-realitycards-findings#105](https://github.com/code-423n4/2021-06-realitycards-findings/issues/105)

### Code instance:

        Ownable.sol

## [7] Missing non reentrancy modifier

The following functions are missing reentrancy modifier although some other pulbic/external functions does use reentrancy modifer.
Even though I did not find a way to exploit it, it seems like those functions should have the nonReentrant modifier as the other functions have it as well..

### Code instance:

        WardenPledge.sol, recoverERC20 is missing a reentrancy modifier

## [8] In the following public update functions no value is returned

In the following functions no value is returned, due to which by default value of return will be 0.

We assumed that after the update you return the latest new value.
(similar issue here: <https://github.com/code-423n4/2021-10-badgerdao-findings/issues/85>).

### Code instances:

        WardenPledge.sol, updateChest
        WardenPledge.sol, updateMinTargetVotes
        WardenPledge.sol, updatePlatformFee
        WardenPledge.sol, updateRewardToken

## [9] Check transfer receiver is not 0 to avoid burned money

Transferring tokens to the zero address is usually prohibited to accidentally avoid "burning" tokens by sending them to an unrecoverable zero address.

### Code instances:

        https://github.com/code-423n4/2022-10-paladin/tree/main/contracts/WardenPledge.sol#L658
        https://github.com/code-423n4/2022-10-paladin/tree/main/contracts/WardenPledge.sol#L472
        https://github.com/code-423n4/2022-10-paladin/tree/main/contracts/WardenPledge.sol#L271
        https://github.com/code-423n4/2022-10-paladin/tree/main/contracts/WardenPledge.sol#L438
        https://github.com/code-423n4/2022-10-paladin/tree/main/contracts/WardenPledge.sol#L333
        https://github.com/code-423n4/2022-10-paladin/tree/main/contracts/WardenPledge.sol#L394
        https://github.com/code-423n4/2022-10-paladin/tree/main/contracts/WardenPledge.sol#L505

## [10] Missing commenting

```
    The following functions are missing commenting as describe below:
    
```

### Code instance:

        Pausable.sol, paused (public), @return is missing

## [11] Unsafe Cast

Use openzeppilin's safeCast in:

### Code instance:

        https://github.com/code-423n4/2022-10-paladin/tree/main/contracts/WardenPledge.sol#L665 : unsafe cast uint64(n)

## [12] Div by 0

Division by 0 can lead to accidentally revert,
(An example of a similar issue - <https://github.com/code-423n4/2021-10-defiprotocol-findings/issues/84>)

### Code instance:

        https://github.com/code-423n4/2022-10-paladin/tree/main/contracts/WardenPledge.sol#L256 boostDuration might be 0

## [13] Tokens with fee on transfer are not supported

There are ERC20 tokens that charge fee for every transfer() / transferFrom().

Vault.sol#addValue() assumes that the received amount is the same as the transfer amount, and uses it to calculate attributions, balance amounts, etc.

But, the actual transferred amount can be lower for those tokens.
Therefore it's recommended to use the balance change before and after the transfer instead of the amount.

This way you also support the tokens with transfer fee - that are popular.

### Code instances:

        https://github.com/code-423n4/2022-10-paladin/tree/main/contracts/WardenPledge.sol#L438
        https://github.com/code-423n4/2022-10-paladin/tree/main/contracts/WardenPledge.sol#L333
        https://github.com/code-423n4/2022-10-paladin/tree/main/contracts/WardenPledge.sol#L394

***

# Gas Optimizations

For this contest, 48 reports were submitted by wardens detailing gas optimizations. The [report highlighted below](https://github.com/code-423n4/2022-10-paladin-findings/issues/223) by **c3phas** received the top score from the judge.

*The following wardens also submitted reports: [sakman](https://github.com/code-423n4/2022-10-paladin-findings/issues/278), 
[tnevler](https://github.com/code-423n4/2022-10-paladin-findings/issues/275), 
[ajtra](https://github.com/code-423n4/2022-10-paladin-findings/issues/273), 
[adriro](https://github.com/code-423n4/2022-10-paladin-findings/issues/268), 
[lukris02](https://github.com/code-423n4/2022-10-paladin-findings/issues/263), 
[horsefacts](https://github.com/code-423n4/2022-10-paladin-findings/issues/254), 
[B2](https://github.com/code-423n4/2022-10-paladin-findings/issues/245), 
[peiw](https://github.com/code-423n4/2022-10-paladin-findings/issues/243), 
[djxploit](https://github.com/code-423n4/2022-10-paladin-findings/issues/241), 
[KoKo](https://github.com/code-423n4/2022-10-paladin-findings/issues/228), 
[Dravee](https://github.com/code-423n4/2022-10-paladin-findings/issues/225), 
[indijanc](https://github.com/code-423n4/2022-10-paladin-findings/issues/221), 
[gogo](https://github.com/code-423n4/2022-10-paladin-findings/issues/215), 
[RockingMiles](https://github.com/code-423n4/2022-10-paladin-findings/issues/213), 
[Waze](https://github.com/code-423n4/2022-10-paladin-findings/issues/210), 
[0xSmartContract](https://github.com/code-423n4/2022-10-paladin-findings/issues/208), 
[SooYa](https://github.com/code-423n4/2022-10-paladin-findings/issues/202), 
[0xRoxas](https://github.com/code-423n4/2022-10-paladin-findings/issues/198), 
[Amithuddar](https://github.com/code-423n4/2022-10-paladin-findings/issues/185), 
[imare](https://github.com/code-423n4/2022-10-paladin-findings/issues/177), 
[SadBase](https://github.com/code-423n4/2022-10-paladin-findings/issues/174), 
[0xNazgul](https://github.com/code-423n4/2022-10-paladin-findings/issues/172), 
[neko\_nyaa](https://github.com/code-423n4/2022-10-paladin-findings/issues/155), 
[halden](https://github.com/code-423n4/2022-10-paladin-findings/issues/152), 
[shark](https://github.com/code-423n4/2022-10-paladin-findings/issues/146), 
[\_\_141345\_\_](https://github.com/code-423n4/2022-10-paladin-findings/issues/137), 
[carlitox477](https://github.com/code-423n4/2022-10-paladin-findings/issues/135), 
[Picodes](https://github.com/code-423n4/2022-10-paladin-findings/issues/128), 
[karanctf](https://github.com/code-423n4/2022-10-paladin-findings/issues/127), 
[emrekocak](https://github.com/code-423n4/2022-10-paladin-findings/issues/124), 
[RedOneN](https://github.com/code-423n4/2022-10-paladin-findings/issues/121), 
[erictee](https://github.com/code-423n4/2022-10-paladin-findings/issues/119), 
[0xbepresent](https://github.com/code-423n4/2022-10-paladin-findings/issues/104), 
[cylzxje](https://github.com/code-423n4/2022-10-paladin-findings/issues/98), 
[ReyAdmirado](https://github.com/code-423n4/2022-10-paladin-findings/issues/87), 
[Ruhum](https://github.com/code-423n4/2022-10-paladin-findings/issues/69), 
[Mathieu](https://github.com/code-423n4/2022-10-paladin-findings/issues/67), 
[ch0bu](https://github.com/code-423n4/2022-10-paladin-findings/issues/66), 
[durianSausage](https://github.com/code-423n4/2022-10-paladin-findings/issues/63), 
[oyc\_109](https://github.com/code-423n4/2022-10-paladin-findings/issues/55), 
[Awesome](https://github.com/code-423n4/2022-10-paladin-findings/issues/53), 
[skyle](https://github.com/code-423n4/2022-10-paladin-findings/issues/51), 
[Bnke0x0](https://github.com/code-423n4/2022-10-paladin-findings/issues/21), 
[0x1f8b](https://github.com/code-423n4/2022-10-paladin-findings/issues/19), 
[ballx](https://github.com/code-423n4/2022-10-paladin-findings/issues/13), 
[leosathya](https://github.com/code-423n4/2022-10-paladin-findings/issues/6), and
[RaymondFam](https://github.com/code-423n4/2022-10-paladin-findings/issues/5).*

## Findings

NB: Some functions have been truncated where neccessary to just show affected parts of the code.

Throughout the report, some places might be denoted with audit tags to show the actual place affected.

## [G-01] Using immutable on variables that are only set in the constructor and never after

Use immutable if you want to assign a permanent value at construction. Use constants if you already know the permanent value. Both get directly embedded in bytecode, saving SLOAD.
Variables only set in the constructor and never edited afterwards should be marked as immutable, as it would avoid the expensive storage-writing operation in the constructor (around 20 000 gas per variable) and replace the expensive storage-reading operations (around 2100 gas per reading) to a less expensive value reading (3 gas)

<https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L60>

```solidity
File: /contracts/WardenPledge.sol
60:    IVotingEscrow public votingEscrow;
```

<https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L62>

```solidity
File: /contracts/WardenPledge.sol
62:    IBoostV2 public delegationBoost;
```

## [G-02] Use constants for variables whose value is known beforehand and is never changed

<https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L79>

```solidity
File: /contracts/WardenPledge.sol
79:    uint256 public minDelegationTime = 1 weeks;
```

```diff
diff --git a/contracts/WardenPledge.sol b/contracts/WardenPledge.sol
index beb990d..642a848 100644
--- a/contracts/WardenPledge.sol
+++ b/contracts/WardenPledge.sol
@@ -76,7 +76,7 @@ contract WardenPledge is Ownable, Pausable, ReentrancyGuard {
     uint256 public minTargetVotes;

     /** @notice Minimum delegation time, taken from veBoost contract */
-    uint256 public minDelegationTime = 1 weeks;
+    uint256 public constant minDelegationTime = 1 weeks;

```

## [G-03] Cache storage values in memory to minimize SLOADs

The code can be optimized by minimizing the number of SLOADs.

SLOADs are expensive (100 gas after the 1st one) compared to MLOADs/MSTOREs (3 gas each). Storage values read multiple times should instead be cached in memory the first time (costing 1 SLOAD) and then read from this cache to avoid multiple SLOADs.

NB: *Some functions have been truncated where neccessary to just show affected parts of the code*

<https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L222-L274>

#### WardenPledge.sol.\_pledge(): delegationBoost should be cached(Saves  4 SLOADs \~394 gas)

```solidity
File: /contracts/WardenPledge.sol
222:    function _pledge(uint256 pledgeId, address user, uint256 amount, uint256 endTimestamp) internal {

240:        delegationBoost.checkpoint_user(user); //@audit: 1st SLOAD
241:        if(delegationBoost.allowance(user, address(this)) < amount) revert Errors.InsufficientAllowance(); //@audit: 2nd SLOAD
242:        if(delegationBoost.delegable_balance(user) < amount) revert Errors.CannotDelegate(); //@audit: 3rd SLOAD

245:        if(delegationBoost.adjusted_balance_of(pledgeParams.receiver) + amount > pledgeParams.targetVotes) revert Errors.TargetVotesOverflow(); //@audit: 4th SLOAD

248:        delegationBoost.boost( //@audit: 5th SLOAD
            pledgeParams.receiver,
            amount,
            endTimestamp,
            user
        );

```

```diff
diff --git a/contracts/WardenPledge.sol b/contracts/WardenPledge.sol
index beb990d..5b3d1bd 100644
--- a/contracts/WardenPledge.sol
+++ b/contracts/WardenPledge.sol
@@ -237,15 +237,16 @@ contract WardenPledge is Ownable, Pausable, ReentrancyGuard {
         uint256 boostDuration = endTimestamp - block.timestamp;

         // Check that the user has enough boost delegation available & set the correct allowance to this contract
-        delegationBoost.checkpoint_user(user);
-        if(delegationBoost.allowance(user, address(this)) < amount) revert Errors.InsufficientAllowance();
-        if(delegationBoost.delegable_balance(user) < amount) revert Errors.CannotDelegate();
+         IBoostV2 _delegationBoost = delegationBoost;
+        _delegationBoost.checkpoint_user(user);
+        if(_delegationBoost.allowance(user, address(this)) < amount) revert Errors.InsufficientAllowance();
+        if(_delegationBoost.delegable_balance(user) < amount) revert Errors.CannotDelegate();

         // Check that this will not go over the Pledge target of votes
-        if(delegationBoost.adjusted_balance_of(pledgeParams.receiver) + amount > pledgeParams.targetVotes) revert Errors.TargetVotesOverflow();
+        if(_delegationBoost.adjusted_balance_of(pledgeParams.receiver) + amount > pledgeParams.targetVotes) revert Errors.TargetVotesOverflow();

         // Creates the DelegationBoost
-        delegationBoost.boost(
+        _delegationBoost.boost(
             pledgeParams.receiver,
             amount,
             endTimestamp,
```

<https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L222-L274>

#### WardenPledge.sol.\_pledge(): pledgeAvailableRewardAmounts\[pledgeId] should be cached(saves 1 SLOAD \~97 gas)

```solidity
File: /contracts/WardenPledge.sol
    function _pledge(uint256 pledgeId, address user, uint256 amount, uint256 endTimestamp) internal {


267:        if(rewardAmount > pledgeAvailableRewardAmounts[pledgeId]) revert Errors.RewardsBalanceTooLow(); //@audit: 1st access
268:        pledgeAvailableRewardAmounts[pledgeId] -= rewardAmount; //@audit: 2nd access
```

```diff
diff --git a/contracts/WardenPledge.sol b/contracts/WardenPledge.sol
index beb990d..2bb2cd2 100644
--- a/contracts/WardenPledge.sol
+++ b/contracts/WardenPledge.sol
@@ -263,9 +263,10 @@ contract WardenPledge is Ownable, Pausable, ReentrancyGuard {
         uint256 totalDelegatedAmount = ((bias * boostDuration) + bias) / 2;
         // Then we can calculate the total amount of rewards for this Boost
         uint256 rewardAmount = (totalDelegatedAmount * pledgeParams.rewardPerVote) / UNIT;
+        uint _pledgeAvailableRewardAmounts = pledgeAvailableRewardAmounts[pledgeId];

-        if(rewardAmount > pledgeAvailableRewardAmounts[pledgeId]) revert Errors.RewardsBalanceTooLow();
-        pledgeAvailableRewardAmounts[pledgeId] -= rewardAmount;
+        if(rewardAmount > _pledgeAvailableRewardAmounts) revert Errors.RewardsBalanceTooLow();
+        pledgeAvailableRewardAmounts[pledgeId] = _pledgeAvailableRewardAmounts - rewardAmount;

         // Send the rewards to the user
         IERC20(pledgeParams.rewardToken).safeTransfer(user, rewardAmount);
```

<https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L299-L358>

#### WardenPledge.sol.createPledge(): minAmountRewardToken\[rewardToken] should be cached(saves 1 SLOAD \~97 gas) - happy path

```solidity
File: /contracts/WardenPledge.sol
299:    function createPledge(

312:        if(minAmountRewardToken[rewardToken] == 0) revert Errors.TokenNotWhitelisted(); //@audit: 1st access
313:        if(rewardPerVote < minAmountRewardToken[rewardToken]) revert Errors.RewardPerVoteTooLow(); //@audit: 2nd access
```

```diff
diff --git a/contracts/WardenPledge.sol b/contracts/WardenPledge.sol
index beb990d..247e5f8 100644
--- a/contracts/WardenPledge.sol
+++ b/contracts/WardenPledge.sol
@@ -309,8 +309,9 @@ contract WardenPledge is Ownable, Pausable, ReentrancyGuard {

         if(receiver == address(0) || rewardToken == address(0)) revert Errors.ZeroAddress();
         if(targetVotes < minTargetVotes) revert Errors.TargetVoteUnderMin();
-        if(minAmountRewardToken[rewardToken] == 0) revert Errors.TokenNotWhitelisted();
-        if(rewardPerVote < minAmountRewardToken[rewardToken]) revert Errors.RewardPerVoteTooLow();
+        uint256 _minAmountRewardToken = minAmountRewardToken[rewardToken]
+        if(_minAmountRewardToken == 0) revert Errors.TokenNotWhitelisted();
+        if(rewardPerVote < _minAmountRewardToken) revert Errors.RewardPerVoteTooLow();

         if(endTimestamp == 0) revert Errors.NullEndTimestamp();
         if(endTimestamp != _getRoundedTimestamp(endTimestamp)) revert Errors.InvalidEndTimestamp();
```

## [G-04] `require()` or `revert()` statements that check input arguments should be at the top of the function

Checks that involve constants should come before checks that involve state variables, function calls, and calculations. By doing these checks first, the function is able to revert before wasting a Gcoldsload (2100 gas) in a function that may ultimately revert in the unhappy case.

<https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L222-L274>

```solidity
File: /contracts/WardenPledge.sol
222:    function _pledge(uint256 pledgeId, address user, uint256 amount, uint256 endTimestamp) internal {
223:        if(pledgeId >= pledgesIndex()) revert Errors.InvalidPledgeID();
224:        if(amount == 0) revert Errors.NullValue();
```

```diff
diff --git a/contracts/WardenPledge.sol b/contracts/WardenPledge.sol
index beb990d..dfd3ff4 100644
--- a/contracts/WardenPledge.sol
+++ b/contracts/WardenPledge.sol
@@ -220,8 +220,9 @@ contract WardenPledge is Ownable, Pausable, ReentrancyGuard {
     * @param endTimestamp End of delegation
     */
     function _pledge(uint256 pledgeId, address user, uint256 amount, uint256 endTimestamp) internal {
-        if(pledgeId >= pledgesIndex()) revert Errors.InvalidPledgeID();
         if(amount == 0) revert Errors.NullValue();
+        if(pledgeId >= pledgesIndex()) revert Errors.InvalidPledgeID();

         // Load Pledge parameters & check the Pledge is still active
         Pledge memory pledgeParams = pledges[pledgeId];
```

<https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L456-L480>

```solidity
File: /contracts/WardenPledge.sol
456:    function retrievePledgeRewards(uint256 pledgeId, address receiver) external whenNotPaused nonReentrant {
457:        if(pledgeId >= pledgesIndex()) revert Errors.InvalidPledgeID();
458:        address creator = pledgeOwner[pledgeId];
459:        if(msg.sender != creator) revert Errors.NotPledgeCreator();
460:        if(receiver == address(0)) revert Errors.ZeroAddress();
```

```diff
diff --git a/contracts/WardenPledge.sol b/contracts/WardenPledge.sol
index beb990d..9c82ad9 100644
--- a/contracts/WardenPledge.sol
+++ b/contracts/WardenPledge.sol
@@ -454,10 +454,11 @@ contract WardenPledge is Ownable, Pausable, ReentrancyGuard {
     * @param receiver Address to receive the remaining rewards
     */
     function retrievePledgeRewards(uint256 pledgeId, address receiver) external whenNotPaused nonReentrant {
+        if(receiver == address(0)) revert Errors.ZeroAddress();
         if(pledgeId >= pledgesIndex()) revert Errors.InvalidPledgeID();
         address creator = pledgeOwner[pledgeId];
         if(msg.sender != creator) revert Errors.NotPledgeCreator();
-        if(receiver == address(0)) revert Errors.ZeroAddress();
+

         Pledge storage pledgeParams = pledges[pledgeId];
         if(pledgeParams.endTimestamp > block.timestamp) revert Errors.PledgeNotExpired();
```

<https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L488-L515>

```solidity
File: /contracts/WardenPledge.sol
488:    function closePledge(uint256 pledgeId, address receiver) external whenNotPaused nonReentrant {
489:        if(pledgeId >= pledgesIndex()) revert Errors.InvalidPledgeID();
490:        address creator = pledgeOwner[pledgeId];
491:        if(msg.sender != creator) revert Errors.NotPledgeCreator();
492:        if(receiver == address(0)) revert Errors.ZeroAddress();
```

```diff
diff --git a/contracts/WardenPledge.sol b/contracts/WardenPledge.sol
index beb990d..c06f2ee 100644
--- a/contracts/WardenPledge.sol
+++ b/contracts/WardenPledge.sol
@@ -486,10 +486,11 @@ contract WardenPledge is Ownable, Pausable, ReentrancyGuard {
     * @param receiver Address to receive the remaining rewards
     */
     function closePledge(uint256 pledgeId, address receiver) external whenNotPaused nonReentrant {
+        if(receiver == address(0)) revert Errors.ZeroAddress();
         if(pledgeId >= pledgesIndex()) revert Errors.InvalidPledgeID();
         address creator = pledgeOwner[pledgeId];
         if(msg.sender != creator) revert Errors.NotPledgeCreator();
-        if(receiver == address(0)) revert Errors.ZeroAddress();
```

<https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L525-L533>

```solidity
File: /contracts/WardenPledge.sol
525:    function _addRewardToken(address token, uint256 minRewardPerSecond) internal {
526:        if(minAmountRewardToken[token] != 0) revert Errors.AlreadyAllowedToken();
527:        if(token == address(0)) revert Errors.ZeroAddress();
528:        if(minRewardPerSecond == 0) revert Errors.NullValue();
```

```diff
diff --git a/contracts/WardenPledge.sol b/contracts/WardenPledge.sol
index beb990d..71d0087 100644
--- a/contracts/WardenPledge.sol
+++ b/contracts/WardenPledge.sol
@@ -523,10 +523,10 @@ contract WardenPledge is Ownable, Pausable, ReentrancyGuard {
     * @param minRewardPerSecond Minmum amount of reward per vote per second for the token
     */
     function _addRewardToken(address token, uint256 minRewardPerSecond) internal {
-        if(minAmountRewardToken[token] != 0) revert Errors.AlreadyAllowedToken();
         if(token == address(0)) revert Errors.ZeroAddress();
         if(minRewardPerSecond == 0) revert Errors.NullValue();

+        if(minAmountRewardToken[token] != 0) revert Errors.AlreadyAllowedToken();
+
         minAmountRewardToken[token] = minRewardPerSecond;

         emit NewRewardToken(token, minRewardPerSecond);
```

## [G-05] Using storage instead of memory for structs/arrays saves gas

When fetching data from a storage location, assigning the data to a memory variable causes all fields of the struct/array to be read from storage, which incurs a Gcoldsload (2100 gas) for each field of the struct/array. If the fields are read from the new memory variable, they incur an additional MLOAD rather than a cheap stack read. Instead of declearing the variable with the memory keyword, declaring the variable with the storage keyword and caching any fields that need to be re-read in stack variables, will be much cheaper, only incuring the Gcoldsload for the fields actually read. The only time it makes sense to read the whole struct/array into a memory variable, is if the full struct/array is being returned by the function, is being passed to a function that requires memory, or if the array/struct is being read from another memory array/struct

<https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L227>

```solidity
File: /contracts/WardenPledge.sol
227:        Pledge memory pledgeParams = pledges[pledgeId];
```

## [G-06] Using unchecked blocks to save gas

Solidity version 0.8+ comes with implicit overflow and underflow checks on unsigned integers. When an overflow or an underflow isn’t possible (as an example, when a comparison is made before the arithmetic operation), some gas can be saved by using an unchecked block
[see resource](https://github.com/ethereum/solidity/issues/10695)

<https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L268>

```solidity
File: /contracts/WardenPledge.sol
268:        pledgeAvailableRewardAmounts[pledgeId] -= rewardAmount;
```

The operation `pledgeAvailableRewardAmounts[pledgeId] -= rewardAmount;` cannot underflow due to the check on [Line 267](https://github.com/code-423n4/2022-10-paladin/blob/d6d0c0e57ad80f15e9691086c9c7270d4ccfe0e6/contracts/WardenPledge.sol#L267) that ensures that `pledgeAvailableRewardAmounts[pledgeId]` is greater than `rewardAmount` before perfoming the arithmetic operation.

***

# Disclosures

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.
