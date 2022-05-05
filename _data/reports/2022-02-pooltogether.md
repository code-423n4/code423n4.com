---
sponsor: "PoolTogether"
slug: "2022-02-pooltogether"
date: "2022-04-19"
title: "PoolTogether TWAB Delegator contest"
findings: "https://github.com/code-423n4/2022-02-pooltogether-findings/issues"
contest: 93
---

# Overview

## About C4

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the PoolTogether TWAB Delegator smart contract system written in Solidity. The audit contest took place between February 22—February 24 2022.

## Wardens

29 Wardens contributed reports to the PoolTogether TWAB Delegator contest:

  1. [Omik](https://twitter.com/omikomikomik)
  1. [cmichel](https://twitter.com/cmichelio)
  1. [kirk-baird](https://twitter.com/kirkthebaird)
  1. WatchPug ([jtp](https://github.com/jack-the-pug) and [ming](https://github.com/mingwatch))
  1. CertoraInc ([danb](https://twitter.com/danbinnun), egjlmn1, [OriDabush](https://twitter.com/ori_dabush), ItayG, and shakedwinder)
  1. [hickuphh3](https://twitter.com/HickupH)
  1. [Dravee](https://twitter.com/JustDravee)
  1. [gzeon](https://twitter.com/gzeon)
  1. [Rhynorater](https://twitter.com/rhynorater)
  1. robee
  1. chunter
  1. nascent ([brock](https://twitter.com/brockjelmore), [0xAndreas](https://twitter.com/andreasbigger), and [chris_nascent](https://twitter.com/Chris_8086))
  1. jayjonah8
  1. IllIllI
  1. [Tomio](https://twitter.com/meidhiwirara)
  1. sorrynotsorry
  1. kenta
  1. [rfa](https://www.instagram.com/riyan_rfa/)
  1. [z3s](https://github.com/z3s/)
  1. 0x1f8b
  1. [ye0lde](https://twitter.com/_ye0lde)
  1. pedroais

This contest was judged by [0xleastwood](https://twitter.com/liam_eastwood13).

Final report assembled by [liveactionllama](https://twitter.com/liveactionllama).

# Summary

The C4 analysis yielded 1 unique MEDIUM severity vulnerability. Additionally, the analysis included 9 reports detailing issues with a risk rating of LOW severity or non-critical as well as 17 reports recommending gas optimizations. All of the issues presented here are linked back to their original finding.

Notably, 0 vulnerabilities were found during this audit contest that received a risk rating in the category of HIGH severity.

# Scope

The code under review can be found within the [C4 PoolTogether TWAB Delegator contest repository](https://github.com/code-423n4/2022-02-pooltogether), and is composed of 4 smart contracts written in the Solidity programming language and includes 420 lines of Solidity code.

# Severity Criteria

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low/non-critical.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

- Malicious Input Handling
- Escalation of privileges
- Arithmetic
- Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code423n4.com).

# Medium Risk Findings (1)
## [[M-01] `permitAndMulticall()` May Be Used to Steal Funds Or as a Denial Of Service if `_from` Is Not The Message Sender](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/20)
_Submitted by kirk-baird, also found by cmichel and Omik_

### Line References

[PermitAndMulticall.sol#L46-L64](https://github.com/pooltogether/v4-twab-delegator/blob/2b6d42506187dd7096043e2dfec65fa06ab18577/contracts/PermitAndMulticall.sol#L46-L64)<br>
[PermitAndMulticall.sol#L31-L37](https://github.com/pooltogether/v4-twab-delegator/blob/2b6d42506187dd7096043e2dfec65fa06ab18577/contracts/PermitAndMulticall.sol#L31-L37)<br>
[TWABDelegator.sol#L438-L445](https://github.com/pooltogether/v4-twab-delegator/blob/2b6d42506187dd7096043e2dfec65fa06ab18577/contracts/TWABDelegator.sol#L438-L445)

### Vulnerability details

When the `_from` address is not the `msg.sender` `_multiCall()` will be made on behalf of the `msg.sender`. As a result each of the functions called by `multiCall()` will be made on behalf of `msg.sender` and not `_from`.

If functions such as `transfer()` or `unstake()` are called `msg.sender` will be the original caller which would transfer the attacker the funds if the `to` field is set to an attackers address.

Furthermore, if an attacker we to call `permitAndMulticall()` before the `_from` user they may use their signature and nonce combination. As a nonce is only allowe to be used once the siganture will no longer be valid and `_permitToken.permit()` will fail on the second call.

An attacker may use this as a Denial of Service (DoS) attack by continually front-running `permitAndCall()` using other users signatures.

### Proof of Concept
```solidity
function _multicall(bytes[] calldata _data) internal virtual returns (bytes[] memory results) {
  results = new bytes[](_data.length);
  for (uint256 i = 0; i < _data.length; i++) {
    results[i] = Address.functionDelegateCall(address(this), _data[i]);
  }
  return results;
}
```
```solidity
function _permitAndMulticall(
  IERC20Permit _permitToken,
  address _from,
  uint256 _amount,
  Signature calldata _permitSignature,
  bytes[] calldata _data
) internal {
  _permitToken.permit(
    _from,
    address(this),
    _amount,
    _permitSignature.deadline,
    _permitSignature.v,
    _permitSignature.r,
    _permitSignature.s
  );

  _multicall(_data);
}
```

### Recommended Mitigation Steps

Consider updating the `_from` field to be the `msg.sender` in `permitAndMulticall()` (or alternatively do this in `_permitAndMulticall()` to save some gas).
```solidity
function permitAndMulticall(
  uint256 _amount,
  Signature calldata _permitSignature,
  bytes[] calldata _data
) external {
  _permitAndMulticall(IERC20Permit(address(ticket)), msg.sender, _amount, _permitSignature, _data);
}
```

**[PierrickGT (PoolTogether) confirmed and resolved](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/20#issuecomment-1057474934):**
 > PR: https://github.com/pooltogether/v4-twab-delegator/pull/29

**[PierrickGT (PoolTogether) disagreed with Medium severity and commented](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/20#issuecomment-1058307757):**
 > Should be labelled as a 3 (High Risk) issue because an attacker could steal the funds.

**[0xleastwood (judge) commented](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/20#issuecomment-1060617163):**
 > I'm not exactly sure how this might be abused to steal funds. By front-running a call `permitAndMulticall()` with the same `_from` account, an attacker is able to use up the user's nonce and DoS their transactions. However, an attacker CAN control the `_data` parsed to the `_multicall()` function and delegate call to the `TWABDelegator.sol` contract. Although, in this case `msg.sender` will be the attacker and not the delegatee.
 >
 > As such, any call to transfer a delegation to another account will fail as the delegation is computed based off `msg.sender` and `_slot`.
 >
 > Could you confirm if there is a viable attack vector that would result in lost funds? @PierrickGT 

**[PierrickGT (PoolTogether) commented](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/20#issuecomment-1061952284):**
> You are right, the only attack vector possible would be with the `updateDelegatee` function since an attacker could pass a `_delegatee` address and we compute the delegation with the passed `_delegator` param.
> https://github.com/pooltogether/v4-twab-delegator/blob/60ae14e11947f8c896c1fef8f4d19ee714719383/contracts/TWABDelegator.sol#L265
> 
> Funds wouldn't be at risk but delegated to the attacker address.
> So I think the `2 (Med Risk)` label makes sense in this case since funds are not directly at risk but the attacker would enjoy better odds of winning.
> I've removed the `disagree with severity` label.

**[0xleastwood (judge) commented](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/20#issuecomment-1062612286):**
 > As per the above comment, I will leave this as `2 (Med Risk)`. The exploit does not lead to a loss of funds but can be abused to DoS this functionality and enjoy better odds of winning.



***


# Low Risk and Non-Critical Issues

For this contest, 9 reports were submitted by wardens detailing low risk and non-critical issues. The reports highlighted below received the top 3 scores from the judge and are by the following wardens/teams: 1) [WatchPug](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/27); 2) [CertoraInc](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/10); and 3) [hickuphh3](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/16).

_The following wardens also submitted reports: [gzeon](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/28), [Rhynorater](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/40), [Dravee](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/35), [chunter](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/19), [jayjonah8](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/1), and [robee](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/14)._

## [[L-01] delegator and/or representative should be allowed for arbitrary code execution besides restricted operations during unlocked period](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/27)
_Submitted by WatchPug_

### Line References

[Delegation.sol#L39-L46](https://github.com/pooltogether/v4-twab-delegator/blob/21bb53b2ea54a248bbd1d3170dbadd3a0c83d874/contracts/Delegation.sol#L39-L46)

### Vulnerability details

`Delegation` is a contract deployed dedicated to holding the `ticket` tokens for the `delegator` and they can then be `delegate` to a `delegatee`.

On the `Delegation` contract, there is a method named `executeCalls()` designed for "Executes calls on behalf of this contract" which allows arbitrary code execution for the owner.

However, we found that the owner of `Delegation` will always be `TWABDelegator`, and the `TWABDelegator` will only use `Delegation.sol#executeCalls()` to call one particular address: the `ticket` address, and for only two methods: `transfer()` and `delegate()`.

Furthermore, even though in `Delegation.sol#executeCalls()`, `calls[i].value` is used, the function is not being marked as `payable`, that makes it hard for calls that requires eth payments.

[Delegation.sol#L39-L46](https://github.com/pooltogether/v4-twab-delegator/blob/21bb53b2ea54a248bbd1d3170dbadd3a0c83d874/contracts/Delegation.sol#L39-L46)

```solidity
function executeCalls(Call[] calldata calls) external onlyOwner returns (bytes[] memory) {
  bytes[] memory response = new bytes[](calls.length);
  for (uint256 i = 0; i < calls.length; i++) {
    response[i] = _executeCall(calls[i].to, calls[i].value, calls[i].data);
  }
  return response;
}
```

While the `ticket` is being delegated through `TWABDelegator`, they won't be able to retrieve the tickets back until the `lockUntil`, without the ability to make arbitrary code execution, the `delegator` may miss some of the potential benefits as a holder of the `ticket` tokens, for example, an airdrop to all holders of the `ticket` tokens, or an NFT made mintable only for certain ticket holders.

### Recommended Mitigation Steps

Consider adding a new method on `TWABDelegator`:

```solidity
function executeCalls(
  address _delegator,
  uint256 _slot,
  Delegation.Call[] memory calls
) external payable returns (bytes[] memory) {
  _requireDelegatorOrRepresentative(_delegator);
  Delegation _delegation = Delegation(_computeAddress(_delegator, _slot));

  if (block.timestamp < _delegation.lockUntil()) {
    for (uint256 i = 0; i < calls.length; i++) {
      if (calls[i].to == address(ticket)) {
        revert("TWABDelegator/delegation-locked");
      }
    }
  }

  return _delegation.executeCalls{value: msg.value}(_calls);
}
```

And also, consider making `Delegation.sol#executeCalls()` a `payable` method.

**[PierrickGT (PoolTogether) acknowledged and commented](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/27#issuecomment-1058241764):**
 > The issue outlined by the warden is relevant but users won't need to execute arbitrary calls cause potential rewards given out to ticket holders will be handled by our TWABRewards contract.
> This contract retrieves users TWAB (Time-Weighted Average Balance) for a given period of time and calculate the amount of rewards they are eligible to. 
> Users can then `claimRewards` on behalf of others. So delegatees will be able to claim their rewards and delegators could claim on their behalf.
> 
> [TwabRewards.sol#L410](https://github.com/pooltogether/v4-periphery/blob/348d2bf7cfcf5750bad4aae63b8ade5a2a45f188/contracts/TwabRewards.sol#L410)<br>
> [ITwabRewards.sol#L94](https://github.com/pooltogether/v4-periphery/blob/348d2bf7cfcf5750bad4aae63b8ade5a2a45f188/contracts/interfaces/ITwabRewards.sol#L94)<br>
> 
> For more informations about how the TWAB works, here is some documentation:
> - [Time-Weighted Average Balance](https://dev.pooltogether.com/protocol/architecture/time-weighted-average-balance)
> - [Better Reward Distribution](https://medium.com/pooltogether/better-reward-distribution-65d900f3cef0)
> 
> Also, by restricting calls to the `transfer` and delegate` methods on the ticket, we limit the attack surface and any attack vector we may not have thought about.
> 
> For the reasons above, I've acknowledged the issue but we won't implement the proposed solution

**[0xleastwood (judge) decreased severity to Low and commented](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/27#issuecomment-1062705166):**
 > I don't really see a case where `_delegateCall()` or `_transferCall()` will need to have some ETH attached with it. They are solely dealing with the Ticket ERC20 token and updating delegation data. Considering the fact that rewards are handled by a separate contract, I think its fair to downgrade this to `1 (Low Risk)`.



***

## [[N-01] Tickets can get locked](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/10)
_Submitted by CertoraInc_

if a user calls `transferDelegationTo` with the address of the `TWABDelegator` contract as the `to` parameter, the tokens will be transferred to the address without minting the user the stake token, so maybe you can think of adding this functionality. I know that there is the `withdrawDelegationToStake` function for that, but that can be nice to enable it that way too.

**[PierrickGT (PoolTogether) confirmed, but disagreed with severity and commented](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/10#issuecomment-1057131932):**
> The tickets would actually get stuck in the contract. I've added a require to avoid transferring directly to the contract.
>
> Based on the severity criteria, I think this one should be labelled as a 2 (Med Risk) issue. Would be an error from the user interacting with the functions but funds would indeed be at risk, not direct but at risk.
>
> PR: pooltogether/v4-twab-delegator#27

**[0xleastwood (judge) commented](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/10#issuecomment-1066030370):**
> I think the issue highlighted is more in-line with incorrect state handling, so I'll leave the severity as is.



***

## [[L-02] Incorrect comment on `transferDelegationTo()`](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/16)
_Submitted by hickuphh3_

### Line References
[TWABDelegator.sol#L370-L371](https://github.com/pooltogether/v4-twab-delegator/blob/master/contracts/TWABDelegator.sol#L370-L371)

### Description
The comments say that the withdrawn tickets are transferred to the caller / delegator wallet, but are actually transferred to the `_to` address.

### Recommended Mitigation Steps
```
* @notice Withdraw an `_amount` of tickets from a delegation. The delegator is assumed to be the caller.
* @dev Tickets are sent directly to the passed `_to` address
```

**[PierrickGT (PoolTogether) confirmed and commented](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/16#issuecomment-1054830545):**
> PR: [pooltogether/v4-twab-delegator#21](https://github.com/pooltogether/v4-twab-delegator/pull/21)



***

## [[L-03] Incorrect comment on `TransferredDelegation` event](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/16)
_Submitted by hickuphh3_

### Line References
[TWABDelegator.sol#L125-L136](https://github.com/pooltogether/v4-twab-delegator/blob/master/contracts/TWABDelegator.sol#L125-L136)

### Description
In relation to L03, the `TransferredDelegation` event

    - is incorrectly commented that the withdrawn tickets are transferred to the caller / delegator wallet
    - lacks a description about the `to` indexed parameter.

### Recommended Mitigation Steps
```solidity
/**
 * @notice Emitted when a delegator withdraws an amount of tickets from a delegation to a specified wallet.
 * @param delegator Address of the delegator
 * @param slot  Slot of the delegation
 * @param amount Amount of tickets withdrawn
 * @param to Recipient address of withdrawn tickets
 */
  event TransferredDelegation(
    address indexed delegator,
    uint256 indexed slot,
    uint256 amount,
    address indexed to
  );
```

**[PierrickGT (PoolTogether) confirmed and commented](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/16#issuecomment-1054830545):**
> PR: [pooltogether/v4-twab-delegator#21](https://github.com/pooltogether/v4-twab-delegator/pull/21)



***

## [[L-04] Incorrect comment on `DelegationFundedFromStake` event](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/16)
_Submitted by hickuphh3_

### Line References
[TWABDelegator.sol#L102](https://github.com/pooltogether/v4-twab-delegator/blob/master/contracts/TWABDelegator.sol#L102)

### Description
The `DelegationFundedFromStake()` allows a representative or delegator himself to fund a delegation contract using the delegator’s stake. The `user` in the `DelegationFundedFromStake` event refers to `msg.sender`. Since the funds are coming solely from the delegator, its description isn’t entirely correct.

### Recommended Mitigation Steps
`@param user Address of the user who pulled funds from the delegator to the delegation`

**[PierrickGT (PoolTogether) confirmed and commented](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/16#issuecomment-1054830545):**
> PR: [pooltogether/v4-twab-delegator#21](https://github.com/pooltogether/v4-twab-delegator/pull/21)



***

## [[N-02] Extra whitespace in slot description of `WithdrewDelegationToStake()` event](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/16)
_Submitted by hickuphh3_

### Line References
[TWABDelegator.sol#L114](https://github.com/pooltogether/v4-twab-delegator/blob/master/contracts/TWABDelegator.sol#L114)

### Description
There is an additional spacing between `slot` and `Slot`.

### Recommended Mitigation Steps
Remove the spacing to become: `* @param slot Slot of the delegation`

**[PierrickGT (PoolTogether) confirmed and commented](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/16#issuecomment-1054830545):**
> PR: [pooltogether/v4-twab-delegator#21](https://github.com/pooltogether/v4-twab-delegator/pull/21)



***

## [[N-03] TWABDelegator: Consider renaming `_delegateCall()` to `_setDelegateeCall()`](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/16)
_Submitted by hickuphh3_

### Line References
[TWABDelegator.sol#L519](https://github.com/pooltogether/v4-twab-delegator/blob/master/contracts/TWABDelegator.sol#L519)

### Description
`_delegateCall()` could easily be confused for the inbuilt `delegatecall()` method. I recommend renaming it to something more distinguishable like `_setDelegateeCall()`.

**[PierrickGT (PoolTogether) confirmed and commented](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/16#issuecomment-1054830545):**
> PR: [pooltogether/v4-twab-delegator#21](https://github.com/pooltogether/v4-twab-delegator/pull/21)



***

# Gas Optimizations

For this contest, 17 reports were submitted by wardens detailing gas optimizations. The [report highlighted below](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/9) by warden team **CertoraInc** received the top score from the judge.

_The following wardens also submitted reports: [Dravee](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/36), [nascent](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/33), [IllIllI](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/38), [WatchPug](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/31), [robee](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/15), [Tomio](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/32), [sorrynotsorry](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/22), [kenta](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/41), [gzeon](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/30), [rfa](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/44), [z3s](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/25), [Omik](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/45), [0x1f8b](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/37), [ye0lde](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/39), [pedroais](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/48), and [hickuphh3](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/17)._

## [G-01] Loop in `Delegation` and `PermitAndMulticall` contracts

Loops can be optimized in several ways. Let's take for example the loop in the `executeCalls` function of the `Delegation` contract.

```solidity
function executeCalls(Call[] calldata calls) external onlyOwner returns (bytes[] memory) {
  bytes[] memory response = new bytes[](calls.length);
  for (uint256 i = 0; i < calls.length; i++) {
    response[i] = _executeCall(calls[i].to, calls[i].value, calls[i].data);
  }
  return response;
}
```

To optimize this loop and make it consume less gas, we can do the foloowing things:

1.  Use ++i instead of i++, which is a cheaper operation (in this case there is no difference between i++ and ++i because we dont use the return value of this expression, which is the only difference between these two expression).
2.  Save the `calls` array length in a local variable instead of accessing it in every iteration.
3.  Save `calls[i]` in a local variable instead of accessing it 3 times in every iteration. This will save accssing the array's ith element 3 times in every iteration ,which requires an address calculation.
4.  There's no need to initialize i to its default value, it will be done automatically and it will consume more gas if it will be done (I know, sounds stupid, but trust me - it works).

So after applying all these changes, the loop will look something like this:

```solidity
function executeCalls(Call[] calldata calls) external onlyOwner returns (bytes[] memory) {
  bytes[] memory response = new bytes[](calls.length);
  uint256 length = calls.length;
  Call memory call;
  for (uint256 i; i < length; ++i) {
    call = calls[i];
    response[i] = _executeCall(call.to, call.value, call.data);
  }
  return response;
}
```

## [G-02] Inline all these little functions

Defining all these little functions cause 2 things:

1.  contract's code size gets bigger
2.  the function calls consumes more gas than exectuing it as an inlined function (part of the code, without the function call)

So in order to save gas, I would recommend to inline these functions.

```solidity
function _computeAddress(address _delegator, uint256 _slot) internal view returns (address) {
  return _computeAddress(_computeSalt(_delegator, bytes32(_slot)));
}

function _computeLockUntil(uint96 _lockDuration) internal view returns (uint96) {
  return uint96(block.timestamp) + _lockDuration;
}

function _requireDelegatorOrRepresentative(address _delegator) internal view {
  require(
    _delegator == msg.sender || representatives[_delegator][msg.sender] == true,
    "TWABDelegator/not-delegator-or-rep"
  );
}

function _requireDelegateeNotZeroAddress(address _delegatee) internal pure {
  require(_delegatee != address(0), "TWABDelegator/dlgt-not-zero-adr");
}

function _requireAmountGtZero(uint256 _amount) internal pure {
  require(_amount > 0, "TWABDelegator/amount-gt-zero");
}

function _requireDelegatorNotZeroAddress(address _delegator) internal pure {
  require(_delegator != address(0), "TWABDelegator/dlgtr-not-zero-adr");
}

function _requireRecipientNotZeroAddress(address _to) internal pure {
  require(_to != address(0), "TWABDelegator/to-not-zero-addr");
}

function _requireDelegationUnlocked(Delegation _delegation) internal view {
  require(block.timestamp >= _delegation.lockUntil(), "TWABDelegator/delegation-locked");
}

function _requireContract(address _address) internal view {
  require(_address.isContract(), "TWABDelegator/not-a-contract");
}

function _requireLockDuration(uint256 _lockDuration) internal pure {
  require(_lockDuration <= MAX_LOCK, "TWABDelegator/lock-too-long");
}
```

**[PierrickGT (PoolTogether) confirmed and commented](https://github.com/code-423n4/2022-02-pooltogether-findings/issues/9#issuecomment-1054644165):**
 > PR: [pooltogether/v4-twab-delegator/pull#18](https://github.com/pooltogether/v4-twab-delegator/pull/18)
> 
> We've implemented the different fixes regarding the for loops, except for the `++i` recommendation, we kept `i++` for better code clarity.
> About the inline suggestion, we prefer to keep the code in reusable functions to keep a more readable and easier to update codebase than if we had to repeat our code through inlining.



***

# Disclosures

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.
