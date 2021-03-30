---
title: "Sponsoring a Contest"
---

# Sponsoring a contest
Any project can submit a request to sponsor a C4 Contest.

### Traditional Audits Are Constrained By:
**Cost**  
Auditing firms must be compensated for maintaining their brand, effectively training or recruiting qualified smart contract security experts, and finding clients in need of audits. This operational overhead makes audits expensive and the grueling pace can incentivize auditing firms to cut corners.

**Time**  
Audits must be scheduled sequentially, so each individual engineer working at the firm has not too much nor too little, work. This constraint creates scheduling inflexibility that present obstacles and inefficiencies for teams racing to go to market.

**Depth**  
Audit teams (or individuals) must be somewhat aware of all the different types of vulnerabilities a smart contract can present. As the complexity in the space grows, the attack surface area grows with it, and the knowledge that any one person can have for any one type of vulnerability becomes diluted. In addition, firms are driven to show value by finding all low-hanging fruit, which makes creative exploits more likely to be missed.

> C4 presents a competitive and open code review process where all participants eat what they kill as they compete to become the champion of the arena.

### Code 423n4 Security Reviews Offer:
**Cost Flexibility**  
Sponsor projects can determine the size of their bounty pot. The larger the pot, the more attention a contest will attract.

**Time Flexibility**  
C4 can accommodate multiple concurrent audits, and sponsors are free to start and end their Review Period whenever they choose. The players in the arena are free to participate in multiple overlapping Reviews.

**Specialization**  
Since the goal of each participant is to find any vulnerabilities rather than all of them, C4 code reviews are ideal for highly specialized security researchers interested in demonstrating their skill and creativity. The more rare or novel the identified bug, the higher the reward for finding it.

**Opportunity**  
*Experienced researchers* can showcase their talent in C4 by focusing on their area of expertise and identifying unique exploits for higher rewards. Because everyone who finds a vulnerabilities is compensated from the pool, C4 also enables *beginners* to get paid while they learn and build a reputation within the community.

## 🤝 Step by step process
- Fork [this repository](https://github.com/code-423n4/code-contests).
- Create a new folder in the [contests](https://github.com/code-423n4/code-contests/contests/README.md) directory.
- Make sure that the name of this folder matches the name of your project.
- Add a `README.md` that describes how your code is supposed to work with links to any relevent documentation and any other criteria/details that the C4 Wardens should keep in mind when reviewing. 
- Within your project folder, create yet another folder and call it `contracts`.
- Add all of the code that you want reviewed to the `contracts` folder that you just created.
- Make sure your code is thoroughly commented using the [NatSpec format](https://docs.soliditylang.org/en/v0.5.10/natspec-format.html#natspec-format).
- Submit a PR that provides any additional information for C4 Organizers and Judges.
- If you haven't already, join the [C4 Discord](https://discord.gg/YgBwyreF9B) server and share the PR in the `#i-want-to-be-a-sponsor` channel.
- After your PR has been reviewed, a C4 Organizer will contact you to iron out the details, such as the start time and stop time.

Check out our [first contest's directory](https://github.com/code-423n4/code-contests/tree/main/contests/01-slingshot) for reference.

## ⛽️ Gas optimizations

Most contests have a main pool for vulnerabilities and an optional secondary pool for gas optimizations. 10% of the main pool is a good target, but you can make a judgment about what's best for your project's needs.

## 💰 But how much does it cost?
C4 Organizers will discuss the cost with you and make recommendations based on the size and complexity of the portion of your codebase you'd like to get focused on in the contest.

To fund the judging, reporting, and organizing process, we charge a 20% org fee as part of each contest.

While there are no limitations on the prize pool, the size of the pool could dictate the degree of attention your project will receive from the Wardens.