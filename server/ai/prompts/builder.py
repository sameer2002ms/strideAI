from ai.prompts.schema import Prompt, PromptMessage
from ai.schemas import AgentContext


class PromptBuilder:
    """
    Builds provider-independent prompts from an AgentContext.
    """

    @staticmethod
    def build(context: AgentContext) -> Prompt:
        messages = []

        system_prompt = (
            "You are StrideAI, an AI Accountability Coach.\n"
            "Help users stay consistent with their goals."
        )

        if context.memory.facts:
            memory = "\n".join(
                f"- {key}: {value}"
                for key, value in context.memory.facts.items()
            )

            system_prompt += f"\n\nKnown user information:\n{memory}"

        messages.append(
            PromptMessage(
                role="system",
                content=system_prompt,
            )
        )

        messages.extend(
            PromptMessage(
                role=message.role,
                content=message.content,
            )
            for message in context.conversation.messages
        )

        return Prompt(messages=messages)