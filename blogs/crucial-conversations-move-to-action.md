# Crucial Conversations: How to Move to Action

**Published:** March 23, 2026

The meeting went well. Everyone shared their perspective. Concerns were raised and addressed. The conversation was healthy, respectful, and productive. Three weeks later, nothing has changed. No one did anything. This is one of the most common failure modes in engineering organizations, and Chapter 11 of Crucial Conversations explains exactly why it happens and how to prevent it.

## Why Good Conversations Fail to Produce Results

The authors identify two moments in any crucial conversation that carry the highest risk. The first is the beginning, where safety must be established. The second is the end, where decisions and commitments must be made explicit. Most people focus entirely on the first risk and completely neglect the second.

The problem is seductive: a good conversation feels like progress. When a design debate ends with mutual understanding, it is easy to walk away satisfied. But understanding is not agreement, and agreement is not action. Without clear decisions, explicit owners, and concrete timelines, even the best dialogue produces nothing.

In engineering, this shows up constantly. The architecture discussion where "we should probably move to event-driven" never gets a DRI or a timeline. The retro where the team identifies three process improvements but assigns none of them. The incident review that produces a thorough timeline but no follow-up action items. The conversation was real; the outcomes were not.

## Decide How to Decide

Before making any decision, the group needs to answer a meta-question: how will this decision be made? Skipping this step is the source of enormous frustration in engineering teams.

Consider a common scenario. A team discusses whether to adopt a new database technology. After an hour of healthy debate, the tech lead says "Okay, let's go with Postgres." Half the team thinks a decision was just made. The other half thinks they were brainstorming and expects a follow-up evaluation. One person thinks they have veto power. Another thinks this needs VP approval.

None of these people are wrong -- they simply never agreed on how the decision would be made. The result is confusion, resentment, and relitigating the same discussion in the next meeting.

The fix is simple but requires discipline: before discussing the substance of any decision, explicitly state the decision-making method. "I want to get everyone's input, but ultimately I'll make the call" is very different from "We need full consensus before we proceed." Both are valid. The problem is when one is happening but people expect the other.

## Four Decision-Making Methods

The authors describe four methods, each appropriate for different situations.

### Command

One person decides, and no broader input is sought. This is appropriate when the decision has been delegated to an individual, when speed matters more than buy-in, or when the stakes are low enough that group input would be wasteful.

In engineering, command decisions include things like choosing a variable naming convention for your own code, deciding how to implement an assigned ticket, or an incident commander making a call during an active outage. The incident commander case is instructive -- during an incident, consensus-seeking can be actively harmful. Someone needs to decide, and the team needs to execute.

### Consult

One person decides after gathering input from others. This is the most common and often the most appropriate method for engineering decisions. The decision-maker genuinely wants perspectives but retains the final call.

A staff engineer designing a new service might consult with the platform team about infrastructure constraints, the product team about requirements, and the security team about compliance needs. They gather all of this input, weigh it, and make the call. The key is that everyone knows their role: they are advisors, not deciders.

The failure mode of Consult is when people think they are being consulted but the decision has already been made. Fake consultation destroys trust faster than no consultation at all. If you have already decided, say so. Do not perform a consultation ritual as a fig leaf.

### Vote

The group votes, and the majority wins. This works well when speed is important, when the group has relatively equal expertise, and when full consensus is unlikely or unnecessary.

Engineering teams use voting (formally or informally) for things like choosing between two roughly equivalent technical approaches, selecting sprint priorities, or deciding on team conventions. "Raise your hand if you prefer option A" is a perfectly valid decision-making method for many low-to-medium stakes decisions.

The failure mode of voting is using it for decisions that require deep expertise or that will disproportionately affect a minority of the group. Voting on a database migration when only two people on the team understand the operational implications is not democracy -- it is abdication.

### Consensus

The group discusses until everyone genuinely agrees. This is the most thorough method and the most time-consuming. It is appropriate for high-stakes, hard-to-reverse decisions where full buy-in is critical for execution.

In engineering, consensus is appropriate for things like major architectural shifts, team working agreements, or changes to on-call rotations. These are decisions where a dissenting minority can undermine execution (consciously or not), so genuine agreement matters.

The failure mode of consensus is using it for everything. Teams that require consensus on all decisions grind to a halt. Not every choice deserves a round-table discussion until everyone is satisfied. Reserve consensus for decisions that truly warrant it.

## Choosing the Right Method

A few guidelines for choosing.

**Who cares?** Identify who genuinely has a stake in the outcome. Do not involve people who do not care -- it wastes their time and dilutes the discussion.

**Who knows?** Identify who has the relevant expertise. Decisions should be informed by the people closest to the problem.

**Who must agree?** Some decisions require buy-in from specific stakeholders to succeed. An API change that affects three downstream teams cannot be made by command, no matter how efficient that would be.

**How many people must be involved?** Involve the fewest people necessary to make a quality decision. Larger groups take longer and often produce worse outcomes due to diffusion of responsibility.

When authority is unclear -- when no one knows who gets to decide -- default to discussing and clarifying the decision rights before proceeding. "Who makes this call?" is a question worth five minutes of discussion to avoid five weeks of confusion.

## The WWWF Framework

Once a decision is made, the conversation is not over. The authors introduce WWWF: Who does What by When, with Follow-up.

**Who.** Assign a single owner. "The team will handle it" means no one will handle it. Every action item needs a name attached. Not a team name -- a person's name.

**What.** Be specific about the deliverable. "Look into the caching issue" is not an action item. "Investigate whether Redis cluster mode resolves the cache stampede problem and write up findings in a doc" is an action item.

**When.** Attach a deadline. Without a deadline, "soon" becomes "eventually" becomes "never." The deadline does not need to be aggressive -- it just needs to exist. "By end of next sprint" or "before the next design review on Thursday" are both fine.

**Follow-up.** Decide how and when progress will be checked. This is the piece most teams skip, and it is the piece that makes the other three work. Without follow-up, there is no accountability, and without accountability, commitments decay. Follow-up can be as simple as "I'll check in on this at our Monday standup" or "Add this to the retro agenda."

## Engineering Applications

**Sprint planning.** At the end of sprint planning, every committed story should have clear WWWF. Who is the owner? What exactly is the acceptance criteria? When is it expected to be done? How will progress be tracked? Many teams do the first two and skip the last two.

**Architecture decisions.** Before an architecture discussion, state the decision method. "I'm going to present the proposal, gather feedback from the group, and then make a final call by Friday" (Consult). Or "We need everyone on board before we proceed with this migration" (Consensus). Then after the decision, assign concrete next steps with WWWF.

**Incident action items.** Postmortems frequently produce a list of action items that slowly rot in a document. Every action item should have a named owner, a specific deliverable, a deadline, and a follow-up mechanism. "Improve monitoring" is not an action item. "Alice will add latency percentile alerts for the payments service by March 30, reviewed in the next incident review meeting" is.

**Cross-team alignment.** When multiple teams need to coordinate, decision rights are often ambiguous. Before diving into the substance, spend five minutes clarifying: whose decision is this? Are we consulting or seeking consensus? Who has veto power? This upfront investment prevents the all-too-common pattern of reaching apparent agreement in a meeting only to have it unravel over Slack afterward.

**1:1s with managers.** When your manager gives you feedback or coaching, end the conversation with explicit WWWF. "So I'm going to focus on delegating more effectively. Specifically, I'll delegate the monitoring dashboard project to Jamie this week, and we'll check in on how it went in our next 1:1." This turns vague coaching into concrete action.

## Conclusion

Dialogue without decision is just a pleasant conversation. The most important move in any crucial conversation is often the last one: converting shared understanding into clear commitments. Decide how to decide before you decide. Then close with Who does What by When with Follow-up. These are not bureaucratic formalities -- they are the bridge between talking about change and actually making it happen. In engineering, where the gap between "we should" and "we did" is measured in sprints and quarters, this bridge is everything.
