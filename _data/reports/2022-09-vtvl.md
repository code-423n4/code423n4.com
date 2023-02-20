---
sponsor: "VTVL"
slug: "2022-09-vtvl"
date: "2022-11-01"
title: "VTVL contest"
findings: "https://github.com/code-423n4/2022-09-vtvl-findings/issues"
contest: 164
---

# Overview

## About C4

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the VTVL smart contract system written in Solidity. The audit contest took place between September 20—September 23 2022.

## Wardens

208 Wardens contributed reports to the VTVL contest:

  1. pashov
  1. sorrynotsorry
  1. [Respx](https://twitter.com/RespxR)
  1. [fatherOfBlocks](https://twitter.com/father0fBl0cks)
  1. m9800
  1. wagmi
  1. CertoraInc (egjlmn1, [OriDabush](https://twitter.com/ori_dabush), ItayG, shakedwinder, and RoiEvenHaim)
  1. [csanuragjain](https://twitter.com/csanuragjain)
  1. [TomJ](https://mobile.twitter.com/tomj_bb)
  1. [hansfriese](https://twitter.com/hansfriese)
  1. ayeslick
  1. Lambda
  1. rbserver
  1. KIntern\_NA (TrungOre and duc)
  1. neko\_nyaa
  1. [rokinot](twitter.com/rokinot)
  1. 0xSky
  1. neumo
  1. [bin2chen](https://twitter.com/bin2chen)
  1. [Trust](https://twitter.com/trust__90)
  1. [wastewa](https://twitter.com/WahWaste)
  1. datapunk
  1. 0xhunter
  1. dipp
  1. [wuwe1](https://twitter.com/wuwe19)
  1. IllIllI
  1. [Ruhum](https://twitter.com/0xruhum)
  1. [obront](https://twitter.com/zachobront)
  1. RustyRabbit
  1. [0xSmartContract](https://twitter.com/0xSmartContract)
  1. 0xA5DF
  1. [pedroais](https://twitter.com/Pedroais2/)
  1. [pcarranzav](https://twitter.com/pcarranzav)
  1. [ElKu](https://twitter.com/ElKu_crypto)
  1. [Czar102](https://twitter.com/_Czar102)
  1. sashik\_eth
  1. [pauliax](https://twitter.com/SolidityDev)
  1. 0x52
  1. [0xdapper](https://twitter.com/0xdapper_)
  1. eierina
  1. AkshaySrivastav
  1. JohnSmith
  1. \_\_141345\_\_
  1. djxploit
  1. [0xDecorativePineapple](https://decorativepineapple.github.io/)
  1. zzzitron
  1. [hyh](https://twitter.com/0xhyh)
  1. [MiloTruck](https://milotruck.github.io/)
  1. rotcivegaf
  1. JLevick
  1. [Aymen0909](https://github.com/Aymen1001)
  1. [supernova](https://twitter.com/harshit16024263)
  1. 0x4non
  1. [Chom](https://chom.dev)
  1. ak1
  1. [0xNazgul](https://twitter.com/0xNazgul)
  1. 0x1f8b
  1. [rajatbeladiya](https://twitter.com/rajat_beladiya)
  1. [joestakey](https://twitter.com/JoeStakey)
  1. [berndartmueller](https://twitter.com/berndartmueller)
  1. [c3phas](https://twitter.com/c3ph_)
  1. lukris02
  1. [pfapostol](https://t.me/pfahard)
  1. ajtra
  1. imare
  1. cryptostellar5
  1. [Deivitto](https://twitter.com/Deivitto)
  1. [gogo](https://www.linkedin.com/in/georgi-nikolaev-georgiev-978253219)
  1. Bnke0x0
  1. [oyc\_109](https://twitter.com/andyfeili)
  1. [JC](https://twitter.com/sm4rtcontr4ct)
  1. [durianSausage](https://github.com/lyciumlee)
  1. Diana
  1. brgltd
  1. ladboy233
  1. [Tomo](https://tom-sol.notion.site/Who-am-I-3b4dc28e77b647eb90794735a94dd38e)
  1. Rolezn
  1. [seyni](https://twitter.com/seynixyz)
  1. 0xbepresent
  1. peanuts
  1. OptimismSec ([sseefried](http://seanseefried.org/blog) and [tofunmi](https://twitter.com/dediranTofunmi))
  1. d3e4
  1. RockingMiles (robee and pants)
  1. Waze
  1. tnevler
  1. [Funen](https://instagram.com/vanensurya)
  1. [a12jmx](https://twitter.com/a12jmx)
  1. [prasantgupta52](https://twitter.com/prasantgupta52)
  1. [Sm4rty](https://twitter.com/Sm4rty_)
  1. [martin](https://github.com/martin-petrov03)
  1. delfin454000
  1. leosathya
  1. RaymondFam
  1. [Rohan16](https://twitter.com/ROHANJH56009256)
  1. erictee
  1. millersplanet
  1. aysha
  1. ChristianKuri
  1. V\_B (Barichek and vlad\_bochok)
  1. CodingNameKiki
  1. karanctf
  1. [ret2basic](https://twitter.com/ret2basic)
  1. [medikko](https://twitter.com/mehmeddukov)
  1. slowmoses
  1. ReyAdmirado
  1. B2
  1. peiw
  1. 0x040
  1. carrotsmuggler
  1. ikbkln
  1. async
  1. sach1r0
  1. rvierdiiev
  1. eighty
  1. [ignacio](https://twitter.com/0xheynacho)
  1. bobirichman
  1. got\_targ
  1. nalus
  1. cryptphi
  1. SooYa
  1. tibthecat
  1. [natzuu](https://twitter.com/natzuu33)
  1. [indijanc](https://twitter.com/krenkmet)
  1. 2997ms
  1. [exd0tpy](https://github.com/exd0tpy)
  1. MasterCookie
  1. StevenL
  1. bulej93
  1. Diraco
  1. [0v3rf10w](https://twitter.com/_0v3rf10w)
  1. 0x85102
  1. Yiko
  1. Bahurum
  1. chatch
  1. 0xmatt
  1. cccz
  1. [innertia](https://twitter.com/innertia_jp)
  1. reassor
  1. zzykxx
  1. 0x5rings
  1. ubermensch
  1. 0xf15ers (remora and twojoy)
  1. [Dravee](https://twitter.com/BowTiedDravee)
  1. JohnnyTime
  1. Aeros
  1. yongskiws
  1. romand
  1. dic0de
  1. peritoflores
  1. sikorico
  1. Margaret
  1. pedr02b2
  1. [ch13fd357r0y3r](https://twitter.com/ch13fd357r0y3r)
  1. Junnon
  1. Atarpara
  1. jag
  1. DimitarDimitrov
  1. [adriro](https://github.com/romeroadrian)
  1. [zishansami](https://zishansami102.github.io/)
  1. ch0bu
  1. SnowMan
  1. Saintcode\_
  1. 0xsam
  1. gianganhnguyen
  1. [WilliamAmbrozic](https://twitter.com/WilliamAmbrozic)
  1. [Tomio](https://twitter.com/meidhiwirara)
  1. samruna
  1. yaemsobak
  1. emrekocak
  1. [Tadashi](https://github.com/htadashi)
  1. tgolding55
  1. [Ocean\_Sky](https://twitter.com/bluenights004)
  1. caventa
  1. beardofginger
  1. [dharma09](https://twitter.com/im_Dharma09)
  1. malinariy
  1. lucacez
  1. subtle77
  1. [0xDanielC](https://twitter.com/DanielCawleyDev)
  1. mics
  1. w0Lfrum
  1. hxzy
  1. Amithuddar
  1. Tagir2003
  1. 0xc0ffEE
  1. [Satyam\_Sharma](https://twitter/@Satyam33sharma)
  1. Noah3o6
  1. jpserrat
  1. Matin
  1. Sta1400
  1. [mrpathfindr](https://veranos.io)
  1. francoHacker
  1. cRat1st0s
  1. cryptonue
  1. [Franfran](https://franfran.dev/)
  1. GimelSec ([rayn](https://twitter.com/rayn731) and sces60107)
  1. JGcarv
  1. Soosh

This contest was judged by [0xean](https://github.com/0xean).

Final report assembled by [liveactionllama](https://twitter.com/liveactionllama).

# Summary

The C4 analysis yielded an aggregated total of 12 unique vulnerabilities. Of these vulnerabilities, 2 received a risk rating in the category of HIGH severity and 10 received a risk rating in the category of MEDIUM severity.

Additionally, C4 analysis included 135 reports detailing issues with a risk rating of LOW severity or non-critical. There were also 141 reports recommending gas optimizations.

All of the issues presented here are linked back to their original finding.

# Scope

The code under review can be found within the [C4 VTVL contest repository](https://github.com/code-423n4/2022-09-vtvl), and is composed of 4 smart contracts written in the Solidity programming language and includes 239 lines of Solidity code.

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
## [[H-01] Loss of vested amounts](https://github.com/code-423n4/2022-09-vtvl-findings/issues/475)
_Submitted by eierina, also found by 0x52, 0xA5DF, 0xdapper, ElKu, obront, pauliax, pcarranzav, pedroais, rbserver, Ruhum, RustyRabbit, and TomJ_

[VTVLVesting.sol#L418](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L418)<br>
[VTVLVesting.sol#L147-L151](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L147-L151)<br>
[VTVLVesting.sol#L364](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L364)<br>

Vesting is a legal term that means the point in time where property is earned or gained by some person.<br>
The VTVLVesting contract defines:

*   a start time (`Claim::startTimestamp`) and an end time (`Claim::endTimestamp`) at which vesting starts and ends for a entitled user
*   the calculated points in time when the fractions of the total amount are released and therefore can be withdrawn (which are defined by `Claim::releaseIntervalSecs`).

The entitled user can either withdraw after each interval elapses, or after the whole vesting period is over or any variant of the two options.

The administrator of the contract can revoke the claim for a user at any time, which for vesting assets is expected. For example an employee with a vesting stock allocation of 1000 shares vesting at each quarter over a period of 4 years, may resign after 2 years and therefore the only half of the shares would be vested and therefore sold by the employee. The employee can either sell them at each quarter, or before, or after resigning, in any case the half of the shares have vested and are by legal right owned by the employee.

The VTVLContract revoke has the following defects:

*   it ignores the amount already vested and now yet withdrawn
*   if called, say half-way the total period, just after claimer withdraws the already vested amount, it revokes only the right to vest the remaining part in future.
*   if called, say half-way the total period, right before the claimer withdraws the already vested amount, it revokes both the already vested amount and the right to vest the remaining part in future.

Raising as high impact because it actually causes:

*   loss of already vested amounts of a user with a valid claim that has already righteously vested a part but not withdrawn
*   different outcomes depending on the order in which withdraw and revokeClaim functions are called which means that one of the two behavoiurs is certainly in conflict with the other causing a loss on one of the two sides, contract or claimer (by definition of Vesting rights, the claimer).
*   lack of trust by the potential claimers/users whch can be at any time deprived of righteously vested amounts.

### Proof of Concept

The following two tests prove the behaviour difference when the order by which revokeClaim vs withdraw are called, whch shows that the vesting right is not guaranteed.

```solidity
  // NOTE: USES ORIGINAL REVOKE BEHAVIOUR
  it('sample revoke use case USER LOSE: employee withdraw immediately after resignation', async () => {
    const {tokenContract, vestingContract} = await createPrefundedVestingContract({tokenName, tokenSymbol, initialSupplyTokens});

    const startTimestamp = await getLastBlockTs() + 100;
    const endTimestamp = startTimestamp + 2000;
    const terminationTimestamp = startTimestamp + 1000 + 50; // half-way vesting, plus half release interval which shall be discarded
    const releaseIntervalSecs = 100;

    await vestingContract.createClaim(owner2.address, startTimestamp, endTimestamp, cliffReleaseTimestamp, releaseIntervalSecs, linearVestAmount, cliffAmount);

    // move clock to termination timestamp (half-way the vesting period plus a bit, but less than release interval seconds)
    await ethers.provider.send("evm_mine", [terminationTimestamp]);
    
    let availableAmt = await vestingContract.claimableAmount(owner2.address)
    // revoke the claim preserving the "already vested but not yet withdrawn amount"
    await (await vestingContract.revokeClaim(owner2.address)).wait();
    
    let userBalanceBefore = await tokenContract.balanceOf(owner2.address);
    await expect(vestingContract.connect(owner2).withdraw()).to.be.revertedWith('NO_ACTIVE_CLAIM');
    let userBalanceAfter = await tokenContract.balanceOf(owner2.address);

    // move the clock to the programmed end of vesting period
    await ethers.provider.send("evm_mine", [endTimestamp]);

    // cliffTimestamp < startTimestamp < terminationTimestamp, hence expected cliffAmount + (1/2 * anlinearVestAmount)
    let expectedVestedAmount = cliffAmount.add(linearVestAmount.div(2));

    // RESIGNING EMPLOYEE LOSES HIS VESTED AMOUNT BECAUSE OF WITHDRAWING IMMEDIATELY AFTER RESIGNATION
    expect(userBalanceAfter.sub(userBalanceBefore)).to.be.equal(0);
    // VTVLVesting CONTRACT TOOK ALREADY VESTED AMOUNT FROM OWNER2
    expect(await vestingContract.finalClaimableAmount(owner2.address)).to.be.equal(0);
  });

  // NOTE: USES ORIGINAL REVOKE BEHAVIOUR
  it('sample revoke use case USER WIN: employee withdraw immediately before resignation', async () => {
    const {tokenContract, vestingContract} = await createPrefundedVestingContract({tokenName, tokenSymbol, initialSupplyTokens});

    const startTimestamp = await getLastBlockTs() + 100;
    const endTimestamp = startTimestamp + 2000;
    const terminationTimestamp = startTimestamp + 1000 + 50; // half-way vesting, plus half release interval which shall be discarded
    const releaseIntervalSecs = 100;

    await vestingContract.createClaim(owner2.address, startTimestamp, endTimestamp, cliffReleaseTimestamp, releaseIntervalSecs, linearVestAmount, cliffAmount);

    // move clock to termination timestamp (half-way the vesting period plus a bit, but less than release interval seconds)
    await ethers.provider.send("evm_mine", [terminationTimestamp]);

    let userBalanceBefore = await tokenContract.balanceOf(owner2.address);
    await (await vestingContract.connect(owner2).withdraw()).wait();
    let userBalanceAfter = await tokenContract.balanceOf(owner2.address);

    // revoke the claim preserving the "already vested but not yet withdrawn amount"
    await (await vestingContract.revokeClaim(owner2.address)).wait();
    
    // move the clock to the programmed end of vesting period
    await ethers.provider.send("evm_mine", [endTimestamp]);

    console.log(userBalanceAfter.sub(userBalanceBefore));
    // RESIGNING EMPLOYEE RECEIVES HIS VESTED AMOUNT BY WITHDRAWING IMMEDIATELY BEFORE RESIGNATION
    expect(userBalanceAfter.sub(userBalanceBefore)).to.be.greaterThan(0);
    expect(await vestingContract.finalClaimableAmount(owner2.address)).to.be.equal(0);
  });
```

### Recommended Mitigation Steps

Below are, in order, a test and a diff/patch for a proposed fix. The proposed fix is just an idea at how to fix, or in other words, a way to preserve the already vested amount when claim is revoked.

The diff/patch add a deactivationTimestamp to claim, and a new revokeClaimProper that shall replace the revokeClaim function to correct the behaviour.
The deactivationTimestamp is used to track the deactivation time for the claim in order to preserve the amount vested so far and allow the user to withdraw the amount righteously earned so far. The _baseVestedAmount and hasActiveClaim have been updated to do proper math when isActive is false but deactivationTimestamp is greater than 0.

The finalVestedAmount has been update to show the "what would be" amount if the vesting would have reached the claim endTimestamp while the finalClaimableAmount takes into consideration the deactivationTimestamp if the claim has been revoked.

The test shows that the already vested amount (cliff + half way linear vesting) is preserved.

```solidity
diff --git a/contracts/VTVLVesting.sol b/contracts/VTVLVesting.sol
index 133f19f..7ab955c 100644
--- a/contracts/VTVLVesting.sol
+++ b/contracts/VTVLVesting.sol
@@ -34,6 +34,7 @@ contract VTVLVesting is Context, AccessProtected {
         // Gives us a range from 1 Jan 1970 (Unix epoch) up to approximately 35 thousand years from then (2^40 / (365 * 24 * 60 * 60) ~= 35k)
         uint40 startTimestamp; // When does the vesting start (40 bits is enough for TS)
         uint40 endTimestamp; // When does the vesting end - the vesting goes linearly between the start and end timestamps
+        uint40 deactivationTimestamp;
         uint40 cliffReleaseTimestamp; // At which timestamp is the cliffAmount released. This must be <= startTimestamp
         uint40 releaseIntervalSecs; // Every how many seconds does the vested amount increase. 
         
@@ -108,7 +109,7 @@ contract VTVLVesting is Context, AccessProtected {
 
         // We however still need the active check, since (due to the name of the function)
         // we want to only allow active claims
-        require(_claim.isActive == true, "NO_ACTIVE_CLAIM");
+        require(_claim.isActive == true || _claim.deactivationTimestamp > 0, "NO_ACTIVE_CLAIM");
 
         // Save gas, omit further checks
         // require(_claim.linearVestAmount + _claim.cliffAmount > 0, "INVALID_VESTED_AMOUNT");
@@ -144,20 +145,20 @@ contract VTVLVesting is Context, AccessProtected {
     @param _claim The claim in question
     @param _referenceTs Timestamp for which we're calculating
      */
-    function _baseVestedAmount(Claim memory _claim, uint40 _referenceTs) internal pure returns (uint112) {
+    function _baseVestedAmount(Claim memory _claim, uint40 _referenceTs, uint40 vestEndTimestamp) internal pure returns (uint112) {
         uint112 vestAmt = 0;
-        
-        // the condition to have anything vested is to be active
-        if(_claim.isActive) {
+            
+        if(_claim.isActive || _claim.deactivationTimestamp > 0) {
             // no point of looking past the endTimestamp as nothing should vest afterwards
             // So if we're past the end, just get the ref frame back to the end
-            if(_referenceTs > _claim.endTimestamp) {
-                _referenceTs = _claim.endTimestamp;
+            if(_referenceTs > vestEndTimestamp) {
+                _referenceTs = vestEndTimestamp;
             }
 
             // If we're past the cliffReleaseTimestamp, we release the cliffAmount
             // We don't check here that cliffReleaseTimestamp is after the startTimestamp 
-            if(_referenceTs >= _claim.cliffReleaseTimestamp) { // @audit is _claim.require(cliffReleaseTimestamp < _claim.endTimestamp) ?
+            if(_referenceTs >= _claim.cliffReleaseTimestamp) {  // @audit note  cliffReleaseTimestamp cannot? be zero without cliffamoutn being zero
+                // @audit NOTE: (cliffReleaseTimestamp is always <= _startTimestamp <= endTimestamp, or 0 if no vesting)
                 vestAmt += _claim.cliffAmount;
             }
 
@@ -195,7 +196,8 @@ contract VTVLVesting is Context, AccessProtected {
     */
     function vestedAmount(address _recipient, uint40 _referenceTs) public view returns (uint112) {
         Claim storage _claim = claims[_recipient];
-        return _baseVestedAmount(_claim, _referenceTs);
+        uint40 vestEndTimestamp = _claim.isActive ? _claim.endTimestamp : _claim.deactivationTimestamp;
+        return _baseVestedAmount(_claim, _referenceTs, vestEndTimestamp);
     }
 
     /**
@@ -205,7 +207,18 @@ contract VTVLVesting is Context, AccessProtected {
      */
     function finalVestedAmount(address _recipient) public view returns (uint112) {
         Claim storage _claim = claims[_recipient];
-        return _baseVestedAmount(_claim, _claim.endTimestamp);
+        return _baseVestedAmount(_claim, _claim.endTimestamp, _claim.endTimestamp);
+    }
+
+    /**
+    @notice Calculates how much wil be possible to claim at the end of vesting date, by subtracting the already withdrawn
+            amount from the vestedAmount at this moment. Vesting date is either the end timestamp or the deactivation timestamp.
+    @param _recipient - The address for whom we're calculating
+    */
+    function finalClaimableAmount(address _recipient) external view returns (uint112) {
+        Claim storage _claim = claims[_recipient];
+        uint40 vestEndTimestamp = _claim.isActive ? _claim.endTimestamp : _claim.deactivationTimestamp;
+        return _baseVestedAmount(_claim, vestEndTimestamp, vestEndTimestamp) - _claim.amountWithdrawn;
     }
     
     /**
@@ -214,7 +227,8 @@ contract VTVLVesting is Context, AccessProtected {
     */
     function claimableAmount(address _recipient) external view returns (uint112) {
         Claim storage _claim = claims[_recipient];
-        return _baseVestedAmount(_claim, uint40(block.timestamp)) - _claim.amountWithdrawn;
+        uint40 vestEndTimestamp = _claim.isActive ? _claim.endTimestamp : _claim.deactivationTimestamp;
+        return _baseVestedAmount(_claim, uint40(block.timestamp), vestEndTimestamp) - _claim.amountWithdrawn;
     }
     
     /** 
@@ -280,6 +294,7 @@ contract VTVLVesting is Context, AccessProtected {
         Claim memory _claim = Claim({
             startTimestamp: _startTimestamp,
             endTimestamp: _endTimestamp,
+            deactivationTimestamp: 0,
             cliffReleaseTimestamp: _cliffReleaseTimestamp,
             releaseIntervalSecs: _releaseIntervalSecs,
             cliffAmount: _cliffAmount,
@@ -436,6 +451,30 @@ contract VTVLVesting is Context, AccessProtected {
         emit ClaimRevoked(_recipient, amountRemaining, uint40(block.timestamp), _claim);
     }
 
+    function revokeClaimProper(address _recipient) external onlyAdmin hasActiveClaim(_recipient) {
+        // Fetch the claim
+        Claim storage _claim = claims[_recipient];
+        // Calculate what the claim should finally vest to
+        uint112 finalVestAmt = finalVestedAmount(_recipient);
+
+        // No point in revoking something that has been fully consumed
+        // so require that there be unconsumed amount
+        require( _claim.amountWithdrawn < finalVestAmt, "NO_UNVESTED_AMOUNT");
+
+        _claim.isActive = false;
+        _claim.deactivationTimestamp = uint40(block.timestamp);
+
+        uint112 vestedSoFarAmt = vestedAmount(_recipient, uint40(block.timestamp));
+        // The amount that is "reclaimed" is equal to the total allocation less what was already
+        // vested without the part that was already withdrawn.
+        uint112 amountRemaining = finalVestAmt - (vestedSoFarAmt - _claim.amountWithdrawn);
+
+        numTokensReservedForVesting -= amountRemaining; // Reduces the allocation
+
+        // Tell everyone a claim has been revoked.
+        emit ClaimRevoked(_recipient, amountRemaining, uint40(block.timestamp), _claim);
+    }
+
     /**
     @notice Withdraw a token which isn't controlled by the vesting contract.
     @dev This contract controls/vests token at "tokenAddress". However, someone might send a different token. 

```

**[lawrencehui (VTVL) confirmed and commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/475#issuecomment-1271750623):**
 > Thank you warden for the findings. We did think about adding a grace withdrawing period to further strengthen the users' trust to the admin. I would argue that severity is medium in the case as in practical sense we would assume admin will inform the receivers upon revocation and therefore withdrawAdmin was designed to be separated from revokeClaim. 
> 
> I acknowledge that some malicious admin might abuse this right and to claimed the receiver's already earned token before they claimed (as described in the scenario in this findings) and therefore we will consider adding the grace period to restrict admin to act maliciously.

**[0xean (judge) commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/475#issuecomment-1272152502):**
 > I am going to stick with High, even a non malicious admin would have no choice but to kindly ask a user to claim before they revoked all their other tokens. If the user didn't comply, the admin has no option but to either "steal" their tokens or allow them to keep vesting. 



***

## [[H-02] Permanent freeze of vested tokens due to overflow in `_baseVestedAmount`](https://github.com/code-423n4/2022-09-vtvl-findings/issues/95)
*Submitted by Trust, also found by 0xSky, bin2chen, CertoraInc, hansfriese, KIntern&#95;NA, neko&#95;nyaa, neumo, rokinot, and wastewa*

[VTVLVesting.sol#L176](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L176)<br>

The \_baseVestedAmount() function calculates vested amount for some (claim, timestamp) pair. It is wrapped by several functions, like vestedAmount, which is used in withdraw() to calculate how much a user can retrieve from their claim. Therefore, it is critical that this function will calculate correctly for users to receive their funds.

Below is the calculation of the linear vest amount:

    uint112 linearVestAmount = _claim.linearVestAmount * truncatedCurrentVestingDurationSecs / finalVestingDurationSecs;

Importantly, \_claim.linearVestAmount is of type uint112 and truncatedCurrentVestingDurationSecs is of type uint40. Using compiler >= 0.8.0,  the product cannot exceed uint112 or else the function reverts due to overflow. In fact, we can show that uint112 is an inadequate size for this calculation.

The max value for uint112 is 5192296858534827628530496329220096.<br>
Seconds in year = 3600 &ast; 24 &ast; 365 = 31536000<br>
Tokens that inherit from ERC20 like the ones used in VTVL have 18 decimal places -> 1000000000000000000<br>
This means the maximum number of tokens that are safe to vest for one year is 2&ast;&ast;112 / 10e18 / (3600 &ast; 24 &ast; 365) = just 16,464,665 tokens.
This is definitely not a very large amount and it is expected that some projects will mint a similar or larger amount for vesting for founders / early employees. For 4 year vesting, the safe amount drops to 4,116,166.<br>
Projects that are not forewarned about this size limit are likely to suffer from freeze of funds of employees, which will require very patchy manual revocation and restructuring of the vesting to not overflow.

### Impact

Employees/founders do not have access to their vested tokens.

### Proof of Concept

Below is a test that demonstrates the overflow issue, 1 year after 17,000,000 tokens have matured.

    describe('Long vest fail', async () => {
      let vestingContract: VestingContractType;
      // Default params
      // linearly Vest 10000, every 1s, between TS 1000 and 2000
      // additionally, cliff vests another 5000, at TS = 900
      const recipientAddress = await randomAddress();
      const startTimestamp = BigNumber.from(1000);
      const endTimestamp = BigNumber.from(1000 + 3600 * 24 * 365);
      const midTimestamp = BigNumber.from(1000 + (3600 * 24 * 365) / 2);
      const cliffReleaseTimestamp = BigNumber.from(0);
      const linearVestAmount = BigNumber.from('170000000000000000000000000');
      const cliffAmount = BigNumber.from(0);
      const releaseIntervalSecs = BigNumber.from(5);

      before(async () => {
        const {vestingContract: _vc} = await createPrefundedVestingContract({tokenName, tokenSymbol, initialSupplyTokens});
        vestingContract = _vc;
        await vestingContract.createClaim(recipientAddress, startTimestamp, endTimestamp, cliffReleaseTimestamp, releaseIntervalSecs, linearVestAmount, cliffAmount);
      });

      it('half term works', async() => {
        expect(await vestingContract.vestedAmount(recipientAddress, midTimestamp)).to.be.equal('85000000000000000000000000');
      });

      it('full term fails', async() => {
        // Note: at exactly the cliff time, linear vested amount won't yet come in play as we're only at second 0
        await expect(vestingContract.vestedAmount(recipientAddress, endTimestamp)).to.be.revertedWithPanic(0x11
        );
      });
    });

### Tools Used

Manual audit, hardhat / chai.

### Recommended Mitigation Steps

Perform the intermediate calculation of linearVestAmount using the uint256 type.

    uint112 linearVestAmount = uint112( uint256(_claim.linearVestAmount) * truncatedCurrentVestingDurationSecs / finalVestingDurationSecs);

**[lawrencehui (VTVL) confirmed and commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/95#issuecomment-1271760558):**
 > This finding is very useful and appreciate all wardens that flagged the potential risk of overflowing.



***
 
# Medium Risk Findings (10)
## [[M-01] Supply cap of `VariableSupplyERC20Token` is not properly enforced](https://github.com/code-423n4/2022-09-vtvl-findings/issues/3)
*Submitted by Czar102, also found by &#95;&#95;141345&#95;&#95;, 0xbepresent, 0xDecorativePineapple, 0xmatt, 0xNazgul, 0xSky, adriro, ajtra, Atarpara, Bahurum, bin2chen, cccz, cRat1st0s, cryptonue, d3e4, DimitarDimitrov, Franfran, GimelSec, innertia, jag, JGcarv, JLevick, joestakey, Junnon, neumo, obront, OptimismSec, pashov, pauliax, pcarranzav, peanuts, rajatbeladiya, rbserver, reassor, Rolezn, Ruhum, seyni, Soosh, Tomo, Trust, wagmi, zzykxx, and zzzitron*

[VariableSupplyERC20Token.sol#L36-L46](https://github.com/code-423n4/2022-09-vtvl/blob/main/contracts/token/VariableSupplyERC20Token.sol#L36-L46)<br>

The admin of the token is not constrained to minting `maxSupply_`, they can mint any number of tokens.

### Proof of Concept

```js
// If we're using maxSupply, we need to make sure we respect it
// mintableSupply = 0 means mint at will
if(mintableSupply > 0) {
	require(amount <= mintableSupply, "INVALID_AMOUNT");
	// We need to reduce the amount only if we're using the limit, if not just leave it be
	mintableSupply -= amount;
}
```

The logic is as follows: if the amount that can be minted is zero, treat this as an infinite mint. Else require that the minted amount is not larger than mintable supply.

One can note that it is possible to mint all mintable supply. Then the mintable supply will be `0` which will be interpreted as infinity and any number of tokens will be possible to be minted.

### Recommended Mitigation Steps

Treat `2 ** 256 - 1` as infinity instead of `0`.

**[0xean (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/3#issuecomment-1256802394):**
 > The warden's logic is correct, but given that this is behind an admin only flag, there are some external factors that would need to come into play for this to be realized. Downgrading to Medium severity. 

**[lawrencehui (VTVL) confirmed](https://github.com/code-423n4/2022-09-vtvl-findings/issues/3)**



***

## [[M-02] `_baseVestedAmount()` and `vestedAmount()` Return Incorrect Historical Values](https://github.com/code-423n4/2022-09-vtvl-findings/issues/104)
_Submitted by Respx, also found by m9800_

[VTVLVesting.sol#L183-L187](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L183-L187)<br>
[VTVLVesting.sol#L198](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L198)<br>

As the comments in `_baseVestedAmount()` explain, once there is any `_claim.amountWithdrawn`, it will be returned if it is greater than the calculated value `vestAmt`. However, `vestAmt` takes account of time, `_referenceTs`, whereas `_claim.amountWithdrawn` is always the amount withdrawn to date. Therefore, for all historical values below `_claim.amountWithdrawn`, including timestamps before `_claim.startTimestamp` and before `_claim.cliffReleaseTimestamp`, `_claim.amountWithdrawn` will be returned.

### Impact

Given that VTVL is intended to be an accessible platform for use by a wide variety of users, this behaviour does create a security risk. Consider these scenarios:

*   A protocol relies on VTVL as an off-the-shelf solution for vesting, but builds other systems (escrow, NFT grants, access, airdrops) that work by checking the value of `vestedAmount()`. Airdrops are especially likely to be interested in historical values. These values would be distorted by how much users have claimed and so would result in an undesirable distribution of resources.
*   Even if the above does not occur, consider that VTVL might be passed over as a vesting solution precisely because its historical data is inaccurate.
*   A contract could be built that inherits from `VTVLVesting` and attempts to use `_baseVestedAmount()` (which is `internal` and so can be used by inheriting contracts). The inheriting contract might apportion rewards based on historical usage.
*   VTVL itself might wish to inherit from `VTVLVesting` in future.

### Proof of Concept

```diff
diff --git a/test/VTVLVesting.ts b/test/VTVLVestingPOC.ts
index bb609fb..073e53f 100644
--- a/test/VTVLVesting.ts
+++ b/test/VTVLVestingPOC.ts
@@ -500,14 +500,37 @@ describe('Revoke Claim', async () => {
   const recipientAddress = await randomAddress();
   const [owner, owner2] = await ethers.getSigners();
 
-  it('allows admin to revoke a valid claim', async () => {
+  it('POC: WITHDRAWN DATA IS UNRELIABLE', async () => {
     const {vestingContract} = await createPrefundedVestingContract({tokenName, tokenSymbol, initialSupplyTokens});
-    await vestingContract.createClaim(recipientAddress, startTimestamp, endTimestamp, cliffReleaseTimestamp, releaseIntervalSecs, linearVestAmount, cliffAmount);
+    const startTimestamp2 = startTimestamp.add(releaseIntervalSecs.mul(100));
+    const endTimestamp2 = endTimestamp.add(releaseIntervalSecs.mul(100));
+    const cliffReleaseTimestamp2 = cliffReleaseTimestamp.add(releaseIntervalSecs.mul(100));
+    await vestingContract.createClaim(owner2.address, startTimestamp2, endTimestamp2, cliffReleaseTimestamp2, releaseIntervalSecs, linearVestAmount, cliffAmount);
+
+    // Fast forward to middle of claim
+    const halfWay = startTimestamp2.toNumber() + (endTimestamp2.toNumber()-startTimestamp2.toNumber())/2;
+    await ethers.provider.send("evm_mine", [halfWay]);
+
+    let vestAmt = await vestingContract.vestedAmount(owner2.address, startTimestamp);
+    console.log("NO WITHDRAWAL, BEFORE VEST START: ",vestAmt.toString());
+    vestAmt = await vestingContract.vestedAmount(owner2.address, startTimestamp2);
+    console.log("NO WITHDRAWAL, AT VEST START: ",vestAmt.toString());
+    vestAmt = await vestingContract.vestedAmount(owner2.address, halfWay);
+    console.log("NO WITHDRAWAL, HALF WAY THROUGH VEST: ",vestAmt.toString());
+    vestAmt = await vestingContract.vestedAmount(owner2.address, endTimestamp2);
+    console.log("NO WITHDRAWAL, AT VEST END: ",vestAmt.toString());
+
+    await (await vestingContract.connect(owner2).withdraw()).wait();
 
-    (await vestingContract.revokeClaim(recipientAddress)).wait();
+    vestAmt = await vestingContract.vestedAmount(owner2.address, startTimestamp);
+    console.log("WITHDRAWAL, BEFORE VEST START: ",vestAmt.toString());
+    vestAmt = await vestingContract.vestedAmount(owner2.address, startTimestamp2);
+    console.log("WITHDRAWAL, AT VEST START: ",vestAmt.toString());
+    vestAmt = await vestingContract.vestedAmount(owner2.address, halfWay);
+    console.log("WITHDRAWAL, HALF WAY THROUGH VEST: ",vestAmt.toString());
+    vestAmt = await vestingContract.vestedAmount(owner2.address, endTimestamp2);
+    console.log("WITHDRAWAL, AT VEST END: ",vestAmt.toString());
 
-    // Make sure it gets reverted
-    expect(await (await vestingContract.getClaim(recipientAddress)).isActive).to.be.equal(false);
   });
 
   it('prohibits a random user from revoking a valid claim', async () => {
```

### Recommended Mitigation Steps

For active claims, there is no reason to consider `_claim.amountWithdrawn`, as it will always have been below or equal to `vestAmt` at any point in time. So only consider `vestAmt` for inactive claims. For them, return the lowest of `vestAmt` and  `_claim.amountWithdrawn`. This will keep the values monotonic with time without distorting the historical values. It will act as though `_claim.amountWithdrawn` was withdrawn and the claim was revoked in the block when `vestAmt` reached `_claim.amountWithdrawn`. That is a distortion,0xean but it is required to provide monotonicity.

**[0xean (judge) commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/104#issuecomment-1257255246):**
 > Good find. 

**[lawrencehui (VTVL) confirmed](https://github.com/code-423n4/2022-09-vtvl-findings/issues/104)**



***

## [[M-03] Possible DoS on `vestingRecipients` due to lack of disposal mechanism](https://github.com/code-423n4/2022-09-vtvl-findings/issues/128)
_Submitted by fatherOfBlocks, also found by wagmi_

[VTVLVesting.sol#L224](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L224)<br>
[VTVLVesting.sol#L245](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L245)<br>
[VTVLVesting.sol#L302](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L302)<br>
[VTVLVesting.sol#L317](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L317)<br>

When the smart contracts start to be used, the variable in storage vestingRecipients will start to be filled with addresses, as there is no mechanism to eliminate elements, this will cause the `allVestingRecipients()` function to generate a DoS yes has many addressess.

### Recommended Mitigation Steps

In the `withdraw()` function you could remove the element from `vestingRecipients` that no longer has vesting. This would make the variable not grow without reducing elements.

**[0xean (judge) commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/128#issuecomment-1257069235):**
 > On the fence on this one.  I agree with the warden, but in the current implementation `allVestingRecipients` is unused and assumed to be for external, off chain uses so the impact is hard to determine. Going to leave as Medium, pending sponsor review.

**[lawrencehui (VTVL) confirmed and commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/128#issuecomment-1270859394):**
 > I would agree with the warden on the lack of control for an ever-growing array size could be an issue. I will tag this as an enhancement. 
> 
> On the side, I want to check what is the allowed max size of the array in this case? `2**256 -1`? but theoretically calling a large array would exceed the the block gas limit when retrieving it?

**[0xean (judge) commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/128#issuecomment-1272143412):**
 > @lawrencehui - Yes retrieval will eventually fail, long before you populate the array fully. You could pass in an index range to retrieve portions of the array to avoid this failure mode. 
>
> And yes `2**256 -1` is my understanding of the theoretical limit. 



***

## [[M-04] not able to create claim](https://github.com/code-423n4/2022-09-vtvl-findings/issues/140)
*Submitted by rajatbeladiya, also found by 0x4non, ak1, berndartmueller, CertoraInc, Chom, imare, JLevick, joestakey, JohnSmith, KIntern&#95;NA, obront, rbserver, rotcivegaf, Ruhum, RustyRabbit, and supernova*

If admin revoked any recipient’s claim, admin can not create claim for the same recipient because `startTimestamp` is not updated to initial value on revoke claim.<br>
There will be a need to create a claim again for any reason like: 1) mistakenly revoked claim, 2) wrong info provided to claim, 3) new vesting period starts, etc.

### Proof of Concept

1.  Alice creates claim for Bob
2.  Alice revokes claim of Bob
    *   On `revokeClaim()`, claim's `isActive` will be false, but `startTimestamp` will remain as it is
    *   [VTVLVesting.sol#L418-L437](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L418-L437)
3.  Alice tries to create claim for Bob but claim will not create because it has modifier `hasNoClaim()` which is checked for claim should not active and it checks for `require(_claim.startTimestamp == 0, "CLAIM_ALREADY_EXISTS");`

*   [VTVLVesting.sol#L245-L253](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L245-L253)
*   [VTVLVesting.sol#L123-L140](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L123-L140)

### Recommended Mitigation Steps

Update `startTimestamp to 0` on `revokeClaim()`.

**[0xean (judge) decreased severity to Low and commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/140#issuecomment-1257040023):**
 > Downgrading to low severity. While true, why wouldn't the employee just use a different address?  There is no residual benefit to using the old address (unless it was a smart contract, which the warden doesn't mention as part of their POC).  The sponsor may want to fix this, since the fix is simple, but it poses very little risk and certainly no direct loss of funds. 

**[0xean (judge) increased severity to Medium and commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/140#issuecomment-1257197630):**
 > Spent a bit more time thinking about this one and do think that it qualifies as Medium severity since it does affect the availability of the protocol in a number of ways. Going to go ahead and revise to Medium. 

**[lawrencehui (VTVL) acknowledged, but disagreed with severity and commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/140#issuecomment-1270868222):**
 > The vesting contract is designed to be created and used in a one-off manner and the revoke function is to prevent any mistakes made upon creation (wrong address / amount / timestamp etc.). In practical sense, if a claim (or the recipient address) is revoked, one (the admin) can always create a new vesting contract with the correct claim parameters. 
> 
> I therefore think that it is by design that the address is only able be claimable once per vesting contract, in all circumstance, the admin can re-create a new vesting contract to mitigate this issue and therefore this is a low risk / non-critical issue. 

**[0xean (judge) commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/140#issuecomment-1272144853):**
 > I don't think the tactic of deploying a new contract is the correct one here simply to be able to set up vesting for one botched person or someone whose vesting token amount changes for example. I am going to stick with the Medium severity on this one, but do appreciate the response and thoughts on possible mitigations.

**[ak1 (warden) commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/140#issuecomment-1279883877):**
 > I have explained one of the real use case scenarios where this protocol will fail to serve many. Refer to [issue 384](https://github.com/code-423n4/2022-09-vtvl-findings/issues/384).<br>
> It is not always contract address or EOA which will decide the identity of a person. Each one will have unique ID. That id is going to be used in all the places.



***

## [[M-05] Tokens with lower number of decimals can result in postponed linear vesting for user](https://github.com/code-423n4/2022-09-vtvl-findings/issues/191)
_Submitted by pashov_

[VTVLVesting.sol#L174](https://github.com/code-423n4/2022-09-vtvl/blob/69da6e96f94ff3e02b9bb6175e6de2b3e71d3eb0/contracts/VTVLVesting.sol#L174)<br>

In the `_baseVestedAmount` of `VTVLVesting.sol` we see the following code

```solidity
uint40 finalVestingDurationSecs = _claim.endTimestamp - _claim.startTimestamp; // length of the interval
uint112 linearVestAmount = _claim.linearVestAmount * truncatedCurrentVestingDurationSecs / finalVestingDurationSecs;
```

Let’s look at `truncatedCurrentVestingDurationSecs` as just the duration passed from the start of the vesting period for the PoC (this doesn’t omit important data in this context).

Now think of the following scenario:

We have a token `$TKN` that has 6 decimals (those are the decimals of both USDT & USDC). We want to distribute 10,000 of those tokens to a user vested over a 10 year period.

10 years in seconds is 315360000 &ast;&ast;&ast;&ast;(this is `finalVestingDurationSecs`)

This means that we will distribute 10,000 &ast; 10^6 = 10 000 000 000 fractions of a token for 315360000 seconds, meaning we will distribute 310 fractions of a token each second - this is `linearVestAmount`

Now, since `finalVestingDurationSecs` is so big (315360000) it will almost always round `linearVestAmount` to zero when dividing by it, up until

`_claim.linearVestAmount * truncatedCurrentVestingDurationSecs` becomes a bigger number than 315360000, but since `_claim.linearVestAmount` is 310 we will need the current vesting duration to be at least 1 017 290 seconds which is **12** days postponed vesting. 12 days in a moving market can make a big difference if the user was expecting the tokens to start vesting from the first day.

### Impact

Unexpected postponing of vesting can result in waiting times for users to receive their must-be-vested tokens. This period can be used by other token holders to dump the token and decrease the price of it, resulting in a loss of capital for the vesting receiver.

### Recommended Mitigation Steps

Enforce the contract to work with only 18 decimal tokens with a `require` statement in the constructor.

**[0xean (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/191#issuecomment-1257051653):**
 > Downgrading to Medium, there are a lot of external factors presented here by the warden to line up to a loss of funds.  

**[lawrencehui (VTVL) acknowledged, but disagreed with severity and commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/191#issuecomment-1270955314):**
 > I acknowledge the warden's concern of the rounding, but I think the result of loss of funds is one of the extreme edge cases. I would suggest instead of restricting only to 18 decimal tokens (which is impractical as we would also want to include USDC and USDT for vesting too!), I would implement the rounding checking in the frontend UI and prompt user of potential delay caused by rounding / truncation as described in this issue.

**[0xean (judge) commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/191#issuecomment-1272146188):**
 > Given that smart contracts can be interacted with in any number of ways (etherscan, programmatically, etc), I don't think the mitigation negates the risk entirely and am going to stick with the Medium severity here.  The wardens demonstrates clearly the way in which this can happen. While it may be a bit outside of the normal vesting schedule expected, I do think it's valuable to understand the bounds of the math you have employed here.



***

## [[M-06] Variable balance token causing fund lock and loss](https://github.com/code-423n4/2022-09-vtvl-findings/issues/278)
*Submitted by &#95;&#95;141345&#95;&#95;, also found by 0xDecorativePineapple, CertoraInc, djxploit, hyh, IllIllI, JohnSmith, MiloTruck, rbserver, and zzzitron*

[VTVLVesting.sol#L295](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L295)<br>
[VTVLVesting.sol#L388](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L388)<br>

Some ERC20 token's balance could change, one example is stETH. The balance could become insufficient at the time of `withdraw()`. User's fund will be locked due to DoS. The way to take the fund out is to send more token into the contract, causing fund loss to the protocol. And there is no guarantee that until the end time the balance would stay above the needed amount, the lock and loss issue persist.

### Proof of Concept

For stETH like tokens, the `balanceOf()` value might go up or down, even without transfer.

```solidity
// stETH
    function balanceOf(address who) external override view returns (uint256) {
        return _shareBalances[who].div(_sharesPerToken);
    }
```

In `VTVLVesting`, the `require` check for the spot `balanceOf()` value will pass, but it is possible that as time goes on, the value become smaller and fail the transfer. As a result, the `withdraw()` call will revert, causing DoS, and lock user's fund.

```solidity
// contracts/VTVLVesting.sol
    function _createClaimUnchecked() private  hasNoClaim(_recipient) {
        // ...
        require(tokenAddress.balanceOf(address(this)) >= numTokensReservedForVesting + allocatedAmount, "INSUFFICIENT_BALANCE");
        // ...
    }

    function withdraw() hasActiveClaim(_msgSender()) external {
        // ...
        tokenAddress.safeTransfer(_msgSender(), amountRemaining);
        // ...
    }
```

### Reference

<https://etherscan.io/address/0x312ca0592a39a5fa5c87bb4f1da7b77544a91b87#code>

### Recommended Mitigation Steps

Disallow such kind of variable balance token.

**[0xean (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/278#issuecomment-1257053341):**
 > stETH only rebases up, not down.  So that is a poor example.
> 
> The sponsor's README does say they will support any ERC20 token, so that could include Fee on Transfer or downward rebasing tokens which could lead to less tokens in the contract than expected and transfers to revert due to balances being lower than expected. 
> 
> Downgrading to Medium as the external requirement is using these contracts on tokens that are known to have variable supply.

**[lawrencehui (VTVL) confirmed and commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/278#issuecomment-1270993220):**
 > Thanks for reporting this and I will add this as a feature enhancement to cater / avoid for tokens with rebasing supplies. 
> 
> Question: Is there a straight forward way to detect rebasing tokens? Or on the flip side, restricting erc20 tokens that do not exhibit rebasing behaviour?

**[0xean (judge) commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/278#issuecomment-1272148124):**
 > @lawrencehui - Great question.  There isn't a great way to detect this functionality in any generic manner unfortunately. 
> 
> Most contracts that want to handle FOT tokens will do something like (in pseudocode)
> 
> ```
> uint256 balBefore = ERC20.balanceOf(address(this));
> ERC20.transferFrom(...);
> uint256 balAfter= ERC20.balanceOf(address(this));
> uint256 actualBalChange = balAfter - balBefore;
> ```
> 
> Rebasing tokens are different again, and the easiest way to handle them is to create shares to track the internal math.  The shares track the % ownership of the entire balance of the contract.  Probably more than I can explain here, but would be happy to work with you if this is something you are interested in.



***

## [[M-07] Vesting Schedule Start and End Time can be Set in the Past ](https://github.com/code-423n4/2022-09-vtvl-findings/issues/292)
_Submitted by TomJ, also found by ayeslick, csanuragjain, and pashov_

[VTVLVesting.sol#L245-L304](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L245-L304)<br>

There is no check whether `_startTimestamp` and `_endTimestamp` is greater than `block.timestamp`
at `VTVLVesting.sol` `_createClaimUnchecked` function. Therefore it is possible for administrators to accidentally create
vesting schedule that starts and ends in the past without noticing it. When administrators does this and this transaction goes
through, then the vesting recipients can withdraw their entire vest amount which is not what administrators intended to do.
Add require check that force `_startTimestamp` to be greater than `block.timestamp`.

Team comments as below on line 260

    // -> Conclusion: we want to allow this, for founders that might have forgotten to add some users, or to avoid issues with 
    transactions not going through because of discoordination between block.timestamp and sender's local time

However this is not an issue by adding `require(_startTimestamp > uint40(block.timestamp))` since this will revert
transaction if \_startTimestamp is less than block.timestamp so administrators can simply try again with correct time.
On the other hand, it is more dangerous to not include this check because transaction will simply succeed even though
\_startTimestamp is set to past which means that there is a chance of administrators not noticing this.

### Proof of Concept

1. Admin creates new vesting schedule using `createClaim` function. However admin mistakenly set `_startTimestamp` and `_endTimestamp` in the past.
2. Since there is no check of `require(_startTimestamp > uint40(block.timestamp))`, this transaction is valid and claim
is created.
3. Vesting recipients calls the `withdraw` function and receive entire vest amount.

### Recommended Mitigation Steps

Add following check in `VTVLVesting.sol:_createClaimUnchecked` function.

    require(_startTimestamp > uint40(block.timestamp), "INVALID_START_TIMESTAMP")

**[0xean (judge) commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/292#issuecomment-1257257193):**
 > Going to use this issue for encompassing a few different reports that all revolve around adding some better validation around timestamps.  These include a few different potential fixes that the sponsor can review, but ultimately point to the same underlying issues.

**[lawrencehui (VTVL) acknowledged, but disagreed with severity and commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/292#issuecomment-1270998197):**
 > As described in the documentation, this back dated (`startTimestamp < block.timestamp`) feature is indeed intended as there are many real life cases that founders want to reward their employees in the way the vesting period starts well before Token Generation Event (TGE). 
> 
> We appreciate wardens' feedback on additional checking (both start and end time) and in our actual application, we would include multiple layer of checking / approval processes in front and backend before the transaction signing happens and therefore the risk is low in our opinion. 



***

## [[M-08] Two address tokens can be withdrawn by the admin even if they are vested](https://github.com/code-423n4/2022-09-vtvl-findings/issues/429)
_Submitted by CertoraInc, also found by 0xhunter, datapunk, dipp, Lambda, and wuwe1_

[VTVLVesting.sol#L446-L451](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L446-L451)<br>

Two address tokens exist in the blockchain. For example, Synthetix's `ProxyERC20` contract is such a token which exists in many forms (sUSD, sBTC...). Tokens as such can be vested, but the admin can withdraw them even if they are vested by providing the other address to the `withdrawOtherToken` function. The only check in this function is that `_otherTokenAddress != tokenAddress`, which is irrelevant in the case of two address tokens.

This can make the admin be able to withdraw the vested funds and break the system, because the balance of the contract can be less than the vested amount.

### Proof of Concept

1.  The `VTVLVesting` is deployed with the `sUSD` contract, using its main (proxy) address - `0x57Ab1ec28D129707052df4dF418D58a2D46d5f51`.
2.  A claim is created for Alice, vesting 1000 sUSD in linear vesting. Assuming this is the only claim currently, the balance of the contract is 1000 sUSD and the value of `numTokensReservedForVesting` is `1000e18`.
3.  The admin calls the `withdrawOtherToken` for 1000e18 sUSD, providing its second address - `0x57Ab1ec28D129707052df4dF418D58a2D46d5f51`. The value of `numTokensReservedForVesting` is still `1000e18`, but the balance of the contract is now 0 sUSD.
4.  Alice waits for her vest to end, calls the withdraw function, but the function reverts on the call to `safeTransfer()` because there is insufficient balance of sUSD. Alice can't receive her funds.

### Recommended Mitigation Steps

Replace the address check with a balance check - record the vesting token balance of the contract before and after the transfer and assert that they are equal.

**[0xean (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/429#issuecomment-1257055160):**
 > Downgrading to Medium. The fix is a good idea, but this is a pretty rare token implementation and definitely qualifies as an external factor. 

**[lawrencehui (VTVL) acknowledged and commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/429#issuecomment-1271301629):**
 > Yes, agreed with @0xean that this is very rare and appreciate warden's suggestion on the fix on balance checking.



***

## [[M-09] `_releaseIntervalSecs` is not validated](https://github.com/code-423n4/2022-09-vtvl-findings/issues/448)
_Submitted by sorrynotsorry_

VTVLVesting.sol has `_createClaimUnchecked` function to create the claims internally while validating parameters with the users' allocations.<br>
However, `_releaseIntervalSecs` is not validated comparing to user's  `_linearVestAmount` and `_startTimestamp` `_endTimestamp`.
Theoretically, `_linearVestAmount` should be equal to `((_endTimestamp - _startTimestamp) * _releaseIntervalSecs)` so the `_releaseIntervalSecs` = `_linearVestAmount / ((_endTimestamp - _startTimestamp)`.<br>
But this check was never done.

If the `_releaseIntervalSecs` is validated either to a higher or to a lower amount, it will create unfair distributions amongst the users during withdrawals due to being higher/lower than it should be. And also it may end up with the last withdrawals can be reverted due to the calculation board not matching.

### Proof of Concept

```solidity
    function _createClaimUnchecked(
            address _recipient, 
            uint40 _startTimestamp, 
            uint40 _endTimestamp, 
            uint40 _cliffReleaseTimestamp, 
            uint40 _releaseIntervalSecs, 
            uint112 _linearVestAmount, 
            uint112 _cliffAmount
                ) private  hasNoClaim(_recipient) {


        require(_recipient != address(0), "INVALID_ADDRESS");
        require(_linearVestAmount + _cliffAmount > 0, "INVALID_VESTED_AMOUNT"); // Actually only one of linearvested/cliff amount must be 0, not necessarily both
        require(_startTimestamp > 0, "INVALID_START_TIMESTAMP");
        // Do we need to check whether _startTimestamp is greater than the current block.timestamp? 
        // Or do we allow schedules that started in the past? 
        // -> Conclusion: we want to allow this, for founders that might have forgotten to add some users, or to avoid issues with transactions not going through because of discoordination between block.timestamp and sender's local time
        // require(_endTimestamp > 0, "_endTimestamp must be valid"); // not necessary because of the next condition (transitively)
        require(_startTimestamp < _endTimestamp, "INVALID_END_TIMESTAMP"); // _endTimestamp must be after _startTimestamp
        require(_releaseIntervalSecs > 0, "INVALID_RELEASE_INTERVAL");
        require((_endTimestamp - _startTimestamp) % _releaseIntervalSecs == 0, "INVALID_INTERVAL_LENGTH");


        // Potential TODO: sanity check, if _linearVestAmount == 0, should we perhaps force that start and end ts are the same?


        // No point in allowing cliff TS without the cliff amount or vice versa.
        // Both or neither of _cliffReleaseTimestamp and _cliffAmount must be set. If cliff is set, _cliffReleaseTimestamp must be before or at the _startTimestamp
        require( 
            (
                _cliffReleaseTimestamp > 0 && 
                _cliffAmount > 0 && 
                _cliffReleaseTimestamp <= _startTimestamp
            ) || (
                _cliffReleaseTimestamp == 0 && 
                _cliffAmount == 0
        ), "INVALID_CLIFF");


        Claim memory _claim = Claim({
            startTimestamp: _startTimestamp,
            endTimestamp: _endTimestamp,
            cliffReleaseTimestamp: _cliffReleaseTimestamp,
            releaseIntervalSecs: _releaseIntervalSecs,
            cliffAmount: _cliffAmount,
            linearVestAmount: _linearVestAmount,
            amountWithdrawn: 0,
            isActive: true
        });
        // Our total allocation is simply the full sum of the two amounts, _cliffAmount + _linearVestAmount
        // Not necessary to use the more complex logic from _baseVestedAmount
        uint112 allocatedAmount = _cliffAmount + _linearVestAmount;


        // Still no effects up to this point (and tokenAddress is selected by contract deployer and is immutable), so no reentrancy risk 
        require(tokenAddress.balanceOf(address(this)) >= numTokensReservedForVesting + allocatedAmount, "INSUFFICIENT_BALANCE");


        // Done with checks


        // Effects limited to lines below
        claims[_recipient] = _claim; // store the claim
        numTokensReservedForVesting += allocatedAmount; // track the allocated amount
        vestingRecipients.push(_recipient); // add the vesting recipient to the list
        emit ClaimCreated(_recipient, _claim); // let everyone know
    }
```

[Permalink](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L245-L304)

### Recommended Mitigation Steps

The `_releaseIntervalSecs` should be validated comparing to user's  `_linearVestAmount` and `_startTimestamp` `_endTimestamp`.

**[0xean (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/448#issuecomment-1257056265):**
 > This is fair, but due to it being behind only admin functionality and coming down to input sanitization, going to downgrade to Medium.  

**[lawrencehui (VTVL) acknowledged, but disagreed with severity and commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/448#issuecomment-1271710784):**
 > I agree with @0xean that the risk in this case is low given the onlyAdmin modifier and the input will be validated from the frontend anyway. Appreciate the finding and we will take consideration of adding additional checking of `_releaseIntervalSecs`.



***

## [[M-10] Reentrancy may allow an admin to steal funds](https://github.com/code-423n4/2022-09-vtvl-findings/issues/6)
*Submitted by Czar102, also found by 0xSmartContract, csanuragjain, hansfriese, Lambda, Respx, and sashik&#95;eth*

[VTVLVesting.sol#L394-L411](https://github.com/code-423n4/2022-09-vtvl/blob/main/contracts/VTVLVesting.sol#L394-L411)<br>

If the token is reentrant, an admin can steal all tokens locked in the `VTVLVesting` contract while having active locks.

In other words, due to this exploit possibility, the contract may be insolvent with respect to *active* vestings. Note that revoking claim doesn't break this invariant since the vesting is closed in that case.

### Proof of Concept

The reentrancy in the vested token can be used by an admin if the execution can be hijacked before the balance change occurs.

```js
/**
@notice Admin withdrawal of the unallocated tokens.
@param _amountRequested - the amount that we want to withdraw
	*/
function withdrawAdmin(uint112 _amountRequested) public onlyAdmin {    
	// Allow the owner to withdraw any balance not currently tied up in contracts.
	uint256 amountRemaining = tokenAddress.balanceOf(address(this)) - numTokensReservedForVesting;

	require(amountRemaining >= _amountRequested, "INSUFFICIENT_BALANCE");

	// Actually withdraw the tokens
	// Reentrancy note - this operation doesn't touch any of the internal vars, simply transfers
	// Also following Checks-effects-interactions pattern
	tokenAddress.safeTransfer(_msgSender(), _amountRequested);

	// Let the withdrawal known to everyone
	emit AdminWithdrawn(_msgSender(), _amountRequested);
}
```

Let's consider function `withdrawAdmin`. Firstly, the balance is checked and then if there is enough token surplus to withdraw, the withdrawal is allowed. The surplus is based on two values: `numTokensReservedForVesting` which isn't changed by this function and the balance of the contract.

If the owner hijacks the execution before the balance change in the token transfer (which is possible in, for example, ERC777), an admin can call this function again and it will allow for an invocation of another transfer since the token balance hasn't changed yet.

For example, if there is `$1m` in vestings in the contract, an admin can send `$100k` to it in tokens and recursively invoke `withdrawalAdmin` with the amount of `$100k` eleven times so that the whole contract balance will be drained.

### Recommended Mitigation Steps

Add `ReentrancyGuard`'s `nonReentrant` to the `withdrawAdmin` function.

**[0xean (judge) commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/6#issuecomment-1257063808):**
 > This would require a number of assumptions to be the case including a malicious admin which the sponsors called out of scope.  Because it is obviously not intended functionality, I am going to leave as Medium pending sponsor review. I think the non-reentrant modifier is worth adding. 

**[lawrencehui (VTVL) acknowledged and commented](https://github.com/code-423n4/2022-09-vtvl-findings/issues/6#issuecomment-1271726987):**
 > Will consider adding ReentrancyGuard as suggested.



***

# Low Risk and Non-Critical Issues

For this contest, 135 reports were submitted by wardens detailing low risk and non-critical issues. The [report highlighted below](https://github.com/code-423n4/2022-09-vtvl-findings/issues/277) by **AkshaySrivastav** received the top score from the judge.

*The following wardens also submitted reports: [rbserver](https://github.com/code-423n4/2022-09-vtvl-findings/issues/273), [IllIllI](https://github.com/code-423n4/2022-09-vtvl-findings/issues/251), [0xNazgul](https://github.com/code-423n4/2022-09-vtvl-findings/issues/367), [0x1f8b](https://github.com/code-423n4/2022-09-vtvl-findings/issues/44), [lukris02](https://github.com/code-423n4/2022-09-vtvl-findings/issues/349), [rotcivegaf](https://github.com/code-423n4/2022-09-vtvl-findings/issues/189), [ajtra](https://github.com/code-423n4/2022-09-vtvl-findings/issues/358), [cryptostellar5](https://github.com/code-423n4/2022-09-vtvl-findings/issues/442), [0xSmartContract](https://github.com/code-423n4/2022-09-vtvl-findings/issues/270), [Deivitto](https://github.com/code-423n4/2022-09-vtvl-findings/issues/441), [Bahurum](https://github.com/code-423n4/2022-09-vtvl-findings/issues/76), [brgltd](https://github.com/code-423n4/2022-09-vtvl-findings/issues/359), [Diana](https://github.com/code-423n4/2022-09-vtvl-findings/issues/445), [c3phas](https://github.com/code-423n4/2022-09-vtvl-findings/issues/459), [chatch](https://github.com/code-423n4/2022-09-vtvl-findings/issues/303), [ladboy233](https://github.com/code-423n4/2022-09-vtvl-findings/issues/9), [supernova](https://github.com/code-423n4/2022-09-vtvl-findings/issues/34), [RockingMiles](https://github.com/code-423n4/2022-09-vtvl-findings/issues/32), [Waze](https://github.com/code-423n4/2022-09-vtvl-findings/issues/199), [tnevler](https://github.com/code-423n4/2022-09-vtvl-findings/issues/344), [a12jmx](https://github.com/code-423n4/2022-09-vtvl-findings/issues/375), [Funen](https://github.com/code-423n4/2022-09-vtvl-findings/issues/466), [pcarranzav](https://github.com/code-423n4/2022-09-vtvl-findings/issues/20), [0x4non](https://github.com/code-423n4/2022-09-vtvl-findings/issues/201), [KIntern\_NA](https://github.com/code-423n4/2022-09-vtvl-findings/issues/212), [\_\_141345\_\_](https://github.com/code-423n4/2022-09-vtvl-findings/issues/151), [delfin454000](https://github.com/code-423n4/2022-09-vtvl-findings/issues/330), [0x5rings](https://github.com/code-423n4/2022-09-vtvl-findings/issues/341), [Aymen0909](https://github.com/code-423n4/2022-09-vtvl-findings/issues/436), [ubermensch](https://github.com/code-423n4/2022-09-vtvl-findings/issues/11), [Rolezn](https://github.com/code-423n4/2022-09-vtvl-findings/issues/268), [leosathya](https://github.com/code-423n4/2022-09-vtvl-findings/issues/326), [0xf15ers](https://github.com/code-423n4/2022-09-vtvl-findings/issues/376), [gogo](https://github.com/code-423n4/2022-09-vtvl-findings/issues/438), [CodingNameKiki](https://github.com/code-423n4/2022-09-vtvl-findings/issues/467), [V\_B](https://github.com/code-423n4/2022-09-vtvl-findings/issues/471), [aysha](https://github.com/code-423n4/2022-09-vtvl-findings/issues/487), [seyni](https://github.com/code-423n4/2022-09-vtvl-findings/issues/216), [Dravee](https://github.com/code-423n4/2022-09-vtvl-findings/issues/25), [ChristianKuri](https://github.com/code-423n4/2022-09-vtvl-findings/issues/27), [JLevick](https://github.com/code-423n4/2022-09-vtvl-findings/issues/284), [CertoraInc](https://github.com/code-423n4/2022-09-vtvl-findings/issues/435), [JohnnyTime](https://github.com/code-423n4/2022-09-vtvl-findings/issues/93), [Bnke0x0](https://github.com/code-423n4/2022-09-vtvl-findings/issues/46), [Lambda](https://github.com/code-423n4/2022-09-vtvl-findings/issues/82), [Respx](https://github.com/code-423n4/2022-09-vtvl-findings/issues/102), [RaymondFam](https://github.com/code-423n4/2022-09-vtvl-findings/issues/118), [rajatbeladiya](https://github.com/code-423n4/2022-09-vtvl-findings/issues/141), [ikbkln](https://github.com/code-423n4/2022-09-vtvl-findings/issues/161), [neumo](https://github.com/code-423n4/2022-09-vtvl-findings/issues/171), [TomJ](https://github.com/code-423n4/2022-09-vtvl-findings/issues/337), [0xA5DF](https://github.com/code-423n4/2022-09-vtvl-findings/issues/347), [0xSky](https://github.com/code-423n4/2022-09-vtvl-findings/issues/377), [Aeros](https://github.com/code-423n4/2022-09-vtvl-findings/issues/423), [sorrynotsorry](https://github.com/code-423n4/2022-09-vtvl-findings/issues/446), [async](https://github.com/code-423n4/2022-09-vtvl-findings/issues/215), [prasantgupta52](https://github.com/code-423n4/2022-09-vtvl-findings/issues/324), [0xDecorativePineapple](https://github.com/code-423n4/2022-09-vtvl-findings/issues/395), [rvierdiiev](https://github.com/code-423n4/2022-09-vtvl-findings/issues/56), [sach1r0](https://github.com/code-423n4/2022-09-vtvl-findings/issues/131), [ElKu](https://github.com/code-423n4/2022-09-vtvl-findings/issues/158), [slowmoses](https://github.com/code-423n4/2022-09-vtvl-findings/issues/174), [neko\_nyaa](https://github.com/code-423n4/2022-09-vtvl-findings/issues/203), [Tomo](https://github.com/code-423n4/2022-09-vtvl-findings/issues/116), [bin2chen](https://github.com/code-423n4/2022-09-vtvl-findings/issues/110), [innertia](https://github.com/code-423n4/2022-09-vtvl-findings/issues/165), [yongskiws](https://github.com/code-423n4/2022-09-vtvl-findings/issues/355), [ignacio](https://github.com/code-423n4/2022-09-vtvl-findings/issues/207), [djxploit](https://github.com/code-423n4/2022-09-vtvl-findings/issues/394), [JohnSmith](https://github.com/code-423n4/2022-09-vtvl-findings/issues/415), [got\_targ](https://github.com/code-423n4/2022-09-vtvl-findings/issues/443), [joestakey](https://github.com/code-423n4/2022-09-vtvl-findings/issues/493), [csanuragjain](https://github.com/code-423n4/2022-09-vtvl-findings/issues/227), [rokinot](https://github.com/code-423n4/2022-09-vtvl-findings/issues/248), [cryptphi](https://github.com/code-423n4/2022-09-vtvl-findings/issues/255), [ayeslick](https://github.com/code-423n4/2022-09-vtvl-findings/issues/295), [romand](https://github.com/code-423n4/2022-09-vtvl-findings/issues/310), [peanuts](https://github.com/code-423n4/2022-09-vtvl-findings/issues/327), [RustyRabbit](https://github.com/code-423n4/2022-09-vtvl-findings/issues/340), [0xbepresent](https://github.com/code-423n4/2022-09-vtvl-findings/issues/348), [hansfriese](https://github.com/code-423n4/2022-09-vtvl-findings/issues/361), [Chom](https://github.com/code-423n4/2022-09-vtvl-findings/issues/380), [berndartmueller](https://github.com/code-423n4/2022-09-vtvl-findings/issues/398), [dic0de](https://github.com/code-423n4/2022-09-vtvl-findings/issues/401), [peritoflores](https://github.com/code-423n4/2022-09-vtvl-findings/issues/422), [zzzitron](https://github.com/code-423n4/2022-09-vtvl-findings/issues/58), [cccz](https://github.com/code-423n4/2022-09-vtvl-findings/issues/65), [obront](https://github.com/code-423n4/2022-09-vtvl-findings/issues/92), [reassor](https://github.com/code-423n4/2022-09-vtvl-findings/issues/99), [bobirichman](https://github.com/code-423n4/2022-09-vtvl-findings/issues/68), [sikorico](https://github.com/code-423n4/2022-09-vtvl-findings/issues/72), [Margaret](https://github.com/code-423n4/2022-09-vtvl-findings/issues/73), [datapunk](https://github.com/code-423n4/2022-09-vtvl-findings/issues/107), [karanctf](https://github.com/code-423n4/2022-09-vtvl-findings/issues/120), [fatherOfBlocks](https://github.com/code-423n4/2022-09-vtvl-findings/issues/127), [0xmatt](https://github.com/code-423n4/2022-09-vtvl-findings/issues/266), [nalus](https://github.com/code-423n4/2022-09-vtvl-findings/issues/294), [eighty](https://github.com/code-423n4/2022-09-vtvl-findings/issues/308), [ret2basic](https://github.com/code-423n4/2022-09-vtvl-findings/issues/313), [Ruhum](https://github.com/code-423n4/2022-09-vtvl-findings/issues/180), [Sm4rty](https://github.com/code-423n4/2022-09-vtvl-findings/issues/386), [Rohan16](https://github.com/code-423n4/2022-09-vtvl-findings/issues/492), [pedr02b2](https://github.com/code-423n4/2022-09-vtvl-findings/issues/193), [ReyAdmirado](https://github.com/code-423n4/2022-09-vtvl-findings/issues/354), [indijanc](https://github.com/code-423n4/2022-09-vtvl-findings/issues/399), [SooYa](https://github.com/code-423n4/2022-09-vtvl-findings/issues/412), [pedroais](https://github.com/code-423n4/2022-09-vtvl-findings/issues/483), [d3e4](https://github.com/code-423n4/2022-09-vtvl-findings/issues/485), [ak1](https://github.com/code-423n4/2022-09-vtvl-findings/issues/439), [zzykxx](https://github.com/code-423n4/2022-09-vtvl-findings/issues/97), [erictee](https://github.com/code-423n4/2022-09-vtvl-findings/issues/15), [oyc\_109](https://github.com/code-423n4/2022-09-vtvl-findings/issues/63), [ch13fd357r0y3r](https://github.com/code-423n4/2022-09-vtvl-findings/issues/87), [millersplanet](https://github.com/code-423n4/2022-09-vtvl-findings/issues/100), [martin](https://github.com/code-423n4/2022-09-vtvl-findings/issues/177), [2997ms](https://github.com/code-423n4/2022-09-vtvl-findings/issues/181), [B2](https://github.com/code-423n4/2022-09-vtvl-findings/issues/242), [tibthecat](https://github.com/code-423n4/2022-09-vtvl-findings/issues/254), [OptimismSec](https://github.com/code-423n4/2022-09-vtvl-findings/issues/262), [exd0tpy](https://github.com/code-423n4/2022-09-vtvl-findings/issues/302), [medikko](https://github.com/code-423n4/2022-09-vtvl-findings/issues/306), [peiw](https://github.com/code-423n4/2022-09-vtvl-findings/issues/312), [JC](https://github.com/code-423n4/2022-09-vtvl-findings/issues/497), [StevenL](https://github.com/code-423n4/2022-09-vtvl-findings/issues/134), [durianSausage](https://github.com/code-423n4/2022-09-vtvl-findings/issues/147), [0v3rf10w](https://github.com/code-423n4/2022-09-vtvl-findings/issues/388), [0x040](https://github.com/code-423n4/2022-09-vtvl-findings/issues/405), [natzuu](https://github.com/code-423n4/2022-09-vtvl-findings/issues/488), [Yiko](https://github.com/code-423n4/2022-09-vtvl-findings/issues/49), [carrotsmuggler](https://github.com/code-423n4/2022-09-vtvl-findings/issues/111), [0x85102](https://github.com/code-423n4/2022-09-vtvl-findings/issues/133), [MasterCookie](https://github.com/code-423n4/2022-09-vtvl-findings/issues/143), [bulej93](https://github.com/code-423n4/2022-09-vtvl-findings/issues/168), and [Diraco](https://github.com/code-423n4/2022-09-vtvl-findings/issues/210).*

## [01]
The `setAdmin()` function in AccessProtected.sol can be used to revoke all admins. This could be a feature to completely renounce ownership of the contract after all claims are set or could be a bug in which one admin either intentionally or unintentionally removes all admin (or all other admins except himself).

## [02]
Line 161 in `VTVLVesting._baseVestedAmount()` function should not get executed when `cliffAmount` is 0. In the case of no cliff amount, i.e. where `cliffReleaseTimestamp` and `cliffAmount` are both set as 0, the program execution should not enter the `if` block.<br>
```
160    if(_referenceTs >= _claim.cliffReleaseTimestamp) {
161        vestAmt += _claim.cliffAmount;
162    }
```

## [03]
Solidity pragma versioning should be upgraded to latest available version. Currently the solidity version in contracts is ^0.8.14 which was found to possess some bugs.

## [04]
Solidity pragma versioning should be exactly same in all contracts. Currently some contracts use ^0.8.14 but some are fixed to 0.8.14.

## [05]
No need to re-inherit Context contract in [VTVLVesting](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L11) smart contract as Context is already inherited by [AccessProtected](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/AccessProtected.sol#L11) contract.

## [06]
Ownable smart contract is unnecessarily imported in [AccessProtected.sol](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/AccessProtected.sol#L5) while it is never used. Unnecessary imports decreases the readability of smart contract code.

## [07]
Unnecessary imports are also present in [VTVLVesting.sol](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L5-L7). The compilation works completely fine with just importing SafeERC20.sol and AccessProtected.sol.

## [08]
AccessProtected - contract docs do not match implementaion. The implementation only has multiple equal rights admins and no `owner` field is present while the docs states something else.
```javascript
7    /** 
8        @title Access Limiter to multiple owner-specified accounts.
9        @dev Exposes the onlyAdmin modifier, which will revert (ADMIN_ACCESS_REQUIRED) if the caller is not the owner nor the admin.
10    */
```

## [09]
`VariableSupplyERC20Token.constructor()` has an empty `@dev` tag.

## [10]
VariableSupplyERC20Token contract mentions an incorrect comment
```javascript
48    // We can't really have burn, because that could make our vesting contract not work.
49    // Example: if the user can burn tokens already assigned to vesting schedules, it could be unable to pay its obligations.

```

Token can be made burnable in which users can be allowed to burn their own tokens.

## [11]
Line 159 in `VTVLVesting._baseVestedAmount()` contains a misleading comment
```javascript
159        // We don't check here that cliffReleaseTimestamp is after the startTimestamp 
160        if(_referenceTs >= _claim.cliffReleaseTimestamp) {
161            vestAmt += _claim.cliffAmount;
162        }
```

`cliffReleaseTimestamp` can never be after `startTimestamp` as per the [`require`](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L274) statements of `_createClaimUnchecked()`.

## [12]
As per the implementation of vesting contract, Line 21 in VTVLVesting.sol should mention *greater than or equal* instead of just *greater than*.
```javascript
21    /// @dev Our balance of the token must always be greater than this amount.
```

## [13]
`VTVLVesting.ClaimCreated` and `VTVLVesting.ClaimRevoked` events should also log the admin's address so it can be easily queried which admin created and revoked the claim.

## [14]
In VTVLVesting contract, before revoking a claim the contract should transfer all the pending/partially vested rewards. Otherwise the entire vesting amount will get revoked.

    It is at the discretion of protocol development team to decide whether the current behaviour is intended or not.

## [15]
At [Line 82](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L82) of `VTVLVesting.constructor()`, a better check would be to do `_tokenAddress.totalSupply()`. As this will also ensure that the input address in indeed a token's address and perform the zero address check as well.
```
82    require(address(_tokenAddress) != address(0), "INVALID_ADDRESS");
```

## [16]
The `tokenAddress` state variable of VTVLVesting should be renamed to `token` as this variable represents an `IERC20` interface rather that just an address. Renaming it to `token` aligns better with its usage.
```
17    IERC20 public immutable tokenAddress;
```

## [17]
There should be a factory contract for VTVLVesting contract which can keep track of all vesting contracts deployed by different founders. The Factory contract aligns better with the business usecase of VTVL protocol owners.

    From the spec, "The core function of VTVL is to allow users to generate and deploy token vesting smart contracts through our platform."

## [18]
In `VariableSupplyERC20Token.mint()` function, non-zero input validation check should be done similar to `FullPremintERC20Token.constructor()`.

## [19]
In all solidity files, license keyword should be mentioned as `// SPDX-License-Identifier: UNLICENSED`.

## [20]
All the actors interacting with a VTVLVesting contract need to fully trust all of its admins. Any one of the potentially infinite admins of VTVLVesting contract has the power to (either intentionally or unintentionally):
    *   revoke claims of all recipients and withdraw all tokens, resulting in a rugpull attack.
    *   give or take back the admin rights to or from any ethereum address.
    *   withdraw any other ERC20 token from the vesting contract.



***

# Gas Optimizations

For this contest, 141 reports were submitted by wardens detailing gas optimizations. The [report highlighted below](https://github.com/code-423n4/2022-09-vtvl-findings/issues/253) by **IllIllI** received the top score from the judge.

*The following wardens also submitted reports: [Aymen0909](https://github.com/code-423n4/2022-09-vtvl-findings/issues/383), [pfapostol](https://github.com/code-423n4/2022-09-vtvl-findings/issues/272), [c3phas](https://github.com/code-423n4/2022-09-vtvl-findings/issues/457), [JLevick](https://github.com/code-423n4/2022-09-vtvl-findings/issues/282), [Deivitto](https://github.com/code-423n4/2022-09-vtvl-findings/issues/432), [gogo](https://github.com/code-423n4/2022-09-vtvl-findings/issues/437), [CertoraInc](https://github.com/code-423n4/2022-09-vtvl-findings/issues/481), [JC](https://github.com/code-423n4/2022-09-vtvl-findings/issues/491), [Bnke0x0](https://github.com/code-423n4/2022-09-vtvl-findings/issues/43), [oyc\_109](https://github.com/code-423n4/2022-09-vtvl-findings/issues/62), [durianSausage](https://github.com/code-423n4/2022-09-vtvl-findings/issues/146), [\_\_141345\_\_](https://github.com/code-423n4/2022-09-vtvl-findings/issues/150), [rotcivegaf](https://github.com/code-423n4/2022-09-vtvl-findings/issues/188), [0xSmartContract](https://github.com/code-423n4/2022-09-vtvl-findings/issues/274), [ajtra](https://github.com/code-423n4/2022-09-vtvl-findings/issues/299), [Sm4rty](https://github.com/code-423n4/2022-09-vtvl-findings/issues/385), [cryptostellar5](https://github.com/code-423n4/2022-09-vtvl-findings/issues/397), [Diana](https://github.com/code-423n4/2022-09-vtvl-findings/issues/407), [JohnSmith](https://github.com/code-423n4/2022-09-vtvl-findings/issues/414), [Tomo](https://github.com/code-423n4/2022-09-vtvl-findings/issues/115), [zishansami](https://github.com/code-423n4/2022-09-vtvl-findings/issues/170), [martin](https://github.com/code-423n4/2022-09-vtvl-findings/issues/176), [ch0bu](https://github.com/code-423n4/2022-09-vtvl-findings/issues/185), [SnowMan](https://github.com/code-423n4/2022-09-vtvl-findings/issues/305), [prasantgupta52](https://github.com/code-423n4/2022-09-vtvl-findings/issues/323), [erictee](https://github.com/code-423n4/2022-09-vtvl-findings/issues/13), [millersplanet](https://github.com/code-423n4/2022-09-vtvl-findings/issues/17), [djxploit](https://github.com/code-423n4/2022-09-vtvl-findings/issues/363), [Rohan16](https://github.com/code-423n4/2022-09-vtvl-findings/issues/484), [0x1f8b](https://github.com/code-423n4/2022-09-vtvl-findings/issues/42), [RaymondFam](https://github.com/code-423n4/2022-09-vtvl-findings/issues/114), [0x4non](https://github.com/code-423n4/2022-09-vtvl-findings/issues/202), [rbserver](https://github.com/code-423n4/2022-09-vtvl-findings/issues/259), [Rolezn](https://github.com/code-423n4/2022-09-vtvl-findings/issues/269), [TomJ](https://github.com/code-423n4/2022-09-vtvl-findings/issues/332), [brgltd](https://github.com/code-423n4/2022-09-vtvl-findings/issues/364), [0xNazgul](https://github.com/code-423n4/2022-09-vtvl-findings/issues/366), [Saintcode\_](https://github.com/code-423n4/2022-09-vtvl-findings/issues/86), [karanctf](https://github.com/code-423n4/2022-09-vtvl-findings/issues/119), [medikko](https://github.com/code-423n4/2022-09-vtvl-findings/issues/301), [ret2basic](https://github.com/code-423n4/2022-09-vtvl-findings/issues/314), [0xsam](https://github.com/code-423n4/2022-09-vtvl-findings/issues/16), [ReyAdmirado](https://github.com/code-423n4/2022-09-vtvl-findings/issues/353), [seyni](https://github.com/code-423n4/2022-09-vtvl-findings/issues/356), [gianganhnguyen](https://github.com/code-423n4/2022-09-vtvl-findings/issues/36), [Ruhum](https://github.com/code-423n4/2022-09-vtvl-findings/issues/50), [carrotsmuggler](https://github.com/code-423n4/2022-09-vtvl-findings/issues/112), [slowmoses](https://github.com/code-423n4/2022-09-vtvl-findings/issues/173), [WilliamAmbrozic](https://github.com/code-423n4/2022-09-vtvl-findings/issues/182), [B2](https://github.com/code-423n4/2022-09-vtvl-findings/issues/240), [peiw](https://github.com/code-423n4/2022-09-vtvl-findings/issues/311), [0x040](https://github.com/code-423n4/2022-09-vtvl-findings/issues/318), [leosathya](https://github.com/code-423n4/2022-09-vtvl-findings/issues/321), [delfin454000](https://github.com/code-423n4/2022-09-vtvl-findings/issues/328), [Tomio](https://github.com/code-423n4/2022-09-vtvl-findings/issues/345), [samruna](https://github.com/code-423n4/2022-09-vtvl-findings/issues/2), [lukris02](https://github.com/code-423n4/2022-09-vtvl-findings/issues/351), [aysha](https://github.com/code-423n4/2022-09-vtvl-findings/issues/482), [yaemsobak](https://github.com/code-423n4/2022-09-vtvl-findings/issues/204), [Junnon](https://github.com/code-423n4/2022-09-vtvl-findings/issues/246), [imare](https://github.com/code-423n4/2022-09-vtvl-findings/issues/320), [eighty](https://github.com/code-423n4/2022-09-vtvl-findings/issues/309), [0xA5DF](https://github.com/code-423n4/2022-09-vtvl-findings/issues/329), [ladboy233](https://github.com/code-423n4/2022-09-vtvl-findings/issues/8), [emrekocak](https://github.com/code-423n4/2022-09-vtvl-findings/issues/22), [tnevler](https://github.com/code-423n4/2022-09-vtvl-findings/issues/346), [pauliax](https://github.com/code-423n4/2022-09-vtvl-findings/issues/461), [ikbkln](https://github.com/code-423n4/2022-09-vtvl-findings/issues/79), [neko\_nyaa](https://github.com/code-423n4/2022-09-vtvl-findings/issues/152), [jag](https://github.com/code-423n4/2022-09-vtvl-findings/issues/223), [Tadashi](https://github.com/code-423n4/2022-09-vtvl-findings/issues/252), [Atarpara](https://github.com/code-423n4/2022-09-vtvl-findings/issues/260), [tgolding55](https://github.com/code-423n4/2022-09-vtvl-findings/issues/276), [0xbepresent](https://github.com/code-423n4/2022-09-vtvl-findings/issues/331), [Ocean\_Sky](https://github.com/code-423n4/2022-09-vtvl-findings/issues/336), [peanuts](https://github.com/code-423n4/2022-09-vtvl-findings/issues/339), [caventa](https://github.com/code-423n4/2022-09-vtvl-findings/issues/258), [RockingMiles](https://github.com/code-423n4/2022-09-vtvl-findings/issues/31), [supernova](https://github.com/code-423n4/2022-09-vtvl-findings/issues/33), [SooYa](https://github.com/code-423n4/2022-09-vtvl-findings/issues/409), [beardofginger](https://github.com/code-423n4/2022-09-vtvl-findings/issues/410), [natzuu](https://github.com/code-423n4/2022-09-vtvl-findings/issues/468), [pedroais](https://github.com/code-423n4/2022-09-vtvl-findings/issues/479), [bobirichman](https://github.com/code-423n4/2022-09-vtvl-findings/issues/69), [dharma09](https://github.com/code-423n4/2022-09-vtvl-findings/issues/70), [DimitarDimitrov](https://github.com/code-423n4/2022-09-vtvl-findings/issues/117), [sach1r0](https://github.com/code-423n4/2022-09-vtvl-findings/issues/130), [Waze](https://github.com/code-423n4/2022-09-vtvl-findings/issues/198), [ignacio](https://github.com/code-423n4/2022-09-vtvl-findings/issues/205), [async](https://github.com/code-423n4/2022-09-vtvl-findings/issues/217), [tibthecat](https://github.com/code-423n4/2022-09-vtvl-findings/issues/257), [OptimismSec](https://github.com/code-423n4/2022-09-vtvl-findings/issues/263), [AkshaySrivastav](https://github.com/code-423n4/2022-09-vtvl-findings/issues/279), [malinariy](https://github.com/code-423n4/2022-09-vtvl-findings/issues/304), [lucacez](https://github.com/code-423n4/2022-09-vtvl-findings/issues/325), [ChristianKuri](https://github.com/code-423n4/2022-09-vtvl-findings/issues/26), [Chom](https://github.com/code-423n4/2022-09-vtvl-findings/issues/408), [Funen](https://github.com/code-423n4/2022-09-vtvl-findings/issues/465), [d3e4](https://github.com/code-423n4/2022-09-vtvl-findings/issues/489), [subtle77](https://github.com/code-423n4/2022-09-vtvl-findings/issues/496), [fatherOfBlocks](https://github.com/code-423n4/2022-09-vtvl-findings/issues/126), [0xDanielC](https://github.com/code-423n4/2022-09-vtvl-findings/issues/382), [indijanc](https://github.com/code-423n4/2022-09-vtvl-findings/issues/387), [ak1](https://github.com/code-423n4/2022-09-vtvl-findings/issues/425), [got\_targ](https://github.com/code-423n4/2022-09-vtvl-findings/issues/440), [mics](https://github.com/code-423n4/2022-09-vtvl-findings/issues/71), [Lambda](https://github.com/code-423n4/2022-09-vtvl-findings/issues/81), [KIntern\_NA](https://github.com/code-423n4/2022-09-vtvl-findings/issues/213), [w0Lfrum](https://github.com/code-423n4/2022-09-vtvl-findings/issues/281), [hxzy](https://github.com/code-423n4/2022-09-vtvl-findings/issues/19), [Amithuddar](https://github.com/code-423n4/2022-09-vtvl-findings/issues/391), [V\_B](https://github.com/code-423n4/2022-09-vtvl-findings/issues/470), [Tagir2003](https://github.com/code-423n4/2022-09-vtvl-findings/issues/74), [0xc0ffEE](https://github.com/code-423n4/2022-09-vtvl-findings/issues/80), [Respx](https://github.com/code-423n4/2022-09-vtvl-findings/issues/101), [MasterCookie](https://github.com/code-423n4/2022-09-vtvl-findings/issues/142), [Satyam\_Sharma](https://github.com/code-423n4/2022-09-vtvl-findings/issues/160), [Noah3o6](https://github.com/code-423n4/2022-09-vtvl-findings/issues/183), [rokinot](https://github.com/code-423n4/2022-09-vtvl-findings/issues/249), [nalus](https://github.com/code-423n4/2022-09-vtvl-findings/issues/293), [jpserrat](https://github.com/code-423n4/2022-09-vtvl-findings/issues/317), [CodingNameKiki](https://github.com/code-423n4/2022-09-vtvl-findings/issues/421), [Matin](https://github.com/code-423n4/2022-09-vtvl-findings/issues/37), [rvierdiiev](https://github.com/code-423n4/2022-09-vtvl-findings/issues/57), [adriro](https://github.com/code-423n4/2022-09-vtvl-findings/issues/75), [StevenL](https://github.com/code-423n4/2022-09-vtvl-findings/issues/136), [bulej93](https://github.com/code-423n4/2022-09-vtvl-findings/issues/167), [2997ms](https://github.com/code-423n4/2022-09-vtvl-findings/issues/178), [Diraco](https://github.com/code-423n4/2022-09-vtvl-findings/issues/211), [csanuragjain](https://github.com/code-423n4/2022-09-vtvl-findings/issues/234), [Sta1400](https://github.com/code-423n4/2022-09-vtvl-findings/issues/352), [0v3rf10w](https://github.com/code-423n4/2022-09-vtvl-findings/issues/389), [0x85102](https://github.com/code-423n4/2022-09-vtvl-findings/issues/132), [mrpathfindr](https://github.com/code-423n4/2022-09-vtvl-findings/issues/196), [exd0tpy](https://github.com/code-423n4/2022-09-vtvl-findings/issues/300), [cryptphi](https://github.com/code-423n4/2022-09-vtvl-findings/issues/357), [a12jmx](https://github.com/code-423n4/2022-09-vtvl-findings/issues/370), [francoHacker](https://github.com/code-423n4/2022-09-vtvl-findings/issues/378), [m9800](https://github.com/code-423n4/2022-09-vtvl-findings/issues/495), and [Yiko](https://github.com/code-423n4/2022-09-vtvl-findings/issues/48).*

## Summary

|        | Issue                                                                                                                                                      | Instances | Total Gas Saved |
| ------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------: | :-------------: |
| [G&#8209;01] | Save gas by not requring non-zero interval if no linear amount                                                                                             |     1     |      17100      |
| [G‑02] | Results of calls to `_msgSender()` not cached                                                                                                              |     4     |        64       |
| [G‑03] | Using `calldata` instead of `memory` for read-only arguments in `external` functions saves gas                                                             |     7     |       840       |
| [G‑04] | State variables should be cached in stack variables rather than re-reading them from storage                                                               |     1     |        97       |
| [G‑05] | `<x> += <y>` costs more gas than `<x> = <x> + <y>` for state variables                                                                                     |     4     |       452       |
| [G‑06] | Add `unchecked {}` for subtractions where the operands cannot underflow because of a previous `require()` or `if`-statement                                |     4     |       340       |
| [G‑07] | `++i`/`i++` should be `unchecked{++i}`/`unchecked{i++}` when it is not possible for them to overflow, as is the case when used in `for`- and `while`-loops |     1     |        60       |
| [G‑08] | Optimize names to save gas                                                                                                                                 |     3     |        66       |
| [G‑09] | Using `bool`s for storage incurs overhead                                                                                                                  |     1     |      20000      |
| [G‑10] | `++i` costs less gas than `i++`, especially when it's used in `for`-loops (`--i`/`i--` too)                                                                |     1     |        10       |
| [G‑11] | Splitting `require()` statements that use `&&` saves gas                                                                                                   |     1     |        3        |
| [G‑12] | Don't compare boolean expressions to boolean literals                                                                                                      |     1     |        9        |
| [G‑13] | Use custom errors rather than `revert()`/`require()` strings to save gas                                                                                   |     24    |        -        |
| [G&#8209;14] | Functions guaranteed to revert when called by normal users can be marked `payable`                                                                         |     7     |       147       |
| [G&#8209;15] | Don't use `_msgSender()` if not supporting EIP-2771                                                                                                        |     13    |       208       |

Total: 73 instances over 15 issues with **39396 gas** saved

Gas totals use lower bounds of ranges and count two iterations of each `for`-loop. All values above are runtime, not deployment, values.

## [G‑01]  Save gas by not requring non-zero interval if no linear amount

If there is no linear amount, a Gsset for the claim's interval can be converted to a Gsreset, saving **17100 gas**.

*There is 1 instance of this issue:*

```solidity
File: /contracts/VTVLVesting.sol

263          require(_releaseIntervalSecs > 0, "INVALID_RELEASE_INTERVAL");
264:         require((_endTimestamp - _startTimestamp) % _releaseIntervalSecs == 0, "INVALID_INTERVAL_LENGTH");

```

[VTVLVesting.sol#L263-L264](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L263-L264)

## [G‑02]  Results of calls to `_msgSender()` not cached

Saves at least **16 gas** per call skipped.

*There are 4 instances of this issue:*

```solidity
File: /contracts/VTVLVesting.sol

371:         uint112 allowance = vestedAmount(_msgSender(), uint40(block.timestamp));

388:         tokenAddress.safeTransfer(_msgSender(), amountRemaining);

391:         emit Claimed(_msgSender(), amountRemaining);

410:         emit AdminWithdrawn(_msgSender(), _amountRequested);

```

[VTVLVesting.sol#L371](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L371)

## [G‑03]  Using `calldata` instead of `memory` for read-only arguments in `external` functions saves gas

When a function with a `memory` array is called externally, the `abi.decode()` step has to use a for-loop to copy each index of the `calldata` to the `memory` index. **Each iteration of this for-loop costs at least 60 gas** (i.e. `60 * <mem_array>.length`). Using `calldata` directly, obliviates the need for such a loop in the contract code and runtime execution. Note that even if an interface defines a function as having `memory` arguments, it's still valid for implementation contracs to use `calldata` arguments instead.

If the array is passed to an `internal` function which passes the array to another internal function where the array is modified and therefore `memory` is used in the `external` call, it's still more gass-efficient to use `calldata` when the `external` function uses modifiers, since the modifiers may prevent the internal functions from being called. Structs have the same overhead as an array of length one.

Note that I've also flagged instances where the function is `public` but can be marked as `external` since it's not called by the contract, and cases where a constructor is involved.

*There are 7 instances of this issue:*

```solidity
File: contracts/VTVLVesting.sol

/// @audit _recipients
/// @audit _startTimestamps
/// @audit _endTimestamps
/// @audit _cliffReleaseTimestamps
/// @audit _releaseIntervalsSecs
/// @audit _linearVestAmounts
/// @audit _cliffAmounts
333       function createClaimsBatch(
334           address[] memory _recipients, 
335           uint40[] memory _startTimestamps, 
336           uint40[] memory _endTimestamps, 
337           uint40[] memory _cliffReleaseTimestamps, 
338           uint40[] memory _releaseIntervalsSecs, 
339           uint112[] memory _linearVestAmounts, 
340           uint112[] memory _cliffAmounts) 
341:          external onlyAdmin {

```

[VTVLVesting.sol#L333-L341](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L333-L341)<br>

## [G‑04]  State variables should be cached in stack variables rather than re-reading them from storage

The instances below point to the second+ access of a state variable within a function. Caching of a state variable replace each Gwarmaccess (**100 gas**) with a much cheaper stack read. Other less obvious fixes/optimizations include having local memory caches of state variable structs, or having local caches of state variable contracts/addresses.

*There is 1 instance of this issue:*

```solidity
File: contracts/token/VariableSupplyERC20Token.sol

/// @audit mintableSupply on line 40
41:               require(amount <= mintableSupply, "INVALID_AMOUNT");

```

[VariableSupplyERC20Token.sol#L41](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/token/VariableSupplyERC20Token.sol#L41)<br>

## [G‑05]  `<x> += <y>` costs more gas than `<x> = <x> + <y>` for state variables

Using the addition operator instead of plus-equals saves **[113 gas](https://gist.github.com/IllIllI000/cbbfb267425b898e5be734d4008d4fe8)**.

*There are 4 instances of this issue:*

```solidity
File: contracts/token/VariableSupplyERC20Token.sol

43:               mintableSupply -= amount;

```

[VariableSupplyERC20Token.sol#L43](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/token/VariableSupplyERC20Token.sol#L43)<br>

```solidity
File: contracts/VTVLVesting.sol

301:          numTokensReservedForVesting += allocatedAmount; // track the allocated amount

383:          numTokensReservedForVesting -= amountRemaining;

433:          numTokensReservedForVesting -= amountRemaining; // Reduces the allocation

```

[VTVLVesting.sol#L301](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L301)<br>

## [G‑06]  Add `unchecked {}` for subtractions where the operands cannot underflow because of a previous `require()` or `if`-statement

`require(a <= b); x = b - a` => `require(a <= b); unchecked { x = b - a }`

*There are 4 instances of this issue:*

```solidity
File: contracts/VTVLVesting.sol

/// @audit require() on line 262
264:          require((_endTimestamp - _startTimestamp) % _releaseIntervalSecs == 0, "INVALID_INTERVAL_LENGTH");

/// @audit require() on line 374
377:          uint112 amountRemaining = allowance - usrClaim.amountWithdrawn;

/// @audit require() on line 426
429:          uint112 amountRemaining = finalVestAmt - _claim.amountWithdrawn;

/// @audit if-condition on line 166
167:                  uint40 currentVestingDurationSecs = _referenceTs - _claim.startTimestamp; // How long since the start

```

[VTVLVesting.sol#L264](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L264)<br>

## [G‑07]  `++i`/`i++` should be `unchecked{++i}`/`unchecked{i++}` when it is not possible for them to overflow, as is the case when used in `for`- and `while`-loops

The `unchecked` keyword is new in solidity version 0.8.0, so this only applies to that version or higher, which these instances are. This saves **30-40 gas [per loop](https://gist.github.com/hrkrshnn/ee8fabd532058307229d65dcd5836ddc#the-increment-in-for-loop-post-condition-can-be-made-unchecked)**.

*There is 1 instance of this issue:*

```solidity
File: contracts/VTVLVesting.sol

353:          for (uint256 i = 0; i < length; i++) {

```

[VTVLVesting.sol#L353](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L353)<br>

## [G‑08]  Optimize names to save gas

`public`/`external` function names and `public` member variable names can be optimized to save gas. See [this](https://gist.github.com/IllIllI000/a5d8b486a8259f9f77891a919febd1a9) link for an example of how it works. Below are the interfaces/abstract contracts that can be optimized so that the most frequently-called functions use the least amount of gas possible during method lookup. Method IDs that have two leading zero bytes can save **128 gas** each during deployment, and renaming functions to have lower method IDs will save **22 gas** per call, [per sorted position shifted](https://medium.com/joyso/solidity-how-does-function-name-affect-gas-consumption-in-smart-contract-47d270d8ac92).

*There are 3 instances of this issue:*

```solidity
File: contracts/AccessProtected.sol

/// @audit isAdmin(), setAdmin()
11:   abstract contract AccessProtected is Context {

```

[AccessProtected.sol#L11](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/AccessProtected.sol#L11)<br>

```solidity
File: contracts/token/VariableSupplyERC20Token.sol

/// @audit mint()
10:   contract VariableSupplyERC20Token is ERC20, AccessProtected {

```

[VariableSupplyERC20Token.sol#L10](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/token/VariableSupplyERC20Token.sol#L10)<br>

```solidity
File: contracts/VTVLVesting.sol

/// @audit getClaim(), vestedAmount(), finalVestedAmount(), claimableAmount(), allVestingRecipients(), numVestingRecipients(), createClaim(), createClaimsBatch(), withdraw(), withdrawAdmin(), revokeClaim(), withdrawOtherToken()
11:   contract VTVLVesting is Context, AccessProtected {

```

[VTVLVesting.sol#L11](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L11)<br>

## [G‑09]  Using `bool`s for storage incurs overhead

```solidity
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.
```

[OpenZeppelin/ReentrancyGuard.sol#L23-L27](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/58f635312aa21f947cae5f8578638a85aa2519f5/contracts/security/ReentrancyGuard.sol#L23-L27)<br>
Use `uint256(1)` and `uint256(2)` for true/false to avoid a Gwarmaccess (**[100 gas](https://gist.github.com/IllIllI000/1b70014db712f8572a72378321250058)**) for the extra SLOAD, and to avoid Gsset (**20000 gas**) when changing from `false` to `true`, after having been `true` in the past.

*There is 1 instance of this issue:*

```solidity
File: contracts/AccessProtected.sol

12:       mapping(address => bool) private _admins; // user address => admin? mapping

```

[AccessProtected.sol#L12](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/AccessProtected.sol#L12)<br>

## [G‑10]  `++i` costs less gas than `i++`, especially when it's used in `for`-loops (`--i`/`i--` too)

Saves **5 gas per loop**.

*There is 1 instance of this issue:*

```solidity
File: contracts/VTVLVesting.sol

353:          for (uint256 i = 0; i < length; i++) {

```

[VTVLVesting.sol#L353](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L353)<br>

## [G‑11]  Splitting `require()` statements that use `&&` saves gas

See [this issue](https://github.com/code-423n4/2022-01-xdefi-findings/issues/128) which describes the fact that there is a larger deployment gas cost, but with enough runtime calls, the change ends up being cheaper by **3 gas**.

*There is 1 instance of this issue:*

```solidity
File: contracts/VTVLVesting.sol

344           require(_startTimestamps.length == length &&
345                   _endTimestamps.length == length &&
346                   _cliffReleaseTimestamps.length == length &&
347                   _releaseIntervalsSecs.length == length &&
348                   _linearVestAmounts.length == length &&
349                   _cliffAmounts.length == length, 
350                   "ARRAY_LENGTH_MISMATCH"
351:          );

```

[VTVLVesting.sol#L344-L351](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L344-L351)<br>

## [G‑12]  Don't compare boolean expressions to boolean literals

`if (<x> == true)` => `if (<x>)`, `if (<x> == false)` => `if (!<x>)`

*There is 1 instance of this issue:*

```solidity
File: contracts/VTVLVesting.sol

111:          require(_claim.isActive == true, "NO_ACTIVE_CLAIM");

```

[VTVLVesting.sol#L111](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L111)<br>

## [G‑13]  Use custom errors rather than `revert()`/`require()` strings to save gas

Custom errors are available from solidity version 0.8.4. Custom errors save [**\~50 gas**](https://gist.github.com/IllIllI000/ad1bd0d29a0101b25e57c293b4b0c746) each time they're hit by [avoiding having to allocate and store the revert string](https://blog.soliditylang.org/2021/04/21/custom-errors/#errors-in-depth). Not defining the strings also save deployment gas.

*There are 24 instances of this issue:*

```solidity
File: contracts/AccessProtected.sol

25:           require(_admins[_msgSender()], "ADMIN_ACCESS_REQUIRED");

40:           require(admin != address(0), "INVALID_ADDRESS");

```

[AccessProtected.sol#L25](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/AccessProtected.sol#L25)<br>

```solidity
File: contracts/token/FullPremintERC20Token.sol

11:           require(supply_ > 0, "NO_ZERO_MINT");

```

[FullPremintERC20Token.sol#L11](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/token/FullPremintERC20Token.sol#L11)<br>

```solidity
File: contracts/token/VariableSupplyERC20Token.sol

27:           require(initialSupply_ > 0 || maxSupply_ > 0, "INVALID_AMOUNT");

37:           require(account != address(0), "INVALID_ADDRESS");

41:               require(amount <= mintableSupply, "INVALID_AMOUNT");

```

[VariableSupplyERC20Token.sol#L27](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/token/VariableSupplyERC20Token.sol#L27)<br>

```solidity
File: contracts/VTVLVesting.sol

82:           require(address(_tokenAddress) != address(0), "INVALID_ADDRESS");

107:          require(_claim.startTimestamp > 0, "NO_ACTIVE_CLAIM");

111:          require(_claim.isActive == true, "NO_ACTIVE_CLAIM");

129:          require(_claim.startTimestamp == 0, "CLAIM_ALREADY_EXISTS");

255:          require(_recipient != address(0), "INVALID_ADDRESS");

256:          require(_linearVestAmount + _cliffAmount > 0, "INVALID_VESTED_AMOUNT"); // Actually only one of linearvested/cliff amount must be 0, not necessarily both

257:          require(_startTimestamp > 0, "INVALID_START_TIMESTAMP");

262:          require(_startTimestamp < _endTimestamp, "INVALID_END_TIMESTAMP"); // _endTimestamp must be after _startTimestamp

263:          require(_releaseIntervalSecs > 0, "INVALID_RELEASE_INTERVAL");

264:          require((_endTimestamp - _startTimestamp) % _releaseIntervalSecs == 0, "INVALID_INTERVAL_LENGTH");

270           require( 
271               (
272                   _cliffReleaseTimestamp > 0 && 
273                   _cliffAmount > 0 && 
274                   _cliffReleaseTimestamp <= _startTimestamp
275               ) || (
276                   _cliffReleaseTimestamp == 0 && 
277                   _cliffAmount == 0
278:          ), "INVALID_CLIFF");

295:          require(tokenAddress.balanceOf(address(this)) >= numTokensReservedForVesting + allocatedAmount, "INSUFFICIENT_BALANCE");

344           require(_startTimestamps.length == length &&
345                   _endTimestamps.length == length &&
346                   _cliffReleaseTimestamps.length == length &&
347                   _releaseIntervalsSecs.length == length &&
348                   _linearVestAmounts.length == length &&
349                   _cliffAmounts.length == length, 
350                   "ARRAY_LENGTH_MISMATCH"
351:          );

374:          require(allowance > usrClaim.amountWithdrawn, "NOTHING_TO_WITHDRAW");

402:          require(amountRemaining >= _amountRequested, "INSUFFICIENT_BALANCE");

426:          require( _claim.amountWithdrawn < finalVestAmt, "NO_UNVESTED_AMOUNT");

447:          require(_otherTokenAddress != tokenAddress, "INVALID_TOKEN"); // tokenAddress address is already sure to be nonzero due to constructor

449:          require(bal > 0, "INSUFFICIENT_BALANCE");

```

[VTVLVesting.sol#L82](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L82)<br>

## [G‑14]  Functions guaranteed to revert when called by normal users can be marked `payable`

If a function modifier such as `onlyOwner` is used, the function will revert if a normal user tries to pay the function. Marking the function as `payable` will lower the gas cost for legitimate callers because the compiler will not include checks for whether a payment was provided. The extra opcodes avoided are `CALLVALUE`(2),`DUP1`(3),`ISZERO`(3),`PUSH2`(3),`JUMPI`(10),`PUSH1`(3),`DUP1`(3),`REVERT`(0),`JUMPDEST`(1),`POP`(2), which costs an average of about **21 gas per call** to the function, in addition to the extra deployment cost.

*There are 7 instances of this issue:*

```solidity
File: contracts/AccessProtected.sol

39:       function setAdmin(address admin, bool isEnabled) public onlyAdmin {

```

[AccessProtected.sol#L39](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/AccessProtected.sol#L39)<br>

```solidity
File: contracts/token/VariableSupplyERC20Token.sol

36:       function mint(address account, uint256 amount) public onlyAdmin {

```

[VariableSupplyERC20Token.sol#L36](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/token/VariableSupplyERC20Token.sol#L36)<br>

```solidity
File: contracts/VTVLVesting.sol

317       function createClaim(
318               address _recipient, 
319               uint40 _startTimestamp, 
320               uint40 _endTimestamp, 
321               uint40 _cliffReleaseTimestamp, 
322               uint40 _releaseIntervalSecs, 
323               uint112 _linearVestAmount, 
324               uint112 _cliffAmount
325:                  ) external onlyAdmin {

333       function createClaimsBatch(
334           address[] memory _recipients, 
335           uint40[] memory _startTimestamps, 
336           uint40[] memory _endTimestamps, 
337           uint40[] memory _cliffReleaseTimestamps, 
338           uint40[] memory _releaseIntervalsSecs, 
339           uint112[] memory _linearVestAmounts, 
340           uint112[] memory _cliffAmounts) 
341:          external onlyAdmin {

398:      function withdrawAdmin(uint112 _amountRequested) public onlyAdmin {    

418:      function revokeClaim(address _recipient) external onlyAdmin hasActiveClaim(_recipient) {

446:      function withdrawOtherToken(IERC20 _otherTokenAddress) external onlyAdmin {

```

[VTVLVesting.sol#L317-L325](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L317-L325)<br>

## [G‑15]  Don't use `_msgSender()` if not supporting EIP-2771

Use `msg.sender` if the code does not implement [EIP-2771 trusted forwarder](https://eips.ethereum.org/EIPS/eip-2771) support.

*There are 13 instances of this issue:*

```solidity
File: contracts/AccessProtected.sol

17:           _admins[_msgSender()] = true;

18:           emit AdminAccessSet(_msgSender(), true);

25:           require(_admins[_msgSender()], "ADMIN_ACCESS_REQUIRED");

```

[AccessProtected.sol#L17](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/AccessProtected.sol#L17)<br>

```solidity
File: contracts/token/FullPremintERC20Token.sol

12:           _mint(_msgSender(), supply_);

```

[FullPremintERC20Token.sol#L12](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/token/FullPremintERC20Token.sol#L12)<br>

```solidity
File: contracts/token/VariableSupplyERC20Token.sol

32:               mint(_msgSender(), initialSupply_);

```

[VariableSupplyERC20Token.sol#L32](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/token/VariableSupplyERC20Token.sol#L32)<br>

```solidity
File: contracts/VTVLVesting.sol

367:          Claim storage usrClaim = claims[_msgSender()];

371:          uint112 allowance = vestedAmount(_msgSender(), uint40(block.timestamp));

388:          tokenAddress.safeTransfer(_msgSender(), amountRemaining);

391:          emit Claimed(_msgSender(), amountRemaining);

364:      function withdraw() hasActiveClaim(_msgSender()) external {

407:          tokenAddress.safeTransfer(_msgSender(), _amountRequested);

410:          emit AdminWithdrawn(_msgSender(), _amountRequested);

450:          _otherTokenAddress.safeTransfer(_msgSender(), bal);

```

[VTVLVesting.sol#L367](https://github.com/code-423n4/2022-09-vtvl/blob/f68b7f3e61dad0d873b5b5a1e8126b839afeab5f/contracts/VTVLVesting.sol#L367)<br>



***

# Disclosures

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.
