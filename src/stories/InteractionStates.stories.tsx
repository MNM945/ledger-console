import type {Meta, StoryObj} from '@storybook/react-vite';
import {I18nProvider} from '../i18n';
import {InteractionStates} from '../examples/InteractionStates';

const meta = {
  title:'Components/Interaction states',
  component:InteractionStates,
  decorators:[(Story, context) => <I18nProvider locale={context.parameters.locale === 'zh' ? 'zh' : 'en'}><Story/></I18nProvider>],
  parameters:{layout:'padded',docs:{description:{component:'Primary and secondary buttons expose default, hover, pressed, focus, disabled and loading. Input specimens expose default, hover, focus, filled, error and disabled. Pinned states use the same CSS rules as native interactions. The live form supports validation and the Select supports pointer and keyboard operation. Use the theme toolbar to inspect both modes.'}}},
} satisfies Meta<typeof InteractionStates>;
export default meta;
type Story = StoryObj<typeof meta>;
export const English: Story = {};
export const Chinese: Story = {parameters:{locale:'zh'}};
