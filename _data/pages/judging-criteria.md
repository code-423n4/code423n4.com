---
title: "Judging Criteria"
---

# C4 Judging Criteria

# 1. Submission Review Process

C4 strives to ensure a deliberate and transparent process for reviewing and judging submissions.

At the end of a given contest period, all reports will be reviewed and categorized based on criteria. Pending sponsor review, final reports will be shared publicly. Results will then be shared on the C4 Discord and winners will be announced on the [C4 Twitter](https://twitter.com/code423n4).

> Reports are also judged based on grammar, conciseness, and formatting.

# 2. Duplicate Submissions

Should the same bug be submitted by multiple Wardens, Judges have the discretion to place these bugs into the same bucket, in which case, the award will be shared among those who submitted.

# 3. Scoring

The scoring system has two primary goals:

- Rewarding Wardens for finding unique bugs
- Hardening C4 code contests to sybil attacks
- Encouraging coordination by incentivizing Wardens to form teams.

# 4. High-Level Considerations

## 4.1. Malicious Input Handling

Does reported bug affect the abilities of function parameters to be passed in a safe and predictable manner?

## 4.2. Arithmetic

Does reported bug affect mathematical operations or influence the contract's ability to handle variable values in a predictable and safe manner?

## 4.3. Gas Limitations

Does reported bug affect the use of gas? If so, is gas handled in a suboptimal manner, could this result in unecessary losses?

# 5. Estimating Risk

C4 Judges refer to the standard model as presented in the OWASP approach to risk analysis where:

`Risk = Likelihood * Impact`

The Warden's submission should include:

- Proposed risk classification
- Threat agent involved
- Attack method(s) used
- Vulnerabilities involved
- Speculated impact of a successful exploit

The measurement of risk will be partially based on the rating submitted by the Warden, but is also subject to the judge's best discretion. Should the judge determine a particular bug to be a lower risk than the Warden rated, this judgement will include a thorough case justifying the downgraded measurement.

## 5.1. Risk Categories

Bugs are divided into 3 risk categories:

- Low
- Medium
- High

# 6. Estimating Likelihood

The first set of factors are related to the threat agent involved. The goal here is to estimate the likelihood of a successful attack by this group of threat agents. Use the worst-case threat agent.

## 6.1. Skill Level

How technically skilled is this group of threat agents?

- No technical skills **(1)**
- Some technical skills **(3)**
- Advanced computer user **(5)**
- Network and programming skills **(6)**
- Security penetration skills **(9)**

## 6.2. Motive

How motivated is this group of threat agents to find and exploit this vulnerability?

- Low or no reward **(1)**
- Possible reward **(4)**
- High reward **(9)**

## 6.3. Opportunity

What resources and opportunities are required for this group of threat agents to find and exploit this vulnerability?

- Full access or expensive resources required **(0)**
- Special access or resources required **(4)**
- Some access or resources required **(7)**
- No access or resources required **(9)**

How large is this group of threat agents?

- [Uninformed users](https://medium.com/cybermiles/i-accidentally-killed-it-and-evaporated-300-million-6b975dc1f76b) **(4)**
- Partners **(5)**
- Authenticated users **(6)**
- Anonymous Internet users **(9)**

# 7. Estimating Vulnerability

The next set of factors are related to the vulnerability involved. The goal here is to estimate the likelihood of the particular vulnerability involved being discovered and exploited. Assume the threat agent selected above.

## 7.1. Ease of Discovery

How easy is it for this group of threat agents to discover this vulnerability?

- Practically impossible **(1)**
- Difficult **(3)**
- Easy **(7)**
- Automated tools available **(9)**

## 7.2. Ease of Exploit

How easy is it for this group of threat agents to actually exploit this vulnerability?

- Theoretical **(1)**
- Difficult **(3)**
- Easy **(5)**
- Automated tools available **(9)**

## 7.3. Awareness

How well known is this vulnerability to this group of threat agents?

- Unknown **(1)**
- Hidden **(4)**
- Obvious **(6)**
- Public knowledge **(9)**

# 8. Estimating Impact

The goal is to estimate the magnitude of the impact on the system if the vulnerability were to be exploited.

## 8.1. Loss of Access

How likely is it that a specific requests can be overridden?

- Minimal non-sensitive data disclosed **(2)**
- Minimal critical data disclosed **(6)**
- Extensive non-sensitive data disclosed **(6)**
- Extensive critical data disclosed **(7)**
- Private keys compromised **(9)**

## 8.2. Loss of Funds

Can funds be transfered without the knowledge of the owner?

- This is a critical bug with that warrants the highest rating **(9)**.

## 8.3. Loss of Availability

To what degree can this prevent an application from performing and how vital is it?

- Minimal secondary services interrupted **(1)**
- Minimal primary services interrupted **(5)**
- Extensive secondary services interrupted **(5)**
- Extensive primary services interrupted **(7)**
- All services completely lost **(9)**

# 9. Credits

The C4 judging criteria references the [OWASP Risk Rating Methodology](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology) to score the severity and relevence of submitted reports from C4 Wardens.
