import OpenAI from "openai";
import type { Decorator, Loader } from "@storybook/react";
import { StoryContextForLoaders } from "@storybook/types";

import { TAG } from "./constants";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const createPrompt = (context: StoryContextForLoaders) => `
As StorybookGPT, I specialize in creating arguments for Storybook stories for React components by their type definition.
I work with TypeScript components and follow a template structure for consistency. When a prop is an event handler, like onClick or onSubmit, or any other function, just ignore it.

Here is the type definition for the component:
\`\`\`tsx
interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}
\`\`\`

Generate me args for the Storybook story called "${context.name}". Omit properties that are optional and not required for the particular story. Return the result as a JSON object.
`;

export const withAiArgsLoader: Loader = async (context) => {
  if (context.tags.indexOf(TAG) < 0) {
    return;
  }

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: createPrompt(context) }],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
  });

  const aiArgs = JSON.parse(completion.choices[0].message.content);

  return {
    aiArgs,
  };
};

export const withAiArgsDecorator: Decorator = (StoryFn, context) => {
  const aiArgs = context.loaded?.aiArgs;

  if (aiArgs) {
    return StoryFn({
      args: {
        ...context.args,
        ...aiArgs,
      },
    });
  }

  return StoryFn();
};
