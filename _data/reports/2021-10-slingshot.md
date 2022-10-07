---
sponsor: "Slingshot Finance"
slug: "2021-10-slingshot"
date: "2021-11-17"  
title: "Slingshot Finance contest"
findings: "https://github.com/code-423n4/2021-10-slingshot-findings/issues"
contest: 48
---

# Overview

## About C4

Code 432n4 (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 code contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the code contest outlined in this document, C4 conducted an analysis of Slingshot Finance smart contract system written in Solidity. The code contest took place between October 30—November 1 2021.

## Wardens

18 Wardens contributed reports to the Slingshot Finance code contest:

1. [WatchPug](https://twitter.com/WatchPug_)
1. [daejunpark](https://daejunpark.github.io/)
1. [gpersoon](https://twitter.com/gpersoon)
1. [hickuphh3](https://twitter.com/HickupH)
1. [kenzo](https://twitter.com/KenzoAgada)
1. [pmerkleplant](https://twitter.com/merkleplant_eth)
1. [pauliax](https://twitter.com/SolidityDev)
1. [ye0lde](https://twitter.com/_ye0lde)
1. [cmichel](https://twitter.com/cmichelio)
1. [TomFrench](https://github.com/TomAFrench)
1. [csanuragjain](https://twitter.com/csanuragjain)
1. pants
1. [onewayfunction](https://twitter.com/onewayfunction)
1. [zer0dot](https://twitter.com/zer0dots)
1. [defsec](https://twitter.com/defsec_)
1. 0x0x0x
1. elprofesor
1. [gzeon](https://twitter.com/gzeon)

This contest was judged by [Alberto Cuesta Cañada](https://twitter.com/alcueca).

Final report assembled by [itsmetechjay](https://twitter.com/itsmetechjay) and [CloudEllie](https://twitter.com/CloudEllie1).

# Summary

The C4 analysis yielded an aggregated total of 14 unique vulnerabilities and 55 total findings. All of the issues presented here are linked back to their original finding.

Of these vulnerabilities, 0 received a risk rating in the category of HIGH severity, 2 received a risk rating in the category of MEDIUM severity, and 12 received a risk rating in the category of LOW severity.

C4 analysis also identified 17 non-critical recommendations and 24 gas optimizations.

# Scope

The code under review can be found within the [C4 Slingshot Finance contest repository](https://github.com/code-423n4/2021-10-slingshot), and is composed of 16 smart contracts written in the Solidity programming language and includes 649 lines of Solidity code and 0 lines of JavaScript.

# Severity Criteria

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

- Malicious Input Handling
- Escalation of privileges
- Arithmetic
- Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code423n4.com).

<!-- ============ -->
<!-- ============ -->
# Medium Risk Findings (2)
## [[M-01] `initialBalance` for native token is wrong](https://github.com/code-423n4/2021-10-slingshot-findings/issues/59)
_Submitted by WatchPug, also found by daejunpark, gpersoon, hickuphh3, kenzo, and pmerkleplant_.

<https://github.com/code-423n4/2021-10-slingshot/blob/9c0432cca2e43731d5a0ae9c151dacf7835b8719/contracts/Slingshot.sol#L65-L92>

```solidity
function executeTrades(
    address fromToken,
    address toToken,
    uint256 fromAmount,
    TradeFormat[] calldata trades,
    uint256 finalAmountMin,
    address depricated
) external nonReentrant payable {
    depricated;
    require(finalAmountMin > 0, "Slingshot: finalAmountMin cannot be zero");
    require(trades.length > 0, "Slingshot: trades cannot be empty");
    for(uint256 i = 0; i < trades.length; i++) {
        // Checks to make sure that module exists and is correct
        require(moduleRegistry.isModule(trades[i].moduleAddress), "Slingshot: not a module");
    }

    uint256 initialBalance = _getTokenBalance(toToken);
    _transferFromOrWrap(fromToken, _msgSender(), fromAmount);

    executioner.executeTrades(trades);

    uint finalBalance;
    if (toToken == nativeToken) {
        finalBalance = _getTokenBalance(address(wrappedNativeToken));
    } else {
        finalBalance = _getTokenBalance(toToken);
    }
    uint finalOutputAmount = finalBalance - initialBalance;
    ...
```

<https://github.com/code-423n4/2021-10-slingshot/blob/9c0432cca2e43731d5a0ae9c151dacf7835b8719/contracts/Slingshot.sol#L157-L163>

```solidity
function _getTokenBalance(address token) internal view returns (uint256) {
    if (token == nativeToken) {
        return address(executioner).balance;
    } else {
        return IERC20(token).balanceOf(address(executioner));
    }
}
```

When users swap to native token (ETH), the `initialBalance` should use the balance of `wrappedNativeToken` instead of native token balance, because `finalBalance` is the balance of `wrappedNativeToken`.

In the current implementation, when the `toToken` is the native token, `initialBalance` will be the ether balance of `executioner` contract. Therefore, when the ether balance of `executioner` is not 0, `finalOutputAmount` will be wrong.

The attacker can transfer a certain amount of ETH to the `executioner` contract and malfunction the protocol. Causing fund loss to users because `finalOutputAmount` is lower than the actual swapped amount, or DoS due to `finalAmountMin` cant be met.

#### Proof of Concept

Given:

*   The attacker send 0.25 ETH to the `executioner` contract;
*   The price of ETH in USDC is: 4000

1.  Alice swaps 5000 USDC to 1.25 ETH with `finalAmountMin` set to `1 ETH`;
2.  Alice will get 1 ETH out and lose 0.25 ETH;
3.  Bob swaps 1000 USDC to 0.25 ETH with `finalAmountMin` set to `1 wei`;
4.  Bob's transaction fails due to `finalAmountMin` cant being met.

#### Recommendation

Consider updating `_getTokenBalance()` and return `IERC20(wrappedNativeToken).balanceOf(address(executioner));` when `token == nativeToken`.

**[tommyz7 (Slingshot) disagreed with severity](https://github.com/code-423n4/2021-10-slingshot-findings/issues/59#issuecomment-959279936):**
 > "Alice swaps 5000 USDC to 1.25 ETH with finalAmountMin set to 1 ETH;" this assumption is wrong because it's based on huge slippage assumption. There is no way a Slingshot transaction accepts 20% slippage so funds loss scenario is incorrect.
> 
> duplicate of #18, medium risk since no user funds are at risk.



## [[M-02] Trades where toToken is feeOnTransferToken might send user less tokens than finalAmountMin](https://github.com/code-423n4/2021-10-slingshot-findings/issues/77)
_Submitted by kenzo_.

Slingshot's `executeTrades` checks that the trade result amount (to be sent to the user) is bigger than `finalAmountMin`, and *after that* sends the user the amount. But if the token charges fee on transfer, the final transfer to the user will decrease the amount the user is getting, maybe below `finalAmountMin`.

#### Proof of Concept

Slingshot requires `finalOutputAmount >= finalAmountMin` *before* sending the funds to the user:
<https://github.com/code-423n4/2021-10-slingshot/blob/main/contracts/Slingshot.sol#L93:#L98>
So if the token charges fees on transfer, the user will get less tokens than `finalOutputAmount` . The check of `finalOutputAmount` against `finalAmountMin` is premature.

#### Tools Used

Manual analysis

#### Recommended Mitigation Steps

Save the user's (not Executioner's) `toToken` balance in the beginning of `executeTrades` after `_transferFromOrWrap(fromToken, _msgSender(), fromAmount)`, and also in the very end, after `executioner.sendFunds(toToken, _msgSender(), finalOutputAmount)` has been called. The subtraction of user's initial balance from ending balance should be bigger than `finalAmountMin`.
<https://github.com/code-423n4/2021-10-slingshot/blob/main/contracts/Slingshot.sol#L65:#L99>

**[tommyz7 (Slingshot) disagreed with severity](https://github.com/code-423n4/2021-10-slingshot-findings/issues/77#issuecomment-959385967):**
 > Slingshot concern is to execute the trade as promised and make sure we are sending to the user what has been promised in trade estimation. If the token adds additional taxation on transfer, it is on the user side and users understand and accept this. We have seen this play out on production for the previous version of the contracts and we decided not to make that check. It seems the most practical decision.
> 
> Personally, I think this is non-critical.

**[alcueca (judge) commented](https://github.com/code-423n4/2021-10-slingshot-findings/issues/77#issuecomment-962400182):**
 > The severity for the issue is right. The sponsor should add documentation to the fact that some tokens might not conform to common expectations.

# Low Risk Findings (12)
- [[L-01] Unnecessary and risky `payable` annotation in swap() functions](https://github.com/code-423n4/2021-10-slingshot-findings/issues/25) _Submitted by daejunpark, also found by pauliax_.
- [[L-02] Inaccurate comment (rescueTokensFromExecutioner)](https://github.com/code-423n4/2021-10-slingshot-findings/issues/30) _Submitted by ye0lde_.
- [[L-03] BalancerV2ModuleMatic: Ensure tokenOut is not native token](https://github.com/code-423n4/2021-10-slingshot-findings/issues/38) _Submitted by hickuphh3_.
- [[L-04] Executioner: Restrict funds receivable to be only from wrapped native token](https://github.com/code-423n4/2021-10-slingshot-findings/issues/40) _Submitted by hickuphh3_.
- [[L-05] Slingshot: Unnecessary receive()](https://github.com/code-423n4/2021-10-slingshot-findings/issues/46) _Submitted by hickuphh3_.
- [[L-06] Function documentation incorrect for `ConcatStrings::appendUint`](https://github.com/code-423n4/2021-10-slingshot-findings/issues/47) _Submitted by pmerkleplant_.
- [[L-07] Function documentation incorrect for `Slingshot::_transferFromOrWrap`](https://github.com/code-423n4/2021-10-slingshot-findings/issues/53) _Submitted by pmerkleplant_.
- [[L-10] `LibERC20Token.approveIfBelow` should approve(0) first](https://github.com/code-423n4/2021-10-slingshot-findings/issues/81) _Submitted by cmichel_.
- [[L-11] Left-over tokens can be stolen](https://github.com/code-423n4/2021-10-slingshot-findings/issues/82) _Submitted by cmichel_.
- [[L-12] Confusing comment on IUniswapModule](https://github.com/code-423n4/2021-10-slingshot-findings/issues/84) _Submitted by kenzo_.
- [[L-13] Confusing comment in CurveModule](https://github.com/code-423n4/2021-10-slingshot-findings/issues/85) _Submitted by kenzo_.
- [[L-14] receive function](https://github.com/code-423n4/2021-10-slingshot-findings/issues/94) _Submitted by pauliax_.

# Non-Critical Findings (17)
- [[N-01] ModuleRegistry doesn't need to know address of Slingshot.sol](https://github.com/code-423n4/2021-10-slingshot-findings/issues/1) _Submitted by TomFrench_.
- [[N-02] Malicious governance can abuse approvals to ApprovalHandler](https://github.com/code-423n4/2021-10-slingshot-findings/issues/2) _Submitted by TomFrench_.
- [[N-03] Flaws in Slingshot._sendFunds()](https://github.com/code-423n4/2021-10-slingshot-findings/issues/24) _Submitted by daejunpark, also found by gpersoon, hickuphh3, kenzo, and pauliax_.
- [[N-04] String concatenation in revert messages results in increased gas costs + code complexity](https://github.com/code-423n4/2021-10-slingshot-findings/issues/37) _Submitted by TomFrench_.
- [[N-05] Slingshot: Incorrect comment for rescueTokensFromExecutioner()](https://github.com/code-423n4/2021-10-slingshot-findings/issues/43) _Submitted by hickuphh3_.
- [[N-06] Slingshot: Index fromToken and toToken for Trade event](https://github.com/code-423n4/2021-10-slingshot-findings/issues/45) _Submitted by hickuphh3_.
- [[N-07] Inconsistent naming for functions in `ConcatStrings.sol`](https://github.com/code-423n4/2021-10-slingshot-findings/issues/48) _Submitted by pmerkleplant_.
- [[N-08] Error messages in `ModuleRegistry.sol` inconsistent to the rest of the project](https://github.com/code-423n4/2021-10-slingshot-findings/issues/49) _Submitted by pmerkleplant_.
- [[N-09] `Adminable::setupAdmin` uses deprecated function](https://github.com/code-423n4/2021-10-slingshot-findings/issues/50) _Submitted by pmerkleplant_.
- [[N-10] Code Style: Abstract contracts should not be prefixed by `I`](https://github.com/code-423n4/2021-10-slingshot-findings/issues/65) _Submitted by WatchPug_.
- [[N-11] `SlingshotI` is unnecessary](https://github.com/code-423n4/2021-10-slingshot-findings/issues/66) _Submitted by WatchPug_.
- [[N-12] Code Style: consistency](https://github.com/code-423n4/2021-10-slingshot-findings/issues/67) _Submitted by WatchPug_.
- [[N-13] Outdated compiler version](https://github.com/code-423n4/2021-10-slingshot-findings/issues/70) _Submitted by WatchPug_.
- [[N-14] Typos](https://github.com/code-423n4/2021-10-slingshot-findings/issues/71) _Submitted by WatchPug_.
- [[N-15] `Slingshot._sendFunds` function not used and wrong](https://github.com/code-423n4/2021-10-slingshot-findings/issues/80) _Submitted by cmichel, also found by csanuragjain, WatchPug, WatchPug, and ye0lde_.
- [[N-16] `CurveModule.sol#swap()` Unused parameter](https://github.com/code-423n4/2021-10-slingshot-findings/issues/56) _Submitted by WatchPug_.
- [[N-17] Redundant code](https://github.com/code-423n4/2021-10-slingshot-findings/issues/55) _Submitted by WatchPug_.

# Gas Optimizations (24)
- [[G-01] Use of constant `keccak` variables results in extra hashing (and so gas).](https://github.com/code-423n4/2021-10-slingshot-findings/issues/3) _Submitted by TomFrench_.
- [[G-02] _transferFromOrWrap could be set private to save gas](https://github.com/code-423n4/2021-10-slingshot-findings/issues/5) _Submitted by pants_.
- [[G-03] The function _getTokenBalance could be set private to save gas](https://github.com/code-423n4/2021-10-slingshot-findings/issues/6) _Submitted by pants_.
- [[G-04] The function _sendFunds could be set private to save gas](https://github.com/code-423n4/2021-10-slingshot-findings/issues/7) _Submitted by pants_.
- [[G-05] A more efficient for loop index proceeding](https://github.com/code-423n4/2021-10-slingshot-findings/issues/9) _Submitted by pants_.
- [[G-06] nonReentrant modifier isn't necessary for executeTrades function](https://github.com/code-423n4/2021-10-slingshot-findings/issues/15) _Submitted by pants_.
- [[G-07] getRouter methods could be set external instead public](https://github.com/code-423n4/2021-10-slingshot-findings/issues/16) _Submitted by pants_.
- [[G-08] Small gas improvement](https://github.com/code-423n4/2021-10-slingshot-findings/issues/90) _Submitted by onewayfunction_.
- [[G-09] Unnecessary Use of _msgSender()](https://github.com/code-423n4/2021-10-slingshot-findings/issues/22) _Submitted by zer0dot_.
- [[G-10] Redundant Code Statement](https://github.com/code-423n4/2021-10-slingshot-findings/issues/27) _Submitted by defsec_.
- [[G-11] Unused Named Returns (ConcatStrings.sol)](https://github.com/code-423n4/2021-10-slingshot-findings/issues/31) _Submitted by ye0lde_.
- [[G-12] Long Revert Strings](https://github.com/code-423n4/2021-10-slingshot-findings/issues/32) _Submitted by ye0lde, also found by WatchPug_.
- [[G-13] `> 0` can be replaced with ` != 0` for gas optimisation](https://github.com/code-423n4/2021-10-slingshot-findings/issues/35) _Submitted by 0x0x0x_.
- [[G-14] CurveModule: Redundant jToken](https://github.com/code-423n4/2021-10-slingshot-findings/issues/39) _Submitted by hickuphh3, also found by pmerkleplant_.
- [[G-15] ModuleRegistry: Rename modulesIndex → isModule](https://github.com/code-423n4/2021-10-slingshot-findings/issues/41) _Submitted by hickuphh3_.
- [[G-16] Avoid unnecessary code execution can save gas](https://github.com/code-423n4/2021-10-slingshot-findings/issues/57) _Submitted by WatchPug_.
- [[G-17] `IUniswapModule.sol` use an immutable variable `router` can save gas and simplify implementation](https://github.com/code-423n4/2021-10-slingshot-findings/issues/61) _Submitted by WatchPug_.
- [[G-18] Remove redundant access control checks can save gas](https://github.com/code-423n4/2021-10-slingshot-findings/issues/62) _Submitted by WatchPug, also found by pauliax_.
- [[G-19] Cache array length in for loops can save gas](https://github.com/code-423n4/2021-10-slingshot-findings/issues/63) _Submitted by WatchPug, also found by 0x0x0x, pants, and pants_.
- [[G-20] Adding unchecked directive can save gas](https://github.com/code-423n4/2021-10-slingshot-findings/issues/68) _Submitted by WatchPug, also found by pauliax_.
- [[G-21] Avoid unnecessary storage read can save gas](https://github.com/code-423n4/2021-10-slingshot-findings/issues/69) _Submitted by WatchPug, also found by 0x0x0x_.
- [[G-22] Combine external calls into one can save gas](https://github.com/code-423n4/2021-10-slingshot-findings/issues/73) _Submitted by WatchPug_.
- [[G-23] Gas: Use a constant instead of `block.timestamp` for the deadline](https://github.com/code-423n4/2021-10-slingshot-findings/issues/83) _Submitted by cmichel_.
- [[G-24] ConcatStrings prependNumber is not used](https://github.com/code-423n4/2021-10-slingshot-findings/issues/88) _Submitted by kenzo, also found by pauliax_.

# Disclosures

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.
