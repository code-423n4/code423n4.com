---
sponsor: "Axelar Network"
slug: "2022-07-axelar"
date: "2022-10-06"
title: "Axelar Network v2 contest"
findings: "https://github.com/code-423n4/2022-07-axelar-findings/issues"
contest: 149
---

# Overview

## About C4

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the Axelar Network v2 smart contract system written in Solidity. The audit contest took place between July 29—August 3 2022.

## Wardens

80 Wardens contributed reports to the Axelar Network v2 contest:

  1. [Chom](https://chom.dev)
  1. xiaoming90
  1. &#95;&#95;141345&#95;&#95;
  1. Lambda
  1. [Ruhum](https://twitter.com/0xruhum)
  1. [Respx](https://twitter.com/RespxR)
  1. 0x52
  1. cryptphi
  1. [oyc&#95;109](https://twitter.com/andyfeili)
  1. IllIllI
  1. rbserver
  1. [JC](https://twitter.com/sm4rtcontr4ct)
  1. Bnke0x0
  1. [defsec](https://twitter.com/defsec_)
  1. [Dravee](https://twitter.com/BowTiedDravee)
  1. 0x1f8b
  1. [fatherOfBlocks](https://twitter.com/father0fBl0cks)
  1. [Deivitto](https://twitter.com/Deivitto)
  1. ajtra
  1. robee
  1. mics
  1. [Aymen0909](https://github.com/Aymen1001)
  1. [TomJ](https://mobile.twitter.com/tomj_bb)
  1. horsefacts
  1. [Sm4rty](https://twitter.com/Sm4rty_)
  1. lucacez
  1. [c3phas](https://twitter.com/c3ph_)
  1. kyteg
  1. Rolezn
  1. simon135
  1. [0xNazgul](https://twitter.com/0xNazgul)
  1. [benbaessler](https://benbaessler.com)
  1. RedOneN
  1. [Rohan16](https://twitter.com/ROHANJH56009256)
  1. Waze
  1. apostle0x01
  1. djxploit
  1. [gogo](https://www.linkedin.com/in/georgi-nikolaev-georgiev-978253219)
  1. [tofunmi](https://twitter.com/dediranTofunmi)
  1. NoamYakov
  1. ReyAdmirado
  1. [bharg4v](https://twitter.com/Bharg4v)
  1. asutorufos
  1. bulej93
  1. CodingNameKiki
  1. [durianSausage](https://github.com/lyciumlee)
  1. sashik&#95;eth
  1. [8olidity](https://twitter.com/8olidity)
  1. [ElKu](https://twitter.com/ElKu_crypto)
  1. Noah3o6
  1. [berndartmueller](https://twitter.com/berndartmueller)
  1. [hansfriese](https://twitter.com/hansfriese)
  1. cccz
  1. [CertoraInc](https://twitter.com/CertoraInc) (egjlmn1, [OriDabush](https://twitter.com/ori_dabush), ItayG, shakedwinder, and RoiEvenHaim)
  1. [sseefried](http://seanseefried.org/blog)
  1. cryptonue
  1. 0xf15ers (remora and twojoy)
  1. [0xSmartContract](https://twitter.com/0xSmartContract)
  1. ashiq0x01
  1. bardamu
  1. codexploder
  1. [ignacio](https://twitter.com/0xheynacho)
  1. Twpony
  1. [ch13fd357r0y3r](https://twitter.com/ch13fd357r0y3r)
  1. Yiko
  1. [MiloTruck](https://milotruck.github.io/)
  1. 0xsam
  1. [gerdusx](https://twitter.com/GerdusM)
  1. [medikko](https://twitter.com/mehmeddukov)
  1. [Tomio](https://twitter.com/meidhiwirara)
  1. [owenthurm](guardianaudits.com)
  1. [a12jmx](https://twitter.com/a12jmx)
  1. [Fitraldys](https://twitter.com/fitraldys)
  1. ak1
  1. erictee

This contest was judged by [Alex the Entreprenerd](https://twitter.com/GalloDaSballo).

Final report assembled by [liveactionllama](https://twitter.com/liveactionllama).

# Summary

The C4 analysis yielded an aggregated total of 6 unique vulnerabilities. Of these vulnerabilities, 0 received a risk rating in the category of HIGH severity and 6 received a risk rating in the category of MEDIUM severity.

Additionally, C4 analysis included 65 reports detailing issues with a risk rating of LOW severity or non-critical. There were also 56 reports recommending gas optimizations.

All of the issues presented here are linked back to their original finding.

# Scope

The code under review can be found within the [C4 Axelar Network v2 contest repository](https://github.com/code-423n4/2022-07-axelar), and is composed of 15 smart contracts written in the Solidity programming language and includes 1,813 lines of Solidity code.

# Severity Criteria

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low/non-critical.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

- Malicious Input Handling
- Escalation of privileges
- Arithmetic
- Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code4rena.com).

# Medium Risk Findings (6)
## [[M-01] `removeWrapping` can be called when there are still wrapped tokens](https://github.com/code-423n4/2022-07-axelar-findings/issues/23)
_Submitted by Lambda, also found by 0x52 and cryptphi_

[XC20Wrapper.sol#L66](https://github.com/code-423n4/2022-07-axelar/blob/a1205d2ba78e0db583d136f8563e8097860a110f/xc20/contracts/XC20Wrapper.sol#L66)<br>

An owner can call `removeWrapping`, even if there are still circulating wrapped tokens. This will cause the unwrapping of those tokens to fail, as `unwrapped[wrappedToken]` will be `addres(0)`.

### Recommended Mitigation Steps

Track how many wrapped tokens are in circulation, only allow the removal of a wrapped tokens when there are 0 to ensure for users that they will always be able to unwrap.

**[re1ro (Axelar) confirmed and commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/23#issuecomment-1205933537):**
 > Valid observation. We will consider a different approach.
> 
> **Mitigation**<br>
> `removeWrapping` method was removed<br>
> https://github.com/axelarnetwork/axelar-xc20-wrapper/pull/4

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/23#issuecomment-1229574297):**
 > The warden has shown how the Admin can remove the mapping that allows to redeem bridged tokens, because this will cause the inability to unwrap, and can be operated by the admin, I agree with Medium Severity.
> 
> The sponsor has confirmed and they have mitigated by removing the function.



***

## [[M-02] `XC20Wrapper` may lose received token forever if `LocalAsset(xc20).mint` is reverted indefinitely](https://github.com/code-423n4/2022-07-axelar-findings/issues/176)
_Submitted by Chom_

[XC20Wrapper.sol#L124-L126](https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/xc20/contracts/XC20Wrapper.sol#L124-L126)<br>

XC20Wrapper may lose received token forever if LocalAsset(xc20).mint is reverted indefinitely.

Similar to ERC20, the spec said that if mint returns false it means minting is failed. But it is commonly revert instead of returning false which is also a minting failure. XC20 may revert on minting as well and common sense also guiding programmers to use the revert pattern instead of returning false.

This case is not handled if SC20 minting is reverted indefinitely. No matter how hard you retry the GMP message execution, it always fail thus the token get locked forever.

### Proof of Concept

        function _executeWithToken(
            string calldata,
            string calldata,
            bytes calldata payload,
            string calldata tokenSymbol,
            uint256 amount
        ) internal override {
            address receiver = abi.decode(payload, (address));
            address tokenAddress = gateway().tokenAddresses(tokenSymbol);
            address xc20 = wrapped[tokenAddress];
            if (xc20 == address(0) || !LocalAsset(xc20).mint(receiver, amount)) {
                _safeTransfer(tokenAddress, receiver, amount);
            }
        }

*   Token is sent to gateway before executing the message on the destination chain.
*   If `_executeWithToken` fail, the token remain inside gateway. The only way to use that token is to execute the `_executeWithToken` succesfully.
*   Assume LocalAsset(xc20).mint(...) revert indefinitely, \_executeWithToken also revert indefinitely.
*   As a result, `_executeWithToken` never success thus the tokens remain inside gateway forever.

### Recommended Mitigation Steps

Use try catch

        function _executeWithToken(
            string calldata,
            string calldata,
            bytes calldata payload,
            string calldata tokenSymbol,
            uint256 amount
        ) internal override {
            address receiver = abi.decode(payload, (address));
            address tokenAddress = gateway().tokenAddresses(tokenSymbol);
            address xc20 = wrapped[tokenAddress];
            if (xc20 == address(0)) {
                _safeTransfer(tokenAddress, receiver, amount);
            }

            try LocalAsset(xc20).mint(receiver, amount) returns (bool success) {
                if (!success) _safeTransfer(tokenAddress, receiver, amount);
            } catch { _safeTransfer(tokenAddress, receiver, amount); }
        }

**[re1ro (Axelar) acknowledged and commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/176#issuecomment-1206266860):**
 > **Mitigation**<br>
> We addressed the issue with introducing `_safeMint` function<br>
> https://github.com/axelarnetwork/axelar-xc20-wrapper/pull/4

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/176#issuecomment-1236396995):**
 > The warden states that `mint()` may fail and cause a revert instead of returning false.
> 
> With the code in scope we can check the used ERC20 implementation and we find:
> 
> [ERC20.sol#L187-L188](https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/xc20/contracts/ERC20.sol#L187-L188)<br>
> 
> ```solidity
>         if (account == address(0)) revert InvalidAccount();
> 
> ```
> 
> Because a revert can happen, the scenario, which hypothetically would brick the functionality can actually happen.
> 
> We may also have reverts due to overflow and underflow.
> 
> Because the code is built to assume that no revert can happen, but the warden demonstrated how a revert could factually happen, I do agree with Medium Severity.
> 
> The sponsor has mitigated by using `_safeMint`.



***

## [[M-03] System will not work anymore after EIP-4758](https://github.com/code-423n4/2022-07-axelar-findings/issues/20)
_Submitted by Lambda, also found by Chom_

[DepositReceiver.sol#L25](https://github.com/code-423n4/2022-07-axelar/blob/a46fa61e73dd0f3469c0263bc6818e682d62fb5f/contracts/deposit-service/DepositReceiver.sol#L25)<br>

After [EIP-4758](https://eips.ethereum.org/EIPS/eip-4758), the `SELFDESTRUCT` op code will no longer be available. According to the EIP, "The only use that breaks is where a contract is re-created at the same address using CREATE2 (after a SELFDESTRUCT)". Axelar is exactly such an application, the current deposit system will no longer work.

### Recommended Mitigation Steps

To avoid that Axelar simply stops working one day, the architecture should be changed. Instead of generating addresses for every user, the user could directly interact with the deposit service and the deposit service would need to keep track of funds and provide refunds directly.

**[re1ro (Axelar) commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/20#issuecomment-1205926507):**
 > Very good spot. We will address this.

**[re1ro (Axelar) acknowledged](https://github.com/code-423n4/2022-07-axelar-findings/issues/20)**

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/20#issuecomment-1236399840):**
 > The warden has shown a plausible upgrade path for Ethereum that will remove the `SELFDESTRUCT` opcode, bricking the `DepositReceiver` functionality.
> 
> If the fork was in place today, the code would be broken, and the finding should be of high severity.
> 
> Because the fork is not in place, and no clear timeline is defined for "The Purge", I think Medium Severity to be correct.



***

## [[M-04] Previous {Operators/Weights/Threshold} Are Still Able To Sign Off New Commands After Operatorship Is Transferred](https://github.com/code-423n4/2022-07-axelar-findings/issues/156)
_Submitted by xiaoming90_

The administrator will call `AxelarAuthWeighted.transferOperatorship` function to transfer the operatorship to a new set of {Operators/Weights/Threshold}.

However, it was observed that after transferring the operatorship to a new set of {Operators/Weights/Threshold}, the previous sets of {Operators/Weights/Threshold} are still able to generate a valid proof, and subsequently execute the command.

The following piece of code shows that as long as valid proof is submitted, the commands will be executed by the system.

[AxelarGateway.sol#L262](https://github.com/code-423n4/2022-07-axelar/blob/3729dd4aeff8dc2b8b9c3670a1c792c81fc60e7c/contracts/AxelarGateway.sol#L262)<br>

```solidity
function execute(bytes calldata input) external override {
    (bytes memory data, bytes memory proof) = abi.decode(input, (bytes, bytes));

    bytes32 messageHash = ECDSA.toEthSignedMessageHash(keccak256(data));

    // TEST auth and getaway separately
    bool currentOperators = IAxelarAuth(AUTH_MODULE).validateProof(messageHash, proof);
	..SNIP..
}
```

The following piece of code shows that the past 16 sets of {Operators/Weights/Threshold} are considered valid and can be used within the [`AxelarAuthWeighted._validateSignatures`](https://github.com/code-423n4/2022-07-axelar/blob/3729dd4aeff8dc2b8b9c3670a1c792c81fc60e7c/contracts/auth/AxelarAuthWeighted.sol#L86) function. Thus, the past 16 sets of {Operators/Weights/Threshold} are able to sign and submit a valid proof, and the proof will be accepted by the `AxelarAuthWeighted.validateProof` that allows them to execute the commands.

[AxelarAuthWeighted.sol#L36](https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/auth/AxelarAuthWeighted.sol#L36)<br>

```solidity
uint8 internal constant OLD_KEY_RETENTION = 16;

function validateProof(bytes32 messageHash, bytes calldata proof) external view returns (bool currentOperators) {
	(address[] memory operators, uint256[] memory weights, uint256 threshold, bytes[] memory signatures) = abi.decode(
		proof,
		(address[], uint256[], uint256, bytes[])
	);

	bytes32 operatorsHash = keccak256(abi.encode(operators, weights, threshold));
	uint256 operatorsEpoch = epochForHash[operatorsHash];
	uint256 epoch = currentEpoch;

	if (operatorsEpoch == 0 || epoch - operatorsEpoch >= OLD_KEY_RETENTION) revert InvalidOperators();

	_validateSignatures(messageHash, operators, weights, threshold, signatures);

	currentOperators = operatorsEpoch == epoch;
}
```

Understood from the team that the reason for allowing past 16 sets of {Operators/Weights/Threshold} is that after a transfer of operatorship, the commands that were signed recently but have not been executed yet will not become invalid. Further understood from the team the operatorship transfer is performed when there is a significant change in stake distribution on the Axelar network.

It makes sense for commands that were already signed recently by past operators before the operatorship transfer to be executable. However, based on the current design, it is also possible for the past 16 sets of {Operators/Weights/Threshold} to submit a new valid proof/signature for new commands to be executed after the operatorship transfer, and the `AxelarAuthWeighted._validateSignatures` function will happily accept the proof/signature, which should not be allowed.

It was understood that the operatorship transfer is performed when there is a significant change in stake distribution on the Axelar network, therefore, it does not make sense for all the past 16 sets of {Operators/Weights/Threshold} to be still able to sign and execute new commands after the operatorship transfer, because they follow the old stake distribution that is no longer considered as valid.

Only the current set of operators and its stake distribution should be used to verify any new command signed and issued after the operatorship transfer.

### Proof-of-Concept

Assuming that there are 3 validators (Alice, Bob and Charles)

#### Operation at Time 1 (T1)

At T1, the following is the state:

> currentEpoch = 1
>
> hashForEpoch\[Epoch 1] = {operators: \[Alice, Bob, Charles], weights: \[0.5, 0.25, 0.25], threshold: 0.5} convert to hash

At T1, Alice could submit the following input to `AxelarGateway.execute(bytes calldata input)` function to execute the commands:

> input = {
>
> ​	bytes memory data = commands to be executed
>
> ​	bytes memory proof = {operators: \[Alice, Bob, Charles], weights: \[0.5, 0.25, 0.25], threshold: 0.5, signatures: \[Alice's signature]}
>
> }

Since Alice's signature weight is 0.5, having Alice's signature alone is sufficient to meet the threshold of 0.5 and the commands will be executed.

#### Operation at Time 2 (T2)

At T2, the Axelar administrator decided to change the stake distribution. The admin called the `AxelarAuthWeighted.transferOperatorship` and change the state to as follows:

> currentEpoch = 2
>
> hashForEpoch\[Epoch 2] = {operators: \[Alice, Bob, Charles], weights: \[0.25, 0.4, 0.4], threshold: 0.5} convert to hash <== newly added
>
> hashForEpoch\[Epoch 1] = {operators: \[Alice, Bob, Charles], weights: \[0.5, 0.25, 0.25], threshold: 0.5} convert to hash

At T2, Alice's weight has reduced from `0.5` to `0.25`. As per the current stake distribution, Alice's signature alone is not sufficient to meet the threshold of `0.5`. Thus, she is not able to execute any new command without an additional signature from Bob or Charles.

However, note that the past 16 sets of {operators/weights/threshold} are considered valid by the system, so in another word, all the past 16 stake distributions are considered valid too.

Thus, Alice simply needs to re-use back to the previous set of {operators/weights/threshold} in Epoch 1 and she can continue to execute new commands without the signature of Bob or Charles, thus bypassing the current stake distribution.

At T2, Alice could still submit the following input to `AxelarGateway.execute(bytes calldata input)` function with only Alice's signature to execute the command:

> input = {
>
> ​	bytes memory data = commands to be executed
>
> ​	bytes memory proof = {operators: \[Alice, Bob, Charles], weights: \[0.5, 0.25, 0.25], threshold: 0.5, signatures: \[Alice's signature]}
>
> }

No additional signature from Bob or Charles is needed.

Following is from Epoch 1

> {operators: \[Alice, Bob, Charles], weights: \[0.5, 0.25, 0.25], threshold: 0.5

#### Operator Address Changed After Operatorship Is Being Transferred

Noted from the discord channel the following clarification from the team.

> Based on couple of questions I have received, I'd like to clarify one assumption we are making for the contracts (which is enforced at the axelar proof of stake network):
> Operators correspond to validators on the Axelar network. However, the operator address for a given epoch is derived from the validator key along with a nonce that is unique for each operator epoch.
> i.e Whenever operatorship is being transferred, an honest validator will always generate a new operator address (and not reuse their old one) due to a nonce.

With this control in place, even if the validator has generated a new operator address after the operatorship has been transferred, it is still possible for the validator to re-use back the old operator address and sign the command as the validator is aware of the private key needed to sign on behalf of the old operator address. Thus, the above issue still exists.

Additionally, there is always a risk of a "dishonest" validator not generating a new operator address after operatorship is being transferred if the new stake distribution does not benefit them. In the above example, Alice who has its weightage reduced from 0.5 to 0.25 do not see the benefit of the new stake distribution can decide not to generate a new operator address and continue to use the old operator address that allowed her to sign and execute any command without an additional signature from Bob or Charles.

### Impact

Current stake distribution can be bypassed.

### Recommended Mitigation Steps

Consider updating the system to ensure that the following requirements are followed:

*   Command signed by the past 16 sets of {operators/weights/threshold} AFTER the operatorship transfer should not be executable and should be rejected. Only commands signed by the current set of {operators/weights/threshold} AFTER the operatorship transfer should be accepted and executable.
*   Commands signed by the past 16 sets of {operators/weights/threshold} BEFORE the operatorship transfer should be accepted and executable.

**[re1ro (Axelar) commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/156#issuecomment-1206201357):**
 > Good spot.<br>
> I think we could include the timestamps to prevent old operators to sing any new commands.

**[Alex the Entreprenerd (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/156#issuecomment-1236421534):**
 > Per the Warden POC - Stake Distribution from past epochs is not changed, meaning a `transferOperatorship` called by the `owner` with the goal of reducing weights for a specific operator will be circumventable.
> 
> This implies:
> - Ability to sidestep coded logic and code intent -> Broken Invariants
> - Inability to kick a malicious operator (unless you use the 16 times transferOperatorship exploit shown from other reports)
> 
> The "need to remove a bad operator" is definitely contingent on setup, so Medium Severity is definitely fair.
> 
> I'll think about raising or keeping as Med.

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/156#issuecomment-1238533547):**
 > In contrast to other reports, this submission shows a reasonable path forward to invalidate old operators, while allowing them to re-try old commands.
> 
> For this reason I think this is distinct from [#19](https://github.com/code-423n4/2022-07-axelar-findings/issues/19) etc.



***

## [[M-05] Change of operators possible from old operators](https://github.com/code-423n4/2022-07-axelar-findings/issues/19)
_Submitted by Lambda, also found by Respx and Ruhum_

[AxelarGateway.sol#L268](https://github.com/code-423n4/2022-07-axelar/blob/3373c48a71c07cfce856b53afc02ef4fc2357f8c/contracts/AxelarGateway.sol#L268)<br>
[AxelarGateway.sol#L311](https://github.com/code-423n4/2022-07-axelar/blob/3373c48a71c07cfce856b53afc02ef4fc2357f8c/contracts/AxelarGateway.sol#L311)<br>

According to the specifications, only the current operators should be able to transfer operatorship. However, there is one way to circumvent this. Because currentOperators is not updated in the loop, when multiple `transferOperatorship` commands are submitted in the same `execute` call, all will succeed. After the first one, the operators that signed these commands are no longer the current operators, but the call will still succeed.

This also means that one set of operators could submit so many `transferOperatorship` commands in one `execute` call that `OLD_KEY_RETENTION` is reached for all other ones, meaning they would control complete set of currently valid operators.

### Recommended Mitigation Steps

Set `currentOperators` to `false` when the operators were changed.

**[re1ro (Axelar) confirmed, but disagreed with severity and commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/19#issuecomment-1205925612):**
 > This case would never occur in practice because our command batches are produced and signed by the Axelar nerwork.
> So there would be never 2 `transferOperatorship` commands in the same batch. 
> 
> In general if the recent operators turn malicious they can overtake the gateway disregarding this finding.
> 
> **Mitigation**<br>
> We still have added the sanity check to set `currentOperators` to `false`.<br>
> https://github.com/axelarnetwork/axelar-cgp-solidity/pull/138

**[milapsheth (Axelar) commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/19#issuecomment-1226049092):**
 > For more context, the current operators could just easily transfer the operatorship in multiple txs instead. We heavily rely on the assumption the majority of the operators by weight are not malicious.

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/19#issuecomment-1236399493):**
 > Very interesting find.
> 
> Per the warden submission: the operators can sign a `transferOperatorship` and then still act as if they are the current operator while their calls are being executed.
> 
> This can be further extended to perform more than `OLD_KEY_RETENTION` to invalidate all old keys, which may be desirable or a malicious attack depending on context.
> 
> The sponsor disagrees with severity, citing that the main assumption of the code is that operators by weight are non malicious
> 
> Personally I think the finding:
> - Breaks an assumption of the code (current operators exclusively can `transferOperatorship`)
> - Allows the operators to kick old operators in one tx instead of `OLD_KEY_RETENTION` txs

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/19#issuecomment-1236440077):**
 > With the information that I have, considering that:
> - Breaks an assumption of the code (current operators exclusively can transferOperatorship)
> - Allows the operators to kick old operators in one tx instead of OLD_KEY_RETENTION txs
> 
> Because this is contingent on a malicious majority, and considering that a malicious majority can perform even worse attacks (DOS, TX Censoring, Shutting down the chain)
> 
> I believe that Medium Severity is correct.



***

## [[M-06] Add cancel and refund option for Transaction Recovery](https://github.com/code-423n4/2022-07-axelar-findings/issues/139)
_Submitted by &#95;&#95;141345&#95;&#95;_

[AxelarGateway.sol#L262](https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/AxelarGateway.sol#L262)<br>
[AxelarGasService.sol#L98](https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/gas-service/AxelarGasService.sol#L98)<br>
[AxelarGasService.sol#L110](https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/gas-service/AxelarGasService.sol#L110)<br>

Transactions could fail or get stuck, according to the documentation:

> Occasionally, transactions can get "stuck" in the pipeline from a source to destination chain (e.g. due to one-off issues that arise with relayers that operate on top of the network).
>
> Transactions have typically gotten "stuck" in the pipeline due to: (A) The transaction failing to relay from the source chain into the Axelar network for processing. (B) The transaction failing to get executed on the destination chain.

And there are several options provided:

*   manual approve
*   manual execute
*   add gas

However, some transactions' execution depend on the time or certain condition. For example, some transaction has a deadline, it the deadline is passed, the transaction will be invalid. Or some conditions may be temporary, for example, some certain price difference for some token pair. In this case, the failed transactions will be meaningless to redo, the appropriate method is to cancel the transaction and refund. If no such option is provided, users' fund for this transaction would be lock or loss.

### Proof of Concept

```solidity
contracts/AxelarGateway.sol
    function approveContractCall(bytes calldata params, bytes32 commandId) external onlySelf {}
    function execute(bytes calldata input) external override {}

contracts/gas-service/AxelarGasService.sol
    function addGas() external override {}
    function addNativeGas() external payable override {}
```

The options are `approveContractCall()`, `execute`, `addGas()` and `addNativeGas()` are available, but no cancel and refund option.

### Recommended Mitigation Steps

Provide a cancel option if the transaction failed, from the source chain or destination chain, and allow the user to get the gas refund.

**[re1ro (Axelar) acknowledged and commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/139#issuecomment-1206146400):**
 > At this point this functionality can be implemented by the user in their Executable contract by the application. Axelar is providing a ground level cross-chain communication protocol. 
> 
> Refunds and deadline based cancel are very application specific cases and shouldn't be implemented on the protocol level. Some refunds could require manual intervention and it won't be scaleable for us to provide such support of all the applications built on top of Axelar. Especially considering that data related to expiration or price difference will be encoded inside of the payload and Axelar is not aware of the payload encoding.
> 
> It shouldn't be too difficult to implement. In this example we will send it back to the original chain: 
> ```
>     function _executeWithToken(
>         string memory sourceChain,
>         string memory sourceAddress,
>         bytes calldata payload,
>         string memory tokenSymbol,
>         uint256 amount
>     ) internal override {
>         if (price difference for some token pair > limit) {
>             IERC20(token).approve(address(gateway), amount);
>             gateway.sendToken(sourceChain, sourceAddress, tokenSymbol, amount);
>             return;
>         }
>        . . .     
>    }
> ```
> 
> We will consider adding basic implementation of such methods to our `AxelarExecutable` so it can be adapted by the applications. We will have a better idea of the requirements when there will be more applications built on top. Good spot.

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/139#issuecomment-1236442434):**
 > The warden has shown that the system in scope has no way to "cancel and refund" a transaction, while the details for impact are implementation dependent, allowing canceling tx that are failing to be relayed will help integrators in the worst case.
> 
> While impact is hard to quantify because the expected value of the operation by the caller should be higher than the gas paid, the actual loss in the stated case is that of the gas cost of the transaction.
> 
> While minor, given the fact that it is not recoverable, given the value of the submission and the acknowledgment by the sponsor, I think Medium Severity to be appropriate.

**[re1ro (Axelar) disagreed with severity and commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/139#issuecomment-1247489061):**
 > We disagree with severity.<br>
> Transactions are recoverable/refundable. There is nothing preventing it to be recovered from our protocol perspective. It's just that we don't suggest any default mechanism for this.
> 
> Refund and cancel methods are up to the cross-chain app developer to implement. It very application specific and it's not up for us to decide how and what should be recovered/refunded. For some application execution deadline could be a trigger to refund, for others - price slippage. Even if transaction reverts it will restore the gateway approval and can be retried or refunded.
> 
> Again it is not responsibility of the protocol but rather an application specific logic. We marked it as acknowledged because we agree we should provide some guidelines and examples for this in our docs. But there is no outstanding issue in this regard.

**Please note: the following took place after judging and awarding were finalized.**

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/139#issuecomment-1268881479):**
 > I believe the Sponsor's counterargument to be valid and invite end users to make up their own opinion.
>
> Ultimately the presence or absence of an app-specific refund is dependent on the implementation.
>
> I chose to give Medium Severity in view of the risk for end-users, however, I could have rated with QA given a different context.
>
> I invite end-users to make up their own opinion and thank the sponsor for their insight.



***

# Low Risk and Non-Critical Issues

For this contest, 65 reports were submitted by wardens detailing low risk and non-critical issues. The [report highlighted below](https://github.com/code-423n4/2022-07-axelar-findings/issues/8) by **oyc&#95;109** received the top score from the judge.

*The following wardens also submitted reports: [rbserver](https://github.com/code-423n4/2022-07-axelar-findings/issues/116), [IllIllI](https://github.com/code-423n4/2022-07-axelar-findings/issues/121), [Bnke0x0](https://github.com/code-423n4/2022-07-axelar-findings/issues/53), [defsec](https://github.com/code-423n4/2022-07-axelar-findings/issues/182), [xiaoming90](https://github.com/code-423n4/2022-07-axelar-findings/issues/168), [horsefacts](https://github.com/code-423n4/2022-07-axelar-findings/issues/187), [JC](https://github.com/code-423n4/2022-07-axelar-findings/issues/232), [robee](https://github.com/code-423n4/2022-07-axelar-findings/issues/16), [0x52](https://github.com/code-423n4/2022-07-axelar-findings/issues/88), [Dravee](https://github.com/code-423n4/2022-07-axelar-findings/issues/226), [mics](https://github.com/code-423n4/2022-07-axelar-findings/issues/27), [Chom](https://github.com/code-423n4/2022-07-axelar-findings/issues/185), [0x1f8b](https://github.com/code-423n4/2022-07-axelar-findings/issues/120), [berndartmueller](https://github.com/code-423n4/2022-07-axelar-findings/issues/138), [fatherOfBlocks](https://github.com/code-423n4/2022-07-axelar-findings/issues/52), [Sm4rty](https://github.com/code-423n4/2022-07-axelar-findings/issues/198), [hansfriese](https://github.com/code-423n4/2022-07-axelar-findings/issues/129), [Aymen0909](https://github.com/code-423n4/2022-07-axelar-findings/issues/184), [c3phas](https://github.com/code-423n4/2022-07-axelar-findings/issues/213), [Deivitto](https://github.com/code-423n4/2022-07-axelar-findings/issues/150), [lucacez](https://github.com/code-423n4/2022-07-axelar-findings/issues/70), [&#95;&#95;141345&#95;&#95;](https://github.com/code-423n4/2022-07-axelar-findings/issues/146), [Rohan16](https://github.com/code-423n4/2022-07-axelar-findings/issues/207), [Waze](https://github.com/code-423n4/2022-07-axelar-findings/issues/205), [kyteg](https://github.com/code-423n4/2022-07-axelar-findings/issues/103), [Rolezn](https://github.com/code-423n4/2022-07-axelar-findings/issues/3), [cccz](https://github.com/code-423n4/2022-07-axelar-findings/issues/160), [CertoraInc](https://github.com/code-423n4/2022-07-axelar-findings/issues/196), [Lambda](https://github.com/code-423n4/2022-07-axelar-findings/issues/21), [simon135](https://github.com/code-423n4/2022-07-axelar-findings/issues/172), [Respx](https://github.com/code-423n4/2022-07-axelar-findings/issues/131), [0xNazgul](https://github.com/code-423n4/2022-07-axelar-findings/issues/73), [ajtra](https://github.com/code-423n4/2022-07-axelar-findings/issues/200), [Ruhum](https://github.com/code-423n4/2022-07-axelar-findings/issues/46), [benbaessler](https://github.com/code-423n4/2022-07-axelar-findings/issues/153), [sseefried](https://github.com/code-423n4/2022-07-axelar-findings/issues/97), [bharg4v](https://github.com/code-423n4/2022-07-axelar-findings/issues/217), [cryptonue](https://github.com/code-423n4/2022-07-axelar-findings/issues/180), [RedOneN](https://github.com/code-423n4/2022-07-axelar-findings/issues/83), [0xf15ers](https://github.com/code-423n4/2022-07-axelar-findings/issues/189), [0xSmartContract](https://github.com/code-423n4/2022-07-axelar-findings/issues/84), [8olidity](https://github.com/code-423n4/2022-07-axelar-findings/issues/12), [apostle0x01](https://github.com/code-423n4/2022-07-axelar-findings/issues/169), [ashiq0x01](https://github.com/code-423n4/2022-07-axelar-findings/issues/95), [bardamu](https://github.com/code-423n4/2022-07-axelar-findings/issues/230), [bulej93](https://github.com/code-423n4/2022-07-axelar-findings/issues/107), [codexploder](https://github.com/code-423n4/2022-07-axelar-findings/issues/123), [CodingNameKiki](https://github.com/code-423n4/2022-07-axelar-findings/issues/81), [cryptphi](https://github.com/code-423n4/2022-07-axelar-findings/issues/136), [djxploit](https://github.com/code-423n4/2022-07-axelar-findings/issues/183), [durianSausage](https://github.com/code-423n4/2022-07-axelar-findings/issues/15), [ElKu](https://github.com/code-423n4/2022-07-axelar-findings/issues/93), [gogo](https://github.com/code-423n4/2022-07-axelar-findings/issues/209), [ignacio](https://github.com/code-423n4/2022-07-axelar-findings/issues/4), [Noah3o6](https://github.com/code-423n4/2022-07-axelar-findings/issues/66), [sashik&#95;eth](https://github.com/code-423n4/2022-07-axelar-findings/issues/192), [tofunmi](https://github.com/code-423n4/2022-07-axelar-findings/issues/60), [TomJ](https://github.com/code-423n4/2022-07-axelar-findings/issues/75), [Twpony](https://github.com/code-423n4/2022-07-axelar-findings/issues/188), [ch13fd357r0y3r](https://github.com/code-423n4/2022-07-axelar-findings/issues/6), [NoamYakov](https://github.com/code-423n4/2022-07-axelar-findings/issues/218), [ReyAdmirado](https://github.com/code-423n4/2022-07-axelar-findings/issues/48), [asutorufos](https://github.com/code-423n4/2022-07-axelar-findings/issues/215), and [Yiko](https://github.com/code-423n4/2022-07-axelar-findings/issues/118).*

## [L-01] Unused receive() function

If the intention is for the Ether to be used, the function should call another function, otherwise it should revert

    AxelarDepositServiceProxy.sol::13 => receive() external payable override {}
    DepositReceiver.sol::29 => receive() external payable {}

## [L-02] decimals() not part of ERC20 standard

decimals() is not part of the official ERC20 standard and might fail for tokens that do not implement it. While in practice it is very unlikely, as usually most of the tokens implement it, this should still be considered as a potential issue.

    XC20Wrapper.sol::62 => if (!LocalAsset(xc20Token).set_metadata(newName, newSymbol, IERC20(axelarToken).decimals())) revert('CannotSetMetadata()');

## [L-03] Unsafe use of transfer()/transferFrom() with IERC20

Some tokens do not implement the ERC20 standard properly but are still accepted by most code that accepts ERC20 tokens. For example Tether (USDT)'s transfer() and transferFrom() functions do not return booleans as the specification requires, and instead have no return value. When these sorts of tokens are cast to IERC20, their function signatures do not match and therefore the calls made, revert. Use OpenZeppelin’s SafeERC20's safeTransfer()/safeTransferFrom() instead

    AxelarGasService.sol::128 => if (amount > 0) receiver.transfer(amount);
    AxelarGasService.sol::144 => receiver.transfer(amount);
    ReceiverImplementation.sol::23 => if (address(this).balance > 0) refundAddress.transfer(address(this).balance);
    ReceiverImplementation.sol::51 => if (address(this).balance > 0) refundAddress.transfer(address(this).balance);
    ReceiverImplementation.sol::71 => if (address(this).balance > 0) refundAddress.transfer(address(this).balance);
    ReceiverImplementation.sol::86 => recipient.transfer(amount);

## [L-04] Missing checks for zero address

Checking addresses against zero-address during initialization or during setting is a security best-practice. However, such checks are missing in address variable initializations/changes in many places.

Impact: Allowing zero-addresses will lead to contract reverts and force redeployments if there are no setters for such address variables.

    https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/AxelarGateway.sol#L229
    https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/deposit-service/AxelarDepositService.sol#L19

## [N-01] Use a more recent version of solidity

Use a solidity version of at least 0.8.4 to get bytes.concat() instead of abi.encodePacked(<bytes>,<bytes>)
Use a solidity version of at least 0.8.12 to get string.concat() instead of abi.encodePacked(<str>,<str>)
Use a solidity version of at least 0.8.13 to get the ability to use using for with a list of free functions

    AxelarAuthWeighted.sol::3 => pragma solidity 0.8.9;
    AxelarDepositServiceProxy.sol::3 => pragma solidity 0.8.9;
    AxelarDepositService.sol::3 => pragma solidity 0.8.9;
    AxelarGasServiceProxy.sol::3 => pragma solidity 0.8.9;
    AxelarGasService.sol::3 => pragma solidity 0.8.9;
    AxelarGateway.sol::3 => pragma solidity 0.8.9;
    DepositBase.sol::3 => pragma solidity 0.8.9;
    DepositReceiver.sol::3 => pragma solidity 0.8.9;
    IAxelarAuth.sol::3 => pragma solidity ^0.8.9;
    IAxelarAuthWeighted.sol::3 => pragma solidity ^0.8.9;
    IAxelarDepositService.sol::3 => pragma solidity ^0.8.9;
    IAxelarGasService.sol::3 => pragma solidity ^0.8.9;
    IDepositBase.sol::3 => pragma solidity ^0.8.9;
    ReceiverImplementation.sol::3 => pragma solidity 0.8.9;
    XC20Wrapper.sol::3 => pragma solidity 0.8.9;

## [N-02] Unspecific Compiler Version Pragma

Avoid floating pragmas for non-library contracts.

While floating pragmas make sense for libraries to allow them to be included with multiple different versions of applications, it may be a security risk for application implementations.

A known vulnerable compiler version may accidentally be selected or security tools might fall-back to an older compiler version ending up checking a different EVM compilation that is ultimately deployed on the blockchain.

It is recommended to pin to a concrete compiler version.

    IAxelarAuth.sol::3 => pragma solidity ^0.8.9;
    IAxelarAuthWeighted.sol::3 => pragma solidity ^0.8.9;
    IAxelarDepositService.sol::3 => pragma solidity ^0.8.9;
    IAxelarGasService.sol::3 => pragma solidity ^0.8.9;
    IDepositBase.sol::3 => pragma solidity ^0.8.9;

**[re1ro (Axelar) acknowledged and commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/8#issuecomment-1205893984):**
 > **[L-01]**<br>
> Not applicable. We need `receive` to receive ether from `WETH` contract.
> 
> **[L-02]**<br>
> Not applicable. `axelarToken` is our own implementation in this context and it implements `decimals`
> 
> **[L-03]**<br>
> Nope.
> 
> **[L-04]**<br>
> Yes.
> 
> **[N-01]**<br>
> We allow Unspecific Compiler version for our interfaces, so they can be imported by other projects

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/8#issuecomment-1233585799):**
 > **[L-01] Unused receive() function**<br>
> For the proxy<br>
> Low
> 
> **[L-02] decimals() not part of ERC20 standard**<br>
> Low
> 
> **[L-03] Unsafe use of transfer()/transferFrom() with IERC20**<br>
> Low
> 
> **[L-04] Missing checks for zero address**<br>
> Low
> 
> **[N-01] Use a more recent version of solidity**<br>
> Non-critical
> 
> **[N-02] Unspecific Compiler Version Pragma**<br>
> Non-critical



***

# Gas Optimizations

For this contest, 56 reports were submitted by wardens detailing gas optimizations. The [report highlighted below](https://github.com/code-423n4/2022-07-axelar-findings/issues/122) by **IllIllI** received the top score from the judge.

*The following wardens also submitted reports: [JC](https://github.com/code-423n4/2022-07-axelar-findings/issues/231), [Dravee](https://github.com/code-423n4/2022-07-axelar-findings/issues/211), [0x1f8b](https://github.com/code-423n4/2022-07-axelar-findings/issues/113), [ajtra](https://github.com/code-423n4/2022-07-axelar-findings/issues/177), [Bnke0x0](https://github.com/code-423n4/2022-07-axelar-findings/issues/13), [defsec](https://github.com/code-423n4/2022-07-axelar-findings/issues/225), [Deivitto](https://github.com/code-423n4/2022-07-axelar-findings/issues/149), [fatherOfBlocks](https://github.com/code-423n4/2022-07-axelar-findings/issues/51), [oyc&#95;109](https://github.com/code-423n4/2022-07-axelar-findings/issues/7), [Aymen0909](https://github.com/code-423n4/2022-07-axelar-findings/issues/173), [MiloTruck](https://github.com/code-423n4/2022-07-axelar-findings/issues/174), [TomJ](https://github.com/code-423n4/2022-07-axelar-findings/issues/181), [Ruhum](https://github.com/code-423n4/2022-07-axelar-findings/issues/45), [&#95;&#95;141345&#95;&#95;](https://github.com/code-423n4/2022-07-axelar-findings/issues/148), [0xNazgul](https://github.com/code-423n4/2022-07-axelar-findings/issues/72), [0xsam](https://github.com/code-423n4/2022-07-axelar-findings/issues/64), [apostle0x01](https://github.com/code-423n4/2022-07-axelar-findings/issues/170), [benbaessler](https://github.com/code-423n4/2022-07-axelar-findings/issues/151), [djxploit](https://github.com/code-423n4/2022-07-axelar-findings/issues/179), [gerdusx](https://github.com/code-423n4/2022-07-axelar-findings/issues/154), [gogo](https://github.com/code-423n4/2022-07-axelar-findings/issues/191), [kyteg](https://github.com/code-423n4/2022-07-axelar-findings/issues/104), [Lambda](https://github.com/code-423n4/2022-07-axelar-findings/issues/18), [lucacez](https://github.com/code-423n4/2022-07-axelar-findings/issues/69), [medikko](https://github.com/code-423n4/2022-07-axelar-findings/issues/234), [NoamYakov](https://github.com/code-423n4/2022-07-axelar-findings/issues/221), [rbserver](https://github.com/code-423n4/2022-07-axelar-findings/issues/126), [RedOneN](https://github.com/code-423n4/2022-07-axelar-findings/issues/82), [ReyAdmirado](https://github.com/code-423n4/2022-07-axelar-findings/issues/47), [robee](https://github.com/code-423n4/2022-07-axelar-findings/issues/17), [Rolezn](https://github.com/code-423n4/2022-07-axelar-findings/issues/2), [simon135](https://github.com/code-423n4/2022-07-axelar-findings/issues/171), [tofunmi](https://github.com/code-423n4/2022-07-axelar-findings/issues/59), [Tomio](https://github.com/code-423n4/2022-07-axelar-findings/issues/115), [Respx](https://github.com/code-423n4/2022-07-axelar-findings/issues/86), [asutorufos](https://github.com/code-423n4/2022-07-axelar-findings/issues/222), [bharg4v](https://github.com/code-423n4/2022-07-axelar-findings/issues/223), [bulej93](https://github.com/code-423n4/2022-07-axelar-findings/issues/106), [Chom](https://github.com/code-423n4/2022-07-axelar-findings/issues/204), [CodingNameKiki](https://github.com/code-423n4/2022-07-axelar-findings/issues/57), [durianSausage](https://github.com/code-423n4/2022-07-axelar-findings/issues/14), [mics](https://github.com/code-423n4/2022-07-axelar-findings/issues/28), [owenthurm](https://github.com/code-423n4/2022-07-axelar-findings/issues/92), [Rohan16](https://github.com/code-423n4/2022-07-axelar-findings/issues/208), [sashik&#95;eth](https://github.com/code-423n4/2022-07-axelar-findings/issues/202), [Sm4rty](https://github.com/code-423n4/2022-07-axelar-findings/issues/199), [Waze](https://github.com/code-423n4/2022-07-axelar-findings/issues/197), [a12jmx](https://github.com/code-423n4/2022-07-axelar-findings/issues/233), [Fitraldys](https://github.com/code-423n4/2022-07-axelar-findings/issues/224), [8olidity](https://github.com/code-423n4/2022-07-axelar-findings/issues/11), [ak1](https://github.com/code-423n4/2022-07-axelar-findings/issues/190), [c3phas](https://github.com/code-423n4/2022-07-axelar-findings/issues/214), [ElKu](https://github.com/code-423n4/2022-07-axelar-findings/issues/94), [erictee](https://github.com/code-423n4/2022-07-axelar-findings/issues/49), and [Noah3o6](https://github.com/code-423n4/2022-07-axelar-findings/issues/67).*

## Summary

|        | Issue                                                                                                                                                      | Instances |
| ------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------: |
| [G‑01] | Using `calldata` instead of `memory` for read-only arguments in `external` functions saves gas                                                             |     7     |
| [G‑02] | Avoid contract existence checks by using solidity version 0.8.10 or later                                                                                  |     25    |
| [G‑03] | `internal` functions only called once can be inlined to save gas                                                                                           |     7     |
| [G‑04] | `<array>.length` should not be looked up in every loop of a `for`-loop                                                                                     |     7     |
| [G‑05] | `++i`/`i++` should be `unchecked{++i}`/`unchecked{i++}` when it is not possible for them to overflow, as is the case when used in `for`- and `while`-loops |     12    |
| [G‑06] | `keccak256()` should only need to be called on a specific string literal once                                                                              |     4     |
| [G‑07] | Optimize names to save gas                                                                                                                                 |     10    |
| [G‑08] | `++i` costs less gas than `i++`, especially when it's used in `for`-loops (`--i`/`i--` too)                                                                |     5     |
| [G‑09] | Empty blocks should be removed or emit something                                                                                                           |     2     |
| [G‑10] | Functions guaranteed to revert when called by normal users can be marked `payable`                                                                         |     11    |

Total: 90 instances over 10 issues

## [G‑01]  Using `calldata` instead of `memory` for read-only arguments in `external` functions saves gas

When a function with a `memory` array is called externally, the `abi.decode()` step has to use a for-loop to copy each index of the `calldata` to the `memory` index. **Each iteration of this for-loop costs at least 60 gas** (i.e. `60 * <mem_array>.length`). Using `calldata` directly, obliviates the need for such a loop in the contract code and runtime execution. Note that even if an interface defines a function as having `memory` arguments, it's still valid for implementation contracs to use `calldata` arguments instead.

If the array is passed to an `internal` function which passes the array to another internal function where the array is modified and therefore `memory` is used in the `external` call, it's still more gass-efficient to use `calldata` when the `external` function uses modifiers, since the modifiers may prevent the internal functions from being called. Structs have the same overhead as an array of length one

Note that I've also flagged instances where the function is `public` but can be marked as `external` since it's not called by the contract, and cases where a constructor is involved

*There are 7 instances of this issue:*

```solidity
File: contracts/auth/AxelarAuthWeighted.sol

/// @audit recentOperators
16:       constructor(bytes[] memory recentOperators) {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/auth/AxelarAuthWeighted.sol#L16>

```solidity
File: contracts/AxelarGateway.sol

172:      function tokenFrozen(string memory) external pure override returns (bool) {

/// @audit executeData
447       function _unpackLegacyCommands(bytes memory executeData)
448           external
449           pure
450           returns (
451               uint256 chainId,
452               bytes32[] memory commandIds,
453               string[] memory commands,
454:              bytes[] memory params

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/AxelarGateway.sol#L172>

```solidity
File: contracts/deposit-service/AxelarDepositService.sol

/// @audit wrappedSymbol
18:       constructor(address gateway, string memory wrappedSymbol) DepositBase(gateway, wrappedSymbol) {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/deposit-service/AxelarDepositService.sol#L18>

```solidity
File: contracts/deposit-service/DepositReceiver.sol

/// @audit delegateData
8:        constructor(bytes memory delegateData) {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/deposit-service/DepositReceiver.sol#L8>

```solidity
File: contracts/deposit-service/ReceiverImplementation.sol

/// @audit wrappedSymbol
12:       constructor(address gateway, string memory wrappedSymbol) DepositBase(gateway, wrappedSymbol) {}

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/deposit-service/ReceiverImplementation.sol#L12>

```solidity
File: contracts/gas-service/AxelarGasService.sol

/// @audit symbol
35        function payGasForContractCallWithToken(
36            address sender,
37            string calldata destinationChain,
38            string calldata destinationAddress,
39            bytes calldata payload,
40            string memory symbol,
41            uint256 amount,
42            address gasToken,
43            uint256 gasFeeAmount,
44:           address refundAddress

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/gas-service/AxelarGasService.sol#L35-L44>

## [G‑02]  Avoid contract existence checks by using solidity version 0.8.10 or later

Prior to 0.8.10 the compiler inserted extra code, including `EXTCODESIZE` (**100 gas**), to check for contract existence for external calls. In more recent solidity versions, the compiler will not insert these checks if the external call has a return value

*There are 25 instances of this issue:*

```solidity
File: contracts/AxelarGateway.sol

/// @audit validateProof()
268:          bool currentOperators = IAxelarAuth(AUTH_MODULE).validateProof(messageHash, proof);

/// @audit _unpackLegacyCommands()
275:          try AxelarGateway(this)._unpackLegacyCommands(data) returns (

/// @audit call()
320:              (bool success, ) = address(this).call(abi.encodeWithSelector(commandSelector, params[i], commandId));

/// @audit balanceOf()
385:                  abi.encodeWithSelector(IERC20.transfer.selector, address(this), IERC20(tokenAddress).balanceOf(address(depositHandler)))

/// @audit burn()
393:              IBurnableMintableCappedERC20(tokenAddress).burn(salt);

/// @audit mint()
481:              IBurnableMintableCappedERC20(tokenAddress).mint(account, amount);

/// @audit depositAddress()
525:                  IBurnableMintableCappedERC20(tokenAddress).depositAddress(bytes32(0)),

/// @audit burn()
532:          IBurnableMintableCappedERC20(tokenAddress).burn(bytes32(0));

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/AxelarGateway.sol#L268>

```solidity
File: contracts/deposit-service/AxelarDepositService.sol

/// @audit approve()
30:           IERC20(wrappedTokenAddress).approve(gateway, amount);

/// @audit tokenAddresses()
115:              address gatewayToken = IAxelarGateway(gateway).tokenAddresses(tokenSymbol);

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/deposit-service/AxelarDepositService.sol#L30>

```solidity
File: contracts/deposit-service/DepositReceiver.sol

/// @audit delegatecall()
/// @audit receiverImplementation()
12:           (bool success, ) = IAxelarDepositService(msg.sender).receiverImplementation().delegatecall(delegateData);

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/deposit-service/DepositReceiver.sol#L12>

```solidity
File: contracts/deposit-service/ReceiverImplementation.sol

/// @audit tokenAddresses()
25:           address tokenAddress = IAxelarGateway(gateway).tokenAddresses(symbol);

/// @audit refundToken()
27:           address refund = DepositBase(msg.sender).refundToken();

/// @audit balanceOf()
29:               _safeTransfer(refund, refundAddress, IERC20(refund).balanceOf(address(this)));

/// @audit balanceOf()
33:           uint256 amount = IERC20(tokenAddress).balanceOf(address(this));

/// @audit approve()
38:           IERC20(tokenAddress).approve(gateway, amount);

/// @audit refundToken()
49:           address refund = DepositBase(msg.sender).refundToken();

/// @audit balanceOf()
53:               _safeTransfer(refund, refundAddress, IERC20(refund).balanceOf(address(this)));

/// @audit approve()
64:           IERC20(wrappedTokenAddress).approve(gateway, amount);

/// @audit refundToken()
74:           address refund = DepositBase(msg.sender).refundToken();

/// @audit balanceOf()
76:               _safeTransfer(refund, refundAddress, IERC20(refund).balanceOf(address(this)));

/// @audit balanceOf()
80:           uint256 amount = IERC20(wrappedTokenAddress).balanceOf(address(this));

/// @audit withdraw()
85:           IWETH9(wrappedTokenAddress).withdraw(amount);

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/deposit-service/ReceiverImplementation.sol#L25>

```solidity
File: contracts/gas-service/AxelarGasService.sol

/// @audit balanceOf()
130:                  uint256 amount = IERC20(token).balanceOf(address(this));

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/gas-service/AxelarGasService.sol#L130>

## [G‑03]  `internal` functions only called once can be inlined to save gas

Not inlining costs **20 to 40 gas** because of two extra `JUMP` instructions and additional stack operations needed for function calls.

*There are 7 instances of this issue:*

```solidity
File: contracts/auth/AxelarAuthWeighted.sol

86        function _validateSignatures(
87            bytes32 messageHash,
88            address[] memory operators,
89            uint256[] memory weights,
90            uint256 threshold,
91:           bytes[] memory signatures

115:      function _isSortedAscAndContainsNoDuplicate(address[] memory accounts) internal pure returns (bool) {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/auth/AxelarAuthWeighted.sol#L86-L91>

```solidity
File: contracts/AxelarGateway.sol

611:      function _setTokenDailyMintAmount(string memory symbol, uint256 amount) internal {

622:      function _setTokenAddress(string memory symbol, address tokenAddress) internal {

630       function _setContractCallApproved(
631           bytes32 commandId,
632           string memory sourceChain,
633           string memory sourceAddress,
634           address contractAddress,
635:          bytes32 payloadHash

640       function _setContractCallApprovedWithMint(
641           bytes32 commandId,
642           string memory sourceChain,
643           string memory sourceAddress,
644           address contractAddress,
645           bytes32 payloadHash,
646           string memory symbol,
647:          uint256 amount

655:      function _setImplementation(address newImplementation) internal {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/AxelarGateway.sol#L611>

## [G‑04]  `<array>.length` should not be looked up in every loop of a `for`-loop

The overheads outlined below are *PER LOOP*, excluding the first loop

*   storage arrays incur a Gwarmaccess (**100 gas**)
*   memory arrays use `MLOAD` (**3 gas**)
*   calldata arrays use `CALLDATALOAD` (**3 gas**)

Caching the length changes each of these to a `DUP<N>` (**3 gas**), and gets rid of the extra `DUP<N>` needed to store the stack offset

*There are 7 instances of this issue:*

```solidity
File: contracts/auth/AxelarAuthWeighted.sol

17:           for (uint256 i; i < recentOperators.length; ++i) {

98:           for (uint256 i = 0; i < signatures.length; ++i) {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/auth/AxelarAuthWeighted.sol#L17>

```solidity
File: contracts/AxelarGateway.sol

207:          for (uint256 i = 0; i < symbols.length; i++) {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/AxelarGateway.sol#L207>

```solidity
File: contracts/deposit-service/AxelarDepositService.sol

114:          for (uint256 i; i < refundTokens.length; i++) {

168:          for (uint256 i; i < refundTokens.length; i++) {

204:          for (uint256 i; i < refundTokens.length; i++) {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/deposit-service/AxelarDepositService.sol#L114>

```solidity
File: contracts/gas-service/AxelarGasService.sol

123:          for (uint256 i; i < tokens.length; i++) {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/gas-service/AxelarGasService.sol#L123>

## [G‑05]  `++i`/`i++` should be `unchecked{++i}`/`unchecked{i++}` when it is not possible for them to overflow, as is the case when used in `for`- and `while`-loops

The `unchecked` keyword is new in solidity version 0.8.0, so this only applies to that version or higher, which these instances are. This saves **30-40 gas [per loop](https://gist.github.com/hrkrshnn/ee8fabd532058307229d65dcd5836ddc#the-increment-in-for-loop-post-condition-can-be-made-unchecked)**

*There are 12 instances of this issue:*

```solidity
File: contracts/auth/AxelarAuthWeighted.sol

17:           for (uint256 i; i < recentOperators.length; ++i) {

69:           for (uint256 i = 0; i < weightsLength; ++i) {

98:           for (uint256 i = 0; i < signatures.length; ++i) {

101:              for (; operatorIndex < operatorsLength && signer != operators[operatorIndex]; ++operatorIndex) {}

116:          for (uint256 i; i < accounts.length - 1; ++i) {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/auth/AxelarAuthWeighted.sol#L17>

```solidity
File: contracts/AxelarGateway.sol

195:          for (uint256 i; i < adminCount; ++i) {

207:          for (uint256 i = 0; i < symbols.length; i++) {

292:          for (uint256 i; i < commandsLength; ++i) {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/AxelarGateway.sol#L195>

```solidity
File: contracts/deposit-service/AxelarDepositService.sol

114:          for (uint256 i; i < refundTokens.length; i++) {

168:          for (uint256 i; i < refundTokens.length; i++) {

204:          for (uint256 i; i < refundTokens.length; i++) {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/deposit-service/AxelarDepositService.sol#L114>

```solidity
File: contracts/gas-service/AxelarGasService.sol

123:          for (uint256 i; i < tokens.length; i++) {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/gas-service/AxelarGasService.sol#L123>

## [G‑06]  `keccak256()` should only need to be called on a specific string literal once

It should be saved to an immutable variable, and the variable used instead. If the hash is being used as a part of a function selector, the cast to `bytes4` should also only be done once

*There are 4 instances of this issue:*

```solidity
File: contracts/deposit-service/AxelarDepositServiceProxy.sol

9:            return keccak256('axelar-deposit-service');

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/deposit-service/AxelarDepositServiceProxy.sol#L9>

```solidity
File: contracts/deposit-service/AxelarDepositService.sol

242:          return keccak256('axelar-deposit-service');

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/deposit-service/AxelarDepositService.sol#L242>

```solidity
File: contracts/gas-service/AxelarGasServiceProxy.sol

10:           return keccak256('axelar-gas-service');

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/gas-service/AxelarGasServiceProxy.sol#L10>

```solidity
File: contracts/gas-service/AxelarGasService.sol

181:          return keccak256('axelar-gas-service');

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/gas-service/AxelarGasService.sol#L181>

## [G‑07]  Optimize names to save gas

`public`/`external` function names and `public` member variable names can be optimized to save gas. See [this](https://gist.github.com/IllIllI000/a5d8b486a8259f9f77891a919febd1a9) link for an example of how it works. Below are the interfaces/abstract contracts that can be optimized so that the most frequently-called functions use the least amount of gas possible during method lookup. Method IDs that have two leading zero bytes can save **128 gas** each during deployment, and renaming functions to have lower method IDs will save **22 gas** per call, [per sorted position shifted](https://medium.com/joyso/solidity-how-does-function-name-affect-gas-consumption-in-smart-contract-47d270d8ac92)

*There are 10 instances of this issue:*

```solidity
File: contracts/auth/AxelarAuthWeighted.sol

/// @audit validateProof(), transferOperatorship()
9:    contract AxelarAuthWeighted is Ownable, IAxelarAuthWeighted {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/auth/AxelarAuthWeighted.sol#L9>

```solidity
File: contracts/AxelarGateway.sol

/// @audit sendToken(), callContract(), callContractWithToken(), deployToken(), mintToken(), burnToken(), approveContractCall(), approveContractCallWithMint(), transferOperatorship(), _unpackLegacyCommands()
15:   contract AxelarGateway is IAxelarGateway, AdminMultisigBase {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/AxelarGateway.sol#L15>

```solidity
File: contracts/deposit-service/AxelarDepositService.sol

/// @audit sendNative(), addressForTokenDeposit(), addressForNativeDeposit(), addressForNativeUnwrap(), sendTokenDeposit(), refundTokenDeposit(), sendNativeDeposit(), refundNativeDeposit(), nativeUnwrap(), refundNativeUnwrap(), contractId()
15:   contract AxelarDepositService is Upgradable, DepositBase, IAxelarDepositService {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/deposit-service/AxelarDepositService.sol#L15>

```solidity
File: contracts/deposit-service/ReceiverImplementation.sol

/// @audit receiveAndSendToken(), receiveAndSendNative(), receiveAndUnwrapNative()
11:   contract ReceiverImplementation is DepositBase {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/deposit-service/ReceiverImplementation.sol#L11>

```solidity
File: contracts/gas-service/AxelarGasService.sol

/// @audit collectFees(), refund(), contractId()
10:   contract AxelarGasService is Upgradable, IAxelarGasService {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/gas-service/AxelarGasService.sol#L10>

```solidity
File: contracts/interfaces/IAxelarAuth.sol

/// @audit validateProof(), transferOperatorship()
7:    interface IAxelarAuth is IOwnable {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/interfaces/IAxelarAuth.sol#L7>

```solidity
File: contracts/interfaces/IAxelarAuthWeighted.sol

/// @audit currentEpoch(), hashForEpoch(), epochForHash()
7:    interface IAxelarAuthWeighted is IAxelarAuth {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/interfaces/IAxelarAuthWeighted.sol#L7>

```solidity
File: contracts/interfaces/IAxelarDepositService.sol

/// @audit sendNative(), addressForTokenDeposit(), addressForNativeDeposit(), addressForNativeUnwrap(), sendTokenDeposit(), refundTokenDeposit(), sendNativeDeposit(), refundNativeDeposit(), nativeUnwrap(), refundNativeUnwrap(), receiverImplementation()
9:    interface IAxelarDepositService is IUpgradable, IDepositBase {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/interfaces/IAxelarDepositService.sol#L9>

```solidity
File: contracts/interfaces/IAxelarExecutable.sol

/// @audit execute(), executeWithToken()
7:    abstract contract IAxelarExecutable {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/interfaces/IAxelarExecutable.sol#L7>

```solidity
File: contracts/interfaces/IAxelarGasService.sol

/// @audit payGasForContractCall(), payGasForContractCallWithToken(), payNativeGasForContractCall(), payNativeGasForContractCallWithToken(), addGas(), addNativeGas(), collectFees(), refund()
8:    interface IAxelarGasService is IUpgradable {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/interfaces/IAxelarGasService.sol#L8>

## [G‑08]  `++i` costs less gas than `i++`, especially when it's used in `for`-loops (`--i`/`i--` too)

Saves **5 gas per loop**

*There are 5 instances of this issue:*

```solidity
File: contracts/AxelarGateway.sol

207:          for (uint256 i = 0; i < symbols.length; i++) {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/AxelarGateway.sol#L207>

```solidity
File: contracts/deposit-service/AxelarDepositService.sol

114:          for (uint256 i; i < refundTokens.length; i++) {

168:          for (uint256 i; i < refundTokens.length; i++) {

204:          for (uint256 i; i < refundTokens.length; i++) {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/deposit-service/AxelarDepositService.sol#L114>

```solidity
File: contracts/gas-service/AxelarGasService.sol

123:          for (uint256 i; i < tokens.length; i++) {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/gas-service/AxelarGasService.sol#L123>

## [G‑09]  Empty blocks should be removed or emit something

The code should be refactored such that they no longer exist, or the block should do something useful, such as emitting an event or reverting. If the contract is meant to be extended, the contract should be `abstract` and the function signatures be added without any default implementation. If the block is an empty `if`-statement block to avoid doing subsequent checks in the else-if/else conditions, the else-if/else conditions should be nested under the negation of the if-statement, because they involve different classes of checks, which may lead to the introduction of errors when the code is later modified (`if(x){}else if(y){...}else{...}` => `if(!x){if(y){...}else{...}}`). Empty `receive()`/`fallback() payable` functions that are not used, can be removed to save deployment gas.

*There are 2 instances of this issue:*

```solidity
File: contracts/interfaces/IAxelarExecutable.sol

46:       ) internal virtual {}

54:       ) internal virtual {}

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/interfaces/IAxelarExecutable.sol#L46>

## [G‑10]  Functions guaranteed to revert when called by normal users can be marked `payable`

If a function modifier such as `onlyOwner` is used, the function will revert if a normal user tries to pay the function. Marking the function as `payable` will lower the gas cost for legitimate callers because the compiler will not include checks for whether a payment was provided. The extra opcodes avoided are
`CALLVALUE`(2),`DUP1`(3),`ISZERO`(3),`PUSH2`(3),`JUMPI`(10),`PUSH1`(3),`DUP1`(3),`REVERT`(0),`JUMPDEST`(1),`POP`(2), which costs an average of about **21 gas per call** to the function, in addition to the extra deployment cost

*There are 11 instances of this issue:*

```solidity
File: contracts/auth/AxelarAuthWeighted.sol

47:       function transferOperatorship(bytes calldata params) external onlyOwner {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/auth/AxelarAuthWeighted.sol#L47>

```solidity
File: contracts/AxelarGateway.sol

204:      function setTokenDailyMintLimits(string[] calldata symbols, uint256[] calldata limits) external override onlyAdmin {

217       function upgrade(
218           address newImplementation,
219           bytes32 newImplementationCodeHash,
220           bytes calldata setupParams
221:      ) external override onlyAdmin {

331:      function deployToken(bytes calldata params, bytes32) external onlySelf {

367:      function mintToken(bytes calldata params, bytes32) external onlySelf {

373:      function burnToken(bytes calldata params, bytes32) external onlySelf {

397:      function approveContractCall(bytes calldata params, bytes32 commandId) external onlySelf {

411:      function approveContractCallWithMint(bytes calldata params, bytes32 commandId) external onlySelf {

437:      function transferOperatorship(bytes calldata newOperatorsData, bytes32) external onlySelf {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/AxelarGateway.sol#L204>

```solidity
File: contracts/gas-service/AxelarGasService.sol

120:      function collectFees(address payable receiver, address[] calldata tokens) external onlyOwner {

136       function refund(
137           address payable receiver,
138           address token,
139           uint256 amount
140:      ) external onlyOwner {

```

<https://github.com/code-423n4/2022-07-axelar/blob/9c4c44b94cddbd48b9baae30051a4e13cbe39539/contracts/gas-service/AxelarGasService.sol#L120>

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2022-07-axelar-findings/issues/122#issuecomment-1226666802):**
 > **[G‑01] Using calldata instead of memory for read-only arguments in external functions saves gas**<br>
> 60 for the array of bytes
> 
> **[G‑02] Avoid contract existence checks by using solidity version 0.8.10 or later**<br>
> 100 gas per instance<br>
> 2500
> 
> **[G‑03] internal functions only called once can be inlined to save gas**<br>
> 20 per instance<br>
> 140
> 
> **[G‑04] <array>.length should not be looked up in every loop of a for-loop + [G-05]**<br>
> Giving 300 consistently with rest of submissions
> 
> **[G‑06] keccak256() should only need to be called on a specific string literal once**<br>
> 30 gas per instance<br>
> 120
> 
> Rest is too opinionated for me :P
> 
> Great report as usual, would love to see a couple customized suggestion (packing or similar) and benchmarks, but still really good.
> 
> 3120 gas saved



***

# Disclosures

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.
