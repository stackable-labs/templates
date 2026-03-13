import { ui, Surface, useStore, useContextData, useCapabilities } from '@stackable-labs/sdk-extension-react'
import { appStore } from '../store'

export function Content() {
  const viewState = useStore(appStore, (s) => s.viewState)
  const { loading } = useContextData()
  const { data, actions } = useCapabilities()

  if (loading) {
    return (
      <Surface id="slot.content">
        <ui.Stack direction="column" gap="2">
          <ui.Skeleton className="h-8 w-48" />
          <ui.Skeleton className="h-24 w-full" />
          <ui.Skeleton className="h-32 w-full" />
        </ui.Stack>
      </Surface>
    )
  }

  const handleFetchExample = async () => {
    const result = await data.fetch('https://jsonplaceholder.typicode.com/todos/1')
    actions.toast({ message: `Fetched with status ${result.status}. The proxy works!`, type: 'success' })
  }

  const handleInvokeExample = async () => {
    await actions.invoke('kitchen.serve', { dish: 'the works', sides: ['toast', 'invoke'] })
    actions.toast({ message: 'Chef fired actions.invoke AND actions.toast in one go. Two capabilities, one click.', type: 'success' })
  }

  return (
    <Surface id="slot.content">
      <ui.Tabs defaultValue="menu">
        <ui.TabsList>
          <ui.TabsTrigger value="menu">Today's Specials</ui.TabsTrigger>
          <ui.TabsTrigger value="details">The Full Spread</ui.TabsTrigger>
          <ui.TabsTrigger value="form">Place Your Order</ui.TabsTrigger>
        </ui.TabsList>

        <ui.TabsContent value="menu">
          <ui.Menu>
            <ui.MenuItem
              icon="shopping-bag"
              label="See What's Cooking"
              description="The full spread — cards, badges, progress bars, alerts... everything but the fridge"
              onClick={() => appStore.set({ viewState: { type: 'details' } })}
            />
            <ui.MenuItem
              icon="message-square"
              label="Ring the Service Bell"
              description="actions.toast + actions.invoke — two capabilities walk into a bar..."
              onClick={handleInvokeExample}
            />
            <ui.MenuItem
              icon="package"
              label="Order Takeout"
              description="data.fetch — send a real HTTP request through the proxy. Yes, to the actual internet."
              onClick={handleFetchExample}
            />
          </ui.Menu>
        </ui.TabsContent>

        <ui.TabsContent value="details">
          <ui.ScrollArea className="h-64">
            <ui.Stack direction="column" gap="3">
              <ui.Card>
                <ui.CardHeader>
                  <ui.Heading level="3">Chef's Tasting Menu</ui.Heading>
                </ui.CardHeader>
                <ui.CardContent>
                  <ui.Stack direction="column" gap="2">
                    <ui.Inline gap="2">
                      <ui.Text className="font-medium">Kitchen Status:</ui.Text>
                      <ui.Badge variant="default">Fully Stocked</ui.Badge>
                    </ui.Inline>
                    <ui.Separator />
                    <ui.Text tone="muted">Every UI component in the SDK, plated and ready to serve. If something's missing, send it back to the kitchen.</ui.Text>
                    <ui.Progress value="100" />
                    <ui.Text className="text-xs" tone="muted">100% of components served (chef counted twice)</ui.Text>
                  </ui.Stack>
                </ui.CardContent>
              </ui.Card>

              <ui.Alert variant="default">
                <ui.Text>Your table is ready. Also, this is an alert component. We're alerting you about that.</ui.Text>
              </ui.Alert>

              <ui.Alert variant="destructive">
                <ui.Text>Fire in the kitchen! (Just kidding. But this destructive alert variant does look serious, doesn't it?)</ui.Text>
              </ui.Alert>

              <ui.Collapsible>
                <ui.CollapsibleTrigger className="text-sm font-medium underline-offset-4 hover:underline">
                  Save room for dessert?
                </ui.CollapsibleTrigger>
                <ui.CollapsibleContent>
                  <ui.Card>
                    <ui.CardContent>
                      <ui.Text tone="muted">
                        Of course there's dessert. This is the kitchen sink — we have everything.
                        You're currently looking at a Card nested inside a Collapsible inside a ScrollArea.
                        That's three layers of component. Like a trifle.
                      </ui.Text>
                    </ui.CardContent>
                  </ui.Card>
                </ui.CollapsibleContent>
              </ui.Collapsible>

              <ui.Inline gap="2">
                <ui.Button variant="outline" onClick={() => appStore.set({ viewState: { type: 'menu' } })}>
                  Back to Specials
                </ui.Button>
                <ui.Button onClick={handleFetchExample}>
                  Another Round
                </ui.Button>
              </ui.Inline>

              <ui.Link href="https://docs.stackablelabs.io">Full Recipe Book (SDK Docs)</ui.Link>
            </ui.Stack>
          </ui.ScrollArea>
        </ui.TabsContent>

        <ui.TabsContent value="form">
          <ui.Stack direction="column" gap="3">
            <ui.Stack direction="column" gap="1">
              <ui.Label htmlFor="name-input">Name for the Reservation</ui.Label>
              <ui.Input id="name-input" placeholder="Chef Extension" />
            </ui.Stack>

            <ui.Stack direction="column" gap="1">
              <ui.Label htmlFor="description">Special Requests</ui.Label>
              <ui.Textarea id="description" placeholder="No substitutions — this kitchen has everything already..." />
            </ui.Stack>

            <ui.Stack direction="column" gap="1">
              <ui.Label>Pick Your Course</ui.Label>
              <ui.Select defaultValue="tasting">
                <ui.SelectOption value="tasting">Tasting Menu (all of them)</ui.SelectOption>
                <ui.SelectOption value="appetizer">Appetizer (just the Cards)</ui.SelectOption>
                <ui.SelectOption value="surprise">Chef's Surprise (Collapsible)</ui.SelectOption>
              </ui.Select>
            </ui.Stack>

            <ui.Inline gap="4">
              <ui.Checkbox id="acknowledge" />
              <ui.Label htmlFor="acknowledge">I understand the chef put everything on this plate</ui.Label>
            </ui.Inline>

            <ui.Inline gap="4">
              <ui.Switch id="second-helpings" />
              <ui.Label htmlFor="second-helpings">Second helpings (there's always room)</ui.Label>
            </ui.Inline>

            <ui.Stack direction="column" gap="1">
              <ui.Label>How was everything?</ui.Label>
              <ui.RadioGroup defaultValue="compliments">
                <ui.RadioGroupItem value="compliments" />
                <ui.Label>Compliments to the chef</ui.Label>
                <ui.RadioGroupItem value="standing-ovation" />
                <ui.Label>Standing ovation</ui.Label>
                <ui.RadioGroupItem value="michelin" />
                <ui.Label>Michelin star material</ui.Label>
              </ui.RadioGroup>
            </ui.Stack>

            <ui.Inline gap="2">
              <ui.Button variant="outline" onClick={() => actions.toast({ message: 'The kitchen never closes. Come back anytime.', type: 'info' })}>
                Ask for the Check
              </ui.Button>
              <ui.Button onClick={() => actions.toast({ message: 'The kitchen sink sends its regards.', type: 'success' })}>
                Send it to the Kitchen
              </ui.Button>
            </ui.Inline>
          </ui.Stack>
        </ui.TabsContent>
      </ui.Tabs>
    </Surface>
  )
}
