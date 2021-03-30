---
title: "Overview"
---

# Code 423n4 :wolf:	
![banner](images/c4-logo.png)
# :trophy: Code Contests
C4 code contests leverage a community of security researchers and smart contract experts to provide cost effective and rigorous code reviews in a gamified manner. We aim to create a way for both beginners and exceptional white hats to showcase their skills while making DeFi platforms more secure.

Stay up to date with new contests by [following C4 on Twitter](https://twitter.com/code423n4).

There are three actors in Code 423n4:

**WARDENS**  
Wardens hunt for bugs in the smart contracts of decentralized protocols.  
  
To participate in a code contest as a C4 Warden, please check the active contests in the [contests directory](contests/README.md)and join the [C4 Discord](https://discord.gg/EY5dvm3evD) to register or join a team. 
  
**SPONSORS**  
Sponsors create bounty pools to attract wardens to their contests.  
  
To sponsor a code contest, please refer to the [sponsor document](SPONSOR_INFO.md) for more information.
  
**JUDGES**  
Judges are responsible for allocating bounty pools to wardens based on their performance.  

To participate in C4 as a Judge, please contact a C4 Organizer in the Discord.
  
### Traditional Audits Are Constrained By:
*Cost*  
Auditing firms must be compensated for maintaining their brand, effectively training or recruiting qualified smart contract security experts, and finding clients in need of audits. This operational overhead makes audits expensive and the grueling pace can incentivize auditing firms to cut corners.

*Time*  
Audits must be scheduled sequentially, so each individual engineer working at the firm has not too much nor too little, work. This constraint creates scheduling inflexibility that present obstacles and inefficiencies for teams racing to go to market.

*Depth*  
Audit teams (or individuals) must be somewhat aware of all the different types of vulnerabilities a smart contract can present. As the complexity in the space grows, the attack surface area grows with it, and the knowledge that any one person can have for any one type of vulnerability becomes diluted. In addition, firms are driven to show value by finding all low-hanging fruit, which makes creative exploits more likely to be missed.

> C4 presents a competitive and open code review process where all participants eat what they kill as they compete to become the champion of the arena.

### Code 423n4 Security Reviews Offer:
*Cost Flexibility*  
Sponsor projects can determine the size of their bounty pot. The larger the pot, the more attention a contest will attract.

*Time Flexibility*  
C4 can accommodate multiple concurrent audits, and sponsors are free to start and end their Review Period whenever they choose. The players in the arena are free to participate in multiple overlapping Reviews.

*Specialization*  
Since the goal of each participant is to find any vulnerabilities rather than all of them, C4 code reviews are ideal for highly specialized security researchers interested in demonstrating their skill and creativity. The more rare or novel the identified bug, the higher the reward for finding it.

*Opportunity*  
**Experienced researchers** can showcase their talent in C4 by focusing on their area of expertise and identifying unique exploits for higher rewards. Because everyone who finds a vulnerabilities is compensated from the pool, C4 also enables **beginners** to get paid while they learn and build a reputation within the community.

## Scoring
The scoring system has two primary goals: rewarding contestants for finding unique bugs and making the contest resistant to [sybil attacks](https://en.wikipedia.org/wiki/Sybil_attack). A secondary goal of the scoring system is to incentivize contestants to form squads and encourage coordination.

Bugs are divided into three risk categories:   
- Low
- Medium
- High

For more details regarding scoring, please refer to the [judging criteria](JUDGING_CRITERIA.md) document.

## Rewards  
Wardens are awarded shares for bugs discovered and those shares give the owner a pro rata piece of the pot.  
  
**Low Risk Bounty Shares**    
`1 * (0.9 ^ discovery count) / discovery count`  
  
**Medium Risk Bounty Shares**    
`3 * (0.9 ^ discovery count) / discovery count`  
  
**High Risk Bounty Shares**    
`10 * (0.9 ^ discovery count) / discovery count`
  
**At the end of the contest, each bounty share is redeemable for:**     
`Bounty Pot / number of Bounty Shares.`

**Duplicate Submissions**    
Should the same bug be submitted by multiple Wardens, Judges have the discretion to place these bugs into the same bucket, in which case, the award will be shared among those who submitted.

