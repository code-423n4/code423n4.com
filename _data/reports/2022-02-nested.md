---
sponsor: "Nested Finance"
slug: "2022-02-nested"
date: "2022-04-27"
title: "Nested Finance contest"
findings: "https://github.com/code-423n4/2022-02-nested-findings/issues"
contest: 86
---

# Overview

## About C4

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the Nested Finance smart contract system written in Solidity. The audit contest took place between February 10—February 12 2022.

## Wardens

26 Wardens contributed reports to the Nested Finance contest:

  1. [0xliumin](https://twitter.com/0xliumin)
  1. GreyArt ([hickuphh3](https://twitter.com/HickupH) and [itsmeSTYJ](https://twitter.com/itsmeSTYJ))
  1. 0x1f8b
  1. [pauliax](https://twitter.com/SolidityDev)
  1. [kenzo](https://twitter.com/KenzoAgada)
  1. [Dravee](https://twitter.com/JustDravee)
  1. robee
  1. IllIllI
  1. [csanuragjain](https://twitter.com/csanuragjain)
  1. hyh
  1. [Omik](https://twitter.com/omikomikomik)
  1. [gzeon](https://twitter.com/gzeon)
  1. [bobi](https://twitter.com/VladToie/)
  1. [rfa](https://www.instagram.com/riyan_rfa/)
  1. ShippooorDAO
  1. samruna
  1. [Tomio](https://twitter.com/meidhiwirara)
  1. kenta
  1. WatchPug ([jtp](https://github.com/jack-the-pug) and [ming](https://github.com/mingwatch))
  1. m_smirnova2020
  1. [ye0lde](https://twitter.com/_ye0lde)
  1. [sirhashalot](https://twitter.com/SirH4shalot)
  1. [defsec](https://twitter.com/defsec_)
  1. [cmichel](https://twitter.com/cmichelio)

This contest was judged by [harleythedog](https://github.com/harleythedogC4).

Final report assembled by [liveactionllama](https://twitter.com/liveactionllama).

# Summary

The C4 analysis yielded 5 unique MEDIUM severity vulnerabilities. Additionally, the analysis included 15 reports detailing issues with a risk rating of LOW severity or non-critical as well as 19 reports recommending gas optimizations. All of the issues presented here are linked back to their original finding.

Notably, 0 vulnerabilities were found during this audit contest that received a risk rating in the category of HIGH severity.

# Scope

The code under review can be found within the [C4 Nested Finance contest repository](https://github.com/code-423n4/2022-02-nested), and is composed of 10 smart contracts written in the Solidity programming language and includes 974 lines of Solidity code.

# Severity Criteria

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low/non-critical.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

- Malicious Input Handling
- Escalation of privileges
- Arithmetic
- Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code423n4.com).

# Medium Risk Findings (5)
## [[M-01] Destroy can avoid the bulk of fees](https://github.com/code-423n4/2022-02-nested-findings/issues/27)
_Submitted by 0xliumin_

[NestedFactory.sol#L446](https://github.com/code-423n4/2022-02-nested/blob/69cf51d8e4eeb8bce3025db7f4f74cc565c9fad3/contracts/NestedFactory.sol#L446)<br>

A user can destroy their NFTs and not pay fees on most of their assets.

### Proof of Concept

Alice has an NFT portfolio with 100 gwei dai and 100 gwei uni. Alice calls destroy on this NFT with buy token marked as dai. We would expect after this destroy step that she would pay 1 gwei dai in fees + 1 gwei uni worth of dai in fees, no matter what orders she selects.

Alice selects the following orders:

    [{ operator: ZeroEx, token: uni, calldata: performSwap with a very small amount of uni for dai}
     { operator: Flat, token: dai, calldata: transfer a very small amount dai for dai}]

This set of orders doesn't violate any of the require statements in the destroy function. Each order will complete successfully given the constraints here: [MixinOperatorResolver.sol#L100-L101](https://github.com/code-423n4/2022-02-nested/blob/69cf51d8e4eeb8bce3025db7f4f74cc565c9fad3/contracts/abstracts/MixinOperatorResolver.sol#L100-L101).<br>

Fees aren't collected on the leftover amount from the callOperator step, seen here: [NestedFactory.sol#L446](https://github.com/code-423n4/2022-02-nested/blob/69cf51d8e4eeb8bce3025db7f4f74cc565c9fad3/contracts/NestedFactory.sol#L446).<br>

This means that Alice will only pay the fees on the dai that was output from the orders (a very small amount), and the rest of the 100 gwei uni and 100 gwei dai are transferred directly back to the attacker.

### Recommended Mitigation Steps

Replace the safeTransfer with your safeTransferWithFees function.
Or, if you don't want users to have to pay fees on slippage, set a maximum "slippage" amount in the safeSubmitOrder function.

**[maximebrugel (Nested Finance) confirmed, but disagreed with High severity and commented](https://github.com/code-423n4/2022-02-nested-findings/issues/27#issuecomment-1036097325):**
 > Good one
> 
> PR: [Med/High Risk Fixes](https://github.com/NestedFi/nested-core-lego/pull/100)

**[harleythedog (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-02-nested-findings/issues/27#issuecomment-1053605608):**
 > The warden has described a way to avoid fees even when large amounts are being withdrawn. An avoidance of fees more closely fits the criteria of a medium severity issue:
> 
> > 2 — Med: Assets not at direct risk, but the function of the protocol or its availability could be impacted, or leak value with a hypothetical attack path with stated assumptions, but external requirements.
> 
> This is contrary to the previous audit that awarded a fee avoidance finding as high severity (which I disagree with).



***

## [[M-02] `NestedFactory` does not track operators properly](https://github.com/code-423n4/2022-02-nested-findings/issues/38)
_Submitted by IllIllI, also found by 0x1f8b, hyh, and pauliax_

[NestedFactory.sol#L99-L108](https://github.com/code-423n4/2022-02-nested/blob/fe6f9ef7783c3c84798c8ab5fc58085a55cebcfc/contracts/NestedFactory.sol#L99-L108)<br>
[MixinOperatorResolver.sol#L30-L47](https://github.com/code-423n4/2022-02-nested/blob/fe6f9ef7783c3c84798c8ab5fc58085a55cebcfc/contracts/abstracts/MixinOperatorResolver.sol#L30-L47)<br>
[NestedFactory.sol#L110-L122](https://github.com/code-423n4/2022-02-nested/blob/fe6f9ef7783c3c84798c8ab5fc58085a55cebcfc/contracts/NestedFactory.sol#L110-L122)<br>
[MixinOperatorResolver.sol#L49-L55](https://github.com/code-423n4/2022-02-nested/blob/fe6f9ef7783c3c84798c8ab5fc58085a55cebcfc/contracts/abstracts/MixinOperatorResolver.sol#L49-L55)

`NestedFactory` extends the `MixinOperatorResolver` contract which comes from the [`synthetix/MixinResolver.sol`](https://github.com/Synthetixio/synthetix/blob/a1786e5d64b5b51212785ade6d8b42435f69c387/contracts/MixinResolver.sol) code base where the expectation is that `isResolverCached()` returns false until [`rebuildCache()` is called and the cache is fully up to date](https://github.com/Synthetixio/synthetix/blob/a1786e5d64b5b51212785ade6d8b42435f69c387/test/contracts/MixinResolver.js#L82-L105). Due to [a medium issue](https://github.com/code-423n4/2021-11-nested-findings/issues/217) identified in a prior contest, the `OperatorResolver.importOperators()` step was made to be atomically combined with the `NestedFactory.rebuildCache()` step. However, the atomicity was not applied everywhere and the ability to add/remove operators from the `NestedFactory` also had other cache-inconsistency issues. There are *four separate instances* of operator tracking problems in this submission.

### Impact

As with the prior issue, many core operations (such as `NestedFactory.create()` and `NestedFactory.swapTokenForTokens()`) are dependant on the assumption that the `operatorCache` cache is synced prior to these functions being executed, but this may not necessarily be the case. Unlike the prior issue which was about updates to the resolver not getting reflected in the cache, this issue is about changes to the factory not updating the cache.

### Proof of Concept

#### 1. `removeOperator()` does not call `rebuildCache()`

1.  `NestedFactory.removeOperator()` is called to remove an operator
2.  A user calls `NestedFactory(MixinOperatorResolver).create()` using that operator and succeedes
3.  `NestedFactory.rebuildCache()` is called to rebuild cache

This flow is not aware that the cache is not in sync

```solidity
/// @inheritdoc INestedFactory
function addOperator(bytes32 operator) external override onlyOwner {
  require(operator != bytes32(""), "NF: INVALID_OPERATOR_NAME");
  bytes32[] memory operatorsCache = operators;
  for (uint256 i = 0; i < operatorsCache.length; i++) {
      require(operatorsCache[i] != operator, "NF: EXISTENT_OPERATOR");
  }
  operators.push(operator);
  emit OperatorAdded(operator);
}
```

[NestedFactory.sol#L99-L108](https://github.com/code-423n4/2022-02-nested/blob/fe6f9ef7783c3c84798c8ab5fc58085a55cebcfc/contracts/NestedFactory.sol#L99-L108)

#### 2. Using both `removeOperator()` and `rebuildCache()` does not prevent `create()` from using the operator

Even if `removeOperator()` calls `rebuildCache()` the function will still not work because `resolverOperatorsRequired()` only keeps track of remaining operators, and `rebuildCache()` currently has no way of knowing that an entry was removed from that array and that a corresponding entry from `operatorCache` needs to be removed too.

```solidity
/// @notice Rebuild the operatorCache
function rebuildCache() external {
    bytes32[] memory requiredOperators = resolverOperatorsRequired();
    bytes32 name;
    IOperatorResolver.Operator memory destination;
    // The resolver must call this function whenever it updates its state
    for (uint256 i = 0; i < requiredOperators.length; i++) {
        name = requiredOperators[i];
        // Note: can only be invoked once the resolver has all the targets needed added
        destination = resolver.getOperator(name);
        if (destination.implementation != address(0)) {
            operatorCache[name] = destination;
        } else {
            delete operatorCache[name];
        }
        emit CacheUpdated(name, destination);
    }
}
```

[MixinOperatorResolver.sol#L30-L47](https://github.com/code-423n4/2022-02-nested/blob/fe6f9ef7783c3c84798c8ab5fc58085a55cebcfc/contracts/abstracts/MixinOperatorResolver.sol#L30-L47)

#### 3. `addOperator()` does not call `rebuildCache()`

1.  `NestedFactory.addOperator()` is called to add an operator
2.  A user calls `NestedFactory(MixinOperatorResolver).create()` using that operator and fails because the operator wasn't in the `resolverOperatorsRequired()` during the last call to `rebuildCaches()`, so the operator isn't in `operatorCache`
3.  `NestedFactory.rebuildCache()` is called to rebuild cache

This flow is not aware that the cache is not in sync

```solidity
/// @inheritdoc INestedFactory
function removeOperator(bytes32 operator) external override onlyOwner {
  uint256 operatorsLength = operators.length;
  for (uint256 i = 0; i < operatorsLength; i++) {
      if (operators[i] == operator) {
          operators[i] = operators[operatorsLength - 1];
          operators.pop();
          emit OperatorRemoved(operator);
          return;
      }
  }
  revert("NF: NON_EXISTENT_OPERATOR");
}
```

[NestedFactory.sol#L110-L122](https://github.com/code-423n4/2022-02-nested/blob/fe6f9ef7783c3c84798c8ab5fc58085a55cebcfc/contracts/NestedFactory.sol#L110-L122)

#### 4. `isResolverCached()` does not reflect the actual updated-or-not state

This function, like `removeOperator()` is not able to tell that there is an operator that needs to be removed from `resolverCache`, causing the owner not to know a call to `rebuildCache()` is required to 'remove' the operator

```solidity
/// @notice Check the state of operatorCache
function isResolverCached() external view returns (bool) {
  bytes32[] memory requiredOperators = resolverOperatorsRequired();
  bytes32 name;
  IOperatorResolver.Operator memory cacheTmp;
  IOperatorResolver.Operator memory actualValue;
  for (uint256 i = 0; i < requiredOperators.length; i++) {
```

[MixinOperatorResolver.sol#L49-L55](https://github.com/code-423n4/2022-02-nested/blob/fe6f9ef7783c3c84798c8ab5fc58085a55cebcfc/contracts/abstracts/MixinOperatorResolver.sol#L49-L55)

### Recommended Mitigation Steps

Add calls to `rebuildCache()` in `addOperator()` and `removeOperator()`, have `INestedFactory` also track operators that have been removed with a new array, and have `isResolverCached()` also check whether this new array is empty or not.

**[maximebrugel (Nested Finance) confirmed and commented](https://github.com/code-423n4/2022-02-nested-findings/issues/38#issuecomment-1041944815):**
 > With this fix => [#18](https://github.com/code-423n4/2022-02-nested-findings/issues/18)<br>
> No need to add an array of removed operators, because we are now removing the operators from the cache at the same time. Only need to call rebuildCache when adding and removing operators.
> 
> PR: [Med/High Risk Fixes](https://github.com/NestedFi/nested-core-lego/pull/100)



***

## [[M-03] Undesired behavior](https://github.com/code-423n4/2022-02-nested-findings/issues/6)
_Submitted by robee, also found by 0x1f8b, csanuragjain, and Dravee_

[NestedRecords.sol#L117-L131](https://github.com/code-423n4/2022-02-nested/blob/69cf51d8e4eeb8bce3025db7f4f74cc565c9fad3/contracts/NestedRecords.sol#:~:text=uint256%20amount%20%3D%20records,_nftId%5D.reserve%20%3D%20_reserve%3B)<br>

You push a parameter into an array of tokens without checking if it already exists. And, if at first it's added with amount 0, it can later on be pushed with a greater amount and be twice in the array. Then in all processing it will consider the first occurrence and therefore the occurrence with amount 0.

         NestedRecords.store pushed the parameter _token

**[maximebrugel (Nested Finance) disagreed with High severity and commented](https://github.com/code-423n4/2022-02-nested-findings/issues/6#issuecomment-1034735686):**
 > Indeed, `_amount` is not checked and may result in the loss of funds for the user... If we only look at the `store` function.
> 
> **However**, this situation can't happen because of the `NestedFactory' (the only one able to call).
> 
> The Factory is calling with this private function : 
> ```javascript
> /// @dev Transfer tokens to the reserve, and compute the amount received to store
> /// in the records. We need to know the amount received in case of deflationary tokens.
> /// @param _token The token to transfer (IERC20)
> /// @param _amount The amount to send to the reserve
> /// @param _nftId The Token ID to store the assets
> function _transferToReserveAndStore(
>     IERC20 _token,
>     uint256 _amount,
>     uint256 _nftId
> ) private {
>     address reserveAddr = address(reserve);
>     uint256 balanceReserveBefore = _token.balanceOf(reserveAddr);
>     // Send output to reserve
>     _token.safeTransfer(reserveAddr, _amount);
>     uint256 balanceReserveAfter = _token.balanceOf(reserveAddr);
>     nestedRecords.store(_nftId, address(_token), balanceReserveAfter - balanceReserveBefore, reserveAddr);
> }
> ```
> 
> Here, the `store` amount parameter can be `0` if : 
> - `_amount` is equal to 0. Then `balanceReserveAfter - balanceReserveBefore` = `0`.
> - `_amount` is not equal to 0 but the `safeTransfer` function is transferring `0` tokens (100% fees, malicious contract,...).
> 
> We can't consider the second option, It is an external cause and we are not able to manage the exotic behaviors of ERC20s.
> So, when the `_amount` parameter of this function can be equal to `0` ?
> 
> => In `submitOutOrders` : 
> ```javascript
> amountBought = _batchedOrders.outputToken.balanceOf(address(this));
> 
> (...)
> 
> amountBought = _batchedOrders.outputToken.balanceOf(address(this)) - amountBought;
> feesAmount = amountBought / 100; // 1% Fee
> if (_toReserve) {
>     _transferToReserveAndStore(_batchedOrders.outputToken, amountBought - feesAmount, _nftId);
> }
> ```
> **But the `ZeroExOperator` or `FlatOperator` will revert if the amount bought is `0`.**
> 
> => In `_submitOrder`
> 
> ```javascript
> (bool success, uint256[] memory amounts) = callOperator(_order, _inputToken, _outputToken);
> require(success, "NF: OPERATOR_CALL_FAILED");
> if (_toReserve) {
>     _transferToReserveAndStore(IERC20(_outputToken), amounts[0], _nftId);
> }
> ```
> **Same,  the `ZeroExOperator` or `FlatOperator` will revert if the amount bought is `0`.**
> 
> In conclusion, we should check this parameter, but in the actual code state it can't happen (without taking into account the exotic ERC20s that we do not manage). If we add an operator that does not check the amount bought it can happen, so, maybe reducing the severity ?
> 
> PR: [Med/High Risk Fixes](https://github.com/NestedFi/nested-core-lego/pull/100)

**[harleythedog (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-02-nested-findings/issues/6#issuecomment-1053229547):**
 > Agree with sponsor, this issue doesn't exist with the current operators, so it is not currently a threat. I am going to downgrade this to medium.



***

## [[M-04] `NestedFactory`: User can utilise accidentally sent ETH funds via `processOutputOrders()` / `processInputAndOutputOrders()`](https://github.com/code-423n4/2022-02-nested-findings/issues/44)
_Submitted by GreyArt_

[NestedFactory.sol#L71](https://github.com/code-423n4/2022-02-nested/blob/main/contracts/NestedFactory.sol#L71)<br>
[NestedFactory.sol#L286-L296](https://github.com/code-423n4/2022-02-nested/blob/main/contracts/NestedFactory.sol#L286-L296)<br>
[NestedFactory.sol#L370-L375](https://github.com/code-423n4/2022-02-nested/blob/main/contracts/NestedFactory.sol#L370-L375)<br>
[NestedFactory.sol#L482-L492](https://github.com/code-423n4/2022-02-nested/blob/main/contracts/NestedFactory.sol#L482-L492)<br>

Should a user accidentally send ETH to the `NestedFactory`, anyone can utilise it to their own benefit by calling `processOutputOrders()` / `processInputAndOutputOrders()`. This is possible because:

1.  `receive()` has no restriction on the sender
2.  `processOutputOrders()` does not check `msg.value`, and rightly so, because funds are expected to come from `reserve`.
3.  `transferInputTokens()` does not handle the case where `ETH` could be specified as an address by the user for an output order.

```jsx
if (address(_inputToken) == ETH) {
  require(address(this).balance >= _inputTokenAmount, "NF: INVALID_AMOUNT_IN");
  weth.deposit{ value: _inputTokenAmount }();
  return (IERC20(address(weth)), _inputTokenAmount);
}
```

Hence, the attack vector is simple. Should a user accidentally send ETH to the contract, create an output `Order` with `token` being `ETH` and amount corresponding to the NestedFactory’s ETH balance.

### Recommended Mitigation Steps

1.  Since plain / direct`ETH` transfers are only expected to solely come from `weth` (excluding payable functions), we recommend restricting the sender to be `weth`, like how it is done in `[FeeSplitter](https://github.com/code-423n4/2022-02-nested/blob/main/contracts/FeeSplitter.sol#L101-L104)`.

    We are aware that this was raised previously here: [code-423n4/2021-11-nested-findings#188](https://github.com/code-423n4/2021-11-nested-findings/issues/188) and would like to add that restricting the sender in the `receive()` function will not affect `payable` functions. From from what we see, plain ETH transfers are also not expected to come from other sources like `NestedReserve` or operators.

```solidity
receive() external payable {
  require(msg.sender == address(weth), "NF: ETH_SENDER_NOT_WETH");
}
```

2.  Check that `_fromReserve` is false in the scenario `address(_inputToken) == ETH`.

```solidity
if (address(_inputToken) == ETH) {
  require(!_fromReserve, "NF: INVALID_INPUT_TOKEN");
  require(address(this).balance >= _inputTokenAmount, "NF: INVALID_AMOUNT_IN");
  weth.deposit{ value: _inputTokenAmount }();
  return (IERC20(address(weth)), _inputTokenAmount);
}
```

**[maximebrugel (Nested Finance) confirmed and resolved](https://github.com/code-423n4/2022-02-nested-findings/issues/44):**
> PR: [Med/High Risk Fixes](https://github.com/NestedFi/nested-core-lego/pull/100)



***

## [[M-05] Wrong logic around `areOperatorsImported`](https://github.com/code-423n4/2022-02-nested-findings/issues/17)
_Submitted by 0x1f8b, also found by 0xliumin and kenzo_

[OperatorResolver.sol#L42-L43](https://github.com/code-423n4/2022-02-nested/blob/fe6f9ef7783c3c84798c8ab5fc58085a55cebcfc/contracts/OperatorResolver.sol#L42-L43)<br>

The logic related to the `areOperatorsImported` method is incorrect and can cause an operator not to be updated because the owner thinks it is already updated, and a vulnerable or defective one can be used.

### Proof of Concept

The `operators` mapping is made up of a key `bytes32 name` and a value made up of two values: `implementation` and `selector`, both of which identify the contract and function to be called when an operator is invoked.

The `areOperatorsImported` method tries to check if the operators to check already exist, however, the check is not done correctly, since && is used instead of ||.

If the operator with name `A` and value `{implementation=0x27f8d03b3a2196956ed754badc28d73be8830a6e,selector="performSwapVulnerable"}` exists, and the owner try to check if the operator with name `A` and value `{implementation=0x27f8d03b3a2196956ed754badc28d73be8830a6e,selector="performSwapFixed"}` exists, that function will return `true`, and the owner may decide not to import it , producing unexpected errors.
Because operators manage the tokens, this error can produce a token lost.

### Recommended Mitigation Steps

Change && by ||

**[maximebrugel (Nested Finance) confirmed and resolved](https://github.com/code-423n4/2022-02-nested-findings/issues/17):**
> PR: [Med/High Risk Fixes](https://github.com/NestedFi/nested-core-lego/pull/100)

**[harleythedog (judge) commented](https://github.com/code-423n4/2022-02-nested-findings/issues/17#issuecomment-1053625678):**
 > Good catch, I agree with severity.



***

# Low Risk and Non-Critical Issues

For this contest, 15 reports were submitted by wardens detailing low risk and non-critical issues. The [report highlighted below](https://github.com/code-423n4/2022-02-nested-findings/issues/66) by warden **pauliax** received the top score from the judge.

_The following wardens also submitted reports: [Dravee](https://github.com/code-423n4/2022-02-nested-findings/issues/70), [Omik](https://github.com/code-423n4/2022-02-nested-findings/issues/58), [IllIllI](https://github.com/code-423n4/2022-02-nested-findings/issues/35), [kenzo](https://github.com/code-423n4/2022-02-nested-findings/issues/46), [samruna](https://github.com/code-423n4/2022-02-nested-findings/issues/24), [gzeon](https://github.com/code-423n4/2022-02-nested-findings/issues/50), [bobi](https://github.com/code-423n4/2022-02-nested-findings/issues/45), [robee](https://github.com/code-423n4/2022-02-nested-findings/issues/4), [rfa](https://github.com/code-423n4/2022-02-nested-findings/issues/65), [WatchPug](https://github.com/code-423n4/2022-02-nested-findings/issues/52), [GreyArt](https://github.com/code-423n4/2022-02-nested-findings/issues/40), [csanuragjain](https://github.com/code-423n4/2022-02-nested-findings/issues/9), [0xliumin](https://github.com/code-423n4/2022-02-nested-findings/issues/33), and [ShippooorDAO](https://github.com/code-423n4/2022-02-nested-findings/issues/26)._


## [01]

Function releaseTokens uses weth, not eth when comparing against a native asset. if the token address is weth, it unwraps and sends the native asset to the user:

```solidity
if (address(_tokens[i]) == weth)
  IWETH(weth).withdraw(amount);
  (bool success, ) = _msgSender().call{ value: amount }("");
  require(success, "FS: ETH_TRANFER_ERROR");
```

Releasing weth token should be left as a valid option if the user prefers wrapped ERC20 eth, and I think for this native purpose there is a not used storage variable named ETH:

```solidity
address private constant ETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
```

Based on my assumptions, the intention was:

```solidity
if (address(_tokens[i]) == ETH)
  ...
```

or if you do not want to implement this change, then at least remove this unused variable to save some gas.
However, the issue is small, because the user can always retrieve weth by using another function named releaseTokensNoETH.

## [02]

This was mentioned in the Red4Sec audit (NFSC09), but it wasn't fixed here: OwnableProxyDelegation is Context, but still uses msg.sender, not \_msgSender():

```solidity
require(StorageSlot.getAddressSlot(_ADMIN_SLOT).value == msg.sender, "OFP: FORBIDDEN");
```

## [03]

function rebuildCache() in MixinOperatorResolver does not delete removed operators from operatorCache. resolverOperatorsRequired return current active operators, so it will not contain removed operators, e.g. operator was removed by calling removeOperator in the factory, then rebuildCache is called, and the cache will still contain this removed operator, and it will be possible to callOperator on this operator.

## [04]

Consider introducing an upper limit for \_timestamp in updateLockTimestamp, e.g. max 1 year from current block timestamp, otherwise it may be possible to accidentally lock the token forever.

## [05]

If removeFactory has this check:

```solidity
require(supportedFactories[_factory], "OFH: NOT_SUPPORTED"); 
```

then I think addFactory should have an analogous check:

```solidity
require(!supportedFactories[_factory], "OFH: ALREADY_SUPPORTED"); 
```

## [06]

The revert message is a bit misleading here:

```solidity
require(assetTokensLength > 1, "NF: UNALLOWED_EMPTY_PORTFOLIO");
```

## [07]

NestedFactory has a function unlockTokens that lets admin rescue any ERC20 token. Consider also adding support for rescuing the native asset (e.g. ETH).

**[maximebrugel (Nested Finance) commented](https://github.com/code-423n4/2022-02-nested-findings/issues/66#issuecomment-1040355605):**
 > **[01] Function releaseTokens uses weth, not eth**<br>
 > We are only sending fees with ERC20 (so WETH and not ETH). In the releaseTokens tokens we are unwrapping the WETH to transfer ETH. The `nestedFactory` is wrapping ETH before sending fees.
> 
> But we should remove this variable => `address private constant ETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;` and change comment.
> 
> **[02] OwnableProxyDelegation is Context, but still uses msg.sender, not _msgSender()**<br>
> Acknowledged. No meta-transaction support for this admin function.
> 
> **[03] Function rebuildCache() in MixinOperatorResolver does not delete removed operators from operatorCache**<br>
> Confirmed. The mitigation found is to remove from cache in the `removeOperator` function.
> 
> **[04] Consider introducing an upper limit for _timestamp in updateLockTimestamp**<br>
> Acknowledged. We are not sure about an upper limit to set.
> 
> **[05] addFactory should have an analogous check**<br>
> Disputed. No need for a require as long as  `supportedFactories[_factory] = true` does not disrupt the protocol state.
> 
> **[06] The revert message is a bit misleading here**<br>
> Disputed. I don’t really know what is misleading. You can’t withdraw the last token and keep an empty portfolio.
> 
> **[07] adding support for rescuing the native asset**<br>
> Acknowledged. We will fix this issue by adding a require in the `receive` function. Also, the user can't send more ETH than needed with the `_checkMsgValue` function.

**[harleythedog (judge) commented](https://github.com/code-423n4/2022-02-nested-findings/issues/66#issuecomment-1057576659):**
 > My personal judgements:<br>
> **[01] "Function releaseTokens uses weth"**<br>
> This is a gas optimization. Will keep it in mind when scoring [#67](https://github.com/code-423n4/2022-02-nested-findings/issues/67) [G-07]. For here, invalid.
>
> **[02] "OwnableProxyDelegation is Context"**<br>
> Valid and very-low-critical.
>
> **[03] "Function rebuildCache() in MixinOperatorResolver does not delete removed operators from operatorCache"**<br>
> This has been upgraded to medium severity in [#77](https://github.com/code-423n4/2022-02-nested-findings/issues/77) [M-02]. Will not contribute to QA score.
>
> **[04] "Consider introducing an upper limit for _timestamp in updateLockTimestamp"**<br>
> I think this is a good idea. Valid and low-critical.
>
> **[05] "addFactory should have an analogous check"**<br>
> Just a consistency suggestion, valid and non-critical.
>
> **[06] "The revert message is a bit missleading here"**<br>
> Warden doesn't explain enough why it is misleading. Invalid.
>
> **[07] "Consider also adding support for rescuing the native asset"**<br>
> Valid and low-critical.
>
> Now, here is the methodology I used for calculating a score for each QA report. I first assigned each submission to be either non-critical (1 point), very-low-critical (5 points) or low-critical (10 points), depending on how severe/useful the issue is. The score of a QA report is the sum of these points, divided by the maximum number of points achieved by a QA report. This maximum number was 26 points, achieved by this report [#66](https://github.com/code-423n4/2022-02-nested-findings/issues/66).
> 
> The number of points achieved by this report is 26 points.<br>
> Thus the final score of this QA report is (26/26)*100 = 100.



***

# Gas Optimizations

For this contest, 19 reports were submitted by wardens detailing gas optimizations. The [report highlighted below](https://github.com/code-423n4/2022-02-nested-findings/issues/67) by warden **pauliax** received the top score from the judge.

*The following wardens also submitted reports: [robee](https://github.com/code-423n4/2022-02-nested-findings/issues/5), [Dravee](https://github.com/code-423n4/2022-02-nested-findings/issues/28), [kenzo](https://github.com/code-423n4/2022-02-nested-findings/issues/47), [GreyArt](https://github.com/code-423n4/2022-02-nested-findings/issues/39), [Tomio](https://github.com/code-423n4/2022-02-nested-findings/issues/55), [Omik](https://github.com/code-423n4/2022-02-nested-findings/issues/57), [kenta](https://github.com/code-423n4/2022-02-nested-findings/issues/72), [rfa](https://github.com/code-423n4/2022-02-nested-findings/issues/64), [m\_smirnova2020](https://github.com/code-423n4/2022-02-nested-findings/issues/32), [csanuragjain](https://github.com/code-423n4/2022-02-nested-findings/issues/8), [0x1f8b](https://github.com/code-423n4/2022-02-nested-findings/issues/16), [ye0lde](https://github.com/code-423n4/2022-02-nested-findings/issues/56), [sirhashalot](https://github.com/code-423n4/2022-02-nested-findings/issues/68), [ShippooorDAO](https://github.com/code-423n4/2022-02-nested-findings/issues/25), [gzeon](https://github.com/code-423n4/2022-02-nested-findings/issues/48), [defsec](https://github.com/code-423n4/2022-02-nested-findings/issues/71), [cmichel](https://github.com/code-423n4/2022-02-nested-findings/issues/15), and [bobi](https://github.com/code-423n4/2022-02-nested-findings/issues/43).*

## [G-01]

Function transfer in NestedReserve is never used and can only be called by the factory (onlyFactory), so consider removing it because I think the factory uses a withdraw function from the Reserve.

Currently never used:

```solidity
  function setReserve onlyFactory
```

You can remove it to save some gas, or leave it if it was intended for future use with other factories.

## [G-02]

Functions that add or remove operators or shareholders iterate over the whole array, so you can consider using EnumerableSet to store them:

[EnumerableSet.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/structs/EnumerableSet.sol)

## [G-03]

Could just use msg.sender and do not call an owner() function here:

```solidity
function unlockTokens(IERC20 _token) external override onlyOwner {
  ...
  _token.safeTransfer(owner(), amount);
```

## [G-04]

There are several functions that call \_checkMsgValue. This function is quite expensive as it iterates over all the \_batchedOrders and is only relevant when the inputToken is ETH. Later the callers will have to iterate over all the \_batchedOrders again anyway, so I think this function should be refactored to significantly reduce gas. My suggestion:

Because processInputOrders and processInputAndOutputOrders both call \_processInputOrders, the logic from \_checkMsgValue could be moved to \_processInputOrders. function create then can be refactored to re-use \_processInputOrders. I see 2 discrepancies here: \_fromReserve is always false when \_submitInOrders is called from create (could be solved if \_processInputOrders takes extra parameter), and \_processInputOrders has this extra line:

```solidity
require(nestedRecords.getAssetReserve(_nftId) == address(reserve), "NF: RESERVE_MISMATCH");
```

but this could be solved if you first mint the NFT and then invoke \_processInputOrders from create.

## [G-05]

Function withdraw calls nestedRecords twice:

```solidity
uint256 assetTokensLength = nestedRecords.getAssetTokensLength(_nftId);
...
address token = nestedRecords.getAssetTokens(_nftId)[_tokenIndex];
```

I think it could just substitute these links by first fetching all the tokens, and then calculating the length itself instead of making 2 external calls for pretty much the same data.

## [G-06]

Could use 'unchecked' maths here, as underflow is not possible:

```solidity
if (_amountToSpend > amounts[1]) {
  IERC20(_inputToken).safeTransfer(_msgSender(), _amountToSpend - amounts[1]);
}
```

**[maximebrugel (Nested Finance) commented](https://github.com/code-423n4/2022-02-nested-findings/issues/67#issuecomment-1042990798):**
 > **[G-01] "You can remove it to save some gas, or leave it if it was intended for future use with other factories"**<br>
 > Acknowledged
> 
> **[G-02] Consider using EnumerableSet to store operators**<br>
> Acknowledged
> 
> **[G-03] "Could just use msg.sender and do not call an owner() function here"**<br>
> Confirmed
> 
> **[G-04] `_checkMsgValue` refactoring**<br> 
> Disputed<br>
> "Could be". You need to pre-calculate the amount of ETH needed to check msg.value in a simple way.
> 
> **[G-05] "function withdraw calls nestedRecords twice"**<br>
> Acknowledged
> 
> **[G-06] "Could use 'unchecked' maths here, as underflow is not possible"**<br>
> Confirmed
>
> PR: [Gas Optimizations Fixes](https://github.com/NestedFi/nested-core-lego/pull/101)

**[harleythedog (judge) commented](https://github.com/code-423n4/2022-02-nested-findings/issues/67#issuecomment-1066015587):**
 > My personal judgments:<br>
>
> **[G-01] "function transfer in NestedReserve is never used".**<br>
> Valid and medium-optimization.<br>
>
> **[G-02] "EnumerableSet to store them".**<br>
> Valid and small-optimization.<br>
> 
> **[G-03] "Could just use msg.sender".**<br>
> Valid and small-optimization.<br>
>
> **[G-04] "`_checkMsgValue` refactoring".**<br>
> The idea of refactoring the reserve check to be in the combined function is valid.<br>
> Valid and small-optimization.<br>
>
> **[G-05] "withdraw calls nestedRecords twice".**<br>
> Valid and small-optimization.<br>
>
> **[G-06] "Could use 'unchecked' here".**<br>
> This was disputed in other gas reports as this already surfaced in the first contest. To be fair, this should be marked as invalid too.<br>
> Invalid.<br>
> 
 > Also, [#66](https://github.com/code-423n4/2022-02-nested-findings/issues/66) has the additional issue:<br>
> **[G-07] "remove this unused variable to save some gas (ETH)".**<br>
> Valid and small-optimization.
>
 > Now, here is the methodology I used for calculating a score for each gas report. I first assigned each submission to be either small-optimization (1 point), medium-optimization (5 points) or large-optimization (10 points), depending on how useful the optimization is. The score of a gas report is the sum of these points, divided by the maximum number of points achieved by a gas report. This maximum number was 10 points, achieved by this report [#67](https://github.com/code-423n4/2022-02-nested-findings/issues/67).
> 
> The number of points achieved by this report is 10 points.<br>
> Thus the final score of this gas report is (10/10)*100 = 100.



***

# Disclosures

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.
