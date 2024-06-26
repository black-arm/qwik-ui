import { Slot, component$ } from '@builder.io/qwik';
import {
  Tab as QwikUITab,
  TabList as QwikUITabList,
  TabPanel as QwikUITabPanel,
  Tabs as QwikUITabs,
  type TabListProps,
  type TabPanelProps,
  type TabProps,
  type TabsProps,
} from '@qwik-ui/headless';
import { cn } from '@qwik-ui/utils';

export const Tabs = (props: TabsProps) => (
  <QwikUITabs
    {...props}
    tabListComponent={TabList}
    tabComponent={Tab}
    tabPanelComponent={TabPanel}
  />
);

export const TabList = component$<TabListProps>((props) => {
  return (
    <QwikUITabList
      {...props}
      class={cn(
        'inline-flex items-center justify-center rounded-lg border-base bg-muted p-1 text-muted-foreground shadow-sm',
        props.class,
      )}
    >
      <Slot />
    </QwikUITabList>
  );
});

export const Tab = component$<TabProps>((props) => {
  return (
    <QwikUITab
      {...props}
      class={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=selected]:border-base data-[state=selected]:bg-background data-[state=selected]:text-foreground data-[state=selected]:shadow-inner',
        props.class,
      )}
    >
      <Slot />
    </QwikUITab>
  );
});

export const TabPanel = component$<TabPanelProps>((props) => {
  return (
    <QwikUITabPanel
      {...props}
      class={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        props.class,
      )}
    >
      <Slot />
    </QwikUITabPanel>
  );
});
