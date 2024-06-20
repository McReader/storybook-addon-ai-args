import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button";

export default {
  title: "Example/Button",
  component: Button,
  argTypes: {
    backgroundColor: { control: "color" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  tags: ["ai-args"],
};

export const RedBackground: Story = {};

export const VeryLongLabel: Story = {};

export const SmallSize: Story = {};
