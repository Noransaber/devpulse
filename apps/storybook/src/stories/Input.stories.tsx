import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '@devpulse/ui'

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label:       { control: 'text' },
    error:       { control: 'text' },
    placeholder: { control: 'text' },
    disabled:    { control: 'boolean' },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label:       'Repository name',
    placeholder: 'e.g. my-awesome-project',
  },
}

export const WithError: Story = {
  args: {
    label:       'Email address',
    placeholder: 'you@example.com',
    defaultValue: 'not-an-email',
    error:       'Please enter a valid email address.',
  },
}

export const Disabled: Story = {
  args: {
    label:        'API key',
    defaultValue: 'sk-••••••••••••••••••••••••',
    disabled:     true,
  },
}

export const LoginForm: Story = {
  name: 'Login form (realistic)',
  render: () => (
    <form
      className="flex flex-col gap-4 w-80"
      onSubmit={(e) => e.preventDefault()}
    >
      <Input
        label="Email"
        type="email"
        placeholder="you@company.com"
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
      />
      <Input
        label="Team slug"
        placeholder="acme-corp"
        error="That slug is already taken."
      />
    </form>
  ),
}
