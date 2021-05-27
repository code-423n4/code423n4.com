---
sponsor: "Based Loans"
slug: "2021-04-basedloans"
date: "2021-05-27"
title: "Based Loans"
findings: "https://github.com/code-423n4/2021-04-basedloans-findings/issues"
contest: 3
---

# Overview

## About C4

Code 432n4 (C4) is an open organization that consists of security researchers, auditors, developers, and individuals with domain expertise in the area of smart contracts.

A C4 code contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the code contest outlined in this document, C4 conducted an analysis of Marginswap’s smart contract system written in Solidity. The code contest took place between April 2 and April 7, 2021.

## Wardens

5 Wardens contributed reports to the Marginswap code contest:

- [cmichel](https://twitter.com/cmichelio)
- [gpersoon](https://twitter.com/gpersoon)
- [OxRajeev](https://twitter.com/0xRajeev)
- [Thunder](https://twitter.com/SolidityDev)
- [shw](https://twitter.com/x9453)
- [toastedsteaksandwich](https://twitter.com/AshiqAmien)

This contest was judged by [Cem](https://twitter.com/cemozer_).

Final report assembled by [_ninek_](https://twitter.com/ninek).

# Summary

The C4 analysis yielded an aggregated total of 31 unique vulnerabilities. All of the issues presented here are linked back to their original finding.

Of these vulnerabilities, 2 received a risk rating in the category of HIGH severity, 1 received a risk rating in the category of MEDIUM severity, and 13 received a risk rating in the category of LOW severity.

C4 analysis also identified an aggregate total of 15 non-critical recommendations.

# Scope

The code under review can be found within the [C4 code contest repository](https://github.com/code-423n4/2021-04-basedloans) and comprises 31 smart contracts written in the Solidity programming language.

# Severity Criteria

C4 assesses severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into 3 primary risk categories: high, medium, and low.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

- Malicious Input Handling
- Escalation of privileges
- Arithmetic
- Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code423n4.com).


# High Risk Findings

## [[H-01] UniswapConfig getters return wrong token config if token config does not exist](https://github.com/code-423n4/2021-04-basedloans-findings/issues/37)

The `UniswapConfig.getTokenConfigBySymbolHash` function does not work as `getSymbolHashIndex` returns `0` if there is no config token for that symbol (uninitialized map value), but the outer function implements the non-existence check with `-1`.

The same issue occurs also for:

- `getTokenConfigByCToken`
- `getTokenConfigByUnderlying`

When encountering a non-existent token config, it will always return the token config of the **first index** (index 0) which is a valid token config for a completely different token.
This leads to wrong oracle prices for the actual token which could in the worst case be used to borrow more tokens at a lower price or borrow more tokens by having a higher collateral value, essentially allowing undercollateralized loans that cannot be liquidated.

Fix the non-existence check.

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/37) duplicate- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/37) sponsor confirmed

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/37#issuecomment-835476066):**
 > Duplicate of #24 

**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/37#issuecomment-835514226):**
 > `UniswapConfig` has been refactored. Index 0 is considered a non-existent config and all comparison are against that value.


## [[H-02] uint(-1) index for not found](https://github.com/code-423n4/2021-04-basedloans-findings/issues/24)

#functions getTokenConfigBySymbolHash, getTokenConfigByCToken and getTokenConfigByUnderlying check returned index against max uint:
  index != uint(-1)
-1 should indicate that the index is not found, however, a default value for an uninitialized uint is 0, so it is impossible to get -1. What is even weirder is that 0 will be returned for non-existing configs but 0 is a valid index for the 1st config.

One of the solutions would be to reserve 0 for a not found index and use it when searching in mappings. Then normal indexes should start from 1. Another solution would be to introduce a new mapping with a boolean value that indicates if this index is initialized or not but this may be a more gas costly way.

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/24) sponsor confirmed

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/24#issuecomment-835514161):**
 > `UniswapConfig` has been refactored. Index 0 is considered a non-existent config and all comparison are against that value.

 
# Medium Risk Findings

## [[M-01] Reward rates can be changed through flash borrows](https://github.com/code-423n4/2021-04-basedloans-findings/issues/33)
undefinedVulnerability Details

The rewards per market are proportional to their `totalBorrows` which can be changed by a large holder who deposits lots of collateral, takes out a huge borrow in the market, updates the rewards, and then unwinds the position.
They'll only pay gas fees as the borrow / repay can happen in the same block.

The `Comptroller.refreshCompSpeeds` function only checks that the single transaction is called from an EOA, but miners (or anyone if a miner offers services like flash bundles for flashbots) can still run flash-loan-like attacks by first sending a borrow tx increasing the totalBorrows, then the `refreshCompSpeeds` transaction, and then the repay of the borrow, as miners have full control over the transaction order of the block.
The new rate will then persist until the next call to `refreshCompSpeeds`.

Attackers have an incentive to drive up the rewards in markets they are a large supplier/borrower in.
The increased rewards that the attacker receives are essentially stolen from other legitimate users.

Make it an admin-only function or use a time-weighted total borrow system similar to Uniswap's price oracles.

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/33) sponsor acknowledged

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/33#issuecomment-835539656):**
 > Restricting `Comptroller.refreshCompSpeeds` function to admin only would centralize an ability to update speeds. I think better solution is a bot that keeps track of markets utilizations and updates speeds when needed. That will also give a way to community to participate. 
> 
> Also, higher rewards would mean that all participants are getting them and that would bring even more liquidity to the given market and decrease attackers earnings. Attacker could keep moving the liquidity from market to market but everyone would follow quite quickly. If that actually happens, admin has a way to stop the rewards and make `refreshCompSpeeds` admin-only function as last resolution because comptroller is using proxy pattern.


 
# Low Risk Findings

## [[G-01] requireNoError can be optimized](https://github.com/code-423n4/2021-04-basedloans-findings/issues/4)

The function requireNoError of Cether.sol contains 2 checks on errCode == uint(Error.NO_ERROR).
After the first check it returns. After this errCode == uint(Error.NO_ERROR) will never be true, so doesn't have to be checked.

 function requireNoError(uint errCode, string memory message) internal pure {
        if (errCode == uint(Error.NO_ERROR)) {
            return;
        }
         ...
        require(errCode == uint(Error.NO_ERROR), string(fullMessage));

Replace require(errCode == uint(Error.NO_ERROR), string(fullMessage));
with require(false, string(fullMessage));

Note: Solidity 8.4 has new error handling functionality which could replace the logic of requireNoError 

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/4) sponsor acknowledged

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/4#issuecomment-832765987):**
 > It's added to our backlog. Thanks!


## [[L-01] No account existence check for low-level call in CEther.sol](https://github.com/code-423n4/2021-04-basedloans-findings/issues/16)

Low-level calls call/delegatecall/staticcall return true even if the account called is non-existent (per EVM design). Account existence must be checked prior to calling.

The doTransferOut() function was changed from using a transfer() function (which reverts) to a call() function (which returns a boolean), however there is no account existence check for the destination address to. If it doesn’t exist, for some reason, call will still return true (not throw an exception) and successfully pass the return value check on the next line.

The checked call paths don’t seem vulnerable because they use msg.sender/admin and not a user-controlled address, but this may be a risk if used later in other contexts. Hence rating as low-risk.

For reference, see this related high-risk severity finding from Trail of Bit’s audit of Hermez Network: https://github.com/trailofbits/publications/blob/master/reviews/hermez.pdf

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/CEther.sol#L145-L148

https://github.com/crytic/slither/wiki/Detector-Documentation#low-level-calls

https://docs.soliditylang.org/en/v0.8.4/control-structures.html#error-handling-assert-require-revert-and-exceptions

Check for account-existence before the call() to make this safely extendable to user-controlled address contexts in future.

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/16) sponsor confirmed

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/16#issuecomment-832762511):**
 > Recommended fix has been implemented.


## [[L-02] sweepToken() function removed in CErc20.sol from original Compound code](https://github.com/code-423n4/2021-04-basedloans-findings/issues/17)

The sweepToken() function in the original Compound code whose specified purpose was to recover accidentally sent ERC20 tokens to contract has been removed. 

The original code comment says: “A public function to sweep accidental ERC-20 transfers to this contract. Tokens are sent to admin (timelock).” This safety measure is helpful given the number/value of accidentally stuck tokens that are sent to contracts by mistake.

Tokens accidentally sent to this contract will be stuck leading to fund loss for sender.

https://github.com/compound-finance/compound-protocol/blob/b9b14038612d846b83f8a009a82c38974ff2dcfe/contracts/CErc20.sol#L112-L120

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/CErc20.sol#L109-L121

Retain this function unless there is a specific reason to remove it here.

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/17) sponsor confirmed

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/17#issuecomment-835528244):**
 > Fixed as recommended, thanks!


## [[L-03] All except one Comptroller verify functions do not verify anything in Comptroller.sol/CToken.sol](https://github.com/code-423n4/2021-04-basedloans-findings/issues/18)

Six of the seven Comptroller verify functions do nothing. Not sure why their calls in CToken.sol have been uncommented from the original Compound version.

Except redeemVerify(), six other verify functions transferVerify(), mintVerify(), borrowVerify(), repayBorrowVerify(), liquidateBorrowVerify() and seizeVerify() have no logic except accessing state variables to not be marked pure. Calls to these functions were commented out in the original Compound code’s CToken.sol but have been uncommented here.

Given that they do not implement any logic, the protocol should not be making any assumptions about any defence provided from their unimplemented verification logic.

Dummy functions whose comments say “// Shh - currently unused”:

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/Comptroller.sol#L263-L281

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/Comptroller.sol#L402-L418

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/Comptroller.sol#L450-L474

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/Comptroller.sol#L519-L546

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/Comptroller.sol#L584-L609

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/Comptroller.sol#L638-L656

Uncommented calls from modified code:

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/CToken.sol#L126

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/CToken.sol#L560

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/CToken.sol#L798

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/CToken.sol#L915

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/CToken.sol#L1019

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/CToken.sol#L1090

Commented calls from original Compound code:

https://github.com/compound-finance/compound-protocol/blob/b9b14038612d846b83f8a009a82c38974ff2dcfe/contracts/CToken.sol#L123-L124

https://github.com/compound-finance/compound-protocol/blob/b9b14038612d846b83f8a009a82c38974ff2dcfe/contracts/CToken.sol#L558-L559

https://github.com/compound-finance/compound-protocol/blob/b9b14038612d846b83f8a009a82c38974ff2dcfe/contracts/CToken.sol#L797-L798

https://github.com/compound-finance/compound-protocol/blob/b9b14038612d846b83f8a009a82c38974ff2dcfe/contracts/CToken.sol#L915-L916

https://github.com/compound-finance/compound-protocol/blob/b9b14038612d846b83f8a009a82c38974ff2dcfe/contracts/CToken.sol#L1020-L1021

https://github.com/compound-finance/compound-protocol/blob/b9b14038612d846b83f8a009a82c38974ff2dcfe/contracts/CToken.sol#L1092-L1093i th

Add logic to implement verification if that is indeed assumed to be implemented but is actually not. Otherwise, comment call sites.


### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/18) sponsor confirmed

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/18#issuecomment-834649529):**
 > Fixed by commenting unused functions.


## [[L-04] Floating pragma used in Uniswap*.sol](https://github.com/code-423n4/2021-04-basedloans-findings/issues/19)

Contracts should be deployed using the same compiler version/flags with which they have been tested. Locking the floating pragma, i.e. by not using ^ in pragma solidity ^0.6.10, ensures that contracts do not accidentally get deployed using an older compiler version with unfixed bugs.

For reference, see https://swcregistry.io/docs/SWC-103

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/UniswapOracle/UniswapAnchoredView.sol#L3

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/UniswapOracle/UniswapConfig.sol#L3

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/UniswapOracle/UniswapLib.sol#L3

Remove ^ in “pragma solidity ^0.6.10” and change it to “pragma solidity 0.6.12” to be consistent with the rest of the contracts.


### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/19) sponsor confirmed

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/19#issuecomment-834911660):**
 > Fixed as recommended.


## [[L-05] Missing input validation may set COMP token to zero-address in Comptroller.sol](https://github.com/code-423n4/2021-04-basedloans-findings/issues/20)

Function _setCompAddress() is used by admin to change the COMP token address. However, there is no zero-address validation on the parameter. This may accidentally set COMP token address to zero-address but it can be reset by the admin. Any interim transactions might hit exceptional behavior. 

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/Comptroller.sol#L1350-L1357

Add zero-address check to _comp parameter of _setCompAddress().

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/20) 0 (Non-critical)- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/20) disagree with severity- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/20) duplicate- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/20) sponsor acknowledged

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/20#issuecomment-835426656):**
 > Duplicate of #14 


## [[L-06] Missing zero/threshold check for maxAssets](https://github.com/code-423n4/2021-04-basedloans-findings/issues/21)

A zero or some minimum threshold check is missing for newMaxAssets parameter of _setMaxAssets() function which is used by admin to set the maximum number of assets that controls how many markets can be entered. 

If accidentally set to 0 then all users cannot enter any market which will significantly affect protocol operations.

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/Comptroller.sol#L954-L971

Add zero/threshold check to newMaxAssets parameter.

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/21) 0 (Non-critical)- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/21) disagree with severity- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/21) sponsor acknowledged

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/21#issuecomment-835430888):**
 > Added to backlog, however, it's a non-critical issue.

**[cemozerr commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/21#issuecomment-839390697):**
 > Rating this as low risk as it could pose a situation where users can not enter any markets.


## [[L-07] Usage of `address.transfer`](https://github.com/code-423n4/2021-04-basedloans-findings/issues/31)
The `transfer` function is used in `Maximillion.sol` to send ETH to an account.

It is performed with a fixed amount of GAS and might fail if GAS costs change in the future or if a smart contract's fallback function handler is complex.

Consider using the lower-level `.call{value: value}` instead and checking its success return value.

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/31) sponsor confirmed

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/31#issuecomment-833664536):**
 > `Maximillion.sol` is not being used and will be deleted.


## [[L-08]  Unbounded iteration on `refreshCompSpeedsInternal`](https://github.com/code-423n4/2021-04-basedloans-findings/issues/32)

The `Comptroller.refreshCompSpeedsInternal` function iterates over all markets and does expensive computations like updating all borrower / supply indices.

When the total number of markets is high, this iteration could exceed the total block gas amount breaking the functionality and making it impossible to update the reward distribution speed.

Keep the number of markets low and/or adjust the function to be processable in several transactions.

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/32) 0 (Non-critical)- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/32) disagree with severity- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/32) sponsor acknowledged- [cemozerr labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/32) 1 (Low Risk)

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/32#issuecomment-835439739):**
 > While true, estimated gas to update speed for 50 markets is `3377184` gas. Current block gas limit is `14,999,986`, that means we could in theory, get away with updating as many as 222 markets. This is definitely something to keep in mind along the way, however, in my opinion it's a non-critical issue, low at most.

**[cemozerr commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/32#issuecomment-839399355):**
 > I will rate this as low risk, as it won't be an issue until there are many markets, and does not pose a major risk to user funds.


## [[L-09] uint[] memory parameter is tricky](https://github.com/code-423n4/2021-04-basedloans-findings/issues/12)

Using memory array parameters (e.g. uint[] memory) as function parameters can be tricky in Solidity, because an attack is possible with a very large array which will overlap with other parts of the memory. See proof of concept below.

The function "propose" of GovernorAlpha.sol seems most vulnerable because this function does not check the validity of the array lengths.

Most other functions do a loop over the array, which will fail with a large array (due to out of gas).

The following functions use a [] memory parameter. 
.\Comptroller.sol:    function enterMarkets(address[] memory cTokens) public override returns (uint[] memory) {
.\Comptroller.sol:    function claimComp(address holder, CToken[] memory cTokens) public {
.\Comptroller.sol:    function claimComp(address[] memory holders, CToken[] memory cTokens, bool borrowers, bool suppliers) public {
.\Comptroller.sol:    function _addCompMarkets(address[] memory cTokens) public {
.\Governance\GovernorAlpha.sol:    function propose(address[] memory targets, uint[] memory values, string[] memory signatures, bytes[] memory calldatas, string memory description) public returns (uint) {
.\UniswapOracle\UniswapAnchoredView.sol:    function addTokens(TokenConfig[] memory configs) public onlyOwner {
.\UniswapOracle\UniswapConfig.sol:    function _addTokensInternal(TokenConfig[] memory configs) internal {
   

This an example to show the exploit:
// based on https://github.com/paradigm-operations/paradigm-ctf-2021/blob/master/swap/private/Exploit.sol
pragma solidity ^0.4.24; // only works with low solidity version

contract test{
    struct Overlap {
        uint field0;
    }
    event log(uint);

  function mint(uint[] memory amounts) public  returns (uint) {   // this can be in any solidity version
       Overlap memory v;
       v.field0 = 1234;
       emit log(amounts[0]); // would expect to be 0 however is 1234
       return 1;
     }
            
  function go() public { // this part requires the low solidity version
      uint x=0x800000000000000000000000000000000000000000000000000000000000000; // 2^251
      bytes memory payload = abi.encodeWithSelector(this.mint.selector, 0x20, x);
      bool success=address(this).call(payload);
  }
}    

Add checks on the size of the array parameters to make sure they are not absurdly long.

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/12) sponsor acknowledged

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/12#issuecomment-834696134):**
 > As mentioned, this applies to either admin functions or ones that are using a loop. The `propose` function is used by governance so its outcome will be tested on forked network before voting. I don't see an immediate threat from this solidity bug but we'll keep it in mind.


## [[L-10] CarefulMath / safe math not allways used](https://github.com/code-423n4/2021-04-basedloans-findings/issues/6)

#CarefulMath is used in most calculations, however it isn't always used.
Although I didn't spot any real issues with this it isn't consistent.


.\Governance\Blo.sol:        return nCheckpoints > 0 ? checkpoints[account][nCheckpoints - 1].votes : 0;
.\Governance\Blo.sol:        if (checkpoints[account][nCheckpoints - 1].fromBlock <= blockNumber) {
.\Governance\Blo.sol:            return checkpoints[account][nCheckpoints - 1].votes;
.\Governance\Blo.sol:        uint32 upper = nCheckpoints - 1;
.\Governance\Blo.sol:                upper = center - 1;
.\Governance\Blo.sol:                uint96 srcRepOld = srcRepNum > 0 ? checkpoints[srcRep][srcRepNum - 1].votes : 0;
.\Governance\Blo.sol:                uint96 dstRepOld = dstRepNum > 0 ? checkpoints[dstRep][dstRepNum - 1].votes : 0;
.\Governance\Blo.sol:      if (nCheckpoints > 0 && checkpoints[delegatee][nCheckpoints - 1].fromBlock == blockNumber) {
.\Governance\Blo.sol:          checkpoints[delegatee][nCheckpoints - 1].votes = newVotes;
.\CToken.sol:        totalReservesNew = totalReserves - reduceAmount;
.\UniswapOracle\UniswapAnchoredView.sol:            uint timeElapsed = block.timestamp - newObservation.timestamp;
.\UniswapOracle\UniswapAnchoredView.sol:        uint timeElapsed = block.timestamp - oldTimestamp;
.\UniswapOracle\UniswapAnchoredView.sol:        FixedPoint.uq112x112 memory priceAverage = FixedPoint.uq112x112(uint224((nowCumulativePrice - oldCumulativePrice) / timeElapsed));
.\UniswapOracle\UniswapAnchoredView.sol:        uint timeElapsed = block.timestamp - newObservation.timestamp;
.\CEther.sol:        fullMessage[i+2] = byte(uint8(48 + ( errCode / 10 )));
.\CEther.sol:        fullMessage[i+3] = byte(uint8(48 + ( errCode % 10 )));
.\DAIInterestRateModelV3.sol:        gapPerBlock = 4e16 / blocksPerYear;
.\DAIInterestRateModelV3.sol:        gapPerBlock = gapPerYear / blocksPerYear;
.\UniswapOracle\UniswapAnchoredView.sol:            return mul(usdPerEth, config.fixedPrice) / ethBaseUnit;
.\UniswapOracle\UniswapAnchoredView.sol:            return mul(usdPerEth, config.fixedPrice) / ethBaseUnit;
.\UniswapOracle\UniswapAnchoredView.sol:            price = mul(usdPerEth, config.fixedPrice) / ethBaseUnit;
.\UniswapOracle\UniswapAnchoredView.sol:        return mul(1e30, price) / config.baseUnit;
.\UniswapOracle\UniswapAnchoredView.sol:        return mul(1e30, priceInternal(config)) / config.baseUnit;
.\UniswapOracle\UniswapAnchoredView.sol:        FixedPoint.uq112x112 memory priceAverage = FixedPoint.uq112x112(uint224((nowCumulativePrice - oldCumulativePrice) / timeElapsed));
.\UniswapOracle\UniswapAnchoredView.sol:        anchorPrice = mul(unscaledPriceMantissa, config.baseUnit) / ethBaseUnit / expScale;
.\UniswapOracle\UniswapLib.sol:        return uq112x112((uint224(numerator) << 112) / denominator);
.\UniswapOracle\UniswapLib.sol:        return uint(self._x) / 5192296858534827;
.\UniswapOracle\UniswapLib.sol:        return uint32(block.timestamp % 2 ** 32);
.\UniswapOracle\UniswapLib.sol:       uint32 timeElapsed = blockTimestamp - blockTimestampLast;
.\UniswapOracle\UniswapLib.sol:             price0Cumulative += uint(FixedPoint.fraction(reserve1, reserve0)._x) * timeElapsed;
.\UniswapOracle\UniswapLib.sol:             price1Cumulative += uint(FixedPoint.fraction(reserve0, reserve1)._x) * timeElapsed;

Double check to see if safe math functions really are not necessary and otherwise add a comment


### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/6) 0 (Non-critical)- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/6) disagree with severity- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/6) sponsor acknowledged

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/6#issuecomment-834908151):**
 > Agreed, however, in my opinion it's a non-critical issue.

**[cemozerr commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/6#issuecomment-839431704):**
 > I will rate this as low risk instead of non-critical because although the warden here might not have spotted any real issues, unless CarefulMath / SafeMath is not always used, there might be hidden underflow/overflow bugs.


## [[L-11] Use 'receive' when expecting eth and empty call data](https://github.com/code-423n4/2021-04-basedloans-findings/issues/25)

#contract CEther fallback function was refactored to be compatible with the Solidity 0.6 version:

  /**
   * @notice Send Ether to CEther to mint
   */
  fallback () external payable {
      (uint err,) = mintInternal(msg.value);
      requireNoError(err, "mint failed");
  }

From Solidity 0.6 documentation:

"The unnamed function commonly referred to as “fallback function” was split up into a new fallback function that is defined using the fallback keyword and a receive ether function defined using the receive keyword. If present, the receive ether function is called whenever the call data is empty (whether or not ether is received). This function is implicitly payable. The new fallback function is called when no other function matches (if the receive ether function does not exist then this includes calls with empty call data). You can make this function payable or not. If it is not payable then transactions not matching any other function which send value will revert. You should only need to implement the new fallback function if you are following an upgrade or proxy pattern."

I think in this case "receive" is more suitable as the function is expecting to receive ether and empty call data.

Replace "fallback" with "receive".


### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/25) sponsor confirmed

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/25#issuecomment-835426150):**
 > Fixed as recommended


## [[L-12] Allow borrowCap to be filled fully](https://github.com/code-423n4/2021-04-basedloans-findings/issues/28)

#Here the condition should be '<=', not '<' to allow filling the cap fully:
   require(nextTotalBorrows < borrowCap, "market borrow cap reached");

require(nextTotalBorrows <= borrowCap, "market borrow cap reached");

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/28) sponsor acknowledged- [cemozerr labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/28) 0 (Non-critical)- [cemozerr labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/28) 1 (Low Risk)

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/28#issuecomment-833665556):**
 > Added to backlog.


 
# Non-Critical Findings

## [[N-01] Outdated Compiler](https://github.com/code-423n4/2021-04-basedloans-findings/issues/15)

The project is using Solidity compiler version 0.6.12 which was released in July 2020, while the latest compiler version is 0.8.4. Using such an older version makes the project susceptible to any compiler bugs fixed or dangerous features deprecated since then, and also prevents it from leveraging the newly introduced features.

It may be recognized that this is harder for this project because it is making modifications to an existing older project (Compound) which uses compiler version 0.5.x.


https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/CEther.sol#L3

https://github.com/ethereum/solidity/releases/tag/v0.6.12

https://github.com/ethereum/solidity/releases/tag/v0.7.6

Given Solidity’s fast release cycle, consider using a more recent version of the compiler, such as version 0.7.6. 

Given that the project is already going from original Compound’s 0.5.x to 0.6.x, it may as well go to 0.7.x version. This may involve a few more breaking changes for changing from 0.6.x to 0.7.x, but there don’t seem to be that many language-level breaking features (see https://github.com/ethereum/solidity/releases/tag/v0.7.0)


### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/15) sponsor acknowledged- [cemozerr labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/15) 0 (Non-critical)- [cemozerr labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/15) disagree with severity

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/15#issuecomment-833652816):**
 > Using latest solidity version is best practice. However, upgrading to 0.7.x or 0.8.x requires significant refactoring and any braking changes in solidity could potentially introduce bugs. Also, upgrading at this stage of the project would delay launch further and may require another audit.

**[cemozerr commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/15#issuecomment-838997641):**
 > I'm changing the severity of the issue to non-significant as Based Loans is a fork of Compound codebase, and there are no compiler-related bugs in Compound codebase AFAIK.


## [[N-02] Missed NatSpec @param for newly introduced parameter distributeAll](https://github.com/code-423n4/2021-04-basedloans-findings/issues/22)

The distributeSupplierComp() function has been modified to take in a third parameter which is a boolean distributeAll. But the corresponding NatSpec comments for the function have not been updated to add this new parameter. This could lead to minor confusion where NatSpec is consulted.

https://github.com/code-423n4/2021-04-basedloans/blob/5c8bb51a3fdc334ea0a68fd069be092123212020/code/contracts/Comptroller.sol#L1238-L1243

Add @param for distributeAll parameter.

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/22) sponsor confirmed

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/22#issuecomment-832829878):**
 > Fixed as recommended.


## [[N-02] Privileged roles](https://github.com/code-423n4/2021-04-basedloans-findings/issues/35)

Admins can change the `comp=blo` address using `_setCompAddress` and stop pending payouts using `_dropCompMarket`.

The allotted rewards of the users may not be paid out anymore due to admins changing the reward token (`comp`) address.
Privileged admin roles make the protocol less predictable for users leading to hesitance and lost opportunity costs when 

Only set the `comp/blo` address if it has not been set already. 

Distribute the rewards up to now before cancelling rewards using `_dropCompMarket`.

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/35) sponsor disputed- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/35) disagree with severity- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/35) sponsor acknowledged- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/35) 0 (Non-critical)

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/35#issuecomment-832725953):**
 > This is technically correct, however, having a context that admin role is only temporary and will be moved to governance in the near future, I don't consider this as an issue. Especially that `Comptroller` is using a proxy pattern so admin can always change the implementation at will. I consider this a non-critical issue.

**[cemozerr commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/35#issuecomment-839425430):**
 > I'm rating this a non-critical issue, as the `Comptroller` using a proxy pattern would make this change redundant.


## [[N-03] `UniswapAnchoredView`'s `PriceUpdated` event is never fired](https://github.com/code-423n4/2021-04-basedloans-findings/issues/38)

`UniswapAnchoredView`'s `PriceUpdated` event is never fired.

Unused code can hint at programming or architectural errors.

Use it or remove it.

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/38) duplicate- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/38) disagree with severity- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/38) 0 (Non-critical)- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/38) sponsor confirmed

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/38#issuecomment-832754037):**
 > Duplicate of #23 non-critical

**[cemozerr commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/38#issuecomment-839428972):**
 > I'm rating this as non-critical as an unused event has no drawbacks.


## [[N-04] Multiple error enums with overlapping values](https://github.com/code-423n4/2021-04-basedloans-findings/issues/1)

There are 3 error enums, which have overlapping values. This allows for mistakes with error codes and might make troubleshooting of deployed code more difficult.
I couldn't find any mistakes in the current code; but changes in the future might introduce mistakes.

ErrorReporter.sol:
contract ComptrollerErrorReporter {
    enum Error {
        NO_ERROR,
        UNAUTHORIZED,
        COMPTROLLER_MISMATCH,

contract TokenErrorReporter {
    enum Error {
        NO_ERROR,
        UNAUTHORIZED,
        BAD_INPUT,

CarefulMath.sol
contract CarefulMath {
    enum MathError {
        NO_ERROR,
        DIVISION_BY_ZERO,

Insert dummy values in the enums to make sure all equivalent numeric values are different.

Take care that the same enum values still have the same underlying value to prevent new mistakes.

You could for example do the following:
ComptrollerErrorReporter  NO_ERROR = 0
ComptrollerErrorReporter  UNAUTHORIZED = 1
ComptrollerErrorReporter  COMPTROLLER_MISMATCH = 2
TokenErrorReporter        NO_ERROR = 0
TokenErrorReporter        UNAUTHORIZED = 1
TokenErrorReporter        BAD_INPUT = 102
CarefulMath.sol           NO_ERROR = 0
CarefulMath.sol           DIVISION_BY_ZERO = 201

Note: In a few occasions there is a reliance on the fact that NO_ERROR = 0; i'll make a seperate issue for this

Note this might break compatibility with Compound and/or other deployed code.

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/1) sponsor acknowledged

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/1#issuecomment-833645714):**
 > This is for sure confusing and should be refactored. However, it has very low priority so I'm going to add it to the backlog.


## [[N-05] now is still used](https://github.com/code-423n4/2021-04-basedloans-findings/issues/10)

Most of the time block.timestamp is used, however in 1 location now is still used.
The global variable now is deprecated in solidity 7: 
https://docs.soliditylang.org/en/v0.7.0/070-breaking-changes.html#changes-to-the-syntax

.\Governance\Blo.sol:        require(now <= expiry, "Comp::delegateBySig: signature expired");

Replace now with block.timestamp

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/10) sponsor acknowledged

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/10#issuecomment-832829309):**
 > Added to backlog for later refactoring, thanks!


## [[N-06] Reliance on the fact that NO_ERROR = 0](https://github.com/code-423n4/2021-04-basedloans-findings/issues/2)

In several occasions it's relied upon that the error value NO_ERROR is equivalent to 0.

I haven't seen any real problems with this. However in most locations there is an explicit check for NO_ERROR and comparing with 0 allows for possible future mistakes (especially if the enums would change).

CToken.sol:   
function transferTokens(
     ...
     if (allowed != 0) {

function mintFresh(
     ...
     if (allowed != 0) {

function redeemFresh(
      ...
      if (allowed != 0) {

function borrowFresh(
      ...
      if (allowed != 0) {

function repayBorrowFresh(
      ...
      if (allowed != 0) {

function liquidateBorrowFresh(
      ...
      if (allowed != 0) {

function seizeInternal(
      ...
      if (allowed != 0) {

Comptroller.sol:
function exitMarket(
     ...
     if (allowed != 0) {
     ...
     require(oErr == 0, "exitMarket: getAccountSnapshot failed"); // semi-opaque error code

function getHypotheticalAccountLiquidityInternal(
    ...
    if (oErr != 0) { // semi-opaque error code, we assume NO_ERROR == 0 is invariant between upgrades

Replace 0 with the appropriate version of ...NO_ERROR

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/2) sponsor acknowledged

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/2#issuecomment-833644248):**
 > Added to backlog.


## [[N-07] Alphabetical order not complied with (contrary to the comments)](https://github.com/code-423n4/2021-04-basedloans-findings/issues/3)

The enum FailureInfo in ErrorReporter.sol has a comment that the values are sorted in alphabetical order.
However they are not in alphabetical  order

ErrorReporter.sol:
 enum FailureInfo {
        ACCEPT_ADMIN_PENDING_ADMIN_CHECK,
        ...
        BORROW_ACCUMULATED_BALANCE_CALCULATION_FAILED,
        ...
        TRANSFER_TOO_MUCH,
        ADD_RESERVES_ACCRUE_INTEREST_FAILED,
        ADD_RESERVES_FRESH_CHECK,
        ADD_RESERVES_TRANSFER_IN_NOT_POSSIBLE
    }

Sort the enum values in alphabetical order or remove the comment.


### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/3) sponsor acknowledged

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/3#issuecomment-833643409):**
 > Added to backlog, thanks!


## [[N-08] requireNoError not used in a consistent way](https://github.com/code-423n4/2021-04-basedloans-findings/issues/5)

Cether.sol has a function requireNoError to check for errors. This is used most of the time, however in one occasion it isn't used.

    function getCashPrior() internal view returns (uint) {
        (MathError err, uint startingBalance) = subUInt(address(this).balance, msg.value);
        require(err == MathError.NO_ERROR);
        return startingBalance;
    }

Replace require(err == MathError.NO_ERROR);

with:

requireNoError(err, "getCashPrior failed");

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/5) sponsor acknowledged

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/5#issuecomment-833646776):**
 > Technically, the code works but I agree that consistency should be kept. Added to backlog.


## [[N-09] uint(-1)](https://github.com/code-423n4/2021-04-basedloans-findings/issues/7)

In several occasions constructions like uint(-1) and uint96(-1) are used the reference the maximum values of uint and uint96.

This relies on the peculiarities of numbers.

Solidity also allows the following constructions:
  type(uint).max;
  type(uint96).max;

.\CToken.sol:            startingAllowance = uint(-1);
.\CToken.sol:        if (startingAllowance != uint(-1)) {
.\CToken.sol:        if (repayAmount == uint(-1)) {
.\CToken.sol:        if (repayAmount == uint(-1)) {
.\Governance\Blo.sol:        if (rawAmount == uint(-1)) {
.\Governance\Blo.sol:            amount = uint96(-1);
.\Governance\Blo.sol:        if (spender != src && spenderAllowance != uint96(-1)) {
.\UniswapOracle\UniswapConfig.sol:        if (index != uint(-1)) {
.\UniswapOracle\UniswapConfig.sol:        if (index != uint(-1)) {
.\UniswapOracle\UniswapConfig.sol:        if (index != uint(-1)) {

Replace uint(-1) with type(uint).max

Replace uint96(-1) with type(uint96).max

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/7) sponsor acknowledged

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/7#issuecomment-832828693):**
 > Added to backlog for later refactoring, thanks!


## [[N-10] More readable constants](https://github.com/code-423n4/2021-04-basedloans-findings/issues/8)

Some constant values are difficult to read in one time because they have at lot of 0's.
Solidity allows _ to separate series of zero's

.\Governance\Blo.sol:    uint public constant totalSupply = 100000000e18; // 100 million BLO
.\Governance\GovernorAlpha.sol:    function quorumVotes() public pure returns (uint) { return 4000000e18; } // 4,000,000 = 4% of BLO
.\Governance\GovernorAlpha.sol:    function proposalThreshold() public pure returns (uint) { return 1000000e18; } // 1,000,000 = 1% of BLO

Replace   1000000e18 with    1_000_000e18 

Replace   4000000e18 with    4_000_000e18 

Replace 100000000e18 with  100_000_000e18 


### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/8) sponsor confirmed

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/8#issuecomment-833640933):**
 > Fixed as recommended


## [[N-11] function getUnderlyingPrice compares against "cETH"](https://github.com/code-423n4/2021-04-basedloans-findings/issues/26)

Contract CompoundLens functions cTokenMetadata and cTokenBalances compare against "bETH" while contract SimplePriceOracle function getUnderlyingPrice compares against "cETH". It is not clear if this SimplePriceOracle will be used in production, probably only for testing, but still would be nice to unify it across all the contracts.

Replace "cETH" with "bETH" in SimplePriceOracle function getUnderlyingPrice.

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/26) sponsor confirmed

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/26#issuecomment-832787817):**
 > This is not meant to be used on production, however, this contract is confusing and would not work if used so it was deleted. Thanks for pointing it out!


## [[N-12] Use 'interface' keyword for interfaces](https://github.com/code-423n4/2021-04-basedloans-findings/issues/27)

Interfaces are declared as contracts. For example, ComptrollerInterface name indicates that it should be an interface but it is declared as a contract. Solidity has a keyword "interface" that can be used here.

Declare interfaces with 'interface' keyword.

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/27) sponsor acknowledged

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/27#issuecomment-832778900):**
 > Added to backlog, thanks!


## [[N-13] [Info] functions 'getUnderlyingPriceView' and 'price' are too similar](https://github.com/code-423n4/2021-04-basedloans-findings/issues/29)

Not a bug, just FYI: 

function getUnderlyingPriceView is too similar to function price. I think it would be better to avoid code duplication by extracting common code and using it where necessary. Less code duplication makes it easier to maintain it and improves readability.

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/29) sponsor acknowledged
### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/29#issuecomment-832766933):**
 > It's added to our backlog for refactoring, thanks!


## [[N-14] Requires a non-zero address check when deploying `CErc20` tokens and `CEther`.](https://github.com/code-423n4/2021-04-basedloans-findings/issues/39)

During the deployment of the contracts `CErc20` and `CErc20Immutable`, both input parameters `underlying_` and `ComptrollerInterface` lack a non-zero address check. In `CEther`, the `ComptrollerInterface` is not required to be non-zero either. If any of them were provided as `0` accidentally, there is no way to change the values, and the contract should be redeployed.

Referenced code:
[CErc20.sol#L23-L36](https://github.com/code-423n4/2021-04-basedloans/blob/main/code/contracts/CErc20.sol#L23-L36)
[CErc20Immutable.sol#L24-L41](https://github.com/code-423n4/2021-04-basedloans/blob/main/code/contracts/CErc20Immutable.sol#L24-L41)
[CEther.sol#L23-L37](https://github.com/code-423n4/2021-04-basedloans/blob/main/code/contracts/CEther.sol#L23-L37)
[CToken.sol#L28-L59](https://github.com/code-423n4/2021-04-basedloans/blob/main/code/contracts/CToken.sol#L28-L59)
[CToken.sol#L1154-L1171](https://github.com/code-423n4/2021-04-basedloans/blob/main/code/contracts/CToken.sol#L1154-L1171)

Add non-zero address checks in the constructor of the `CErc20`, `CErc20Immutable`, and `CEther` contracts.


### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/39) 0 (Non-critical)- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/39) disagree with severity- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/39) sponsor acknowledged

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/39#issuecomment-835427401):**
 > It's definitely a good practice to require non-zero address, however, it's not a threat. Severity should be 0.
> 
> Added to backlog, thanks!

**[cemozerr commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/39#issuecomment-839440805):**
 > Both the impact and the likelihood of this bug is low, so rating this as non-critical.


## [[N-15] Missing event visbility in _setCompAddress() function](https://github.com/code-423n4/2021-04-basedloans-findings/issues/13)

The _setCompAddress() function in the Comptroller contract does not emit an event when changing the comp address. While this does not impose any security risk, it does hinder a users ability to view any changes made to the comp address through the contract's lifetime. 

Affected line:
https://github.com/code-423n4/2021-04-basedloans/blob/main/code/contracts/Comptroller.sol#L1354

It is recommended to emit an event indicating the old comp address, and the new comp address to be used when calling the _setCompAddress() function. An example of such an event is `event NewCompAddress(address oldCompAddress, address newCompAddress)`.

### Log:
- [ghoul-sol labeled](https://github.com/code-423n4/2021-04-basedloans-findings/issues/13) sponsor confirmed

### Comments:
**[ghoul-sol commented](https://github.com/code-423n4/2021-04-basedloans-findings/issues/13#issuecomment-832835787):**
 > Fixed as recommended.
