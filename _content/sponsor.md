---
title: "Sponsoring a Contest"
---

# Sponsoring a contest

Any project can submit a request to sponsor a C4 Contest.

### Traditional Audits Are Constrained By:
**Cost**  
Auditing firms must be compensated for maintaining their brand, effectively training or recruiting qualified smart contract security experts, and finding clients in need of audits. This operational overhead makes audits expensive and the grueling pace can incentivize auditing firms to cut corners.

**Time**  
Typical audit constraints create scheduling inflexibility that present obstacles and inefficiencies for teams racing to go to market.

**Depth**  
Audit teams (or individuals) must be somewhat aware of all the different types of vulnerabilities a smart contract can present. As the complexity in the space grows, the attack surface area grows with it, and the knowledge that any one person can have for any one type of vulnerability becomes diluted. In addition, firms are driven to show value by finding all low-hanging fruit, which makes creative exploits more likely to be missed.

> C4 presents a competitive and open code review process where all participants eat what they kill as they compete to become the champion of the arena.

### Code 423n4 Security Reviews Offer:
**Cost Flexibility**  
Sponsor projects can determine the size of their bounty pot. The larger the pot, the more attention a contest will attract.

**Time Flexibility**  
C4 will soon be able to accommodate multiple concurrent audits, allowing sponsors to start their contest quickly. The players in the arena are free to participate in multiple overlapping Reviews.

**Specialization**  
Since the goal of each participant is to find any vulnerabilities rather than all of them, C4 code reviews are ideal for highly specialized security researchers interested in demonstrating their skill and creativity. The more rare or novel the identified bug, the higher the reward for finding it.

**Opportunity**  
*Experienced researchers* can showcase their talent in C4 by focusing on their area of expertise and identifying unique exploits for higher rewards. Because everyone who finds a vulnerabilities is compensated from the pool, C4 also enables *beginners* to get paid while they learn and build a reputation within the community.

<h2 id="how-it-works">How does this work?</h2>

**How we collaborate with sponsors**  
If you are interested in sponsoring a contest, we will create a private repo for you to share your current smart contracts and answer a few questions about the scope you'd like wardens to focus on. One of our team members will assess your contracts for size and complexity and suggest a minimum pot size.

**Determining pot size**  
As a sponsor, you are responsible for setting the amount of your contest pool (above our suggested minimum), knowing that a larger pot size will attract more warden talent and more attention. Pots thus far have tended to run between $40k and $100k USDC. We are seeing greater warden attention in $100k+ contests.

**Gas optimization pool**  
Many contests create a separate pool for finding gas optimizations. Previous sponsors have used a fifth or tenth of the total pot for this reward. Some projects do not wish to create a separate incentive for gas optimizations. Code 423n4 lets each project decide whether to create this pool.

**Org fee**  
There is a 20% fee on top of the determined contest pool, which goes to the C4 org to cover the costs of judging, reporting, and organizing contests.

**Sponsor tokens**  
Sponsors are free to 'sweeten the pot' with their own token _on top of_ the core contest pool (stablecoin / Eth). The org takes a 40% fee on sponsor tokens.

**Contest scheduling**  
Contests start Wednesday 00:00:00 UTC and end Tuesday 23:59 UTC. We schedule contests after reviewing the codebase, providing a suggested minimum, and receiving contest funding. Due to high demand, we cannot make any scheduling guarantees until these steps have been completed, and once a contest has been scheduled, we are unable to move it on our calendar.

## 🤝 Step by step pre-contest process

- If you haven't already, join the [C4 Discord](https://discord.gg/YgBwyreF9B) server and let us know you're interested in sponsoring a contest in the `#i-want-to-be-a-sponsor` channel.
- We'll set up a private repo for you to submit your contracts to be reviewed for scope and a recommended pot size.
- After your code has been reviewed, a C4 Organizer will contact you to iron out the details.
- Once we've received a deposit, we will finalize scheduling and begin to promote the contest to wardens.

## During a contest

- You will be able to see issues as they are submitted to the contest's private repo, but note that >90% of contest findings tend to get submitted in the last day, so don't be concerned if findings seem slow to come in.
- We ask for a member or members of your engineering team to be available in the C4 discord in order to answer wardens' questions via DM.
- Please avoid discussing any issues submitted by wardens in an open channel, as this could give hints to other wardens.

## After a contest

Your work will play a role in developing a public report of the contest audit.

- Sponsors review findings, identify duplicates, and provide comments as you confirm, acknowledge, or dispute wardens' findings (use labels for this).
- As your team works to mitigate issues, most sponsors will create a PR for each issue addressed in your codebase and link to it in the C4 finding issue and label the finding as resolved.
