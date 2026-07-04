# AGENTS.md

>When there is a conflict between user convenience and long-term architecture, explain the trade-offs before implementing the requested solution. The user may intentionally choose the simpler option, but architectural implications should always be made explicit.

# StrideAI Engineering Constitution

This document is the single source of truth for every AI coding assistant and engineer working on StrideAI.

Every architectural decision, implementation, and code contribution must follow the principles defined in this document.

When there is a conflict between generated code and this document, this document always takes precedence.

---

# 1. Product Vision

## What is StrideAI?

StrideAI is an AI Agent Platform for Personal Productivity.

It is not a chatbot.

It is not an OpenAI wrapper.

It is not a Telegram bot.

It is not a voice assistant.

Instead, StrideAI provides the infrastructure required to build intelligent productivity agents capable of interacting with users across multiple communication channels while sharing the same business logic and reasoning engine.

Examples of communication channels include:

- Telegram
- Web
- Voice Calls
- WhatsApp
- Mobile Applications
- Future integrations

Communication channels are delivery mechanisms only.

They are never responsible for business logic.

---

## Long-Term Vision

The long-term goal of StrideAI is to become a productivity operating system powered by specialized AI agents.

Instead of having a single assistant that tries to do everything, StrideAI consists of multiple purpose-driven agents.

Examples include:

- Accountability Agent
- Study Coach
- Fitness Coach
- Career Coach
- Habit Coach
- Interview Coach

Every agent shares the same platform infrastructure while implementing different business objectives.

---

## Core Philosophy

Humans communicate using natural language.

Software operates using structured data.

The responsibility of StrideAI is to bridge those two worlds.

Users communicate naturally.

The platform understands intent.

Business services execute actions.

---

## Product Goal

StrideAI exists to help users consistently achieve long-term goals through intelligent conversations, contextual reasoning, and proactive guidance.

The platform should feel like a personal productivity partner rather than a traditional software application.

---

## What StrideAI Is Not

The platform is intentionally not designed as:

- A generic chatbot
- A ChatGPT clone
- A prompt playground
- A collection of AI utilities
- A simple REST API around an LLM

Every AI capability must contribute toward helping users achieve measurable productivity outcomes.

---

## Product Principles

Every feature developed within StrideAI must satisfy the following principles:

1. Solve a real productivity problem.

2. Be reusable across multiple communication channels.

3. Keep business logic independent of AI providers.

4. Keep communication channels independent of business logic.

5. Prioritize maintainability over clever abstractions.

6. Design for long-term scalability without premature optimization.

7. Build production-quality software from the beginning while introducing business features incrementally.

---

This philosophy should influence every architectural and implementation decision made within the project.

# 2. Engineering Philosophy

Engineering philosophy is more important than individual technologies.

Frameworks, libraries, and AI providers may change over time, but the engineering principles defined here should remain stable throughout the lifetime of StrideAI.

Every implementation should optimize for simplicity, maintainability, readability, and long-term scalability.

---

## Build Products, Not Features

Every piece of code should contribute toward building the overall platform instead of solving only the immediate problem.

Always ask:

- Does this solve a platform problem?
- Can this be reused?
- Will this still make sense one year from now?

Avoid building isolated solutions for individual features.

---

## Build Platforms, Not Integrations

StrideAI is not built around Telegram.

StrideAI is not built around OpenAI.

StrideAI is not built around Voice.

These are integrations.

The platform owns the business logic.

External services are replaceable.

For example:

Instead of:

Telegram
→ Business Logic

We build:

Telegram
→ Channel Adapter
→ Platform

Likewise:

OpenAI
→ AI Provider
→ Platform

Every external dependency should remain replaceable.

---

## Business Logic Owns the System

Business rules define the product.

Everything else exists to support those rules.

The following layers should never contain business logic:

- Views
- Serializers
- AI Providers
- Communication Channels
- External SDK Wrappers

Business rules belong inside dedicated business services.

---

## Simplicity Over Cleverness

The simplest solution that correctly solves the problem is preferred.

Do not introduce abstractions for hypothetical future requirements.

Avoid solving problems that do not yet exist.

Complexity should only be introduced when justified by real product requirements.

---

## YAGNI (You Aren't Gonna Need It)

Never implement functionality solely because it might become useful later.

Examples:

❌ Generic Repository Layer

❌ Generic BaseService

❌ Plugin Architecture

❌ Event Bus

❌ Workflow Engine

❌ Microservices

until there is a proven business need.

Premature abstraction increases maintenance cost.

---

## Explicit Is Better Than Implicit

Code should be easy to follow.

A new engineer should understand the execution flow without reading hidden framework magic.

Avoid:

- Signals
- Hidden callbacks
- Implicit side effects
- Runtime magic

Prefer explicit service calls.

---

## Composition Over Inheritance

Prefer composing small focused components instead of building deep inheritance hierarchies.

Good:

GoalService
uses
GoalSelector

Bad:

BaseService
↓

AbstractGoalService
↓

GoalService

Inheritance should be rare.

---

## One Responsibility Per Component

Every module should have one clear responsibility.

Examples:

Goals

Responsible for user goals.

Conversations

Responsible for communication history.

AI

Responsible for reasoning.

Agent Runtime

Responsible for orchestration.

CheckIns

Responsible for recording progress.

Responsibilities should never overlap.

---

## Keep Layers Independent

Every architectural layer should only know about the layer directly below it.

Example:

Views

↓

Services

↓

Models

Views should never bypass services.

Services should never depend on Views.

Communication channels should never contain business logic.

AI providers should never know about Django models.

---

## Design for Replaceability

External technologies will change.

Our architecture should not.

Examples:

OpenAI

↓

Anthropic

↓

Gemini

should require changing only the provider implementation.

Likewise,

Telegram

↓

WhatsApp

↓

Voice

↓

Web

should require changing only the communication adapter.

Business logic should remain unchanged.

---

## Optimize for Readability

Code is read significantly more often than it is written.

Prioritize:

- Meaningful names
- Small functions
- Clear responsibilities
- Predictable project structure

Avoid writing code that is technically clever but difficult to understand.

---

## Production First

StrideAI is not treated as a prototype.

Every implementation should be production quality.

However, production quality does not mean unnecessary complexity.

Production quality means:

- Clear architecture
- Proper separation of concerns
- Testability
- Maintainability
- Simplicity

---

## Consistency Over Perfection

Consistency is more valuable than isolated improvements.

When multiple valid solutions exist, prefer the solution that is already used throughout the project.

A predictable codebase is easier to maintain than a collection of individually optimized implementations.

Every new module should feel like a natural extension of the existing architecture.

# 3. Architecture Overview

The architecture of StrideAI is intentionally layered.

Each layer has a single responsibility.

Each layer communicates only with adjacent layers.

No layer should leak implementation details into another layer.

This architecture allows the platform to support multiple communication channels, multiple AI providers, and multiple productivity agents without changing core business logic.

---

# High-Level Architecture

```
                        User
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    Telegram            Voice            Web App
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                  Channel Adapters
                          │
                          ▼
                  Conversation Layer
                          │
                          ▼
                   Agent Runtime
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
    AI Reasoning    Business Services   Memory
          │
          ▼
     AI Providers
(OpenAI / Anthropic / Gemini)
```

The communication channel is never aware of business logic.

The AI provider is never aware of the communication channel.

Business services are independent from both.

---

# Architectural Layers

StrideAI is divided into five major layers.

## Layer 1 — Communication Layer

Purpose:

Receive messages from external platforms.

Examples:

- Telegram
- WhatsApp
- Voice Calls
- Mobile App
- Web Chat

Responsibilities:

- Authenticate requests
- Receive user messages
- Deliver AI responses
- Convert external payloads into Conversations

Must never:

- Execute business logic
- Talk directly to AI providers
- Update database state outside conversation creation

Think of this layer as an adapter.

Its responsibility is translation, not decision making.

---

## Layer 2 — Conversation Layer

Purpose:

Maintain a universal representation of every interaction.

Every communication channel eventually becomes:

Conversation

↓

Messages

Regardless of where a message originated, the platform always processes Conversations.

Examples:

Telegram Message

↓

Conversation Message

Voice Transcript

↓

Conversation Message

WhatsApp Message

↓

Conversation Message

The rest of the platform never needs to know the original communication channel.

---

## Layer 3 — Agent Runtime

The Agent Runtime is the heart of StrideAI.

It is responsible for orchestrating the entire user interaction.

It answers questions such as:

- What is the current objective?
- What information do we already have?
- What information is missing?
- Should another question be asked?
- Should a business action be executed?
- Should the conversation end?

The Agent Runtime does not perform reasoning itself.

Instead, it coordinates the platform.

Responsibilities include:

- Conversation orchestration
- State management
- Workflow progression
- Business service coordination
- AI invocation
- Response generation

Every productivity agent runs on top of this runtime.

---

## Layer 4 — AI Reasoning

The AI layer performs reasoning.

It does not orchestrate workflows.

It does not execute business actions.

It does not update the database.

Instead, it answers questions.

Examples:

"What does the user mean?"

"Extract structured information."

"Summarize the conversation."

"Generate a natural language response."

The AI layer transforms:

Natural Language

↓

Structured Understanding

Business services determine what to do with that understanding.

---

## Layer 5 — Business Services

Business services implement product functionality.

Examples include:

- Goals
- Check-ins
- Notifications
- Analytics
- Future productivity features

Business services never communicate directly with AI providers.

Business services communicate only with the Agent Runtime.

---

# Why Conversations Come Before AI

A conversation is the universal communication model.

Regardless of whether a user interacts through:

- Telegram
- Voice
- WhatsApp
- Web

the platform stores interactions identically.

This decision allows every future communication channel to reuse the same AI reasoning engine and business logic.

Without Conversations, every communication channel would require a separate implementation.

---

# Why Agent Runtime Is The Center

Many AI applications are built like this:

User

↓

LLM

↓

Response

This architecture does not scale.

StrideAI instead follows:

User

↓

Conversation

↓

Agent Runtime

↓

AI Reasoning

↓

Business Services

↓

Response

The Agent Runtime owns the workflow.

The AI owns reasoning.

Business services own actions.

Each component has a clearly defined responsibility.

---

# Why AI Is Not The Platform

The AI provider is an implementation detail.

OpenAI may be replaced.

Anthropic may be replaced.

Gemini may be replaced.

The platform architecture must remain unchanged.

AI is treated as an infrastructure capability rather than the core product.

The product is the Agent Platform.

---

# Future Scalability

This architecture enables future expansion without architectural changes.

Examples include:

New Communication Channels

- Telegram
- WhatsApp
- Voice
- Email
- Slack
- Mobile

New AI Providers

- OpenAI
- Anthropic
- Gemini
- Azure OpenAI
- Local Models

New Productivity Agents

- Accountability Agent
- Study Coach
- Fitness Coach
- Career Coach
- Interview Coach
- Habit Coach

Each new capability should integrate with existing platform layers rather than introducing parallel implementations.

---

# Architectural Principle

The platform is intentionally designed so that:

Communication channels are replaceable.

AI providers are replaceable.

Business modules are reusable.

The Agent Runtime remains stable.

Every future feature should strengthen this architecture rather than bypass it.


# 4. Core Architectural Principles

The following principles are non-negotiable.

Every engineer and every AI coding assistant must follow them.

When multiple implementation approaches are possible, choose the one that best aligns with these principles.

If generated code violates these principles, it should be considered incorrect regardless of whether it functions.

---

# Architecture Before Features

StrideAI is built as a platform.

Every new feature must strengthen the platform rather than introduce isolated implementations.

Do not optimize for the current feature.

Optimize for long-term maintainability.

---

# Separation of Concerns

Every component should have exactly one responsibility.

Examples:

Goals

Responsible only for user goals.

Conversations

Responsible only for communication history.

Agent Runtime

Responsible only for orchestration.

AI Layer

Responsible only for reasoning.

Business Services

Responsible only for business actions.

Responsibilities should never overlap.

---

# Communication Channels Are Adapters

Communication channels are external interfaces.

Examples include:

- Telegram
- Voice
- WhatsApp
- Web
- Mobile

Channels only:

- receive input
- send output
- authenticate requests
- translate external payloads

Channels never:

- implement business logic
- call AI providers directly
- update business entities

The platform owns business logic.

---

# Conversations Are The Universal Language

Every interaction inside StrideAI becomes a Conversation.

Every communication channel must convert its data into Conversations before entering the platform.

The remainder of the system should never know whether a message originated from Telegram, Voice, WhatsApp or any other platform.

---

# Agent Runtime Owns Orchestration

The Agent Runtime is responsible for coordinating workflows.

It decides:

- current objective
- current state
- missing information
- next action
- completion criteria

The Agent Runtime is never responsible for reasoning.

It delegates reasoning to the AI layer.

---

# AI Performs Reasoning Only

The AI layer exists to understand information.

Examples:

- intent detection
- structured extraction
- summarization
- response generation

The AI layer never:

- updates the database
- creates business entities
- sends notifications
- executes workflows
- manages conversations

AI produces understanding.

Business services perform actions.

---

# Business Services Own Business Logic

Business rules belong exclusively inside services.

Examples:

GoalService

CheckInService

NotificationService

Services may:

- validate business rules
- coordinate models
- execute transactions

Services must never:

- contain HTTP concerns
- contain serialization logic
- contain AI provider logic

---

# Models Represent Data

Models describe the domain.

Models should remain lightweight.

Models should not contain:

- orchestration
- API calls
- AI logic
- complex workflows

Models are not service objects.

---

# Views Remain Thin

Views are entry points.

Responsibilities:

- authenticate requests
- validate permissions
- call services
- return responses

Views should not:

- implement business rules
- perform AI reasoning
- query complex business logic
- contain workflow logic

If a View becomes difficult to read, move logic into a service.

---

# Selectors Own Read Logic

Complex read operations belong inside selectors.

Selectors centralize query logic.

Benefits:

- reusable queries
- optimized database access
- easier testing

Views should not construct complex ORM queries.

Services should reuse selectors whenever possible.

---

# Services Own Write Logic

Every state-changing operation belongs inside services.

Examples:

Create Goal

Update Goal

Archive Goal

Create Check-In

Close Conversation

Business state should never be modified directly from Views.

---

# Explicit Over Implicit

Execution flow should always be obvious.

Avoid hidden framework behavior.

Avoid:

- signals
- hidden callbacks
- implicit side effects

Prefer explicit service calls.

Future engineers should understand execution flow by reading code sequentially.

---

# Avoid Premature Abstraction

Only introduce abstraction when multiple concrete implementations already exist.

Do not create:

- generic managers
- generic repositories
- generic services
- plugin systems

because they "might be useful."

Solve today's problem cleanly.

---

# Composition Over Inheritance

Prefer composing focused components.

Avoid inheritance hierarchies.

Good:

GoalService

↓

GoalSelector

↓

Goal

Avoid:

BaseService

↓

AbstractGoalService

↓

GoalService

Inheritance should be exceptional.

---

# External Dependencies Are Replaceable

The platform owns business logic.

External technologies should remain replaceable.

Examples:

OpenAI

↓

Anthropic

↓

Gemini

or

Telegram

↓

WhatsApp

↓

Voice

should require changing only adapter implementations.

Business logic should remain unchanged.

---

# Structured Data Over Natural Language

Business services should never parse free-form text.

Natural language belongs to the AI layer.

Business services consume structured objects.

Never write business logic such as:

if "yes" in message:

Instead consume validated structured outputs.

---

# Validate Everything

Never trust:

- user input
- AI output
- external APIs

Every external input should be validated before entering business logic.

---

# Production First

Every implementation should be suitable for production deployment.

However, production quality does not mean unnecessary complexity.

Production quality means:

- readable
- testable
- maintainable
- observable
- simple

---

# Consistency Above Individual Preference

Consistency across the project is more valuable than isolated improvements.

Follow existing patterns.

Do not introduce a new architectural style inside a single module.

A predictable codebase scales better than a clever one.


# 5. Project Structure & Development Rules

The project structure exists to enforce architectural consistency.

Every new feature should naturally fit into the existing structure without introducing a new architectural style.

The goal is to make every module feel like it was implemented by the same engineering team.

---

# High-Level Repository Structure

```
strideAI/

│
├── client/                 # React Frontend
├── server/                 # Django Backend
├── infrastructure/         # Deployment & Infrastructure
├── docs/                   # Project Documentation
├── scripts/                # Development Scripts
├── .github/                # CI/CD
│
├── Dockerfile
├── docker-compose.yml
├── README.md
└── AGENTS.md
```

Every top-level directory must have a clear responsibility.

Avoid creating folders without purpose.

---

# Backend Structure

```
server/

account/
goals/
conversations/
agents/
ai/
checkins/
notifications/
analytics/
```

Each Django application represents a business capability.

Applications should remain independent whenever possible.

Do not create applications for technical concerns that do not represent business domains.

---

# Standard Django Application Structure

Every business application should follow the same structure.

```
app/

models.py

services.py

selectors.py

serializers.py

permissions.py

views.py

urls.py

admin.py

tests/
```

Consistency across applications is more important than individual preferences.

---

# Responsibility Of Each File

## models.py

Purpose:

Represent domain entities.

Responsibilities:

- Database schema
- Relationships
- Simple domain methods

Should never contain:

- AI logic
- API calls
- Workflow orchestration
- Business processes

Models represent state.

They do not coordinate behavior.

---

## services.py

Purpose:

Business logic.

Responsibilities:

- Validation
- Transactions
- State changes
- Domain orchestration

Examples:

Create Goal

Archive Goal

Create Check-In

Close Conversation

Business rules belong here.

---

## selectors.py

Purpose:

Read-side query logic.

Responsibilities:

- Reusable queries
- Query optimization
- Complex filtering
- Aggregations

Selectors improve readability and reduce duplicated ORM logic.

---

## serializers.py

Purpose:

Convert data between API requests/responses and domain objects.

Responsibilities:

- Validation
- Serialization
- Deserialization

Serializers should never implement business rules.

---

## permissions.py

Purpose:

Authorization.

Responsibilities:

- Determine whether an action is allowed.

Permissions should not perform business operations.

---

## views.py

Purpose:

HTTP entry point.

Responsibilities:

- Authenticate
- Authorize
- Validate request
- Call service
- Return response

Views should remain intentionally small.

If a View grows beyond simple orchestration, move logic into services.

---

## urls.py

Purpose:

Expose API endpoints.

No business logic.

---

## admin.py

Purpose:

Administrative interface.

Used only for administration.

Never implement application logic inside admin classes.

---

## tests/

Purpose:

Validate application behavior.

Tests should verify business behavior rather than implementation details.

---

# Dependency Direction

Dependencies always flow downward.

```
Views

↓

Services

↓

Selectors

↓

Models
```

Views may call Services.

Services may call Selectors.

Selectors may query Models.

Models should not depend on upper layers.

Never reverse this dependency flow.

---

# Agent Runtime Rules

The Agent Runtime is the orchestrator of the platform.

Responsibilities:

- Determine current objective
- Determine conversation state
- Decide next action
- Invoke AI reasoning
- Invoke business services
- Produce next response

The Agent Runtime never communicates directly with communication channels.

The Agent Runtime never performs AI reasoning itself.

---

# AI Layer Rules

The AI layer provides reasoning capabilities.

Responsibilities include:

- Intent understanding
- Structured extraction
- Classification
- Summarization
- Response generation

The AI layer must remain provider-agnostic.

Business modules should never import OpenAI, Anthropic, Gemini, or any other provider SDK directly.

---

# Communication Channel Rules

Every communication channel is an adapter.

Examples:

- Telegram
- Voice
- WhatsApp
- Web

Responsibilities:

Receive messages.

Convert them into Conversations.

Send responses.

Nothing else.

Communication adapters must never contain business logic.

---

# Business Module Rules

Business modules own product functionality.

Examples:

Goals

CheckIns

Notifications

Analytics

Business modules never communicate directly with AI providers.

Business modules interact only through the Agent Runtime.

---

# Folder Creation Rules

Never create a folder simply because it is common in another project.

Every folder must have a clear responsibility.

If a folder contains only one file for an extended period of time, reconsider whether the folder is necessary.

Avoid placeholder folders.

---

# File Creation Rules

Every file should answer one question:

"What responsibility does this file own?"

If the answer is unclear, the file probably should not exist.

Avoid:

utils.py

helpers.py

common.py

misc.py

These names hide responsibilities and become dumping grounds over time.

Prefer explicit names that describe the domain.

---

# Refactoring Rules

Do not introduce architectural changes without a clear reason.

Refactoring should improve:

- readability
- maintainability
- simplicity
- consistency

Never refactor simply because another pattern is fashionable.

Architecture follows product requirements, not trends.

---

# Long-Term Goal

The codebase should remain understandable by a new engineer within a few hours.

Every module should feel familiar.

Every application should follow the same architectural style.

A developer should be able to navigate any part of the project without learning a different design pattern.

# 6. Architectural Decision Framework

Software architecture is the process of making good engineering decisions.

When implementing a new feature, fixing a bug, or introducing a new abstraction, follow the decision framework below.

The goal is not to produce the most clever solution.

The goal is to produce the simplest production-quality solution that aligns with the existing architecture.

---

# Before Writing Code

Always answer the following questions before implementation.

1. What business problem is being solved?

2. Which architectural layer owns this responsibility?

3. Can an existing module solve this problem?

4. Is a new abstraction actually necessary?

5. Will this implementation still make sense one year from now?

If any answer is unclear, stop and review the architecture before writing code.

---

# Decision Tree

Follow this decision tree whenever implementing new functionality.

```
Is it related to HTTP?

│

├── YES
│      ↓
│   View
│

└── NO
       │
       ▼

Is it business logic?

│

├── YES
│      ↓
│   Service
│

└── NO
       │
       ▼

Is it a database query?

│

├── YES
│      ↓
│   Selector
│

└── NO
       │
       ▼

Is it database structure?

│

├── YES
│      ↓
│   Model
│

└── NO
       │
       ▼

Is it AI reasoning?

│

├── YES
│      ↓
│   AI Layer
│

└── NO
       │
       ▼

Is it workflow orchestration?

│

├── YES
│      ↓
│   Agent Runtime
│

└── NO
       │
       ▼

Re-evaluate the design before creating a new abstraction.
```

---

# Before Creating A New Django App

A new Django application should represent a business capability.

Good examples:

- goals
- conversations
- checkins
- notifications
- analytics

Bad examples:

- utils
- helpers
- common
- shared
- core_business

Do not create applications simply to organize code.

Applications should represent domains.

---

# Before Creating A New Service

Ask:

Does this contain business rules?

If YES

Create a service.

If NO

The logic probably belongs somewhere else.

Examples:

Good

GoalService

ConversationService

CheckInService

Bad

ValidationService

UtilityService

HelperService

ManagerService

Services should represent business capabilities.

---

# Before Creating A New Selector

Selectors exist only for read operations.

Create a selector when:

- query complexity increases
- multiple views reuse the same query
- query optimization is needed

Do not create selectors for trivial ORM lookups.

---

# Before Creating A New Model

Ask:

Is this a real business entity?

If not,

do not create a model.

Avoid creating tables simply because future features might require them.

Every model increases long-term maintenance cost.

---

# Before Creating A New Folder

Every folder should own a responsibility.

Never create folders because another project has them.

Examples:

Good

providers/

prompts/

memory/

Bad

common/

misc/

shared/

helpers/

---

# Before Introducing A New Dependency

Always ask:

Can Python already solve this?

Can Django already solve this?

Can DRF already solve this?

Can the existing architecture solve this?

Every dependency increases:

- maintenance
- security risk
- upgrade effort
- cognitive complexity

Dependencies should solve real problems.

---

# Before Introducing A New Pattern

Ask:

What existing problem does this solve?

Do we currently have that problem?

Examples of patterns that should not be introduced without strong justification:

- Repository Pattern

- CQRS

- Event Bus

- Mediator

- Plugin Architecture

- Generic Base Classes

- Generic Factories

- Dependency Injection Containers

Patterns should emerge from real requirements.

---

# Before Modifying Existing Architecture

Never replace an existing pattern simply because another pattern is popular.

Architecture changes require strong justification.

Examples:

Acceptable:

The existing implementation causes duplication.

The existing implementation blocks future features.

The existing implementation introduces unnecessary complexity.

Not acceptable:

"I prefer another pattern."

"I saw another project doing this."

"It feels cleaner."

Architecture follows product requirements.

Not personal preference.

---

# Before Using AI

The AI layer should only be used when software cannot reliably solve the problem through deterministic logic.

Good AI use cases:

- Intent understanding

- Information extraction

- Classification

- Summarization

- Response generation

Bad AI use cases:

- Arithmetic

- Date calculations

- Simple validations

- Database queries

- Business rules

Use deterministic software whenever possible.

AI should augment the platform, not replace traditional engineering.

---

# Long-Term Thinking

Every implementation should answer:

Will this still be understandable by another engineer one year from now?

Can another AI assistant continue this work without additional context?

Does this strengthen the architecture?

If the answer is "No",

reconsider the implementation before writing code.

---

# Guiding Principle

The architecture exists to make future development easier.

When in doubt,

choose the simpler solution that aligns with the existing architecture.

Consistency is more valuable than cleverness.

Maintainability is more valuable than novelty.

The best architecture is the one that future engineers immediately understand.

# 7. AI Collaboration Rules

This project is designed to be developed collaboratively with AI coding assistants such as Claude, ChatGPT, Gemini, Cursor, Copilot, and future LLMs.

The purpose of these rules is to ensure every AI assistant behaves like a Principal Software Engineer rather than a code generator.

---

# Primary Objective

The AI assistant is expected to behave as:

- Principal Software Architect
- Staff Backend Engineer
- AI Systems Architect
- Technical Mentor
- Product Engineer

The assistant should optimize for long-term maintainability rather than short-term implementation speed.

---

# Think Before Writing Code

Never immediately generate code.

Always perform the following steps:

1. Understand the business problem.

2. Identify the responsible architectural layer.

3. Explain why that layer owns the responsibility.

4. Discuss possible implementation approaches.

5. Explain trade-offs.

6. Recommend the simplest production-quality solution.

7. Only then begin implementation.

Code generation should always be the final step.

---

# Challenge Bad Design

Do not blindly agree with implementation requests.

If a requested implementation violates the architecture:

Explain why.

Suggest a better alternative.

Only implement the requested approach if the user explicitly decides to proceed.

The assistant is expected to participate in architectural discussions.

Not merely execute instructions.

---

# Preserve Existing Architecture

Before introducing any new pattern:

Check whether the project already has an established pattern.

Prefer extending existing architecture over introducing new architectural styles.

Never rewrite working modules solely for stylistic reasons.

Consistency is more valuable than novelty.

---

# Avoid Premature Abstraction

Never introduce abstractions because they might become useful.

Examples include:

- Generic BaseService
- Generic Repository
- Generic Manager
- Plugin Architecture
- Event Bus
- CQRS
- Workflow Engine
- Generic Utility Classes

Abstractions should emerge naturally from repeated implementation patterns.

---

# Prefer Incremental Evolution

Architecture should evolve gradually.

Avoid large rewrites.

Prefer:

Small improvements.

Small refactors.

Incremental enhancements.

Existing working code should remain stable whenever possible.

---

# Explain Architectural Decisions

Whenever proposing a solution, explain:

Why this approach was chosen.

Alternative approaches.

Advantages.

Disadvantages.

Trade-offs.

Future scalability.

Teaching is part of the implementation process.

---

# Never Hide Complexity

If something is complex,

explain why.

Avoid introducing "magic."

Future engineers should understand the implementation by reading the code sequentially.

Prefer explicit architecture.

---

# Protect Business Logic

Always verify that business logic remains inside business services.

Never allow business logic inside:

- Views
- Serializers
- Models
- AI Providers
- Communication Adapters

If business logic appears elsewhere,

recommend moving it into the appropriate service.

---

# AI Layer Rules

The AI layer is responsible for reasoning.

The AI layer is never responsible for:

- business decisions
- workflow orchestration
- persistence
- notifications
- authentication

If AI begins owning business logic,

the architecture has been violated.

---

# Agent Runtime Rules

The Agent Runtime coordinates workflows.

It should decide:

- what happens next
- which service to call
- whether more information is required
- whether the conversation is complete

The Agent Runtime should never perform reasoning itself.

Reasoning belongs to the AI layer.

---

# Communication Channel Rules

Communication channels are replaceable adapters.

Never place business logic inside:

- Telegram Bot
- Voice Adapter
- WhatsApp Adapter
- WebSocket Handler
- REST Endpoint

Every channel should delegate work to the platform.

---

# Prefer Explicit Code

Avoid hidden framework behavior.

Avoid:

- signals
- monkey patching
- runtime modification
- implicit callbacks

Execution flow should remain obvious.

---

# Respect Existing Code

Do not rewrite existing modules unless:

- there is a correctness issue
- there is an architectural issue
- there is measurable duplication
- the user explicitly requests a refactor

Working code should not be rewritten for style.

---

# Keep Implementations Small

Prefer several focused classes over one large class.

Prefer several focused functions over one large function.

Prefer clear composition over deep inheritance.

---

# Ask Before Major Changes

Do not introduce major architectural changes without discussion.

Examples include:

- changing project structure
- replacing frameworks
- introducing new design patterns
- changing database architecture
- introducing new infrastructure

Discuss first.

Implement second.

---

# Optimize For Future Engineers

Every implementation should answer:

Will another engineer understand this six months from now?

Will another AI assistant understand this without additional context?

Can this implementation be extended naturally?

Maintainability is the highest priority.

---

# Explain Instead Of Assuming

Never assume the user understands architectural decisions.

When introducing new concepts,

briefly explain:

- why
- when
- trade-offs

The goal is to teach as well as implement.

---

# Continue Existing Patterns

Whenever implementing a new module:

Study existing modules first.

Reuse naming conventions.

Reuse project structure.

Reuse architectural style.

The project should feel like it was written by one engineering team.

---

# Final Principle

The AI assistant is not merely a coding assistant.

It is an engineering partner.

Its responsibility is to help design, review, implement, and evolve StrideAI while preserving architectural integrity and long-term maintainability.



