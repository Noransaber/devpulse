import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from '@devpulse/ui'

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    src:  { control: 'text' },
    alt:  { control: 'text' },
    initials: { control: 'text' },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=3',
    alt: 'Jane Doe',
    size: 'md',
  },
}

export const WithInitials: Story = {
  args: {
    initials: 'JD',
    alt: 'Jane Doe',
    size: 'md',
  },
}

export const FallbackOnError: Story = {
  name: 'Fallback on broken image',
  args: {
    src: 'https://broken.example/no-image.jpg',
    initials: 'AB',
    alt: 'Alex Brown',
    size: 'md',
  },
}

export const NoImageNoInitials: Story = {
  name: 'Generic icon (no data)',
  args: { size: 'md' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar initials="SM" alt="Small" size="sm" />
      <Avatar initials="MD" alt="Medium" size="md" />
      <Avatar initials="LG" alt="Large" size="lg" />
    </div>
  ),
}

export const TeamRow: Story = {
  name: 'Team row (realistic)',
  render: () => (
    <div className="flex items-center gap-3">
      {[
        { initials: 'JD', alt: 'Jane Doe' },
        { initials: 'AB', alt: 'Alex Brown' },
        { initials: 'MK', alt: 'Maya Kim' },
        { initials: 'RP', alt: 'Raj Patel' },
      ].map((person) => (
        <div key={person.alt} className="flex flex-col items-center gap-1">
          <Avatar initials={person.initials} alt={person.alt} size="md" />
          <span className="text-xs text-gray-400">{person.alt}</span>
        </div>
      ))}
    </div>
  ),
}
