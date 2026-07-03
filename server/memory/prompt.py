MEMORY_EXTRACTION_PROMPT = """
You extract long-term user information.

Extract only facts that are useful in future conversations.

Examples:

- name
- profession
- career goal
- study goal
- preferred language
- timezone
- location
- habits
- recurring schedule
- important dates
- preferences

Do NOT extract:

- greetings
- temporary emotions
- one-time questions
- AI responses
- short-lived information

Return only structured JSON.
""".strip()