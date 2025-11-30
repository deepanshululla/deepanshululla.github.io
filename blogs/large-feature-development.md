# How to do large feature development?

**Published:** 2022-12-24

When I was a junior engineer I was given small bugs to fix and small features to work on. However the way we develop larger features is different from the way smaller bugs are fixed or features are developed.

I have worked at couple of big names at the current point in my career and have delivered several important and big features. Over the years I have developed a system which I follow to ensure the safety and success of a big feature I worked on.

I have created a step by step process that has worked pretty much anywhere I have worked. There are books and articles written on each of these steps but I want to document at a high level what the system entails.

**here are the steps in the system at a high level:**

- Understand the problem.

- understand the system.

- Create acceptance tests for the feature.

- Plan your implementation.

- Repeat the Test/Fix/Refactor cycle

- Get a code review

- Commit your changes and QA your work

- Create monitoring dashboards

- Create a release plan and inform stakeholders.

- Release but carefully.

## Step 1: Understanding the problem

- **Meet stakeholders/users of the feature.** Before the meeting, **become familiar with the documentation** that you have been given.

- if you have been given a **UI mockup, familiarize yourself** with that possibly even clarifying things with the designer and bringing it to the meeting.

- if no UI mockup, set up two meetings, one to discuss the business problem and the other to talk through UI.

- after your meeting with stakeholders, **document the changes required and send an email to the stakeholders**, **confirming if it is correct.**

## Step 2: Understand the system

The next step is to develop a system view of the application you will need to modify.

Depending on the size of the system you are working with it **might not be possible to develop a deep system view** of the entire application. You should **get the broadest view** you can in the context of your change.

At this stage, we look at the code/documentation and find out the following things:

- What d**omain objects** will this feature need to interact with?

- What **business rules** exist around the objects?

- What **structures** are in place to manage those objects.

- What **new object**s will you need to create.

- What is the **test coverage** like? Will you need to add test coverage anywhere before making changes?

- Are there any **offline tasks** related to these objects

- Is there **special reporting or auditing** on the changes related to these objects and should your new objects be a part of this.

- Are there **non-functional requirements** to consider such as performance or security.

I**f you are not familiar with the system, you may need to document some parts of this.** This doesn't need to be formal but drawing is a visual aid to understanding the flow of changes. This is not and should not be the final product but an intermediary representation to help you system you are modifying. You can keep it private and disposable.

## Step 3: Create Acceptance level tests

An acceptance test simulates a user using the feature as close as possible. they are not unit tests.

Think of your acceptance tests as an executable to-do list.

If you can, try adding it to the automated suite. if not then I would recommend adding manual test scripts.

## Step 4: Plan your implementation

Given this is much more complex than a bug fix it means there are many ways to go about it and the best way may not become apparent from coding.

At this point, we need to create an informal plan of the steps we need to take. This might be in form of to-do lists, comments in code or visual before/after diagrams.

A formal tech spec may be required depending on the complexity of feature and if there are partnering teams who may be affected by the implementation.

The best approach to do it is to discuss it with another developer or get it reviewed by other engineers in the team.

## Step 5: Implementation or test-fix-refactor cycle

This phase is where you write the actual code to implement the changes to business logic. Calling it a test-fix-refactor cycle is appropriate here because you may be stuck in this loop for a while until you feel the changes work the way you intend them to.
If not write some tests, then fix and refactor and keep doing it until you have reached a good enough state based on the timelines.

## Step 6: Code Review

Code review is one of the most important steps before we commit our changes. This gives you some extra eyes on the work we have done so far and helps figure our some early potential integration issues and some design improvements.

## Step 7: Commit Code Changes and QA your changes.

Hopefully the organization has a nice way for you to safely commit your changes without it getting released to production.
This also gives time for QA to test your changes before they are ready for releases.
This step is really important and you can run your acceptance level tests in this step to ensure the implementation works as desired.

## Step 8: Create monitoring dashboards and alerts

The next step is to create monitoring dashboards to assess the impact of changes on production and to make sure we have some reasonable monitoring for ourselves.

This step ensures we have some logs and some monitoring so it is easier to figure out and debug issues in production.

Remember no matter how much confidence we have in our tests, production could behave differently depending on the context of external factors in our environment.

## Step 9: Create a release plan and inform stakeholders of the change.

This step ensures creating a central piece of document that notifies everyone about the potential release and the timelines for such. This is especially useful if you have downstream dependencies and the impacted teams could monitor their system on their end to inform any impact on their particular systems.

## Step 10: Release but carefully

This step is all about minimizing risk and making sure what we release is correct and gradual. It is vital to see the impact of our release over time and see how changes are impacting our users.

There have been couple of bugs especially memory leak related bugs and data processing related bugs where the impact of the bugs were only discovered after few hours and even few days.

The best strategy is to minimize the blast radius here.

Hope this was helpful and I know I prob. didn't cover everything but if you would like to share your thoughts and experiences please don't hesitate to share your comments