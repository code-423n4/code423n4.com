---
sponsor: "Canto"
slug: "2022-06-canto-v2"
date: "2022-10-18"
title: "Canto v2 contest"
findings: "https://github.com/code-423n4/2022-06-canto-v2-findings/issues"
contest: 141
---

# Overview

## About C4

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the Canto v2 smart contract system written in Solidity. The audit contest took place between June 28—July 2 2022.

*Note: this audit contest originally ran under the name `New Blockchain v2`.*

## Wardens

51 Wardens contributed reports to the Canto v2 contest:

  1. [Picodes](https://twitter.com/thePicodes)
  1. 0x1f8b
  1. ladboy233
  1. &#95;&#95;141345&#95;&#95;
  1. Lambda
  1. Critical
  1. [Chom](https://chom.dev)
  1. cccz
  1. [defsec](https://twitter.com/defsec_)
  1. [csanuragjain](https://twitter.com/csanuragjain)
  1. 0x52
  1. [TomJ](https://mobile.twitter.com/tomj_bb)
  1. [rfa](https://www.instagram.com/riyan_rfa/)
  1. [Funen](https://instagram.com/vanensurya)
  1. Bnke0x0
  1. 0x29A (0x4non and rotcivegaf)
  1. [c3phas](https://twitter.com/c3ph_)
  1. [fatherOfBlocks](https://twitter.com/father0fBl0cks)
  1. Soosh
  1. [ynnad](https://twitter.com/ynnadt1)
  1. [grGred](https://github.com/grGred)
  1. [mrpathfindr](https://veranos.io)
  1. [Sm4rty](https://twitter.com/Sm4rty_)
  1. slywaters
  1. [ignacio](https://twitter.com/0xheynacho)
  1. sach1r0
  1. samruna
  1. [0v3rf10w](https://twitter.com/_0v3rf10w)
  1. asutorufos
  1. [m&#95;Rassska](https://t.me/Road220)
  1. Waze
  1. [0xArshia](https://github.com/0xarshia)
  1. ajtra
  1. [durianSausage](https://github.com/lyciumlee)
  1. [Fitraldys](https://twitter.com/fitraldys)
  1. Noah3o6
  1. RedOneN
  1. [Rohan16](https://twitter.com/ROHANJH56009256)
  1. zzzitron
  1. [oyc&#95;109](https://twitter.com/andyfeili)
  1. AlleyCat
  1. Meera
  1. [0xKitsune](https://github.com/0xKitsune)
  1. TerrierLover
  1. [JC](https://twitter.com/sm4rtcontr4ct)
  1. hake
  1. aysha
  1. Limbooo
  1. [Tomio](https://twitter.com/meidhiwirara)
  1. cRat1st0s

This contest was judged by [Alex the Entreprenerd](https://twitter.com/GalloDaSballo).

Final report assembled by [liveactionllama](https://twitter.com/liveactionllama).

# Summary

The C4 analysis yielded an aggregated total of 14 unique vulnerabilities. Of these vulnerabilities, 8 received a risk rating in the category of HIGH severity and 6 received a risk rating in the category of MEDIUM severity.

Additionally, C4 analysis included 34 reports detailing issues with a risk rating of LOW severity or non-critical. There were also 34 reports recommending gas optimizations.

All of the issues presented here are linked back to their original finding.

# Scope

The code under review can be found within the [C4 Canto v2 contest repository](https://github.com/code-423n4/2022-06-canto-v2), and is composed of 15 smart contracts written in the Solidity programming language and includes 2,459 lines of Solidity code. One Cosmos SDK blockchain is also included.

# Severity Criteria

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low/non-critical.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

- Malicious Input Handling
- Escalation of privileges
- Arithmetic
- Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code4rena.com).

# High Risk Findings (8)
## [[H-01] Total supply can be incorrect in `ERC20`](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/88)
_Submitted by Picodes_

<https://github.com/Plex-Engineer/lending-market-v2/blob/ea5840de72eab58bec837bb51986ac73712fcfde/contracts/ERC20.sol#L33>
<https://github.com/Plex-Engineer/lending-market/blob/ab31a612be354e252d72faead63d86b844172761/contracts/ERC20.sol#L95>

`_totalSupply` can be initialized to something different than 0, which would lead to an inaccurate total supply, and could easily break integrations, computations of market cap, etc.

### Proof of Concept

If the constructor is called with \_initialSupply = 1000, the `totalSupply` will be initialized to 1000.

As all the others computations are correct, there will be for ever a discrepancy of 1000 between the real total supply and the one of the contract.

### Recommended Mitigation Steps

Remove `_initialSupply`.

**[nivasan1 (Canto) acknowledged](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/88)**

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/88#issuecomment-1214474058):**
 > Same bug as from Canto V1.
> Recommend the sponsor to just set to 0 and remove the assignment from the constructor
>
 > See: https://github.com/code-423n4/2022-06-canto-findings/issues/108

**Please note: the following additional discussions took place after judging and awarding were finalized. As such, this report will leave this finding in its originally assessed risk category as it simply reflects a snapshot in time.**

**[shung (warden) commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/88#issuecomment-1236024995):**
 > In the provided contracts, v2 repo is included: https://github.com/code-423n4/2022-06-canto-v2
> 
> However, in this submission, the second line of code provided links to the v1 repo. The described issue only exists in v1 version. In v2 version the issue does not exist because msg.sender balance is updated along with the total supply: https://github.com/Plex-Engineer/lending-market-v2/blob/ea5840de72eab58bec837bb51986ac73712fcfde/contracts/ERC20.sol#L34
> 
> Therefore this finding seems invalid.

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/88#issuecomment-1236132294):**
 > @shung - You're right, I must have missed the line with the mitigation.
> 
> The current code will update the `_totalSupply` and will give the balance to the deployer.
> 
> This is a mistake on my part and the finding should have been closed as invalid as it was mitigated in the V2 code in scope.

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/88#issuecomment-1236133140):**
 > While a nitpick I'd recommend changing the code to use `_mint` as it the code in scope will not emit an event which may cause issues if you're tracking via theGraph or similar.
> 
> Either way I made a mistake here, sorry about that.



***

## [[H-02] Deny of service in `CNote.doTransferOut`](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/43)
_Submitted by 0x1f8b, also found by Lambda_

<https://github.dev/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/CNote.sol#L148><br>

The `CNote.doTransferOut` method is susceptible to denial of service.

### Proof of Concept

The logic of the `doTransferOut` method in `CNote` is as follows:

```javascript
    function doTransferOut(address payable to, uint amount) virtual override internal {
        require(address(_accountant) != address(0));
        EIP20Interface token = EIP20Interface(underlying);
        if (to != address(_accountant)) {
            uint err = _accountant.supplyMarket(amount);
            if (err != 0) { revert AccountantRedeemError(amount); }
        }   
        token.transfer(to, amount);
        bool success;
        assembly {
            switch returndatasize()
                case 0 { success := not(0) }
                case 32 { 
                    returndatacopy(0, 0, 32)
                    success := mload(0)
                }
                default { revert(0, 0) }
        } 
        require(success, "TOKEN_TRANSFER_OUT_FAILED");
        require(token.balanceOf(address(this)) == 0, "cNote::doTransferOut: TransferOut Failed"); // <-- ERROR
    }
```

The `doTransferOut` method receives an `amount` which is transferred to `to`, after it the balance of the contract token is checked to be equal to zero or the transaction will be reverted.

In the following cases a denial of service will occur:

*   In the case that is used an `amount` different than the balance, the transaction will be reverted.
*   **In the case that an attacker front-runs the transaction and sends one token more than the established by the `_accountant`.**
*   In case of increasing balance tokens like `mDai` that constantly change their balance, the established by the `_accountant` will be different when the transaction is persisted.

### Recommended Mitigation Steps

*   Use balance differences instead of the 0 check.

**[nivasan1 (Canto) confirmed](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/43)**

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/43#issuecomment-1216823120):**
 > The warden has shown how, anyone, via a simple transfer of `underlying` can deny the functionality of `doTransferOut`.
> 
> Because the function is used in multiple functions inherited from `CToken`, and the griefing can be easily run by anyone, I believe High Severity to be appropriate.



***

## [[H-03] Underlying asset price oracle for `CToken` in `BaseV1-periphery` is inaccurate](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/134)
_Submitted by ladboy233_

<https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/Stableswap/BaseV1-periphery.sol#L489><br>

Underlying asset price oracle for CToken in BaseV1-periphery is inaccurate.

### Proof of Concept

        function getUnderlyingPrice(CToken ctoken) external override view returns(uint price) {
            IBaseV1Pair pair;
            uint8 stable;
            bool stablePair;
            address underlying;

            if (compareStrings(ctoken.symbol(), "cCANTO")) {
                stable = 0;
                underlying = address(wcanto);
            } 
            //set price statically to 1 when the Comptroller is retrieving Price
            else if (compareStrings(ctoken.symbol(), "cNOTE") && msg.sender == Comptroller) {
                return 1; // Note price is fixed to 1
            }

We should not be return 1. 1 is 1 wei. We should be 10 &ast;&ast; 18

### Tools Used

VIM

#### Recommended Mitigation Steps

We can return 10 &ast;&ast; 18

**[nivasan1 (Canto) confirmed](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/134)**

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/134#issuecomment-1216832609):**
 > The warden has shown what probably is a developer mistake, which will scale down the price of the cNOTE token to 1.
> 
> The sponsor confirms.
> 
> It should be noted that if cNOTE always returns 1e18 then the math for [`diff`](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/NoteInterest.sol#L147-L148) will always be zero, meaning the interest will exclusively be dictated by `baseRatePerYear`.
> 
> Because the sponsor confirms, and because the comments point to values "scaled by 1e18" I believe the finding to be valid, and since the "math is wrong", I do agree with High Severity.



***

## [[H-04] Oracle `periodSize` is very low allowing the TWAP price to be easily manipulated](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/124)
_Submitted by 0x52, also found by &#95;&#95;141345&#95;&#95;, Chom, csanuragjain, and ladboy233_

<https://github.com/Plex-Engineer/lending-market-v2/blob/ea5840de72eab58bec837bb51986ac73712fcfde/contracts/Stableswap/BaseV1-core.sol#L72>

TWAP oracle easily manipulated.

### Proof of Concept

periodSize is set to 0 meaning that the oracle will take a new observation every single block, which would allow an attacker to easily flood the TWAP oracle and manipulate the price.

### Recommended Mitigation Steps

Increase periodSize to be greater than 0, 1800 is typically standard.

**[nivasan1 (Canto) confirmed](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/124)**

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/124#issuecomment-1216838068):**
 > The warden has identified a constant set to zero for the time in between TWAP observations.
> 
> Because the code change:
> - Is a mistake (evidenced by the comments)
> - Causes the TWAP (already put into question in previous contest) to become a Spot Oracle
> - There's no way to remediate as the variable is constant
> - The change will end up resulting in a manipulatable `quote` which will impact `getUnderlyingPrice`
> 
> I agree with High Severity.



***

## [[H-05] The LP pair underlying price quote could be manipulated](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/152)
_Submitted by &#95;&#95;141345&#95;&#95;_

<https://github.com/Plex-Engineer/lending-market-v2/blob/ea5840de72eab58bec837bb51986ac73712fcfde/contracts/Stableswap/BaseV1-periphery.sol#L522-L526><br>
<https://github.com/Plex-Engineer/lending-market-v2/blob/ea5840de72eab58bec837bb51986ac73712fcfde/contracts/Stableswap/BaseV1-periphery.sol#L198-L217>

The underlying price for LP pool pair can be manipulated. This kind of price mainpulation happened before, can be found here: [Warp Fincance event](https://rekt.news/warp-finance-rekt/).

Which may lead to the exploit of the pool by a malicious user.

### Proof of Concept

file: lending-market-v2/contracts/Stableswap/BaseV1-periphery.sol<br>
522-526， 198-217:

                uint price0 = (token0 != USDC) ? IBaseV1Pair(pairFor(USDC, token0, stable0)).quote(token0, 1, 8) : 1;
                uint price1 = (token1 != USDC) ? IBaseV1Pair(pairFor(USDC, token1, stable1)).quote(token1, 1, 8) : 1;
                // how much of each asset is 1 LP token redeemable for
                (uint amt0, uint amt1) = quoteRemoveLiquidity(token0, token1, stablePair, 1);
                price = amt0 * price0 + amt1 * price1;


        function quoteRemoveLiquidity(
            address tokenA,
            address tokenB,
            bool stable,
            uint liquidity
        ) public view returns (uint amountA, uint amountB) {
            // create the pair if it doesn"t exist yet
            address _pair = IBaseV1Factory(factory).getPair(tokenA, tokenB, stable);

            if (_pair == address(0)) {
                return (0,0);
            }

            (uint reserveA, uint reserveB) = getReserves(tokenA, tokenB, stable);
            uint _totalSupply = erc20(_pair).totalSupply();

            amountA = liquidity * reserveA / _totalSupply; // using balances ensures pro-rata distribution
            amountB = liquidity * reserveB / _totalSupply; // using balances ensures pro-rata distribution

        }

The price of the LP pair is determined by the TVL of the pool, given by:<br>
`amt0 * price0 + amt1 * price1`. However, when a malicious user dumps large amount of any token into the pool, the whole TVL will be significantly increased, which leads to inproper calculation of the price.

### Recommended Mitigation Steps

A differenct approach to calculate the LP price can be found [here](https://cmichel.io/pricing-lp-tokens/).

**[nivasan1 (Canto) confirmed](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/152)**

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/152#issuecomment-1216847622):**
 > The warden has shown how the LP Token Pricing math is incorrect, this is a mispricing that historically has resulted in total loss of funds and the subject is well known.
> 
> Remediation can be attained by following the guide linked:
> https://cmichel.io/pricing-lp-tokens/
> 
> Because the:
> - Math is incorrect
> - Exploit allows anyone to inflate prices within 1 block (no risk)
> 
> High Severity is appropriate.



***

## [[H-06] `getBorrowRate` returns rate per year instead of per block](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/38)
_Submitted by Lambda, also found by Chom_

<https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/NoteInterest.sol#L118><br>
<https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/CToken.sol#L209>

According to the documentation in `InterestRateModel`, `getBorrowRate` has to return the borrow rate per block and the function `borrowRatePerBlock` in `CToken` directly returns the value of `getBorrowRate`. However, the rate per year is returned for `NoteInterest`. Therefore, using `NoteInterest` as an interest model will result in completely wrong values.

### Recommended Mitigation Steps

Return `baseRatePerBlock`.

**[nivasan1 (Canto) confirmed](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/38)**

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/38#issuecomment-1216901711):**
 > The warden has shown that the borrowRate is returning per-year values instead of per-block values.
> 
> The effect of this is that the accounting will be magnified massively.
> 
> While impact should be mostly loss of value to interest and incorrect yield, due to the math being wrong I do agree with High Severity.



***

## [[H-07] Deny of service in `AccountantDelegate.sweepInterest`](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/28)
_Submitted by 0x1f8b, also found by Critical_

<https://github.dev/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Accountant/AccountantDelegate.sol#L101>

The `sweepInterest` method is susceptible to denial of service.

### Proof of Concept

The logic of the `sweepInterest` method relative to the `treasury` is as follows:

```javascript
		bool success = cnote.transfer(treasury, amtToSweep);
		if (!success) { revert  SweepError(treasury , amtToSweep); }
		TreasuryInterface Treas = TreasuryInterface(treasury);
		Treas.redeem(address(cnote),amtToSweep);
		require(cnote.balanceOf(treasury) == 0, "AccountantDelegate::sweepInterestError");
```

As you can see, `amtToSweep` is passed to it and `redeem` that amount. Later it is checked that the balance of `cnote` in the `treasury` address must be 0. However, all calculations related to `amtToSweep` come out of the balance of [address(this)](https://github.dev/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Accountant/AccountantDelegate.sol#L83-L84) so if a third party sends a single token `cnote` to the address of `treasury` the method will be denied.

### Recommended Mitigation Steps

*   Check that the balance is the same after and before the `bool success = cnote.transfer(treasury, amtToSweep);`

**[nivasan1 (Canto) confirmed](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/28)**

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/28#issuecomment-1216930433):**
 > The warden has shown how, due to an incorrect invariant (treasury having zero cNote), any griefer can permanently brick the `sweepInterest` function.
> 
> The finding shows how a loss of yield can be achieved, so Medium Severity would be in order.
> 
> However, because:
> - an invariant was broken
> - the tokens cannot be withdrawn via an alternative method
> 
> I believe High Severity to be more appropriate.



***

## [[H-08] AccountantDelegate: The sweepInterest function sweeps an incorrect number of cnote](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/11)
_Submitted by cccz, also found by Critical_

In the sweepInterest function of the AccountantDelegate contract, the number of cnote sent to treasury should be cNoteToSweep instead of amtToSweep, as amtToSweep will normally be smaller than cNoteToSweep, which will cause the interest to be locked in the in the contract.

    		uint amtToSweep = sub_(cNoteAmt, noteDiff); // amount to sweep in Note, 
    		uint cNoteToSweep = div_(amtToSweep, exRate); // amount of cNote to sweep = amtToSweep(Note) / exRate

    		cNoteToSweep = (cNoteToSweep > cNoteBal) ? cNoteBal :  cNoteToSweep; 
    		bool success = cnote.transfer(treasury, amtToSweep);
    		if (!success) {
    			revert  SweepError(treasury , amtToSweep); //handles if transfer of tokens is not successful
    		}

    		TreasuryInterface Treas = TreasuryInterface(treasury);
    		Treas.redeem(address(cnote),amtToSweep);

### Proof of Concept

<https://github.com/Plex-Engineer/lending-market-v2/blob/ea5840de72eab58bec837bb51986ac73712fcfde/contracts/Accountant/AccountantDelegate.sol#L80-L99>

### Recommended Mitigation Steps

```diff
		uint amtToSweep = sub_(cNoteAmt, noteDiff); // amount to sweep in Note, 
		uint cNoteToSweep = div_(amtToSweep, exRate); // amount of cNote to sweep = amtToSweep(Note) / exRate

		cNoteToSweep = (cNoteToSweep > cNoteBal) ? cNoteBal :  cNoteToSweep; 
-		bool success = cnote.transfer(treasury, amtToSweep);
+               bool success = cnote.transfer(treasury, cNoteToSweep);
		if (!success) {
-			revert  SweepError(treasury , amtToSweep); //handles if transfer of tokens is not successful
+                       revert  SweepError(treasury , cNoteToSweep); //handles if transfer of tokens is not successful
		}

		TreasuryInterface Treas = TreasuryInterface(treasury);
-		Treas.redeem(address(cnote),amtToSweep);
+               Treas.redeem(address(cnote),cNoteToSweep);
```

**[nivasan1 (Canto) confirmed](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/11)**

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/11#issuecomment-1216934462):**
 > The warden has shown that the wrong variable is being used as the transferAmount.
> 
> Because `cNoteToSweep` << `amtToSweep` there will be many instances in which the function will revert.
> 
> Because the finding shows incorrect functionality, which can leave the tokens stuck indefinitely, I agree with High Severity.



***

# Medium Risk Findings (6)
## [[M-01] Stableswap - Deadline do not work](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/90)
_Submitted by Picodes, also found by cccz, Funen, ladboy233, Soosh, and zzzitron_

<https://github.com/Plex-Engineer/lending-market-v2/blob/ea5840de72eab58bec837bb51986ac73712fcfde/contracts/Stableswap/BaseV1-periphery.sol#L86><br>

The `ensure` modifier is commented, so deadlines will not work when passing orders, breaking this functionality.

**[nivasan1 (Canto) acknowledged](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/90)**

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/90#issuecomment-1214244667):**
 > The warden has shown how, due to a comment, the modifier `deadline` doesn't work.
> 
> Because Front-running is a key aspect of AMM design, `deadline` is a useful tool to ensure that your tx cannot be "saved for later".
> 
> Due to the removal of the check, it may be more profitable for a miner to deny the transaction from being mined until the transaction incurs the maximum amount of slippage.
> 
> The lack of deadline means that the tx can be withheld indefinitely at the advantage of the miner.
> 
> For those reasons I agree with Medium Severity.



***

## [[M-02] Multiple initialization in `NoteInterest`](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/49)
_Submitted by 0x1f8b, also found by oyc&#95;109_

<https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/NoteInterest.sol#L99><br>

The `initialize` method of the contract `NoteInterest` can be initialized multiple times.

### Proof of Concept

The method `initialize` of the contract `NoteInterest` looks like this:

```javascript
    function initialize(address cnoteAddr, address oracleAddress) external {
        if (msg.sender != admin ) {
            revert SenderNotAdmin(msg.sender);
        }   
        address oldPriceOracle = address(oracle);
        cNote = CErc20(cnoteAddr);
        oracle = PriceOracle(oracleAddress);
        emit NewPriceOracle(oldPriceOracle, oracleAddress);
    }
```

Nothing prevents it from being initialized again and altering the initial values of the contract. This allows the government, unnecessarily, to be able to perform attacks such as altering the logic of the `updateBaseRate` method.

### Recommended Mitigation Steps

Add a require to check that was not already initialized.

**[nivasan1 (Canto) disputed and commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/49#issuecomment-1189651440):**
 > It is not clear how governance would be able to modify the logic in updateBaseRate? All that could be changed is the price oracle that the NoteInterest Model references.

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/49#issuecomment-1214473208):**
 > The warden has shown that the function `initialize` can be called multiple times by governance.
> 
> This could cause undefined behaviour (e.g. change the token address), which could cause loss of funds.
> 
> Because of the system setup, it would be best to make sure that `initialize` can only be called once.
> 
> Because the finding can cause a loss, under specific circumstances, I believe Medium Severity is appropriate



***

## [[M-03] Non view function is called with staticcall in `CErc20Delegator`](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/112)
_Submitted by zzzitron_

### Lines of code

<https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/CErc20Delegator.sol#L237><br>
<https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/CErc20Delegator.sol#L246>

When using CToken implementation with CErc20Delegator, the functions `borrowRatePerBlock` and `supplyRatePerBlock` will revert when the underlying functions try to update some states.

### Detail

The v1 of [borrowRatePerBlock](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/CToken.sol#L208) and [supplyRatePerBlock](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/CToken.sol#L216) were view functions, but they are not anymore. The `CErc20Delegator` is still using `delegateToViewImplementation` for those functions. Those functions can be used, as long as the implementation does not update any state variables, i.e. [the block number increase since the last update is less or equal to the `updateFrequency`](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/NoteInterest.sol#L141). However, when these functions are called after sufficient blocks are mined, they are going to revert.<br>
Although one can still call the implementation using [`delegateToImplementation`](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/CErc20Delegator.sol#L437), it is not a good usability, especially if those functions are used for external user interface.

### Proof Of Concept

[Gist for the test](https://gist.github.com/zzzitron/37fb99cebed786b4c983d20a76e8793e#file-2022-06-newblockchain-v2-poc-ctoken-test-ts-L49-L62)

The gist shows a simple test. It calls `borrowRatePerBlock` and `supplyRatePerBlock` first time, it suceeds. Then, it mines for more than 300 times, which is the `updateFrequency` parameter. Then it calls again then fails.

Notes on the test file:

*   The setup is taken from `tests/Treasury/Accountant.test.ts`
*   using `solidity` from ethereum-waffle for chai to use `reverted`
        // in hardhat.config.js
        import chai from "chai";
        import { solidity } from "ethereum-waffle";

        chai.use(solidity);

### Tools Used

hardhat

### Recommended Mitigation Steps

Instead of using `delegateToViewImplementation` use `delegateToImplementation`. Alternatively, implement view functions to query these rates in `NoteInterest.sol` and `CToken.sol`. It will enable to query the rates without spending gas.

**[nivasan1 (Canto) confirmed](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/112)**

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/112#issuecomment-1216670039):**
 > The warden has shown how, due to the usage of `delegateToViewImplementation` the function call to `borrowRatePerBlock` and `supplyRatePerBlock` will revert, provided some time has passed.
> 
> There is no more severe loss of availability than a function that doesn't work, however, at this time, because the functions are `view` and "niche", the actual underlying functionality is still available via `delegateToViewImplementation`, and the internal accounting of the protocol is still functioning, I believe Medium Severity to be appropriate.



***

## [[M-04] Missing zero address check can cause initialize to be called more than once](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/14)
_Submitted by oyc&#95;109_

There is potential to call initialize() on `AccountantDelegate.sol` more than once because the require statement only checks if the state variables != address(0)

<https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/Accountant/AccountantDelegate.sol#L23-L25>

If initialize() was called the first with these parameters as address(0x0), then initialize can be called again

<https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/Accountant/AccountantDelegate.sol#L17>

### Recommended Mitigation Steps

The require statement should also check if the parameters != zero address, similar to the check performed in `TreasuryDelegate.sol`

<https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/Treasury/TreasuryDelegate.sol#L23>

Or use openzepplen initializable.

**[nivasan1 (Canto) acknowledged and commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/14#issuecomment-1189479463):**
 > This will be a function called by admin (Governance), as such, it is the community's responsibility to review the parameters of the inititalize method.

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/14#issuecomment-1216685787):**
 > In contract to CantoV1, in this version of the code the `initializer` can be called multiple times.
> 
> This is contingent on the admin calling it, however the impact of changing any variable will most likely be complete breaking of all accounting (an exception may be a complete fresh start).
> 
> Given in the code in scope, and the conditionality (admin privilege), I believe Medium Severity to be appropriate.



***

## [[M-05] Admin Can Break All Functionality Through Weth Address](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/173)
_Submitted by defsec_

On the protocol, almost all functionality is constructed through WETH address. However, if the admin is set to WETH address mistakenly, user could not claim through [Comptroller.sol#L1381](https://github.com/Plex-Engineer/lending-market-v2/blob/main/contracts/Comptroller.sol#L1381). Admin can break the protocol.

### Proof of Concept

<https://github.com/Plex-Engineer/lending-market-v2/blob/main/contracts/Comptroller.sol#L1479>

### Recommended Mitigation Steps

Set WETH address through initializer or change it through governance.

**[nivasan1 (Canto) disputed and commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/173#issuecomment-1189682546):**
 > The admin of the lending-market and LP will be cosmos-sdk governance, vis-a-vis, the community, as such it is expected that a malicious governance proposal will not be passed.

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/173#issuecomment-1216868137):**
 > Similarly to findings about `admin` re-initializing contracts, the warden has shown how, because the WETH address can be changed, accounting and functionality of the protocol and it's interactions (in this case emission of rewards and all lending operations triggering a transfer of "COMP"), can be bricked.
> 
> Because this is contingent on malicious governance, I believe Medium Severity to be appropriate.



***

## [[M-06] A cap is needed on the amount of Note than can be borrowed](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/92)
_Submitted by Picodes_

<https://github.com/Plex-Engineer/lending-market-v2/blob/ea5840de72eab58bec837bb51986ac73712fcfde/contracts/CNote.sol#L33><br>
<https://github.com/Plex-Engineer/lending-market-v2/blob/ea5840de72eab58bec837bb51986ac73712fcfde/contracts/Note.sol#L14>

The fact that there is no cap on the amount of Note that can be borrowed makes the Oracle Extractable Value unlimited. But as you intend to rely on TWAP, you need to make sure the cost of oracle manipulation is lower than the Oracle Extractable Value.

### Proof of Concept

By manipulating the TWAPs of the designated proxy used for Note (USDC ?) and its relative price to a given collateral(which would be highly costly), an attacker could borrow Note without limit, and empty all pools related to Note and all Note-related value, instantly killing the stablecoin.

The value extractable by Oracle Manipulations is usually easily computable as it is the size of the lending market, but here, it’s more difficult to evaluate as it could potentially be any value linked to Note. This makes risk management harder and increase significantly the risk of attack.

Therefore a cap on how many Notes can be borrowed needs to be added to mitigate this risk.

The attack would be:

*   Manipulate the USDC / Collateral TWAP to be able to borrow Note with less than 1$ of collateral, which would be costly.
*   Extract all the value possible linked to Note, for example:
    - by buying all the tokens from pools Note / token at a discount
    - by supplying Notes to the lending platform and borrow collaterals for which the Note price is still at 1$
    - etc

Essentially as you have no cap on the amount of Note that could be borrowed in such a scenario, you cannot be sure that the potential attack profits are lower than the attack cost.

### Recommended Mitigation Steps

The governance needs to set a limit on how much Note can be borrowed to mitigate risks, or add for example an “hourly” borrowing limit.

Easiest way to do this would be able to mint / burn from the accountant.

**[nivasan1 (Canto) acknowledged](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/92)**

**[Alex the Entreprenerd (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/92#issuecomment-1216895007):**
 > I don't think you can manipulate the price of cNOTE per this code
> 
> https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/Stableswap/BaseV1-periphery.sol#L499-L502
> 
> ```solidity
>         //set price statically to 1 when the Comptroller is retrieving Price
>         else if (compareStrings(ctoken.symbol(), "cNOTE") && msg.sender == Comptroller) {
>             return 1; // Note price is fixed to 1
>         }
> ```
> 
> 
> However, you can manipulate the price of another token against USDC
> 
> https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/Stableswap/BaseV1-periphery.sol#L529-L533
> 
> ```solidity
>         else {
>             stablePair = (stable == 0) ? false : true;
>             pair = IBaseV1Pair(pairFor(USDC, underlying, stablePair)); //get the pair for the USDC/underlying pool
>             price = pair.quote(underlying, 1, 8); //how much USDC is this token redeemable for
>         }
> ```
> 
> The attack outlined by the warden would require an imbalance in the price of an asset against the given above code.
> 
> It would also require oracle manipulation, which requires no external arbitrage nor intervention
> It would require some value to be extractable from the system.
> 
> For those reasons, I think Medium Severity is more appropriate.



***

# Low Risk and Non-Critical Issues

For this contest, 34 reports were submitted by wardens detailing low risk and non-critical issues. The [report highlighted below](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/113) by **zzzitron** received the top score from the judge.

*The following wardens also submitted reports: [0x1f8b](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/56), [TomJ](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/150), [AlleyCat](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/29), [Lambda](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/35), [Picodes](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/87), [Meera](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/59), [aysha](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/155), [c3phas](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/117), [0x29A](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/157), [&#95;&#95;141345&#95;&#95;](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/100), [oyc&#95;109](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/10), [Bnke0x0](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/60), [defsec](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/164), [Chom](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/174), [fatherOfBlocks](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/74), [cccz](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/23), [ladboy233](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/130), [slywaters](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/160), [ignacio](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/50), [JC](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/170), [rfa](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/122), [Funen](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/161), [hake](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/125), [sach1r0](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/53), [samruna](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/3), [ynnad](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/85), [grGred](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/146), [TerrierLover](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/142), [0v3rf10w](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/167), [asutorufos](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/127), [Limbooo](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/103), [mrpathfindr](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/79), and [Sm4rty](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/82).*

## [L-01] Price not scaled by the BASE in `BaseV1Router01`

*   [BaseV1-periphery.sol:501](https://github.com/Plex-Engineer/lending-market-v2/blob/ea5840de72eab58bec837bb51986ac73712fcfde/contracts/Stableswap/BaseV1-periphery.sol#L501)

              else if (compareStrings(ctoken.symbol(), "cNOTE") && msg.sender == Comptroller) {
                  return 1; // Note price is fixed to 1
              }

The `getUnderlyingPrice` function returns 1, when Comptroller is calling with `CNote`. The Comptroller is using the given price as [mantissa](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/Comptroller.sol#L757), which has [18 decimal precision](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/Comptroller.sol#L757).

## [L-02] `_acceptInitialAdminDelegated` will revert in `GovernorBravoDelegator`

*   [GovernorBravoDelegator.sol:49](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/Governance/GovernorBravoDelegator.sol#L49)

              delegateTo(implementation, abi.encodeWithSignature("_acceptInitialAdmin()"));

When the `GovernorBravoDelegator` is used with `GovernorBravoDelegate` as the implementation, the function `_acceptInitialAdminDelegated` will revert since the `GovernorBravoDelegate` does not have `_acceptInitialAdmin` function.

## [L-03] Desirable underflow / overflow in `BaseV1Pair`

*   [BaseV1-core.sol:160-161](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/Stableswap/BaseV1-core.sol#L160-L161)
*   [BaseV1-core.sol:186-187](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/Stableswap/BaseV1-core.sol#L186-L187)
*   [BaseV1-core.sol:200-201](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/Stableswap/BaseV1-core.sol#L200-L201)
*   [BaseV1-core.sol:232-233](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/Stableswap/BaseV1-core.sol#L232-L233)

                  reserve0CumulativeLast += _reserve0 * timeElapsed;
                  reserve1CumulativeLast += _reserve1 * timeElapsed;

The BaseV1-core is using solidity version 0.8.11, so it will revert when overflow or underflow happens. Upon cumulating the time weighted reserve, it is desired to overflow. Likewise it is desired to underflow calculating price average. It also saves gas usage, to use unchecked block for those calculations.

## [L-04] Lack of zero address check

*   [NoteInterest.sol:104-105 in `initialize`](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/NoteInterest.sol#L104-L105)
               cNote = CErc20(cnoteAddr);
               oracle = PriceOracle(oracleAddress);
    *   the `cNote` and `oracle` was set without checking zero address

*   [NoteInterest.sol:113 in `setAdmin`](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/NoteInterest.sol#L113)
              admin = newAdmin;
    *   it is good to check admin for zero address, otherwise admin access will be lost forever. To renounce the admin, it is safer to add a separate function.

## [L-05] Oracle failure check in `NoteRateModel`

*   [NoteInterest.sol:145](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/NoteInterest.sol#L145)

                  uint twapMantissa = oracle.getUnderlyingPrice(cNote); // returns price as mantissa

It is good to check the returned value from oracle is sane (i.e. if it is zero) and prepare for a fallback.

## [L-06] Storage for delegate is outside of storage contract in `CNote`

*   [CNote.sol:14](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/CNote.sol#L14)

When updating an implementation for a proxy, it is important to keep the storage structure. Putting non-constant state variables in a dedicated storage contract is less error-prone approach. Although CErc20Delegate has a storage contract in its inheritance tree, a state variable `_accountant` was introduced in `CNote`. Therefore, extra care should be paid to the state variable.

## [N-01] Cast to `int` without checking in `NoteRateModel`

*   [NoteInterest.sol:147-149](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/NoteInterest.sol#L147-L149)

<!---->

                int diff = BASE - int(twapMantissa); //possible annoyance if 1e18 - twapMantissa > 2**255, differ
                int InterestAdjust = (diff * int(adjusterCoefficient))/BASE;
                int ir = InterestAdjust + int(baseRatePerYear);

The uint256 variables are casted into `int` without checking for overflow. It is probably safe in this use case, but to be sure one may use [SafeCast](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/7a8f269457ca252605f03f8c2f8a333da6be1709/contracts/utils/math/SafeCast.sol#L1130-L1134).

## [N-02] Meaningless check in `GovernorBravoDelegate`

*   [GovernorBravoDelegate.sol:129](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/Governance/GovernorBravoDelegate.sol#L129)

The check `require(initialProposalId == 0, "GovernorBravo::_initiate: can only initiate once");` is not useful, as `initialProposalId` is never updated.

## [N-03] Missing param in NatSpec in `CToken`

*   [CToken.sol:24](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/CToken.sol#L23-L24)

Although a new argument `uint8 stable_` was added, the NatSpec for the parameter is missing.

## [N-04] Misleading NatSpec in `AccountantDelegator`

*   [AccountantDelegator.sol:50 the NatSpec does not match the function](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/Accountant/AccountantDelegator.sol#L50)
*   [AccountantDelegator.sol:59 the NatSpec does not match the function](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/Accountant/AccountantDelegator.sol#L59)

## [N-05] Typos

*   [CToken.sol: "efore" to "before"](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/CToken.sol#L291)
*   [CNote.sol: "efore" to "before"](https://github.com/Plex-Engineer/lending-market-v2/blob/443a8c0fed3c5018e95f3881a31b81a555c42b2d/contracts/CNote.sol#L41)

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/113#issuecomment-1214464717):**
 > **[L-01] Price not scaled by the BASE in BaseV1Router01**<br>
> Low
> 
> **[L-02] `_acceptInitialAdminDelegated` will revert in GovernorBravoDelegator**<br>
> Valid Low (as the Sponsor uses another function to acceptAdmin)
> 
> **[L-03] Desirable underflow / overflow in BaseV1Pair**<br>
> Valid Low
> 
> **[L-04] Lack of zero address check**<br>
> Low
> 
> **[L-05] Oracle failure check in NoteRateModel**<br>
> Low
> 
> **[L-06] Storage for delegate is outside of storage contract in CNote**<br>
> Low, there will be no risk unless the Sponsor changes the Delegate contract 
> 
> **[N-01] Cast to int without checking in NoteRateModel**<br>
> NC as it will never overflow but it's a code-smell
> 
> **[N-02] Meaningless check in GovernorBravoDelegate**<br>
> R
> 
> **[N-03] & [N-04] Natspec**<br>
> NC
> 
> **[N-05] Typos**<br>
> NC
> 
> Really good report, there's some personal opinion and style which helps it stand out. Also the quantity of findings is good, will give it bonus points.



***

# Gas Optimizations

For this contest, 34 reports were submitted by wardens detailing gas optimizations. The [report highlighted below](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/55) by **0x1f8b** received the top score from the judge.

*The following wardens also submitted reports: [rfa](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/121), [0xKitsune](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/93), [Bnke0x0](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/42), [0x29A](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/158), [defsec](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/163), [Picodes](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/86), [Tomio](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/63), [TomJ](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/119), [Funen](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/162), [ladboy233](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/132), [Meera](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/57), [fatherOfBlocks](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/73), [m&#95;Rassska](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/54), [oyc&#95;109](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/9), [TerrierLover](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/139), [Waze](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/106), [mrpathfindr](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/78), [0xArshia](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/129), [ajtra](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/111), [c3phas](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/168), [Chom](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/176), [cRat1st0s](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/46), [durianSausage](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/52), [Fitraldys](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/171), [grGred](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/145), [hake](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/126), [JC](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/172), [Lambda](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/36), [Noah3o6](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/166), [RedOneN](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/165), [Rohan16](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/156), [Sm4rty](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/81), and [ynnad](https://github.com/code-423n4/2022-06-NewBlockchain-v2-findings/issues/84).*

## [G-01] Use `abi.encodeWithSelector` instead of `abi.encodeWithSignature`

`abi.encodeWithSelector` is much cheaper than `abi.encodeWithSignature` because it doesn't require to compute the selector from the string.

Reference:

*   <https://docs.soliditylang.org/en/v0.8.15/units-and-global-variables.html#abi-encoding-and-decoding-functions>
*   <https://github.com/ConnorBlockchain/Solidity-Encode-Gas-Comparison>

Affected source code:

*   [AccountantDelegator.sol#L27](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Accountant/AccountantDelegator.sol#L27)
*   [AccountantDelegator.sol#L54](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Accountant/AccountantDelegator.sol#L54)
*   [AccountantDelegator.sol#L63](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Accountant/AccountantDelegator.sol#L63)
*   [AccountantDelegator.sol#L71](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Accountant/AccountantDelegator.sol#L71)
*   [AccountantDelegator.sol#L108](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Accountant/AccountantDelegator.sol#L108)
*   [TreasuryDelegator.sol#L17](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Treasury/TreasuryDelegator.sol#L17)
*   [TreasuryDelegator.sol#L45](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Treasury/TreasuryDelegator.sol#L45)
*   [TreasuryDelegator.sol#L54](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Treasury/TreasuryDelegator.sol#L54)
*   [TreasuryDelegator.sol#L64](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Treasury/TreasuryDelegator.sol#L64)
*   [TreasuryDelegator.sol#L68](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Treasury/TreasuryDelegator.sol#L68)
*   [TreasuryDelegator.sol#L89](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Treasury/TreasuryDelegator.sol#L89)
*   [GovernorBravoDelegator.sol#L15](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorBravoDelegator.sol#L15)
*   [GovernorBravoDelegator.sol#L41](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorBravoDelegator.sol#L41)
*   [GovernorBravoDelegator.sol#L49](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorBravoDelegator.sol#L49)
*   [GovernorBravoDelegator.sol#L57](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorBravoDelegator.sol#L57)

## [G-02] Avoid creating unnecessary variables

The creation of variables has an extra cost due to the required opcodes, in addition to the fact that the evm virtual machine is limited to the number of elements.

Reference:

*   <https://github.com/ethereum/solidity/issues/2693>

Affected source code:

*   Return `address(this).balance` without create `treasuryCantoBalance` in [TreasuryDelegate.sol#L33-L36](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Treasury/TreasuryDelegate.sol#L33-L36)
*   Return `note.balanceOf(address(this))` without create `treasuryNoteBalance` in [TreasuryDelegate.sol#L43-L44](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Treasury/TreasuryDelegate.sol#L43-L44)
*   Send `msg.sender` instead of create `owner` var in [ERC20.sol#L92](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/ERC20.sol#L92), [ERC20.sol#L116](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/ERC20.sol#L116), [ERC20.sol#L162](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/ERC20.sol#L162) and [ERC20.sol#L181](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/ERC20.sol#L181)
*   Send `msg.sender` instead of create `src` var in [CToken.sol#L145](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/CToken.sol#L145)

## [G-03] Reorder structure layout

The following structs could be optimized moving the position of certains values in order to save slot storages:

*   [GovernorBravoInterfaces.sol#L68-L95](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorBravoInterfaces.sol#L68-L95) and [GovernorAlpha.sol#L69-L73](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorAlpha.sol#L69-L73)

```javascript
struct Proposal {
    uint id;
    address proposer;
    uint eta;
    address[] targets;
    uint[] values;
    string[] signatures;
    bytes[] calldatas;
    bool canceled;  // <- Move these two bool close to the `proposer` address
    bool executed;
}
```

## [G-04] Reduce the size of error messages (Long revert Strings)

Shortening revert strings to fit in 32 bytes will decrease deployment time gas and will decrease runtime gas when the revert condition is met.

Revert strings that are longer than 32 bytes require at least one additional mstore, along with additional overhead for computing memory offset, etc.

I suggest shortening the revert strings to fit in 32 bytes, or that using custom errors as described next.

### Use Custom Errors instead of Revert Strings to save Gas

Custom errors from Solidity 0.8.4 are cheaper than revert strings (cheaper deployment cost and runtime cost when the revert condition is met)

#### Source Custom Errors in Solidity:

Starting from Solidity v0.8.4, there is a convenient and gas-efficient way to explain to users why an operation failed through the use of custom errors. Until now, you could already use strings to give more information about failures (e.g., revert("Insufficient funds.");), but they are rather expensive, especially when it comes to deploy cost, and it is difficult to use dynamic information in them.

Custom errors are defined using the error statement, which can be used inside and outside of contracts (including interfaces and libraries).

Below are some examples, but the code has a lot of them, it is recommended to change all `require` phrases to custom errors.

*   [GovernorBravoDelegate.sol#L25-L27](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorBravoDelegate.sol#L25-L27)
*   [GovernorBravoDelegate.sol#L46-L47](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorBravoDelegate.sol#L46-L47)
*   [GovernorBravoDelegate.sol#L76](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorBravoDelegate.sol#L76)
*   [GovernorBravoDelegate.sol#L85](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorBravoDelegate.sol#L85)
*   [GovernorAlpha.sol#L137-L146](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorAlpha.sol#L137-L146)
*   [GovernorAlpha.sol#L178](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorAlpha.sol#L178)
*   [GovernorAlpha.sol#L189](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorAlpha.sol#L189)
*   [GovernorAlpha.sol#L194](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorAlpha.sol#L194)
*   [GovernorAlpha.sol#L205](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorAlpha.sol#L205)
*   [GovernorAlpha.sol#L283-L298](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorAlpha.sol#L283-L298)
*   [Comp.sol#L234-L238](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/Comp.sol#L234-L238)
*   [ERC20.sol#L248-L251](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/ERC20.sol#L248-L251)
*   [ERC20.sol#L276-L277](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/ERC20.sol#L276-L277)
*   [CNote.sol#L17](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/CNote.sol#L17)

## [G-05] `++i` costs less gas compared to `i++` or `i += 1`

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

In the first case, the compiler has to create a temporary variable (when used) for returning `1` instead of `2`.<br>
I suggest using `++i` instead of `i++` to increment the value of an uint variable. Same thing for `--i` and `i--`

Affected source code:

*   [GovernorBravoDelegate.sol#L66](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorBravoDelegate.sol#L66)
*   [GovernorBravoDelegate.sol#L88](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorBravoDelegate.sol#L88)
*   [GovernorAlpha.sol#L181](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorAlpha.sol#L181)
*   [GovernorAlpha.sol#L197](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorAlpha.sol#L197)
*   [GovernorAlpha.sol#L211](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorAlpha.sol#L211)

## [G-06] Use `external` visibility

The following methods could be improved if `external` visibility is used:

*   [GovernorAlpha.sol#L136](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorAlpha.sol#L136)

## [G-07] There's no need to set default values for variables

If a variable is not set/initialized, the default value is assumed (0, `false`, 0x0 ... depending on the data type). You are simply wasting gas if you directly initialize it with its default value.

Affected source code:

*   [GovernorBravoDelegate.sol#L66](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorBravoDelegate.sol#L66)
*   [GovernorBravoDelegate.sol#L88](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorBravoDelegate.sol#L88)
*   [GovernorAlpha.sol#L181](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorAlpha.sol#L181)
*   [GovernorAlpha.sol#L197](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorAlpha.sol#L197)
*   [GovernorAlpha.sol#L211](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorAlpha.sol#L211)

## [G-08] Reduce boolean comparison

It's compared a boolean value using `== true` or `== false`, instead of using the boolean value. `NOT` opcode, it's cheaper to use `EQUAL` or `NOTEQUAL` when the value it's false, or just the value without `== true` when it's true, because it will use less opcodes inside the VM.

Change `== false` by `!` in:

*   [GovernorAlpha.sol#L266](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/GovernorAlpha.sol#L266)

## [G-09] Unused arguments

Is not required to send the `nonce`, only is required for compute the signature.

Affected source code:

*   [Comp.sol#L161](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Governance/Comp.sol#L161)

## [G-10] Gas saving using `immutable`

It's possible to avoid storage access a save gas using `immutable` keyword for the following variables:

It's also better to remove the initial values, because they will be set during the constructor.

Affected source code:

*   Remove `_setupDecimals` method and change `_decimals` to immutable. Decimals should never change in [ERC20MinterBurnerDecimals.sol#L30](https://github.com/Plex-Engineer/manifest-v2/blob/3aedf21400a470a50c9be6e38f1ca57f061eca46/contracts/ERC20MinterBurnerDecimals.sol#L30)
*   `dripStart`, `dripRate`, `token` and `target` in [Reservoir.sol#L34-L37](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Reservoir.sol#L34-L37)
*   `_name`, `_symbol` and `_decimals` in [WETH.sol#L6-L8](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/WETH.sol#L6-L8)
*   `_name` and `_symbol` in [ERC20.sol#L30-L31](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/ERC20.sol#L30-L31)

## [G-11] Unused import

Importing pointless files costs gas during deployment and is a bad coding practice that is important to ignore.

Remove the following imports:

*   [Reservoir.sol#L103](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/Reservoir.sol#L103)

## [G-12] `unckecked` keyword

It's possible to save gas using the `unckecked` keyword. This will avoid the required checks to ensure that the variable won't overflow.

Reference:

*   <https://docs.soliditylang.org/en/v0.8.0/control-structures.html#checked-or-unchecked-arithmetic>

The balance was checked before, it can be subtracted without checking overflows:

*   [WETH.sol#L30](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/WETH.sol#L30)
*   [WETH.sol#L73](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/WETH.sol#L73)
*   [WETH.sol#L76](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/WETH.sol#L76)
*   [ERC20.sol#L213](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/ERC20.sol#L213)

## [G-13] use `constant` instead of storage

Use constant instead of storage and change from `uint256 MAX_INT = 2**256-1;` to `uint256 private constant MAX_INT = type(uint256).max;`:

*   [ERC20.sol#L18](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/ERC20.sol#L18)

## [G-14] Unrequired method

Method not necessary since the implemented logic only calls to obtain the current block.

Affected source code:

*   [CToken.sol#L201](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/CToken.sol#L201)

## [G-15] Optimize logic

The logic of the `CToken.transferTokens` method can bypass the `startingAllowance` condition and the `allowanceNew` variable if the `spender` and `src` checks are done at the same time the tokens are subtracted.

```javascript
if (spender == src) {
    transferAllowances[src][spender] -= tokens;
}
```

Affected source code:

*   [CToken.sol#L82](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/CToken.sol#L82)

## [G-16] Use `memory` instead of `storage`

Changing `storage` to `memory` we can save some storage access.

Affected source code:

*   [CToken.sol#L255](https://github.com/Plex-Engineer/lending-market-v2/blob/2646a7676b721db8a7754bf5503dcd712eab2f8a/contracts/CToken.sol#L255)

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-06-canto-v2-findings/issues/55#issuecomment-1215990506):**
 > Packing<br>
> -> Will save in writing and reading, let's say 2.1k * 2 for two saved SLOADs
> 
> Immutables<br>
> 9* 2100 (ignoring ERC20MinterBurnerDecimals as out of scope)
> 
> **[G-13] Use constant instead of storage**<br>
> 2.1k
> 
> Rest seems minor.
> 
> Big gas savings by reducing storage, nice finds.
> 
> 25200



***

# Disclosures

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.
