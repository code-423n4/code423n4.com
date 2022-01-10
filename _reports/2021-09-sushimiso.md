---
sponsor: "Sushi" 
slug: "2021-09-sushimiso" 
date: "2021-11-05"  
title: "Sushi Miso contest" 
findings: "https://github.com/code-423n4/2021-09-sushimiso-findings" 
contest: 28 
---

# Overview

## About C4

Code 432n4 (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 code contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the code contest outlined in this document, C4 conducted an analysis of the Sushi Miso contest smart contract system written in Solidity. The code contest took place between September 9—September 15 2021.

## Wardens

11 Wardens contributed reports to the Sushi Miso contest code contest:

- [WatchPug](https://twitter.com/WatchPug_)
- [0xRajeev](https://twitter.com/0xRajeev)
- [cmichel](https://twitter.com/cmichelio)
- [gpersoon](https://twitter.com/gpersoon)
- [JMukesh](https://twitter.com/MukeshJ_eth)
- [leastwood](https://twitter.com/liam_eastwood13)
- [hrkrshnn](https://twitter.com/_hrkrshnn)
- [pauliax](https://twitter.com/SolidityDev)
- [itsmeSTYJ](https://twitter.com/itsmeSTYJ)
- [loop](https://twitter.com/loop_225)

This contest was judged by [ghoul.sol](https://twitter.com/ghoulsol).

Final report assembled by [itsmetechjay](https://twitter.com/itsmetechjay) and [CloudEllie](https://twitter.com/CloudEllie1).

# Summary

The C4 analysis yielded an aggregated total of 25 unique vulnerabilities and 101 total findings.  All of the issues presented here are linked back to their original finding.

Of these vulnerabilities, 3 received a risk rating in the category of HIGH severity, 1 received a risk rating in the category of MEDIUM severity, and 21 received a risk rating in the category of LOW severity.

C4 analysis also identified 47 non-critical recommendations and 29 gas optimizations.

# Scope

The code under review can be found within the [C4 Sushi Miso contest repository](https://github.com/code-423n4/2021-09-sushimiso) and is composed of 106 smart contracts written in the Solidity programming language, and includes 4,040 lines of Solidity code.

# Severity Criteria

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

- Malicious Input Handling
- Escalation of privileges
- Arithmetic
- Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code423n4.com).


# High Risk Findings (3)
## [[H-01] `PostAuctionLauncher.sol#finalize()` Adding liquidity to an existing pool may allows the attacker to steal most of the tokens](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/14)
_Submitted by WatchPug, also found by 0xRajeev and cmichel._

`PostAuctionLauncher.finalize()` can be called by anyone, and it sends tokens directly to the pair pool to mint liquidity, even when the pair pool exists.

An attacker may control the LP price by creating the pool and then call `finalize()` to mint LP token with unfair price (pay huge amounts of tokens and get few amounts of LP token), and then remove the initial liquidity they acquired when creating the pool and take out huge amounts of tokens.

<https://github.com/sushiswap/miso/blob/2cdb1486a55ded55c81898b7be8811cb68cfda9e/contracts/Liquidity/PostAuctionLauncher.sol#L257>

```solidity=216
/**
 * @notice Finalizes Token sale and launches LP.
 * @return liquidity Number of LPs.
 */
function finalize() external nonReentrant returns (uint256 liquidity) {
    // GP: Can we remove admin, let anyone can finalise and launch?
    // require(hasAdminRole(msg.sender) || hasOperatorRole(msg.sender), "PostAuction: Sender must be operator");
    require(marketConnected(), "PostAuction: Auction must have this launcher address set as the destination wallet");
    require(!launcherInfo.launched);

    if (!market.finalized()) {
        market.finalize();
    }
    require(market.finalized());

    launcherInfo.launched = true;
    if (!market.auctionSuccessful() ) {
        return 0;
    }

    /// @dev if the auction is settled in weth, wrap any contract balance 
    uint256 launcherBalance = address(this).balance;
    if (launcherBalance > 0 ) {
        IWETH(weth).deposit{value : launcherBalance}();
    }
    
    (uint256 token1Amount, uint256 token2Amount) =  getTokenAmounts();

    /// @dev cannot start a liquidity pool with no tokens on either side
    if (token1Amount == 0 || token2Amount == 0 ) {
        return 0;
    }

    address pair = factory.getPair(address(token1), address(token2));
    if(pair == address(0)) {
        createPool();
    }

    /// @dev add liquidity to pool via the pair directly
    _safeTransfer(address(token1), tokenPair, token1Amount);
    _safeTransfer(address(token2), tokenPair, token2Amount);
    liquidity = IUniswapV2Pair(tokenPair).mint(address(this));
    launcherInfo.liquidityAdded = BoringMath.to128(uint256(launcherInfo.liquidityAdded).add(liquidity));

    /// @dev if unlock time not yet set, add it.
    if (launcherInfo.unlock == 0 ) {
        launcherInfo.unlock = BoringMath.to64(block.timestamp + uint256(launcherInfo.locktime));
    }
    emit LiquidityAdded(liquidity);
}
```

In line 257, `PostAuctionLauncher` will mint LP with `token1Amount` and `token2Amount`. The amounts (`token1Amount` and `token2Amount`) are computed according to the auction result, without considering the current price (reserves) of the existing `tokenPair`.

See [PostAuctionLauncher.getTokenAmounts()](https://github.com/sushiswap/miso/blob/2cdb1486a55ded55c81898b7be8811cb68cfda9e/contracts/Liquidity/PostAuctionLauncher.sol#L268)

`PostAuctionLauncher` will receive an unfairly low amount of lp token because the amounts sent to `tokenPair` didn't match the current price of the pair.

See [UniswapV2Pair.mint(...)](https://github.com/sushiswap/miso/blob/2cdb1486a55ded55c81898b7be8811cb68cfda9e/contracts/UniswapV2/UniswapV2Pair.sol#L135)

```solidity=135
liquidity = MathUniswap.min(amount0.mul(_totalSupply) / _reserve0, amount1.mul(_totalSupply) / _reserve1);
```

#### Impact

Lose a majority share of the tokens.

#### Proof of Concept

1.  The attacker creates LP with 0.0000001 token1 and 1000 token2, receives 0.01 LP token;
2.  Call `PostAuctionLauncher.finalize()`. PostAuctionLauncher will mint liquidity with 2000 token1 and 1000 token2 for example, receives only  0.01 LP token;
3.  The attacker removes all his LP, receives 1000 token1 (most of which come from `PostAuctionLauncher`).

#### Recommended Mitigation Steps

To only support tokenPair created by `PostAuctionLauncher` or check for the token price before mint liquidity.

**[Clearwood (Sushi Miso) confirmed and patched](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/14#issuecomment-934641852):**
 > https://github.com/sushiswap/miso/pull/21



## [[H-02] SushiToken transfers are broken due to wrong delegates accounting on transfers](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/117)
_Submitted by cmichel_.

When minting / transferring / burning tokens, the `SushiToken._beforeTokenTransfer` function is called and supposed to correctly shift the voting power due to the increase/decrease in tokens for the `from` and `to` accounts.
However, it does not correctly do that, it tries to shift the votes from the `from` account, instead of the **`_delegates[from]`** account.
This can lead to transfers reverting.

#### Proof Of Concept

Imagine the following transactions on the `SushiToken` contract.
We'll illustrate the corresponding `_moveDelegates` calls and written checkpoints for each.

*   `mint(A, 1000) = transfer(0, A, 1000)` => ` _moveDelegates(0, delegates[A]=0)  ` => no checkpoints are written to anyone because delegatees are still zero
*   A delegates to A' => `_moveDelegates(0, A')` => `writeCheckpoint(A', 1000)`
*   B delegates to B' => no checkpoints are written as B has a zero balance
*   `transfer(A, B, 1000)` => `_moveDelegates(A, delegates[B] = B')` => underflows when subtracting `amount=1000` from A's non-existent checkpoint (defaults to 0 votes)

It should subtract from A's delegatee `A'`'s checkpoint instead.

#### Impact

Users that delegated votes will be unable to transfer any of their tokens.

#### Recommended Mitigation Steps

In `SushiToken._beforeTokenTransfer`, change the `_moveDelegates` call to be from `_delegates[from]` instead:

```solidity
function _beforeTokenTransfer(address from, address to, uint256 amount) internal override { 
    _moveDelegates(_delegates[from], _delegates[to], amount);
    super._beforeTokenTransfer(from, to, amount);
}
```

This is also how the [original code from Compound](https://github.com/compound-finance/compound-protocol/blob/master/contracts/Governance/Comp.sol#L241) does it.

**[maxsam4 (Sushi Miso) acknowledged](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/117#issuecomment-920570459):**
 > This is a known issue in Sushi token but was kept unchanged in MISO for "preservation of history :)". That was not necessarily a wise choice lol. I think 1 severity should be fine for this as this was an intentional thing. The delegate feature is not supposed to be used in these tokens. We might create a new token type with this bug fixed.

**[ghoul-sol (judge) commented](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/117#issuecomment-934637612):**
 > We have crazy wallets on the blockchain that will call every possible function available to them and that's why I'm keeping this as is. Even intentional, the issue stands so the warden should get credit for it.



## [[H-03] Last person to withdraw his tokens might not be able to do this, in Crowdsale (edge case)](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/15)
_Submitted by gpersoon_.

#### Impact

Suppose a Crowdsale is successful and enough commitments are made before the `marketInfo.endTime`.
Suppose marketStatus.commitmentsTotal  == marketInfo.totalTokens -1      // note this is an edge case, but can be constructed by an attacker
Then the function `auctionEnded()` returns true
Assume `auctionSuccessful()` is also true (might depend on the config of `marketPrice.goal` and `marketInfo.totalTokens`)
Then an admin can call `finalize()` to finalize the Crowdsale.
The function finalize distributes the funds and the unsold tokens and sets `status.finalized = true` so that finalized cannot be called again.
Now we have "marketInfo.totalTokens -1" tokens left in the contract

However `commitEth()` or `commitTokens()` can still be called (they give no error message that the auction has ended)
Then functions call `calculateCommitment`, which luckily prevent from buying too much, however 1 token can still be bought
These functions also call `\_addCommitment()`, which only checks for `marketInfo.endTime`, which hasn't passed yet.

Now an extra token is sold and the contract has 1 token short. So the last person to withdraw his tokens cannot withdraw them (because you cannot specify how much you want to withdraw)

Also the revenues for the last token cannot be retrieved as `finalize()` cannot be called again.

#### Proof of Concept

<https://github.com/sushiswap/miso/blob/master/contracts/Auctions/Crowdsale.sol#L374>

```JS
 function finalize() public nonReentrant {
        require(hasAdminRole(msg.sender) || wallet == msg.sender || hasSmartContractRole(msg.sender) || finalizeTimeExpired(),"Crowdsale: sender must be an admin"); // can be called by admin
        MarketStatus storage status = marketStatus;
        require(!status.finalized, "Crowdsale: already finalized");
        MarketInfo storage info = marketInfo;
        require(auctionEnded(), "Crowdsale: Has not finished yet");    // is true if enough sold, even if this is before marketInfo.endTime

        if (auctionSuccessful()) {          
            /// @dev Transfer contributed tokens to wallet.
            /// @dev Transfer unsold tokens to wallet.
        } else {
            /// @dev Return auction tokens back to wallet.
        }
        status.finalized = true;

function auctionEnded() public view returns (bool) {
        return block.timestamp > uint256(marketInfo.endTime) || 
        _getTokenAmount(uint256(marketStatus.commitmentsTotal) + 1) >= uint256(marketInfo.totalTokens); // is true if enough sold, even if this is before marketInfo.endTime
    }

function auctionSuccessful() public view returns (bool) {
        return uint256(marketStatus.commitmentsTotal) >= uint256(marketPrice.goal);
}

function commitEth(address payable _beneficiary, bool readAndAgreedToMarketParticipationAgreement ) public payable nonReentrant  {
       ...
        uint256 ethToTransfer = calculateCommitment(msg.value);
       ...
       _addCommitment(_beneficiary, ethToTransfer);
   
 function calculateCommitment(uint256 _commitment) public view returns (uint256 committed) { // this prevents buying too much
        uint256 tokens = _getTokenAmount(_commitment);
        uint256 tokensCommited =_getTokenAmount(uint256(marketStatus.commitmentsTotal));
        if ( tokensCommited.add(tokens) > uint256(marketInfo.totalTokens)) {
            return _getTokenPrice(uint256(marketInfo.totalTokens).sub(tokensCommited));
        }
        return _commitment;
    }

function _addCommitment(address _addr, uint256 _commitment) internal {
        require(block.timestamp >= uint256(marketInfo.startTime) && block.timestamp <= uint256(marketInfo.endTime), "Crowdsale: outside auction hours"); // doesn't check auctionEnded() nor status.finalized
        ...
        uint256 newCommitment = commitments[_addr].add(_commitment);
        ...
        commitments[_addr] = newCommitment;

function withdrawTokens(address payable beneficiary) public   nonReentrant  {    
        if (auctionSuccessful()) {
            ...
            uint256 tokensToClaim = tokensClaimable(beneficiary);
            ...
            claimed[beneficiary] = claimed[beneficiary].add(tokensToClaim);
            _safeTokenPayment(auctionToken, beneficiary, tokensToClaim);    // will fail is last token is missing
        } else {



## Tools Used

## Recommended Mitigation Steps
In the function _addCommitment, add a check on auctionEnded() or status.finalized
```

**[Clearwood (Sushi Miso) confirmed and patched](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/15#issuecomment-934641167):**
 > https://github.com/sushiswap/miso/pull/20



 
# Medium Risk Findings (1)
## [[M-01] use of transfer() instead of call()  to send eth](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/87)
_Submitted by JMukesh_.

#### Impact

Use of `transfer()` might render ETH impossible to withdraw because after istanbul hardfork, there is an increase in the gas cost of the SLOAD operation and therefore breaks some existing smart contracts.Those contracts will break because their fallback functions used to consume less than 2300 gas, and they’ll now consume more, since 2300 the amount of gas a contract’s fallback function receives if it’s called via Solidity’s `transfer()` or `send()` methods.
Any smart contract that uses `transfer()` or `send()` is taking a hard dependency on gas costs by forwarding a fixed amount of gas: 2300.

- <https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/>

- <https://blog.openzeppelin.com/opyn-gamma-protocol-audit/>

#### Proof of Concept

- <https://github.com/sushiswap/miso/blob/2cdb1486a55ded55c81898b7be8811cb68cfda9e/contracts/MISOTokenFactory.sol#L242>

- <https://github.com/sushiswap/miso/blob/2cdb1486a55ded55c81898b7be8811cb68cfda9e/contracts/MISOMarket.sol#L256>

- <https://github.com/sushiswap/miso/blob/2cdb1486a55ded55c81898b7be8811cb68cfda9e/contracts/MISOLauncher.sol#L251>

- <https://github.com/sushiswap/miso/blob/2cdb1486a55ded55c81898b7be8811cb68cfda9e/contracts/MISOFarmFactory.sol#L244>

#### Tools Used

manual review

#### Recommended Mitigation Steps

use `call()` to send eth

**[maxsam4 (Sushi Miso) disputed and commented](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/87#issuecomment-920589153):**
 > This is intentional, not a risk. The contract does not want to give any gas stipend to the destination.
> 
> Even if the user messes up, `misoDev` address can be changed to a proper address later.

**[ghoul-sol (judge) commented](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/87#issuecomment-934654221):**
 > using `.transfer` can make ETH transfer to a smart contract impossible. User can always change the address however I agree with warden that this is an issue.



 
# Low Risk Findings (21)
- [[L-01] Outdated and Vulnerable `TimelockController.sol` Contract](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/24)
_Submitted by leastwood, also found by JMukesh_.
- [[L-02] Frontrunning Initialization of Contracts](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/19)
_Submitted by leastwood_.
- [[L-03] Event parameters interchanged for emit of access control template addition](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/73)
_Submitted by 0xRajeev_.
- [[L-04] `TokenVault` incorrectly tracks `userIndex`](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/114)
_Submitted by cmichel_.
- [[L-05] funds will get lost in deployAccessControl if devaddr isn't set](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/23)
_Submitted by gpersoon_.
- [[L-06] An adversarial attacker can initialize ListFactory](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/137)
_Submitted by hrkrshnn_.
- [[L-07] The first escrow index underflows](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/110)
_Submitted by pauliax_.
- [[L-08] MISORecipe01 uses outdated interfaces](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/116)
_Submitted by pauliax_.
- [[L-09] Certain view functions should be used only by UI and not by the code](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/142)
- [[L-10] Front-running cancelAuction can prevent auction cancellation](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/43)
_Submitted by 0xRajeev_.
- [[L-11] Usage of address.transfer](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/96)
_Submitted by cmichel, also found by 0xRajeev.
- [[L-12] deployMarket may revert due to integer underflow from missing threshold check](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/61)
_Submitted by 0xRajeev_.
- [[L-13] Init functions are susceptible to front-running](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/64)
_Submitted by 0xRajeev_.
- [[L-14] Loss of price precision](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/108)
_Submitted by cmichel, also found by itsmeSTYJ and leastwood_.
- [[L-15] `MISOMasterChef` may not be used with fee-on-transfer tokens](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/94)
_Submitted by cmichel_.
- [[L-16] No ERC20 safe* versions called in MisoRecipe](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/97)
_Submitted by cmichel_.
- [[L-17] No ERC20 `safeApprove` versions called](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/99)
_Submitted by cmichel_.
- [[L-18] finalize() can be succesfully called before initMarket()](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/16)
_Submitted by gpersoon_.
- [[L-19] `currentTemplateId` is Not Actively Removed by `MISOLauncher.removeLiquidityLauncherTemplate()`](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/32)
_Submitted by leastwood_.
- [[L-20] lockTokens should validate withdrawer](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/92)
_Submitted by pauliax_.
- [[L-21] Payable external init is redundant and may allow unaccounted token claims or DoS](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/53)
_Submitted by 0xRajeev_.


 
# Non-Critical Findings (47)
- [[N-01] Missing useful isOpen() function could save gas](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/59)
_Submitted by 0xRajeev_.
- [[N-02] Inaccurate Function Name `enableList()`](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/149)
_Submitted by leastwood_.
- [[N-03] Unused imports](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/120)
_Submitted by pauliax_.
- [[N-04] Missing zero-address check on beneficiary may lead to loss of funds](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/41)
_Submitted by 0xRajeev_.
- [[N-05] Single-step wallet address change is risky](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/52)
_Submitted by 0xRajeev_.
- [[N-06] Same LP token can be added more than once to affect reward calculations](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/76)
_Submitted by 0xRajeev_.
- [[N-07] excessive eth is not transfered back to the deployer if msg.value is greater than minimum fees ](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/86)
_Submitted by JMukesh_.
- [[N-08] Lack of Factory Contract for `TokenList.sol`](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/35)
_Submitted by leastwood_.
- [[N-09] Tokens without 18 decimals are unhandled](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/38)
_Submitted by 0xRajeev_.
- [[N-10] Critical withdrawTokens function is missing an event](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/44)
_Submitted by 0xRajeev_.
- [[N-11] Missing zero-address checks](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/45)
_Submitted by 0xRajeev_.
- [[N-12] Missing Events on State Changing Functions](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/31)
_Submitted by leastwood, also found by pauliax and 0xRajeev_.
- [[N-13] Missing contract existence check may cause silent failures of token transfers](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/63)
_Submitted by 0xRajeev_.
- [[N-14] Relying on setters for initialisation of critical parameters is risky](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/70)
_Submitted by 0xRajeev_.
- [[N-15] Lack of indexed event parameters will affect offchain monitoring](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/71)
_Submitted by 0xRajeev_.
- [[N-16] Unused event may be unused code or indicative of missed emit/logic](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/72)
_Submitted by 0xRajeev_.
- [[N-17] Lack of Input Validation](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/29)
_Submitted by leastwood, also found by 0xRajeev, cmichel, and JMukesh_.
- [[N-18] TokenInitialized token parameter is always empty](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/106)
_Submitted by pauliax, also found by 0xRajeev_.
- [[N-19] Unconventional use of basis points for integratorFeePct could cause undefined behavior](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/78)
_Submitted by 0xRajeev_.
- [[N-20] Old Solidity compiler version](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/79)
_Submitted by 0xRajeev_.
- [[N-21] `AccessControlTemplateRemoved` event not used](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/100)
_Submitted by cmichel_.
- [[N-22] Should `TokenList` implement `IPointList`?](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/101)
_Submitted by cmichel_.
- [[N-23] Use constant named variable for auction decimals](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/103)
_Submitted by cmichel_.
- [[N-24] `HyperbolicAuction.initAuction` 's `_factor` argument is never used](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/109)
_Submitted by cmichel_.
- [[N-25] `MISOMasterChef.setDevPercentage` should be capped](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/111)
_Submitted by cmichel_.
- [[N-26] Commitments can happen after already finalized](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/115)
_Submitted by cmichel_.
- [[N-27] Unused event `StrategyCvxHelper.HarvestState`](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/93)
_Submitted by cmichel_.
- [[N-28] Requiring a decimals method for ERC-20 tokens is non-standard](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/136)
_Submitted by hrkrshnn_.
- [[N-29] Teams should be warned not to accept rebasing tokens as payment currencies](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/11)
_Submitted by itsmeSTYJ_.
- [[N-30] Divide Before Multiply](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/30)
_Submitted by leastwood_.
- [[N-31] `_safeApprove()` is Not Used Instead of `approve()`](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/33)
_Submitted by leastwood_.
- [[N-32] Unchecked `fundsCommitted` in Token Withdrawal](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/74)
_Submitted by leastwood_.
- [[N-33] PostAuctionLauncher _deposit require condition contradicts error message](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/13)
_Submitted by loop_.
- [[N-34] _addCommitment should check that address is not empty](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/128)
_Submitted by pauliax_.
- [[N-35] Consider using a solidity version >= 0.8.0](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/138)
- [[N-36] Add input validation on some methods](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/141)
- [[N-37] Use a struct for raw data.](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/143)
- [[N-38] use of floating pragma](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/91)
_Submitted by JMukesh_.
- [[N-39] comment copy paste error](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/21)
_Submitted by gpersoon, also found by itsmeSTYJ, leastwood, and loop_.
- [[N-40] Typo in comment in PointList.sol](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/10)
_Submitted by itsmeSTYJ_.
- [[N-41] Improper Boolean Comparison](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/144)
_Submitted by leastwood_.
- [[N-42] Missing `uint256` Cast](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/148)
_Submitted by leastwood_.
- [[N-43] Inconsistent Template Deletion](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/151)
_Submitted by leastwood_.
- [[N-44] Missing SPDX Identifier](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/26)
_Submitted by leastwood_.
- [[N-45] Inclusive checks](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/113)
_Submitted by pauliax_.
- [[N-46] Style issues](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/130)
_Submitted by pauliax_.
- [[N-47] getTokenTemplate should check boundaries](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/98)
_Submitted by pauliax_.


 
# Gas Optimizations (29)
- [[G-01] Slot packing saves slots but increases runtime gas consumption due to masking](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/36)
_Submitted by 0xRajeev_.
- [[G-02] Caching state variables in local/memory variables avoids SLOADs to save gas](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/42)
_Submitted by 0xRajeev_.
- [[G-03] Avoiding initialization of loop index can save a little gas](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/60)
_Submitted by 0xRajeev_.
- [[G-04] Check for zero msg.value can save gas](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/62)
_Submitted by 0xRajeev_.
- [[G-05] Using function parameters in emits saves gas](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/65)
_Submitted by 0xRajeev_.
- [[G-06] Avoiding unnecessary external call will save > 2600 gas](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/66)
_Submitted by 0xRajeev_.
- [[G-07] Unnecessary zero check on variable which is never initialized earlier](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/68)
_Submitted by 0xRajeev_.
- [[G-08] unused local variable](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/90)
_Submitted by JMukesh_.
- [[G-09] Gas: Cache auction prices](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/105)
_Submitted by cmichel, also found by leastwood_.
- [[G-10] Gas:  Remove nonce from parameter list](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/107)
_Submitted by cmichel_.
- [[G-11] gas improvement in isInList ](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/17)
_Submitted by gpersoon_.
- [[G-12] Upgrade to at least 0.8.4](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/131)
_Submitted by hrkrshnn_.
- [[G-13] ## Caching the length in for loops](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/132)
_Submitted by hrkrshnn_.
- [[G-14]  Use `calldata` instead of `memory` for function parameters](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/133)
_Submitted by hrkrshnn_.
- [[G-15] Consider having short revert strings](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/134)
_Submitted by hrkrshnn_.
- [[G-16] Caching `totalPoints` during `setPoints` method](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/135)
_Submitted by hrkrshnn_.
- [[G-17] Redundant _newAddress parameter for deprecateFactory](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/4)
_Submitted by itsmeSTYJ_.
- [[G-18] Unnecessary addition in finalize() function](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/5)
_Submitted by itsmeSTYJ_.
- [[G-19] Redundant liquidityAdded check](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/6)
_Submitted by itsmeSTYJ_.
- [[G-20] Lack of `Immutable` Keyword](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/81)
_Submitted by leastwood_.
- [[G-21] Consolidation of Storage Slots](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/84)
_Submitted by leastwood_.
- [[G-22] cancelAuction function is public, but not called internally](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/2)
_Submitted by loop_.
- [[G-23] Require statement in PostAuctionLauncher finalize() function will never be reached.](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/25)
_Submitted by loop_.
- [[G-24] Separate minter roles are not really necessary](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/118)
_Submitted by pauliax_.
- [[G-25] Useless initialization to default value](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/122)
_Submitted by pauliax_.
- [[G-26] Dead code](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/123)
_Submitted by pauliax_.
- [[G-27] allDepositIds is pretty much useless](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/125)
_Submitted by pauliax_.
- [[G-28] Pack structs tightly](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/126)
_Submitted by pauliax_.
- [[G-29] _startTime is always < 10000000000 when _endTime < 10000000000 (_endTime > _startTime)](https://github.com/code-423n4/2021-09-sushimiso-findings/issues/127)
_Submitted by pauliax_.


# Disclosures

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.
