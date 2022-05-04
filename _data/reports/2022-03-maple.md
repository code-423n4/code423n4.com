---
sponsor: "Maple Finance"
slug: "2022-03-maple"
date: "2022-04-20"
title: "Maple Finance contest"
findings: "https://github.com/code-423n4/2022-03-maple-findings/issues"
contest: 99
---

# Overview

## About C4

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the Maple Finance smart contract system written in Solidity. The audit contest took place between March 17—March 21 2022.

## Wardens

20 Wardens contributed reports to the Maple Finance contest:

  1. cccz
  1. [rayn](https://twitter.com/rayn731)
  1. IllIllI
  1. WatchPug ([jtp](https://github.com/jack-the-pug) and [ming](https://github.com/mingwatch))
  1. [berndartmueller](https://twitter.com/berndartmueller)
  1. [defsec](https://twitter.com/defsec_)
  1. [gzeon](https://twitter.com/gzeon)
  1. CertoraInc ([danb](https://twitter.com/danbinnun), egjlmn1, [OriDabush](https://twitter.com/ori_dabush), ItayG, and shakedwinder)
  1. robee
  1. [Dravee](https://twitter.com/JustDravee)
  1. [0xNazgul](https://twitter.com/0xNazgul)
  1. 0xwags
  1. 0xkatana
  1. [Tomio](https://twitter.com/meidhiwirara)
  1. [Funen](https://instagram.com/vanensurya)

This contest was judged by [LSDan](https://twitter.com/lsdan_defi).

Final report assembled by [liveactionllama](https://twitter.com/liveactionllama).

# Summary

The C4 analysis yielded 2 unique MEDIUM severity vulnerabilities. Additionally, the analysis included 8 reports detailing issues with a risk rating of LOW severity or non-critical as well as 13 reports recommending gas optimizations. All of the issues presented here are linked back to their original finding.

Notably, 0 vulnerabilities were found during this audit contest that received a risk rating in the category of HIGH severity.

# Scope

The code under review can be found within the [C4 Maple Finance contest repository](https://github.com/code-423n4/2022-03-maple), and is composed of 7 smart contracts written in the Solidity programming language and includes 1272 lines of Solidity code.

# Severity Criteria

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low/non-critical.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

- Malicious Input Handling
- Escalation of privileges
- Arithmetic
- Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code423n4.com).

# Medium Risk Findings (2)
## [[M-01] Incorrect implementation of Lender can result in lost tokens](https://github.com/code-423n4/2022-03-maple-findings/issues/16)
_Submitted by cccz_

MapleLoanInternals.\_sendFee should check returnData.length == 32 before decoding, otherwise if it returns bytes data, the abi.decode will return 0x20, result in lost tokens.

### Proof of Concept

[MapleLoanInternals.sol#L332-L344](https://github.com/maple-labs/loan/blob/main/contracts/MapleLoanInternals.sol#L332-L344)<br>
This contract can test that when the function returns bytes data, abi.encode will decode the return value as 0x20.
```solidity
pragma solidity 0.8.7;
contract A{
    address public destination;
    uint256 public number;
    function convertA() external{
        (bool su,bytes memory ret )= address(this).call(abi.encodeWithSelector(this.ret.selector));
        number = ret.length;
        destination = abi.decode(ret, (address));
    }
    function ret() public returns(bytes memory){
        return "0x74d754378a59Ab45d3E6CaC83f0b87E8E8719270";
    }
}
```

### Recommended Mitigation Steps
```solidity
function _sendFee(address lookup_, bytes4 selector_, uint256 amount_) internal returns (bool success_) {
    if (amount_ == uint256(0)) return true;

    ( bool success , bytes memory data ) = lookup_.call(abi.encodeWithSelector(selector_));

+       if (!success || data.length != uint256(32)) return false;

    address destination = abi.decode(data, (address));

    if (destination == address(0)) return false;

    return ERC20Helper.transfer(_fundsAsset, destination, amount_);
}
```

**[lucas-manuel (Maple Finance) confirmed, but disagreed with Medium severity and commented](https://github.com/code-423n4/2022-03-maple-findings/issues/16#issuecomment-1075306669):**
 > This technically is true, but I consider this informational as this is an extreme edge case. The poolDelegate and mapleTreasury values are almost guaranteed to never change, and if they did it would be to an audited Maple implementation which would never use bytes memory to return the address.
> 
> This is a cool finding and we will address, but it is informational.

**[JGcarv (Maple Finance) resolved](https://github.com/code-423n4/2022-03-maple-findings/issues/16#ref-pullrequest-1178576266):**
 > Fix: [Check data length (maple-labs/loan#154)](https://github.com/maple-labs/loan/pull/154)

**[LSDan (judge) commented](https://github.com/code-423n4/2022-03-maple-findings/issues/16#issuecomment-1087997844):**
 > Disagree with sponsor on the rating. This has external requirements and assets are not at direct risk, but it could result in a loss of funds.



***

## [[M-02] Processes refinance operations may call malicious code by re-created refinancer contract](https://github.com/code-423n4/2022-03-maple-findings/issues/23)
_Submitted by rayn_

When an attacker (borrower) proposes a new term, the attacker can let a lender accept the malicious term which the lender doesn't expect.

It uses delegatecall in `_acceptNewTerms` of MapleLoanInternals.sol. Though a lender can manually check refinancer contract before calling `acceptNewTerms`, the attacker (borrower) can still re-create a malicious contract on same address before the lender is calling `acceptNewTerms`, and trigger malicious code by delegatecall in `_acceptNewTerms`.

### Proof of Concept

In summary, an attacker can use CREATE2 to re-create a new malicious contract on same address. Here is CREATE2 exploit example: <https://x9453.github.io/2020/01/04/Balsn-CTF-2019-Creativity/>

1.  An attacker (borrower) first deploy a refinancer contract with normal refinance actions to cheat lenders. The refinancer have malicious constructor which can be hidden in inherited contracts.
2.  The attacker call `proposeNewTerms`, specifying a refinancer contract, and monitor `acceptNewTerms` in Mempool.
3.  When the attacker monitored a lender calls `acceptNewTerms`, then quickly pack these transactions:
    1.  Destroy refinancer contract by calling selfdestruct
    2.  Use CREATE2 to re-deploy a new refinancer contract with malicious code on same address
    3.  The lender calls `acceptNewTerms`
4.  Then a lender will execute malicious code of new refinancer contract.

### Tools Used

ethers.js

### Recommended Mitigation Steps

Also check refinancer contract bytecodes in `_getRefinanceCommitment`:
```solidity
function _getRefinanceCommitment(address refinancer_, uint256 deadline_, bytes[] calldata calls_) internal pure returns (bytes32 refinanceCommitment_) {
    return keccak256(abi.encode(refinancer_, deadline_, calls_, at(refinancer)));
}

function at(address _addr) public view returns (bytes memory o_code) {
    assembly {
        // retrieve the size of the code, this needs assembly
        let size := extcodesize(_addr)
        // allocate output byte array - this could also be done without assembly
        // by using o_code = new bytes(size)
        o_code := mload(0x40)
        // new "memory end" including padding
        mstore(0x40, add(o_code, and(add(add(size, 0x20), 0x1f), not(0x1f))))
        // store length in memory
        mstore(o_code, size)
        // actually retrieve the code, this needs assembly
        extcodecopy(_addr, add(o_code, 0x20), 0, size)
    }
}
```

**[lucas-manuel (Maple Finance) disputed and commented](https://github.com/code-423n4/2022-03-maple-findings/issues/23#issuecomment-1074468251):**
 > Refinancer contracts are vetted by the smart contracts team. Any custom refinancer that is used will be able to have devastating consequences on the Loan as it performs custom delegatecalls. For this reason the assumption is made that Borrowers and Lenders will only use audited immutable Refinancer contracts that are deployed by the Maple Labs smart contracts team, and if not, they must be diligent enough to audit themselves or must accept any consequences.
> 
> This is not a valid issue.

**[LSDan (judge) commented](https://github.com/code-423n4/2022-03-maple-findings/issues/23#issuecomment-1087977993):**
 > The report is valid. Given the potential danger involved, you should whitelist the allowable Refinancer contracts to protect your lenders. Issue stands.

**[lucas-manuel (Maple Finance) disagreed with High severity and commented](https://github.com/code-423n4/2022-03-maple-findings/issues/23#issuecomment-1088886675):**
 > We're providing smart contracts team validated refinancers to the application for the lenders and borrowers to use. If they choose to use externally developed refinancers (something we want to support as it will allow for highly customizable logic between lenders and borrowers which is a feature not a bug), they must audit themselves.
> 
> If there is a selfdestruct contained in the contract, it can be immediately assumed to be malicious because of the exploit outlined above. Same goes for proxied refinancers and stateful refinancers.
> 
> I do not agree with this being a High Risk issue due to its very high degree of difficulty. The borrower would have to develop a smart contract with this exploit, submit it outside of the application, and convince the Pool Delegate to accept the refinancer address also outside of the application without an audit.
> 
> I think that this is an interesting finding and am not discounting it, but I highly disagree with severity.

**[LSDan (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-03-maple-findings/issues/23#issuecomment-1089093596):**
 > I see your point. This exploit has external requirements and so should be medium, but I do think this represents a significant attack vector should a lender act accidentally against their own best interests.



***

# Low Risk and Non-Critical Issues

For this contest, 8 reports were submitted by wardens detailing low risk and non-critical issues. The [report highlighted below](https://github.com/code-423n4/2022-03-maple-findings/issues/17) by warden **IllIllI** received the top score from the judge.

_The following wardens also submitted reports: [WatchPug](https://github.com/code-423n4/2022-03-maple-findings/issues/32), [defsec](https://github.com/code-423n4/2022-03-maple-findings/issues/39), [gzeon](https://github.com/code-423n4/2022-03-maple-findings/issues/7), [CertoraInc](https://github.com/code-423n4/2022-03-maple-findings/issues/14), [berndartmueller](https://github.com/code-423n4/2022-03-maple-findings/issues/21), [cccz](https://github.com/code-423n4/2022-03-maple-findings/issues/13), and [robee](https://github.com/code-423n4/2022-03-maple-findings/issues/3)._

## [L-01] Treasury fees are given to the lender on failure, rather than reverting

```solidity
        if (!_sendFee(_mapleGlobals(), IMapleGlobalsLike.mapleTreasury.selector, treasuryFee_)) {
            _claimableFunds += treasuryFee_;
        }
```

[MapleLoanInternals.sol#L321-L323](https://github.com/maple-labs/loan/blob/4c6fe2cd91d6d16b8434c426fe7eb6d2bc77bc30/contracts/MapleLoanInternals.sol#L321-L323)

## [L-02] Inconsistent `approve()` behavior between `ERC20` and `RevenueDistributionToken`

`RevenueDistributionToken` considers an approval value of `type(uint256).max` as 'allow all amounts':

```solidity
if (callerAllowance == type(uint256).max) return;
```

[RevenueDistributionToken.sol#L279](https://github.com/maple-labs/revenue-distribution-token/blob/41a3e40bf8c109ff19b38b80fde300c44fd42a3d/contracts/RevenueDistributionToken.sol#L279)<br>

whereas `ERC20` considers it as a numerical amount:

```solidity
_approve(owner_, msg.sender, allowance[owner_][msg.sender] - amount_);
```

[ERC20.sol#L110](https://github.com/maple-labs/erc20/blob/10ccf4aa0b2d6914e3c2d32e454e4d106a99a4fd/contracts/ERC20.sol#L110)<br>

These inconsistences will likely lead to confusion at some point in the future.

## [L-03] Incorrect revert string in `setEndingPrincipal()`

```solidity
require(endingPrincipal_ <= _principal, "R:DP:ABOVE_CURRENT_PRINCIPAL");
```

[Refinancer.sol#L43](https://github.com/maple-labs/loan/blob/4c6fe2cd91d6d16b8434c426fe7eb6d2bc77bc30/contracts/Refinancer.sol#L43)<br>

It should be `"R:SEP:ABOVE_CURRENT_PRINCIPAL"`.

## [L-04] IERC20 should be named IERC20Permit

File: erc20-1.0.0-beta.2/contracts/interfaces/IERC20.sol (lines [4-5](https://github.com/maple-labs/erc20/blob/10ccf4aa0b2d6914e3c2d32e454e4d106a99a4fd/contracts/interfaces/IERC20.sol#L4-L5))<br>

There may be cases in the future where you may not want EIP-2612 functionality due to deployment costs, and having the name `IERC20` taken will cause problems.

```solidity
/// @title Interface of the ERC20 standard as defined in the EIP, including ERC-2612 permit functionality.
interface IERC20 {
```

## [L-05] IERC20 incorrectly includes `PERMIT_TYPEHASH`

`PERMIT_TYPEHASH` is not part of the requirements for EIP-2612, so it shouldn't appear in the interface.

```solidity
/**
    *  @dev    Returns the permit type hash.
    *  @return permitTypehash_ The permit type hash.
    */
function PERMIT_TYPEHASH() external view returns (bytes32 permitTypehash_);
```

[IERC20.sol#L134-L138](https://github.com/maple-labs/erc20/blob/10ccf4aa0b2d6914e3c2d32e454e4d106a99a4fd/contracts/interfaces/IERC20.sol#L134-L138)<br>
OpenZeppelin has it as a `private` `constant`: [OpenZeppelin/draft-ERC20Permit.sol#L28](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/52eeebecda140ebaf4ec8752ed119d8288287fac/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L28).

## [L-06] Missing checks for `address(0x0)` when assigning values to `address` state variables

File: revenue-distribution-token-1.0.0-beta.1/contracts/RevenueDistributionToken.sol (line [73](https://github.com/maple-labs/revenue-distribution-token/blob/41a3e40bf8c109ff19b38b80fde300c44fd42a3d/contracts/RevenueDistributionToken.sol#L73))<br>

```solidity
pendingOwner = pendingOwner_;
```

## [L-07] Open TODOs

There are many open TODOs throughout the various test files, but also some among the code files

    ./revenue-distribution-token-1.0.0-beta.1/contracts/RevenueDistributionToken.sol:    // TODO: Revisit returns
    ./revenue-distribution-token-1.0.0-beta.1/contracts/RevenueDistributionToken.sol:        // TODO: investigate whether leave this `require()` in for clarity from error message, or let the safe math check in `callerAllowance - shares_` handle the underflow.

## [L-08] Incorrect Natspec

```solidity
     *  @dev   Emits an event indicating that one account has set the allowance of another account over their tokens.
```

[IERC20.sol#L12](https://github.com/maple-labs/erc20/blob/10ccf4aa0b2d6914e3c2d32e454e4d106a99a4fd/contracts/interfaces/IERC20.sol#L12)<br>
The natspec doesn't mention that the event is also emitted when `transferFrom()` is called, even though the natspec for `transferFrom()` explicitly mentions it.

## [N-01] `_processEstablishmentFees()` should emit events when fee processing fails

```solidity
function _processEstablishmentFees(uint256 delegateFee_, uint256 treasuryFee_) internal {
    if (!_sendFee(_lender, ILenderLike.poolDelegate.selector, delegateFee_)) {
        _claimableFunds += delegateFee_;
    }

    if (!_sendFee(_mapleGlobals(), IMapleGlobalsLike.mapleTreasury.selector, treasuryFee_)) {
        _claimableFunds += treasuryFee_;
    }
}
```

[MapleLoanInternals.sol#L316-L324](https://github.com/maple-labs/loan/blob/4c6fe2cd91d6d16b8434c426fe7eb6d2bc77bc30/contracts/MapleLoanInternals.sol#L316-L324)

## [N-02] Multiple `address` mappings can be combined into a single `mapping` of an `address` to a `struct`, where appropriate

File: erc20-1.0.0-beta.2/contracts/ERC20.sol (lines [32-34](https://github.com/maple-labs/erc20/blob/10ccf4aa0b2d6914e3c2d32e454e4d106a99a4fd/contracts/ERC20.sol#L32-L34))<br>

```solidity
mapping(address => uint256) public override balanceOf;

mapping(address => mapping(address => uint256)) public override allowance;
```

## [N-03] Use scientific notation (e.g. `10e18`) rather than exponentiation (e.g. `10**18`)

File: loan-3.0.0-beta.1/contracts/MapleLoanInternals.sol (line [14](https://github.com/maple-labs/loan/blob/4c6fe2cd91d6d16b8434c426fe7eb6d2bc77bc30/contracts/MapleLoanInternals.sol#L14))<br>

```solidity
uint256 private constant SCALED_ONE = uint256(10 ** 18);
```

## [N-04] `public` functions not called by the contract should be declared `external` instead

Contracts [are allowed](https://docs.soliditylang.org/en/latest/contracts.html#function-overriding) to override their parents' functions and change the visibility from `external` to `public`.<br>

File: loan-3.0.0-beta.1/contracts/MapleLoanFactory.sol (lines [16-18](https://github.com/maple-labs/loan/blob/4c6fe2cd91d6d16b8434c426fe7eb6d2bc77bc30/contracts/MapleLoanFactory.sol#L16-L18))<br>

```solidity
function createInstance(bytes calldata arguments_, bytes32 salt_)
    override(IMapleProxyFactory, MapleProxyFactory) public returns (
        address instance_
```

## [N-05] Use a more recent version of solidity

Use a solidity version of at least 0.8.12 to get `string.concat()` to be used instead of `abi.encodePacked(<str>,<str>)`.<br>

File: erc20-1.0.0-beta.2/contracts/ERC20.sol (line [2](https://github.com/maple-labs/erc20/blob/10ccf4aa0b2d6914e3c2d32e454e4d106a99a4fd/contracts/ERC20.sol#L2))<br>

```solidity
pragma solidity ^0.8.7;
```

## [N-06] Typos

`owner` => `owner_`<br>
[IERC20.sol#L129](https://github.com/maple-labs/erc20/blob/10ccf4aa0b2d6914e3c2d32e454e4d106a99a4fd/contracts/interfaces/IERC20.sol#L129)<br>
[IERC20.sol#L132](https://github.com/maple-labs/erc20/blob/10ccf4aa0b2d6914e3c2d32e454e4d106a99a4fd/contracts/interfaces/IERC20.sol#L132)<br>
[Migrator.sol#L24](https://github.com/maple-labs/mpl-migration/blob/a99549d96ed12cd4589a02bccf70747dbaebeb5b/contracts/Migrator.sol#L24)<br>
[Migrator.sol#L26](https://github.com/maple-labs/mpl-migration/blob/a99549d96ed12cd4589a02bccf70747dbaebeb5b/contracts/Migrator.sol#L26)<br>
[Migrator.sol#L27](https://github.com/maple-labs/mpl-migration/blob/a99549d96ed12cd4589a02bccf70747dbaebeb5b/contracts/Migrator.sol#L27)<br>
[IOwnable.sol#L17](https://github.com/maple-labs/loan/blob/4c6fe2cd91d6d16b8434c426fe7eb6d2bc77bc30/contracts/interfaces/IOwnable.sol#L17)

`account` => `account_`<br>
[IOwnable.sol#L11](https://github.com/maple-labs/loan/blob/4c6fe2cd91d6d16b8434c426fe7eb6d2bc77bc30/contracts/interfaces/IOwnable.sol#L11)

`Emits an event` => `Emitted when`<br>
[IERC20.sol#L12](https://github.com/maple-labs/erc20/blob/10ccf4aa0b2d6914e3c2d32e454e4d106a99a4fd/contracts/interfaces/IERC20.sol#L12)<br>
[IERC20.sol#L20](https://github.com/maple-labs/erc20/blob/10ccf4aa0b2d6914e3c2d32e454e4d106a99a4fd/contracts/interfaces/IERC20.sol#L20)

`ERC-2612` => `EIP-2612`<br>
[IERC20.sol#L4](https://github.com/maple-labs/erc20/blob/10ccf4aa0b2d6914e3c2d32e454e4d106a99a4fd/contracts/interfaces/IERC20.sol#L4)

## [N-07] Grammar

Throughout the various interfaces, most of the comments have fragments that end with periods. They should either be converted to actual sentences with both a noun phrase and a verb phrase, or the periods should be removed.

**[lucas-manuel (Maple Finance) confirmed, but disagreed with severity and commented](https://github.com/code-423n4/2022-03-maple-findings/issues/17#issuecomment-1074465927):**
 > [L-01] Intentional<br>
> [L-02] We can address, informational<br>
> [L-03] We can address, informational<br>
> [L-04] We are always going to want `permit`, dismissed<br>
> [L-05] We would like to keep this public<br>
> [L-06] `pendingOwner` does not need a zero check as it is a two step process<br>
> [L-07] TODOs is duplicate<br>
> [L-08] Incorrect, Natspec only mentions events emitted in functions<br>
> [N-01] This will be monitored in tenderly, no event needed<br>
> [N-02] Won't implement this<br>
> [N-03] Won't implement this<br>
> [N-04] Has to match visibility of overriden function<br>
> [N-05] Won't implement<br>
> [N-06] Will implement typo changes<br>
> 
> All issues are informational.

**[JGcarv (Maple Finance) resolved](https://github.com/code-423n4/2022-03-maple-findings/issues/17#ref-pullrequest-1178190333):**
 > [Fix typos (maple-labs/erc20#36)](https://github.com/maple-labs/erc20/pull/36)<br>
 > [Fix typos (maple-labs/mpl-migration#13)](https://github.com/maple-labs/mpl-migration/pull/13)<br>
 > [Fix typos (maple-labs/loan#152)](https://github.com/maple-labs/loan/pull/152)<br>
 > [Fix revert message (maple-labs/loan#155)](https://github.com/maple-labs/loan/pull/155)



***

# Gas Optimizations

For this contest, 13 reports were submitted by wardens detailing gas optimizations. The [report highlighted below](https://github.com/code-423n4/2022-03-maple-findings/issues/31) by warden team **WatchPug** received the top score from the judge.

_The following wardens also submitted reports: [berndartmueller](https://github.com/code-423n4/2022-03-maple-findings/issues/20), [rayn](https://github.com/code-423n4/2022-03-maple-findings/issues/22), [Dravee](https://github.com/code-423n4/2022-03-maple-findings/issues/12), [robee](https://github.com/code-423n4/2022-03-maple-findings/issues/4), [IllIllI](https://github.com/code-423n4/2022-03-maple-findings/issues/18), [0xNazgul](https://github.com/code-423n4/2022-03-maple-findings/issues/34), [gzeon](https://github.com/code-423n4/2022-03-maple-findings/issues/6), [CertoraInc](https://github.com/code-423n4/2022-03-maple-findings/issues/15), [0xwags](https://github.com/code-423n4/2022-03-maple-findings/issues/38), [0xkatana](https://github.com/code-423n4/2022-03-maple-findings/issues/11), [Tomio](https://github.com/code-423n4/2022-03-maple-findings/issues/35), and [Funen](https://github.com/code-423n4/2022-03-maple-findings/issues/36)._

## [G-01] `ERC20.sol#transferFrom()` Do not reduce approval on transferFrom if current allowance is type(uint256).max

_Note: suggested optimation, save a decent amount of gas without compromising readability._

The Wrapped Ether (WETH) ERC-20 contract has a gas optimization that does not update the allowance if it is the max uint.

The latest version of OpenZeppelin's ERC20 token contract also adopted this optimization.

[ERC20.sol#L109-L113](https://github.com/maple-labs/erc20/blob/10ccf4aa0b2d6914e3c2d32e454e4d106a99a4fd/contracts/ERC20.sol#L109-L113)

```solidity
    function transferFrom(address owner_, address recipient_, uint256 amount_) external override returns (bool success_) {
        _approve(owner_, msg.sender, allowance[owner_][msg.sender] - amount_);
        _transfer(owner_, recipient_, amount_);
        return true;
    }
```

See:

*   [OpenZeppelin/ERC20.sol#L336](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC20/ERC20.sol#L336)
*   [OpenZeppelin/openzeppelin-contracts#3085](https://github.com/OpenZeppelin/openzeppelin-contracts/pull/3085)

### Recommended Mitigation Steps

Change to:

```solidity
    function transferFrom(address owner_, address recipient_, uint256 amount_) external override returns (bool success_) {
        uint256 currentAllowance = allowance[owner_][msg.sender];
        if (currentAllowance != type(uint256).max) {
            _approve(owner_, msg.sender, currentAllowance - amount_);
        }

        _transfer(owner_, recipient_, amount_);
        return true;
    }
```

## [G-02] Use immutable variables can save gas

_Note: suggested optimation, save a decent amount of gas without compromising readability._

[ERC20.sol#L25-L26](https://github.com/maple-labs/erc20/blob/10ccf4aa0b2d6914e3c2d32e454e4d106a99a4fd/contracts/ERC20.sol#L25-L26)

```solidity
    string public override name;
    string public override symbol;
```

[ERC20.sol#L50-L54](https://github.com/maple-labs/erc20/blob/10ccf4aa0b2d6914e3c2d32e454e4d106a99a4fd/contracts/ERC20.sol#L50-L54)

```solidity
    constructor(string memory name_, string memory symbol_, uint8 decimals_) {
        name     = name_;
        symbol   = symbol_;
        decimals = decimals_;
    }
```

In `ERC20.sol`, `name` and `symbol` will never change, use immutable variable instead of storage variable can save gas.

## [G-03] Validation can be done earlier to save gas

_Note: minor optimation, the amount of gas saved is minor, change when you see fit._

[ERC20.sol#L75-L102](https://github.com/maple-labs/erc20/blob/10ccf4aa0b2d6914e3c2d32e454e4d106a99a4fd/contracts/ERC20.sol#L75-L102)

```solidity
    function permit(address owner_, address spender_, uint256 amount_, uint256 deadline_, uint8 v_, bytes32 r_, bytes32 s_) external override {
        require(deadline_ >= block.timestamp, "ERC20:P:EXPIRED");

        // Appendix F in the Ethereum Yellow paper (https://ethereum.github.io/yellowpaper/paper.pdf), defines
        // the valid range for s in (301): 0 < s < secp256k1n ÷ 2 + 1, and for v in (302): v ∈ {27, 28}.
        require(
            uint256(s_) <= uint256(0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) &&
            (v_ == 27 || v_ == 28),
            "ERC20:P:MALLEABLE"
        );

        // Nonce realistically cannot overflow.
        unchecked {
            bytes32 digest = keccak256(
                abi.encodePacked(
                    "\x19\x01",
                    DOMAIN_SEPARATOR(),
                    keccak256(abi.encode(PERMIT_TYPEHASH, owner_, spender_, amount_, nonces[owner_]++, deadline_))
                )
            );

            address recoveredAddress = ecrecover(digest, v_, r_, s_);

            require(recoveredAddress == owner_ && owner_ != address(0), "ERC20:P:INVALID_SIGNATURE");
        }

        _approve(owner_, spender_, amount_);
    }
```

Check if `owner_ != address(0)` earlier can avoid unnecessary computing when this check failed.

### Recommended Mitigation Steps

Change to:

```solidity
    function permit(address owner_, address spender_, uint256 amount_, uint256 deadline_, uint8 v_, bytes32 r_, bytes32 s_) external override {
        require(deadline_ >= block.timestamp, "ERC20:P:EXPIRED");
        require(owner_ != address(0), "...");

        // Appendix F in the Ethereum Yellow paper (https://ethereum.github.io/yellowpaper/paper.pdf), defines
        // the valid range for s in (301): 0 < s < secp256k1n ÷ 2 + 1, and for v in (302): v ∈ {27, 28}.
        require(
            uint256(s_) <= uint256(0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) &&
            (v_ == 27 || v_ == 28),
            "ERC20:P:MALLEABLE"
        );

        // Nonce realistically cannot overflow.
        unchecked {
            bytes32 digest = keccak256(
                abi.encodePacked(
                    "\x19\x01",
                    DOMAIN_SEPARATOR(),
                    keccak256(abi.encode(PERMIT_TYPEHASH, owner_, spender_, amount_, nonces[owner_]++, deadline_))
                )
            );

            address recoveredAddress = ecrecover(digest, v_, r_, s_);

            require(recoveredAddress == owner_, "ERC20:P:INVALID_SIGNATURE");
        }

        _approve(owner_, spender_, amount_);
    }
```

**[lucas-manuel (Maple Finance) commented](https://github.com/code-423n4/2022-03-maple-findings/issues/31#issuecomment-1075715013):**
 > > **[G-01] `ERC20.sol#transferFrom()` Do not reduce approval on transferFrom if current allowance is type(uint256).max**<br>
> Less clean, not added
>
 > > **[G-02] Use immutable variables can save gas**<br>
> Valid, will add
>
 > > **[G-03] Validation can be done earlier to save gas**<br>
> Less clean, won't add
>
> Acknowledge G-01 and G-03.<br>
> Confirm G-02 is valid.



***

# Disclosures

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.
